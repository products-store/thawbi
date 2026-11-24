/**
 * التحكم في واجهة المستخدم المشتركة (الهيدر، قائمة الهاتف، العدّاد، الإشعارات، التحقق)
 */
const StoreUI = {
  init() {
    this.updateCartBadge();
    this.initMobileMenu();
  },

  // تحديث عدّاد السلة الدائري الأخضر في الهيدر
  updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (badge) {
      badge.textContent = StoreStorage.getTotalItemsCount();
    }
  },

  // تشغيل زر القائمة للهاتف (Hamburger)
  initMobileMenu() {
    const btn = document.getElementById("hamburgerBtn");
    const mobileNav = document.getElementById("mobileNav");
    if (!btn || !mobileNav) return;

    btn.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen);
      btn.textContent = isOpen ? "✕" : "☰";
    });
  },

  // عرض إشعار منبثق (Toast)
  showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "error" : ""}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  // تنسيق الأرقام مع العملة (مثال: 3700 د.ج)
  formatPrice(amount) {
    return `${amount} ${STORE_CONFIG.currency}`;
  },

  // التحقق من رقم الهاتف (أرقام فقط، 9 أرقام على الأقل)
  isValidPhone(phoneStr) {
    const cleaned = phoneStr.trim();
    return /^[0-9]{9,}$/.test(cleaned);
  },

  // التحقق الشامل من حقول نموذج الطلب
  validateOrderForm({ name, phone, backupPhone }, errorIds) {
    let isValid = true;

    const nameEl = document.getElementById(errorIds.name);
    const phoneEl = document.getElementById(errorIds.phone);
    const backupEl = document.getElementById(errorIds.backupPhone);

    // تصفير الأخطاء السابقة
    if (nameEl) nameEl.textContent = "";
    if (phoneEl) phoneEl.textContent = "";
    if (backupEl) backupEl.textContent = "";

    if (!name || name.trim().length < 2) {
      if (nameEl) nameEl.textContent = "يرجى إدخال الاسم الكامل بشكل صحيح.";
      isValid = false;
    }

    if (!phone || !this.isValidPhone(phone)) {
      if (phoneEl) phoneEl.textContent = "يجب أن يتكون رقم الهاتف من 9 أرقام على الأقل (أرقام فقط).";
      isValid = false;
    }

    if (backupPhone && backupPhone.trim() !== "" && !this.isValidPhone(backupPhone)) {
      if (backupEl) backupEl.textContent = "رقم الهاتف الاحتياطي يجب أن يحتوي على 9 أرقام على الأقل.";
      isValid = false;
    }

    return isValid;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  StoreUI.init();
});