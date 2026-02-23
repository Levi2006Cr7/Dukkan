// =============================================
// DUKKAN - Shop Page JS
// =============================================

let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [...PRODUCTS_DATA];
let currentSort = 'featured';

function initShop() {
  renderProducts();
  renderPagination();
}

function filterProducts() {
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const priceMax = parseInt(document.getElementById('priceMax')?.value || 1000);
  const checkedCategories = [...document.querySelectorAll('.filter-options .filter-check input:checked')].map(i => parseInt(i.value));
  const selectedSizes = [...document.querySelectorAll('.size-btn.active')].map(b => b.textContent.trim());
  const selectedColors = [...document.querySelectorAll('.color-dot.active')].map(b => b.style.background);

  filteredProducts = PRODUCTS_DATA.filter(p => {
    const categories = ['الكل','رجالي','نسائي','أطفال','رياضي','كاجوال','فاخر'];
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    const matchCategory = checkedCategories.length === 0 || checkedCategories.includes(0) || checkedCategories.some(ci => categories[ci] === p.category);
    const matchPrice = p.price <= priceMax;
    const matchSize = selectedSizes.length === 0 || p.sizes.some(s => selectedSizes.includes(s));
    return matchSearch && matchCategory && matchPrice && matchSize;
  });

  sortProducts(currentSort);
  currentPage = 1;
  renderProducts();
  renderPagination();
  updateResultsCount();
  updateActiveFilters();
}

function sortProducts(type) {
  currentSort = type;
  switch (type) {
    case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'newest': filteredProducts.sort((a, b) => b.id - a.id); break;
    case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break;
    default: filteredProducts.sort((a, b) => b.reviews - a.reviews);
  }
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  const start = (currentPage - 1) * itemsPerPage;
  const page = filteredProducts.slice(start, start + itemsPerPage);

  if (page.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="fas fa-search"></i>
        <h3>لا توجد منتجات</h3>
        <p>جرب تغيير معايير البحث</p>
        <button class="btn-primary" onclick="clearFilters()">مسح الفلاتر</button>
      </div>`;
    return;
  }

  grid.innerHTML = page.map(p => createProductCard(p)).join('');

  // Animate cards
  if (typeof gsap !== 'undefined') {
    gsap.from('.product-card', {
      y: 30, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out'
    });
  }
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const pageNumbers = document.getElementById('pageNumbers');
  if (!pageNumbers) return;

  let html = '';
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

  if (start > 1) html += `<button class="page-num" onclick="goToPage(1)">1</button>${start > 2 ? '<span>...</span>' : ''}`;
  for (let i = start; i <= end; i++) {
    html += `<button class="page-num ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  if (end < totalPages) html += `${end < totalPages - 1 ? '<span>...</span>' : ''}<button class="page-num" onclick="goToPage(${totalPages})">${totalPages}</button>`;

  pageNumbers.innerHTML = html;
}

function goToPage(n) {
  currentPage = n;
  renderProducts();
  renderPagination();
  window.scrollTo({ top: document.querySelector('.products-area')?.offsetTop - 80 || 0, behavior: 'smooth' });
}

function changePage(delta) {
  const total = Math.ceil(filteredProducts.length / itemsPerPage);
  currentPage = Math.max(1, Math.min(total, currentPage + delta));
  renderProducts();
  renderPagination();
}

function updateResultsCount() {
  const el = document.getElementById('resultsCount');
  if (el) el.textContent = filteredProducts.length;
}

function updateActiveFilters() {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  container.innerHTML = '';
}

function updatePriceFilter(val) {
  const label = document.getElementById('priceMaxLabel');
  if (label) label.textContent = `${val} ر.س`;
  filterProducts();
}

function clearFilters() {
  document.querySelectorAll('.filter-check input').forEach(i => i.checked = false);
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
  const priceMax = document.getElementById('priceMax');
  if (priceMax) priceMax.value = 1000;
  const priceLabel = document.getElementById('priceMaxLabel');
  if (priceLabel) priceLabel.textContent = '1000 ر.س';
  const search = document.getElementById('searchInput');
  if (search) search.value = '';
  filteredProducts = [...PRODUCTS_DATA];
  currentPage = 1;
  renderProducts();
  renderPagination();
  updateResultsCount();
}

function toggleSize(btn, size) {
  btn.classList.toggle('active');
  filterProducts();
}

function toggleColor(btn, color) {
  btn.classList.toggle('active');
  filterProducts();
}

function setView(type, btn) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('shopGrid');
  if (grid) grid.classList.toggle('list-view', type === 'list');
}

// Init
document.addEventListener('DOMContentLoaded', initShop);
