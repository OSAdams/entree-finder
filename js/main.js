const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const featureSection = document.querySelector('.feature-container');
const resultSection = document.querySelector('.result-container');
const resultDataList = document.querySelector('.result-data-list');
const homeIcon = document.querySelector('.fas.fa-home');
// const recipeSection = document.querySelector('.recipe-information');

let searchData = null;
let dataView = '';
let prevSearch = '';

// reset searchData variable value to null
// use argument passed and concatenated to string passed as a second argument
// on the call of open method of the xhr object
// when loaded, searchData is assigned to the return value of the call parse method
// of the JSON object with xhr.response as an argument
// dataView is updated to 'search' value
function searchRecipes(ingredients) {
  searchData = null;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/complexSearch?diet=vegan&includeIngredients=' +
   ingredients +
   '&number=25&instructionsRequired=true&addRecipeNutrition=true' +
   '&apiKey=633237cc8f324710afa989c4ba9993f0', false);
  xhr.addEventListener('load', () => {
    searchData = JSON.parse(xhr.response);
  });
  xhr.send();
  dataView = 'search';
}

// modify a string taken as the argument
// assign value to a variable and return variable
function windowHashString(string) {
  const newString = string.split(' ').join('+');
  return newString;
}

// take form text value and create a new string which will be used as an argument to
// the synchronous AJAX call
function searchForm(event) {
  event.preventDefault();
  const convertedString = windowHashString(searchInput.value);
  searchRecipes(convertedString);
  dataView = 'search';
  window.location.hash = '#search=' + convertedString;
  prevSearch = convertedString;
  searchInput.value = '';
  featureSection.className = 'search-container hidden';
  resultSection.className = 'result-container';
}

// create an object and assign value to the properties by calling singleCard func
// append children with value to newCard
// append the recipeCards to resultDataList
// append resultDataList to resultSection
// render the recipe cards to the dom
function renderRecipeCards(array) {
  resultSection.innerHTML = '';
  const recipes = array.results;
  for (let i = 0; i < recipes.length; i++) {
    const newCard = {
      recipeCard: singleCard('div', 'recipe-card', recipes[i].id),
      recipeImg: singleCard('div', 'recipe-img', null, recipes[i].image),
      recipeTitle: singleCard('h3', null, null, null, recipes[i].title),
      recipeDuration: singleCard('p', null, null, null, 'Prep Time: ' + recipes[i].readyInMinutes + ' minutes'),
      recipeNutrition: singleCard('p', null, null, null, 'Calories: ' + recipes[i].nutrition.nutrients[0].amount),
      recipeContext: singleCard('div', 'recipe-context')
    };
    newCard.recipeCard.appendChild(newCard.recipeImg);
    newCard.recipeContext.appendChild(newCard.recipeTitle);
    newCard.recipeContext.appendChild(newCard.recipeDuration);
    newCard.recipeContext.appendChild(newCard.recipeNutrition);
    newCard.recipeCard.appendChild(newCard.recipeContext);
    resultDataList.appendChild(newCard.recipeCard);
    resultSection.appendChild(resultDataList);
  }
}

// function definition with 6 parameters
// create an element with the first parameter
// create and update attribute values with remaining parameters
// return the element value
function singleCard(type, className, id, bgImage, content) {
  const elementType = document.createElement(type);
  if (className) {
    elementType.className = className;
  }
  if (id) {
    elementType.id = id;
  }
  if (bgImage) {
    elementType.style.backgroundImage = ('url(' + bgImage + ')');
  }
  if (content) {
    elementType.textContent = content;
  }
  return elementType;
}

// function renderRecipe(event, array) {
//   const carID = event.target.id;
//   const recipeArray = array.results;
//   for (let i = 0; i < recipeArray.length; i++) {
//     if (parseInt(carID) === recipeArray[i].id) {
//       console.log('---------it worked---------');
//       console.log(recipeArray[i]);
//     }
//   }
// }

keywordSearch.addEventListener('click', searchForm);

// when window hash changes call the renderRecipeCards function with searchData
// as the argument IF
// searchData is a truthy value and dataView is absolutely equal to 'search'
window.addEventListener('hashchange', e => {
  if (searchData && dataView === 'search') {
    renderRecipeCards(searchData);
  }
});

// click event listener for the home icon which will
// update classnames to display the feature component
// update window location hash to previous search string
// update searchData to null
homeIcon.addEventListener('click', event => {
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
  // recipeSection.className = 'recipe-information hidden';
  window.location.hash = '#home' + '?prev-search&' + prevSearch;
  searchData = null;
  dataView = 'home';
});
