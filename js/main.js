const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const featureSection = document.querySelector('.feature-container');
const resultSection = document.querySelector('.result-container');
const resultDataList = document.querySelector('.result-data-list');
const homeIcon = document.querySelector('.fas.fa-home');
// const recipeSection = document.querySelector('.recipe-information');

// reset data.searchData variable value to null
// use argument passed and concatenated to string passed as a second argument
// on the call of open method of the xhr object
// when loaded, data.searchData is assigned to the return value of the call parse method
// of the JSON object with xhr.response as an argument
// data.dataView is updated to 'search' value
function searchRecipes(ingredients) {
  data.searchData = null;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/complexSearch?diet=vegan&includeIngredients=' +
   ingredients +
   '&number=12&instructionsRequired=true&addRecipeNutrition=true' +
   '&apiKey=633237cc8f324710afa989c4ba9993f0', false);
  xhr.addEventListener('load', () => {
    data.searchData = JSON.parse(xhr.response);
  });
  xhr.send();
  data.dataView = 'search';
}

// modify a string taken as the argument
// assign value to a variable using split and join methods
// for the argument passed
// return value
function windowHashString(string) {
  const newString = string.split(' ').join('+');
  return newString;
}

// take search form text value and create a new string
// call searchRecipe with the converted string as an argument
// update window hash to display the converted string for search
// reset the search form input value
// update classNames of feature section container
// and result section container
function searchForm(event) {
  event.preventDefault();
  const convertedString = windowHashString(searchInput.value);
  searchRecipes(convertedString);
  data.dataView = 'search';
  window.location.hash += '#search=' + convertedString;
  data.prevSearch = convertedString;
  searchInput.value = '';
  featureSection.className = 'search-container hidden';
  resultSection.className = 'result-container';
}

// reset inner html
// assign the results property of the argument passed to a variable
// loop through recipes array to create a new element with
// optional attributes by calling the newElement function
// and assigning the value to properties inside of the newCard object
// append elements to parent recipe card elements
// add a click event listener to each recipe card created
// in eventListener callback, call renderRecipes with event
// and recipes array as arguments
// we will use the value of the id attribute to render the full recipe
// in the renderRecipe function
function renderRecipeCards(array) {
  resultDataList.innerHTML = '';
  const recipes = array.results;
  for (let i = 0; i < recipes.length; i++) {
    const newCard = {
      recipeCard: newElement('div', { className: 'recipe-card', id: recipes[i].id }),
      recipeImg: newElement('div', { className: 'recipe-img', image: recipes[i].image }),
      recipeTitle: newElement('h3', { textContent: recipes[i].title }),
      recipeDuration: newElement('p', { textContent: 'Prep Time: ' + recipes[i].readyInMinutes + ' minutes' }),
      recipeNutrition: newElement('p', { textContent: 'Calories: ' + recipes[i].nutrition.nutrients[0].amount }),
      recipeContext: newElement('div', { className: 'recipe-context' })
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
// create an element with options.tag
// create and update attribute values with remaining property values
// return the element value
function newElement(tag, options) {
  if (!tag || typeof tag !== 'string') return { error: 'The element tag is required' };
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.id) element.id = options.id;
  if (options.image) element.style.backgroundImage = ('url(' + options.image + ')');
  if (options.textContent) element.textContent = options.textContent;
  return element;
}

function renderRecipe(event, array) {
  const cardID = event.currentTarget.getAttribute('id');
  const recipeArray = array;
  // eslint-disable-next-line
  console.log(recipeArray);
  for (let i = 0; i < recipeArray.length; i++) {
    if (parseInt(cardID) === recipeArray[i].id) {
      // eslint-disable-next-line
      console.log('---------it worked---------');
      // eslint-disable-next-line
      console.log(recipeArray[i], cardID, recipeArray[i].id);
    }
  }
}

keywordSearch.addEventListener('click', searchForm);

// when window hash changes call the renderRecipeCards function with data.searchData
// as the argument IF
// data.searchData is a truthy value and data.dataView is absolutely equal to 'search'
window.addEventListener('hashchange', e => {
  if (data.searchData && data.dataView === 'search') {
    renderRecipeCards(data.searchData);
  }
});

// click event listener for the home icon which will
// update classnames to display the feature component
// update window location hash to previous search string
// update data.searchData to null
homeIcon.addEventListener('click', event => {
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
  // recipeSection.className = 'recipe-information hidden';
  window.location.hash = '#home' + '?prev-search=' + data.prevSearch;
  data.searchData = null;
  data.dataView = 'home';
});
