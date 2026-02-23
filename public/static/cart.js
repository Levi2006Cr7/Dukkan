// =============================================
// DUKKAN - Cart Page JS
// =============================================

function initCart() {
  renderCart();
  document.addEventListener('cartUpdated', renderCart);
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  const countEl = document.getElementById('cartItemsCount');

  if (countEl) countEl.textContent = `${cart.length} منتجات`;

  if (!container || !summary) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-cart"></i>
        <h3>السلة فارغة</h3>
        <p>لم تضف أي منتجات بعد</p>
        <a href="/shop" class="btn-primary">تسوّق الآن</a>
      </div>`;
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="cartItem-${item.id}-${item.size}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.brand} | المقاس: ${item.size} | ${item.color}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id},'${item.size}',-1)"><i class="fas fa-minus"></i></button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},'${item.size}',1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="cart-item-price">${item.price * item.quantity} ر.س</div>
      <button class="cart-item-remove" onclick="removeItem(${item.id},'${item.size}')">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>`).join('');

  // Summary
  const subtotal = getCartTotal();
  const shipping = subtotal > 200 ? 0 : 25;
  const discount = 0;
  const total = subtotal + shipping - discount;

  summary.innerHTML = `
    <div class="summary-title">ملخص الطلب</div>
    <div class="summary-row">
      <span>المجموع الفرعي</span>
      <span>${subtotal} ر.س</span>
    </div>
    <div class="summary-row">
      <span>الشحن</span>
      <span>${shipping === 0 ? '<span style="color:#00b894">مجاني</span>' : shipping + ' ر.س'}</span>
    </div>
    ${discount > 0 ? `<div class="summary-row"><span>خصم الكوبون</span><span style="color:#00b894">-${discount} ر.س</span></div>` : ''}
    <div class="coupon-input">
      <input type="text" id="couponCode" placeholder="كود الخصم">
      <button onclick="applyCoupon()">تطبيق</button>
    </div>
    <div class="summary-row total">
      <span>الإجمالي</span>
      <span>${total} ر.س</span>
    </div>
    <button class="checkout-btn" onclick="checkout()">
      <i class="fas fa-credit-card"></i>
      إتمام الطلب
    </button>
    <a href="/shop" style="display:block;text-align:center;margin-top:1rem;color:var(--text-muted);text-decoration:none;font-size:0.85rem">
      <i class="fas fa-arrow-right"></i> متابعة التسوق
    </a>
    <div style="display:flex;justify-content:center;gap:0.5rem;margin-top:1rem">
      <i class="fab fa-cc-visa" style="font-size:1.5rem;color:var(--text-muted)"></i>
      <i class="fab fa-cc-mastercard" style="font-size:1.5rem;color:var(--text-muted)"></i>
      <i class="fab fa-cc-paypal" style="font-size:1.5rem;color:var(--text-muted)"></i>
      <i class="fab fa-apple-pay" style="font-size:1.5rem;color:var(--text-muted)"></i>
    </div>`;

  if (typeof gsap !== 'undefined') {
    gsap.from('.cart-item', { x: -30, opacity: 0, duration: 0.4, stagger: 0.08 });
    gsap.from('.cart-summary', { x: 30, opacity: 0, duration: 0.6 });
  }
}

function updateQty(id, size, delta) {
  updateCartQty(id, size, delta);
  renderCart();
}

function removeItem(id, size) {
  const el = document.getElementById(`cartItem-${id}-${size}`);
  if (el && typeof gsap !== 'undefined') {
    gsap.to(el, { x: 50, opacity: 0, duration: 0.3, onComplete: () => {
      removeFromCart(id, size);
      renderCart();
    }});
  } else {
    removeFromCart(id, size);
    renderCart();
  }
  showToast('تم حذف المنتج من السلة', 'info', 'fa-trash');
}

function applyCoupon() {
  const code = document.getElementById('couponCode')?.value?.toUpperCase();
  if (code === 'DUKKAN10') {
    showToast('تم تطبيق كوبون خصم 10%!', 'success', 'fa-tag');
  } else {
    showToast('كود الخصم غير صالح', 'error', 'fa-times');
  }
}

function checkout() {
  if (getCart().length === 0) {
    showToast('السلة فارغة!', 'error', 'fa-exclamation');
    return;
  }
  showToast('جاري معالجة طلبك...', 'success', 'fa-spinner');
  setTimeout(() => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:var(--overlay);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)';
    modal.innerHTML = `
      <div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:24px;padding:3rem;text-align:center;max-width:400px;width:90%;backdrop-filter:blur(30px)">
        <div style="font-size:4rem;margin-bottom:1rem;animation:bounce 1s ease infinite">🎉</div>
        <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:0.5rem">تم تأكيد طلبك!</h2>
        <p style="color:var(--text-secondary);margin-bottom:1.5rem">سيصلك طلبك خلال 2-4 أيام عمل</p>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1.5rem">رقم الطلب: <strong style="color:var(--accent)">#DK${Date.now().toString().slice(-6)}</strong></p>
        <button class="btn-primary" onclick="localStorage.removeItem('dukkan-cart');window.location='/';updateBadges()">العودة للرئيسية</button>
      </div>`;
    document.body.appendChild(modal);
  }, 1500);
}

document.addEventListener('DOMContentLoaded', initCart);
