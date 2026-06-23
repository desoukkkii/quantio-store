// ─── State ────────────────────────────────────────────────────────
let products = [];
let cart = [];
let wishlist = [];
let filtered = [];
let displayCount = 12;
const PAGE_SIZE = 12;

const categoryIcons = {
  electronics: "fa-microchip",
  fragrances: "fa-spray-can-sparkles",
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

// ─── DOM refs ─────────────────────────────────────────────────────
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
    const raw = localStorage.getItem("meridian_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem("meridian_" + key, JSON.stringify(data));
  } catch {
    /* quota exceeded — silently skip */
  }
}

// ─── Toast ────────────────────────────────────────────────────────
function toast(msg, icon = "fa-circle-check", type = "") {
  const el = document.createElement("div");
  el.className = ["toast", type].filter(Boolean).join(" ");
  el.setAttribute("role", "status");
  el.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i><span>${msg}</span>`;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 2900);
}

// ─── Helpers ──────────────────────────────────────────────────────
function starHTML(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) s += '<i class="fas fa-star" aria-hidden="true"></i>';
    else if (i === full && half)
      s += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    else s += '<i class="far fa-star" aria-hidden="true"></i>';
  }
  return s;
}

function esc(t) {
  const d = document.createElement("div");
  d.textContent = String(t);
  return d.innerHTML;
}

function getBadge(p) {
  if (p.discountPercentage > 20)
    return `<span class="product-badge sale">-${Math.round(p.discountPercentage)}%</span>`;
  if (p.discountPercentage > 0)
    return `<span class="product-badge sale">Sale</span>`;
  if (p.rating >= 4.8)
    return `<span class="product-badge bestseller">Best Seller</span>`;
  if (p.stock > 0 && p.stock < 5)
    return `<span class="product-badge new">Low Stock</span>`;
  return "";
}

function catIcon(cat) {
  const key = Object.keys(categoryIcons).find((k) =>
    cat.toLowerCase().includes(k),
  );
  return categoryIcons[key] || categoryIcons.default;
}

function fmt(n) {
  return "$" + Number(n).toFixed(2);
}

// ─── Fetch ────────────────────────────────────────────────────────
async function fetchProducts() {
  grid.innerHTML = `
    <div class="loading-state" role="status" aria-live="polite">
      <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
      <span>Loading products…</span>
    </div>`;

  try {
    const res = await fetch("https://dummyjson.com/products?limit=60");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    products = data.products;
    populateCategories();
    renderCategories();
    applyFilters();
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" role="alert">
        <div class="empty-icon"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i></div>
        <h3>Something went wrong</h3>
        <p>${esc(err.message)}</p>
      </div>`;
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
      (c) => `
    <a href="#" class="category-card reveal" data-cat="${c}" role="listitem" aria-label="${c}, ${products.filter((p) => p.category === c).length} items">
      <i class="fas ${catIcon(c)}" aria-hidden="true"></i>
      <h3>${esc(c.charAt(0).toUpperCase() + c.slice(1))}</h3>
      <span>${products.filter((p) => p.category === c).length} items</span>
    </a>
  `,
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

  observeReveal();
}

// ─── Filter / Sort / Search ───────────────────────────────────────
function applyFilters() {
  const term = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const sort = sortSelect.value;

  filtered = products.filter((p) => {
    const matchSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      (p.brand || "").toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
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
      filtered.sort(
        (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
      );
      break;
  }

  displayCount = PAGE_SIZE;
  renderGrid();
}

function showDiscounted() {
  categoryFilter.value = "all";
  searchInput.value = "";
  sortSelect.value = "discount";
  filtered = [...products]
    .filter((p) => p.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);
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
    grid.innerHTML = `
      <div class="empty-state" role="status">
        <div class="empty-icon"><i class="fas fa-search" aria-hidden="true"></i></div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>`;
    loadMoreBtn.style.display = "none";
    paginationInfo.textContent = "0 results";
    return;
  }

  grid.innerHTML = shown
    .map((p, i) => {
      const inWish = wishlist.includes(p.id);
      const origPrice =
        p.discountPercentage > 0
          ? `<span class="original">${fmt(p.price / (1 - p.discountPercentage / 100))}</span>`
          : "";
      return `
    <div class="product-card" style="animation-delay:${i * 20}ms" data-id="${p.id}" role="listitem">
      <div class="product-card-img-wrap">
        ${getBadge(p)}
        <button class="wishlist-btn ${inWish ? "saved" : ""}"
          data-wid="${p.id}"
          aria-label="${inWish ? "Remove from wishlist" : "Add to wishlist"}: ${esc(p.title)}"
          aria-pressed="${inWish}">
          <i class="fas fa-heart" aria-hidden="true"></i>
        </button>
        <img class="product-card-img"
          src="${esc(p.thumbnail)}"
          alt="${esc(p.title)}"
          loading="lazy"
          decoding="async"
          width="200" height="200" />
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${esc(p.category)}</div>
        <h3 class="product-card-title">${esc(p.title)}</h3>
        <div class="product-card-rating" aria-label="Rating: ${p.rating.toFixed(1)} out of 5">
          ${starHTML(p.rating)}
          <span>(${p.rating.toFixed(1)})</span>
        </div>
        <div class="product-card-footer">
          <div class="product-card-price">
            ${fmt(p.price)}${origPrice}
          </div>
          <button class="add-to-cart-btn" data-cartid="${p.id}" aria-label="Add ${esc(p.title)} to cart">
            <i class="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>`;
    })
    .join("");

  loadMoreBtn.style.display = hasMore ? "flex" : "none";
  paginationInfo.textContent = `Showing ${shown.length} of ${total} product${total !== 1 ? "s" : ""}`;

  bindGridEvents();
  observeReveal();
}

function bindGridEvents() {
  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".wishlist-btn") ||
        e.target.closest(".add-to-cart-btn")
      )
        return;
      openModal(parseInt(card.dataset.id));
    });

    // Keyboard
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (
          !e.target.closest(".wishlist-btn") &&
          !e.target.closest(".add-to-cart-btn")
        ) {
          openModal(parseInt(card.dataset.id));
        }
      }
    });
  });

  grid.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.wid));
    });
  });

  grid.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.cartid));
      // Animate button
      btn.style.transform = "scale(0.85)";
      setTimeout(() => (btn.style.transform = ""), 200);
    });
  });
}

// ─── Load More ────────────────────────────────────────────────────
loadMoreBtn.addEventListener("click", () => {
  displayCount += PAGE_SIZE;
  renderGrid();
  // Smooth focus to first new card
  setTimeout(() => {
    const cards = grid.querySelectorAll(".product-card");
    if (cards[displayCount - PAGE_SIZE])
      cards[displayCount - PAGE_SIZE].focus();
  }, 100);
});

// ─── Cart ─────────────────────────────────────────────────────────
function addToCart(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.thumbnail,
      qty: 1,
    });
  }
  save("cart", cart);
  updateCartUI();
  // Badge pulse
  cartBadge.style.transform = "scale(1.4)";
  setTimeout(() => (cartBadge.style.transform = ""), 200);
  toast(
    `Added to cart: ${p.title.slice(0, 36)}${p.title.length > 36 ? "…" : ""}`,
  );
}

function updateQty(id, delta) {
  const idx = cart.findIndex((i) => i.id === id);
  if (idx === -1) return;
  cart[idx].qty = Math.max(0, cart[idx].qty + delta);
  if (cart[idx].qty === 0) cart.splice(idx, 1);
  save("cart", cart);
  updateCartUI();
}

function removeFromCart(id) {
  const item = cart.find((i) => i.id === id);
  cart = cart.filter((i) => i.id !== id);
  save("cart", cart);
  updateCartUI();
  if (item) toast(`Removed: ${item.title.slice(0, 30)}…`, "fa-trash-can");
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = count;

  if (!cart.length) {
    cartBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-cart-plus" aria-hidden="true"></i></div>
        <h3>Your cart is empty</h3>
        <p>Add something you love to get started.</p>
      </div>`;
    cartSubtotal.textContent = "$0.00";
    return;
  }

  cartBody.innerHTML = cart
    .map(
      (i) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${esc(i.image)}" alt="${esc(i.title)}" loading="lazy" width="60" height="60" />
      <div class="cart-item-info">
        <div class="cart-item-title">${esc(i.title)}</div>
        <div class="cart-item-price">${fmt(i.price)} each</div>
        <div class="cart-item-qty">
          <button class="cart-qty-btn" data-dec="${i.id}" aria-label="Decrease quantity of ${esc(i.title)}">
            <i class="fas fa-minus" aria-hidden="true"></i>
          </button>
          <span class="cart-qty-value" aria-label="Quantity: ${i.qty}">${i.qty}</span>
          <button class="cart-qty-btn" data-inc="${i.id}" aria-label="Increase quantity of ${esc(i.title)}">
            <i class="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div class="cart-item-total">${fmt(i.price * i.qty)}</div>
      <button class="cart-item-remove" data-rem="${i.id}" aria-label="Remove ${esc(i.title)} from cart">
        <i class="fas fa-xmark" aria-hidden="true"></i>
      </button>
    </div>`,
    )
    .join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartSubtotal.textContent = fmt(total);

  cartBody
    .querySelectorAll("[data-dec]")
    .forEach((b) =>
      b.addEventListener("click", () => updateQty(parseInt(b.dataset.dec), -1)),
    );
  cartBody
    .querySelectorAll("[data-inc]")
    .forEach((b) =>
      b.addEventListener("click", () => updateQty(parseInt(b.dataset.inc), 1)),
    );
  cartBody
    .querySelectorAll("[data-rem]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        removeFromCart(parseInt(b.dataset.rem)),
      ),
    );
}

// ─── Wishlist ─────────────────────────────────────────────────────
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  const p = products.find((x) => x.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    if (p)
      toast(`Removed from wishlist: ${p.title.slice(0, 30)}`, "fa-heart-crack");
  } else {
    wishlist.push(id);
    if (p) toast(`Saved to wishlist: ${p.title.slice(0, 32)}`, "fa-heart");
  }
  save("wishlist", wishlist);
  updateWishlistUI();
  // Refresh grid badge states without full re-render
  grid.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const bid = parseInt(btn.dataset.wid);
    const saved = wishlist.includes(bid);
    btn.classList.toggle("saved", saved);
    btn.setAttribute("aria-pressed", String(saved));
  });
  wishlistBadge.textContent = wishlist.length;
}

function updateWishlistUI() {
  wishlistBadge.textContent = wishlist.length;

  if (!wishlist.length) {
    wishlistBody.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-heart-crack" aria-hidden="true"></i></div>
        <h3>Nothing saved yet</h3>
        <p>Heart items you love to find them here.</p>
      </div>`;
    return;
  }

  wishlistBody.innerHTML = wishlist
    .map((id) => {
      const p = products.find((x) => x.id === id);
      if (!p) return "";
      return `
      <div class="wishlist-item">
        <img class="wishlist-item-img" src="${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy" width="56" height="56" />
        <div class="wishlist-item-info">
          <div class="wishlist-item-title">${esc(p.title)}</div>
          <div class="wishlist-item-price">${fmt(p.price)}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="btn-outline" style="padding:6px 12px;font-size:0.72rem" data-wcart="${p.id}" aria-label="Add ${esc(p.title)} to cart">
            <i class="fas fa-cart-plus" aria-hidden="true"></i>
          </button>
          <button class="btn-outline" style="padding:6px 12px;font-size:0.72rem;border-color:var(--red-light);color:var(--red)" data-wrem="${p.id}" aria-label="Remove ${esc(p.title)} from wishlist">
            <i class="fas fa-trash-can" aria-hidden="true"></i>
          </button>
        </div>
      </div>`;
    })
    .join("");

  wishlistBody
    .querySelectorAll("[data-wcart]")
    .forEach((b) =>
      b.addEventListener("click", () => addToCart(parseInt(b.dataset.wcart))),
    );
  wishlistBody
    .querySelectorAll("[data-wrem]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        toggleWishlist(parseInt(b.dataset.wrem)),
      ),
    );
}

// ─── Modal ────────────────────────────────────────────────────────
function openModal(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  const origPrice =
    p.discountPercentage > 0
      ? `${fmt(p.price / (1 - p.discountPercentage / 100))}`
      : null;

  modalBody.innerHTML = `
    <div class="modal-img-wrap">
      <img class="modal-img" src="${esc(p.thumbnail)}" alt="${esc(p.title)}" />
    </div>
    <div class="modal-info">
      <span class="modal-category">${esc(p.category)}</span>
      <h2 id="modalTitle">${esc(p.title)}</h2>
      <div class="rating" aria-label="Rating ${p.rating.toFixed(1)} out of 5">
        ${starHTML(p.rating)}
        <span>${p.rating.toFixed(1)} · ${p.reviews ? p.reviews.length : p.stock} reviews</span>
      </div>
      <p class="modal-desc">${esc(p.description || "No description available.")}</p>
      <div class="modal-meta">
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Brand</div>
          <div class="modal-meta-item-value">${esc(p.brand || "Generic")}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Availability</div>
          <div class="modal-meta-item-value ${p.stock > 0 ? "" : ""}">
            ${
              p.stock > 0
                ? `<span style="color:var(--green)">In Stock</span> (${p.stock})`
                : `<span style="color:var(--red)">Out of Stock</span>`
            }
          </div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">SKU</div>
          <div class="modal-meta-item-value">${esc(p.sku || "—")}</div>
        </div>
        <div class="modal-meta-item">
          <div class="modal-meta-item-label">Weight</div>
          <div class="modal-meta-item-value">${p.weight ? p.weight + "g" : "—"}</div>
        </div>
      </div>
      <div class="modal-price-row">
        <span class="current">${fmt(p.price)}</span>
        ${
          origPrice
            ? `<span class="original">${origPrice}</span>
             <span style="color:var(--red);font-size:0.82rem;font-weight:700">Save ${Math.round(p.discountPercentage)}%</span>`
            : ""
        }
      </div>
      <div class="modal-actions">
        <button class="btn-primary" id="modalAddCart">
          <i class="fas fa-cart-plus" aria-hidden="true"></i> Add to Cart
        </button>
        <button class="btn-outline" id="modalWish" aria-label="${wishlist.includes(p.id) ? "Remove from" : "Add to"} wishlist">
          <i class="fas fa-heart" aria-hidden="true"></i>
        </button>
      </div>
    </div>`;

  $("modalAddCart").addEventListener("click", () => {
    addToCart(p.id);
  });

  $("modalWish").addEventListener("click", () => {
    toggleWishlist(p.id);
    const inWish = wishlist.includes(p.id);
    $("modalWish").setAttribute(
      "aria-label",
      `${inWish ? "Remove from" : "Add to"} wishlist`,
    );
  });

  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ─── Drawers ──────────────────────────────────────────────────────
function openDrawer(el) {
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  drawerOverlay.classList.add("open");
  drawerOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  [cartDrawer, wishlistDrawer].forEach((d) => {
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
  });
  drawerOverlay.classList.remove("open");
  drawerOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// ─── Checkout ─────────────────────────────────────────────────────
function handleCheckout() {
  if (!cart.length) {
    toast("Your cart is empty", "fa-bag-shopping", "error");
    return;
  }
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  const msg =
    shipping === 0
      ? `Order placed! Total: ${fmt(total)} — free shipping applied 🎉`
      : `Order placed! Total: ${fmt(total)} (incl. ${fmt(shipping)} shipping)`;
  cart = [];
  save("cart", cart);
  updateCartUI();
  closeDrawers();
  toast(msg, "fa-circle-check");
}

// ─── Scroll reveal ────────────────────────────────────────────────
function observeReveal() {
  if (!("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(".reveal:not(.visible)")
    .forEach((el) => obs.observe(el));
}

// ─── Header scroll ────────────────────────────────────────────────
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        document
          .querySelector(".header")
          .classList.toggle("scrolled", window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true },
);

// ─── Events ───────────────────────────────────────────────────────
// Search / Filter / Sort
let searchDebounce;
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    displayCount = PAGE_SIZE;
    applyFilters();
  }, 220);
});
categoryFilter.addEventListener("change", () => {
  displayCount = PAGE_SIZE;
  applyFilters();
});
sortSelect.addEventListener("change", () => {
  displayCount = PAGE_SIZE;
  applyFilters();
});

// Sale promo
dealsBtn.addEventListener("click", showDiscounted);

// Cart
cartBtn.addEventListener("click", () => {
  closeDrawers();
  openDrawer(cartDrawer);
});
closeCart.addEventListener("click", closeDrawers);

// Wishlist
wishlistBtn.addEventListener("click", () => {
  closeDrawers();
  openDrawer(wishlistDrawer);
});
closeWishlist.addEventListener("click", closeDrawers);

// Overlay / Escape
drawerOverlay.addEventListener("click", closeDrawers);
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeDrawers();
  }
});

// Checkout
checkoutBtn.addEventListener("click", handleCheckout);

// Mobile nav
mobileMenuBtn.addEventListener("click", () => {
  mainNav.classList.add("open");
  mobileMenuBtn.setAttribute("aria-expanded", "true");
});
mobileMenuClose.addEventListener("click", () => {
  mainNav.classList.remove("open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
});
document.addEventListener("click", (e) => {
  if (
    mainNav.classList.contains("open") &&
    !mainNav.contains(e.target) &&
    e.target !== mobileMenuBtn
  ) {
    mainNav.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }
});

// Search toggle
searchToggle.addEventListener("click", () => {
  const open = mobileSearch.classList.toggle("open");
  mobileSearch.setAttribute("aria-hidden", String(!open));
  if (open) setTimeout(() => searchInput.focus(), 300);
});
searchClose.addEventListener("click", () => {
  mobileSearch.classList.remove("open");
  mobileSearch.setAttribute("aria-hidden", "true");
});

// Newsletter
$("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("newsletterEmail");
  if (input.value.trim()) {
    toast("Subscribed! Check your inbox for 10% off.", "fa-envelope");
    input.value = "";
  }
});

// ─── Init ─────────────────────────────────────────────────────────
(async function init() {
  cart = load("cart", []);
  wishlist = load("wishlist", []);
  updateCartUI();
  updateWishlistUI();
  observeReveal();
  await fetchProducts();
})();
