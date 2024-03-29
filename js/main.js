const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');
const featureSection = document.querySelector('.feature-container');
const resultSection = document.querySelector('.result-container');
const resultDataList = document.querySelector('.result-data-list');
const recipeContainer = document.querySelector('.recipe-container');
const siteTitle = document.querySelector('.site-title');
const siteMap = document.querySelector('.site-map');
const modalContainer = document.querySelector('.modal-container');
const modalContent = document.querySelector('.modal-content');

/*
  # Event listener for window hash changes triggering the callback function
  # for DOM Manipulation
*/

window.addEventListener('hashchange', e => {
  // eslint-disable-next-line
  const [page, query, value] = windowHashPage(window.location.hash);
  if (page === '#search') {
    featureSection.className = 'feature-container hidden';
    resultSection.className = 'result-container';
    recipeContainer.className = 'recipe-container hidden';
    siteMap.textContent = 'Search Results';
    renderRecipeCards(data.searchData);
  }
  if (page === '#recipe') {
    featureSection.className = 'feature-container hidden';
    resultSection.className = 'result-container hidden';
    modalContainer.className = 'modal-container';
    modalContent.textContent = 'Reloading previous recipe!';
    setTimeout(() => {
      renderRecipe(e, data.searchData, value);
      recipeContainer.className = 'recipe-container';
      modalContainer.className = 'modal-container hidden';
    });
    siteMap.textContent = 'Full Recipe';
  }
  if (page === '#home') {
    featureSection.className = 'feature-container';
    resultSection.className = 'result-container hidden';
    recipeContainer.className = 'recipe-container hidden';
    siteMap.textContent = 'Landing Page';
  }
});

/*
  # Send a get request to our API server using the string argument passed
  # from our users input
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
  # Grab the page value from the window hash
*/

function windowHashPage(string) {
  const [page, content] = string.split('?');
  const [query, value] = content.split('=');
  const windowHash = [page, query, value];
  return windowHash;
}

/*
  # Update the user input string, removing spaces and returning the updated string
  # value for our xhr request
*/

function windowHashString(string) {
  const newString = string.split(' ').join('');
  return newString;
}

/*
  # User input value pre-defined callback function. call searchRecipes for an
  # xhr get request. Utilize setTimeout for api request and response. Update
  # local object for data rendering.
*/

function searchForm(event) {
  event.preventDefault();
  const convertedString = windowHashString(searchInput.value);
  modalContent.textContent = 'Search for your choice of plates!';
  modalContainer.className = 'modal-container';
  searchRecipes(convertedString);
  setTimeout(() => {
    searchInput.value = '';
    window.location.hash = '#search?keyword=' + convertedString;
    featureSection.className = 'feature-container hidden';
    resultSection.className = 'result-container';
    modalContainer.className = 'modal-container hidden';
    renderRecipeCards(data.searchData);
  }, 600);
}

/*
  # Using the data saved from our xhr get request, X recipe cards are generated.
  # Depending on the total amount of recipes our xhr get request returned
*/

function renderRecipeCards(array) {
  resultDataList.innerHTML = '';
  const { meals } = array;
  if (!meals) {
    const errorMessage = newElement('p', { textContent: 'Unable to find an Entree with your search string! Please, try again.' });
    const errorTitle = newElement('h3', { textContent: 'Error! ' });
    resultDataList.appendChild(errorTitle);
    resultDataList.appendChild(errorMessage);
    return;
  }

  /*
    # This function is to re-size our text depending on the length of the string
    # passed as the argument. This return value is used for the recipe titles
  */

  function stringSizeUpdate(string) {
    const length = string.length;
    const size = length > 21 ? '0.9rem' : length > 23 ? '0.8rem' : length > 24 ? '0.7rem' : '1rem';
    return size;
  }

  /*
    # Loop through our recipe return object, presenting the user an image, title,
    # and recipe source. Each card has a click event listener which will render the
    # instructions and ingredients with user interaction.
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
      modalContainer.className = 'modal-container';
      modalContent.textContent = 'Loading your full recipe!';
      renderRecipe(e, meals);
    });
    resultDataList.appendChild(newCard.cardContainer);
    resultSection.appendChild(resultDataList);
  }
}

/*
  # This function is designed to help create html elements inside local objects.
  # newElement('tag', { className: 'container', ... })
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
  # When the user clicks on a recipe card, the DOM is manipulated and now
  # our web application will strictly display the full recipe. With user controls,
  # the user can save the recipe, storing the recipe in local storage for future
  # use.
*/
const recipeDataContainer = document.querySelector('.recipe-data-container');
let recipeData = null;

function renderRecipe(event, array, rawID) {
  document.querySelector('.recipe-data-container').innerHTML = '';
  const cardID = rawID || event.currentTarget.getAttribute('id');
  const meals = array;
  for (let i = 0; i < meals.length; i++) {
    if (cardID === meals[i].idMeal) {
      recipeData = null;
      const clickedRecipe = meals[i];
      recipeData = clickedRecipe;
      data.recipeData = recipeData;
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
      window.location.hash = '#recipe?id=' + cardID;
      modalContainer.className = 'modal-container hidden';
    }
  }
}

/*
  # Call searchForm which will send an xhr get request and parse the response.
  # siteTitle event listener is to return to the landing page per user interaction
*/

keywordSearch.addEventListener('click', searchForm);

siteTitle.addEventListener('click', e => {
  data.dataView = 'home';
  window.location.hash = '#home?';
  featureSection.className = 'feature-container';
  resultSection.className = 'result-container hidden';
  recipeContainer.className = 'recipe-container hidden';
});

/*
  # recipeContorls will allow the user to save a recipe, storing the data
  # into localStorage
*/

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
