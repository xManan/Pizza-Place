console.log("working...");

let pizzaContainer = document.querySelector("#pizza-container");
let cart = document.querySelector("#cart");

// states for each section of the website : to check if the section is loaded one time before leaving the section 

let states = {
  "veg-pizza": 0,
  "non-veg-pizza": 0,
  sides: 0,
  beverages: 0,
  dessert: 0,
};


// using fetch method to implement AJAX
async function getPizza(string) {
  // checking if the page is alreay open or not
  for (const state in states) {
    if (state != string) {
      states[state] = 0;
    }
  }
  if (states[string] != 0) {
    return;
  }
  window.scrollTo(0, 0);
  states[string] = 1;
  pizzaContainer.innerHTML = "";
  // fetching data from local JSON file
  let response = await fetch(string + ".json");
  let data = await response.json();
  // iterating over every item and creating HTML elements
  for (let i = 0; i < data.items.length; i++) {
    let pizza = data.items[i];
    let pizzaId = string.charAt(0) + i;
    let pizzaCard = `
      <div id="${pizzaId}" class="pizza-card">
        <div class="img-container">
            <img src="${pizza.img_path}" />
            <span>&#8377; ${pizza.price}</span>
        </div>
        <div class="about-pizza">
            <p>${pizza.name}</p>
            <p>${pizza.description}</p>
        </div>
    `;

    let patt = /pizza/;
    if (patt.test(string)) {
      pizzaCard += `
        <hr>
        <div class="modify-pizza">
          <div class="size">
              <p>Size</p>
              <select>
                  <option value="0">Small</option>
                  <option value="1" selected>Medium</option>
                  <option value="2">Large</option>
              </select>
              <hr>
          </div>
          <div class="crust">
              <p>crust</p>
              <select>
                  <option value="0">Hand Tossed</option>
                  <option value="1">Thin Crust</option>
                  <option value="2">Cheese Burst</option>
                  <option value="3">Pan Pizza</option>
              </select>
              <hr>
          </div>
      </div>
    `;
    }
    let pizzaCardTemp = `
      <div class="add-to-cart-btn" onclick="pushOrder(this)" order="false">
        Add to cart
      </div>
    </div>
    `;
    let temp = getOrders();
   
    for (let i = 0; i < temp.orders.length; i++) {
      if (temp.orders[i].id == pizzaId) {
        if (temp.orders[i].tQuantity > 0) {
          pizzaCardTemp = `
            <div class="add-to-cart-btn quantity"  order="true">
              <button onclick="subQ(this)">-</button>
              <span>${temp.orders[i].tQuantity}</span>
              <button onclick="addQ(this)">+</button>
            </div>
        </div>
          `;
        }
        break;
      }
    }
    pizzaCard += pizzaCardTemp;
    pizzaContainer.innerHTML += pizzaCard;
  }
}





(function main() {

  if (localStorage.getItem("pizzaPlaceData") == null) {
    clearCart();
  }
  getPizza("veg-pizza");
  displayCart();

})();
