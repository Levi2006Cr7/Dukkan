// =============================================
// DUKKAN - Settings Page JS
// =============================================

let selectedThemeTemp = localStorage.getItem('dukkan-theme') || 'liquid-glass';

const THEME_DISPLAY_NAMES = {
  'liquid-glass': 'Liquid Glass',
  'minimalism': 'Minimalism',
  'clay': 'Clay Morphism',
  'glassmorphism': 'Glassmorphism',
  'skeuomorphism': 'Skeuomorphism',
  'neomorphism': 'Neomorphism'
};

function showSettingsTab(tab, btn) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.settings-nav').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`)?.classList.add('active');
  if (btn) btn.classList.add('active');
}

function selectTheme(card, theme) {
  document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  selectedThemeTemp = theme;
  const nameEl = document.getElementById('selectedThemeName');
  if (nameEl) nameEl.textContent = THEME_DISPLAY_NAMES[theme];
}

function applyThemeFromSettings() {
  applyTheme(selectedThemeTemp);
  
  // Visual feedback
  const btn = document.querySelector('.theme-apply-bar .btn-primary');
  if (btn && typeof gsap !== 'undefined') {
    gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  }
}

function toggleDarkMode(enabled) {
  showToast(enabled ? 'تم تفعيل الوضع الداكن' : 'تم تفعيل الوضع الفاتح', 'success', 'fa-moon');
  localStorage.setItem('dukkan-dark-mode', enabled);
}

function changeFontSize(delta) {
  const sizes = ['صغير', 'متوسط', 'كبير'];
  let current = parseInt(localStorage.getItem('dukkan-font-size') || '1');
  current = Math.max(0, Math.min(2, current + delta));
  localStorage.setItem('dukkan-font-size', current);
  const display = document.getElementById('fontSizeDisplay');
  if (display) display.textContent = sizes[current];
  document.documentElement.style.fontSize = ['14px', '16px', '18px'][current];
  showToast('تم تغيير حجم الخط', 'success', 'fa-text-height');
}

function toggleAnimations(enabled) {
  localStorage.setItem('dukkan-animations', enabled);
  showToast(enabled ? 'تم تفعيل التأثيرات' : 'تم إيقاف التأثيرات', 'info', 'fa-magic');
}

function setLang(lang, card) {
  document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  localStorage.setItem('dukkan-lang', lang);
  showToast('تم تغيير اللغة', 'success', 'fa-globe');
}

function setCurrency(val) {
  localStorage.setItem('dukkan-currency', val);
  showToast(`تم تعيين العملة: ${val}`, 'success', 'fa-coins');
}

function saveNotifSetting(key, val) {
  localStorage.setItem(`dukkan-notif-${key}`, val);
}

function changePassword() {
  showToast('سيتم إرسال رابط تغيير كلمة المرور', 'info', 'fa-envelope');
}

function toggle2FA(enabled) {
  showToast(enabled ? 'تم تفعيل المصادقة الثنائية' : 'تم تعطيل المصادقة الثنائية', 'success', 'fa-shield-alt');
}

function deleteAccount() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:var(--overlay);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)';
  modal.innerHTML = `
    <div style="background:var(--card-bg);border:1px solid rgba(255,71,87,0.3);border-radius:24px;padding:2.5rem;text-align:center;max-width:380px;width:90%;backdrop-filter:blur(30px)">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#ff4757;margin-bottom:1rem;display:block"></i>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-primary);margin-bottom:0.5rem">حذف الحساب</h3>
      <p style="color:var(--text-secondary);margin-bottom:1.5rem;font-size:0.9rem">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء</p>
      <div style="display:flex;gap:1rem">
        <button class="btn-danger" style="flex:1" onclick="this.closest('[style*=fixed]').remove();showToast('تم حذف الحساب','success','fa-check')">نعم، احذف</button>
        <button class="btn-outline" style="flex:1" onclick="this.closest('[style*=fixed]').remove()">إلغاء</button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function changeAvatar() {
  showToast('جاري رفع الصورة...', 'info', 'fa-camera');
}

function saveProfile() {
  if (typeof gsap !== 'undefined') {
    gsap.from('.btn-primary', { scale: 0.9, duration: 0.2 });
  }
  showToast('تم حفظ التغييرات بنجاح', 'success', 'fa-check-circle');
}

function initSettingsPage() {
  // Set current theme card as active
  const currentTheme = localStorage.getItem('dukkan-theme') || 'liquid-glass';
  selectedThemeTemp = currentTheme;
  
  document.querySelectorAll('.theme-card').forEach(card => {
    const isActive = card.dataset.theme === currentTheme;
    card.classList.toggle('active', isActive);
  });
  
  const nameEl = document.getElementById('selectedThemeName');
  if (nameEl) nameEl.textContent = THEME_DISPLAY_NAMES[currentTheme];
  
  // Update theme-opt in panel
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
  });

  // GSAP animations
  if (typeof gsap !== 'undefined') {
    gsap.from('.settings-sidebar', { x: -30, opacity: 0, duration: 0.7 });
    gsap.from('.settings-content', { x: 30, opacity: 0, duration: 0.7 });
    gsap.from('.theme-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3 });
  }
}

document.addEventListener('DOMContentLoaded', initSettingsPage);
