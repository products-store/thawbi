/**
 * إدارة التخزين المحلي (localStorage) للسلة وبيانات العميل وسجل الطلبات
 */
const StoreStorage = {
  // --- 1. إدارة السلة (mCart) ---
  getCart() {
    try {
      const data = localStorage.getItem(STORE_CONFIG.storageKeys.cart);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("خطأ في قراءة السلة:", e);
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(STORE_CONFIG.storageKeys.cart, JSON.stringify(cart));
    if (typeof StoreUI !== "undefined") {
      StoreUI.updateCartBadge();
    }
  },

  addToCart(item) {
    const cart = this.getCart();
    // البحث عن عنصر مطابق في اللون والمقاس
    const existingIndex = cart.findIndex(
      (entry) => entry.colorId === item.colorId && entry.size === item.size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push({
        colorId: item.colorId,
        colorName: item.colorName,
        size: item.size,
        quantity: item.quantity,
        unitPrice: STORE_CONFIG.unitPrice,
        image: item.image
      });
    }

    this.saveCart(cart);
    return cart;
  },

  updateItemQuantity(index, newQty) {
    const cart = this.getCart();
    if (!cart[index]) return;

    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = newQty;
    }
    this.saveCart(cart);
  },

  removeItem(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  },

  clearCart() {
    localStorage.removeItem(STORE_CONFIG.storageKeys.cart);
    if (typeof StoreUI !== "undefined") {
      StoreUI.updateCartBadge();
    }
  },

  getTotalItemsCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartSubtotal() {
    return this.getCart().reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  },

  // --- 2. بيانات العميل الأخيرة (mCustomer) ---
  getCustomerInfo() {
    try {
      const data = localStorage.getItem(STORE_CONFIG.storageKeys.customer);
      return data ? JSON.parse(data) : { name: "", phone: "", backupPhone: "" };
    } catch (e) {
      return { name: "", phone: "", backupPhone: "" };
    }
  },

  saveCustomerInfo(info) {
    localStorage.setItem(
      STORE_CONFIG.storageKeys.customer,
      JSON.stringify({
        name: info.name || "",
        phone: info.phone || "",
        backupPhone: info.backupPhone || ""
      })
    );
  },

  // --- 3. سجل الطلبات المؤكدة محلياً (mOrders) ---
  getOrders() {
    try {
      const data = localStorage.getItem(STORE_CONFIG.storageKeys.orders);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveOrder(orderData) {
    const orders = this.getOrders();
    orders.unshift({
      ...orderData,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORE_CONFIG.storageKeys.orders, JSON.stringify(orders));
  }
};