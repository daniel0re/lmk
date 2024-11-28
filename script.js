// Cargar los datos del archivo JSON
async function loadData() {
  try {
      const response = await fetch('datos_jugadores.json');
      const data = await response.json(); // Obtener los datos en formato JSON
      return data;
  } catch (error) {
      console.error('Error al cargar el archivo JSON:', error);
      return [];
  }
}

// Función para normalizar el texto (quitar acentos y convertir a minúsculas)
function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Función para resaltar las coincidencias
function highlightMatch(text, term) {
  const regex = new RegExp(`(${term})`, 'gi'); // Crear una expresión regular para buscar el término (sin importar mayúsculas/minúsculas)
  return text.replace(regex, '<span class="highlight">$1</span>'); // Reemplazar las coincidencias por un <span> con clase "highlight"
}

// Función para manejar la búsqueda
function searchPlayers(data) {
  const searchTerm = searchInput.value.toLowerCase(); // Obtener el término de búsqueda (en minúsculas)
  
  // Filtrar los jugadores cuyo nombre coincida con el término de búsqueda
  const filteredData = data.filter(player => normalizarTexto(player[2]).includes(searchTerm));
  
  // Limpiar la tabla antes de mostrar los nuevos resultados
  tableBody.innerHTML = '';
  
  // Verificar si la pantalla es pequeña (menos de 768px de ancho)
  const isSmallScreen = window.innerWidth < 768;
  
  // Iterar sobre los jugadores filtrados y añadirlos a la tabla
  filteredData.forEach(player => {
      const row = document.createElement('tr'); // Crear una nueva fila de tabla
      
      // Iterar sobre los datos del jugador y añadir cada celda
      player.slice(1, 12).forEach((cell, index) => {
          // Omitir las columnas "Entrenamientos", "Club", y "Préstamo" si la pantalla es pequeña
          if (isSmallScreen && (index === 0 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9)) {
              return; // No añadir estas celdas a la fila
          }
          
          const td = document.createElement('td'); // Crear una nueva celda de tabla
          td.innerHTML = highlightMatch(cell, searchTerm); // Resaltar las coincidencias en cada celda
          row.appendChild(td); // Añadir la celda a la fila
      });
      
      // Añadir la fila a la tabla
      tableBody.appendChild(row);
  });
  
  // Si no hay resultados, mostrar un mensaje
  if (filteredData.length === 0) {
      const row = document.createElement('tr');
      const td = document.createElement('td');
      td.setAttribute('colspan', '11'); // Establecer que esta celda ocupa todas las columnas
      td.textContent = 'No se encontraron resultados';
      td.style.textAlign = 'center';
      row.appendChild(td);
      tableBody.appendChild(row);
  }
}

// Obtener elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const tableBody = document.getElementById('tableBody');

// Cargar los datos y agregar la funcionalidad de búsqueda
loadData().then(data => {
  // Añadir el evento para que la búsqueda se realice al presionar Enter
  searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          searchPlayers(data); // Ejecutar la búsqueda al presionar Enter
      }
  });

  // Añadir el evento para que la búsqueda se realice al presionar el botón de Buscar
  searchButton.addEventListener('click', () => {
      searchPlayers(data); // Ejecutar la búsqueda al hacer clic en el botón
  });
});
