/**
 * منطق صفحة سلة التسوق (cart.html)
 * - عرض رسالة السلة الفارغة مع رابط للعودة لاختيار المنتج
 * - عرض المنتجات المضافة مع تعديل الكمية (− / +) أو الحذف (×) والحفظ الفوري
 * - عرض ملخص السعر (بدون رسوم توصيل) وزر الانتقال لإتمام الشراء
 */
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");

  function renderCart() {
    const cart = StoreStorage.getCart();

    // حالة السلة الفارغة
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="card empty-state">
          <p>سلة التسوق فارغة</p>
          <a href="index.html" class="btn btn-green">تصفح القميص واختر لونك ومقاسك</a>
        </div>
      `;
      return;
    }

    // بناء عناصر السلة
    const itemsHtml = cart
      .map((item, index) => {
        const lineTotal = item.unitPrice * item.quantity;
        return `
          <div class="cart-item" data-index="${index}">
            <div class="cart-item-info">
              <img src="${item.image}" alt="${STORE_CONFIG.productName} - ${item.colorName}" class="cart-item-img" />
              <div>
                <h3 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 4px;">
                  ${STORE_CONFIG.productName}
                </h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 4px;">
                  اللون: <strong>${item.colorName}</strong> | المقاس: <strong>${item.size}</strong>
                </p>
                <span style="font-size: 0.9rem; color: var(--color-green); font-weight: 700;">
                  سعر الوحدة: ${StoreUI.formatPrice(item.unitPrice)}
                </span>
              </div>
            </div>

            <div class="cart-item-actions">
              <div class="quantity-control">
                <button type="button" class="qty-btn btn-decrease" data-index="${index}" aria-label="إنقاص الكمية">−</button>
                <span class="qty-input" style="display: flex; align-items: center; justify-content: center;">${item.quantity}</span>
                <button type="button" class="qty-btn btn-increase" data-index="${index}" aria-label="زيادة الكمية">+</button>
              </div>

              <div style="font-weight: 800; min-width: 90px; text-align: left;">
                ${StoreUI.formatPrice(lineTotal)}
              </div>

              <button type="button" class="remove-item-btn" data-index="${index}" aria-label="حذف المنتج" title="حذف">×</button>
            </div>
          </div>
        `;
      })
      .join("");

    const subtotal = StoreStorage.getCartSubtotal();

    // عرض قائمة العناصر + ملخص السلة + زر إتمام الشراء
    cartContainer.innerHTML = `
      <div class="card">
        <div>${itemsHtml}</div>
      </div>

      <div class="card">
        <div class="order-summary-box" style="margin-bottom: 16px;">
          <div class="summary-row">
            <span>سعر المنتجات:</span>
            <span>${StoreUI.formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>التسليم:</span>
            <span class="free-delivery">يدا بيد — 0 د.ج</span>
          </div>
          <div class="summary-row total-row">
            <span>الإجمالي الكلي:</span>
            <span>${StoreUI.formatPrice(subtotal)}</span>
          </div>
        </div>

        <a href="checkout.html" class="btn btn-green btn-submit">إتمام الشراء</a>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // أزرار إنقاص الكمية
    document.querySelectorAll(".btn-decrease").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const cart = StoreStorage.getCart();
        if (!cart[index]) return;

        StoreStorage.updateItemQuantity(index, cart[index].quantity - 1);
        renderCart();
      });
    });

    // أزرار زيادة الكمية
    document.querySelectorAll(".btn-increase").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const cart = StoreStorage.getCart();
        if (!cart[index]) return;

        StoreStorage.updateItemQuantity(index, cart[index].quantity + 1);
        renderCart();
      });
    });

    // أزرار حذف العنصر
    document.querySelectorAll(".remove-item-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        StoreStorage.removeItem(index);
        StoreUI.showToast("تم حذف المنتج من السلة");
        renderCart();
      });
    });
  }

  renderCart();
});