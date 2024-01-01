/* exported data */
const savedDataJSON = localStorage.getItem('vegan-recipes-local-storage');

let data = {
  searchData: null,
  recipeData: null,
  savedData: [],
  dataView: null,
  saveId: 1
};

if (savedDataJSON !== null) {
  data = JSON.parse(savedDataJSON);
}

window.addEventListener('beforeunload', e => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('entree-finder-local-storage', dataJSON);
});
