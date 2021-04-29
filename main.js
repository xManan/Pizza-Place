// gets a number and return a corresponding pizza size ( not used in sides/beverages/dessert )

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
// gets a number and return a corresponding pizza crust ( not used in sides/beverages/dessert )
  
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
// clears the cart
  
  function clearCart() {
    let data = {
      orders: []
    };
    localStorage.setItem("pizzaPlaceData", JSON.stringify(data));
  }
// It updates the total quantity of all same pizzas with different sizes/crust 
  
  function updateTQuantity(temp, id, x) {
    // let temp = getOrders();
    for (let i = 0; i < temp.orders.length; i++) {
      if (temp.orders[i].id == id) {
        temp.orders[i].tQuantity = x;
      }
    }
    //setOrders(temp);
    return temp;
  }
// gets orders saved in local storage
  
  function getOrders() {
    return JSON.parse(window.localStorage.getItem("pizzaPlaceData"));
  }
//update orders in local storage
  
  function setOrders(orders) {
    localStorage.setItem("pizzaPlaceData", JSON.stringify(orders));
  }
// returns the index of an order that matches the id . optional params to match specific customisation. returns undefined in case not match is found
  
  function getOrderIndex(id, size, crust) {
    let temp = getOrders();
    for (let i = 0; i < temp.orders.length; i++) {
      if (temp.orders[i].id == id) {
        if (
          temp.orders[i].size != undefined &&
          temp.orders[i].crust != undefined
        ) {
          console.log(temp.orders[i].size == size, temp.orders[i].crust == crust);
          if (temp.orders[i].size == size && temp.orders[i].crust == crust) {
            return i;
          }
          //return -1;
          //return undefined;
        } else {
          return i;
        }
      }
    }
  }
// it displays all the orders to cart section in index.html
  
  function displayCart(string) {
    let temp = getOrders();
    if (temp.orders.length === 0) {
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
      totalPrice +=
        parseInt(temp.orders[i].price) * parseInt(temp.orders[i].quantity);
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
      <a href="cart.html">${string!=undefined ? string : "Checkout"}</a>
    </div>`;
    //console.log(cart);
  }
// it gets a reference to the button (ele) which calls the function. it pushes orders to local storage and updates the html using DOM manupilation
  
  function pushOrder(ele) {
  // storing the data in a variable

    let temp = getOrders();
  // setting up the order with some properties
    
    let order = {
      id: ele.parentElement.id,
      name: ele.parentElement.children[1].children[0].innerText,
      price: ele.parentElement.children[0].children[1].innerText.split(" ")[1],
      quantity: 1,
    };
  // checking if the order is a pizza by checking the id's first character ( v->veg-pizza, n->non-veg-pizza)

    if (
      ele.parentElement.id.charAt(0) == "v" ||
      ele.parentElement.id.charAt(0) == "n"
    ) {
    // if it is a pizza then add more properties such as size/crust (not available in sides/bevs/dessert) to the 'order' object 

      order["size"] =
        ele.parentElement.children[3].firstElementChild.children[1].value;
      order["crust"] =
        ele.parentElement.children[3].children[1].children[1].value;
    }
  // calculation the total quantity of a pizza including its custom pizzas

    let total = 0;
    order["tQuantity"] = 1; // setting default total quantity to 1 because this function can only be called if the pizza is not already in the cart
  // checking if there are custom pizzas and adding their quantities to total

    for (let i = 0; i < temp.orders.length; i++) {
      if (temp.orders[i].id == ele.parentElement.id) {
        total += temp.orders[i].quantity;
      }
    }
  // adding 1 for this order

    total += 1;
    for (let i = 0; i < temp.orders.length; i++) {
      if (temp.orders[i].id == ele.parentElement.id) {
        temp.orders[i].tQuantity = total;
      }
    }
    order["tQuantity"] = total != 0 ? total : 1; //shorthand for if-else statement
  // updating the 'temp' data variable 
    temp.orders.push(order);
    //updating the order btn
    ele.setAttribute("order", "true");
    ele.removeAttribute("onclick");
    ele.innerHTML = `<button onclick="subQ(this)">-</button>
                       <span>${order.tQuantity}</span>
                     <button onclick="addQ(this)">+</button>`;
    ele.classList.add("quantity");
    //updating local storage
    setOrders(temp);
    //updating the cart section
    displayCart();
  }
  
  // adding the same order functionality: argument passes is the reference to the '+' btn;
  function addQ(ele) {
    let temp = getOrders();
    // grabbing the reference for parent element (item-card which has the order-id)
    let parent = ele.parentElement.parentElement;
    let size;
    let crust;
    // checking if the item is pizza or a side
    if (parent.id.charAt(0) == "v" || parent.id.charAt(0) == "n") { 
      size = parent.children[3].firstElementChild.children[1].value;
      crust = parent.children[3].children[1].children[1].value;
    }
    
    let i = getOrderIndex(parent.id, size, crust);
    // checking the order already exists
    if (i != undefined) {
      temp.orders[i].quantity += 1;
      temp.orders[i].tQuantity += 1;
      temp = updateTQuantity(temp, parent.id, temp.orders[i].tQuantity);
    } else { // if order doesn't exits , place a new one
      pushOrder(ele.parentElement);
      return;
    }
    // updating the HTML
    ele.parentElement.children[1].innerText = temp.orders[i].tQuantity;
    setOrders(temp);
  
    displayCart();
  }
  
  // same as addQ but remove the order
  function subQ(ele) {
    let temp = getOrders();
    let parent = ele.parentElement.parentElement;
    let size;
    let crust;
    
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
    // updating the order btn
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
    }
    setOrders(temp);
    ele.parentElement.children[1].innerText = tQ;
    displayCart();
  }
  
  // add btn in cart section
  function addC(ele) {
    // same as addQ but the updating HTML is different
    let temp = getOrders();
    let id = ele.parentElement.id;
    let crust;
    let size;
  
    if (id.charAt(0) == "v" || id.charAt(0) == "n") {
      let sc = ele.parentElement.previousSibling.children[1].id;
      size = sc.charAt(1);
      crust = sc.charAt(3);
    }
    let i = getOrderIndex(id, size, crust);
    temp.orders[i].quantity += 1;
    temp.orders[i].tQuantity += 1;
    temp = updateTQuantity(temp, id, temp.orders[i].tQuantity);
    setOrders(temp);
    let btn = document.querySelector(`#${id} .add-to-cart-btn`);
    if (btn != null) {
      btn.children[1].innerText = temp.orders[i].tQuantity;
    }
    displayCart();
  }
  
  // remove btn in cart section
  function subC(ele) {
    let temp = getOrders();
    let id = ele.parentElement.id;
    let cartBtn = document.querySelector(`#${id} .add-to-cart-btn`);
    let crust;
    let size;
  
    if (id.charAt(0) == "v" || id.charAt(0) == "n") {
      let sc = ele.parentElement.previousSibling.children[1].id;
      size = sc.charAt(1);
      crust = sc.charAt(3);
    }
    let i = getOrderIndex(id, size, crust);
    temp.orders[i].quantity -= 1;
    temp.orders[i].tQuantity -= 1;
    temp = updateTQuantity(temp, id, temp.orders[i].tQuantity);
    let tQ = temp.orders[i].tQuantity;
    if (temp.orders[i].quantity < 1) {
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
    setOrders(temp);
    displayCart();
    if (cartBtn != null) {
      cartBtn.children[1].innerText = tQ;
    }
  }
  
  