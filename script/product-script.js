// log out
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('current_user_email'); 
    window.location.replace("../index.html");
  });
}

// show single product details
function showProductDetails() {
  const container = document.getElementById("product-details");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const p = productsData.find(x => x.id === id);
  if (!p) {
    container.innerHTML = "<p>Product not found</p>";
    return;
  }
  container.innerHTML = `
    <div class="product-container">
      <div class="product-details">
        <h2>${p.name}</h2>
        <p class="product-price">${p.price} EGP</p>
        <p class="product-description">${p.desc}</p>
        <button onclick="addToCart(${p.id})" class="btn btn-primary btn-alfa">
          Add to Cart <i class="bi bi-cart-plus"></i>
        </button>
      </div>
      <div class="product-img">
        <img id="product-img" src="${p.img}" />
      </div>
    </div>
  `;
}

// cart utils
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// add to cart
function addToCart(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty++;
  } else {
    const product = productsData.find(p => p.id === id);
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

showProductDetails();
