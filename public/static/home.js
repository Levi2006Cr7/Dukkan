// =============================================
// DUKKAN - Home Page JS
// =============================================

let homeScene, homeCamera, homeRenderer;

function initHomeBg3D() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  homeScene = new THREE.Scene();
  homeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  homeCamera.position.z = 8;

  homeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  homeRenderer.setSize(window.innerWidth, window.innerHeight);
  homeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const theme = localStorage.getItem('dukkan-theme') || 'liquid-glass';

  // Create floating 3D fabric/clothing shapes
  const shapes = [];
  const colors = getThemeColors(theme);

  // Torus shapes (like rings/bracelets)
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.8 + Math.random(), 0.1 + Math.random() * 0.2, 6, 20),
      new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.06 + Math.random() * 0.08,
        wireframe: true
      })
    );
    mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, -5 - Math.random() * 5);
    mesh.userData = { rx: 0.005, ry: 0.008 + Math.random() * 0.01, rz: 0.003 };
    homeScene.add(mesh);
    shapes.push(mesh);
  }

  // Icosahedra
  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1 + Math.random(), 0),
      new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.05 + Math.random() * 0.06,
        wireframe: true
      })
    );
    mesh.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 16, -8 - Math.random() * 4);
    mesh.userData = { rx: 0.003, ry: 0.006, rz: 0.002 };
    homeScene.add(mesh);
    shapes.push(mesh);
  }

  // Particle field
  const particles = createParticleField(colors[0]);
  homeScene.add(particles);

  // Lights
  homeScene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const pl = new THREE.PointLight(colors[0], 2, 30);
  pl.position.set(0, 5, 5);
  homeScene.add(pl);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = -(e.clientY / window.innerHeight - 0.5);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;

    shapes.forEach((s, i) => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.rotation.z += s.userData.rz;
      s.position.y += Math.sin(t + i) * 0.003;
    });

    particles.rotation.y += 0.0003;

    homeCamera.position.x += (mouseX * 0.5 - homeCamera.position.x) * 0.02;
    homeCamera.position.y += (mouseY * 0.3 - homeCamera.position.y) * 0.02;
    homeCamera.lookAt(homeScene.position);

    homeRenderer.render(homeScene, homeCamera);
  }
  animate();

  window.addEventListener('resize', () => {
    homeCamera.aspect = window.innerWidth / window.innerHeight;
    homeCamera.updateProjectionMatrix();
    homeRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function createParticleField(color) {
  const count = 500;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.04, transparent: true, opacity: 0.4 }));
}

function getThemeColors(theme) {
  const tc = {
    'liquid-glass': [0xa8edea, 0xfed6e3, 0x667eea],
    'minimalism': [0x222222, 0x666666, 0xaaaaaa],
    'clay': [0xe8856a, 0xf5a87c, 0xfde8d8],
    'glassmorphism': [0x667eea, 0x764ba2, 0xf093fb],
    'skeuomorphism': [0x8b4513, 0xd4954a, 0xc17f3c],
    'neomorphism': [0x667eea, 0x764ba2, 0xa29bfe],
  };
  return tc[theme] || tc['liquid-glass'];
}

function initHero3D() {
  const container = document.getElementById('hero3dContainer');
  if (!container || typeof THREE === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  const updateSize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width || 500, height || 500);
    camera.aspect = (width || 1) / (height || 1);
    camera.updateProjectionMatrix();
  };
  updateSize();

  // Create dress/clothing silhouette using custom geometry
  const group = new THREE.Group();

  // Main body - elongated sphere (dress shape)
  const bodyGeo = new THREE.SphereGeometry(1, 32, 32);
  bodyGeo.scale(0.8, 1.8, 0.4);
  const bodyMat = new THREE.MeshPhongMaterial({
    color: 0xa8edea,
    transparent: true,
    opacity: 0.4,
    shininess: 200,
    emissive: 0xa8edea,
    emissiveIntensity: 0.1,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Wireframe overlay
  const wireBody = new THREE.Mesh(bodyGeo, new THREE.MeshBasicMaterial({ color: 0xa8edea, wireframe: true, transparent: true, opacity: 0.2 }));
  group.add(wireBody);

  // Orbiting rings
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.5 + i * 0.3, 0.03, 8, 50),
      new THREE.MeshPhongMaterial({ color: [0xa8edea, 0xfed6e3, 0x667eea, 0xa29bfe][i], transparent: true, opacity: 0.5 + i * 0.1, emissive: [0xa8edea, 0xfed6e3, 0x667eea, 0xa29bfe][i], emissiveIntensity: 0.2 })
    );
    ring.rotation.x = Math.PI / (2 + i * 0.5);
    ring.rotation.y = (i * Math.PI) / 4;
    ring.userData = { speed: 0.01 + i * 0.005, axis: i % 3 };
    group.add(ring);
  }

  // Floating particles around
  for (let i = 0; i < 80; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xa8edea, transparent: true, opacity: 0.7 })
    );
    const theta = (i / 80) * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.8 + Math.random() * 0.8;
    p.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta) * 0.3);
    p.userData = { theta, speed: 0.005 + Math.random() * 0.01, r };
    group.add(p);
  }

  scene.add(group);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const pl = new THREE.PointLight(0xa8edea, 3, 20);
  pl.position.set(3, 3, 3);
  scene.add(pl);
  const pl2 = new THREE.PointLight(0xfed6e3, 2, 15);
  pl2.position.set(-3, -2, 2);
  scene.add(pl2);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    group.rotation.y += 0.005;
    group.children.forEach((child, i) => {
      if (child.userData.speed) {
        if (child.userData.axis === 0) child.rotation.x += child.userData.speed;
        else if (child.userData.axis === 1) child.rotation.y += child.userData.speed;
        else child.rotation.z += child.userData.speed;
      }
      if (child.userData.theta !== undefined) {
        child.userData.theta += child.userData.speed;
        child.position.x = child.userData.r * Math.cos(child.userData.theta);
        child.position.z = child.userData.r * Math.sin(child.userData.theta) * 0.3;
      }
    });

    group.position.y = Math.sin(t * 0.5) * 0.2;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', updateSize);
}

function initFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  const featured = PRODUCTS_DATA.slice(0, 8);
  grid.innerHTML = featured.map(p => createProductCard(p)).join('');
}

function initTrending() {
  const slider = document.getElementById('trendingSlider');
  if (!slider) return;

  const trending = [...PRODUCTS_DATA].sort((a,b) => b.reviews - a.reviews).slice(0, 10);
  slider.innerHTML = trending.map(p => createProductCard(p)).join('');

  // Auto scroll
  let scrolling = true;
  setInterval(() => {
    if (!scrolling) return;
    slider.scrollBy({ left: -1, behavior: 'smooth' });
    if (slider.scrollLeft <= 0) slider.scrollLeft = slider.scrollWidth / 2;
  }, 30);
}

// GSAP Scroll Animations
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.timeline()
    .from('.hero-badge', { y: -30, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' })
    .from('.hero-line1', { x: -50, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.hero-line2', { x: -50, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.hero-line3', { x: -50, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.7 }, '-=0.3')
    .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.7 }, '-=0.3')
    .from('.hero-stats .stat', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

  // Float cards
  gsap.from('.float-card', {
    scale: 0, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', delay: 0.8
  });

  // Section animations
  gsap.from('.categories-section .section-header', {
    scrollTrigger: { trigger: '.categories-section', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.7
  });

  gsap.from('.category-card', {
    scrollTrigger: { trigger: '.categories-grid', start: 'top 80%' },
    y: 50, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.5)'
  });

  gsap.from('.product-card', {
    scrollTrigger: { trigger: '.featured-section', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.5, stagger: 0.06
  });

  gsap.from('.mega-promo', {
    scrollTrigger: { trigger: '.promo-section', start: 'top 80%' },
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out'
  });
}

// Init all
document.addEventListener('DOMContentLoaded', () => {
  initHomeBg3D();
  initHero3D();
  initFeatured();
  initTrending();
  initScrollAnimations();

  // Animate stat counters when visible
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          let current = 0;
          const timer = setInterval(() => {
            current += target / 60;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current);
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats').forEach(el => statObserver.observe(el));
});
