import React from 'react';
import { motion } from 'framer-motion';
import SpecialOffersBanner from '../shared/SpecialOffersBanner';
import SpecialOffersMenu from '../shared/SpecialOffersMenu';
// Import local images
import darkRitualImage from '../../assets/darksat.png';
import halloweenPackImage from '../../assets/halovinpack.png';
import spellPackImage from '../../assets/mahlolha.png';
import skullImage from '../../assets/skull.jpg';
import backgroundHero from '../../assets/Background-Hero.jpg';
import backgroundMain from '../../assets/BackGround-Main.jpg';
import backgroundProduct from '../../assets/BackGround-Product.jpg';
// Import products data
import { products } from '../../utils/mockData';

const SpecialOffersPage = () => {
  // Sample special offers data - this would typically come from an API
  const specialOffers = [
    {
      id: 'dark-ritual-pack',
      title: 'پک آیین تاریک',
      description: 'محصولات ویژه برای علاقه‌مندان به آیین‌های تاریک و اسرارآمیز',
      discount: '20%',
      image: darkRitualImage,
      category: 'پک‌های ویژه',
      items: [
        products.find(p => p.id === 4), // طومار باستانی
        products.find(p => p.id === 12), // کتاب نفرین‌ها
        products.find(p => p.id === 8) // ویجا بورد نفرین شده
      ]
    },
    {
      id: 'halloween-pack',
      title: 'پک هالووین',
      description: 'همه چیز برای جشن هالووین شما',
      discount: '15%',
      image: halloweenPackImage,
      category: 'پک‌های ویژه',
      items: [
        products.find(p => p.id === 10), // زیرسیگاری جمجمه
        products.find(p => p.id === 13), // چوب بیسبال خون‌آلود
        products.find(p => p.id === 15) // کامیک هارور
      ]
    },
    {
      id: 'spell-pack',
      title: 'پک طلسم‌ها',
      description: 'مجموعه کامل برای اجرای طلسم‌های قدرتمند',
      discount: '25%',
      image: spellPackImage,
      category: 'پک‌های ویژه',
      items: [
        products.find(p => p.id === 3), // معجون شفا
        products.find(p => p.id === 4), // طومار باستانی
        products.find(p => p.id === 5) // گردنبند مقدس
      ]
    },
    {
      id: 'gothic-pack',
      title: 'پک گاتیک',
      description: 'استایل گاتیک برای علاقه‌مندان به سبک تاریک',
      discount: '18%',
      image: skullImage,
      category: 'پک‌های ویژه',
      items: [
        products.find(p => p.id === 14), // وست چرمی
        products.find(p => p.id === 6), // دستبند محافظ
        products.find(p => p.id === 5) // گردنبند مقدس
      ]
    },
    {
      id: 'winter-sale',
      title: 'تخفیف زمستانی',
      description: 'تخفیف‌های ویژه فصل سرما',
      discount: '30%',
      image: backgroundHero,
      category: 'تخفیف‌های فصلی',
      items: [
        products.find(p => p.id === 2), // کلاه‌خود نوردیک
        products.find(p => p.id === 14), // وست چرمی
        products.find(p => p.id === 11) // ماگ استخوانی
      ]
    },
    {
      id: 'yalda-sale',
      title: 'حراج شب یلدا',
      description: 'تخفیف‌های ویژه شب یلدا',
      discount: '22%',
      image: backgroundMain,
      category: 'تخفیف‌های فصلی',
      items: [
        products.find(p => p.id === 7), // فندک اژدها
        products.find(p => p.id === 11), // ماگ استخوانی
        products.find(p => p.id === 15) // کامیک هارور
      ]
    },
    {
      id: 'halloween-sale',
      title: 'فروش ویژه هالووین',
      description: 'تخفیف‌های استثنایی به مناسبت هالووین',
      discount: '40%',
      image: halloweenPackImage,
      category: 'تخفیف‌های فصلی',
      items: [
        products.find(p => p.id === 8), // ویجا بورد نفرین شده
        products.find(p => p.id === 12), // کتاب نفرین‌ها
        products.find(p => p.id === 9) // پیک گیتار استخوانی
      ]
    },
    {
      id: 'exclusive-collection',
      title: 'کالکشن مخصوص',
      description: 'محصولات انحصاری با تعداد محدود',
      discount: '10%',
      image: backgroundProduct,
      category: 'محصولات محدود',
      items: [
        products.find(p => p.id === 1), // شمشیر DRAUGR
        products.find(p => p.id === 2), // کلاه‌خود نوردیک
        products.find(p => p.id === 12) // کتاب نفرین‌ها
      ]
    },
    {
      id: 'rare-items',
      title: 'آیتم‌های کمیاب',
      description: 'محصولات نایاب که به سختی پیدا می‌شوند',
      discount: '5%',
      image: darkRitualImage,
      category: 'محصولات محدود',
      items: [
        products.find(p => p.id === 4), // طومار باستانی
        products.find(p => p.id === 8), // ویجا بورد نفرین شده
        products.find(p => p.id === 12) // کتاب نفرین‌ها
      ]
    },
    {
      id: 'draugr-exclusive',
      title: 'انحصاری دراوگر',
      description: 'محصولاتی که فقط در فروشگاه ما پیدا می‌شوند',
      discount: '15%',
      image: spellPackImage,
      category: 'محصولات محدود',
      items: [
        products.find(p => p.id === 1), // شمشیر DRAUGR
        products.find(p => p.id === 3), // معجون شفا
        products.find(p => p.id === 5) // گردنبند مقدس
      ]
    }
  ];

  return (
    <div className="bg-midnight py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl blood-text mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            پیشنهادات ویژه دراوگر
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            تخفیف‌های استثنایی و پیشنهادات ویژه فروشگاه ما را از دست ندهید. محصولات محدود و کمیاب با قیمت‌های باورنکردنی فقط برای شما
          </motion.p>
        </div>

        {/* Special Offers Banner */}
        <SpecialOffersBanner offers={specialOffers.slice(0, 3)} />

        {/* Special Offers Menu with Detail View */}
        <SpecialOffersMenu offers={specialOffers} />

      </div>
    </div>
  );
};

export default SpecialOffersPage;
