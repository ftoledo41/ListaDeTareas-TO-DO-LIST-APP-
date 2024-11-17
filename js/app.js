// LISTA DE TAREAS

// 224. Agregar tareas
// Funcion para agregar una tarea a la lista (El elemento li al ul)
function addTaskToList(task) {
  // creamos el elemento li
  const list = document.createElement("li");

  // creamos un elemento div dentro del elemento li para estilizar
  const divContainer = document.createElement("div");

  // creamos el boton de edicion
  const editButton = document.createElement("button");
  // añadimos un icono y texto al boton
  editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i> Editar";
  // añadimos una clase al boton
  editButton.classList.add("editar");

  // creamos el boton eliminar
  const deleteButton = document.createElement("button");
  // añadimos icono y texto al boton
  deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i> Eliminar";
  // añadimos una clase al boton
  deleteButton.classList.add("eliminar");

  // Crear lista de verificacion (checkbox)
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("completado");

  // Insertamos los elementos creados en el elemento div contenedor
  divContainer.appendChild(editButton);
  divContainer.appendChild(deleteButton);
  divContainer.appendChild(checkbox);

  // Creamos el elemento span para mostrar la tarea
  const taskSpan = document.createElement("span");
  taskSpan.textContent = task;

  // Agremamos el elemento span al div contenedor
  divContainer.appendChild(taskSpan);

  // Agregar div a la lista
  list.appendChild(divContainer);

  // Agregamos el li al elemento ul
  document.querySelector("#lista-tareas").appendChild(list);
}

//funcion que se llama al presionar el boton "Agregar tarea"
document.querySelector("#formulario").addEventListener("submit", (e) => {
  // Para prevenir comportamiento predeterminado de envio del formulario
  e.preventDefault();

  // Obtenemos el valor ingresado en el elmento input de tarea
  const task = document.querySelector("#tarea").value;

  // Si se ingreso algo, agregamos la tarea y limpiamos el input
  if (task) {
    addTaskToList(task);
    document.querySelector("#tarea").value = "";
  }
});

// 225. Editar / eliminar tareas
// Funcion que se llama cuando pusamos sobre editar o eleminar
document.querySelector("#lista-tareas").addEventListener("click", (e) => {
  // Verificamos si se presiono el boton de editar
  if (e.target.classList.contains("editar")) {
    // Seleccionamos el div elemento padre de la ventana modal para editar
    const editModal = document.querySelector("#edicionModal");
    // Seleccionamos el input dentro del elemento padre
    const editTaskInput = document.querySelector("#editar-tarea");

    // Seleccionamos el li que contiene al boton editar
    // Primer parentNode selecciona el div y el segundo el li
    const list = e.target.parentNode.parentNode;

    // Seleccionamos el span
    const taskSpan = list.querySelector("span");

    // funcion para abrir la ventana modal para editar
    function openEditModal() {
      editModal.style.display = "block";
      editTaskInput.value = taskSpan.textContent;
    }

    // llamamos a la funcion anterior para que abra la ventana modal
    openEditModal();

    // Funcion para guardar la tarea editar
    function saveEditedTask() {
      // optenemos el valor ingresado
      const editedTask = editTaskInput.value;

      // nos aseguramos de que el contenido ingresado sea valido
      if (editedTask && editedTask.trim() !== "") {
        taskSpan.textContent = editedTask;
        editModal.style.display = "none";
      }
    }

    // Para ejecutar la funcion anterior al presionar el boton guardar de la ventana modal de edicion
    document
      .querySelector("#guardarEdicion")
      .addEventListener("click", saveEditedTask);

    // Funcion para cancelar la edicion o cerrar la la venta
    document.querySelector("#cancelarEdicion").addEventListener("click", () => {
      editModal.style.display = "none";
    });
  }

  // Verificamos si se presiono el boton de eliminar
  if (e.target.classList.contains("eliminar")) {
    const deleteModal = document.querySelector("#eliminarModal");

    // optenemos el li del elemento padre
    const list = e.target.parentNode.parentNode;

    // mostrar la ventan modal de eliminacion
    deleteModal.style.display = "block";

    // evento para confirmar la eliminacion
    document
      .querySelector("#confirmarEliminar")
      .addEventListener("click", () => {
        list.parentNode.removeChild(list);
        deleteModal.style.display = "none";
      });

    // evento para cerrar la ventana de eliminacion
    document
      .querySelector("#cancelarEliminar")
      .addEventListener("click", () => {
        deleteModal.style.display = "none";
      });
  }
});

// 226. Tarea completada
// FUNCION QUE DEJA UNA TAREA COMO COMPLETADA
document.querySelector("#lista-tareas").addEventListener("change", (e) => {

  // Verificar checkbox
  if (e.target.classList.contains("completado")) {
    const taskSpan = e.target.nextElementSibling;
    if (e.target.checked) {
      taskSpan.style.textDecoration = "line-through solid #00f";
    } else {
      taskSpan.style.textDecoration = "none";
    }
  }
});

// funcion para mostrar mensaje "Tarea completada" por 5 segundos
function showCompleteMessage() {
  const completeTask = document.querySelector(".tareaCompletada");
  completeTask.innerHTML = "<p><i class='fa-solid fa-check'></i> Tarea Completada</p>";

  // mostrar el snackbar/toast
  completeTask.classList.add("show")

  // ocultar snackbar/toats luego de 5 segundos
  setTimeout(() => {
    completeTask.classList.remove("show");
  }, 5000);
}

//Evento para mostrar mensaje "tarea completada"
document.querySelector("#lista-tareas").addEventListener("change", (e) => {
  if (e.target.classList.contains("completado") && (e.target.checked)) {
    showCompleteMessage();
  }
});

// 227. Almacenar tareas en el localStorage
// funcion para guardar tareas en el localstorage
function saveTaskListToLocalStorage() {
  const tasklist = document.querySelectorAll("#lista-tareas li");

  // Arreglo para almacenar la tareas
  const taskArray = [];

  // Reccorer la lista de tareas y agregar cada tarea en el arreglo
  tasklist.forEach((item) => {

    const task = item.querySelector("span").textContent;
    const isCompleted = item.querySelector(".completado").checked;
    taskArray.push({tarea: task, estado: isCompleted})

  })

  // guardar el arreglo de tareas en el localstorage como JSON
  localStorage.setItem("task", JSON.stringify(taskArray));
}

// obtener la lista de tareas del localstorage al cargar la pagina
window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("task");

  if (savedTasks) {
    // Convertimos la lista de tareas guardadas en un arreglo
    const taskArray = JSON.parse(savedTasks);

    // recorrer el arreglo y agregar cada tarea a la lista
    taskArray.forEach((task) => {
      addTaskToList(task.tarea);

      // obtenemos los elementos de la lista de tareas
      const taskListItem = document.querySelectorAll("#lista-tareas li");

      // recorrer cada elemento de la lista
      taskListItem.forEach((listItem) => {

        const taskSpan = listItem.querySelector("span");
        const taskText = taskSpan.textContent;

        // Verificar si el texto de la tarea coincide con la tarea guardada
        if (task.tarea === taskText) {
          listItem.querySelector(".completado").checked = task.estado;

          if (task.estado) {
            taskSpan.style.textDecoration = "line-through";
          }
        }
      });
    })
  }
});

// Agregar evento change en las lista de verificacion para actuliazar el localstorage
document.querySelector("#lista-tareas").addEventListener("change", (e) => {
  saveTaskListToLocalStorage();
});

// guardar lista de tareas en el localstorage al salir de la pagina
window.addEventListener("beforeunload", saveTaskListToLocalStorage);




// ERRORES
// PENDIENTE: BORRA TODAS LAS TAREAS AL BORRAR SOLO UNA