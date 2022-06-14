const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');

const searchResult = [];

keywordSearch.addEventListener('click', event => {
  event.preventDefault();
  const convertedString = convertSearchString(searchInput.value);
  window.location.hash = '#search=' + convertedString;
  searchRecipes(convertedString);
  searchInput.value = '';
});

function searchRecipes(ingredients) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.spoonacular.com/recipes/findByIngredients?ingredients=' +
   ingredients +
   '&apiKey=633237cc8f324710afa989c4ba9993f0&includeNutrition=true&number=10&diet=vegan');
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    for (let i = 0; i < xhr.response.length; i++) {
      searchResult.push(xhr.response[i]);
    }
  });
  xhr.send();
}

function convertSearchString(string) {
  const searchString = string.split(' ').join('+');
  return searchString;
}

/*
---------PER 5 RECIPE CARDS------------
        <div class="recipe-list">
          <div class="recipe-card">
            <div class="recipe-img">
              <img src="https://static7.depositphotos.com/1002351/792/i/950/depositphotos_7926477-stock-photo-new-potato.jpg">
            </div>
            <div class="recipe-context">
              <h3>Title</h3>
              <p>duration</p>
              <p>calories</p>
            </div>
          </div>
        </div>
*/
