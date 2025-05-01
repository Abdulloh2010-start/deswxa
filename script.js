document.addEventListener("DOMContentLoaded", () => {
  const pizzaList = document.querySelector("#pizza-list");
  const categoryButtons = document.querySelector("#category-buttons");
  const sortSelect = document.querySelector("#sort-select");
  const cartButton = document.querySelector("#cart-button");
  const cartCount = document.querySelector("#cart-count");
  const cartPrice = document.querySelector("#cart-price");
  const categoryButtonList = document.querySelectorAll("#category-buttons button");
  const API_URL = "https://run.mocky.io/v3/a28b5cfb-169c-4878-92eb-8a6481fbf1f4";
  let selectedCategory = 'all';
  let cart = [];
  async function fetchPizzas(category = 'all', sortBy = 'rating') {
    pizzaList.innerHTML = '<p class="loader"></p>';
    try {
      const res = await fetch(API_URL);
      let pizzas = await res.json();
      if (category !== 'all') {
        pizzas = pizzas.filter(pizza => pizza.category === category);
      }
      pizzas.sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "alphabet") return a.name.localeCompare(b.name);
        return b.rating - a.rating;
      });
      renderPizzas(pizzas);
    } catch (error) {
      console.log(error);
    }
  }
  function renderPizzas(pizzas) {
    pizzaList.innerHTML = pizzas.map(pizza => `
      <div class="pizza-item">
        <img src="img/image 2.png" alt="${pizza.name}" />
        <h3>${pizza.name}</h3>
          <div class="size-menu">
            <button class="small" id="active">Тонкое</button>
            <button class="big">Традиционное</button>
            <button class="sm" id="active">26 см.</button>
            <button class="sm">30 см.</button>
            <button class="sm">40 см.</button>
          </div>
        <div class="bottom">
          <span>${pizza.price} ₽</span>
          <button data-id="${pizza.id}">+ Добавить</button>
        </div>
      </div>
    `).join('');
    const pizzaButtons = document.querySelectorAll(".pizza-item button");
    pizzaButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const pizza = pizzas.find(p => p.id === id);
        addToCart(pizza);
      });
    });
 }
 
  function addToCart(pizza) {
    const existing = cart.find(item => item.id === pizza.id);
    if (existing) {
      existing.count++;
    } else {
      cart.push({ ...pizza, count: 1 });
    }
    updateCartUI();
    saveCart();
  }
  function updateCartUI() {
    const totalCount = cart.reduce((sum, p) => sum + p.count, 0);
    const totalPrice = cart.reduce((sum, p) => sum + p.price * p.count, 0);
    cartCount.textContent = totalCount;
    cartPrice.textContent = `${totalPrice} ₽`;
  }
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function loadCart() {
    const data = localStorage.getItem("cart");
    if (data) {
      cart = JSON.parse(data);
      updateCartUI();
    }
  }
  categoryButtons.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      categoryButtonList.forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      selectedCategory = e.target.dataset.category;
      fetchPizzas(selectedCategory, sortSelect.value);
    }
  });
  sortSelect.addEventListener("change", () => {
    fetchPizzas(selectedCategory, sortSelect.value);
  });
  cartButton.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
  loadCart();
  fetchPizzas();
});