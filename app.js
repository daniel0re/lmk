document.addEventListener('DOMContentLoaded', () => {
    // Cargar los datos de los archivos JSON
    Promise.all([
        fetch('datos_jugadores.json').then(res => res.json()),
        fetch('datos_propietarios.json').then(res => res.json())
    ]).then(([jugadoresData, propietariosData]) => {
        // Función para cargar los datos de jugadores
        function loadTableData(jugadores) {
            const tableBody = document.querySelector('#jugadoresTable tbody');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            jugadores.forEach(jugador => {
                if (jugador[2] != '') {
                    const row = document.createElement('tr');

                    // Asignar color según el tipo de entrenamiento
                    const training = jugador[7]; // Suponemos que la columna 7 contiene el tipo de entrenamiento
                    console.log(training); // Verificar el valor del entrenamiento

                    if (training === 'E. P. Rojo') {
                        row.classList.add('entrenamiento-potenciado-rojo');
                    } else if (training === 'Leyenda') {
                        row.classList.add('entrenamiento-leyenda');
                    } else if (training === 'E. P. Azul') {
                        row.classList.add('entrenamiento-potenciado-azul');
                    } else if (training === 'E. P. Verde') {
                        row.classList.add('entrenamiento-potenciado-verde');
                    } else if (training === 'P. Verde') {
                        row.classList.add('entrenamiento-p-verde');
                    } else if (training === 'Épico') {
                        row.classList.add('entrenamiento-epico');
                    } else if (training === 'Especial' || training === 'Gratis') {
                        row.classList.add('entrenamiento-especial');
                    }

                    // Añadir las celdas a la fila
                    jugador.forEach((data, index) => {
                        const cell = document.createElement('td');
                        cell.textContent = data;
                        row.appendChild(cell);
                    });

                    // Agregar la fila a la tabla
                    tableBody.appendChild(row);
                }
            });
        }

        // Función para aplicar los filtros y actualizar la tabla
        function applyFilters() {
            const selectedPosition = document.getElementById('positionFilter').value;
            const searchQuery = normalizeString(document.getElementById('searchInput').value.toLowerCase());
            const selectedTraining = document.getElementById('trainingFilter').value;
            const selectedOwner = document.getElementById('ownerFilter').value;
            const selectedLoan = document.getElementById('loanFilter').value;
            const selectedLvl = document.getElementById('lvlFilter').value;

            const filteredJugadores = jugadoresData.filter(jugador => {
                const positionMatch = selectedPosition ? jugador[1] === selectedPosition : true;
                const jugadorMatch = normalizeString(jugador[2].toLowerCase()).includes(searchQuery);
                const trainingMatch = selectedTraining ? jugador[7] === selectedTraining : true;
                const ownerMatch = selectedOwner ? jugador[11] === selectedOwner : true;
                const loanMatch = selectedLoan ? jugador[9] === selectedLoan : true; // Filtrar por préstamo
                const lvlMatch = getLvlMatch(jugador[5], selectedLvl);

                return positionMatch && jugadorMatch && trainingMatch && ownerMatch && loanMatch && lvlMatch;
            });

            loadTableData(filteredJugadores);
        }

        // Función para normalizar cadenas (eliminar tildes y caracteres especiales)
        function normalizeString(str) {
            const normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalized.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase();
        }

        // Función para obtener el nivel del jugador y comparar con el rango
        function getLvlMatch(lvl, selectedLvl) {
            if (!selectedLvl) return true;

            const playerLvl = parseInt(lvl);

            switch (selectedLvl) {
                case '69':
                    return playerLvl < 69;
                case '70-74':
                    return playerLvl >= 70 && playerLvl <= 74;
                case '75-79':
                    return playerLvl >= 75 && playerLvl <= 79;
                case '80-82':
                    return playerLvl >= 80 && playerLvl <= 82;
                case '82+':
                    return playerLvl > 82;
                default:
                    return true;
            }
        }

        // Asignar el evento del botón de búsqueda
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', applyFilters);

        // Función para restablecer los filtros
        function resetFilters() {
            document.getElementById('positionFilter').value = '';
            document.getElementById('searchInput').value = '';
            document.getElementById('trainingFilter').value = '';
            document.getElementById('ownerFilter').value = '';
            document.getElementById('loanFilter').value = ''; // Restablecer el filtro de préstamo
            document.getElementById('lvlFilter').value = '';
            loadTableData(jugadoresData);
        }

        // Asignar el evento del botón de restablecer
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', resetFilters);

        // Llenar el filtro de propietarios
        const ownerFilter = document.getElementById('ownerFilter');
        propietariosData.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            ownerFilter.appendChild(option);
        });

        // Llenar el filtro de préstamos
        const loanFilter = document.getElementById('loanFilter');
        propietariosData.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            loanFilter.appendChild(option);
        });

        // Cargar los datos en la tabla al inicio
        loadTableData(jugadoresData);
    });
});
