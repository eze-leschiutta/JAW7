console.log(document.querySelector('title').textContent);

/* ----------------------------------------- */
/*             VARIABLES GLOBALES            */
/* ----------------------------------------- */

let listaProductos = [/* 
    { nombre: 'Carne', cantidad: 2, precio: 12.34 },
    { nombre: 'Pan', cantidad: 3, precio: 34.56 },
    { nombre: 'Fideos', cantidad: 4, precio: 56.78 },
    { nombre: 'Leche', cantidad: 5, precio: 78.90 },
 */]

/* ----------------------------------------- */
/*              LOCAL STORAGE                */
/* ----------------------------------------- */

function guardarListaProductos(lista) {
    let prods = JSON.stringify(lista)
    localStorage.setItem('lista', prods)
}

function leerListaProductos() {
    let lista = []
    let prods = localStorage.getItem('lista')
    if(prods) {

        try {
            lista = JSON.parse(prods)
            console.log('try', lista)
        } catch (error) {
            lista = []
            guardarListaProductos(lista)
            console.log('catch', lista)
        } 
    }
    return lista
}

/* ----------------------------------------- */
/*             FUNCIONES GLOBALES            */
/* ----------------------------------------- */

/* Borrar Producto */
async function borrarProd(id) {
    console.log('borrarProd', id)
    
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    //listaProductos.splice(index, 1) 
    await apiProd.del(id)

    renderLista()
}

async function cambiarValor(tipo, id, el) {

    let index = listaProductos.findIndex(prod => prod.id == id)
    let valor = tipo == 'precio' ? Number(el.value) : parseInt(el.value)
    console.log('cambioValor', tipo, index, valor)

    listaProductos[index][tipo] = valor

    let prod = listaProductos[index]
    await apiProd.put(prod, id)
}

/* FUNCIÓN RENDER LISTA */
async function renderLista() {
    console.log('Render Lista');

    try {
               /* ------------- Petición plantilla con jquery ajax ---------- */        
        let plantilla = await $.ajax({url: 'plantilla-lista.hbs'})

        /* ------------ compilar la plantilla ------------ */
        let template = Handlebars.compile(plantilla)

        /* ------------ Obtengo la lista de productos del servidor remoto ---------- */
        listaProductos = await apiProd.get()

        /* ------------ Guardamos la lista de productos actual en el localStorage (persisto en el navegador) */
        guardarListaProductos(listaProductos)

        /* ------------ ejecutar la plantilla compilada ---------- */
        let html = template({listaProductos})

        //document.querySelector('#lista').innerHTML = html
        $('#lista').html(html)

        // let ul = document.querySelector('#contenedor-lista')
        let ul = $('#contenedor-lista')

        componentHandler.upgradeElements(ul);

    } catch (error) {
        console.error('Error', error)
    }
    
}

/* ----------------------------------------- */
/*                  LISTENERS                */
/* ----------------------------------------- */

function configurarListeners() {
    console.log('Configurar Listeners');

    /* Ingreso del producto nuevo */

    document.getElementById('btn-entrada-producto').addEventListener('click', async () => {
        console.log('btn-entrada-producto');

        //let input = document.getElementById('ingreso-producto');
        let input = $('#ingreso-producto');

        //let nombre = input.value;
        let nombre = input.val();

        console.log(nombre);
        
        if(nombre) {
            let producto = { nombre: nombre, cantidad: 1, precio: 0}
            // listaProductos.push({ nombre: producto, cantidad: 1, precio: 0});
            await apiProd.post(producto)
            renderLista()
            //input.value = null
            input.val(null)
        }
    })

    /* Borrado total de productos */
    document.getElementById('btn-borrar-productos').addEventListener('click', () => {
        console.log('btn-borrar-productos');

        if(listaProductos.length) {
            let dialog = $('dialog')[0]
            console.log(dialog)
            dialog.showModal()
        }
    })
}

/* ----------------------------------------- */
/*                 TEST CACHE                */
/* ----------------------------------------- */

function testCache() {

    if ( window.caches ) {
        console.log("El Browser soporta Caches")

        /* Creo espacio de cache (OPEN) */

        caches.open('prueba-1')
        caches.open('prueba-2')
        //caches.open('prueba-3')
        caches.open('prueba-4')

        /* Comprobamos si una cache existe (HAS) */

        caches.has('prueba-2').then(respuesta => console.log("prueba-2: ", respuesta))
        caches.has('prueba-3').then(console.log)
        //caches.has('prueba-3').then(alert)

        /* Borrar una cache (DELETE) */
        caches.delete('prueba-1')

        /* Listo todos los caches (KEYS) */
        caches.keys().then(console.log)

        /* Abrir una cache y trabajar con ella */

        caches.open('cache-v1.1').then( cache => {
            console.log(cache)
            console.log(caches)

            /* Agrego un recurso a la cache (ADD) */
            // cache.add('./index.html')
            // cache.add('./js/index.js')

            /* Agrego varios recursos a la cache (addAll) */

            cache.addAll([
                './index.html',
                './css/styles.css',
                './images/supermarket.jpg',
                './js/index.js'
            ]).then(() => {
                console.log('Recursos agregados')

                /* Borro un recurso de la cache (DELETE) */
                cache.delete('./css/styles.css').then(console.log) // Si no veo el archivo borrado. REFRESH CACHES en el navegador

                /* Verifico que el recurso existe en la cache (MATCH) */
                cache.match('./css/styles.css').then( respuesta => {
                    if(respuesta) {
                        console.log('Recurso encontrado')
                    } else {
                        console.error('Recurso inexistente')
                    }
                })

                /* Creo o modifico el contenido de un recurso (PUT) */
                cache.put('./index.html', new Response('Hola Mundo!'))

                /* Listar todos los recursos de esta cache */

                cache.keys().then(recursos => console.log('Recursos de cache', recursos))
                cache.keys().then(recursos => {
                    recursos.forEach( recurso => {
                        console.log(recurso.url)
                    })
                })

            }).catch(error => {
                console.error('No se encontró el recurso', error)
            })


            /* Listo todos los nombre de los espacios de CACHE que contienen caches */

            caches.keys().then( nombres => {
                console.log('Nombres de caches: ', nombres)
            })
            
        })



    } else {
        console.warn('El Browser No soporta Caches')
    }
   

}


/* ------------------------------------------------- */
/*             REGISTRAR SERVICE WORKER              */
/* ------------------------------------------------- */
function registrarServiceWorker() {
    //console.log('serviceWorker' in navigator); // true o false // Si el navegador no tiene serviceWorker me va a dar false
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            this.navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('El service worker se registró correctamente', reg)


                    reg.onupdatefound = () => {
                        const installingWorker = reg.installing
                        installingWorker.onstatechange = () => {
                            console.log('SW! -----> ', installingWorker.state)
                            if(installingWorker.state === 'activated') {
                                console.log('reinciando en 5 segundos')
                                // location.reload()
                                
                                // Esto del setTimeout no es necesario. Refresco la página 
                                setTimeout(() => {
                                    console.log('Ok!')
                                    location.reload()
                                }, 5000) 
                            }
                        }
                    }

                })
                .catch(err => {
                    console.warn('Error al registar el service worker', err)
                })
        })
    } else {
        console.error('serviceWorker no está disponible en navigator')
    }
}

/* ----------------------------------------- */
/*                   MODAL                   */
/* ----------------------------------------- */

function iniDialog() {
    let dialog = $('dialog')[0]
    if(!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
    }

    $('dialog .aceptar').click( async () => {
        // listaProductos = []

        await apiProd.deleteAll()

        renderLista()
        dialog.close()
    })

    $('dialog .cancelar').click( () => {
        dialog.close()
    })
}


/* ----------------------------------------- */
/*             FUNCIONES INICIO              */
/* ----------------------------------------- */

function start() {
    console.log('Super Lista')

    registrarServiceWorker()
    configurarListeners()
    iniDialog()

    // testCache()

    renderLista();
}

/* ----------------------------------------- */
/*                  EJECUCIÓN                */
/* ----------------------------------------- */

// start()
// window.onload = start
$(document).ready(start)
