// Cargar el archivo JSON con los datos de los jugadores
let jugadores = [];

// Función para cargar los datos desde el archivo JSON
function cargarDatos() {
    fetch('datos_jugadores.json')
        .then(response => response.json())
        .then(data => {
            jugadores = data;
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

// Normalizar el texto para hacer comparaciones sin importar tildes ni mayúsculas
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Función para realizar la búsqueda de jugadores por nombre
function buscarJugadores(nombre) {
    // Normalizar el nombre de búsqueda
    const nombreNormalizado = normalizarTexto(nombre);
    
    // Filtrar los jugadores cuyo nombre coincida (sin importar mayúsculas y tildes)
    return jugadores.filter(jugador => {
        return normalizarTexto(jugador[2]).includes(nombreNormalizado); // Columna 2 es "Jugador"
    });
}

// Función para mostrar los resultados en la tabla
function mostrarResultados(resultados) {
    const tbody = document.querySelector("#playersTable tbody");
    tbody.innerHTML = '';  // Limpiar la tabla antes de mostrar nuevos resultados

    if (resultados.length > 0) {
        resultados.forEach(jugador => {
            const row = document.createElement("tr");

            jugador.slice(1, 12).forEach(campo => {
                const td = document.createElement("td");
                td.textContent = campo;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    } else {
        const row = document.createElement("tr");
        const td = document.createElement("td");
        td.setAttribute("colspan", 11);
        td.textContent = "No se encontraron resultados";
        td.style.textAlign = "center";
        row.appendChild(td);
        tbody.appendChild(row);
    }
}

// Función para manejar la búsqueda al presionar el botón o al presionar Enter
function realizarBusqueda() {
    const terminoBusqueda = document.getElementById("searchInput").value;
    if (terminoBusqueda.trim() === "") {
        alert("Por favor ingrese un nombre para buscar.");
        return;
    }

    const resultados = buscarJugadores(terminoBusqueda);
    mostrarResultados(resultados);
}

// Agregar eventos
document.getElementById("searchButton").addEventListener("click", realizarBusqueda);
document.getElementById("searchInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        realizarBusqueda();
    }
});

// Cargar los datos al cargar la página
window.onload = cargarDatos;
