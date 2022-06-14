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
