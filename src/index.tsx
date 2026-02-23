import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// Login page
app.get('/login', (c) => {
  return c.html(loginPage())
})

// Main app pages (protected by client-side auth check)
app.get('/', (c) => c.html(homePage()))
app.get('/shop', (c) => c.html(shopPage()))
app.get('/product/:id', (c) => c.html(productPage()))
app.get('/cart', (c) => c.html(cartPage()))
app.get('/wishlist', (c) => c.html(wishlistPage()))
app.get('/about', (c) => c.html(aboutPage()))
app.get('/settings', (c) => c.html(settingsPage()))
app.get('/profile', (c) => c.html(profilePage()))

// API routes
app.get('/api/products', (c) => {
  return c.json({ products: getProducts() })
})

export default app

function loginPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | دخول</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="loginBody">
  <canvas id="threeCanvas"></canvas>
  <div class="login-container">
    <div class="login-card" id="loginCard">
      <div class="login-logo">
        <div class="logo-3d" id="logo3d"></div>
        <h1 class="brand-name">DUKKAN</h1>
        <p class="brand-sub">دُكّان | ملابسك بأسلوبك</p>
      </div>
      
      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login" onclick="switchTab('login')">تسجيل الدخول</button>
        <button class="auth-tab" data-tab="signup" onclick="switchTab('signup')">إنشاء حساب</button>
      </div>

      <form id="loginForm" class="auth-form active" onsubmit="handleLogin(event)">
        <div class="input-group floating">
          <input type="email" id="email" placeholder=" " required autocomplete="off">
          <label>البريد الإلكتروني</label>
          <i class="fas fa-envelope input-icon"></i>
          <div class="input-glow"></div>
        </div>
        <div class="input-group floating">
          <input type="password" id="password" placeholder=" " required>
          <label>كلمة المرور</label>
          <i class="fas fa-lock input-icon"></i>
          <div class="input-glow"></div>
          <button type="button" class="toggle-pass" onclick="togglePass(this)">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox"> تذكرني
            <span class="checkmark"></span>
          </label>
          <a href="#" class="forgot-pass">نسيت كلمة المرور؟</a>
        </div>
        <button type="submit" class="btn-submit" id="loginBtn">
          <span class="btn-text">دخول</span>
          <div class="btn-loader"></div>
          <div class="btn-ripple"></div>
        </button>
      </form>

      <form id="signupForm" class="auth-form" onsubmit="handleSignup(event)">
        <div class="input-group floating">
          <input type="text" id="name" placeholder=" " required>
          <label>الاسم الكامل</label>
          <i class="fas fa-user input-icon"></i>
          <div class="input-glow"></div>
        </div>
        <div class="input-group floating">
          <input type="email" id="signupEmail" placeholder=" " required>
          <label>البريد الإلكتروني</label>
          <i class="fas fa-envelope input-icon"></i>
          <div class="input-glow"></div>
        </div>
        <div class="input-group floating">
          <input type="password" id="signupPass" placeholder=" " required>
          <label>كلمة المرور</label>
          <i class="fas fa-lock input-icon"></i>
          <div class="input-glow"></div>
        </div>
        <button type="submit" class="btn-submit">
          <span class="btn-text">إنشاء حساب</span>
          <div class="btn-loader"></div>
        </button>
      </form>

      <div class="social-login">
        <p>أو تسجيل الدخول بـ</p>
        <div class="social-btns">
          <button class="social-btn google" onclick="socialLogin('google')">
            <i class="fab fa-google"></i>
          </button>
          <button class="social-btn apple" onclick="socialLogin('apple')">
            <i class="fab fa-apple"></i>
          </button>
          <button class="social-btn facebook" onclick="socialLogin('facebook')">
            <i class="fab fa-facebook-f"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="floating-shapes">
      <div class="shape s1"></div>
      <div class="shape s2"></div>
      <div class="shape s3"></div>
      <div class="shape s4"></div>
      <div class="shape s5"></div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/login3d.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`
}

function homePage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | الرئيسية</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <canvas id="bgCanvas"></canvas>
  
  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="nav-brand">
      <div class="nav-logo-icon">D</div>
      <span>DUKKAN</span>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link active"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
      <a href="/about" class="nav-link"><i class="fas fa-info-circle"></i><span>من نحن</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/wishlist'"><i class="fas fa-heart"></i><span class="badge" id="wishCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
      <div class="nav-avatar" onclick="window.location='/profile'">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar">
      </div>
    </div>
    <button class="nav-mobile-toggle" onclick="toggleMobileMenu()"><i class="fas fa-bars"></i></button>
  </nav>

  <!-- Hero Section -->
  <section class="hero-section" id="heroSection">
    <div class="hero-bg-3d" id="heroBg3d"></div>
    <div class="hero-content">
      <div class="hero-badge"><i class="fas fa-fire"></i> كولكشن 2025</div>
      <h1 class="hero-title">
        <span class="hero-line1">ارتدِ</span>
        <span class="hero-line2 gradient-text">أسلوبك</span>
        <span class="hero-line3">بجرأة</span>
      </h1>
      <p class="hero-desc">اكتشف أحدث صيحات الموضة العالمية مع دُكّان. ملابس راقية بأسعار تناسبك.</p>
      <div class="hero-ctas">
        <a href="/shop" class="btn-primary"><span>تسوّق الآن</span><i class="fas fa-arrow-left"></i></a>
        <button class="btn-secondary" onclick="playHeroVideo()"><i class="fas fa-play"></i><span>شاهد الكولكشن</span></button>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-num" data-count="500">0</span><span>+</span><small>منتج</small></div>
        <div class="stat-divider"></div>
        <div class="stat"><span class="stat-num" data-count="50">0</span><span>K+</span><small>عميل</small></div>
        <div class="stat-divider"></div>
        <div class="stat"><span class="stat-num" data-count="98">0</span><span>%</span><small>رضا</small></div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-3d-container" id="hero3dContainer"></div>
      <div class="hero-floating-cards">
        <div class="float-card card1"><i class="fas fa-truck"></i><span>توصيل مجاني</span></div>
        <div class="float-card card2"><i class="fas fa-undo"></i><span>إرجاع سهل</span></div>
        <div class="float-card card3"><i class="fas fa-star"></i><span>جودة عالية</span></div>
      </div>
    </div>
    <div class="scroll-indicator">
      <div class="scroll-dot"></div>
      <span>مرر للأسفل</span>
    </div>
  </section>

  <!-- Categories -->
  <section class="categories-section">
    <div class="section-header">
      <h2>تسوّق بالفئة</h2>
      <p>اختر من مجموعة واسعة من الأقسام</p>
    </div>
    <div class="categories-grid">
      ${['رجالي','نسائي','أطفال','رياضي','كاجوال','فاخر'].map((cat, i) => `
      <div class="category-card" onclick="window.location='/shop?cat=${i}'" style="--delay:${i*0.1}s">
        <div class="cat-icon-3d">
          <i class="fas fa-${['male','female','baby','running','tshirt','gem'][i]}"></i>
        </div>
        <div class="cat-overlay"></div>
        <h3>${cat}</h3>
        <span class="cat-count">${[120,95,75,80,110,45][i]}+ منتج</span>
        <div class="cat-arrow"><i class="fas fa-arrow-left"></i></div>
      </div>`).join('')}
    </div>
  </section>

  <!-- Featured Products -->
  <section class="featured-section">
    <div class="section-header">
      <h2>أبرز المنتجات</h2>
      <a href="/shop" class="see-all">عرض الكل <i class="fas fa-arrow-left"></i></a>
    </div>
    <div class="products-grid" id="featuredGrid">
    </div>
  </section>

  <!-- Promo Banner -->
  <section class="promo-section">
    <div class="promo-card mega-promo">
      <div class="promo-content">
        <span class="promo-tag">عرض محدود</span>
        <h2>خصم 30% على كل الكولكشن الجديد</h2>
        <p>لفترة محدودة فقط. لا تفوّت الفرصة!</p>
        <a href="/shop" class="btn-primary">احصل على الخصم</a>
      </div>
      <div class="promo-countdown">
        <div class="countdown-item"><span id="cDays">02</span><small>يوم</small></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span id="cHours">14</span><small>ساعة</small></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span id="cMins">30</span><small>دقيقة</small></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span id="cSecs">00</span><small>ثانية</small></div>
      </div>
      <div class="promo-3d" id="promo3d"></div>
    </div>
  </section>

  <!-- Trending -->
  <section class="trending-section">
    <div class="section-header">
      <h2><i class="fas fa-fire text-orange"></i> الأكثر مبيعاً</h2>
    </div>
    <div class="trending-slider" id="trendingSlider"></div>
  </section>

  <!-- Brands -->
  <section class="brands-section">
    <h3>شركاؤنا من أفضل الماركات</h3>
    <div class="brands-ticker">
      <div class="brands-track">
        ${['ZARA','H&M','MANGO','GUCCI','PRADA','DIOR','LV','CHANEL','NIKE','ADIDAS'].map(b => `<div class="brand-item">${b}</div>`).join('')}
        ${['ZARA','H&M','MANGO','GUCCI','PRADA','DIOR','LV','CHANEL','NIKE','ADIDAS'].map(b => `<div class="brand-item">${b}</div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Newsletter -->
  <section class="newsletter-section">
    <div class="newsletter-card">
      <div class="newsletter-content">
        <i class="fas fa-envelope newsletter-icon"></i>
        <h2>اشترك في نشرتنا البريدية</h2>
        <p>احصل على أحدث العروض والكولكشنات مباشرة في بريدك</p>
        <div class="newsletter-form">
          <input type="email" placeholder="بريدك الإلكتروني...">
          <button class="btn-primary">اشترك</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">DUKKAN</div>
        <p>أفضل وجهة للأزياء العصرية الفاخرة</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-tiktok"></i></a>
          <a href="#"><i class="fab fa-snapchat"></i></a>
        </div>
      </div>
      <div class="footer-links">
        <h4>روابط سريعة</h4>
        <a href="/">الرئيسية</a>
        <a href="/shop">المتجر</a>
        <a href="/about">من نحن</a>
        <a href="/settings">الإعدادات</a>
      </div>
      <div class="footer-links">
        <h4>خدمة العملاء</h4>
        <a href="#">تواصل معنا</a>
        <a href="#">سياسة الإرجاع</a>
        <a href="#">الشحن والتوصيل</a>
        <a href="#">الأسئلة الشائعة</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 DUKKAN. جميع الحقوق محفوظة</p>
    </div>
  </footer>

  <!-- Theme Quick Switch -->
  <div class="theme-quick-switch" id="themeQuickSwitch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()" title="تغيير الثيم">
      <i class="fas fa-palette"></i>
    </button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-panel-title">اختر الثيم</div>
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/home.js"></script>
</body>
</html>`
}

function shopPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | المتجر</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <!-- Navbar -->
  <nav class="navbar" id="navbar">
    <div class="nav-brand">
      <div class="nav-logo-icon">D</div>
      <span>DUKKAN</span>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link active"><i class="fas fa-store"></i><span>المتجر</span></a>
      <a href="/about" class="nav-link"><i class="fas fa-info-circle"></i><span>من نحن</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/wishlist'"><i class="fas fa-heart"></i><span class="badge" id="wishCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
      <div class="nav-avatar" onclick="window.location='/profile'">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar">
      </div>
    </div>
  </nav>

  <!-- Shop Hero -->
  <div class="shop-hero">
    <h1>المتجر</h1>
    <p>اكتشف أكثر من 500 منتج من أفضل الماركات العالمية</p>
    <div class="search-bar-large">
      <i class="fas fa-search"></i>
      <input type="text" id="searchInput" placeholder="ابحث عن منتج..." oninput="filterProducts()">
      <button class="search-btn">بحث</button>
    </div>
  </div>

  <!-- Shop Layout -->
  <div class="shop-layout">
    <!-- Filters Sidebar -->
    <aside class="filters-sidebar" id="filtersSidebar">
      <div class="filters-header">
        <h3><i class="fas fa-filter"></i> الفلاتر</h3>
        <button onclick="clearFilters()" class="clear-filters">مسح الكل</button>
      </div>

      <div class="filter-group">
        <h4>الفئات</h4>
        <div class="filter-options">
          ${['الكل','رجالي','نسائي','أطفال','رياضي','كاجوال','فاخر'].map((c,i) => `
          <label class="filter-check">
            <input type="checkbox" value="${i}" onchange="filterProducts()">
            <span class="checkmark"></span>
            ${c}
            <small>(${[525,120,95,75,80,110,45][i]})</small>
          </label>`).join('')}
        </div>
      </div>

      <div class="filter-group">
        <h4>نطاق السعر</h4>
        <div class="price-range">
          <input type="range" min="0" max="1000" value="1000" id="priceMax" oninput="updatePriceFilter(this.value)" class="range-slider">
          <div class="price-labels">
            <span>0 ر.س</span>
            <span id="priceMaxLabel">1000 ر.س</span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <h4>التقييم</h4>
        <div class="rating-filters">
          ${[5,4,3,2,1].map(r => `
          <label class="filter-check">
            <input type="checkbox" value="${r}" onchange="filterProducts()">
            <span class="checkmark"></span>
            ${'★'.repeat(r)}${'☆'.repeat(5-r)}
          </label>`).join('')}
        </div>
      </div>

      <div class="filter-group">
        <h4>المقاس</h4>
        <div class="size-grid">
          ${['XS','S','M','L','XL','XXL'].map(s => `<button class="size-btn" onclick="toggleSize(this,'${s}')">${s}</button>`).join('')}
        </div>
      </div>

      <div class="filter-group">
        <h4>اللون</h4>
        <div class="color-grid">
          ${['#1a1a2e','#e8c4a0','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#dfe6e9'].map(col => `
          <button class="color-dot" style="background:${col}" onclick="toggleColor(this,'${col}')"></button>`).join('')}
        </div>
      </div>
    </aside>

    <!-- Products Area -->
    <main class="products-area">
      <div class="products-toolbar">
        <div class="results-count"><span id="resultsCount">525</span> منتج</div>
        <div class="toolbar-right">
          <select class="sort-select" onchange="sortProducts(this.value)">
            <option value="featured">الأكثر شيوعاً</option>
            <option value="price-low">السعر: من الأقل</option>
            <option value="price-high">السعر: من الأعلى</option>
            <option value="newest">الأحدث</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
          <div class="view-toggle">
            <button class="view-btn active" onclick="setView('grid',this)"><i class="fas fa-th"></i></button>
            <button class="view-btn" onclick="setView('list',this)"><i class="fas fa-list"></i></button>
          </div>
        </div>
      </div>

      <!-- Active Filters Tags -->
      <div class="active-filters" id="activeFilters"></div>

      <!-- Products Grid -->
      <div class="products-grid shop-grid" id="shopGrid">
        <!-- Injected by JS -->
      </div>

      <!-- Pagination -->
      <div class="pagination" id="pagination">
        <button class="page-btn prev" onclick="changePage(-1)"><i class="fas fa-chevron-right"></i></button>
        <div class="page-numbers" id="pageNumbers"></div>
        <button class="page-btn next" onclick="changePage(1)"><i class="fas fa-chevron-left"></i></button>
      </div>
    </main>
  </div>

  <!-- Theme Quick Switch -->
  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-panel-title">اختر الثيم</div>
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/shop.js"></script>
</body>
</html>`
}

function productPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | المنتج</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand">
      <div class="nav-logo-icon">D</div>
      <span>DUKKAN</span>
    </div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
      <div class="nav-avatar" onclick="window.location='/profile'"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar"></div>
    </div>
  </nav>

  <div class="product-page" id="productPage">
    <!-- Product loaded by JS -->
  </div>

  <!-- Theme Quick Switch -->
  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-panel-title">اختر الثيم</div>
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/product.js"></script>
</body>
</html>`
}

function cartPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | السلة</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand"><div class="nav-logo-icon">D</div><span>DUKKAN</span></div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn active-nav" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
      <div class="nav-avatar" onclick="window.location='/profile'"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar"></div>
    </div>
  </nav>

  <div class="cart-page">
    <div class="cart-header">
      <h1><i class="fas fa-shopping-cart"></i> سلتي</h1>
      <span id="cartItemsCount">0 منتجات</span>
    </div>
    <div class="cart-layout">
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-summary" id="cartSummary"></div>
    </div>
  </div>

  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-panel-title">اختر الثيم</div>
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/cart.js"></script>
</body>
</html>`
}

function wishlistPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | المفضلة</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand"><div class="nav-logo-icon">D</div><span>DUKKAN</span></div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn active-nav"><i class="fas fa-heart"></i><span class="badge" id="wishCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
    </div>
  </nav>
  <div class="wishlist-page">
    <div class="page-header"><h1><i class="fas fa-heart"></i> المفضلة</h1></div>
    <div class="products-grid" id="wishlistGrid"></div>
  </div>

  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>
  <script src="/static/app.js"></script>
  <script src="/static/wishlist.js"></script>
</body>
</html>`
}

function aboutPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | من نحن</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand"><div class="nav-logo-icon">D</div><span>DUKKAN</span></div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
      <a href="/about" class="nav-link active"><i class="fas fa-info-circle"></i><span>من نحن</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
      <div class="nav-avatar" onclick="window.location='/profile'"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar"></div>
    </div>
  </nav>

  <div class="about-page">
    <canvas id="aboutCanvas"></canvas>
    <div class="about-hero">
      <h1 class="about-title">قصتنا مع <span class="gradient-text">الأناقة</span></h1>
      <p class="about-subtitle">من متجر صغير إلى وجهة الموضة الأولى في المنطقة</p>
    </div>

    <div class="about-story">
      <div class="story-card">
        <div class="story-year">2019</div>
        <div class="story-content">
          <h3>البداية</h3>
          <p>بدأنا رحلتنا بحلم بسيط: نجعل الموضة الراقية في متناول الجميع</p>
        </div>
      </div>
      <div class="story-card">
        <div class="story-year">2021</div>
        <div class="story-content">
          <h3>التوسع</h3>
          <p>أضفنا أكثر من 200 علامة تجارية عالمية لمجموعتنا</p>
        </div>
      </div>
      <div class="story-card">
        <div class="story-year">2023</div>
        <div class="story-content">
          <h3>الانطلاق الرقمي</h3>
          <p>إطلاق منصتنا الرقمية المتكاملة لخدمة عملائنا في كل مكان</p>
        </div>
      </div>
      <div class="story-card">
        <div class="story-year">2025</div>
        <div class="story-content">
          <h3>الحاضر</h3>
          <p>أكثر من 50,000 عميل سعيد وعلامة تجارية عالمية</p>
        </div>
      </div>
    </div>

    <div class="team-section">
      <h2>فريقنا</h2>
      <div class="team-grid">
        ${['أحمد محمد','سارة علي','محمد خالد','رنا أحمد'].map((name,i) => `
        <div class="team-card">
          <div class="team-avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}" alt="${name}">
          </div>
          <h4>${name}</h4>
          <p>${['المدير التنفيذي','مديرة التصميم','مدير التقنية','مديرة التسويق'][i]}</p>
          <div class="team-social">
            <a href="#"><i class="fab fa-linkedin"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="values-section">
      <h2>قيمنا</h2>
      <div class="values-grid">
        ${[['fa-gem','الجودة','نختار فقط أفضل المنتجات'],['fa-heart','العملاء','رضا عملائنا هو أولويتنا'],['fa-leaf','الاستدامة','ملتزمون بالأزياء المستدامة'],['fa-rocket','الابتكار','دائماً في طليعة الموضة']].map(([icon,title,desc]) => `
        <div class="value-card">
          <i class="fas ${icon}"></i>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/about.js"></script>
</body>
</html>`
}

function settingsPage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | الإعدادات</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand"><div class="nav-logo-icon">D</div><span>DUKKAN</span></div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <div class="nav-avatar" onclick="window.location='/profile'"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar"></div>
    </div>
  </nav>

  <div class="settings-page">
    <div class="settings-header">
      <h1><i class="fas fa-palette"></i> الإعدادات</h1>
      <p>خصّص تجربتك مع دكان</p>
    </div>

    <div class="settings-layout">
      <aside class="settings-sidebar">
        <button class="settings-nav active" onclick="showSettingsTab('themes',this)"><i class="fas fa-palette"></i> الثيمات</button>
        <button class="settings-nav" onclick="showSettingsTab('appearance',this)"><i class="fas fa-sun"></i> المظهر</button>
        <button class="settings-nav" onclick="showSettingsTab('language',this)"><i class="fas fa-globe"></i> اللغة</button>
        <button class="settings-nav" onclick="showSettingsTab('notifications',this)"><i class="fas fa-bell"></i> الإشعارات</button>
        <button class="settings-nav" onclick="showSettingsTab('privacy',this)"><i class="fas fa-shield-alt"></i> الخصوصية</button>
        <button class="settings-nav" onclick="showSettingsTab('account',this)"><i class="fas fa-user-cog"></i> الحساب</button>
      </aside>

      <div class="settings-content">
        <!-- Themes Tab -->
        <div class="settings-tab active" id="tab-themes">
          <h2>اختر ثيمك</h2>
          <p class="tab-desc">اختر من بين 6 ثيمات مختلفة كلياً</p>
          <div class="themes-showcase">
            <div class="theme-card active" data-theme="liquid-glass" onclick="selectTheme(this,'liquid-glass')">
              <div class="theme-card-preview" id="prev-liquid-glass">
                <canvas class="theme-preview-canvas" id="canvas-liquid-glass"></canvas>
                <div class="theme-card-mockup lq-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,#a8edea,#fed6e3)">💧</div>
                <div>
                  <h3>Liquid Glass</h3>
                  <p>زجاج سائل شفاف مع تأثيرات ضوئية مذهلة</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="theme-card" data-theme="minimalism" onclick="selectTheme(this,'minimalism')">
              <div class="theme-card-preview">
                <div class="theme-card-mockup mn-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,#f5f5f5,#e0e0e0)">◽</div>
                <div>
                  <h3>Minimalism</h3>
                  <p>بساطة راقية، تصميم نظيف وأنيق</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="theme-card" data-theme="clay" onclick="selectTheme(this,'clay')">
              <div class="theme-card-preview">
                <div class="theme-card-mockup cl-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,#ffecd2,#fcb69f)">🎨</div>
                <div>
                  <h3>Clay Morphism</h3>
                  <p>طين رقمي بألوان دافئة وأشكال ناعمة</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="theme-card" data-theme="glassmorphism" onclick="selectTheme(this,'glassmorphism')">
              <div class="theme-card-preview">
                <div class="theme-card-mockup gm-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.1))">🪟</div>
                <div>
                  <h3>Glassmorphism</h3>
                  <p>زجاج شفاف مع خلفيات ضبابية جميلة</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="theme-card" data-theme="skeuomorphism" onclick="selectTheme(this,'skeuomorphism')">
              <div class="theme-card-preview">
                <div class="theme-card-mockup sk-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,#d4a574,#c17f3c)">🎭</div>
                <div>
                  <h3>Skeuomorphism</h3>
                  <p>محاكاة واقعية مع ظلال وأبعاد مذهلة</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="theme-card" data-theme="neomorphism" onclick="selectTheme(this,'neomorphism')">
              <div class="theme-card-preview">
                <div class="theme-card-mockup nm-mock">
                  <div class="mock-nav"></div>
                  <div class="mock-hero"></div>
                  <div class="mock-cards"><div></div><div></div><div></div></div>
                </div>
              </div>
              <div class="theme-card-info">
                <div class="theme-card-icon" style="background:linear-gradient(135deg,#e0e5ec,#a3b1c6)">💿</div>
                <div>
                  <h3>Neomorphism</h3>
                  <p>تصميم بارز وغائر بظلال ناعمة خلابة</p>
                </div>
                <div class="theme-check"><i class="fas fa-check"></i></div>
              </div>
            </div>
          </div>

          <div class="theme-apply-bar">
            <span>الثيم المحدد: <strong id="selectedThemeName">Liquid Glass</strong></span>
            <button class="btn-primary" onclick="applyThemeFromSettings()">تطبيق الثيم <i class="fas fa-check"></i></button>
          </div>
        </div>

        <!-- Appearance Tab -->
        <div class="settings-tab" id="tab-appearance">
          <h2>إعدادات المظهر</h2>
          <div class="setting-item">
            <div class="setting-info"><h4>الوضع الداكن</h4><p>تبديل بين الوضع الداكن والفاتح</p></div>
            <label class="toggle-switch">
              <input type="checkbox" id="darkModeToggle" onchange="toggleDarkMode(this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>الخطوط</h4><p>اختر حجم الخط المناسب</p></div>
            <div class="font-size-control">
              <button onclick="changeFontSize(-1)">A-</button>
              <span id="fontSizeDisplay">متوسط</span>
              <button onclick="changeFontSize(1)">A+</button>
            </div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>الحركات والانيميشن</h4><p>تفعيل أو تعطيل التأثيرات</p></div>
            <label class="toggle-switch">
              <input type="checkbox" id="animToggle" checked onchange="toggleAnimations(this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Language Tab -->
        <div class="settings-tab" id="tab-language">
          <h2>اللغة والمنطقة</h2>
          <div class="lang-options">
            <div class="lang-card active" onclick="setLang('ar',this)"><span>🇸🇦</span><h4>العربية</h4></div>
            <div class="lang-card" onclick="setLang('en',this)"><span>🇺🇸</span><h4>English</h4></div>
            <div class="lang-card" onclick="setLang('fr',this)"><span>🇫🇷</span><h4>Français</h4></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>العملة</h4><p>اختر عملة العرض</p></div>
            <select class="settings-select" onchange="setCurrency(this.value)">
              <option value="SAR">ريال سعودي (ر.س)</option>
              <option value="AED">درهم (د.إ)</option>
              <option value="USD">دولار ($)</option>
              <option value="EUR">يورو (€)</option>
            </select>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div class="settings-tab" id="tab-notifications">
          <h2>الإشعارات</h2>
          ${[['إشعارات العروض','تلقي إشعارات عند توفر عروض جديدة','offers'],['إشعارات الطلبات','تتبع حالة طلباتك','orders'],['النشرة البريدية','استقبال أحدث الأزياء في بريدك','newsletter'],['إشعارات المخزون','تنبيه عند عودة منتج محفوظ','stock']].map(([t,d,k]) => `
          <div class="setting-item">
            <div class="setting-info"><h4>${t}</h4><p>${d}</p></div>
            <label class="toggle-switch"><input type="checkbox" checked onchange="saveNotifSetting('${k}',this.checked)"><span class="toggle-slider"></span></label>
          </div>`).join('')}
        </div>

        <!-- Privacy Tab -->
        <div class="settings-tab" id="tab-privacy">
          <h2>الخصوصية والأمان</h2>
          <div class="setting-item">
            <div class="setting-info"><h4>تغيير كلمة المرور</h4><p>تحديث كلمة المرور بشكل دوري</p></div>
            <button class="btn-outline" onclick="changePassword()">تغيير</button>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>المصادقة الثنائية</h4><p>حماية إضافية لحسابك</p></div>
            <label class="toggle-switch"><input type="checkbox" onchange="toggle2FA(this.checked)"><span class="toggle-slider"></span></label>
          </div>
          <div class="setting-item danger-item">
            <div class="setting-info"><h4>حذف الحساب</h4><p>هذا الإجراء لا يمكن التراجع عنه</p></div>
            <button class="btn-danger" onclick="deleteAccount()">حذف</button>
          </div>
        </div>

        <!-- Account Tab -->
        <div class="settings-tab" id="tab-account">
          <h2>إعدادات الحساب</h2>
          <div class="profile-edit-form">
            <div class="avatar-edit">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar" id="settingsAvatar">
              <button class="avatar-edit-btn" onclick="changeAvatar()"><i class="fas fa-camera"></i></button>
            </div>
            <div class="form-row">
              <div class="input-group floating">
                <input type="text" placeholder=" " value="أحمد محمد">
                <label>الاسم</label>
              </div>
              <div class="input-group floating">
                <input type="email" placeholder=" " value="ahmed@dukkan.com">
                <label>البريد الإلكتروني</label>
              </div>
            </div>
            <button class="btn-primary" onclick="saveProfile()">حفظ التغييرات</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js"></script>
  <script src="/static/app.js"></script>
  <script src="/static/settings.js"></script>
</body>
</html>`
}

function profilePage() {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DUKKAN | الملف الشخصي</title>
  <link rel="stylesheet" href="/static/themes.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="theme-liquid-glass" id="appBody">
  <nav class="navbar" id="navbar">
    <div class="nav-brand"><div class="nav-logo-icon">D</div><span>DUKKAN</span></div>
    <div class="nav-links">
      <a href="/" class="nav-link"><i class="fas fa-home"></i><span>الرئيسية</span></a>
      <a href="/shop" class="nav-link"><i class="fas fa-store"></i><span>المتجر</span></a>
    </div>
    <div class="nav-actions">
      <button class="nav-btn" onclick="window.location='/cart'"><i class="fas fa-shopping-cart"></i><span class="badge" id="cartCount">0</span></button>
      <button class="nav-btn" onclick="window.location='/settings'"><i class="fas fa-palette"></i></button>
    </div>
  </nav>

  <div class="profile-page">
    <div class="profile-cover"></div>
    <div class="profile-header">
      <div class="profile-avatar-wrap">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=dukkan" alt="avatar" class="profile-big-avatar">
        <div class="avatar-status online"></div>
      </div>
      <div class="profile-info">
        <h1>أحمد محمد</h1>
        <p>ahmed@dukkan.com</p>
        <div class="profile-badges">
          <span class="badge-vip"><i class="fas fa-crown"></i> VIP عميل</span>
          <span class="badge-since">عضو منذ 2023</span>
        </div>
      </div>
      <button class="btn-outline" onclick="window.location='/settings'"><i class="fas fa-edit"></i> تعديل الملف</button>
    </div>

    <div class="profile-stats-bar">
      <div class="pstat"><span>15</span><small>طلب</small></div>
      <div class="pstat"><span>8</span><small>مفضلة</small></div>
      <div class="pstat"><span>3</span><small>مراجعة</small></div>
      <div class="pstat"><span>2,450</span><small>نقطة</small></div>
    </div>

    <div class="profile-tabs">
      <button class="ptab active" onclick="showProfileTab('orders',this)">طلباتي</button>
      <button class="ptab" onclick="showProfileTab('addresses',this)">عناويني</button>
      <button class="ptab" onclick="showProfileTab('reviews',this)">مراجعاتي</button>
      <button class="ptab" onclick="showProfileTab('points',this)">النقاط</button>
    </div>

    <div class="profile-content">
      <div class="profile-tab-content active" id="ptab-orders">
        <div class="orders-list">
          ${[{id:'#12345',items:3,status:'مكتمل',price:450,date:'15 يناير 2025'},{id:'#12344',items:1,status:'قيد الشحن',price:120,date:'20 يناير 2025'},{id:'#12343',items:2,status:'قيد المعالجة',price:300,date:'22 يناير 2025'}].map(o => `
          <div class="order-card">
            <div class="order-id">${o.id}</div>
            <div class="order-details">
              <span>${o.items} منتجات</span>
              <span class="order-status status-${o.status === 'مكتمل' ? 'done' : o.status === 'قيد الشحن' ? 'shipping' : 'processing'}">${o.status}</span>
            </div>
            <div class="order-price">${o.price} ر.س</div>
            <div class="order-date">${o.date}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="profile-tab-content" id="ptab-addresses">
        <div class="addresses-grid">
          <div class="address-card default">
            <i class="fas fa-map-marker-alt"></i>
            <h4>المنزل <span class="default-badge">افتراضي</span></h4>
            <p>شارع الملك فهد، الرياض، السعودية</p>
            <div class="address-actions">
              <button class="btn-sm">تعديل</button>
              <button class="btn-sm btn-danger-sm">حذف</button>
            </div>
          </div>
          <button class="add-address-btn" onclick="addAddress()"><i class="fas fa-plus"></i> إضافة عنوان</button>
        </div>
      </div>
      <div class="profile-tab-content" id="ptab-reviews">
        <p style="text-align:center;padding:40px;opacity:0.6">لا توجد مراجعات بعد</p>
      </div>
      <div class="profile-tab-content" id="ptab-points">
        <div class="points-card">
          <div class="points-balance"><span id="pts">2,450</span><small>نقطة</small></div>
          <p>= 24.50 ر.س خصم</p>
          <button class="btn-primary">استخدام النقاط</button>
        </div>
      </div>
    </div>
  </div>

  <div class="theme-quick-switch">
    <button class="theme-toggle-btn" onclick="toggleThemePanel()"><i class="fas fa-palette"></i></button>
    <div class="theme-panel" id="themePanel">
      <div class="theme-options">
        <button class="theme-opt active" data-theme="liquid-glass" onclick="applyTheme('liquid-glass')"><div class="theme-preview lq"></div><span>Liquid Glass</span></button>
        <button class="theme-opt" data-theme="minimalism" onclick="applyTheme('minimalism')"><div class="theme-preview mn"></div><span>Minimalism</span></button>
        <button class="theme-opt" data-theme="clay" onclick="applyTheme('clay')"><div class="theme-preview cl"></div><span>Clay</span></button>
        <button class="theme-opt" data-theme="glassmorphism" onclick="applyTheme('glassmorphism')"><div class="theme-preview gm"></div><span>Glassmorphism</span></button>
        <button class="theme-opt" data-theme="skeuomorphism" onclick="applyTheme('skeuomorphism')"><div class="theme-preview sk"></div><span>Skeuomorphism</span></button>
        <button class="theme-opt" data-theme="neomorphism" onclick="applyTheme('neomorphism')"><div class="theme-preview nm"></div><span>Neomorphism</span></button>
      </div>
    </div>
  </div>
  <script src="/static/app.js"></script>
  <script src="/static/profile.js"></script>
</body>
</html>`
}

function getProducts() {
  const categories = ['رجالي','نسائي','أطفال','رياضي','كاجوال','فاخر']
  const items = ['قميص','بنطلون','فستان','جاكيت','بلوزة','تيشيرت','كوت','سترة','شورت','تنورة']
  const brands = ['ZARA','H&M','MANGO','Gucci','Nike','Adidas','Prada','Dior']
  const colors = ['أسود','أبيض','أزرق','أحمر','رمادي','بيج','أخضر']
  const images = [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
  ]
  
  return Array.from({length: 24}, (_,i) => ({
    id: i+1,
    name: `${items[i%items.length]} ${brands[i%brands.length]}`,
    price: Math.floor(Math.random()*800+100),
    originalPrice: Math.floor(Math.random()*1000+200),
    category: categories[i%categories.length],
    brand: brands[i%brands.length],
    color: colors[i%colors.length],
    rating: (3.5 + Math.random()*1.5).toFixed(1),
    reviews: Math.floor(Math.random()*200+10),
    image: images[i%images.length],
    badge: ['جديد','خصم','الأكثر مبيعاً','محدود','','',''][i%7],
    inStock: Math.random() > 0.1,
    sizes: ['S','M','L','XL']
  }))
}
