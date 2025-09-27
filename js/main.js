const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const listaTareas = document.getElementById('listaTareas');

const modalConfirmacion = document.getElementById('modalConfirmacion');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

const modalEdicion = document.getElementById('modalEdicion');
const inputEditarTarea = document.getElementById('inputEditarTarea');
const btnGuardarEdicion = document.getElementById('btnGuardarEdicion');

const barraCarga = document.getElementById('barraCarga'); 

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let indiceTareaAEditar = null;
let indiceTareaAEliminar = null;


function mostrarBarraCarga() {
    barraCarga.style.width = '0%';
    barraCarga.classList.add('visible');
    let progreso = 0;
    const intervalo = setInterval(() => {
        progreso += 10;
        if (progreso <= 90) {
            barraCarga.style.width = `${progreso}%`;
        } else {
            clearInterval(intervalo);
        }
    }, 50); 
}


function ocultarBarraCarga() {
    barraCarga.style.width = '100%';
    barraCarga.classList.add('completa');
    setTimeout(() => {
        barraCarga.classList.remove('visible', 'completa');
        barraCarga.style.width = '0%';
    }, 300); 
}

function renderizarTareas() {
    listaTareas.innerHTML = '';
    tareas.forEach((tarea, indice) => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200';
        li.innerHTML = `
            <span class="text-gray-700 ${tarea.completada ? 'line-through text-gray-500' : ''}">${tarea.texto}</span>
            <div>
                <button onclick="marcarCompletada(${indice})"
                        class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors mr-2 text-sm">
                    ${tarea.completada ? 'Deshacer' : 'Completar'}
                </button>
                <button onclick="abrirModalEdicion(${indice})"
                        class="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors mr-2 text-sm">
                    Editar
                </button>
                <button onclick="abrirModalConfirmacionEliminar(${indice})"
                        class="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors text-sm">
                    Eliminar
                </button>
            </div>
        `;
        listaTareas.appendChild(li);
    });
}

function guardarTareasConCarga() {
    mostrarBarraCarga();
    setTimeout(() => { 
        localStorage.setItem('tareas', JSON.stringify(tareas));
        ocultarBarraCarga();
    }, 500); 
}

function agregarTarea() {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea) {
        tareas.push({ texto: textoTarea, completada: false });
        inputTarea.value = '';
        guardarTareasConCarga();
        renderizarTareas();
    }
}

function abrirModalEdicion(indice) {
    indiceTareaAEditar = indice;
    inputEditarTarea.value = tareas[indice].texto;
    modalEdicion.classList.remove('hidden');
}

function guardarEdicion() {
    if (indiceTareaAEditar !== null) {
        const nuevoTexto = inputEditarTarea.value.trim();
        if (nuevoTexto) {
            tareas[indiceTareaAEditar].texto = nuevoTexto;
            guardarTareasConCarga();
            renderizarTareas();
            cerrarModalEdicion();
        } else {
            alert('El campo de edición no puede estar vacío.'); 
        }
    }
}

function cerrarModalEdicion() {
    modalEdicion.classList.add('hidden');
    indiceTareaAEditar = null;
}

function abrirModalConfirmacionEliminar(indice) {
    indiceTareaAEliminar = indice;
    modalConfirmacion.classList.remove('hidden');
}

function confirmarEliminar() {
    if (indiceTareaAEliminar !== null) {
        tareas.splice(indiceTareaAEliminar, 1);
        guardarTareasConCarga();
        renderizarTareas();
        cerrarModalConfirmacion();
    }
}

function cerrarModalConfirmacion() {
    modalConfirmacion.classList.add('hidden');
    indiceTareaAEliminar = null;
}

function marcarCompletada(indice) {
    tareas[indice].completada = !tareas[indice].completada;
    guardarTareasConCarga();
    renderizarTareas();
}

btnAgregar.addEventListener('click', agregarTarea);
inputTarea.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregarTarea();
    }
});

btnGuardarEdicion.addEventListener('click', guardarEdicion);
btnConfirmarEliminar.addEventListener('click', confirmarEliminar);

renderizarTareas(); 
