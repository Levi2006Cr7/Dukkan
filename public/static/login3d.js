// =============================================
// DUKKAN - Login Page 3D Three.js Effect
// =============================================

let loginScene, loginCamera, loginRenderer, loginAnimFrame;

function initLogin3D() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  loginScene = new THREE.Scene();
  loginCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  loginCamera.position.z = 5;

  loginRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  loginRenderer.setSize(window.innerWidth, window.innerHeight);
  loginRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create floating geometric shapes
  const geometries = [
    new THREE.IcosahedronGeometry(0.8, 1),
    new THREE.OctahedronGeometry(0.6, 0),
    new THREE.TetrahedronGeometry(0.7, 0),
    new THREE.TorusGeometry(0.5, 0.2, 8, 20),
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.ConeGeometry(0.5, 1, 6),
    new THREE.TorusKnotGeometry(0.4, 0.12, 64, 8),
    new THREE.DodecahedronGeometry(0.6, 0),
    new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8),
  ];

  const theme = localStorage.getItem('dukkan-theme') || 'liquid-glass';
  const colors = getThemeColors(theme);

  const shapes = [];
  const numShapes = 30;

  for (let i = 0; i < numShapes; i++) {
    const geo = geometries[i % geometries.length];
    const material = new THREE.MeshPhongMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.15 + Math.random() * 0.2,
      wireframe: Math.random() > 0.4,
      shininess: 100,
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.1,
    });

    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15
    );
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    const scale = 0.3 + Math.random() * 1.5;
    mesh.scale.set(scale, scale, scale);

    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      rotZ: (Math.random() - 0.5) * 0.01,
      floatSpeed: 0.3 + Math.random() * 0.7,
      floatOffset: Math.random() * Math.PI * 2,
      originalY: mesh.position.y,
      driftX: (Math.random() - 0.5) * 0.005,
      driftY: (Math.random() - 0.5) * 0.005,
    };

    loginScene.add(mesh);
    shapes.push(mesh);
  }

  // Particle system
  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: colors[0],
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  loginScene.add(particles);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  loginScene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(colors[0], 2, 20);
  pointLight1.position.set(5, 5, 5);
  loginScene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(colors[1], 1.5, 15);
  pointLight2.position.set(-5, -5, 3);
  loginScene.add(pointLight2);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Central logo 3D shape
  const logoGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);
  const logoMat = new THREE.MeshPhongMaterial({
    color: colors[0],
    transparent: true,
    opacity: 0.7,
    wireframe: false,
    shininess: 200,
    emissive: colors[0],
    emissiveIntensity: 0.2,
  });
  const logoMesh = new THREE.Mesh(logoGeo, logoMat);
  logoMesh.position.set(-4, 0, 1);
  loginScene.add(logoMesh);

  const logo3dContainer = document.getElementById('logo3d');
  if (logo3dContainer) {
    const logoCanvas = document.createElement('canvas');
    logoCanvas.style.cssText = 'width:80px;height:80px;border-radius:24px';
    logo3dContainer.appendChild(logoCanvas);

    const logoScene = new THREE.Scene();
    const logoCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    logoCamera.position.z = 2.5;
    const logoRenderer = new THREE.WebGLRenderer({ canvas: logoCanvas, alpha: true, antialias: true });
    logoRenderer.setSize(160, 160);

    const smallLogo = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.6, 0.2, 64, 12),
      new THREE.MeshPhongMaterial({ color: 0xa8edea, shininess: 200, emissive: 0xa8edea, emissiveIntensity: 0.2 })
    );
    logoScene.add(smallLogo);
    logoScene.add(new THREE.AmbientLight(0xffffff, 1));
    const pl = new THREE.PointLight(0xa8edea, 3, 10);
    pl.position.set(2, 2, 2);
    logoScene.add(pl);

    const animLogo = () => {
      requestAnimationFrame(animLogo);
      smallLogo.rotation.y += 0.03;
      smallLogo.rotation.x += 0.01;
      logoRenderer.render(logoScene, logoCamera);
    };
    animLogo();
  }

  let time = 0;
  function animate() {
    loginAnimFrame = requestAnimationFrame(animate);
    time += 0.005;

    // Rotate shapes
    shapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotX;
      shape.rotation.y += shape.userData.rotY;
      shape.rotation.z += shape.userData.rotZ;
      shape.position.y = shape.userData.originalY + Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.3;
      shape.position.x += shape.userData.driftX;
      shape.position.y += shape.userData.driftY;

      // Wrap around
      if (Math.abs(shape.position.x) > 12) shape.userData.driftX *= -1;
      if (Math.abs(shape.position.y) > 12) shape.userData.driftY *= -1;
    });

    // Logo rotation
    logoMesh.rotation.y += 0.02;
    logoMesh.rotation.x += 0.01;
    logoMesh.position.x = -4 + Math.sin(time * 0.5) * 0.5;
    logoMesh.position.y = Math.cos(time * 0.3) * 0.3;

    // Particle rotation
    particles.rotation.y += 0.0005;

    // Camera follows mouse
    loginCamera.position.x += (mouseX * 0.5 - loginCamera.position.x) * 0.05;
    loginCamera.position.y += (mouseY * 0.5 - loginCamera.position.y) * 0.05;
    loginCamera.lookAt(loginScene.position);

    // Point light animation
    pointLight1.position.x = Math.sin(time) * 8;
    pointLight1.position.y = Math.cos(time * 0.7) * 6;
    pointLight2.position.x = Math.cos(time * 0.5) * 7;
    pointLight2.position.y = Math.sin(time * 0.8) * 5;

    loginRenderer.render(loginScene, loginCamera);
  }
  animate();

  window.addEventListener('resize', () => {
    loginCamera.aspect = window.innerWidth / window.innerHeight;
    loginCamera.updateProjectionMatrix();
    loginRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function getThemeColors(theme) {
  const themeColors = {
    'liquid-glass': [0xa8edea, 0xfed6e3, 0x667eea, 0xa29bfe],
    'minimalism': [0x111111, 0x333333, 0x666666, 0x999999],
    'clay': [0xe8856a, 0xf5a87c, 0xfde8d8, 0xd46b4e],
    'glassmorphism': [0x667eea, 0x764ba2, 0xf093fb, 0xf5576c],
    'skeuomorphism': [0x8b4513, 0xd4954a, 0xc17f3c, 0x654321],
    'neomorphism': [0x667eea, 0x764ba2, 0x5a67d8, 0xa29bfe],
  };
  return themeColors[theme] || themeColors['liquid-glass'];
}

// ==================== LOGIN FUNCTIONS ====================
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.auth-form').forEach(f => {
    f.classList.toggle('active', f.id === `${tab}Form`);
  });
}

function togglePass(btn) {
  const input = btn.closest('.input-group').querySelector('input');
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'جاري الدخول...';

  setTimeout(() => {
    localStorage.setItem('dukkan-user', JSON.stringify({ name: 'أحمد محمد', email: document.getElementById('email').value }));
    window.location.href = '/';
  }, 1500);
}

function handleSignup(e) {
  e.preventDefault();
  setTimeout(() => {
    localStorage.setItem('dukkan-user', JSON.stringify({ name: document.getElementById('name').value, email: document.getElementById('signupEmail').value }));
    window.location.href = '/';
  }, 1500);
}

function socialLogin(provider) {
  const icons = { google: '🟢', apple: '⚫', facebook: '🔵' };
  showToast(`جاري الدخول بـ ${provider}...`, 'info', 'fa-spinner');
  setTimeout(() => {
    localStorage.setItem('dukkan-user', JSON.stringify({ name: 'مستخدم جديد', email: `user@${provider}.com` }));
    window.location.href = '/';
  }, 1500);
}

// GSAP login card animation
function animateLoginCard() {
  if (typeof gsap === 'undefined') return;
  
  gsap.from('.login-card', {
    duration: 1.2,
    y: 60,
    opacity: 0,
    scale: 0.9,
    ease: 'elastic.out(1, 0.5)',
    delay: 0.2
  });

  gsap.from('.floating-shapes .shape', {
    duration: 2,
    opacity: 0,
    scale: 0,
    stagger: 0.1,
    ease: 'elastic.out(1, 0.3)',
    delay: 0.5
  });
}

// Input effects
document.addEventListener('DOMContentLoaded', () => {
  initLogin3D();
  animateLoginCard();
  
  // Input glow effect
  document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('focus', function() {
      this.closest('.input-group').style.filter = 'drop-shadow(0 0 8px rgba(168,237,234,0.3))';
    });
    input.addEventListener('blur', function() {
      this.closest('.input-group').style.filter = '';
    });
  });
});
