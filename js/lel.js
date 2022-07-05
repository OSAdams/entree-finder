/* eslint-disable */
function PLACEHOLDER(arr) {
  const recipes = arr;
  for (let i = 0; i < recipes.results.length; i++) {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.setAttribute('recipe-id', recipes.results[i].id);
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
    recipeCard.addEventListener('click', e => {
      if (parseInt(e.currentTarget.getAttribute('recipe-id')) === recipes.results[i].id) {
        const infoContainer = document.querySelector('.info-container');
        const recipeContainer = document.querySelector('.recipe-information');
        const recipeBlock = document.createElement('div');
        const recipeBlockTwo = document.createElement('div');
        const infoImage = document.createElement('div');
        const infoTitle = document.createElement('div');
        const titleH3 = document.createElement('h3');
        const ingredientsData = document.createElement('div');
        recipeBlock.className = 'recipe-block';
        recipeBlockTwo.className = 'recipe-block-two';
        infoImage.className = 'info-image';
        infoTitle.className = 'info-title';
        ingredientsData.className = 'ingredients-data';
        infoImage.style.backgroundImage = 'url(' + recipes.results[i].image + ')';
        titleH3.textContent = recipes.results[i].title;
        infoTitle.appendChild(titleH3);
        recipeBlock.appendChild(infoImage);
        recipeBlock.appendChild(infoTitle);
        infoContainer.appendChild(recipeBlock);
        const infoSummary = document.createElement('div');
        infoSummary.className = 'info-summary';
        infoSummary.innerHTML = recipes.results[i].summary;
        const infoUL = document.createElement('ul');
        const recipeIngredients = recipes.results[i].nutrition.ingredients.slice();
        for (let i = 0; i < recipeIngredients.length; i++) {
          const infoLI = document.createElement('li');
          const ingredientsAmount = document.createElement('span');
          const ingredientName = document.createElement('span');
          ingredientsAmount.className = 'rec-ingr';
          ingredientName.className = 'rec-name';
          ingredientsAmount.textContent = recipeIngredients[i].amount + ' ' + recipeIngredients[i].unit;
          ingredientName.textContent = recipeIngredients[i].name + ': ';
          infoLI.appendChild(ingredientName);
          infoLI.appendChild(ingredientsAmount);
          infoUL.appendChild(infoLI);
          ingredientsData.appendChild(infoUL);
        }
        recipeBlockTwo.appendChild(infoSummary);
        recipeBlockTwo.appendChild(ingredientsData);
        infoContainer.appendChild(recipeBlockTwo);
        const recipeActions = document.createElement('div');
        recipeActions.className = 'recipe-actions';
        const infoInstructions = document.createElement('div');
        infoInstructions.className = 'info-instructions';
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.textContent = 'Back to List';
        infoInstructions.appendChild(closeButton);
        recipeActions.appendChild(infoInstructions);
        infoContainer.appendChild(recipeActions);
        dataView = 'view-recipe';
        window.location.hash += convertSearchString('&' + dataView + '?' + recipes.results[i].title);
        recipeContainer.className = 'recipe-infomation';
        resultSection.className += ' hidden';
        closeButton.addEventListener('click', e => {
          resultSection.className = 'result-section';
          recipeContainer.className += ' ' + 'hidden';
        });
      }
    });
    resultSection.appendChild(recipeCard);
  }
}
