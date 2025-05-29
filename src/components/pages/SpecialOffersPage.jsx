import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpecialOffersBanner from '../shared/SpecialOffersBanner';
import SpecialOffersMenu from '../shared/SpecialOffersMenu';
import productService from '../../services/productService';
// Import local images
import darkRitualImage from '../../assets/darksat.png';
import halloweenPackImage from '../../assets/halovinpack.png';
import spellPackImage from '../../assets/mahlolha.png';
import skullImage from '../../assets/skull.jpg';
import backgroundHero from '../../assets/Background-Hero.jpg';
import backgroundMain from '../../assets/BackGround-Main.jpg';
import backgroundProduct from '../../assets/BackGround-Product.jpg';

const SpecialOffersPage = () => {
  const [products, setProducts] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await productService.getProducts();
        setProducts(productsData);
        
        // Create special offers once we have products
        createSpecialOffers(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('خطا در دریافت محصولات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Create special offers based on available products
  const createSpecialOffers = (productsData) => {
    // Make sure we have products
    if (!productsData || productsData.length === 0) {
      return;
    }

    // Helper function to safely find products by index
    const findProductByIndex = (index) => {
      const safeIndex = index % productsData.length;
      return productsData[safeIndex];
    };

    // Create special offers
    const offers = [
      {
        id: 'dark-ritual-pack',
        title: 'پک آیین تاریک',
        description: 'محصولات ویژه برای علاقه‌مندان به آیین‌های تاریک و اسرارآمیز',
        discount: '20%',
        image: darkRitualImage,
        category: 'پک‌های ویژه',
        items: [
          findProductByIndex(3),
          findProductByIndex(11),
          findProductByIndex(7)
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
          findProductByIndex(9),
          findProductByIndex(12),
          findProductByIndex(14)
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
          findProductByIndex(2),
          findProductByIndex(3),
          findProductByIndex(4)
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
          findProductByIndex(13),
          findProductByIndex(5),
          findProductByIndex(4)
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
          findProductByIndex(1),
          findProductByIndex(13),
          findProductByIndex(10)
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
          findProductByIndex(6),
          findProductByIndex(10),
          findProductByIndex(14)
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
          findProductByIndex(7),
          findProductByIndex(11),
          findProductByIndex(8)
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
          findProductByIndex(0),
          findProductByIndex(1),
          findProductByIndex(11)
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
          findProductByIndex(3),
          findProductByIndex(7),
          findProductByIndex(11)
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
          findProductByIndex(0),
          findProductByIndex(2),
          findProductByIndex(4)
        ]
      }
    ];

    setSpecialOffers(offers);
  };

  if (isLoading) {
    return (
      <div className="bg-midnight py-8 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-r-2 border-draugr-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-midnight py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-draugr-500">{error}</h2>
          <p className="text-gray-400">لطفا بعدا دوباره امتحان کنید</p>
        </div>
      </div>
    );
  }

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
