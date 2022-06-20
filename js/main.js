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
  for (let i = 0; i < recipes.results.length; i++) {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
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
    if (i < 6) {
      recipeList.appendChild(recipeCard);
    } else {
      recipeListTwo.appendChild(recipeCard);
    }
  }
  resultSection.appendChild(recipeList);
  resultSection.appendChild(recipeListTwo);
}

/*
results: Array(12), offset: 0, number: 12, totalResults: 55}
number: 12
offset: 0
results: Array(12)
0:
aggregateLikes: 17
analyzedInstructions: [{…}]
cheap: false
cookingMinutes: -1
creditsText: "Jen West"
cuisines: []
dairyFree: true
diets: (6) ['gluten free', 'dairy free', 'paleolithic', 'lacto ovo vegetarian', 'primal', 'vegan']
dishTypes: ['salad']
gaps: "no"
glutenFree: true
healthScore: 95
id: 715540
image: "https://spoonacular.com/recipeImages/715540-312x231.jpg"
imageType: "jpg"
lowFodmap: false
nutrition: {nutrients: Array(29), properties: Array(2), flavonoids: Array(26), ingredients: Array(5), caloricBreakdown: {…}, …}
occasions: (2) ['4th of july', 'summer']
openLicense: -1
preparationMinutes: -1
pricePerServing: 175.37
readyInMinutes: 45
servings: 1
sourceName: "Pink When"
sourceUrl: "http://www.pinkwhen.com/summer-berry-salad/"
spoonacularSourceUrl: "https://spoonacular.com/summer-berry-salad-715540"
summary: "Summer Berry Salad might be just the side dish you are searching for. Watching your figure? This caveman, gluten free, primal, and vegan recipe has <b>98 calories</b>, <b>2g of protein</b>, and <b>1g of fat</b> per serving. This recipe serves 1 and costs $1.75 per serving. 17 people have tried and liked this recipe. If you have apples, blackberries, romaine lettuce, and a few other ingredients on hand, you can make it. It can be enjoyed any time, but it is especially good for <b>The Fourth Of July</b>. From preparation to the plate, this recipe takes approximately <b>45 minutes</b>. All things considered, we decided this recipe <b>deserves a spoonacular score of 98%</b>. This score is outstanding. Try <a href=\"https://spoonacular.com/recipes/berry-summer-salad-50848\">Berry Summer Salad</a>, <a href=\"https://spoonacular.com/recipes/summer-berry-salad-485592\">Summer Berry Salad</a>, and <a href=\"https://spoonacular.com/recipes/chicken-berry-summer-salad-769303\">Chicken & Berry Summer Salad</a> for similar recipes."
sustainable: false
title: "Summer Berry Salad"
vegan: true
vegetarian: true
veryHealthy: true
veryPopular: false
weightWatcherSmartPoints: 0
*/
