const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const searchSection = document.querySelector('.search-container');
const resultSection = document.querySelector('.result-container');
const homeIcon = document.querySelector('.fas.fa-home');

let searchData = null;

homeIcon.addEventListener('click', event => {
  searchSection.className = 'search-container';
  resultSection.className = 'result-container hidden';
  window.location.hash = '#home';
});

function searchRecipes(ingredients) {
  searchData = null;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' +
   ingredients +
   '&apiKey=633237cc8f324710afa989c4ba9993f0&includeNutrition=true&number=10&diet=vegan');
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
  const convertedString = convertSearchString(searchInput.value);
  window.location.hash = '#search=' + convertedString;
  searchRecipes(convertedString);
  searchInput.value = '';
  searchSection.className = 'search-container hidden';
  resultSection.className = 'result-container';
}

function renderRecipeCards(arr) {
  resultSection.innerHTML = '';
  const recipes = arr;
  const recipeList = document.createElement('div');
  recipeList.className = 'recipe-list';
  const recipeListTwo = document.createElement('div');
  recipeListTwo.className = 'recipe-list';
  for (let i = 0; i < recipes.length; i++) {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    const recipeImgContainer = document.createElement('div');
    recipeImgContainer.className = 'recipe-img';
    recipeImgContainer.style.backgroundImage = 'url(' + recipes[i].image + ')';
    const recipeContext = document.createElement('div');
    recipeContext.className = 'recipe-context';
    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = recipes[i].title;
    const recipeDuration = document.createElement('p');
    recipeDuration.textContent = 'Duration:';
    const recipeCalories = document.createElement('p');
    recipeCalories.textContent = 'Calories:';
    recipeContext.appendChild(recipeTitle);
    recipeContext.appendChild(recipeDuration);
    recipeContext.appendChild(recipeCalories);
    recipeCard.appendChild(recipeImgContainer);
    recipeCard.appendChild(recipeContext);
    if (i < 5) {
      recipeList.appendChild(recipeCard);
    } else {
      recipeListTwo.appendChild(recipeCard);
    }
  }
  resultSection.appendChild(recipeList);
  resultSection.appendChild(recipeListTwo);
}
