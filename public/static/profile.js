// =============================================
// DUKKAN - Profile Page JS
// =============================================

function showProfileTab(tab, btn) {
  document.querySelectorAll('.profile-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.getElementById(`ptab-${tab}`)?.classList.add('active');
  if (btn) btn.classList.add('active');

  if (typeof gsap !== 'undefined') {
    gsap.from(`#ptab-${tab} > *`, { y: 20, opacity: 0, duration: 0.4, stagger: 0.05 });
  }
}

function addAddress() {
  showToast('سيتم إضافة نموذج العنوان قريباً', 'info', 'fa-map-marker-alt');
}

function initProfile() {
  if (typeof gsap !== 'undefined') {
    gsap.from('.profile-big-avatar', { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1,0.5)', delay: 0.2 });
    gsap.from('.profile-info h1, .profile-info p', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.3 });
    gsap.from('.pstat', { y: 30, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.5 });
  }

  // Animate points counter
  const ptsEl = document.getElementById('pts');
  if (ptsEl) {
    let current = 0;
    const target = 2450;
    const timer = setInterval(() => {
      current += target / 80;
      if (current >= target) { current = target; clearInterval(timer); }
      ptsEl.textContent = Math.floor(current).toLocaleString('ar-SA');
    }, 16);
  }
}

document.addEventListener('DOMContentLoaded', initProfile);
