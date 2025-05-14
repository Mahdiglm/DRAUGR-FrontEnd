// Import product images
import product1 from '../assets/Product_1.jpg';
import product2 from '../assets/Product_2.jpg';
import product3 from '../assets/Product_3.jpg';
import product4 from '../assets/Product_4.jpg';

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
  }
];

export const categories = [
  { id: 1, name: "سلاح‌ها", slug: "weapons" },
  { id: 2, name: "زره‌ها", slug: "armor" },
  { id: 3, name: "معجون‌ها", slug: "potions" },
  { id: 4, name: "اقلام جادویی", slug: "magic" }
]; 