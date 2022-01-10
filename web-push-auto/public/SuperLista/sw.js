const CACHE_STATIC_NAME = 'static-v05'
const CACHE_INMUTABLE_NAME = 'inmutable-v05'
const CACHE_DYNAMIC_NAME = 'dynamic-v05'

const CON_CACHE = false

self.addEventListener('install', e => {
    console.log('sw install')

    //skip waiting automático
    self.skipWaiting()

    //const cache = caches.open('cache-1').then( cache => {
    const cacheStatic = caches.open(CACHE_STATIC_NAME).then( cache => {
        console.log(cache)

        // Guardo todos los recursos estáticos (sin número de versión) para que nuestra web app funcione offline
        // --> esos recursos se llaman recursos de la APP SHELL
        return cache.addAll([
            '/index.html',
            '/css/estilos.css',
            '/js/main.js',
            '/js/api.js',
            '/plantilla-lista.hbs',
            '/images/super.jpg'
        ])
    })

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then( cache => {
        console.log(cache)

        // Guardo todos los recursos estáticos (con número de versión) para que nuestra web app funcione offline
        // --> esos recursos se llaman recursos de la APP SHELL
        return cache.addAll([
            '/js/handlebars.min-v4.7.7.js',
            'https://code.getmdl.io/1.3.0/material.min.js',
            'https://code.jquery.com/jquery-3.6.0.min.js',
            'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css'
        ])
    })

    //Con waitUntil espero a que todas las operaciones asincrónicas culminen
    //e.waitUntil(cache)

    //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise#m%C3%A9todos
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]))
})

self.addEventListener('activate', e => {
    console.log('sw activate')

    const cacheWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_DYNAMIC_NAME
    ]

    //Borrar todos los caches que no esten en la lista actual (versión actual)
    e.waitUntil(
        caches.keys().then(keys =>  {
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
    //console.log('sw fetch')
    if(CON_CACHE) {
        let { url, method } = e.request //destructuring Object 

        if(method == 'GET' && !url.includes('mockapi.io')) {
            //console.log(method,url)

            const respuesta = caches.match(e.request).then( res => {
                if(res) {
                    console.log('EXISTE: el recurso existe en el cache',url)
                    return res
                }
                console.error('NO EXISTE: el recurso no existe en el cache',url)

                return fetch(e.request).then( nuevaRespuesta => {
                    caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                        cache.put(e.request, nuevaRespuesta)
                    })
                    return nuevaRespuesta.clone()
                })
            })
            
            e.respondWith(respuesta)
        }
        else {
            console.warn('BYPASS', method, url)
        }
    }
})

self.addEventListener('push', e => {
    //console.log('push',e)

    let mensaje = e.data.text()
    console.log(mensaje)

    //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    const title = 'Super Lista'
    const options = {
        body: `Mensaje: ${mensaje}`,
        icon: 'images/icons/icon-72x72.png',
        badge: 'https://licores.ninja/wp-content/uploads/2018/04/cropped-ninja-n-02.png'
    }

    e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
    console.log('Click en notificación push', e)

    e.notification.close()

    e.waitUntil(clients.openWindow('https://www.instagram.com/'))
})