import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
  btnEliminar.addEventListener('click', e => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    //console.log(urlProyecto); dataset = data-proyecto-url, proyectoUrl = proyecto-url

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
        //enviar pedido a axios; location.origin = http://localhost:3000
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        axios
          .delete(url, { params: { urlProyecto } })
          .then(function(respuesta) {
            console.log(respuesta);

            Swal.fire(
              'Projeto Eliminado!',
              respuesta.data,
              'success'
            );

            // redirecionar ao início
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          })
          .catch(() => {
            Swal.fire({
              type: 'error',
              title: 'Houve um erro',
              text: 'Não foi possível eliminar o projeto'
            })
          })
      }
    });
  });
}
export default btnEliminar;
