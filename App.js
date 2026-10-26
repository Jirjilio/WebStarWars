/*
    1.CONFIGURACIÓN
*/
const SWAPI_BASE = 'https://swapi.dev/api';


/*
    2.ELEMENTOS HTML
*/
//Creamos variables que apuntan a elementos de HTML
const charactersGrid = document.getElementById('characters-grid');
const planetsGrid = document.getElementById('planets-grid');
const starshipsGrid = document.getElementById('starships-grid');

//Botones de paginaciones (atrás y adelante)
const previousPageButton = document.getElementById('previous-page');// addEventListener() espera a que el usuario haga clic en el botón.
                                                                    // Cuando se produce el clic, se ejecuta la función anteriorPagina().
const nextPageButton = document.getElementById('next-page')

//Busqueda de personajes
const navTabs = document.querySelectorAll('.nav-tab');
const searchInput = document.getElementById('character-search');
const searchClear = document.getElementById('search-clear');
const searchResultsCount = document.getElementById('search-results-count');

const characterModal = document.getElementById('character-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const loadingOverlay = document.getElementById('loading-overlay');

/*
    3.VARIABLES DE ESTADO: datos que nuestro programa necesita recordar
*/
let nextPage = null;
let previousPage = null;

/*
    4.FUNCIONES
*/
//Se utiliza fetch() para obtener los personajes desde la API SWAPI. 
//Los datos se convierten a JSON y se recorren con forEach(), generando 
//dinámicamente tarjetas con el nombre, altura y peso de cada personaje.
function cargarPersonajes(url) {

    fetch(url)
    .then((response) => response.json())
    .then((characters) => {
        

        characters.results.forEach((character) => {
            charactersGrid.innerHTML += `
                <div class="card">
                    <h2>${character.name}</h2>
                    <p>Altura: ${character.height} cm</p>
                    <p>Peso: ${character.mass} kg</p>
                </div>
            `;
        });

        //Cuando estemos en la pagina 1 (nextPage -> 2) (previousPage -> null), pagina 2 (nextPage -> 3) (previousPage -> 1)
        nextPage = characters.next// Guardamos la URL de la página posterior que nos proporciona la API
        previousPage = characters.previous// Guardamos la URL de la página anterior que nos proporciona la API
    });
}

function siguientePagina() {
    if(nextPage){//La variable tiene un valor (un texto), así que JavaScript lo considera como "true", sino hay valor "false"
    charactersGrid.innerHTML = '';

    cargarPersonajes(nextPage);
    }
}

function anteriorPagina() {
    if(previousPage){//La variable tiene un valor (un texto), así que JavaScript lo considera como "true", sino hay valor "false"
    charactersGrid.innerHTML = '';

    cargarPersonajes(previousPage);
    }
}

/*
   5.EVENTOS
*/
previousPageButton.addEventListener('click', () => {
            anteriorPagina();
})
nextPageButton.addEventListener('click', () => {
            siguientePagina();
})

// Detectamos cada vez que el usuario escribe en el campo de búsqueda.
// searchInput.value contiene el texto que ha escrito.
searchInput.addEventListener('input', () => {
    console.log(searchInput.value);
});

/*
   6.EJECUCIÓN INICIAL
*/
cargarPersonajes(`${SWAPI_BASE}/people`);//Ejecutamos la funcion

planetsGrid.innerHTML = 'Planetas';
starshipsGrid.innerHTML = 'Naves';