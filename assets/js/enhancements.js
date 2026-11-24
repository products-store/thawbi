/**
 * تحسينات تفاعلية صغيرة — متجر M
 * - نبضة عدّاد السلة عند تغيّر القيمة
 * - ظل للهيدر عند التمرير
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. نبضة العدّاد عند تغيّر عدد عناصر السلة
  const badge = document.getElementById("cartBadge");
  if (badge) {
    let lastValue = badge.textContent;
    const observer = new MutationObserver(() => {
      if (badge.textContent !== lastValue) {
        lastValue = badge.textContent;
        badge.classList.remove("bumped");
        void badge.offsetWidth; // إعادة تشغيل الحركة
        badge.classList.add("bumped");
      }
    });
    observer.observe(badge, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  // 2. ظل الهيدر عند التمرير
  const header = document.querySelector(".site-header");
  if (header) {
    const updateShadow = () => {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", updateShadow, { passive: true });
    updateShadow();
  }
});