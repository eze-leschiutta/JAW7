const apiProd = (function() {

    function getURL(id) {
        //return 'https://615d8b5212571a00172076ba.mockapi.io/productos/' + (id?id:'')
        return 'https://615d8b5212571a00172076ba.mockapi.io/productos/' + (id || '')
    }

    /* GET */
    async function get() {

        try {
            let prods = await $.ajax({url: getURL()})
            return prods
        } catch (error) {
            console.error('Error get', error)
            let prods = leerListaProductos()
            console.log(prods)
            return prods
        }
    }
    
    /* POST */
    async function post(prod) {

        try {
            return await $.ajax({url: getURL(), method: 'post', data: prod})
        } catch (error) {
            console.error('Error post', error)
            return {}
        }
    }

    /* PUT */
    async function put(prod, id) {
        try {
            return await $.ajax({url: getURL(id), method: 'put', data: prod })
        } catch (error) {
            console.error('Error put', error)
            return {}
        }
    }

    /* DELETE */
    async function del(id) {

        try {
            return await $.ajax({url: getURL(id), method: 'delete'})
        } catch (error) {
            console.error('Error delete', error)
            return {}
        }
    }


    /* DELETE ALL */
    async function deleteAll() {
        let progress = document.querySelector('progress')
        progress.style.display = 'block'
        
        let porcentaje = 0

        for (let i = 0; i < listaProductos.length; i++) {
            
            porcentaje = parseInt((i * 100) / listaProductos.length) // 0 ... 100%
            console.log(porcentaje)
            progress.value = porcentaje
            //progress.val(porcentaje)

            let id = listaProductos[i].id

            await del(id)
        }

        // terminó el borrado total

        porcentaje = 100
        console.log(porcentaje)
        //progress.val(porcentaje)
        progress.value = porcentaje

        setTimeout(() => {
            progress.style.display = 'none'
        }, 1000)

    }


    return {
        get: () => get(),
        post: producto => post(producto),
        put: (producto, id) => put(producto, id),
        del: id => del(id),
        deleteAll: () => deleteAll()
    }

})()