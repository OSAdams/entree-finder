const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const searchSection = document.querySelector('.search-container');
const resultSection = document.querySelector('.result-container');
const homeIcon = document.querySelector('.fas.fa-home');

let searchData = null;
let dataView = '';

homeIcon.addEventListener('click', event => {
  searchSection.className = 'search-container';
  resultSection.className = 'result-container hidden';
  dataView = 'home';
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
        const infoContainer = document.querySelector('.info-container');
        const recipeBlock = document.createElement('div');
        const recipeBlockTwo = document.createElement('div');
        const infoImage = document.createElement('div');
        const infoTitle = document.createElement('div');
        const titleH3 = document.createElement('h3');
        const recipeContainer = document.querySelector('.recipe-information');
        recipeBlock.className = 'recipe-block';
        recipeBlockTwo.className = 'recipe-block-two';
        infoImage.className = 'info-image';
        infoTitle.className = 'info-title';
        infoImage.style.backgroundImage = 'url(' + recipes.results[i].image + ')';
        titleH3.textContent = recipes.results[i].title;
        infoTitle.appendChild(titleH3);
        recipeBlock.appendChild(infoImage);
        recipeBlock.appendChild(infoTitle);
        infoContainer.appendChild(recipeBlock);
        const infoSummary = document.createElement('div');
        infoSummary.className = 'info-summary';
        const infoIngredients = document.createElement('div');
        infoIngredients.className = 'info-ingredients';
        infoSummary.innerHTML = recipes.results[i].summary;
        const infoUL = document.createElement('ul');
        const recipeIngredients = recipes.results[i].nutrition.ingredients.slice();
        for (let i = 0; i < recipeIngredients.length; i++) {
          const infoLI = document.createElement('li');
          const ingredientsSpan = document.createElement('span');
          ingredientsSpan.className = 'rec-ingr';
          ingredientsSpan.textContent = recipeIngredients[i].amount + ' ' + recipeIngredients[i].unit + ':';
          infoLI.textContent = recipeIngredients[i].name;
          infoLI.appendChild(ingredientsSpan);
          infoUL.appendChild(infoLI);
        }
        recipeBlockTwo.appendChild(infoSummary);
        recipeBlockTwo.appendChild(infoIngredients);
        infoContainer.appendChild(recipeBlockTwo);
        dataView = 'view-recipe';
        window.location.hash += convertSearchString('&' + dataView + '?' + recipes.results[i].title);
        recipeContainer.className = 'recipe-infomation';
        resultSection.className += ' hidden';
      }
    });
    resultSection.appendChild(recipeCard);
  }
}

// <div class="recipe-block">
//   <div class="info-image">

//   </div>
//   <div class="info-title">
//     <h3> </h3>
//   </div>
// </div>
// <div class="recipe-block-two">
//   <div class="info-summary">

//   </div>
//   <div class="info-ingredients">
//     <ul>
//       <li>
//         <span class="rec-ingr"> </span>
//       </li>
//     </ul>
//   </div>
// </div>
// <div class="recipt-actions">
//   <div class="info-instructions">

//   </div>
// </div>
