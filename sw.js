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
    // console.log('fetch', e)
})