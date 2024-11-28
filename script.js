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
  return text.replace(regex, '<span class="highlight">$1</span>'); // Resaltar las coincidencias
}

// Función para manejar la búsqueda y paginación
let currentPage = 1;
const resultsPerPage = 10; // Número de jugadores por página
let allData = [];

// Función para renderizar la tabla
function renderTable(data) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = ''; // Limpiar tabla antes de mostrar nuevos resultados

  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, data.length);

  // Verificar si la pantalla es pequeña (menos de 768px de ancho)
  const isSmallScreen = window.innerWidth < 768;

  // Iterar sobre los jugadores filtrados y añadirlos a la tabla
  data.slice(startIndex, endIndex).forEach(player => {
      const row = document.createElement('tr');
      
      // Iterar sobre los datos del jugador y añadir cada celda
      player.slice(1, 12).forEach((cell, index) => {
          const td = document.createElement('td');
          
          // Si estamos en una pantalla pequeña, omitir ciertas columnas
          if (isSmallScreen && (index === 2 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9)) {
              return; // No añadir estas celdas a la fila
          }
          
          td.innerHTML = highlightMatch(cell, searchInput.value); // Resaltar las coincidencias
          row.appendChild(td); // Añadir la celda a la fila
      });

      tableBody.appendChild(row);
  });
}


function searchPlayers(data) {
  const searchTerm = searchInput.value.toLowerCase(); // Obtener el término de búsqueda

  // Normalizamos el término de búsqueda
  const normalizedSearchTerm = normalizarTexto(searchTerm);

  // Filtrar los jugadores cuyo nombre coincida con el término de búsqueda
  const filteredData = data.filter(player => {
      const normalizedName = normalizarTexto(player[2]); // El nombre del jugador está en la posición 2
      return normalizedName.includes(normalizedSearchTerm);
  });

  renderTable(filteredData);

  // Actualizar el número de página y habilitar/deshabilitar botones de paginación
  const totalPages = Math.ceil(filteredData.length / resultsPerPage);
  updatePagination(totalPages);
}

// Función para actualizar la paginación
function updatePagination(totalPages) {
  const pageNumber = document.getElementById('pageNumber');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');

  pageNumber.textContent = `Página ${currentPage} de ${totalPages}`;

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

// Función para cambiar de página
function changePage(direction) {
  const totalPages = Math.ceil(allData.length / resultsPerPage);
  if (direction === 'next' && currentPage < totalPages) {
      currentPage++;
  } else if (direction === 'prev' && currentPage > 1) {
      currentPage--;
  }

  renderTable(allData);
  updatePagination(totalPages);
}

// Obtener elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Cargar los datos y agregar la funcionalidad de búsqueda
loadData().then(data => {
  allData = data; // Guardar los datos completos

  // Renderizar la tabla inicialmente con todos los jugadores
  renderTable(allData);
  updatePagination(Math.ceil(allData.length / resultsPerPage));

  // Añadir el evento para que la búsqueda se realice al presionar Enter
  searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          searchPlayers(allData); // Ejecutar la búsqueda al presionar Enter
      }
  });

  // Añadir el evento para que la búsqueda se realice al presionar el botón de Buscar
  searchButton.addEventListener('click', () => {
      searchPlayers(allData); // Ejecutar la búsqueda al hacer clic en el botón
  });

  // Añadir los eventos para cambiar de página
  document.getElementById('prevPage').addEventListener('click', () => {
      changePage('prev');
  });

  document.getElementById('nextPage').addEventListener('click', () => {
      changePage('next');
  });
});
