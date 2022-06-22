const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const searchSection = document.querySelector('.search-container');
const resultSection = document.querySelector('.result-container');
const homeIcon = document.querySelector('.fas.fa-home');

let searchData = null;
let dataView = 'home';

homeIcon.addEventListener('click', event => {
  searchSection.className = 'search-container';
  resultSection.className = 'result-container hidden';
  window.location.hash = '#' + dataView;
});

function searchRecipes(ingredients) {
  searchData = null;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/complexSearch?diet=vegan&includeIngredients=' +
   ingredients +
   '&number=12&instructionsRequired=true&addRecipeNutrition=true' +
   '&apiKey=633237cc8f324710afa989c4ba9993f0');
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    const searchResult = xhr.response;
    searchData = xhr.response;
    renderRecipeCards(searchResult);
  });
  xhr.send();
  return searchData;
}

keywordSearch.addEventListener('click', searchForm);

function convertSearchString(string) {
  const searchString = string.split(' ').join('+');
  return searchString;
}

function searchForm(event) {
  event.preventDefault();
  dataView = 'search';
  const convertedString = convertSearchString(searchInput.value);
  window.location.hash = '#' + dataView + '?' + convertedString;
  searchRecipes(convertedString);
  searchInput.value = '';
  searchSection.className = 'search-container hidden';
  resultSection.className = 'result-container';
}

// const recipeInfo = document.querySelector('.recipe-information');
// const infoContainer = document.querySelector('.info-container');
// const recipeBlock = document.querySelector('.recipe-block');
// const infoImage = document.querySelector('.info-image');
// const infoTitle = document.querySelector('.info-title');
// const recipeBlockTwo = document.querySelector('.recipe-block-two');
// const infoSummary = document.querySelector('.info-summary');
// const infoIngredients = document.querySelector('.info-ingredients');
// const infoInstructions = document.querySelector('.info-instructions');

function renderRecipeCards(arr) {
  resultSection.innerHTML = '';
  const recipes = arr;
  const recipeList = document.createElement('div');
  recipeList.className = 'recipe-list';
  const recipeListTwo = document.createElement('div');
  recipeListTwo.className = 'recipe-list';
  for (let i = 0; i < recipes.results.length; i++) {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.setAttribute('recipe-id', recipes.results[i].id);
    // eslint-disable-next-line
    console.log(typeof recipes.results[i].id);
    const recipeImgContainer = document.createElement('div');
    recipeImgContainer.className = 'recipe-img';
    recipeImgContainer.style.backgroundImage = 'url(' + recipes.results[i].image + ')';
    const recipeContext = document.createElement('div');
    recipeContext.className = 'recipe-context';
    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = recipes.results[i].title;
    const recipeDuration = document.createElement('p');
    recipeDuration.textContent = 'Duration: ' + recipes.results[i].readyInMinutes + ' minutes';
    const recipeCalories = document.createElement('p');
    recipeCalories.textContent = 'Calories: ' + recipes.results[i].nutrition.nutrients[0].amount;
    recipeContext.appendChild(recipeTitle);
    recipeContext.appendChild(recipeDuration);
    recipeContext.appendChild(recipeCalories);
    recipeCard.appendChild(recipeImgContainer);
    recipeCard.appendChild(recipeContext);
    recipeCard.addEventListener('click', e => {
      if (parseInt(e.currentTarget.getAttribute('recipe-id')) === recipes.results[i].id) {
        // eslint-disable-next-line
        console.log(recipes.results[i]);
      }
    });
    resultSection.appendChild(recipeCard);
  }
}
