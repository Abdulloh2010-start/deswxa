document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function updateCart() {
    cartList.innerHTML = "";
    if (cart.length === 0) {
      cartList.innerHTML = "<img class='imgLogo' src='img/shopping-cart-colour 1.png' alt='0'>";
      cartTotal.textContent = "0 ₽";
      cartCount.textContent = "0 шт.";
      return;
    }
    let totalSum = 0;
    let totalCount = 0;
    cart.forEach(item => {
      totalSum += item.price * item.count;
      totalCount += item.count;
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="img/image 2.png" alt="${item.name}" class="cart-img">
        <div class="cart-info">
          <h3>${item.name}</h3>
          <p>${item.dough}, ${item.size}</p>
        </div>
        <div class="cart-controls">
          <button class="minus">–</button>
          <b>${item.count}</b>
          <button class="plus">+</button>
        </div>
        <b class="cart-price">${item.price * item.count} ₽</b>
        <button class="remove">×</button>
      `;
      el.querySelector(".plus").onclick = () => {
        item.count++;
        saveCart();
        updateCart();
      };
      el.querySelector(".minus").onclick = () => {
        item.count--;
        if (item.count <= 0) cart = cart.filter(p => p.id !== item.id);
        saveCart();
        updateCart();
      };
      el.querySelector(".remove").onclick = () => {
        cart = cart.filter(p => p.id !== item.id);
        saveCart();
        updateCart();
      };
      cartList.appendChild(el);
    });
    cartTotal.textContent = `${totalSum} ₽`;
    cartCount.textContent = `${totalCount} шт.`;
  }
  updateCart();
});