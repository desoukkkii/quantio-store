// ─── State ────────────────────────────────────────────────────────
let products = [];
let cart = [];
let wishlist = [];
let filtered = [];
let displayCount = 12;
const PAGE_SIZE = 12;

const categoryIcons = {
  electronics: "fa-microchip",
  fragrances: "fa-spray-can",
  groceries: "fa-apple-whole",
  home: "fa-house",
  furniture: "fa-couch",
  clothing: "fa-shirt",
  accessories: "fa-clock",
  beauty: "fa-wand-magic-sparkles",
  skincare: "fa-hand-sparkles",
  sports: "fa-bicycle",
  automotive: "fa-car",
  vehicle: "fa-car",
  tools: "fa-screwdriver-wrench",
  books: "fa-book",
  jewelry: "fa-gem",
  food: "fa-utensils",
  default: "fa-tag",
};

// ─── DOM ──────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const grid = $("productsGrid");
const searchInput = $("searchInput");
const categoryFilter = $("categoryFilter");
const sortSelect = $("sortSelect");
const loadMoreBtn = $("loadMoreBtn");
const paginationInfo = $("paginationInfo");
const categoriesGrid = $("categoriesGrid");
const cartBtn = $("cartBtn");
const cartBadge = $("cartBadge");
const cartDrawer = $("cartDrawer");
const cartBody = $("cartBody");
const cartSubtotal = $("cartSubtotal");
const closeCart = $("closeCart");
const checkoutBtn = $("checkoutBtn");
const wishlistBtn = $("wishlistBtn");
const wishlistBadge = $("wishlistBadge");
const wishlistDrawer = $("wishlistDrawer");
const wishlistBody = $("wishlistBody");
const closeWishlist = $("closeWishlist");
const drawerOverlay = $("drawerOverlay");
const modalOverlay = $("modalOverlay");
const modalBody = $("modalBody");
const modalClose = $("modalClose");
const toastContainer = $("toastContainer");
const dealsBtn = $("dealsBtn");
const mobileMenuBtn = $("mobileMenuBtn");
const mobileMenuClose = $("mobileMenuClose");
const mainNav = $("mainNav");
const searchToggle = $("searchToggle");
const mobileSearch = $("mobileSearch");
const searchClose = $("searchClose");

// ─── Storage ──────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem("m_shop_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem("m_shop_" + key, JSON.stringify(data));
}

// ─── Toast ────────────────────────────────────────────────────────
function toast(msg, icon = "fa-circle-check") {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// ─── Helpers ──────────────────────────────────────────────────────
function starHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) s += '<i class="fas fa-star"></i>';
    else if (i === full && half) s += '<i class="fas fa-star-half-alt"></i>';
    else s += '<i class="far fa-star"></i>';
  }
  return s;
}

function escape(t) {
  const d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}

function getBadge(p) {
  if (p.discountPercentage > 20) return '<span class="product-badge sale">Sale</span>';
  if (p.discountPercentage > 0) return '<span class="product-badge sale">-' + Math.round(p.discountPercentage) + '%</span>';
  if (p.rating >= 4.8) return '<span class="product-badge bestseller">Best Seller</span>';
  if (p.stock && p.stock < 5) return '<span class="product-badge new">Low Stock</span>';
  return "";
}

function catIcon(cat) {
  const key = Object.keys(categoryIcons).find((k) => cat.toLowerCase().includes(k));
  return categoryIcons[key] || categoryIcons.default;
}

// ─── Fetch ────────────────────────────────────────────────────────
async function fetchProducts() {
  grid.innerHTML =
    '<div class="loading-state"><i class="fas fa-spinner fa-pulse"></i><span>Loading products…</span></div>';
  try {
    const res = await fetch("https://dummyjson.com/products?limit=60");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    products = data.products;
    populateCategories();
    renderCategories();
    applyFilters();
  } catch (err) {
    grid.innerHTML =
      '<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><h3>Something went wrong</h3><p>' +
      err.message +
      "</p></div>";
  }
}

function populateCategories() {
  const cats = [...new Set(products.map((p) => p.category))];
  categoryFilter.innerHTML =
    '<option value="all">All Categories</option>' +
    cats
      .map(
        (c) =>
          `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`,
      )
      .join("");
}

function renderCategories() {
  const cats = [...new Set(products.map((p) => p.category))];
  categoriesGrid.innerHTML = cats
    .slice(0, 8)
    .map(
      (c) =>
        `<a href="#" class="category-card" data-cat="${c}">
          <i class="fas ${catIcon(c)}"></i>
          <h3>${c.charAt(0).toUpperCase() + c.slice(1)}</h3>
          <span>${products.filter((p) => p.category === c).length} items</span>
        </a>`,
    )
    .join("");

  categoriesGrid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      categoryFilter.value = card.dataset.cat;
      displayCount = PAGE_SIZE;
      applyFilters();
      document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ─── Filter / Sort / Search ───────────────────────────────────────
function applyFilters() {
  const term = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const sort = sortSelect.value;

  filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(term);
    const matchCat = cat === "all" || p.category === cat;
    return matchSearch && matchCat;
  });

  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "rating":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "discount":
      filtered.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      break;
  }

  displayCount = PAGE_SIZE;
  renderGrid();
}

function showDiscounted() {
  categoryFilter.value = "all";
  searchInput.value = "";
  sortSelect.value = "discount";
  filtered = [...products].filter((p) => p.discountPercentage > 0);
  filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
  displayCount = PAGE_SIZE;
  renderGrid();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

// ─── Render Grid ──────────────────────────────────────────────────
function renderGrid() {
  const shown = filtered.slice(0, displayCount);
  const total = filtered.length;
  const hasMore = displayCount < total;

  if (!total) {
    grid.innerHTML =
      '<div class="empty-state"><i class="fas fa-search"></i><h3>No products found</h3><p>Try adjusting your search or filters.</p></div>';
    loadMoreBtn.style.display = "none";
    paginationInfo.textContent = "0 results";
    return;
  }

  grid.innerHTML = shown
    .map(
      (p, i) => `
    <div class="product-card" style="animation-delay:${i * 25}ms" data-id="${p.id}">
      <div class="product-card-img-wrap">
        ${getBadge(p)}
        <button class="wishlist-btn ${wishlist.includes(p.id) ? "saved" : ""}" data-wid="${p.id}" title="Wishlist">
          <i class="fas fa-heart"></i>
        </button>
        <img class="product-card-img" src="${p.thumbnail}" alt="${escape(p.title)}" loading="lazy" />
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${escape(p.category)}</div>
        <h3 class="product-card-title">${escape(p.title)}</h3>
        <div class="product-card-rating">
          ${starHTML(p.rating)}
          <span>(${p.rating.toFixed(1)})</span>
        </div>
        <div class="product-card-footer">
          <div class="product-card-price">
            $${p.price.toFixed(2)}
            ${p.discountPercentage > 0 ? `<span class="original">$${(p.price / (1 - p.discountPercentage / 100)).toFixed(2)}</span>` : ""}
          </div>
          <button class="add-to-cart-btn" data-cartid="${p.id}" title="Add to cart">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>`,
    )
    .join("");

  loadMoreBtn.style.display = hasMore ? "inline-flex" : "none";
  paginationInfo.textContent = `Showing ${shown.length} of ${total} product${total !== 1 ? "s" : ""}`;

  bindGridEvents();
}

function bindGridEvents() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".wishlist-btn") || e.target.closest(".add-to-cart-btn")) return;
      const id = parseInt(card.dataset.id);
      openModal(id);
    });
  });

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.wid));
    });
  });

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.cartid));
    });
  });
}

// ─── Load More ────────────────────────────────────────────────────
loadMoreBtn.addEventListener("click", () => {
  displayCount += PAGE_SIZE;
  renderGrid();
});

// ─── Cart ─────────────────────────────────────────────────────────
function addToCart(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const exist = cart.find((i) => i.id === id);
  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ id: p.id, title: p.title, price: p.price, image: p.thumbnail, qty: 1 });
  }
  save("cart", cart);
  updateCartUI();
  toast(`${p.title.slice(0, 32)}… added to cart`);
}

function updateQty(id, delta) {
  const idx = cart.findIndex((i) => i.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  save("cart", cart);
  updateCartUI();
}

function removeFromCart(id) {
  const item = cart.find((i) => i.id === id);
  cart = cart.filter((i) => i.id !== id);
  save("cart", cart);
  updateCartUI();
  if (item) toast(`${item.title.slice(0, 28)}… removed`, "fa-trash-can");
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = count;

  if (!cart.length) {
    cartBody.innerHTML =
      '<div class="empty-state"><i class="fas fa-cart-plus"></i><h3>Your cart is empty</h3><p>Looks like you haven\'t added anything yet.</p></div>';
    cartSubtotal.textContent = "$0.00";
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${i.image}" alt="${escape(i.title)}" loading="lazy" />
      <div class="cart-item-info">
        <div class="cart-item-title">${escape(i.title)}</div>
        <div class="cart-item-price">$${i.price.toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-dec="${i.id}"><i class="fas fa-minus"></i></button>
          <span class="cart-qty-value">${i.qty}</span>
          <button class="cart-qty-btn" data-inc="${i.id}"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="cart-item-total">$${(i.price * i.qty).toFixed(2)}</div>
      <button class="cart-item-remove" data-rem="${i.id}"><i class="fas fa-xmark"></i></button>
    </div>`,
    )
    .join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartSubtotal.textContent = `$${total.toFixed(2)}`;

  cartBody.querySelectorAll("[data-dec]").forEach((b) => b.addEventListener("click", () => updateQty(parseInt(b.dataset.dec), -1)));
  cartBody.querySelectorAll("[data-inc]").forEach((b) => b.addEventListener("click", () => updateQty(parseInt(b.dataset.inc), 1)));
  cartBody.querySelectorAll("[data-rem]").forEach((b) => b.addEventListener("click", () => removeFromCart(parseInt(b.dataset.rem))));
}

// ─── Wishlist ─────────────────────────────────────────────────────
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  save("wishlist", wishlist);
  updateWishlistUI();
  renderGrid();
}

function updateWishlistUI() {
  wishlistBadge.textContent = wishlist.length;

  if (!wishlist.length) {
    wishlistBody.innerHTML =
      '<div class="empty-state"><i class="fas fa-heart-crack"></i><h3>Wishlist is empty</h3><p>Save items you love for later.</p></div>';
    return;
  }

  wishlistBody.innerHTML = wishlist
    .map((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return "";
      return `
      <div class="wishlist-item">
        <img class="wishlist-item-img" src="${p.thumbnail}" alt="${escape(p.title)}" loading="lazy" />
        <div class="wishlist-item-info">
          <div class="wishlist-item-title">${escape(p.title)}</div>
          <div class="wishlist-item-price">$${p.price.toFixed(2)}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="btn-outline" style="padding:5px 10px;font-size:0.72rem" data-wcart="${p.id}"><i class="fas fa-cart-plus"></i></button>
          <button class="btn-outline" style="padding:5px 10px;font-size:0.72rem;border-color:var(--red-light);color:var(--red)" data-wrem="${p.id}"><i class="fas fa-trash-can"></i></button>
        </div>
      </div>`;
    })
    .join("");

  wishlistBody.querySelectorAll("[data-wcart]").forEach((b) =>
    b.addEventListener("click", () => {
      addToCart(parseInt(b.dataset.wcart));
    }),
  );
  wishlistBody.querySelectorAll("[data-wrem]").forEach((b) =>
    b.addEventListener("click", () => toggleWishlist(parseInt(b.dataset.wrem))),
  );
}

// ─── Modal ────────────────────────────────────────────────────────
function openModal(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    <div class="modal-img-wrap">
      <img class="modal-img" src="${p.thumbnail}" alt="${escape(p.title)}" />
    </div>
    <div class="modal-info">
      <span class="modal-category">${escape(p.category)}</span>
      <h2>${escape(p.title)}</h2>
      <div class="rating">
        ${starHTML(p.rating)}
        <span>${p.rating.toFixed(1)} (${p.reviews ? p.reviews.length : p.stock} reviews)</span>
      </div>
      <p class="modal-desc">${escape(p.description || "No description available.")}</p>
      <div class="modal-meta">
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Brand</div>
          <div class="modal-meta-item-value">${escape(p.brand || "Generic")}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Availability</div>
          <div class="modal-meta-item-value">${p.stock > 0 ? '<span style="color:var(--green)">In Stock</span>' : '<span style="color:var(--red)">Out of Stock</span>'} (${p.stock} units)</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">SKU</div>
          <div class="modal-meta-item-value">${escape(p.sku || "—")}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Weight</div>
          <div class="modal-meta-item-value">${p.weight ? p.weight + "g" : "—"}</div>
        </div>
      </div>
      <div class="modal-price-row">
        <span class="current">$${p.price.toFixed(2)}</span>
        ${p.discountPercentage > 0 ? `<span class="original">$${(p.price / (1 - p.discountPercentage / 100)).toFixed(2)}</span> <span style="color:var(--red);font-size:0.85rem;font-weight:600">Save ${Math.round(p.discountPercentage)}%</span>` : ""}
      </div>
      <div class="modal-actions">
        <button class="btn-primary" id="modalAddCart"><i class="fas fa-cart-plus"></i> Add to Cart</button>
        <button class="btn-outline" id="modalWish"><i class="fas fa-heart"></i></button>
      </div>
    </div>
  `;
  $("modalAddCart").addEventListener("click", () => addToCart(p.id));
  $("modalWish").addEventListener("click", () => toggleWishlist(p.id));
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ─── Drawers ──────────────────────────────────────────────────────
function openDrawer(el) {
  el.classList.add("open");
  drawerOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  cartDrawer.classList.remove("open");
  wishlistDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ─── Checkout ─────────────────────────────────────────────────────
function handleCheckout() {
  if (!cart.length) {
    toast("Your cart is empty", "fa-cart-empty");
    return;
  }
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  const msg = shipping === 0
    ? `Total charged: $${total.toFixed(2)} (free shipping applied!)`
    : `Total charged: $${total.toFixed(2)} (incl. $${shipping.toFixed(2)} shipping)`;
  cart = [];
  save("cart", cart);
  updateCartUI();
  closeDrawers();
  toast(msg, "fa-circle-check");
}

// ─── Events ───────────────────────────────────────────────────────
searchInput.addEventListener("input", () => { displayCount = PAGE_SIZE; applyFilters(); });
categoryFilter.addEventListener("change", () => { displayCount = PAGE_SIZE; applyFilters(); });
sortSelect.addEventListener("change", () => { displayCount = PAGE_SIZE; applyFilters(); });

dealsBtn.addEventListener("click", showDiscounted);

cartBtn.addEventListener("click", () => { closeDrawers(); openDrawer(cartDrawer); });
closeCart.addEventListener("click", closeDrawers);

wishlistBtn.addEventListener("click", () => { closeDrawers(); openDrawer(wishlistDrawer); });
closeWishlist.addEventListener("click", closeDrawers);

drawerOverlay.addEventListener("click", closeDrawers);

checkoutBtn.addEventListener("click", handleCheckout);

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawers(); } });

mobileMenuBtn.addEventListener("click", () => mainNav.classList.add("open"));
mobileMenuClose.addEventListener("click", () => mainNav.classList.remove("open"));
document.addEventListener("click", (e) => {
  if (mainNav.classList.contains("open") && !mainNav.contains(e.target) && e.target !== mobileMenuBtn) {
    mainNav.classList.remove("open");
  }
});

searchToggle.addEventListener("click", () => mobileSearch.classList.toggle("open"));
searchClose.addEventListener("click", () => mobileSearch.classList.remove("open"));

$("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  if (input.value.trim()) {
    toast("Thanks! You're subscribed — check your inbox for 10% off.");
    input.value = "";
  }
});

// ─── Init ─────────────────────────────────────────────────────────
(async function init() {
  cart = load("cart", []);
  wishlist = load("wishlist", []);
  updateCartUI();
  updateWishlistUI();
  await fetchProducts();
})();
