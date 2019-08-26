import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
  tareas.addEventListener('click', e => {
    if (e.target.classList.contains('fa-check-circle')) {
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;

      // fazer request para /tareas/:id
      const url = `${location.origin}/tareas/${idTarea}`;

      axios.patch(url, { idTarea }).then(function(respuesta) {
        if (respuesta.status === 200) {
          icono.classList.toggle('completo');
          actualizarAvance();
        }
      });
    }

    if (e.target.classList.contains('fa-trash')) {
      const tareaHTML = e.target.parentElement.parentElement,
        idTarea = tareaHTML.dataset.tarea;

      Swal.fire({
        title: 'Tem certeza disso?',
        text: 'Esta ação não poderá ser revertida!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, elimina logo!',
        cancelButtonText: 'Não, cancelar.'
      }).then(result => {
        if (result.value) {
          const url = `${location.origin}/tareas/${idTarea}`;
          
          // enviar o delete através de axios
          axios.delete(url, {query: {idTarea}})
            .then(function(respuesta) {
              if(respuesta.status === 200) {
                //console.log(respuesta);
                // eliminar o node ou eliminar do DOM 
                tareaHTML.parentElement.removeChild(tareaHTML);

                // alerta opcional
                Swal.fire(
                  'Tarefa eliminada',
                  respuesta.data,
                  'success'
                )
                actualizarAvance();
              }
            })
        }
      });
    }
  });
}

export default tareas;
