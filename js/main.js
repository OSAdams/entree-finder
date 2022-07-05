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
   '&instructionsRequired=true&addRecipeNutrition=true' +
   '&apiKey=633237cc8f324710afa989c4ba9993f0', false);
  xhr.addEventListener('load', () => {
    searchData = JSON.parse(xhr.response);
  });
  xhr.send();
  dataView = 'search';
}

// when window hash changes call the renderRecipeCards function with searchData
// as the argument IF
// searchData is a truthy value and dataView is absolutely equal to 'search'
window.addEventListener('hashchange', e => {
  if (searchData && dataView === 'search') {
    renderRecipeCards(searchData);
  }
});

// modify a string taken as the argument
// assign value to a variable and return variable
function convertSearchString(string) {
  const searchString = string.split(' ').join('+');
  return searchString;
}

// take form text value and create a new string which will be used as an argument to
// the synchronous AJAX call
function searchForm(event) {
  event.preventDefault();
  const convertedString = convertSearchString(searchInput.value);
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
      recipeDuration: singleCard('p', null, null, null, null, 'Prep Time: ' + recipes[i].readyInMinutes + ' minutes'),
      recipeNutrition: singleCard('p', null, null, null, null, 'Calories: ' + recipes[i].nutrition.nutrients[0].amount),
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
function singleCard(type, className, id, bgImage, title, duration) {
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
  if (title) {
    elementType.textContent = title;
  }
  if (duration) {
    elementType.textContent = duration;
  }
  return elementType;
}

// function PLACEHOLDER(arr) {
//   for (let i = 0; i < recipes.results.length; i++) {
//     const recipeCard = document.createElement('div');
//     recipeCard.className = 'recipe-card';
//     recipeCard.setAttribute('recipe-id', recipes.results[i].id);
//     const recipeImgContainer = document.createElement('div');
//     recipeImgContainer.className = 'recipe-img';
//     recipeImgContainer.style.backgroundImage = 'url(' + recipes.results[i].image + ')';
//     const recipeContext = document.createElement('div');
//     recipeContext.className = 'recipe-context';
//     const recipeTitle = document.createElement('h3');
//     recipeTitle.textContent = recipes.results[i].title;
//     const recipeDuration = document.createElement('p');
//     recipeDuration.textContent = 'Duration: ' + recipes.results[i].readyInMinutes + ' minutes';
//     const recipeCalories = document.createElement('p');
//     recipeCalories.textContent = 'Calories: ' + recipes.results[i].nutrition.nutrients[0].amount;
//     recipeContext.appendChild(recipeTitle);
//     recipeContext.appendChild(recipeDuration);
//     recipeContext.appendChild(recipeCalories);
//     recipeCard.appendChild(recipeImgContainer);
//     recipeCard.appendChild(recipeContext);
//     recipeCard.addEventListener('click', e => {
//       if (parseInt(e.currentTarget.getAttribute('recipe-id')) === recipes.results[i].id) {
//         const infoContainer = document.querySelector('.info-container');
//         const recipeContainer = document.querySelector('.recipe-information');
//         const recipeBlock = document.createElement('div');
//         const recipeBlockTwo = document.createElement('div');
//         const infoImage = document.createElement('div');
//         const infoTitle = document.createElement('div');
//         const titleH3 = document.createElement('h3');
//         const ingredientsData = document.createElement('div');
//         recipeBlock.className = 'recipe-block';
//         recipeBlockTwo.className = 'recipe-block-two';
//         infoImage.className = 'info-image';
//         infoTitle.className = 'info-title';
//         ingredientsData.className = 'ingredients-data';
//         infoImage.style.backgroundImage = 'url(' + recipes.results[i].image + ')';
//         titleH3.textContent = recipes.results[i].title;
//         infoTitle.appendChild(titleH3);
//         recipeBlock.appendChild(infoImage);
//         recipeBlock.appendChild(infoTitle);
//         infoContainer.appendChild(recipeBlock);
//         const infoSummary = document.createElement('div');
//         infoSummary.className = 'info-summary';
//         infoSummary.innerHTML = recipes.results[i].summary;
//         const infoUL = document.createElement('ul');
//         const recipeIngredients = recipes.results[i].nutrition.ingredients.slice();
//         for (let i = 0; i < recipeIngredients.length; i++) {
//           const infoLI = document.createElement('li');
//           const ingredientsAmount = document.createElement('span');
//           const ingredientName = document.createElement('span');
//           ingredientsAmount.className = 'rec-ingr';
//           ingredientName.className = 'rec-name';
//           ingredientsAmount.textContent = recipeIngredients[i].amount + ' ' + recipeIngredients[i].unit;
//           ingredientName.textContent = recipeIngredients[i].name + ': ';
//           infoLI.appendChild(ingredientName);
//           infoLI.appendChild(ingredientsAmount);
//           infoUL.appendChild(infoLI);
//           ingredientsData.appendChild(infoUL);
//         }
//         recipeBlockTwo.appendChild(infoSummary);
//         recipeBlockTwo.appendChild(ingredientsData);
//         infoContainer.appendChild(recipeBlockTwo);
//         const recipeActions = document.createElement('div');
//         recipeActions.className = 'recipe-actions';
//         const infoInstructions = document.createElement('div');
//         infoInstructions.className = 'info-instructions';
//         const closeButton = document.createElement('button');
//         closeButton.className = 'close-button';
//         closeButton.textContent = 'Back to List';
//         infoInstructions.appendChild(closeButton);
//         recipeActions.appendChild(infoInstructions);
//         infoContainer.appendChild(recipeActions);
//         dataView = 'view-recipe';
//         window.location.hash += convertSearchString('&' + dataView + '?' + recipes.results[i].title);
//         recipeContainer.className = 'recipe-infomation';
//         resultSection.className += ' hidden';
//         closeButton.addEventListener('click', e => {
//           resultSection.className = 'result-section';
//           recipeContainer.className += ' ' + 'hidden';
//         });
//       }
//     });
//     resultSection.appendChild(recipeCard);
//   }
// }

keywordSearch.addEventListener('click', searchForm);
