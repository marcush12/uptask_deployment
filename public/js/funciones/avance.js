import Swal from 'sweetalert2';

export const actualizarAvance = () => {
  // selecionar as tarefas existentes 
  const tareas = document.querySelectorAll('li.tarea');
  if(tareas.length) {
    // selecionar as tarefas completadas 
    const tareasCompletas = document.querySelectorAll('i.completo');

    // calcular o progresso
    const avance = Math.round((tareasCompletas.length / tareas.length)*100);

    // mostrar o progresso
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance+'%';

    if(avance === 100) {
      Swal.fire(
        'Projeto Completo!',
        'Parabéns, você concluiu as tarefas.',
        'success'
      )
    }
  }

}