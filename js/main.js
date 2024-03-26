const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const featureSection = document.querySelector('.feature-container');
const resultSection = document.querySelector('.result-container');
const resultDataList = document.querySelector('.result-data-list');
const homeIcon = document.querySelector('.fas.fa-home');

/*
  # Depending on the window hash, the user will be able to view and interact with
  # certain features. Using local storage, we will render what has been searched
  # previously. This will limit the amount of API Calls a user will use. Although,
  # this does introduce performance issues due to using localStorage.
*/

const hash = windowHashPage(window.location.hash);
if (hash === '#search') {
  featureSection.className = 'feature-container hidden';
  resultSection.className = 'result-container';
  renderRecipeCards(data.searchData);
}
if (hash === '#home') {
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
}

/*
  # searchRecipes will send an XHRHttpsRequest to our public API (Free Meal API)
  # The response will be parsed and stored in our data.searchData object which
  # will be used for the entirety of the app!
*/

function searchRecipes(keyword) {
  if (!keyword.length > 3) {
    console.error({ error: 'search input must be at least 3 characters' });
    return { error: 'Please expand your search value to beyond 3 characters!' };
  }
  data.prevSearch = data.searchData;
  let searchData = null;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + keyword);
  xhr.addEventListener('load', () => {
    searchData = JSON.parse(xhr.response);
    data.searchData = searchData;
    data.dataView = 'search';
  });
  xhr.send();
}

/*
  # Change this into a window hash updating function. We can use this to control
  # what data will render.
*/

function windowHashPage(string) {
  let hash = null;
  hash = string.split('?');
  const [page] = hash;
  return page;
}

function windowHashString(string) {
  const newString = string.split(' ').join('');
  return newString;
}

function searchForm(event) {
  event.preventDefault();
  const convertedString = windowHashString(searchInput.value);
  searchRecipes(convertedString);
  setTimeout(() => {
    searchInput.value = '';
    window.location.hash = '#search?keyword=' + convertedString;
    featureSection.className = 'feature-container hidden';
    resultSection.className = 'result-container';
    renderRecipeCards(data.searchData);
  }, 600);
}

/*
  # This function is called in our searchForm function. We will use data.searchData
  # object value to render our data in the recipe cards
  #
  # FUTURE UPDATES: If there isn't a response, we will need to render an error
  # page. WIP.
*/

function renderRecipeCards(array) {
  resultDataList.innerHTML = '';
  const { meals } = array;

  /*
    # stringSizeUpdate is a locally defined method to renderRecipeCards. This
    # method will update our title font size depending on the length of the
    # passed string value. Using conditionals, we will set the size of the title
    # which will maintain application design consistency and responsiveness
  */

  function stringSizeUpdate(string) {
    const length = string.length;
    const size = length > 21 ? '0.9rem' : length > 23 ? '0.8rem' : length > 24 ? '0.7rem' : '1rem';
    return size;
  }

  /*
    # We are looping through the passed array argument, which is local object
    # assigned a value of our ajax call response. Using this data, we will
    # manipulate the dom by creating unique recipe cards for unique recipes.
    # Each recipe card is assigned a unique ID, this ID is the recipe ID will
    # be used to isolate the recipe the user has clicked on with our locally
    # defined click event listener. Each card will be rendered to the DOM.
  */

  for (let i = 0; i < meals.length; i++) {
    const stringSource = !meals[i].strSource ? 'Unable to find Recipe Source' : 'Click here for Recipe Source';
    const newCard = {
      cardContainer: newElement('div', { className: 'recipe-card', id: meals[i].idMeal }),
      bgImage: newElement('div', { className: 'recipe-img', image: meals[i].strMealThumb }),
      title: newElement('h3', { textContent: meals[i].strMeal, style: { property: 'fontSize', fontSize: stringSizeUpdate(meals[i].strMeal) } }),
      recipeDuration: newElement('p', { textContent: meals[i].strArea + ' cousine' }),
      recipeSourceP: newElement('p'),
      recipeSource: newElement('a', { href: meals[i].strSource, target: '__blank', textContent: stringSource }),
      recipeContext: newElement('div', { className: 'recipe-context' })
    };
    newCard.cardContainer.appendChild(newCard.bgImage);
    newCard.recipeContext.appendChild(newCard.title);
    newCard.recipeContext.appendChild(newCard.recipeDuration);
    newCard.recipeSourceP.appendChild(newCard.recipeSource);
    newCard.recipeContext.appendChild(newCard.recipeSourceP);
    newCard.cardContainer.appendChild(newCard.recipeContext);
    newCard.cardContainer.addEventListener('click', e => {
      renderRecipe(e, meals);
    });
    resultDataList.appendChild(newCard.cardContainer);
    resultSection.appendChild(resultDataList);
  }
}

/*
  # Create an element and assign values to the element attributes:
  # calling newElement('element', { attribute: value } )
  # newElement('h1', { className: 'foo', id: 'bar', textContent: 'fuz' })
  # calling with a style option
  # newElement('element', { style: { property: value, value: string }})
  # newElement('p', { style: { property: 'color', color: 'value' } })
*/

function newElement(tag, options) {
  if (!tag || typeof tag !== 'string') return { error: 'The element tag is required' };
  const element = document.createElement(tag);
  if (options) {
    if (options.className) element.className = options.className;
    if (options.id) element.id = options.id;
    if (options.image) element.style.backgroundImage = ('url(' + options.image + ')');
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    if (options.target) element.target = options.target;
    if (options.href) element.href = options.href;
    if (options.style) {
      if (options.style.property === 'fontSize') element.style.fontSize = options.style.fontSize;
    }
  }
  return element;
}

/*
  # Grab the elements in the DOM that we are going to use to show the recipe.
  # recipeData is an object that we will use for our recipe data
*/

const recipeSection = document.querySelector('.recipe-container');
const recipeDataContainer = document.querySelector('.recipe-data-container');
let recipeData = null; // eslint-disable-line

function renderRecipe(event, array) {
  document.querySelector('.recipe-data-container').innerHTML = '';
  const cardID = event.currentTarget.getAttribute('id');
  const meals = array;
  for (let i = 0; i < meals.length; i++) {
    if (cardID === meals[i].idMeal) {
      recipeData = null;
      const clickedRecipe = meals[i];
      recipeData = clickedRecipe;
      const fullRecipe = {
        bgImage: newElement('div', { className: 'info-image', image: clickedRecipe.strMealThumb }),
        titleContainer: newElement('div', { className: 'info-title' }),
        title: newElement('h3', { textContent: clickedRecipe.strMeal }),
        ingredientHeader: newElement('h3', { textContent: 'Ingredients' }),
        ingredientContainer: newElement('div', { className: 'ingredients-data' }),
        instructionContainer: newElement('div', { className: 'instruction-data' }),
        instructionHeader: newElement('h3', { textContent: 'Instructions' }),
        ingredientUl: newElement('ul'),
        instructionDiv: newElement('div'),
        containerOne: newElement('div', { className: 'recipe-block' }),
        containerTwo: newElement('div', { className: 'recipe-block-two' }),
        recipeIngredients: function (recipeObject) {
          if (!recipeObject) return { error: 'iterable object literal required' };
          const argObject = recipeObject;
          const nameArray = [];
          const measurementArray = [];
          for (const property in argObject) {
            if (property.includes('Ingredient') && argObject[property].length >= 1) {
              nameArray.push(argObject[property]);
            }
          }
          for (const property in argObject) {
            if (property.includes('Measure') && argObject[property].length >= 1) {
              measurementArray.push(argObject[property]);
            }
          }
          for (let i = 0; i < nameArray.length; i++) {
            const ingredient = {
              li: newElement('li'),
              name: newElement('span', { className: 'ingr-name', textContent: nameArray[i] + ': ' }),
              amount: newElement('span', { className: 'ingr-amount', textContent: measurementArray[i] })
            };
            ingredient.li.appendChild(ingredient.name);
            ingredient.li.appendChild(ingredient.amount);
            this.ingredientUl.appendChild(ingredient.li);
          }
        },
        recipeInstructions: function (recipeObject) {
          const objInstructions = recipeObject.strInstructions;
          const instructions = newElement('p', { textContent: objInstructions });
          this.instructionDiv.appendChild(instructions);
          this.instructionContainer.appendChild(this.instructionDiv);
        }
      };
      fullRecipe.titleContainer.appendChild(fullRecipe.title);
      fullRecipe.containerOne.appendChild(fullRecipe.bgImage);
      fullRecipe.containerOne.appendChild(fullRecipe.titleContainer);
      fullRecipe.instructionContainer.appendChild(fullRecipe.instructionHeader);
      fullRecipe.recipeInstructions(clickedRecipe);
      fullRecipe.containerTwo.appendChild(fullRecipe.instructionContainer);
      fullRecipe.recipeIngredients(clickedRecipe);
      fullRecipe.ingredientContainer.appendChild(fullRecipe.ingredientHeader);
      fullRecipe.ingredientContainer.appendChild(fullRecipe.ingredientUl);
      fullRecipe.containerTwo.appendChild(fullRecipe.ingredientContainer);
      recipeDataContainer.appendChild(fullRecipe.containerOne);
      recipeDataContainer.appendChild(fullRecipe.containerTwo);
      recipeData = meals[i];
      recipeControls(recipeDataContainer, recipeData);
      recipeSection.className = 'full-recipe-container';
      resultSection.className = 'result-container hidden';
    }
  }
}

/*
  # click event listener for the search button
  # which will call the searchForm function
*/

keywordSearch.addEventListener('click', searchForm);

homeIcon.addEventListener('click', e => {
  data.dataView = 'home';
  window.location.hash = '#home?';
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
  recipeSection.className = 'recipe-container hidden';
});

/*
  # This function is used if we have a string containing special characters that
  # will negatively impact our rendered data.
*/

// eslint-disable-next-line
function removeTags(str) {
  const error = {};
  if (!str) {
    error.error = 'Invalid string argument';
    return error;
  } else { str = str.toString(); }
  return str.replace(/(<([^>]+)>)/ig, '');
}

// eslint-disable-next-line
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
