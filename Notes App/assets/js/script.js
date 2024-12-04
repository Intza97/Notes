const addBox = document.querySelector(".add-box"), // Selecciona el elemento con la clase "add-box"
  popupBox = document.querySelector(".popup-box"), // Selecciona el elemento con la clase "popup-box"
  popupTitle = popupBox.querySelector("header p"), // Selecciona el párrafo dentro del encabezado del popup
  closeIcon = popupBox.querySelector("header i"), // Selecciona el ícono dentro del encabezado del popup
  titleTag = popupBox.querySelector("input"), // Selecciona el campo de entrada del título
  descTag = popupBox.querySelector("textarea"), // Selecciona el área de texto para la descripción
  addBtn = popupBox.querySelector("button"); // Selecciona el botón del popup

// Array con los nombres de los meses
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
  "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Recupera las notas desde el localStorage o inicializa un arreglo vacío
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// Banderas y variable ID para actualizaciones de notas
let isUpdate = false, updateId;

// Abre el cuadro emergente para añadir una nueva nota
addBox.addEventListener("click", () => {
  popupTitle.innerText = "Añadir una nueva nota";
  addBtn.innerText = "Añadir nota";
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden"; // Desactiva el scroll de la página
  if (window.innerWidth > 660) titleTag.focus(); // Enfoca el campo del título si el ancho es mayor a 660px
});

// Cierra el cuadro emergente y restablece los campos
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = descTag.value = ""; // Limpia los campos
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto"; // Reactiva el scroll de la página
});

// Muestra las notas existentes del localStorage
function showNotes() {
  if (!notes) return;
  document.querySelectorAll(".note").forEach(li => li.remove()); // Elimina todas las notas actuales
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll("\n", '<br/>'); // Reemplaza saltos de línea por etiquetas <br/>
    let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Editar</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Eliminar</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
    addBox.insertAdjacentHTML("afterend", liTag); // Inserta la nota después de la caja para añadir
  });
}
showNotes(); // Llama a la función para mostrar las notas

// Muestra las opciones del menú para cada nota
function showMenu(elem) {
  elem.parentElement.classList.add("show"); // Muestra el menú
  document.addEventListener("click", e => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show"); // Oculta el menú si se hace clic fuera
    }
  });
}

// Elimina una nota específica
function deleteNote(noteId) {
  let confirmDel = confirm("¿Estás seguro de que deseas eliminar esta nota?");
  if (!confirmDel) return;
  notes.splice(noteId, 1); // Elimina la nota del arreglo
  localStorage.setItem("notes", JSON.stringify(notes)); // Actualiza el localStorage
  showNotes(); // Vuelve a mostrar las notas
}

// Actualiza una nota específica
function updateNote(noteId, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n'); // Reconvierte los <br/> a saltos de línea
  updateId = noteId;
  isUpdate = true;
  addBox.click(); // Abre el popup
  titleTag.value = title; // Llena el campo del título
  descTag.value = description; // Llena el campo de descripción
  popupTitle.innerText = "Actualizar una nota";
  addBtn.innerText = "Actualizar nota";
}

// Añade o actualiza una nota al hacer clic en el botón
addBtn.addEventListener("click", e => {
  e.preventDefault();
  let title = titleTag.value.trim(), // Elimina espacios extra del título
    description = descTag.value.trim(); // Elimina espacios extra de la descripción
  if (title || description) {
    let currentDate = new Date(),
      month = months[currentDate.getMonth()],
      day = currentDate.getDate(),
      year = currentDate.getFullYear();
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo); // Añade una nueva nota
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo; // Actualiza la nota existente
    }
    localStorage.setItem("notes", JSON.stringify(notes)); // Guarda las notas en el localStorage
    showNotes(); // Actualiza la lista de notas
    closeIcon.click(); // Cierra el popup
  }
});
