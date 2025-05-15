// Import product images
import product1 from '../assets/Product_1.jpg';
import product2 from '../assets/Product_2.jpg';
import product3 from '../assets/Product_3.jpg';
import product4 from '../assets/Product_4.jpg';
import product5 from '../assets/Product_5.jpg';
import product6 from '../assets/Product_6.jpg';
import product7 from '../assets/Product_7.jpg';
import product8 from '../assets/Product_8.jpg';
import product9 from '../assets/Product_9.jpg';
import product10 from '../assets/Product_10.jpg';
import product11 from '../assets/Product_11.jpg';
import product12 from '../assets/Product_12.jpg';
import product13 from '../assets/Product_13.jpg';
import product14 from '../assets/Product_14.jpg';
import product15 from '../assets/Product_15.jpg';

export const products = [
  {
    id: 1,
    name: "شمشیر DRAUGR",
    description: "یک شمشیر باستانی نوردیک آغشته به جادوی یخ، گرفته شده از اعماق یک گور اسکایریم.",
    price: 199.99,
    imageUrl: product1,
    category: "weapons"
  },
  {
    id: 2,
    name: "کلاه‌خود نوردیک",
    description: "بازسازی اصیل از طراحی کلاه‌خود باستانی نوردیک، با شاخ‌های محافظ و حکاکی‌های رونی.",
    price: 149.99,
    imageUrl: product2,
    category: "armor"
  },
  {
    id: 3,
    name: "معجون شفا",
    description: "به سرعت نقاط سلامتی را بازیابی می‌کند. ساخته شده با گل‌های کوهستانی و سایر مواد مخفی.",
    price: 29.99,
    imageUrl: product3,
    category: "potions"
  },
  {
    id: 4,
    name: "طومار باستانی",
    description: "طوماری اسرارآمیز با رون‌های قدرتمند که دانش فراموش شده را آشکار می‌کند.",
    price: 89.99,
    imageUrl: product4,
    category: "magic"
  },
  {
    id: 5,
    name: "گردنبند مقدس",
    description: "گردنبندی با قدرت محافظت در برابر ارواح خبیث، ساخته شده از نقره و سنگ‌های قیمتی.",
    price: 79.99,
    imageUrl: product5,
    category: "accessories"
  },
  {
    id: 6,
    name: "دستبند محافظ",
    description: "دستبندی با نقوش باستانی که نیروی دفاعی خود را به دارنده منتقل می‌کند.",
    price: 59.99,
    imageUrl: product6,
    category: "accessories"
  },
  {
    id: 7,
    name: "فندک اژدها",
    description: "فندکی به شکل سر اژدها که شعله‌های آن هرگز خاموش نمی‌شود.",
    price: 39.99,
    imageUrl: product7,
    category: "accessories"
  },
  {
    id: 8,
    name: "ویجا بورد نفرین شده",
    description: "تخته ویجا باستانی برای ارتباط با ارواح، استفاده با احتیاط توصیه می‌شود.",
    price: 129.99,
    imageUrl: product8,
    category: "accessories"
  },
  {
    id: 9,
    name: "پیک گیتار استخوانی",
    description: "پیک گیتاری ساخته شده از استخوان‌های باستانی، برای صدایی عمیق و تاریک.",
    price: 19.99,
    imageUrl: product9,
    category: "accessories"
  },
  {
    id: 10,
    name: "زیرسیگاری جمجمه",
    description: "زیرسیگاری به شکل جمجمه انسان، دست‌ساز با جزئیات دقیق.",
    price: 49.99,
    imageUrl: product10,
    category: "accessories"
  },
  {
    id: 11,
    name: "ماگ استخوانی",
    description: "ماگی با طراحی استخوانی برای نوشیدنی‌های گرم، ساخته شده از سرامیک با کیفیت.",
    price: 34.99,
    imageUrl: product11,
    category: "accessories"
  },
  {
    id: 12,
    name: "کتاب نفرین‌ها",
    description: "کتاب کمیاب و قدیمی حاوی نفرین‌های باستانی، با صفحات چرمی دست‌ساز.",
    price: 159.99,
    imageUrl: product12,
    category: "rare_books"
  },
  {
    id: 13,
    name: "چوب بیسبال خون‌آلود",
    description: "چوب بیسبال قدیمی با لکه‌های قرمز و داستانی مرموز پشت آن.",
    price: 89.99,
    imageUrl: product13,
    category: "accessories"
  },
  {
    id: 14,
    name: "وست چرمی",
    description: "وست چرمی سیاه با طرح‌های فلزی و گوتیک، مناسب برای طرفداران سبک تاریک.",
    price: 199.99,
    imageUrl: product14,
    category: "accessories"
  },
  {
    id: 15,
    name: "کامیک هارور",
    description: "کامیک کمیاب با داستان‌های ترسناک و تصاویر منحصربه‌فرد، چاپ محدود.",
    price: 69.99,
    imageUrl: product15,
    category: "accessories"
  }
];

export const categories = [
  { id: 1, name: "سلاح‌ها", slug: "weapons" },
  { id: 2, name: "زره‌ها", slug: "armor" },
  { id: 3, name: "معجون‌ها", slug: "potions" },
  { id: 4, name: "اقلام جادویی", slug: "magic" },
  { id: 5, name: "اکسسوری", slug: "accessories" },
  { id: 6, name: "کتاب‌های نایاب", slug: "rare_books" }
]; 