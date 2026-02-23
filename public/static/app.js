// =============================================
// DUKKAN - Main App JS
// Shared across all pages
// =============================================

// ==================== THEME SYSTEM ====================
const THEMES = ['liquid-glass','minimalism','clay','glassmorphism','skeuomorphism','neomorphism'];
const THEME_NAMES = {
  'liquid-glass': 'Liquid Glass',
  'minimalism': 'Minimalism',
  'clay': 'Clay Morphism',
  'glassmorphism': 'Glassmorphism',
  'skeuomorphism': 'Skeuomorphism',
  'neomorphism': 'Neomorphism'
};

function applyTheme(theme) {
  const body = document.getElementById('appBody') || document.getElementById('loginBody');
  if (!body) return;
  THEMES.forEach(t => body.classList.remove(`theme-${t}`));
  body.classList.add(`theme-${theme}`);
  localStorage.setItem('dukkan-theme', theme);
  // Update active state in panel
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  showToast(`تم تطبيق ثيم ${THEME_NAMES[theme]}`, 'success', 'fa-palette');
}

function toggleThemePanel() {
  const panel = document.getElementById('themePanel');
  if (!panel) return;
  panel.classList.toggle('open');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('dukkan-theme') || 'liquid-glass';
  const body = document.getElementById('appBody') || document.getElementById('loginBody');
  if (body) {
    THEMES.forEach(t => body.classList.remove(`theme-${t}`));
    body.classList.add(`theme-${saved}`);
    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === saved);
    });
  }

  // Close theme panel on outside click
  document.addEventListener('click', (e) => {
    const qs = document.querySelector('.theme-quick-switch');
    const panel = document.getElementById('themePanel');
    if (qs && panel && !qs.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Update badges
  updateBadges();

  // Show page loader then hide
  showLoader();
});

// ==================== PRODUCTS DATA ====================
const PRODUCTS_DATA = generateProducts();

function generateProducts() {
  const items = ['قميص كلاسيك','بنطلون جينز','فستان سهرة','جاكيت جلد','بلوزة كاجوال','تيشيرت بريميوم','كوت شتوي','سترة رياضية','شورت صيفي','تنورة ميدي','سويت شيرت','هوديه','ترنج كامل','سيت رياضي','قميص لينن','بنطلون كلاسيك','فستان ميدي','جاكيت جينز','كوت بيج','قميص فلانيل'];
  const brands = ['ZARA','H&M','MANGO','Gucci','Nike','Adidas','Prada','Dior','Versace','Balenciaga'];
  const categories = ['رجالي','نسائي','أطفال','رياضي','كاجوال','فاخر'];
  const colors = ['أسود','أبيض','أزرق','أحمر','رمادي','بيج','أخضر','وردي','برتقالي','بنفسجي'];
  const images = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=500&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80'
  ];
  const badges = ['جديد','خصم','🔥 الأكثر مبيعاً','محدود','','','',''];

  return Array.from({length: 48}, (_, i) => ({
    id: i+1,
    name: `${items[i%items.length]}`,
    price: Math.floor(80 + (i * 37) % 720),
    originalPrice: Math.floor(120 + (i * 47) % 1000),
    category: categories[i%categories.length],
    brand: brands[i%brands.length],
    color: colors[i%colors.length],
    rating: parseFloat((3.5 + (i % 15) * 0.1).toFixed(1)),
    reviews: 10 + (i * 13) % 250,
    image: images[i%images.length],
    badge: badges[i%badges.length],
    inStock: i % 9 !== 0,
    sizes: ['S','M','L','XL'],
    description: `منتج فاخر من ${brands[i%brands.length]} مصنوع من أفضل الخامات. تصميم عصري يجمع بين الأناقة والراحة. مثالي لجميع المناسبات.`
  }));
}

// ==================== PRODUCT CARD ====================
function createProductCard(product, mini = false) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const isWishlisted = getWishlist().some(w => w.id === product.id);
  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');
  
  return `
  <div class="product-card" onclick="goToProduct(${product.id})" style="cursor:pointer">
    <div class="product-img">
      <img src="${product.image}" alt="${product.name}" loading="lazy" 
           onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      ${!product.inStock ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.9rem">نفذت الكمية</div>` : ''}
      <div class="product-actions-overlay">
        <button class="product-action-btn ${isWishlisted ? 'wish-active' : ''}" onclick="toggleWishlist(event,${product.id})" title="المفضلة">
          <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
        </button>
        <button class="product-action-btn" onclick="quickView(event,${product.id})" title="معاينة سريعة">
          <i class="fas fa-eye"></i>
        </button>
        <button class="product-action-btn" onclick="addToCartById(event,${product.id})" title="أضف للسلة" ${!product.inStock ? 'disabled' : ''}>
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-brand">${product.brand}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-rating">
        <span class="stars" style="color:#ffd700">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
        <span style="color:var(--text-primary);font-weight:700">${product.rating}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-price">
        <span class="price-current">${product.price} ر.س</span>
        ${discount > 0 ? `<span class="price-original">${product.originalPrice} ر.س</span>` : ''}
        ${discount > 5 ? `<span class="price-discount">-${discount}%</span>` : ''}
      </div>
      <button class="product-add-btn" onclick="addToCartById(event,${product.id})" ${!product.inStock ? 'disabled style="opacity:0.5"' : ''}>
        <i class="fas fa-shopping-cart"></i>
        ${product.inStock ? 'أضف للسلة' : 'نفذت الكمية'}
      </button>
    </div>
  </div>`;
}

function goToProduct(id) {
  window.location.href = `/product/${id}`;
}

// ==================== CART ====================
function getCart() {
  return JSON.parse(localStorage.getItem('dukkan-cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('dukkan-cart', JSON.stringify(cart));
  updateBadges();
  dispatchCartEvent();
}

function addToCartById(event, id) {
  if (event) event.stopPropagation();
  const product = PRODUCTS_DATA.find(p => p.id === id);
  if (!product) return;
  addToCart(product);
}

function addToCart(product, size = 'M', quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      size,
      quantity,
      color: product.color
    });
  }
  saveCart(cart);
  showToast(`تم إضافة "${product.name}" للسلة`, 'success', 'fa-shopping-cart');
  
  // Animate button
  if (event && event.target) {
    const btn = event.target.closest('button');
    if (btn) {
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => btn.style.transform = '', 200);
    }
  }
}

function removeFromCart(id, size) {
  const cart = getCart().filter(i => !(i.id === id && i.size === size));
  saveCart(cart);
}

function updateCartQty(id, size, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function dispatchCartEvent() {
  document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// ==================== WISHLIST ====================
function getWishlist() {
  return JSON.parse(localStorage.getItem('dukkan-wishlist') || '[]');
}

function saveWishlist(list) {
  localStorage.setItem('dukkan-wishlist', JSON.stringify(list));
  updateBadges();
}

function toggleWishlist(event, id) {
  if (event) event.stopPropagation();
  const product = PRODUCTS_DATA.find(p => p.id === id);
  if (!product) return;
  
  const wishlist = getWishlist();
  const idx = wishlist.findIndex(w => w.id === id);
  
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`تم حذف "${product.name}" من المفضلة`, 'info', 'fa-heart-broken');
  } else {
    wishlist.push(product);
    showToast(`تم إضافة "${product.name}" للمفضلة`, 'success', 'fa-heart');
  }
  
  saveWishlist(wishlist);
  
  // Update button state
  if (event) {
    const btn = event.target.closest('button');
    if (btn) {
      const isNowWished = idx === -1;
      btn.classList.toggle('wish-active', isNowWished);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = `fa${isNowWished ? 's' : 'r'} fa-heart`;
      }
    }
  }
}

// ==================== BADGES ====================
function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishCount = wishlist.length;
  
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount > 0 ? 'flex' : 'none';
  });
  
  document.querySelectorAll('#wishCount').forEach(el => {
    el.textContent = wishCount;
    el.style.display = wishCount > 0 ? 'flex' : 'none';
  });
}

// ==================== TOAST ====================
function showToast(message, type = 'success', icon = 'fa-check-circle') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i>${message}`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== LOADER ====================
function showLoader() {
  // Don't show loader on login page
  if (window.location.pathname === '/login') return;
  
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-brand">DUKKAN</div>
    <div class="loader-bar"><div class="loader-progress"></div></div>
  `;
  document.body.appendChild(loader);
  
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }, 1200);
}

// ==================== QUICK VIEW ====================
function quickView(event, id) {
  if (event) event.stopPropagation();
  const product = PRODUCTS_DATA.find(p => p.id === id);
  if (!product) return;
  
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  
  const modal = document.createElement('div');
  modal.style.cssText = `position:fixed;inset:0;background:var(--overlay);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(10px);animation:fadeIn 0.2s ease`;
  modal.innerHTML = `
    <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:24px;max-width:700px;width:100%;max-height:90vh;overflow:auto;backdrop-filter:blur(30px);animation:cardReveal 0.3s ease">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
        <div style="height:350px;overflow:hidden;border-radius:24px 0 0 24px">
          <img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover">
        </div>
        <div style="padding:2rem">
          <button onclick="this.closest('[style*=fixed]').remove()" style="float:left;background:none;border:none;color:var(--text-muted);font-size:1.2rem;cursor:pointer;margin-bottom:1rem"><i class="fas fa-times"></i></button>
          <div style="font-size:0.75rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin-bottom:0.5rem">${product.brand}</div>
          <h2 style="font-size:1.2rem;font-weight:800;color:var(--text-primary);margin-bottom:0.75rem">${product.name}</h2>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
            <span style="color:#ffd700">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
            <span style="color:var(--text-muted);font-size:0.8rem">(${product.reviews} تقييم)</span>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
            <span style="font-size:1.6rem;font-weight:900;color:var(--text-primary)">${product.price} ر.س</span>
            ${discount > 5 ? `<span style="background:rgba(255,71,87,0.15);color:#ff4757;padding:3px 8px;border-radius:8px;font-size:0.8rem;font-weight:700">-${discount}%</span>` : ''}
          </div>
          <p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.7;margin-bottom:1.25rem">${product.description}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.25rem">
            ${product.sizes.map(s => `<button style="padding:4px 12px;background:var(--bg-secondary);border:1.5px solid var(--card-border);border-radius:8px;color:var(--text-secondary);font-size:0.8rem;cursor:pointer">${s}</button>`).join('')}
          </div>
          <div style="display:flex;gap:0.75rem">
            <button onclick="addToCartById(null,${product.id});this.closest('[style*=fixed]').remove()" style="flex:1;padding:0.8rem;background:var(--btn-bg);color:var(--btn-text);border:none;border-radius:12px;font-family:var(--font-ar);font-weight:700;cursor:pointer">أضف للسلة</button>
            <button onclick="window.location='/product/${product.id}'" style="padding:0.8rem 1rem;background:var(--card-hover);border:1px solid var(--card-border);border-radius:12px;color:var(--text-primary);font-family:var(--font-ar);cursor:pointer"><i class="fas fa-expand"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
  let mobileNav = document.getElementById('mobileNav');
  if (!mobileNav) {
    mobileNav = document.createElement('div');
    mobileNav.id = 'mobileNav';
    mobileNav.style.cssText = `position:fixed;top:70px;left:0;right:0;background:var(--nav-bg);border-bottom:1px solid var(--nav-border);padding:1rem;z-index:999;backdrop-filter:blur(20px);animation:fadeInDown 0.3s ease`;
    mobileNav.innerHTML = `
      <a href="/" style="display:block;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:10px">الرئيسية</a>
      <a href="/shop" style="display:block;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:10px">المتجر</a>
      <a href="/about" style="display:block;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:10px">من نحن</a>
      <a href="/wishlist" style="display:block;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:10px">المفضلة</a>
      <a href="/settings" style="display:block;padding:0.75rem 1rem;color:var(--text-primary);text-decoration:none;border-radius:10px">الإعدادات</a>
    `;
    document.body.appendChild(mobileNav);
  } else {
    mobileNav.remove();
  }
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

// ==================== INTERSECTION OBSERVER ====================
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Counter animation
        const counter = entry.target.querySelector('[data-count]');
        if (counter) {
          animateCounter(counter, parseInt(counter.dataset.count));
        }
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.product-card, .category-card, .team-card, .value-card, .story-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Counter sections
  document.querySelectorAll('.stat').forEach(el => observer.observe(el));
}

// ==================== CURSOR EFFECT ====================
function initCustomCursor() {
  if (window.innerWidth < 768) return;
  
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;width:20px;height:20px;border-radius:50%;
    border:2px solid var(--accent);pointer-events:none;z-index:99999;
    transition:transform 0.1s ease;mix-blend-mode:difference;
    left:-20px;top:-20px;
  `;
  
  const cursorDot = document.createElement('div');
  cursorDot.style.cssText = `
    position:fixed;width:6px;height:6px;border-radius:50%;
    background:var(--accent);pointer-events:none;z-index:99999;
    left:-6px;top:-6px;transition:none;
  `;
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);
  
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${e.clientX - 3}px`;
    cursorDot.style.top = `${e.clientY - 3}px`;
  });
  
  function animateCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = `${curX - 10}px`;
    cursor.style.top = `${curY - 10}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  document.querySelectorAll('button, a, .product-card, .category-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(1.8)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });
}

// ==================== COUNTDOWN ====================
function startCountdown(endTime) {
  const update = () => {
    const now = new Date().getTime();
    const diff = endTime - now;
    
    if (diff <= 0) return;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    const format = n => String(n).padStart(2, '0');
    
    if (document.getElementById('cDays')) document.getElementById('cDays').textContent = format(days);
    if (document.getElementById('cHours')) document.getElementById('cHours').textContent = format(hours);
    if (document.getElementById('cMins')) document.getElementById('cMins').textContent = format(mins);
    if (document.getElementById('cSecs')) document.getElementById('cSecs').textContent = format(secs);
  };
  
  update();
  setInterval(update, 1000);
}

// ==================== PARTICLES ====================
function createParticles(container) {
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:absolute;
      width:${2 + Math.random() * 4}px;
      height:${2 + Math.random() * 4}px;
      background:var(--accent);
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      opacity:${0.1 + Math.random() * 0.3};
      animation:float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite;
      pointer-events:none;
    `;
    container.appendChild(p);
  }
}

// Init on load
window.addEventListener('load', () => {
  initIntersectionObserver();
  initCustomCursor();
  updateBadges();
  
  // Countdown - 2 days from now
  const endTime = Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (30 * 60 * 1000);
  startCountdown(endTime);
});
