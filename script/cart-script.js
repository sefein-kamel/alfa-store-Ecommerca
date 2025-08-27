// logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('current_user_email');
  window.location.replace("../index.html");
});

// ---- CART PAGE ----
(function () {
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total");

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function render() {
    if (!cartEl || !totalEl) return;

    cartEl.innerHTML = "";

    if (cart.length === 0) {
      cartEl.innerHTML = "<h3>Your cart is empty</h3>";
      totalEl.textContent = "Total Price: 0 EGP";
      save();
      return;
    }

    cart.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.img}" class="img-fluid rounded-start" alt="${item.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Price: ${item.price * item.qty} EGP</p>
              <div class="d-flex align-items-center gap-2 justify-content-center">
                <button class="btn btn-sm btn-outline-danger js-decrease" data-index="${index}">-</button>
                <span class="fw-semibold">${item.qty}</span>
                <button class="btn btn-sm btn-outline-success js-increase" data-index="${index}">+</button>
                <button class="btn btn-sm btn-danger ms-3 js-remove" data-index="${index}">Remove</button>
              </div>
            </div>
          </div>
        </div>`;
      cartEl.appendChild(card);
    });

    const total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    totalEl.textContent = `Total Price: ${total} EGP`;
    save();
  }

  // Single delegated listener (works for newly rendered buttons)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.classList.contains("js-remove")) {
      const i = +btn.dataset.index;
      cart.splice(i, 1);
      render();
    } else if (btn.classList.contains("js-increase")) {
      const i = +btn.dataset.index;
      cart[i].qty++;
      render();
    } else if (btn.classList.contains("js-decrease")) {
      const i = +btn.dataset.index;
      cart[i].qty--;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      render();
    }
  });  
  
  render();
})();


const buyBtn = document.querySelector("#buy");

buyBtn.addEventListener("click", function () {
  showMessage("Order Shipped ✅", "#4caf50");

  const container = document.querySelector("#cart");
  container.innerHTML = "";

  const totalPriceEl = document.getElementById("total");
  totalPriceEl.innerText = "Total Price: 0 EGP";

  localStorage.removeItem("cart");
});

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
