// =============================================
// DUKKAN - About Page Three.js
// =============================================

function initAbout3D() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const theme = localStorage.getItem('dukkan-theme') || 'liquid-glass';
  const themeColors = {
    'liquid-glass': [0xa8edea, 0xfed6e3, 0x667eea],
    'minimalism': [0x222222, 0x888888, 0xcccccc],
    'clay': [0xe8856a, 0xf5a87c, 0xfde8d8],
    'glassmorphism': [0x667eea, 0x764ba2, 0xf093fb],
    'skeuomorphism': [0x8b4513, 0xd4954a, 0xc17f3c],
    'neomorphism': [0x667eea, 0x764ba2, 0xa29bfe],
  };
  const colors = themeColors[theme] || themeColors['liquid-glass'];

  // DNA-like helix
  const helixPoints = [];
  const helixPoints2 = [];
  for (let i = 0; i < 200; i++) {
    const t = i / 20;
    helixPoints.push(new THREE.Vector3(Math.cos(t) * 3, t - 5, Math.sin(t) * 0.5));
    helixPoints2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 3, t - 5, Math.sin(t + Math.PI) * 0.5));
  }

  const curve1 = new THREE.CatmullRomCurve3(helixPoints);
  const curve2 = new THREE.CatmullRomCurve3(helixPoints2);

  const helixGeo1 = new THREE.TubeGeometry(curve1, 200, 0.05, 6, false);
  const helixGeo2 = new THREE.TubeGeometry(curve2, 200, 0.05, 6, false);

  const helixMat = new THREE.MeshPhongMaterial({ color: colors[0], transparent: true, opacity: 0.25, emissive: colors[0], emissiveIntensity: 0.1 });
  const helixMat2 = new THREE.MeshPhongMaterial({ color: colors[1], transparent: true, opacity: 0.2, emissive: colors[1], emissiveIntensity: 0.1 });

  const helix1 = new THREE.Mesh(helixGeo1, helixMat);
  const helix2 = new THREE.Mesh(helixGeo2, helixMat2);

  helix1.position.set(6, 0, -3);
  helix2.position.set(6, 0, -3);

  scene.add(helix1);
  scene.add(helix2);

  // Floating spheres
  const spheres = [];
  for (let i = 0; i < 15; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 + Math.random() * 0.4, 16, 16),
      new THREE.MeshPhongMaterial({ color: colors[i % 3], transparent: true, opacity: 0.1 + Math.random() * 0.15, shininess: 200 })
    );
    s.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, -5 - Math.random() * 5);
    s.userData = { speed: 0.005 + Math.random() * 0.01, offset: Math.random() * Math.PI * 2 };
    scene.add(s);
    spheres.push(s);
  }

  // Particles
  const count = 300;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3] = (Math.random() - 0.5) * 30;
    pos[i*3+1] = (Math.random() - 0.5) * 25;
    pos[i*3+2] = (Math.random() - 0.5) * 15 - 5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: colors[0], size: 0.04, transparent: true, opacity: 0.35 }));
  scene.add(particles);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const pl = new THREE.PointLight(colors[0], 2, 25);
  pl.position.set(0, 5, 5);
  scene.add(pl);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    helix1.rotation.y += 0.003;
    helix2.rotation.y += 0.003;

    spheres.forEach((s, i) => {
      s.position.y += Math.sin(t * s.userData.speed * 10 + s.userData.offset) * 0.005;
    });

    particles.rotation.y += 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initAboutAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.from('.about-title', { y: -50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.about-subtitle', { y: 20, opacity: 0, duration: 0.8, delay: 0.5 });

  gsap.from('.story-card', {
    scrollTrigger: { trigger: '.about-story', start: 'top 80%' },
    x: -50, opacity: 0, duration: 0.6, stagger: 0.2
  });

  gsap.from('.team-card', {
    scrollTrigger: { trigger: '.team-section', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)'
  });

  gsap.from('.value-card', {
    scrollTrigger: { trigger: '.values-section', start: 'top 80%' },
    scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAbout3D();
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  initAboutAnimations();
});
