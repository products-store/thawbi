/**
 * إرسال الطلبات والرسائل إلى Discord Webhook
 */
const DiscordService = {
  async sendOrder(orderData) {
    const webhookUrl = STORE_CONFIG.discordWebhookUrl;

    if (!webhookUrl || webhookUrl.includes("YOUR_WEBHOOK_ID")) {
      throw new Error("لم يتم ضبط رابط Discord Webhook في ملف config.js");
    }

    // تنسيق قائمة المنتجات كنص مقروء
    const itemsText = orderData.items
      .map(
        (item, idx) =>
          `**${idx + 1}.** ${STORE_CONFIG.productName} | اللون: **${item.colorName}** | المقاس: **${item.size}** | الكمية: **${item.quantity}** (${item.unitPrice * item.quantity} ${STORE_CONFIG.currency})`
      )
      .join("\n");

    const payload = {
      username: `متجر ${STORE_CONFIG.storeName} - طلبات جديدة`,
      embeds: [
        {
          title: `🛍️ طلب جديد (${orderData.orderType})`,
          color: 1483594, // أخضر #16a34a
          fields: [
            {
              name: "👤 اسم العميل",
              value: orderData.customer.name,
              inline: true
            },
            {
              name: "📞 رقم الهاتف",
              value: orderData.customer.phone,
              inline: true
            },
            {
              name: "📱 هاتف احتياطي",
              value: orderData.customer.backupPhone || "لا يوجد",
              inline: true
            },
            {
              name: "📦 تفاصيل الطلب",
              value: itemsText,
              inline: false
            },
            {
              name: "🤝 طريقة التسليم",
              value: "تسليم يدا بيد — 0 د.ج",
              inline: true
            },
            {
              name: "💰 الإجمالي الكلي",
              value: `**${orderData.totalAmount} ${STORE_CONFIG.currency}**`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`فشل الإرسال إلى Discord (${response.status})`);
    }

    return true;
  },

  async sendContactMessage({ name, contact, message }) {
    const webhookUrl = STORE_CONFIG.discordWebhookUrl;

    if (!webhookUrl || webhookUrl.includes("YOUR_WEBHOOK_ID")) {
      throw new Error("لم يتم ضبط رابط Discord Webhook في ملف config.js");
    }

    const payload = {
      username: `متجر ${STORE_CONFIG.storeName} - رسائل الزوار`,
      embeds: [
        {
          title: "✉️ رسالة جديدة من صفحة تواصل معنا",
          color: 1118481,
          fields: [
            { name: "الاسم", value: name, inline: true },
            { name: "الهاتف / البريد", value: contact, inline: true },
            { name: "الرسالة", value: message, inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("فشل إرسال الرسالة.");
    }

    return true;
  }
};