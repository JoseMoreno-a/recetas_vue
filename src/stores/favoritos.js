import { ref, watch, onMounted, computed } from 'vue'
import { defineStore } from 'pinia'
import { useBebidasStore } from './bebidas'
import { useModalStore } from './modal'
import { useNotificacionStore } from './notificaciones'

export const useFavoritosStore = defineStore('favoritos', () => {

    const modal = useModalStore()
    const bebidas = useBebidasStore()
    const notificiones = useNotificacionStore()
    const favoritos = ref([])

    onMounted(() => {
        favoritos.value = JSON.parse(localStorage.getItem('favoritos')) ?? []
    })

    watch(favoritos, () => {
        sincronizarLocalStorage()
    },{
        deep: true
    })

    function sincronizarLocalStorage() {
        localStorage.setItem('favoritos', JSON.stringify(favoritos.value))
    }

    function existeFavorito() {
        const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos')) ?? []
        return favoritosLocalStorage.some(favorito => favorito.idDrink === bebidas.receta.idDrink)
    }

    function eliminarFavorito() {
        favoritos.value = favoritos.value.filter( favorito => favorito.idDrink !== bebidas.receta.idDrink)

        notificiones.mostrar = true
        notificiones.texto = 'Eliminado de Favoritos'

        // setTimeout(() => {
        //     notificiones.$reset()
        // }, 3000);
    }

    function agregarFavorito () {
        favoritos.value.push(bebidas.receta) 

        notificiones.mostrar = true
        notificiones.texto = 'Se agregó a favoritos'

        // setTimeout(() => {
        //     notificiones.$reset()
        // }, 3000);
    }
    function handleClickFavorito() {
        if(existeFavorito()) {
            eliminarFavorito() 
        } else {
            agregarFavorito() 
        }
        modal.modal = false
    }

    const noHayFavoritos = computed(() => {
        return favoritos.value.length === 0
    })

    return{
        favoritos,
        handleClickFavorito,
        existeFavorito,
        noHayFavoritos
    }
})