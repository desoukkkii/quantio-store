// ======================== GLOBAL VARIABLES ========================
let allProducts = []; // store fetched products
let cart = []; // { id, title, price, image, category, quantity }

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartCountNav = document.getElementById("cartCountNav");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalPriceSpan = document.getElementById("cartTotalPrice");
const resultStats = document.getElementById("resultStats");

// ======================== FETCH PRODUCTS FROM API (with loading & error) ========================
async function fetchProducts() {
  // Show loading state
  productsGrid.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-pulse"></i> Fetching fresh products...</div>`;
  try {
    const response = await fetch("https://dummyjson.com/products?limit=30");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    allProducts = data.products;
    populateCategories(); // extract unique categories for filter dropdown
    renderProducts(allProducts);
    updateResultStats(allProducts.length, allProducts.length);
  } catch (error) {
    console.error("Fetch error:", error);
    productsGrid.innerHTML = `<div class="error-state"><i class="fas fa-exclamation-triangle"></i> Failed to load products. Please refresh or try again later.<br>${error.message}</div>`;
  }
}

// ========== Extract unique categories for select dropdown ==========
function populateCategories() {
  const categoriesSet = new Set(allProducts.map((p) => p.category));
  // clear existing options except "all"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  for (let cat of categoriesSet) {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  }
}

// ========== Filter & Search Logic ==========
function filterAndSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  let filtered = allProducts.filter((product) => {
    // search by title
    const matchesSearch = product.title.toLowerCase().includes(searchTerm);
    // filter by category
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
  updateResultStats(filtered.length, allProducts.length);
}

// update statistics text
function updateResultStats(shown, total) {
  if (shown === total) {
    resultStats.textContent = `Showing ${shown} products`;
  } else {
    resultStats.textContent = `Showing ${shown} of ${total} products`;
  }
}

// ========== RENDER PRODUCT CARDS ==========
function renderProducts(productsArray) {
  if (!productsArray.length) {
    productsGrid.innerHTML = `<div class="error-state" style="background:#f1f5f9;"><i class="fas fa-box-open"></i> No products found. Try another search!</div>`;
    return;
  }

  productsGrid.innerHTML = productsArray
    .map(
      (product) => `
        <div class="product-card" data-id="${product.id}">
            <img class="product-img" src="${product.thumbnail}" alt="${product.title}" loading="lazy" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}" data-title="${product.title.replace(/'/g, "\\'")}" data-price="${product.price}" data-img="${product.thumbnail}" data-category="${product.category}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `,
    )
    .join("");

  // Attach event listeners to all "Add to Cart" buttons after render
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const title = btn.dataset.title;
      const price = parseFloat(btn.dataset.price);
      const image = btn.dataset.img;
      const category = btn.dataset.category;
      addToCart({ id, title, price, image, category });
    });
  });
}

// ======================== CART LOGIC (LocalStorage, Qty, Remove) ========================
// Load cart from localStorage on init
function loadCartFromStorage() {
  const storedCart = localStorage.getItem("shopmate_cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  } else {
    cart = [];
  }
  updateCartUI();
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem("shopmate_cart", JSON.stringify(cart));
}

// Add product or increase quantity
function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1,
    });
  }
  saveCartToStorage();
  updateCartUI();
  // subtle visual feedback: optional open cart? Not mandatory, but friendly
  openCartSidebar(); // open cart after adding so user sees update (good UX)
}

// Update quantity (increase / decrease)
function updateQuantity(productId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex === -1) return;
  const newQuantity = cart[itemIndex].quantity + delta;
  if (newQuantity <= 0) {
    // remove item
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = newQuantity;
  }
  saveCartToStorage();
  updateCartUI();
}

// Remove product from cart
function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
}

// Update all cart related UI: navbar count, cart items list, total price, empty state
function updateCartUI() {
  // update navbar cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountNav.innerText = totalItems;

  // render cart sidebar items
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart feels light.</p>
                <small>Add some awesome products ✨</small>
            </div>
        `;
    cartTotalPriceSpan.innerText = `$0.00`;
    return;
  }

  let totalCartPrice = 0;
  cartItemsContainer.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      totalCartPrice += itemTotal;
      return `
            <div class="cart-item" data-cartid="${item.id}">
                <img class="cart-item-img" src="${item.image}" alt="${item.title}" onerror="this.src='https://placehold.co/70x70?text=Product'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn dec-qty" data-id="${item.id}">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn inc-qty" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div><strong>$${itemTotal.toFixed(2)}</strong></div>
            </div>
        `;
    })
    .join("");

  cartTotalPriceSpan.innerText = `$${totalCartPrice.toFixed(2)}`;

  // attach event listeners for +/- and remove
  document.querySelectorAll(".dec-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, -1);
    });
  });
  document.querySelectorAll(".inc-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      updateQuantity(id, 1);
    });
  });
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      removeCartItem(id);
    });
  });
}

// ======================== CART SIDEBAR CONTROLS ========================
function openCartSidebar() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
}

// ======================== EVENT LISTENERS & INIT ========================
function initEventListeners() {
  // open cart from navbar
  const cartIconBtn = document.getElementById("cartIconBtn");
  if (cartIconBtn) cartIconBtn.addEventListener("click", openCartSidebar);
  const closeBtn = document.getElementById("closeCartBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeCartSidebar);
  cartOverlay.addEventListener("click", closeCartSidebar);

  // search & filter
  searchInput.addEventListener("input", () => {
    filterAndSearch();
  });
  categoryFilter.addEventListener("change", () => {
    filterAndSearch();
  });

  // checkout button just alerts (beginner friendly)
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Add items first! 🛍️");
      } else {
        alert(
          `Thank you for shopping! 💳 Total: ${cartTotalPriceSpan.innerText}\nThis is a demo — enjoy building!`,
        );
      }
    });
  }
}

// ======================== START THE APPLICATION ========================
async function init() {
  loadCartFromStorage(); // load existing cart from localStorage
  initEventListeners();
  await fetchProducts(); // fetch and render products with loading handling
  // after products load, re-apply current filter if any (but fresh state)
  filterAndSearch(); // ensure consistency
}

init();
