// El Service Worker contiene eventos.
// No recomendable, tener funciones, si listeners (eventos) - Constantes para trabajar
// Cómo hago referencia a esos listeners del Service Worker, con una palabra reservada que es: SELF
// Parecido al this de los objetos.

const CACHE_STATIC_NAME = 'static-v02'
const CACHE_INMUTABLE_NAME = 'inmutable-v02'
const CACHE_DYNAMIC_NAME = 'dynamic-v02'

self.addEventListener('install', e => {
    console.log('sw install!')
    // console.log('install', e)

    //const cache1 = caches.open('cache-1').then( cache => {
        //console.log(cache)
    
    // cacheStatic
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then( cache => {
        console.log(cache)

        // Guardar todos los recursos estáticos (Sin número de versión) para que nuestra app funcione offline
        // --> Estos recurso se llaman recurso de la APP SHELL

        return cache.addAll([
            '/',
            '/index.html',
            '/css/styles.css',
            '/js/index.js',
            '/js/api.js',
            '/plantilla-lista.hbs',
            '/images/supermarket.jpg'
        ])
    })

    // cacheInmutable
    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then( cache => {
        console.log(cache)

        // Guardo todos los recursos estáticos (con número de versión) para que nuestra web ap funcione offline
        // --> Estos recurso se llaman recurso de la APP SHELL
        return cache.addAll([
            '/js/handlebars.min-v4.7.7.js',
            'https://code.getmdl.io/1.3.0/material.purple-yellow.min.css',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://code.jquery.com/jquery-3.6.0.min.js'
        ])

    })

    // waitUntil: espera a que todas las operaciones asincrónicas terminen
    //e.waitUntil(cache1)

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable] ))

})

self.addEventListener('activate', e => {
    console.log('sw activate')
    // console.log('activate', e)

    const cacheWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_DYNAMIC_NAME
    ]

    // Borro todos los caches que no esten en la lista actual (version actual)

    e.waitUntil(
        caches.keys().then( keys => {
            //console.log(keys)
            return Promise.all(
                keys.map( key => {
                    //console.log(key)
                    if(!cacheWhiteList.includes(key)) {
                        return caches.delete(key)
                    }
                })
            )
        })
    )

})

self.addEventListener('fetch', e => {
    console.log('sw fetch!!')
    // console.log('fetch', e)


    let { url, method } = e.request // destructuring Object
    
    if(method === 'GET' && !url.includes('mockapi.io')) {
        const respuesta = caches.match(e.request).then( res => {

            if(res) {
                // console.log('EXISTE: el recuro en la cache', e.request.url)
                return res
            }
            // console.log('NO EXISTE: el recuro no existe en la cache', e.request.url)
    
            return fetch(e.request).then( nuevaRespuesta => {
                caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                    cache.put(e.request, nuevaRespuesta)
                })
                return nuevaRespuesta.clone()
            })
        })
    
        e.respondWith(respuesta)
    } else {
        console.warn('BYPASS', method, url)
    }

    

})