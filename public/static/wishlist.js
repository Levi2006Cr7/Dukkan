// =============================================
// DUKKAN - Wishlist Page JS
// =============================================

function initWishlist() {
  renderWishlist();
}

function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="far fa-heart"></i>
        <h3>المفضلة فارغة</h3>
        <p>أضف المنتجات التي تعجبك هنا</p>
        <a href="/shop" class="btn-primary">تسوّق الآن</a>
      </div>`;
    return;
  }

  grid.innerHTML = wishlist.map(p => createProductCard(p)).join('');

  if (typeof gsap !== 'undefined') {
    gsap.from('.product-card', { y: 30, opacity: 0, duration: 0.4, stagger: 0.08 });
  }
}

document.addEventListener('DOMContentLoaded', initWishlist);
