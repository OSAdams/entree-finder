const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const featureSection = document.querySelector('.feature-container');
const resultSection = document.querySelector('.result-container');
const resultDataList = document.querySelector('.result-data-list');
const homeIcon = document.querySelector('.fas.fa-home');

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
      cardContainer: newElement('div', { className: 'recipe-card', id: recipes[i].id }),
      bgImage: newElement('div', { className: 'recipe-img', image: recipes[i].image }),
      title: newElement('h3', { textContent: recipes[i].title }),
      recipeDuration: newElement('p', { textContent: 'Prep Time: ' + recipes[i].readyInMinutes + ' minutes' }),
      recipeNutrition: newElement('p', { textContent: 'Calories: ' + recipes[i].nutrition.nutrients[0].amount }),
      recipeContext: newElement('div', { className: 'recipe-context' })
    };
    newCard.cardContainer.appendChild(newCard.bgImage);
    newCard.recipeContext.appendChild(newCard.title);
    newCard.recipeContext.appendChild(newCard.recipeDuration);
    newCard.recipeContext.appendChild(newCard.recipeNutrition);
    newCard.cardContainer.appendChild(newCard.recipeContext);
    newCard.cardContainer.addEventListener('click', e => {
      renderRecipe(e, recipes);
    });
    resultDataList.appendChild(newCard.cardContainer);
    resultSection.appendChild(resultDataList);
  }
}

// function definition with a required element tag
// and optional object parameter
// return error if tag argument passed is not a string
// or does not exist
// create an element with options.tag
// create and update attribute values with remaining property values
// return the element value
function newElement(tag, options) {
  if (!tag || typeof tag !== 'string') return { error: 'The element tag is required' };
  const element = document.createElement(tag);
  if (options) {
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.image) element.style.backgroundImage = ('url(' + options.image + ')');
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
  }
  return element;
}

const recipeSection = document.querySelector('.recipe-container');
const recipeDataContainer = document.querySelector('.recipe-data-container');
let recipeData = null;

function renderRecipe(event, array) {
  document.querySelector('.recipe-data-container').innerHTML = '';
  const cardID = event.currentTarget.getAttribute('id');
  const recipeArray = array;
  for (let i = 0; i < recipeArray.length; i++) {
    if (parseInt(cardID) === recipeArray[i].id) {
      recipeData = null;
      const clickedRecipe = recipeArray[i];
      data.recipeData = clickedRecipe;
      const fullRecipe = {
        bgImage: newElement('div', { className: 'info-image', image: clickedRecipe.image }),
        titleContainer: newElement('div', { className: 'info-title' }),
        title: newElement('h3', { textContent: clickedRecipe.title }),
        ingredientHeader: newElement('h3', { textContent: 'Ingredients' }),
        ingredientContainer: newElement('div', { className: 'ingredients-data' }),
        instructionContainer: newElement('div', { className: 'instruction-data' }),
        instructionHeader: newElement('h3', { textContent: 'Instructions' }),
        // use variable to display summary for future feature
        // null
        summary: newElement('div', { className: 'info-summary', innerHTML: removeTags(clickedRecipe.summary) }),
        // end null
        ingredients: clickedRecipe.nutrition.ingredients.slice(),
        instructions: clickedRecipe.analyzedInstructions[0].steps.slice(),
        ingredientUl: newElement('ul'),
        instructionOl: newElement('ol'),
        containerOne: newElement('div', { className: 'recipe-block' }),
        containerTwo: newElement('div', { className: 'recipe-block-two' }),
        recipeIngredients: function (array) {
          for (let i = 0; i < array.length; i++) {
            const ingredient = {
              li: newElement('li'),
              name: newElement('span', { className: 'ingr-name', textContent: array[i].name + ': ' }),
              amount: newElement('span', { className: 'ingr-amount', textContent: array[i].amount + ' ' + array[i].unit })
            };
            ingredient.li.appendChild(ingredient.name);
            ingredient.li.appendChild(ingredient.amount);
            this.ingredientUl.appendChild(ingredient.li);
          }
        },
        recipeInstructions: function (array) {
          let step = 1;
          for (let i = 0; i < array.length; i++) {
            const number = newElement('span', { className: 'instruction-number', textContent: step + ') ' });
            const instruction = {
              li: newElement('li', { textContent: array[i].step })
            };
            instruction.li.prepend(number);
            this.instructionOl.appendChild(instruction.li);
            step++;
          }
        }
      };
      fullRecipe.titleContainer.appendChild(fullRecipe.title);
      fullRecipe.containerOne.appendChild(fullRecipe.bgImage);
      fullRecipe.containerOne.appendChild(fullRecipe.titleContainer);
      fullRecipe.instructionContainer.appendChild(fullRecipe.instructionHeader);
      fullRecipe.recipeInstructions(fullRecipe.instructions);
      fullRecipe.instructionContainer.appendChild(fullRecipe.instructionOl);
      fullRecipe.containerTwo.appendChild(fullRecipe.instructionContainer);
      fullRecipe.recipeIngredients(fullRecipe.ingredients);
      fullRecipe.ingredientContainer.appendChild(fullRecipe.ingredientHeader);
      fullRecipe.ingredientContainer.appendChild(fullRecipe.ingredientUl);
      fullRecipe.containerTwo.appendChild(fullRecipe.ingredientContainer);
      recipeDataContainer.appendChild(fullRecipe.containerOne);
      recipeDataContainer.appendChild(fullRecipe.containerTwo);
      recipeData = clickedRecipe;
      recipeControls(recipeDataContainer, recipeData);
      recipeSection.className = 'recipe-container';
      resultSection.className = 'result-container hidden';
    }
  }

}

keywordSearch.addEventListener('click', searchForm);

// when window hash changes call the rendercardContainers function with data.searchData
// as the argument IF
// data.searchData is a truthy value and data.dataView is absolutely equal to 'search'
window.addEventListener('hashchange', e => {
  if (data.searchData && data.dataView === 'search') {
    renderRecipeCards(data.searchData);
    if (!data.prevSearch || data.searchData !== data.prevSearch) {
      data.prevSearch = data.searchData;
    }
  }
});

// click event listener for the home icon which will
// update classnames to display the feature component
// update window location hash to previous search string
// update data.searchData to null
homeIcon.addEventListener('click', event => {
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
  recipeSection.className = 'recipe-container hidden';
  window.location.hash = '#home' + '?prev-search=' + data.prevSearch;
  data.searchData = null;
  data.dataView = 'home';
});

function removeTags(str) {
  const error = {};
  if (!str) {
    error.error = 'Invalid string argument';
    return error;
  } else { str = str.toString(); }
  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/ig, '');
}

// this guy is going to populate the parent element in the dom with a container
// containing buttons with event listeners
// this is the prototype - looking to enhance this or move it into an object
function recipeControls(parent, object) {
  const actionLib = {
    container: newElement('div', { className: 'action-container', id: 'recipe-actions' }),
    saveButton: newElement('button', { className: 'action-button', textContent: 'Save Recipe' })
  };
  actionLib.saveButton.addEventListener('click', e => {
    data.savedData[data.saveId] = {
      recipe: object,
      date: new Date()
    };
    data.saveId++;
  });
  actionLib.container.appendChild(actionLib.saveButton);
  parent.appendChild(actionLib.container);
}
