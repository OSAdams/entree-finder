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
      recipeCard: singleCard({ type: 'div', className: 'recipe-card', id: recipes[i].id }),
      recipeImg: singleCard({ type: 'div', className: 'recipe-img', image: recipes[i].image }),
      recipeTitle: singleCard({ type: 'h3', textContent: recipes[i].title }),
      recipeDuration: singleCard({ type: 'p', textContent: 'Prep Time: ' + recipes[i].readyInMinutes + ' minutes' }),
      recipeNutrition: singleCard({ type: 'p', textContent: 'Calories: ' + recipes[i].nutrition.nutrients[0].amount }),
      recipeContext: singleCard({ type: 'div', className: 'recipe-context' })
    };
    newCard.recipeCard.appendChild(newCard.recipeImg);
    newCard.recipeContext.appendChild(newCard.recipeTitle);
    newCard.recipeContext.appendChild(newCard.recipeDuration);
    newCard.recipeContext.appendChild(newCard.recipeNutrition);
    newCard.recipeCard.appendChild(newCard.recipeContext);
    newCard.recipeCard.addEventListener('click', e => {
      renderRecipe(e, recipes);
    });
    resultDataList.appendChild(newCard.recipeCard);
    resultSection.appendChild(resultDataList);
  }
}

// function definition with ONE object parameter
// create an element with options.type
// create and update attribute values with remaining property values
// return the element value
function singleCard(options) {
  const element = document.createElement(options.type);
  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.image) element.style.backgroundImage = ('url(' + options.image + ')');
  if (options.textContent) element.textContent = options.textContent;
  return element;
}

function renderRecipe(event, array) {
  const cardID = event.currentTarget.getAttribute('id');
  const recipeArray = array;
  for (let i = 0; i < recipeArray.length; i++) {
    if (parseInt(cardID) === recipeArray[i].id) {
      // eslint-disable-next-line
      console.log('---------it worked---------');
      // eslint-disable-next-line
      console.log(recipeArray[i]);
    }
  }
}

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
