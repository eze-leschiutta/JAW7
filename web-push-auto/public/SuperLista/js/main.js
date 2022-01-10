/* ------------------------------------------------------------- */
/*                    VARIABLES GLOBALES                         */
/* ------------------------------------------------------------- */
let listaProductos = [/* 
    { nombre: 'Carne',  cantidad: 2,    precio: 12.34 },
    { nombre: 'Pan',    cantidad: 3,    precio: 34.56 },
    { nombre: 'Fideos', cantidad: 4,    precio: 56.78 },
    { nombre: 'Leche',  cantidad: 5,    precio: 78.90 },
 */]

/* ------------------------------------------------------------- */
/*                    FUNCIONES GLOBALES                         */
/* ------------------------------------------------------------- */

/* -------------- MANEJO DEL LOCALSTORAGE --------------- */
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
        }
        catch {
            lista = []
            guardarListaProductos(lista)
        }
    }
    return lista
}
// --------------------------------------------------

async function borrarProd(id) {
    console.log('borrarProd',id)
    //https://www.w3schools.com/jsref/jsref_splice.asp
    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    
    //listaProductos.splice(index,1)
    await apiProd.del(id)
    renderLista()
}

async function cambiarValor(tipo, id, el) {
    //let precio = parseFloat(el.value)

    let index = listaProductos.findIndex(prod => prod.id == id)
    let valor = tipo=='precio'? Number(el.value) : parseInt(el.value)
    console.log('cambiarValor', tipo, index, valor)

    listaProductos[index][tipo] = valor

    let prod = listaProductos[index]
    await apiProd.put(prod,id)
}

async function renderLista() {

    try {
        /* --------- petición plantilla con fetch ---------- */
        /* let datos = await fetch('plantilla-lista.hbs')
        if(!datos.ok) throw datos.status
        let plantilla = await datos.text() */

        /* --------- petición plantilla con Jquery ajax ---------- */
        let plantilla = await $.ajax({url: 'plantilla-lista.hbs'})

        // compile the template
        var template = Handlebars.compile(plantilla);
        
        //Obtengo la lista de productos del servidor remoto
        listaProductos = await apiProd.get()

        //Guardamos la lista de productos actual en el localstorage (persisto en navegador)
        guardarListaProductos(listaProductos)

        // execute the compiled template and print the output to the console
        //var html = template({listaProductos : listaProductos});    
        var html = template({listaProductos});    
        
        $('#lista').html(html)

        let ul = $('#contenedor-lista')
        componentHandler.upgradeElements(ul)
    }
    catch(error) {
        console.error('Error', error)
    }
}

function configurarListeners() {
    /* Ingreso del producto nuevo */
    $('#btn-entrada-producto').click( async () => {
        console.log('btn-entrada-producto')

        let input = $('#ingreso-producto')
        let nombre = input.val()
        console.log(nombre)

        if(nombre) {
            let producto = { nombre: nombre, cantidad: 1, precio: 0 }
            //listaProductos.push( producto )
            await apiProd.post(producto)
            renderLista()
            input.val(null)
        }
    })

    /* Borrado total de productos */
    $('#btn-borrar-productos').click( () => {
        console.log('btn-borrar-productos')

        if(listaProductos.length) {
            var dialog = $('dialog')[0];
            //console.log(dialog)
            dialog.showModal();
        }
    })
}

function iniDialog() {
    var dialog = $('dialog')[0];
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    
    $('dialog .aceptar').click( async () => {
        //listaProductos = []
        dialog.close();

        await apiProd.deleteAll()
        renderLista()

    });

    $('dialog .cancelar').click( () => {
        dialog.close();
    });
}


function registrarServiceWorker() {
    if('serviceWorker' in navigator) {
        //window.addEventListener('load', () => {
            this.navigator.serviceWorker.register('/sw.js')
            .then( reg => {
                //console.log('El service worker se registró correctamente', reg)

                notificaciones.initialiseUI(reg)
                
                //Pedimos permiso al sistema operativo para permitir ventanas de notificación emergentes
                Notification.requestPermission(function(result) {
                    if (result === 'granted') {
                        navigator.serviceWorker.ready.then(function(registration) {
                            console.log(registration)
                        });
                    }
                });

                //skip waiting automático
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing
                    installingWorker.onstatechange = () => {
                        console.log('SW ---> ', installingWorker.state)
                        if(installingWorker.state == 'activated') {
                            console.log('reinicio en 2 segundos ...')
                            setTimeout(() => {
                                console.log('OK!')
                                location.reload()
                            },2000)
                        }
                    }
                }
            })
            .catch( err => {
                console.error('Error al registrar el service worker', err)
            })
        //})
    }
    else {
        console.error('serviceWorker no está disponible en navigator')
    }
}

function handleBarsTestXMLHttpResquest() {
    
    let xhr = new XMLHttpRequest
    xhr.open('get','plantilla-prueba.hbs')
    xhr.addEventListener('load', () => {
        if(xhr.status == 200) {
            let plantilla = xhr.response
            //console.log(plantilla)

            // compile the template
            var template = Handlebars.compile(plantilla);
            // execute the compiled template and print the output to the console
            var html = template({
                firstname: "Yehuda",
                lastname: "Katz",
            });    
            
            $('#lista').html(html)
        }
    })
    xhr.send()
}

function handleBarsTestFetchThenCatch() {
    
    fetch('plantilla-prueba.hbs')
    .then( datos => {
        //console.log(datos)
        if(!datos.ok) throw datos.status
        return datos.text()
    })
    .then( plantilla => {
        //console.log(plantilla)

        // compile the template
        var template = Handlebars.compile(plantilla);
        // execute the compiled template and print the output to the console
        var html = template({
            firstname: "Yehuda",
            lastname: "Katz",
        });    
        
        $('#lista').html(html)
    })
    .catch(error => console.error('Error', error))
}

async function handleBarsTestFetchAsyncAwait() {
    
    try {
        let datos = await fetch('plantilla-prueba.hbs')
        if(!datos.ok) throw datos.status
        let plantilla = await datos.text()

        // compile the template
        var template = Handlebars.compile(plantilla);
        // execute the compiled template and print the output to the console
        var html = template({
            firstname: "Yehuda",
            lastname: "Katz",
        });    
        
        $('#lista').html(html)
    }
    catch(error) {
        console.error('Error', error)
    }
}

function testCache() {
    /* https://caniuse.com/ */
    /* https://caniuse.com/?search=caches */

    if(window.caches) {
        console.log('El Browser soporta Caches')

        /* Creo espacios de cache */
        caches.open('prueba-1')
        caches.open('prueba-2')
        caches.open('prueba-3')

        /* Comprobamos si un cache existe */
        caches.has('prueba-2').then(rta => console.log(rta))
        //caches.has('prueba-3').then(rta => console.log(rta))
        //caches.has('prueba-3').then(alert)
        caches.has('prueba-3').then(console.log)

        /* Borrar un cache */
        caches.delete('prueba-1').then(console.log)

        /* Listo todos los caches */
        caches.keys().then(console.log)

        /* Abro un cache y trabajo con el */
        caches.open('cache-v1.1').then( cache => {
            console.log(cache)
            console.log(caches)

            /* Agrego un recurso al cache */
            //cache.add('./index.html')

            /* Agrego varios recursos al cache */
            cache.addAll([
                './index.html',
                './css/estilos.css',
                './images/super.jpg'
            ]).then( () => {
                console.log('Recursos agregados')

                /* Borro un recurso del cache */
                cache.delete('/css/estilos.css').then(console.log)

                //cache.match('/index.html').then( res => {
                cache.match('/css/estilos.css').then( res => {
                    if(res) {
                        console.log('Recurso encontrado')
                        /* Accedo al contenido del recurso */
                        res.text().then(console.log)
                    }
                    else {
                        console.error('Recurso inexistente')
                    }
                })

                /* Creo o modifico el contenido de un recurso */
                cache.put('/index.html', new Response('Hola mundo!'))

                /* Listo todos los RECURSOS que contiene este cache */
                cache.keys().then( recursos => console.log('Recursos de cache', recursos))
                cache.keys().then( recursos => {
                    recursos.forEach( recurso => {
                        console.log(recurso.url)
                    })
                })

                /* Listo todos los NOMBRES DE LOS ESPACIOS DE CACHE que contiene caches */
                caches.keys().then( nombres => {
                    console.log('Nombres de caches:', nombres)
                })
            })
        })
    }
    else {
        console.warn('El Browser NO soporta Caches')
    }
}


function start() {
    //console.log('Super Lista!!!!')

    registrarServiceWorker()
    configurarListeners()
    iniDialog()

    //handleBarsTestXMLHttpResquest()
    //handleBarsTestFetchThenCatch()
    //handleBarsTestFetchAsyncAwait()

    //testCache()

    renderLista()
}

/* ------------------------------------------------------------- */
/*                          EJECUCIÓN                            */
/* ------------------------------------------------------------- */
//start()
//window.onload = start
$(document).ready(start)