import { obtenerFichas } from './FichaADSO.JS';
import { obtenerAprendices } from './AprendicesFicha.js';

let fichasData = null;
let aprendicesData = null;

const selectFicha = document.getElementById('selectFicha');
const selectAprendiz = document.getElementById('selectAprendiz');
const inputNombres = document.getElementById('nombres');
const inputApellidos = document.getElementById('apellidos');
const inputEstado = document.getElementById('estado');
const inputPrograma = document.getElementById('inputPrograma');
const totalEvaluados = document.getElementById('totalEvaluados');
const totalPorEvaluar = document.getElementById('totalPorEvaluar');
const tablaJuicios = document.getElementById('tablaJuicios');
const usuarioSpan = document.getElementById('usuarioNombre');
const btnSalir = document.getElementById('btnSalir');

window.addEventListener('DOMContentLoaded', async () => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        alert('Debe primero ingresar con un usuario y contraseña');
        window.location.href = 'index.html';
        return;
    }
    usuarioSpan.textContent = usuario;

    fichasData = await obtenerFichas();
    cargarFichas();
});

function cargarFichas() {
    selectFicha.innerHTML = '<option value="">SELECCIONE</option>';
    fichasData.fichas.forEach(ficha => {
        const option = document.createElement('option');
        option.value = ficha.url;
        option.textContent = ficha.codigo;
        selectFicha.appendChild(option);
    });
}

selectFicha.addEventListener('change', async (e) => {
    const url = e.target.value;
    if (url) {
        aprendicesData = await obtenerAprendices(url);
        cargarAprendices();
        inputPrograma.value = aprendicesData[0]?.PROGRAMA || '';
    } else {
        selectAprendiz.innerHTML = '<option value="">Seleccione primero una ficha</option>';
        limpiarDatos();
    }
});

function cargarAprendices() {
    selectAprendiz.innerHTML = '<option value="">Seleccione un aprendiz</option>';
    
    const documentosUnicos = new Map();
    aprendicesData.forEach(aprendiz => {
        if (!documentosUnicos.has(aprendiz['Número de Documento'])) {
            documentosUnicos.set(aprendiz['Número de Documento'], aprendiz);
        }
    });
    
    documentosUnicos.forEach((aprendiz, numDoc) => {
        const option = document.createElement('option');
        option.value = numDoc;
        option.textContent = numDoc;
        selectAprendiz.appendChild(option);
    });
}

selectAprendiz.addEventListener('change', (e) => {
    const numDoc = e.target.value;
    if (numDoc !== '') {
        const aprendiz = aprendicesData.find(a => a['Número de Documento'] == numDoc);
        if (aprendiz) {
            mostrarDatosAprendiz(aprendiz);
        }
    } else {
        limpiarDatos();
    }
});

function mostrarDatosAprendiz(aprendiz) {
    inputNombres.value = aprendiz.Nombre;
    inputApellidos.value = aprendiz.Apellidos;
    inputEstado.value = aprendiz.Estado;

    let evaluados = 0;
    let porEvaluar = 0;

    tablaJuicios.innerHTML = '';

    aprendiz.competencias.forEach(competencia => {
        competencia.resultados.forEach(resultado => {
            if (resultado['Juicio de Evaluación'] === 'APROBADO') {
                evaluados++;
            } else if (resultado['Juicio de Evaluación'] === 'POR EVALUAR') {
                porEvaluar++;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${competencia.competencia}</td>
                <td>${resultado.resultado}</td>
                <td>${resultado['Juicio de Evaluación']}</td>
                <td>${resultado['Fecha y Hora'] || ''}</td>
                <td>${resultado['Funcionario que registró el juicio evaluativo'] || ''}</td>
            `;
            tablaJuicios.appendChild(tr);
        });
    });

    totalEvaluados.textContent = evaluados;
    totalPorEvaluar.textContent = porEvaluar;
}

function limpiarDatos() {
    inputNombres.value = '';
    inputApellidos.value = '';
    inputEstado.value = '';
    inputPrograma.value = '';
    totalEvaluados.textContent = '0';
    totalPorEvaluar.textContent = '0';
    tablaJuicios.innerHTML = '';
}

btnSalir.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
});
