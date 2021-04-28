console.log("working...");

let pizzaContainer = document.querySelector("#pizza-container");
let cart = document.querySelector("#cart");

let states = {
  "veg-pizza": 0,
  "non-veg-pizza": 0,
  sides: 0,
  beverages: 0,
  dessert: 0,
};

function getSize(x) {
  switch (x) {
    case "0":
      return "Small";
    case "1":
      return "Medium";
    case "2":
      return "Large";
  }
}

function getCrust(x) {
  switch (x) {
    case "0":
      return "Hand Tossed";
    case "1":
      return "Thin Crust";
    case "2":
      return "Cheese Burst";
    case "3":
      return "Pan Pizza";
  }
}

function clearCart() {
  let data = {
    orders: [],
  };
  localStorage.setItem("pizzaPlaceData", JSON.stringify(data));
}

function updateTQuantity(temp, id, x) {
  // let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  for (let i = 0; i < temp.orders.length; i++) {
    if (temp.orders[i].id == id) {
      temp.orders[i].tQuantity = x;
    }
  }
  //localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));
  return temp;
}

function displayCart() {
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  //console.log(temp.orders.length);
  if (temp.orders.length == 0) {
    cart.innerHTML = `<div class="empty-cart">
    <p>YOUR CART IS EMPTY</p>
    <p>Pls add some items from the menu.</p>
</div>`;
    return;
  }

  cart.innerHTML = "";
  let cartTemp = "<div class='cart-item-container'>";
  let totalPrice = 0;
  for (let i = 0; i < temp.orders.length; i++) {
    totalPrice += parseInt( temp.orders[i].price ) * parseInt(temp.orders[i].quantity);
    cartTemp += `<div class="cart-item">`;

    if (temp.orders[i].crust && temp.orders[i].size) {
      cartTemp += `<div>
        <p>${temp.orders[i].name}</p>
        <p id="S${temp.orders[i].size}C${
        temp.orders[i].crust
      }" class="pizza-details">${getSize(temp.orders[i].size)} | ${getCrust(
        temp.orders[i].crust
      )}</p> 
      </div>`;
    } else {
      cartTemp += `<div>
        <p>${temp.orders[i].name}<p>
      </div>`;
    }
    cartTemp += `<div id="${temp.orders[i].id}" class="add-to-cart-btn quantity cart-btn" >
        <button onclick="subC(this)" >-</button>
        <span>${temp.orders[i].quantity}</span>
        <button onclick="addC(this)">+</button>
      </div>

      <p>&#8377; ${temp.orders[i].price}</p>
     </div>`;
  }
  cart.innerHTML = cartTemp + "</div>";
  cart.innerHTML += `<div class="checkout">
    <p>Subtotal</p>
    <p>&#8377; ${totalPrice}</p>
    <button>Checkout</button>
  </div>`
  //console.log(cart);
}

function pushOrder(ele) {
  //console.log(ele.parentElement.children[3]);
  //console.log("in push order");
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  //if (!JSON.parse(ele.getAttribute("order"))) {
  let order = {
    id: ele.parentElement.id,
    name: ele.parentElement.children[1].children[0].innerText,
    price: ele.parentElement.children[0].children[1].innerText.split(" ")[1],
    quantity: 1,
  };
  if (
    ele.parentElement.id.charAt(0) == "v" ||
    ele.parentElement.id.charAt(0) == "n"
  ) {
    order["size"] =
      ele.parentElement.children[3].firstElementChild.children[1].value;
    order["crust"] =
      ele.parentElement.children[3].children[1].children[1].value;
  }
  let total = 0;
  order["tQuantity"] = 1;
  for (let i = 0; i < temp.orders.length; i++) {
    if (temp.orders[i].id == ele.parentElement.id) {
      total += temp.orders[i].quantity;
    }
  }
  total += 1;
  for (let i = 0; i < temp.orders.length; i++) {
    if (temp.orders[i].id == ele.parentElement.id) {
      temp.orders[i].tQuantity = total;
    }
  }
  order["tQuantity"] = total != 0 ? total : 1;

  temp.orders.push(order);
  //console.log(0);
  ele.setAttribute("order", "true");
  ele.removeAttribute("onclick");

  ele.innerHTML = `<button onclick="subQ(this)">-</button>
                     <span>${order.tQuantity}</span>
                    <button onclick="addQ(this)">+</button>`;
  ele.classList.add("quantity");
  // }
  localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));

  displayCart();
}

async function getPizza(string) {
  for (const item in states) {
    if (item != string) {
      states[item] = 0;
    }
  }
  if (states[string] != 0) {
    return;
  }
  window.scrollTo(0, 0);
  states[string] = 1;
  pizzaContainer.innerHTML = "";
  let response = await fetch(string + ".json");
  let data = await response.json();
  for (let i = 0; i < data.items.length; i++) {
    let pizza = data.items[i];
    let pizzaId = string.charAt(0) + i;
    let pizzaCard = `<div id="${pizzaId}" class="pizza-card">
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
      pizzaCard += `<hr><div class="modify-pizza">
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

    </div>`;
    }
    let pizzaCardTemp = `<div class="add-to-cart-btn" onclick="pushOrder(this)" order="false">Add to cart</div>
      </div>`;
    let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
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

function getOrderIndex(id, size, crust) {
  //console.log(size,crust);
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  for (let i = 0; i < temp.orders.length; i++) {
    //console.log(temp.orders[i].id , id , temp.orders[i].size , size , temp.orders[i].crust , crust);
    if (temp.orders[i].id == id) {
      if (
        temp.orders[i].size != undefined &&
        temp.orders[i].crust != undefined
      ) {
        if (temp.orders[i].size == size && temp.orders[i].crust == crust) {
          return i;
        }
      } else {
        return i;
      }
    }
  }
}

function addQ(ele) {
  /*
  order["size"] =
        ele.parentElement.children[3].firstElementChild.children[1].value;
      order["crust"] =
        ele.parentElement.children[3].children[1].children[1].value;
  */
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  let parent = ele.parentElement.parentElement;
  let size;
  let crust;
  if (parent.id.charAt(0) == "v" || parent.id.charAt(0) == "n") {
    size = parent.children[3].firstElementChild.children[1].value;
    crust = parent.children[3].children[1].children[1].value;
  }
  let i = getOrderIndex(parent.id, size, crust);
  //console.log("i",i);
  if (i != undefined) {
    temp.orders[i].quantity += 1;
    temp.orders[i].tQuantity += 1;
    temp = updateTQuantity(temp, parent.id, temp.orders[i].tQuantity);
  } else {
    //console.log(ele.parentElement);
    pushOrder(ele.parentElement);
    return;
  }
  ele.parentElement.children[1].innerText = temp.orders[i].tQuantity;
  localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));

  displayCart();
}

function subQ(ele) {
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  let parent = ele.parentElement.parentElement;
  let size;
  let crust;
  //console.log(ele.parentElement.parentElement.id);
  if (
    ele.parentElement.parentElement.id.charAt(0) == "v" ||
    ele.parentElement.parentElement.id.charAt(0) == "n"
  ) {
    size = parent.children[3].firstElementChild.children[1].value;
    crust = parent.children[3].children[1].children[1].value;
  }
  let i = getOrderIndex(parent.id, size, crust);

  if (i != undefined) {
    temp.orders[i].quantity -= 1;
    temp.orders[i].tQuantity -= 1;

    temp = updateTQuantity(temp, parent.id, temp.orders[i].tQuantity);
  } else {
    alert("Remove from the cart");
    return;
  }
  let tQ = temp.orders[i].tQuantity;
  if (temp.orders[i].quantity < 1) {
    temp.orders.splice(i, 1);
    if (tQ < 1) {
      let btn = document.createElement("div");
      btn.setAttribute("class", "add-to-cart-btn");
      btn.setAttribute("onclick", "pushOrder(this)");
      btn.setAttribute("order", "false");
      btn.innerText = "Add to cart";
      parent.removeChild(parent.children[parent.children.length - 1]);
      parent.appendChild(btn);
    }
    //ele.parentElement.children[1].innerText = tQ;
    //displayCart();
    //return;
  }
  localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));
  ele.parentElement.children[1].innerText = tQ;

  displayCart();
}

function addC(ele) {
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  let id = ele.parentElement.id;
  let crust;
  let size;

  if (id.charAt(0) == "v" || id.charAt(0) == "n") {
    let sc = ele.parentElement.previousSibling.children[1].id;
    size = sc.charAt(1);
    crust = sc.charAt(3);
    //console.log(size,crust);
  }
  let i = getOrderIndex(id, size, crust);
  temp.orders[i].quantity += 1;
  temp.orders[i].tQuantity += 1;
  temp = updateTQuantity(temp, id, temp.orders[i].tQuantity);
  localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));
  let btn = document.querySelector(`#${id} .add-to-cart-btn`);
  if (btn != null) {
    btn.children[1].innerText = temp.orders[i].tQuantity;
  }

  displayCart();
}

function subC(ele) {
  let temp = JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  let id = ele.parentElement.id;
  let cartBtn = document.querySelector(`#${id} .add-to-cart-btn`);
  let crust;
  let size;

  if (id.charAt(0) == "v" || id.charAt(0) == "n") {
    let sc = ele.parentElement.previousSibling.children[1].id;
    size = sc.charAt(1);
    crust = sc.charAt(3);
    //console.log(size,crust);
  }
  let i = getOrderIndex(id, size, crust);
  temp.orders[i].quantity -= 1;
  temp.orders[i].tQuantity -= 1;
  temp = updateTQuantity(temp, id, temp.orders[i].tQuantity);
  let tQ = temp.orders[i].tQuantity;
  if (temp.orders[i].quantity < 1) {
    //console.log("in tq");
    tQ = temp.orders[i].tQuantity;
    temp.orders.splice(i, 1);
    if (tQ < 1) {
      let btn = document.createElement("div");
      btn.setAttribute("class", "add-to-cart-btn");
      btn.setAttribute("onclick", "pushOrder(this)");
      btn.setAttribute("order", "false");
      btn.innerText = "Add to cart";
      let parent = document.querySelector(`#${id}`);
      parent.removeChild(parent.children[parent.children.length - 1]);
      parent.appendChild(btn);
    }
  }
  localStorage.setItem("pizzaPlaceData", JSON.stringify(temp));
  displayCart();
  if (cartBtn != null) {
    cartBtn.children[1].innerText = tQ;
  }
}

(function main() {
  if (localStorage.length == 0) {
    clearCart();
  }
  getPizza("veg-pizza");
  displayCart();
})();
