console.log(document.querySelector('title').textContent);

/* ----------------------------------------- */
/*             VARIABLES GLOBALES            */
/* ----------------------------------------- */

let listaProductos = [
    { nombre: 'Carne', cantidad: 2, precio: 12.34 },
    { nombre: 'Pan', cantidad: 3, precio: 34.56 },
    { nombre: 'Fideos', cantidad: 4, precio: 56.78 },
    { nombre: 'Leche', cantidad: 5, precio: 78.90 }
]

let crearLista = true;
let ul;

/* ----------------------------------------- */
/*             FUNCIONES GLOBALES            */
/* ----------------------------------------- */

/* Borrar Producto */
function borrarProd(index) {
    console.log('borrarProd', index);
    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    listaProductos.splice(index, 1);
    renderLista();
}


/* Cambiar Cantidad */
function cambiarCantidad(index, el) {
    let cantidad = parseInt(el.value);
    console.log('cambiarCantidad', index, cantidad);

    listaProductos[index].cantidad = cantidad;
}

/* Cambiar Precio */
function cambiarPrecio(index, el) {
    let precio = Number(el.value);
    console.log('cambiarPrecio', index, precio);

    listaProductos[index].precio = precio;
}


/* FUNCIÓN RENDER LISTA */
function renderLista() {
    console.log('Render Lista');

    if(crearLista) {
        ul = document.createElement('ul');
        ul.classList.add('demo-list-icon', 'mdl-list', 'w-100');
    }

    ul.innerHTML = '';

    listaProductos.forEach((prod, index) => {
  
        ul.innerHTML += `
        
        <li class="mdl-list__item">

            <!-- Icono del producto -->
            <span class="mdl-list__item-primary-content">
                <i class="material-icons mdl-list__item-icon">shopping_cart</i>
            </span>

            <!-- Nombre del producto -->
            <span class="mdl-list__item-primary-content w-30">
                ${prod.nombre}
            </span>

            <!-- Cantidad del producto -->
            <span class="mdl-list__item-primary-content w-20">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input onchange="cambiarCantidad(${index}, this)" class="mdl-textfield__input" type="text" id="cantidad-${index}" value="${prod.cantidad}">
                    <label class="mdl-textfield__label" for="cantidad-${index}">Cantidad</label>
                </div>
            </span>

            <!-- Precio del producto -->
            <span class="mdl-list__item-primary-content w-20 ml-item">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input onchange="cambiarPrecio(${index}, this)" class="mdl-textfield__input" type="text" id="precio-${index}" value="${prod.precio}">
                    <label class="mdl-textfield__label" for="precio-${index}">Precio($)</label>
                </div>
            </span>

            <!-- Acción (Borrar producto) -->
            <span class="mdl-list__item-primary-content w-20">
                <button onclick="borrarProd(${index})" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                    <i class="material-icons">remove_shopping_cart</i>
                </button>
            </span>
        </li>`
    })

    if(crearLista) {
        document.getElementById('lista').appendChild(ul);
    } else {
        componentHandler.upgradeElements(ul);
    }

    crearLista = false;

}

/* ----------------------------------------- */
/*                  LISTENERS                */
/* ----------------------------------------- */

function configurarListeners() {
    console.log('Configurar Listeners');

    /* Ingreso del producto nuevo */

    document.getElementById('btn-entrada-producto').addEventListener('click', () => {
        console.log('btn-entrada-producto');

        let input = document.getElementById('ingreso-producto');
        let producto = input.value;
        console.log(producto);
        
        if(producto) {
            listaProductos.push({ nombre: producto, cantidad: 1, precio: 0});
            renderLista();
            input.value = null;
        }
    })

    /* Ingreso del producto nuevo */
    document.getElementById('btn-borrar-productos').addEventListener('click', () => {
        console.log('btn-borrar-productos');

        if(confirm('¿Desea borrar todos los productos?')) {
            listaProductos = [];
            renderLista();
        }
    })
}

/* ------------------------------------------------- */
/*             REGISTRAR SERVICE WORKER              */
/* ------------------------------------------------- */
function registrarServiceWorker() {
    console.log('serviceWorker' in navigator); // true o false // Si el navegador no tiene serviceWorker me va a dar false
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            this.navigator.serviceWorker.register('./sw.js')
                .then(reg => {
                    console.log('El service worker se registró correctamente', reg)
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
/*             FUNCIONES INICIO              */
/* ----------------------------------------- */

function start() {
    console.log('Super Lista');

    registrarServiceWorker()
    configurarListeners();
    renderLista();
}

/* ----------------------------------------- */
/*                  EJECUCIÓN                */
/* ----------------------------------------- */

start();