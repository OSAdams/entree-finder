/* exported data */
const savedDataJSON = localStorage.getItem('entree-finder-local-storage');

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

window.addEventListener('pagehide', e => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('entree-finder-local-storage', dataJSON);
});
