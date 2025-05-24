import React from 'react';
import { motion } from 'framer-motion';
import SpecialOffersBanner from '../shared/SpecialOffersBanner';
import SpecialOffersMenu from '../shared/SpecialOffersMenu';

const SpecialOffersPage = () => {
  // Sample special offers data - this would typically come from an API
  const specialOffers = [
    {
      id: 'satanic-pack',
      title: 'پک شیطان‌پرستی',
      description: 'محصولات ویژه برای علاقه‌مندان به آیین شیطان‌پرستی',
      discount: '20%',
      image: 'https://via.placeholder.com/400x300?text=Satanic+Pack',
      category: 'پک‌های ویژه',
      items: [
        { id: 1, name: 'کتاب انجیل شیطانی', price: 850000, image: 'https://via.placeholder.com/150?text=Satanic+Bible' },
        { id: 2, name: 'گردنبند بافومت', price: 450000, image: 'https://via.placeholder.com/150?text=Baphomet+Necklace' },
        { id: 3, name: 'شمع مشکی آیینی', price: 120000, image: 'https://via.placeholder.com/150?text=Ritual+Candle' }
      ]
    },
    {
      id: 'halloween-pack',
      title: 'پک هالووین',
      description: 'همه چیز برای جشن هالووین شما',
      discount: '15%',
      image: 'https://via.placeholder.com/400x300?text=Halloween+Pack',
      category: 'پک‌های ویژه',
      items: [
        { id: 4, name: 'ماسک جک-او-لنترن', price: 350000, image: 'https://via.placeholder.com/150?text=Jack+O+Lantern' },
        { id: 5, name: 'لباس اسکلتی', price: 750000, image: 'https://via.placeholder.com/150?text=Skeleton+Costume' },
        { id: 6, name: 'دکوراسیون خفاش', price: 180000, image: 'https://via.placeholder.com/150?text=Bat+Decoration' }
      ]
    },
    {
      id: 'spell-pack',
      title: 'پک طلسم‌ها',
      description: 'مجموعه کامل برای اجرای طلسم‌های قدرتمند',
      discount: '25%',
      image: 'https://via.placeholder.com/400x300?text=Spell+Pack',
      category: 'پک‌های ویژه',
      items: [
        { id: 7, name: 'کتاب طلسم‌ها', price: 550000, image: 'https://via.placeholder.com/150?text=Spell+Book' },
        { id: 8, name: 'کریستال‌های جادویی', price: 380000, image: 'https://via.placeholder.com/150?text=Magic+Crystals' },
        { id: 9, name: 'گیاهان خشک آیینی', price: 220000, image: 'https://via.placeholder.com/150?text=Ritual+Herbs' }
      ]
    },
    {
      id: 'gothic-pack',
      title: 'پک گاتیک',
      description: 'استایل گاتیک برای علاقه‌مندان به سبک تاریک',
      discount: '18%',
      image: 'https://via.placeholder.com/400x300?text=Gothic+Pack',
      category: 'پک‌های ویژه',
      items: [
        { id: 10, name: 'لباس گاتیک', price: 950000, image: 'https://via.placeholder.com/150?text=Gothic+Outfit' },
        { id: 11, name: 'زیورآلات نقره‌ای', price: 480000, image: 'https://via.placeholder.com/150?text=Silver+Jewelry' },
        { id: 12, name: 'کفش پلتفرم', price: 850000, image: 'https://via.placeholder.com/150?text=Platform+Boots' }
      ]
    },
    {
      id: 'winter-sale',
      title: 'تخفیف زمستانی',
      description: 'تخفیف‌های ویژه فصل سرما',
      discount: '30%',
      image: 'https://via.placeholder.com/400x300?text=Winter+Sale',
      category: 'تخفیف‌های فصلی',
      items: [
        { id: 13, name: 'کت چرم گاتیک', price: 1250000, image: 'https://via.placeholder.com/150?text=Leather+Coat' },
        { id: 14, name: 'پالتو بلند مشکی', price: 1850000, image: 'https://via.placeholder.com/150?text=Long+Black+Coat' },
        { id: 15, name: 'دستکش چرم', price: 350000, image: 'https://via.placeholder.com/150?text=Leather+Gloves' }
      ]
    },
    {
      id: 'yalda-sale',
      title: 'حراج شب یلدا',
      description: 'تخفیف‌های ویژه شب یلدا',
      discount: '22%',
      image: 'https://via.placeholder.com/400x300?text=Yalda+Sale',
      category: 'تخفیف‌های فصلی',
      items: [
        { id: 16, name: 'شمع‌های قرمز', price: 220000, image: 'https://via.placeholder.com/150?text=Red+Candles' },
        { id: 17, name: 'کتاب حافظ', price: 450000, image: 'https://via.placeholder.com/150?text=Hafez+Book' },
        { id: 18, name: 'ماگ سرامیکی', price: 280000, image: 'https://via.placeholder.com/150?text=Ceramic+Mug' }
      ]
    },
    {
      id: 'halloween-sale',
      title: 'فروش ویژه هالووین',
      description: 'تخفیف‌های استثنایی به مناسبت هالووین',
      discount: '40%',
      image: 'https://via.placeholder.com/400x300?text=Halloween+Sale',
      category: 'تخفیف‌های فصلی',
      items: [
        { id: 19, name: 'دکوراسیون هالووین', price: 480000, image: 'https://via.placeholder.com/150?text=Halloween+Decor' },
        { id: 20, name: 'لباس جادوگر', price: 680000, image: 'https://via.placeholder.com/150?text=Witch+Costume' },
        { id: 21, name: 'لوازم گریم', price: 320000, image: 'https://via.placeholder.com/150?text=Makeup+Kit' }
      ]
    },
    {
      id: 'exclusive-collection',
      title: 'کالکشن مخصوص',
      description: 'محصولات انحصاری با تعداد محدود',
      discount: '10%',
      image: 'https://via.placeholder.com/400x300?text=Exclusive+Collection',
      category: 'محصولات محدود',
      items: [
        { id: 22, name: 'تیشرت محدود دراوگر', price: 580000, image: 'https://via.placeholder.com/150?text=Limited+Tshirt' },
        { id: 23, name: 'پوستر امضا شده', price: 780000, image: 'https://via.placeholder.com/150?text=Signed+Poster' },
        { id: 24, name: 'مجسمه کلکسیونی', price: 1280000, image: 'https://via.placeholder.com/150?text=Collectible+Statue' }
      ]
    },
    {
      id: 'rare-items',
      title: 'آیتم‌های کمیاب',
      description: 'محصولات نایاب که به سختی پیدا می‌شوند',
      discount: '5%',
      image: 'https://via.placeholder.com/400x300?text=Rare+Items',
      category: 'محصولات محدود',
      items: [
        { id: 25, name: 'کتاب باستانی', price: 1850000, image: 'https://via.placeholder.com/150?text=Ancient+Book' },
        { id: 26, name: 'سنگ‌های کمیاب', price: 920000, image: 'https://via.placeholder.com/150?text=Rare+Stones' },
        { id: 27, name: 'نسخه خطی قدیمی', price: 2500000, image: 'https://via.placeholder.com/150?text=Old+Manuscript' }
      ]
    },
    {
      id: 'draugr-exclusive',
      title: 'انحصاری دراوگر',
      description: 'محصولاتی که فقط در فروشگاه ما پیدا می‌شوند',
      discount: '15%',
      image: 'https://via.placeholder.com/400x300?text=Draugr+Exclusive',
      category: 'محصولات محدود',
      items: [
        { id: 28, name: 'لوگوی طلایی دراوگر', price: 1250000, image: 'https://via.placeholder.com/150?text=Golden+Logo' },
        { id: 29, name: 'جعبه هدیه مخصوص', price: 780000, image: 'https://via.placeholder.com/150?text=Special+Gift+Box' },
        { id: 30, name: 'کارت عضویت VIP', price: 3500000, image: 'https://via.placeholder.com/150?text=VIP+Membership' }
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