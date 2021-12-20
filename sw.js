// El Service Worker contiene eventos.
// No recomendable, tener funciones, si listeners (eventos) - Constantes para trabajar
// Cómo hago referencia a esos listeners del Service Worker, con una palabra reservada que es: SELF
// Parecido al this de los objetos.

self.addEventListener('install', e => {
    console.log('sw install!')
    // console.log('install', e)
})

self.addEventListener('activate', e => {
    console.log('sw activate')
    // console.log('activate', e)
})

self.addEventListener('fetch', e => {
    console.log('sw fetch!!')
    //console.log('fetch', e.request.url);

    //console.log(e.request)

    /* let url = e.request.url
    let method = e.request.method */

    //let { url: link, method: metodo } = e.request; // Destructuración, objetos // atributo: alias
    let { url, method } = e.request; // Destructuración, objetos
    
    console.log({method, url})
    //console.log(e.request)

    // console.log(url.includes('styles.css')) // true/false
    //console.log(url.includes('https://code.getmdl.io/1.3.0/material.purple-yellow.min.css'))
    //console.log(url.includes('supermarket.jpg'))
    console.log(url.includes('index.js'))

    if(url.includes('styles.css')) {
        // let respuesta = null
        // https://developer.mozilla.org/es/docs/Web/API/Response
        let respuesta = new Response(`
            .w-10 { width: 10%; }
            .w-20 { width: 20%; }
            .w-30 { width: 30%; }
            .w-40 { width: 40%; }
            .w-50 { width: 50%; }
            .w-60 { width: 60%; }
            .w-70 { width: 70%; }
            .w-80 { width: 80%; }
            .w-90 { width: 90%; }
            .w-100 { width: 100%; }

            .ml-item {
                margin-left: 20px;
            }

            .contenedor {
                align-items: center;
                display: flex;
                justify-content: space-around;
                padding: 20px;
            }

            .mdl-layout {
                min-width: 360px;
            }

            img {
                width: 100%;
                max-width: 900px;
            }

            body {
                background-color: lightblue;
            }    
        `, { headers: {'content-type': 'text/css'} })
        // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types

        e.respondWith(respuesta)
    }
    else if(url.includes('https://code.getmdl.io/1.3.0/material.purple-yellow.min.css')) {
        // let respuesta = null
        let respuesta = fetch('https://code.getmdl.io/1.3.0/material.green-orange.min.css')
        e.respondWith(respuesta)
    }
    else if(url.includes('supermarket.jpg')) {
        console.log('Me di cuenta de que estás pidiendo el hero del sitio')
        // let respuesta = null
        // let respuesta = fetch('images/supermarket-rotada.jpg')
        let respuesta = fetch(
            'https://fullstylishmall.com/wp-content/uploads/2021/02/supermarket-8.jpg',
            { mode: 'no-cors'}
        )
        .catch(error => console.error('ERROR EN FETCH DE IMÁGEN', error))

        e.respondWith(respuesta)
    }
    else if(url.includes('index.js')) {
        console.log('Me di cuenta de que estás pidiendo el código principal del sitio')
        // let respuesta = null
        //let respuesta = fetch('js/index.js')
        let respuesta = fetch('https://uncreated-reviews.000webhostapp.com/main.js',
                        { mode: 'no-cors' }
                        )
                        .catch(error => console.log('ERROR en FETCH DE CÓDIGO', error))

        e.respondWith(respuesta)
    }

    else {
        /* let respuesta = fetch(e.request.url)
        let respuesta = fetch(e.request) */
        let respuesta = fetch(url)
        e.respondWith(respuesta)
    }




})