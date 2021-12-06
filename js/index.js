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


/* ----------------------------------------- */
/*             FUNCIONES GLOBALES            */
/* ----------------------------------------- */

/* FUNCIÓN RENDER LISTA */
function renderLista() {
    console.log('Render Lista');

    let ul = document.createElement('ul');
    ul.classList.add('demo-list-icon', 'mdl-list', 'w-100');
    console.log(ul);

    ul.innerHTML = '';

    listaProductos.forEach((prod, index) => {

        console.log(prod, index);

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
                    <input class="mdl-textfield__input" type="text" id="cantidad-${index}" value="${prod.cantidad}">
                    <label class="mdl-textfield__label" for="cantidad-${index}">Cantidad</label>
                </div>
            </span>

            <!-- Precio del producto -->
            <span class="mdl-list__item-primary-content w-20 ml-item">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="precio-${index}" value="${prod.precio}">
                    <label class="mdl-textfield__label" for="precio-${index}">Precio($)</label>
                </div>
            </span>

            <!-- Acción (Borrar producto) -->
            <span class="mdl-list__item-primary-content w-20">
                <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
                    <i class="material-icons">remove_shopping_cart</i>
                </button>
            </span>

        </li>`
        
    })

    document.getElementById('lista').appendChild(ul);
}

/* ----------------------------------------- */
/*                  LISTENERS                */
/* ----------------------------------------- */

function configurarListeners() {
    console.log('Configurar Listeners')
}


/* ----------------------------------------- */
/*             FUNCIONES INICIO              */
/* ----------------------------------------- */

function start() {
    console.log('Super Lista');

    configurarListeners();
    renderLista();
}

/* ----------------------------------------- */
/*                  EJECUCIÓN                */
/* ----------------------------------------- */

start();