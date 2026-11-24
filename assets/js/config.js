/**
 * الإعدادات العامة لمتجر ثوبي
 */
const STORE_CONFIG = {
  storeName: "Thawbi",
  storeNameAr: "ثوبي",
  storeNameFull: "ثوبي | Thawbi",
  productName: "قميص الأدهم",
  unitPrice: 3700,
  currency: "د.ج",
  
  // جميع المقاسات المعتمدة في المتجر
  allSizes: ["52", "54", "56", "58"],

  // ضع رابط Discord Webhook الخاص بقناة الطلبات هنا بين علامتي التنصيص
discordWebhookUrl: "https://discord.com/api/webhooks/1574836615229218959/1A3NvNOCPvL29Ei1axMo6naeW9Uj-w1giJSCA5w3rwAq8-PZt7YcAu9UVLDqIgz446YK",
  // مفاتيح التخزين المحلي في المتصفح (localStorage)
  storageKeys: {
    cart: "mCart",
    customer: "mCustomer",
    orders: "mOrders"
  }
};
