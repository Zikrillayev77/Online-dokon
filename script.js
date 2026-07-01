// ===== Savat holatini localStorage'dan olish =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== Narxni formatlash =====
function formatPrice(price) {
  return price.toLocaleString('uz-UZ') + " so'm";
}

// ===== Mahsulotlarni render qilish =====
function renderProducts(filter = 'all') {
  productsGrid.innerHTML = '';
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-price">${formatPrice(product.price)}</div>
        <button class="add-to-cart" data-id="${product.id}">Savatga qo'shish</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// ===== Filtrlash =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.filter);
  });
});

// ===== Savatga qo'shish =====
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

// ===== Savatni saqlash =====
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ===== Savatni render qilish =====
function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Savatingiz bo\'sh</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">🗑️</button>
    `;
    cartItems.appendChild(el);
  });

  cartTotal.textContent = formatPrice(total);

  // Qty tugmalari
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      const item = cart.find(i => i.id === id);
      if (action === 'plus') item.qty += 1;
      if (action === 'minus') {
        item.qty -= 1;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
      }
      saveCart();
      renderCart();
    });
  });

  // O'chirish tugmasi
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      cart = cart.filter(i => i.id !== id);
      saveCart();
      renderCart();
    });
  });
}

// ===== Savat panelini ochish/yopish =====
function openCart() {
  cartPanel.classList.add('active');
  cartOverlay.classList.add('active');
}

function closeCartPanel() {
  cartPanel.classList.remove('active');
  cartOverlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);
cartOverlay.addEventListener('click', closeCartPanel);

// ===== Buyurtma berish =====
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Savatingiz bo'sh!");
    return;
  }
  alert("Buyurtmangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.");
  cart = [];
  saveCart();
  renderCart();
  closeCartPanel();
});

// ===== Boshlang'ich render =====
renderProducts();
renderCart();
