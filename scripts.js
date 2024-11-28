document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search');
  const tableBody = document.querySelector('#result-table tbody');

  // Variable para almacenar los datos de jugadores
  let data = [];

  // Función para normalizar y quitar tildes y caracteres especiales
  function normalizeText(text) {
    // Eliminar acentos, eñes y convertir a minúsculas
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Función para cargar datos desde el archivo JSON
  async function loadData() {
    try {
      const response = await fetch('datos_jugadores.json'); // Cargar el archivo JSON
      data = await response.json(); // Parsear la respuesta JSON
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      alert('Hubo un error al cargar los datos.');
    }
  }

  // Llamamos a la función para cargar los datos
  loadData();

  // Función de búsqueda
  function searchPlayers() {
    const searchTerm = normalizeText(searchInput.value); // Normalizar el término de búsqueda
    const filteredData = data.filter(player => normalizeText(player[2]).includes(searchTerm)); // Normalizar los nombres de los jugadores
    
    tableBody.innerHTML = ''; // Limpiar la tabla antes de mostrar los resultados
    filteredData.forEach(player => {
      const row = document.createElement('tr');
      player.slice(1, 12).forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        row.appendChild(td);
      });
      tableBody.appendChild(row);
    });

    // Si no se encontraron jugadores
    if (filteredData.length === 0) {
      const row = document.createElement('tr');
      const td = document.createElement('td');
      td.setAttribute('colspan', '11');
      td.textContent = 'No se encontraron resultados';
      td.style.textAlign = 'center';
      row.appendChild(td);
      tableBody.appendChild(row);
    }
  }

  // Buscar al presionar el botón
  searchBtn.addEventListener('click', searchPlayers);

  // Buscar al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchPlayers();
    }
  });
});
