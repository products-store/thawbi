/**
 * منطق صفحة إتمام الشراء (checkout.html)
 * - التحقق الفوري من وجود منتجات في السلة وإعادة التوجيه إذا كانت فارغة
 * - عرض ملخص عناصر السلة والإجمالي الكلي
 * - التحقق من المدخلات وإرسال طلب السلة بالكامل إلى Discord
 */
document.addEventListener("DOMContentLoaded", () => {
  const cart = StoreStorage.getCart();

  // حماية المسار: إذا كانت السلة فارغة، يُنبَّه المستخدم ويُعاد إلى السلة
  if (!cart || cart.length === 0) {
    alert("سلة التسوق فارغة! يرجى اختيار منتج أولاً.");
    window.location.href = "cart.html";
    return;
  }

  // عناصر النموذج
  const checkoutForm = document.getElementById("checkoutForm");
  const nameInput = document.getElementById("checkoutName");
  const phoneInput = document.getElementById("checkoutPhone");
  const backupPhoneInput = document.getElementById("checkoutBackupPhone");
  const submitBtn = document.getElementById("checkoutSubmitBtn");

  // عناصر ملخص الطلب
  const itemsListEl = document.getElementById("checkoutItemsList");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const totalEl = document.getElementById("checkoutTotal");

  // 1. تعبئة بيانات العميل المحفوظة مسبقاً إن وجدت
  function prefillCustomerData() {
    const saved = StoreStorage.getCustomerInfo();
    if (saved.name) nameInput.value = saved.name;
    if (saved.phone) phoneInput.value = saved.phone;
    if (saved.backupPhone) backupPhoneInput.value = saved.backupPhone;
  }

  // 2. عرض عناصر السلة والمجموع الكلي
  function renderOrderSummary() {
    itemsListEl.innerHTML = cart
      .map(
        (item) => `
        <div class="summary-row" style="font-size: 0.92rem;">
          <span>${STORE_CONFIG.productName} (${item.colorName} - مقاس ${item.size}) × ${item.quantity}</span>
          <strong>${StoreUI.formatPrice(item.unitPrice * item.quantity)}</strong>
        </div>
      `
      )
      .join("");

    const subtotal = StoreStorage.getCartSubtotal();
    subtotalEl.textContent = StoreUI.formatPrice(subtotal);
    totalEl.textContent = StoreUI.formatPrice(subtotal);
  }

  // 3. منع إدخال حروف غير رقمية في حقلي الهاتف
  [phoneInput, backupPhoneInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
  });

  // 4. إرسال الطلب
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const backupPhone = backupPhoneInput.value.trim();

    const isValid = StoreUI.validateOrderForm(
      { name, phone, backupPhone },
      {
        name: "checkoutNameError",
        phone: "checkoutPhoneError",
        backupPhone: "checkoutBackupPhoneError"
      }
    );

    if (!isValid) {
      StoreUI.showToast("يرجى التحقق من الحقول المطلوبة.", "error");
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري إرسال الطلب... ⏳";

    const totalAmount = StoreStorage.getCartSubtotal();
    const orderData = {
      orderType: "طلب من السلة",
      customer: { name, phone, backupPhone },
      items: cart,
      totalAmount
    };

    try {
      await DiscordService.sendOrder(orderData);

      // عند النجاح: حفظ بيانات العميل والطلب محلياً وتفريغ السلة
      StoreStorage.saveCustomerInfo({ name, phone, backupPhone });
      StoreStorage.saveOrder(orderData);
      StoreStorage.clearCart();

      StoreUI.showToast("لقد تم استلام طلبك، سنتصل بك للتأكيد");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1800);
    } catch (error) {
      console.error(error);
      StoreUI.showToast("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  prefillCustomerData();
  renderOrderSummary();
});