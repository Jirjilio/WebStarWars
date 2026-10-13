const API = "https://swapi.dev/api";

// Elementos HTML
const grids = {
    characters: document.getElementById("characters-grid"),
    planets: document.getElementById("planets-grid"),
    starships: document.getElementById("starships-grid")
};

const paginations = {
    characters: document.getElementById("characters-pagination"),
    planets: document.getElementById("planets-pagination"),
    starships: document.getElementById("starships-pagination")
};

const tabs = document.querySelectorAll(".nav-tab");
const search = document.getElementById("character-search");
const clearSearch = document.getElementById("search-clear");
const loading = document.getElementById("loading-overlay");

const modal = document.getElementById("character-modal");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

let currentTab = "characters";
let currentPage = 1;


// -------------------------------------
// CAMBIAR ENTRE PERSONAJES, PLANETAS Y NAVES
// ------------------------------------

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        currentTab = tab.dataset.tab;
        currentPage = 1;

        search.value = "";

        mostrarGrid();
        cargarDatos();
    });
});


// ------------------------------------
// MOSTRAR EL GRID CORRESPONDIENTE
// ------------------------------------

function mostrarGrid() {

    Object.keys(grids).forEach(tab => {
        grids[tab].style.display = "none";
        paginations[tab].style.display = "none";
    });

    grids[currentTab].style.display = "grid";
    paginations[currentTab].style.display = "flex";
}


// ------------------------------------
// BUSCAR
// ------------------------------------

search.addEventListener("input", () => {
    currentPage = 1;
    cargarDatos();
});

clearSearch.addEventListener("click", () => {
    search.value = "";
    currentPage = 1;
    cargarDatos();
});


// ------------------------------------
// CARGAR DATOS DE LA API
// ------------------------------------

async function cargarDatos() {

    loading.classList.remove("hidden");

    let url = `${API}/${getRecurso()}/?page=${currentPage}`;

    if (search.value.trim() !== "") {
        url += `&search=${encodeURIComponent(search.value.trim())}`;
    }

    try {

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("Error al conectar con la API");
        }

        const datos = await respuesta.json();

        mostrarResultados(datos.results);
        mostrarPaginacion(datos);

    } catch (error) {

        console.error(error);

        grids[currentTab].innerHTML =
            "<p class='empty-state'>Error al cargar los datos.</p>";

    }

    loading.classList.add("hidden");
}


// ------------------------------------
// SABER QUÉ RECURSO DE SWAPI USAR
// ------------------------------------

function getRecurso() {

    if (currentTab === "characters") {
        return "people";
    }

    if (currentTab === "planets") {
        return "planets";
    }

    return "starships";
}


// ------------------------------------
// MOSTRAR RESULTADOS
// ------------------------------------

function mostrarResultados(resultados) {

    const grid = grids[currentTab];

    grid.innerHTML = "";

    if (resultados.length === 0) {
        grid.innerHTML =
            "<p class='empty-state'>No se han encontrado resultados.</p>";
        return;
    }

    resultados.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        if (currentTab === "characters") {

            card.innerHTML = `
                <div class="card-image"></div>

                <div class="card-content">
                    <div class="card-title">${item.name}</div>

                    <div class="card-description">
                        <strong>Altura:</strong> ${item.height} cm<br>
                        <strong>Peso:</strong> ${item.mass} kg<br>
                        <strong>Género:</strong> ${item.gender}
                    </div>
                </div>
            `;

        } else if (currentTab === "planets") {

            card.innerHTML = `
                <div class="card-image"></div>

                <div class="card-content">
                    <div class="card-title">${item.name}</div>

                    <div class="card-description">
                        <strong>Clima:</strong> ${item.climate}<br>
                        <strong>Población:</strong> ${item.population}
                    </div>
                </div>
            `;

        } else {

            card.innerHTML = `
                <div class="card-image"></div>

                <div class="card-content">
                    <div class="card-title">${item.name}</div>

                    <div class="card-description">
                        <strong>Modelo:</strong> ${item.model}<br>
                        <strong>Pasajeros:</strong> ${item.passengers}
                    </div>
                </div>
            `;

        }

        card.addEventListener("click", () => abrirModal(item));

        grid.appendChild(card);
    });
}


// ------------------------------------
// PAGINACIÓN
// ------------------------------------

function mostrarPaginacion(datos) {

    const pagination = paginations[currentTab];

    pagination.innerHTML = "";

    const totalPaginas = Math.ceil(datos.count / 10);

    if (totalPaginas <= 1) {
        return;
    }

    // Botón anterior
    const anterior = document.createElement("button");

    anterior.textContent = "‹";
    anterior.disabled = currentPage === 1;

    anterior.addEventListener("click", () => {

        if (currentPage > 1) {
            currentPage--;
            cargarDatos();
            window.scrollTo(0, 0);
        }

    });

    pagination.appendChild(anterior);


    // Número de página
    const pagina = document.createElement("span");

    pagina.textContent =
        `Página ${currentPage} de ${totalPaginas}`;

    pagination.appendChild(pagina);


    // Botón siguiente
    const siguiente = document.createElement("button");

    siguiente.textContent = "›";
    siguiente.disabled = currentPage === totalPaginas;

    siguiente.addEventListener("click", () => {

        if (currentPage < totalPaginas) {
            currentPage++;
            cargarDatos();
            window.scrollTo(0, 0);
        }

    });

    pagination.appendChild(siguiente);
}


// ------------------------------------
// MODAL
// ------------------------------------

function abrirModal(item) {

    modalTitle.textContent = item.name;

    if (currentTab === "characters") {

        modalSubtitle.textContent =
            `${item.height} cm | ${item.mass} kg`;

        modalBody.innerHTML = `
            <p><strong>Altura:</strong> ${item.height} cm</p>
            <p><strong>Peso:</strong> ${item.mass} kg</p>
            <p><strong>Género:</strong> ${item.gender}</p>
            <p><strong>Color de pelo:</strong> ${item.hair_color}</p>
            <p><strong>Color de piel:</strong> ${item.skin_color}</p>
            <p><strong>Color de ojos:</strong> ${item.eye_color}</p>
            <p><strong>Año de nacimiento:</strong> ${item.birth_year}</p>
        `;

    } else if (currentTab === "planets") {

        modalSubtitle.textContent = item.climate;

        modalBody.innerHTML = `
            <p><strong>Clima:</strong> ${item.climate}</p>
            <p><strong>Población:</strong> ${item.population}</p>
            <p><strong>Terreno:</strong> ${item.terrain}</p>
            <p><strong>Gravedad:</strong> ${item.gravity}</p>
            <p><strong>Diámetro:</strong> ${item.diameter}</p>
        `;

    } else {

        modalSubtitle.textContent = item.model;

        modalBody.innerHTML = `
            <p><strong>Modelo:</strong> ${item.model}</p>
            <p><strong>Fabricante:</strong> ${item.manufacturer}</p>
            <p><strong>Velocidad:</strong> ${item.max_atmosphering_speed}</p>
            <p><strong>Pasajeros:</strong> ${item.passengers}</p>
            <p><strong>Tripulación:</strong> ${item.crew}</p>
            <p><strong>Coste:</strong> ${item.cost_in_credits} créditos</p>
        `;
    }

    modal.classList.add("active");
}


// ------------------------------------
// CERRAR MODAL
// ------------------------------------

modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
});

modal.addEventListener("click", event => {

    if (event.target === modal) {
        modal.classList.remove("active");
    }

});


// ------------------------------------
// INICIO
// ------------------------------------

mostrarGrid();
cargarDatos();

