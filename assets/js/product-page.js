/**
 * منطق الصفحة الرئيسية / صفحة المنتج (index.html)
 * - تبديل الألوان الـ 4 وتحديث الصور الـ 4 (الرئيسية + المصغرة)
 * - إدارة المقاسات (تعطيل غير المتوفر وتحديد أول مقاس متاح تلقائياً)
 * - التحكم بالكمية وتحديث ملخص الطلب السريع
 * - أزرار (اشتري الآن / أضف إلى السلة) وإرسال الطلب السريع إلى Discord
 */
document.addEventListener("DOMContentLoaded", () => {
  // حالة المنتج المختارة حالياً
  const state = {
    selectedColor: PRODUCT_VARIANTS[0],
    selectedImageIndex: 0,
    selectedSize: PRODUCT_VARIANTS[0].availableSizes[0] || "52",
    quantity: 1
  };

  // عناصر DOM
  const mainImageEl = document.getElementById("mainProductImage");
  const thumbnailsContainer = document.getElementById("thumbnailsContainer");
  const colorOptionsContainer = document.getElementById("colorOptionsContainer");
  const selectedColorNameEl = document.getElementById("selectedColorName");
  const sizeOptionsContainer = document.getElementById("sizeOptionsContainer");
  const quantityInput = document.getElementById("quantityInput");
  const decreaseQtyBtn = document.getElementById("decreaseQtyBtn");
  const increaseQtyBtn = document.getElementById("increaseQtyBtn");
  const buyNowBtn = document.getElementById("buyNowBtn");
  const addToCartBtn = document.getElementById("addToCartBtn");

  // عناصر نموذج الطلب السريع
  const quickOrderSection = document.getElementById("quickOrderSection");
  const quickOrderForm = document.getElementById("quickOrderForm");
  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");
  const backupPhoneInput = document.getElementById("backupPhone");
  const quickOrderSubmitBtn = document.getElementById("quickOrderSubmitBtn");

  // عناصر ملخص الطلب
  const summarySelectionText = document.getElementById("summarySelectionText");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryTotal = document.getElementById("summaryTotal");

  // 1. تعبئة بيانات العميل المحفوظة مسبقاً إن وجدت
  function prefillCustomerData() {
    const saved = StoreStorage.getCustomerInfo();
    if (saved.name) customerNameInput.value = saved.name;
    if (saved.phone) customerPhoneInput.value = saved.phone;
    if (saved.backupPhone) backupPhoneInput.value = saved.backupPhone;
  }

  // 2. رسم أزرار الألوان الأربعة
  function renderColors() {
    colorOptionsContainer.innerHTML = "";

    PRODUCT_VARIANTS.forEach((variant) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `color-btn ${variant.id === state.selectedColor.id ? "active" : ""}`;
      btn.innerHTML = `
        <span class="color-swatch" style="background-color: ${variant.hex};"></span>
        <span>${variant.name}</span>
      `;

      btn.addEventListener("click", () => {
        if (state.selectedColor.id === variant.id) return;

        state.selectedColor = variant;
        state.selectedImageIndex = 0;

        // عند تغيير اللون: إذا كان المقاس الحالي غير متوفر للون الجديد، نختار أول مقاس متاح تلقائياً
        if (!variant.availableSizes.includes(state.selectedSize)) {
          state.selectedSize = variant.availableSizes[0] || "";
        }

        renderColors();
        renderGallery();
        renderSizes();
        updateSummary();
      });

      colorOptionsContainer.appendChild(btn);
    });

    selectedColorNameEl.textContent = state.selectedColor.name;
  }

  // 3. رسم معرض الصور (الصورة الرئيسية + 4 صور مصغرة للون المختار)
  function renderGallery() {
    const images = state.selectedColor.images;
    mainImageEl.src = images[state.selectedImageIndex] || images[0];
    mainImageEl.alt = `${STORE_CONFIG.productName} - ${state.selectedColor.name}`;

    thumbnailsContainer.innerHTML = "";

    images.forEach((imgSrc, index) => {
      const thumbBtn = document.createElement("button");
      thumbBtn.type = "button";
      thumbBtn.className = `thumb-btn ${index === state.selectedImageIndex ? "active" : ""}`;
      thumbBtn.setAttribute("aria-label", `صورة ${index + 1} للون ${state.selectedColor.name}`);

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = `${state.selectedColor.name} ${index + 1}`;
      thumbBtn.appendChild(img);

      thumbBtn.addEventListener("click", () => {
        state.selectedImageIndex = index;
        mainImageEl.src = imgSrc;

        // تحديث الإطار الأسود حول الصورة المصغرة النشطة
        document.querySelectorAll(".thumb-btn").forEach((el, idx) => {
          el.classList.toggle("active", idx === index);
        });
      });

      thumbnailsContainer.appendChild(thumbBtn);
    });
  }

  // 4. رسم أزرار المقاسات (52 - 54 - 56 - 58) وتعطيل غير المتوفر
  function renderSizes() {
    sizeOptionsContainer.innerHTML = "";
    const available = state.selectedColor.availableSizes;

    STORE_CONFIG.allSizes.forEach((size) => {
      const isAvailable = available.includes(size);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `size-btn ${size === state.selectedSize && isAvailable ? "active" : ""}`;
      btn.textContent = size;
      btn.disabled = !isAvailable;

      if (isAvailable) {
        btn.addEventListener("click", () => {
          state.selectedSize = size;
          renderSizes();
          updateSummary();
        });
      }

      sizeOptionsContainer.appendChild(btn);
    });
  }

  // 5. تحديث ملخص الطلب السريع في أسفل الصفحة
  function updateSummary() {
    const subtotal = STORE_CONFIG.unitPrice * state.quantity;
    summarySelectionText.textContent = `${STORE_CONFIG.productName} (${state.selectedColor.name} - مقاس ${state.selectedSize}) × ${state.quantity}`;
    summarySubtotal.textContent = StoreUI.formatPrice(subtotal);
    summaryTotal.textContent = StoreUI.formatPrice(subtotal);
  }

  // 6. أحداث التحكم بالكمية
  decreaseQtyBtn.addEventListener("click", () => {
    if (state.quantity > 1) {
      state.quantity -= 1;
      quantityInput.value = state.quantity;
      updateSummary();
    }
  });

  increaseQtyBtn.addEventListener("click", () => {
    state.quantity += 1;
    quantityInput.value = state.quantity;
    updateSummary();
  });

  // 7. زر "اشتري الآن": تمرير سلس وإضاءة النموذج لمدة 1.5 ثانية
  buyNowBtn.addEventListener("click", () => {
    quickOrderSection.scrollIntoView({ behavior: "smooth", block: "center" });
    quickOrderSection.classList.add("highlight-pulse");
    customerNameInput.focus({ preventScroll: true });

    setTimeout(() => {
      quickOrderSection.classList.remove("highlight-pulse");
    }, 1500);
  });

  // 8. زر "أضف إلى السلة"
  addToCartBtn.addEventListener("click", () => {
    if (!state.selectedSize) {
      StoreUI.showToast("يرجى اختيار مقاس متوفر أولاً.", "error");
      return;
    }

    StoreStorage.addToCart({
      colorId: state.selectedColor.id,
      colorName: state.selectedColor.name,
      size: state.selectedSize,
      quantity: state.quantity,
      image: state.selectedColor.images[0]
    });

    StoreUI.showToast(`تم إضافة ${state.quantity} قطعة إلى السلة`);
  });

  // 9. منع إدخال حروف غير رقمية في حقلي الهاتف
  [customerPhoneInput, backupPhoneInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
    });
  });

  // 10. إرسال نموذج الطلب السريع
  quickOrderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const backupPhone = backupPhoneInput.value.trim();

    const isValid = StoreUI.validateOrderForm(
      { name, phone, backupPhone },
      { name: "nameError", phone: "phoneError", backupPhone: "backupPhoneError" }
    );

    if (!isValid) {
      StoreUI.showToast("يرجى التحقق من الحقول المطلوبة.", "error");
      return;
    }

    if (!state.selectedSize) {
      StoreUI.showToast("عذراً، لا يوجد مقاس متاح لهذا اللون حالياً.", "error");
      return;
    }

    // تعطيل الزر وتغيير نصه
    const originalBtnText = quickOrderSubmitBtn.textContent;
    quickOrderSubmitBtn.disabled = true;
    quickOrderSubmitBtn.textContent = "جاري إرسال الطلب... ⏳";

    const totalAmount = STORE_CONFIG.unitPrice * state.quantity;
    const orderData = {
      orderType: "طلب سريع",
      customer: { name, phone, backupPhone },
      items: [
        {
          colorId: state.selectedColor.id,
          colorName: state.selectedColor.name,
          size: state.selectedSize,
          quantity: state.quantity,
          unitPrice: STORE_CONFIG.unitPrice
        }
      ],
      totalAmount
    };

    try {
      await DiscordService.sendOrder(orderData);

      // عند النجاح: حفظ بيانات العميل والطلب محلياً وتفريغ السلة
      StoreStorage.saveCustomerInfo({ name, phone, backupPhone });
      StoreStorage.saveOrder(orderData);
      StoreStorage.clearCart();

      StoreUI.showToast("لقد تم استلام طلبك، سنتصل بك للتأكيد");

      // إعادة ضبط الكمية والعودة لأعلى الصفحة الرئيسية بعد لحظات
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1800);
    } catch (error) {
      console.error(error);
      StoreUI.showToast("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.", "error");
      quickOrderSubmitBtn.disabled = false;
      quickOrderSubmitBtn.textContent = originalBtnText;
    }
  });

  // التشغيل الأولي للصفحة
  prefillCustomerData();
  renderColors();
  renderGallery();
  renderSizes();
  updateSummary();
});