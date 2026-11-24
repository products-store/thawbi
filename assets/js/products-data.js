/**
 * بيانات ألوان القميص الصيفي، الصور الأربعة لكل لون، والمقاسات المتاحة
 * ملاحظة: لتعطيل مقاس معين لأي لون، يكفي حذفه من مصفوفة availableSizes الخاصة بذلك اللون
 */
const PRODUCT_VARIANTS = [
  {
    id: "white",
    name: "أبيض",
    hex: "#ffffff",
    images: [
      "assets/images/products/white-1.jpg",
      "assets/images/products/white-2.jpg",
      "assets/images/products/white-3.jpg",
      "assets/images/products/white-4.jpg"
    ],
    availableSizes: ["52", "54", "56", "58"]
  },
  {
    id: "black",
    name: "أسود",
    hex: "#1a1a1a",
    images: [
      "assets/images/products/black-1.jpg",
      "assets/images/products/black-2.jpg",
      "assets/images/products/black-3.jpg",
      "assets/images/products/black-4.jpg"
    ],
    availableSizes: ["52", "54", "56", "58"]
  },
  {
    id: "sky-blue",
    name: "أزرق سماوي",
    hex: "#38bdf8",
    images: [
      "assets/images/products/blue-1.jpg",
      "assets/images/products/blue-2.jpg",
      "assets/images/products/blue-3.jpg",
      "assets/images/products/blue-4.jpg"
    ],
    // مثال: مقاس 56 غير متوفر لهذا اللون ليظهر باهتاً ومعطلاً
    availableSizes: ["52", "54", "58"]
  },
  {
    id: "beige",
    name: "بيج",
    hex: "#d6c7b2",
    images: [
      "assets/images/products/beige-1.jpg",
      "assets/images/products/beige-2.jpg",
      "assets/images/products/beige-3.jpg",
      "assets/images/products/beige-4.jpg"
    ],
    availableSizes: ["54", "56", "58"]
  }
];