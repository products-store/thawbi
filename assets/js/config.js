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
  discordWebhookUrl: "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",

  // مفاتيح التخزين المحلي في المتصفح (localStorage)
  storageKeys: {
    cart: "mCart",
    customer: "mCustomer",
    orders: "mOrders"
  }
};