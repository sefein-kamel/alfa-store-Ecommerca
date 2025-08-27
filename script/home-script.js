// LOGOUT
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('current_user_email');
    window.location.replace("../index.html");
  });
}

// HERO SLIDER
const images = ["../images/Products.jpg", "../images/hero1.jpg", "../images/hero2.jpg", "../images/hero3.jpg"];
let index = 0;
let interval;
function showImage() {
  const slider = document.getElementById("slider");
  if (!slider) return;
  slider.src = images[index];
}
function next() { index = (index + 1) % images.length; showImage(); }
function prev() { index = (index - 1 + images.length) % images.length; showImage(); }
interval = setInterval(next, 3000);
showImage();

// DISPLAY PRODUCTS
function displayProducts(products) {
  const container = document.getElementById("products");
  if (!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card my-3">
        <div>
          <img src="${p.img}" class="card-img-top" alt="${p.name}" />
        </div>
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-price">${p.price} EGP</p>
          <div class="buttons d-flex justify-content-around">
            <a href="product.html?id=${p.id}" class="btn btn-primary">
              more details <i class="bi bi-plus-square"></i>
            </a>
            <button class="btn btn-primary btn-add" data-id="${p.id}">
              Add to cart <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// FILTER FUNCTION
function filterProducts(cat) {
  if (cat === "all") displayProducts(productsData);
  else displayProducts(productsData.filter(p => p.category === cat));
}

// SET ACTIVE CLASS FOR FILTERS (once)
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("#filters li");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

// EVENT DELEGATION: HANDLE Add to cart BUTTONS
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.btn-add");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  addToCart(id);
});

// CART UTILS
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (err) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(id) {
  if (typeof id !== "number" || isNaN(id)) {
    showMessage("Error", "#f44336");
    return;
  }
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    const product = productsData.find(p => p.id === id);
    if (!product) {
      showMessage("Product not available", "#f44336");
      return;
    }
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showMessage("✅ Product added to cart");
}

// MESSAGE BOX
function showMessage(text, color = "#4caf50") {
  const msgBox = document.getElementById("message");
  if (!msgBox) return;
  msgBox.innerText = text;
  msgBox.style.background = color;
  msgBox.style.display = "inline-block";
  msgBox.style.opacity = "1";
  setTimeout(() => {
    msgBox.style.opacity = "0";
    setTimeout(() => (msgBox.style.display = "none"), 500);
  }, 2000);
}

// INIT ON LOAD (Display products)
window.addEventListener("load", () => {
  displayProducts(productsData);
});
