const searchInput = document.querySelector('.search-input');
const keywordSearch = document.querySelector('#keyword-search');

const searchResult = null;

keywordSearch.addEventListener('click', event => {
  event.preventDefault();
  window.location.hash = '#' + searchInput.value;
  searchInput.value = '';
});

// eslint-disable-next-line no-console
console.log(searchResult);
