// =============================================
// DUKKAN - Product Detail Page JS
// =============================================

let selectedSize = 'M';
let selectedColor = '#1a1a2e';
let qty = 1;
let currentProduct = null;

function initProductPage() {
  const pathParts = window.location.pathname.split('/');
  const id = parseInt(pathParts[pathParts.length - 1]);
  
  currentProduct = PRODUCTS_DATA.find(p => p.id === id);
  if (!currentProduct) {
    document.getElementById('productPage').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>المنتج غير موجود</h3>
        <button class="btn-primary" onclick="window.location='/shop'">العودة للمتجر</button>
      </div>`;
    return;
  }

  renderProductDetail(currentProduct);
}

function renderProductDetail(product) {
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);
  const isWishlisted = getWishlist().some(w => w.id === product.id);
  const colorHexes = ['#1a1a2e', '#f5f5f5', '#3498db', '#e74c3c', '#95a5a6', '#f5cba7', '#27ae60', '#fd79a8'];
  const similar = PRODUCTS_DATA.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const container = document.getElementById('productPage');
  container.innerHTML = `
    <!-- Breadcrumb -->
    <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:2rem;font-size:0.85rem;color:var(--text-muted)">
      <a href="/" style="color:var(--text-muted);text-decoration:none">الرئيسية</a>
      <span>/</span>
      <a href="/shop" style="color:var(--text-muted);text-decoration:none">المتجر</a>
      <span>/</span>
      <span style="color:var(--text-primary)">${product.name}</span>
    </div>

    <div class="product-detail-layout">
      <!-- Gallery -->
      <div class="product-gallery">
        <div class="product-main-img" id="mainImg">
          <img src="${product.image}" alt="${product.name}" id="mainImgEl">
        </div>
        <div class="product-thumbs">
          ${[product.image, ...PRODUCTS_DATA.filter(p => p.category === product.category && p.id !== product.id).slice(0,3).map(p => p.image)].map((img, i) => `
          <div class="product-thumb ${i === 0 ? 'active' : ''}" onclick="changeMainImg('${img}', this)">
            <img src="${img}" alt="thumb">
          </div>`).join('')}
        </div>
      </div>

      <!-- Info -->
      <div class="product-detail-info">
        <div class="product-detail-brand">${product.brand}</div>
        <h1 class="product-detail-name">${product.name}</h1>
        
        <div class="product-detail-rating">
          <span style="color:#ffd700;font-size:1rem">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
          <span style="font-weight:700;color:var(--text-primary)">${product.rating}</span>
          <span style="color:var(--text-muted)">(${product.reviews} تقييم)</span>
          <span style="background:rgba(0,184,148,0.15);color:#00b894;padding:2px 8px;border-radius:8px;font-size:0.78rem;font-weight:700;margin-right:0.5rem">
            ${product.inStock ? '✓ متوفر' : '✗ غير متوفر'}
          </span>
        </div>

        <div class="product-detail-price">
          <span class="price-main">${product.price} ر.س</span>
          ${discount > 5 ? `<span class="price-original" style="font-size:1.2rem;text-decoration:line-through;color:var(--text-muted)">${product.originalPrice} ر.س</span>` : ''}
          ${discount > 5 ? `<span style="background:rgba(255,71,87,0.15);color:#ff4757;padding:4px 10px;border-radius:10px;font-size:0.85rem;font-weight:700">خصم ${discount}%</span>` : ''}
        </div>

        <p class="product-detail-desc">${product.description}</p>

        <!-- Size Selector -->
        <div class="size-selector">
          <h4>المقاس: <strong id="selectedSizeDisplay">${selectedSize}</strong></h4>
          <div class="product-sizes">
            ${product.sizes.map(s => `
            <button class="product-size-btn ${s === selectedSize ? 'active' : ''}" onclick="selectSize('${s}', this)">${s}</button>`).join('')}
          </div>
        </div>

        <!-- Color Selector -->
        <div class="color-selector">
          <h4>اللون: <strong>${product.color}</strong></h4>
          <div class="product-colors">
            ${colorHexes.map((c, i) => `
            <button class="product-color-btn ${i === 0 ? 'active' : ''}" style="background:${c}" onclick="selectColor('${c}',this)" title="لون ${i+1}"></button>`).join('')}
          </div>
        </div>

        <!-- Quantity -->
        <div class="product-qty-row">
          <span style="font-weight:700;color:var(--text-primary)">الكمية:</span>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQty(-1)"><i class="fas fa-minus"></i></button>
            <span class="qty-num" id="qtyDisplay">1</span>
            <button class="qty-btn" onclick="changeQty(1)"><i class="fas fa-plus"></i></button>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="product-cta-btns">
          <button class="btn-primary btn-add-cart" onclick="addProductToCart()" ${!product.inStock ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i>
            ${product.inStock ? 'أضف للسلة' : 'نفذت الكمية'}
          </button>
          <button class="btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="toggleWishFromDetail(this)" id="wishBtn">
            <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
          </button>
        </div>

        <!-- Benefits -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:1.5rem">
          ${[['fa-truck','توصيل مجاني','للطلبات فوق 200 ر.س'],['fa-undo','إرجاع مجاني','خلال 30 يوم'],['fa-shield-alt','ضمان الجودة','منتجات أصلية 100%'],['fa-credit-card','دفع آمن','بطاقات محلية وعالمية']].map(([icon,title,sub]) => `
          <div style="background:var(--bg-secondary);border:1px solid var(--card-border);border-radius:12px;padding:0.75rem;display:flex;gap:0.6rem;align-items:center">
            <i class="fas ${icon}" style="color:var(--accent);font-size:1.2rem"></i>
            <div>
              <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary)">${title}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${sub}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div style="margin-top:4rem">
      <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:1.5rem">التقييمات والمراجعات</h2>
      <div style="display:grid;grid-template-columns:200px 1fr;gap:2rem;margin-bottom:2rem">
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:1.5rem;text-align:center;backdrop-filter:blur(20px)">
          <div style="font-size:3rem;font-weight:900;color:var(--text-primary)">${product.rating}</div>
          <div style="color:#ffd700;font-size:1.3rem;margin:0.4rem 0">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</div>
          <div style="color:var(--text-muted);font-size:0.82rem">${product.reviews} مراجعة</div>
        </div>
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:1.5rem;backdrop-filter:blur(20px)">
          ${[5,4,3,2,1].map(n => `
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
            <span style="color:#ffd700;font-size:0.85rem">${'★'.repeat(n)}</span>
            <div style="flex:1;height:8px;background:var(--bg-secondary);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${[65,20,8,5,2][5-n]}%;background:var(--btn-bg);border-radius:4px;transition:width 1s ease"></div>
            </div>
            <span style="font-size:0.78rem;color:var(--text-muted);min-width:30px">${[65,20,8,5,2][5-n]}%</span>
          </div>`).join('')}
        </div>
      </div>
      
      <!-- Sample Reviews -->
      <div style="display:grid;gap:1rem">
        ${[{name:'سارة م.',rating:5,text:'منتج رائع، الجودة ممتازة والتوصيل كان سريع جداً!',date:'15 يناير 2025'},{name:'محمد أ.',rating:4,text:'المقاس مناسب والخامة جيدة، أنصح به',date:'10 يناير 2025'},{name:'نور ع.',rating:5,text:'تجربة تسوق رائعة مع دكان، سأعود بالتأكيد',date:'5 يناير 2025'}].map(r => `
        <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:1.5rem;backdrop-filter:blur(20px)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
            <div style="display:flex;align-items:center;gap:0.75rem">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--btn-bg);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--btn-text)">${r.name[0]}</div>
              <div>
                <div style="font-weight:700;color:var(--text-primary)">${r.name}</div>
                <span style="color:#ffd700">${'★'.repeat(r.rating)}</span>
              </div>
            </div>
            <span style="font-size:0.78rem;color:var(--text-muted)">${r.date}</span>
          </div>
          <p style="color:var(--text-secondary);font-size:0.9rem">${r.text}</p>
        </div>`).join('')}
      </div>
    </div>

    <!-- Similar Products -->
    <div style="margin-top:4rem">
      <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:1.5rem">منتجات مشابهة</h2>
      <div class="products-grid">
        ${similar.map(p => createProductCard(p)).join('')}
      </div>
    </div>`;

  // GSAP animations
  if (typeof gsap !== 'undefined') {
    gsap.from('.product-gallery', { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from('.product-detail-info', { x: 50, opacity: 0, duration: 0.8, ease: 'power3.out' });
  }
}

function changeMainImg(src, thumb) {
  document.getElementById('mainImgEl').src = src;
  document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.product-size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const display = document.getElementById('selectedSizeDisplay');
  if (display) display.textContent = size;
}

function selectColor(color, btn) {
  selectedColor = color;
  document.querySelectorAll('.product-color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeQty(delta) {
  qty = Math.max(1, qty + delta);
  const display = document.getElementById('qtyDisplay');
  if (display) display.textContent = qty;
}

function addProductToCart() {
  if (!currentProduct) return;
  addToCart(currentProduct, selectedSize, qty);
  
  // Animate button
  const btn = document.querySelector('.btn-add-cart');
  if (btn && typeof gsap !== 'undefined') {
    gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  }
}

function toggleWishFromDetail(btn) {
  if (!currentProduct) return;
  const wishlist = getWishlist();
  const idx = wishlist.findIndex(w => w.id === currentProduct.id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('تم حذف المنتج من المفضلة', 'info', 'fa-heart-broken');
  } else {
    wishlist.push(currentProduct);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('تم إضافة المنتج للمفضلة', 'success', 'fa-heart');
  }
  saveWishlist(wishlist);
}

document.addEventListener('DOMContentLoaded', initProductPage);
