const search = document.getElementById("search-input");
const submit = document.getElementById("submit");
const random = document.getElementById("random");

const resultHeading = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const singleMealEl = document.getElementById("single-meal");

// fetch recipes from API and display in DOM
function searchMeal(e) {
  e.preventDefault();

  // clear meals and/or single meal info from prev.searches
  mealsEl.innerHTML = "";
  singleMealEl.innerHTML = "";

  const searchWord = search.value;

  // if search word is entered
  if (searchWord.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchWord}`)
      .then((res) => res.json())
      .then((data) => {
        // data => object with meals as a key and array of meal objects as value
        console.log("data", data);

        // and if there are no results based on search (null => absense of any object value)
        if (data.meals === null) {
          resultHeading.innerHTML = `<h3>No results found for "${searchWord}"</h3>`;

          // if at least 1 meal result is returned =>
        } else {
          resultsNumber = data.meals.length;
          displayMessageBasedOn(resultsNumber, searchWord);

          // map through meals (i.e., array of objects) => and for each meal output =>
          mealsEl.innerHTML = data.meals // array of meal objects
            .map(
              (meal) =>
                `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"  />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `
            )
            .join("");
        }
      });

    // clear search text input field
    search.value = "";

    // if search field left blank (falsy because empty string)
  } else {
    resultHeading.innerHTML = `<h5 style="color:red;">Search field is empty. Enter your search term.</h5>`;
  }
}

function displayMessageBasedOn(resultsNumber, searchWord) {
  if (resultsNumber === 1) {
    resultHeading.innerHTML = `<h3>${resultsNumber} result found for "${searchWord}"</h3>`;
  } else {
    resultHeading.innerHTML = `<h3>${resultsNumber} results found for "${searchWord}"</h3>`;
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// fetch single meal by id
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
  `)
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// when clicked on a single meal, we need to get that meal's html element with class="meal-info" => from it we'll get meal ID
function viewSingleMeal(e) {
  // returns event's path which is an array of html elements on which event listener is invoked, e.g., output => [h3, div.meal-info, div.meal, div#meals.meals, div.container, body, html, document, Window]

  const mealInfo = e.composedPath().find((item) => {
    // find() calls test condition once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find() immediately returns that element.

    // true, as element with value "meal-info" is found and will immediately be assigned to 'mealInfo' variable
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  // if such html element exists, get it's id
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    // pass mealID into a function getMealByID(mealID)
    getMealByID(mealID);
  }
}

// fetch single meal by id
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
  `)
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

function addMealToDom(meal) {
  const ingredients = [];

  // there's a max of 20 ingredients
  for (let i = 1; i <= 20; i++) {
    // if there is an ingredient, e.g., Chicken Stock
    if (meal[`strIngredient${i}`]) {
      console.log(meal[`strIngredient${i}`]);
      console.log(meal[`strMeasure${i}`]);
      // add ingredient and its measurement to ingredients
      ingredients.push(`${meal[`strIngredient${i}`].toLowerCase()} - ${meal[`strMeasure${i}`].toLowerCase()}`);
    } else {
      // if there's no ingredient => break out of loop
      break;
    }
  }
  console.log("ingredients array", ingredients);

  singleMealEl.innerHTML = `
  <div class="single-meal">
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>Category: <span>${meal.strCategory}</span></p>` : ""}

    </div>
    <div class="single-meal-recipe">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
      <h3>Ingredients:</h3>
      <ul>
      ${ingredients.map((ingredient) => `<li>${capitalizeFirstLetter(ingredient)};</li>`).join("")}
      </ul>
    </div>
  </div>
  `;
}

// fetch random meal from API
function getRandomMeal() {
  // clear meals and headings
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// event listeners
// search for meal
submit.addEventListener("submit", searchMeal);

// click on single meal
mealsEl.addEventListener("click", viewSingleMeal);

// random meal
random.addEventListener("click", getRandomMeal);
