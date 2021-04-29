console.log("cart...");

let addressList = document.querySelector("#address-list");
let cart = document.querySelector("#cart");
let addressBox = document.querySelector("#address-details");

function getAddresses() {
  return JSON.parse(window.localStorage.getItem("savedAddresses"));
}
function setAddresses(address) {
  localStorage.setItem("savedAddresses", JSON.stringify(address));
}
function showAddressBox(){
  addressBox.classList.add("show-address-box");
}
function hideAddressBox(){
addressBox.classList.remove("show-address-box");
}

// displays address in HTML page
function displayAddresses() {
  let temp = getAddresses();
  addressList.innerHTML = "";
  for (let i = 0; i < temp.addresses.length; i++) {
    addressList.innerHTML += `<div class="address-card">
                                  <p>${temp.addresses[i].type}</p>
                                  <p>${
                                    temp.addresses[i].HNo != undefined
                                      ? temp.addresses[i].HNo
                                      : ""
                                  } ${temp.addresses[i].address}, ${temp.addresses[i].city}, ${temp.addresses[i].state}</p>
                                  <button class="address-card-btn deliver-here">DELIVER HERE</button>
                                </div>`;
  }
  addressList.innerHTML += `<div class="address-card">
                                <p>Add New Address</p>
                                <p>&nbsp;</p>
                                <button class="address-card-btn add-me" onclick="showAddressBox()">ADD NEW</button>
                              </div>`;
}

function addAddress(){
  let inputFields = document.querySelectorAll(".address-input-container input[type='text']");
  let flag=true;
  inputFields.forEach(ele=>{
    if(ele.value.length == 0){
      flag=false;
      ele.placeholder += " cannot be empty";
      ele.classList.add("empty-address");
    }
  });
  if(flag){
    let temp = getAddresses();
    let data = { type: "Home", HNo: inputFields[1].value, address: inputFields[0].value, city: inputFields[2].value, state: inputFields[3].value };
    temp.addresses.push(data);
    setAddresses(temp);
    displayAddresses();
    hideAddressBox();

    inputFields.forEach(ele=>{
      ele.classList.remove("empty-address");
      ele.placeholder = ele.getAttribute("description");
      ele.value="";
    });
  }
  
}
(function main() {
  // making a template in case local storage is empty
  if (localStorage.getItem("pizzaPlaceData") == null) {
    clearCart();
  }
  if (localStorage.getItem("savedAddresses") == null) {
    let sample = {
      addresses: []
    };
    localStorage.setItem("savedAddresses",JSON.stringify(sample));
  }
  displayAddresses();
  displayCart("Pay");
})();
