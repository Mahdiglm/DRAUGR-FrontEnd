import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';

// Step components
const ShippingForm = ({ formData, updateFormData, goToNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-black/30 p-6 rounded-lg shadow-horror"
    >
      <h2 className="text-2xl font-bold mb-6 text-draugr-400">اطلاعات ارسال</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="firstName">نام</label>
            <input 
              type="text" 
              id="firstName" 
              value={formData.firstName} 
              onChange={(e) => updateFormData('firstName', e.target.value)}
              className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">نام خانوادگی</label>
            <input 
              type="text" 
              id="lastName" 
              value={formData.lastName} 
              onChange={(e) => updateFormData('lastName', e.target.value)}
              className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">شماره تماس</label>
          <input 
            type="tel" 
            id="phone" 
            value={formData.phone} 
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">ایمیل</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email} 
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="address">آدرس</label>
          <textarea 
            id="address" 
            rows="3" 
            value={formData.address} 
            onChange={(e) => updateFormData('address', e.target.value)}
            className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="postalCode">کد پستی</label>
          <input 
            type="text" 
            id="postalCode" 
            value={formData.postalCode} 
            onChange={(e) => updateFormData('postalCode', e.target.value)}
            className="w-full p-3 rounded bg-midnight border border-gray-700 text-white" 
            required 
          />
        </div>
        
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToNext}
            className="w-full py-3 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded-md font-medium"
            disabled={!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.postalCode}
          >
            ادامه به پرداخت
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentForm = ({ formData, updateFormData, goToNext, goToPrevious }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-black/30 p-6 rounded-lg shadow-horror"
    >
      <h2 className="text-2xl font-bold mb-6 text-draugr-400">روش پرداخت</h2>
      
      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <input 
              type="radio" 
              id="online" 
              name="paymentMethod" 
              value="online" 
              checked={formData.paymentMethod === 'online'} 
              onChange={() => updateFormData('paymentMethod', 'online')}
              className="w-5 h-5 accent-draugr-600" 
            />
            <label htmlFor="online" className="font-medium">پرداخت آنلاین</label>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input 
              type="radio" 
              id="cod" 
              name="paymentMethod" 
              value="cod" 
              checked={formData.paymentMethod === 'cod'} 
              onChange={() => updateFormData('paymentMethod', 'cod')}
              className="w-5 h-5 accent-draugr-600" 
            />
            <label htmlFor="cod" className="font-medium">پرداخت در محل</label>
          </div>
        </div>
        
        {formData.paymentMethod === 'online' && (
          <div className="p-4 bg-vampire-dark rounded-lg">
            <h3 className="text-lg font-medium mb-4">انتخاب درگاه پرداخت</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-3 border rounded-lg flex items-center justify-center cursor-pointer ${formData.gateway === 'shaparak' ? 'border-draugr-500 bg-draugr-900/30' : 'border-gray-700'}`}
                onClick={() => updateFormData('gateway', 'shaparak')}
              >
                <span>شاپرک</span>
              </div>
              
              <div 
                className={`p-3 border rounded-lg flex items-center justify-center cursor-pointer ${formData.gateway === 'zarinpal' ? 'border-draugr-500 bg-draugr-900/30' : 'border-gray-700'}`}
                onClick={() => updateFormData('gateway', 'zarinpal')}
              >
                <span>زرین‌پال</span>
              </div>
              
              <div 
                className={`p-3 border rounded-lg flex items-center justify-center cursor-pointer ${formData.gateway === 'sadad' ? 'border-draugr-500 bg-draugr-900/30' : 'border-gray-700'}`}
                onClick={() => updateFormData('gateway', 'sadad')}
              >
                <span>سداد</span>
              </div>
              
              <div 
                className={`p-3 border rounded-lg flex items-center justify-center cursor-pointer ${formData.gateway === 'sep' ? 'border-draugr-500 bg-draugr-900/30' : 'border-gray-700'}`}
                onClick={() => updateFormData('gateway', 'sep')}
              >
                <span>سپ</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center pt-6 space-x-4 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToPrevious}
            className="w-1/2 py-3 bg-gray-800 text-white rounded-md font-medium"
          >
            بازگشت
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToNext}
            className="w-1/2 py-3 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded-md font-medium"
            disabled={!formData.paymentMethod || (formData.paymentMethod === 'online' && !formData.gateway)}
          >
            مرور سفارش
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ReviewOrder = ({ formData, cartItems, totalPrice, goToPrevious, placeOrder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-black/30 p-6 rounded-lg shadow-horror"
    >
      <h2 className="text-2xl font-bold mb-6 text-draugr-400">مرور سفارش</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">اطلاعات شخصی</h3>
          <div className="bg-midnight p-4 rounded-lg">
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.phone}</p>
            <p>{formData.email}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">آدرس تحویل</h3>
          <div className="bg-midnight p-4 rounded-lg">
            <p>{formData.address}</p>
            <p>کد پستی: {formData.postalCode}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">روش پرداخت</h3>
          <div className="bg-midnight p-4 rounded-lg">
            <p>{formData.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'پرداخت در محل'}</p>
            {formData.paymentMethod === 'online' && (
              <p>درگاه: {formData.gateway === 'shaparak' ? 'شاپرک' : formData.gateway === 'zarinpal' ? 'زرین‌پال' : formData.gateway === 'sadad' ? 'سداد' : 'سپ'}</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">سفارش شما</h3>
          <div className="bg-midnight p-4 rounded-lg space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded overflow-hidden mr-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.quantity} × {item.price.toLocaleString('fa-IR')} تومان</p>
                  </div>
                </div>
                <p className="font-bold">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</p>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-2">
              <p className="font-bold">مجموع</p>
              <p className="font-bold text-draugr-500">{totalPrice.toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center pt-4 space-x-4 rtl:space-x-reverse">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToPrevious}
            className="w-1/2 py-3 bg-gray-800 text-white rounded-md font-medium"
          >
            بازگشت
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={placeOrder}
            className="w-1/2 py-3 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded-md font-medium"
          >
            ثبت سفارش
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const OrderConfirmation = ({ orderNumber, navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/30 p-6 rounded-lg shadow-horror text-center"
    >
      <div className="w-20 h-20 bg-draugr-900/50 rounded-full mx-auto flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-draugr-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 text-draugr-400">سفارش شما با موفقیت ثبت شد</h2>
      <p className="mb-6">شماره سفارش: <span className="font-bold">{orderNumber}</span></p>
      
      <div className="max-w-md mx-auto bg-midnight p-4 rounded-lg mb-6">
        <p className="mb-2">از خرید شما متشکریم!</p>
        <p className="text-sm text-gray-400">اطلاعات سفارش به ایمیل شما ارسال خواهد شد.</p>
      </div>
      
      <div className="flex space-x-4 rtl:space-x-reverse justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-5 py-2 bg-gray-800 text-white rounded-md"
        >
          بازگشت به خانه
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
          className="px-5 py-2 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white rounded-md"
        >
          پیگیری سفارش
        </motion.button>
      </div>
    </motion.div>
  );
};

// Checkout progress indicator
const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { num: 1, title: 'اطلاعات ارسال' },
    { num: 2, title: 'پرداخت' },
    { num: 3, title: 'مرور سفارش' },
    { num: 4, title: 'تایید' }
  ];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;
          
          return (
            <div key={step.num} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  isCompleted 
                    ? 'bg-draugr-600' 
                    : isActive 
                    ? 'bg-draugr-800 ring-2 ring-draugr-500 ring-opacity-50'
                    : 'bg-gray-700'
                }`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <div className={`mt-2 text-sm whitespace-nowrap ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </div>
            </div>
          );
        })}
        
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 z-0">
          <div 
            className="h-full bg-draugr-600" 
            style={{ 
              width: `${(currentStep - 1) / (steps.length - 1) * 100}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Checkout Side Summary
const CheckoutSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
  
  const shipping = subtotal > 1000000 ? 0 : 50000;
  const total = subtotal + shipping;
  
  return (
    <div className="bg-black/30 p-6 rounded-lg shadow-horror h-fit">
      <h3 className="text-xl font-bold mb-4 text-draugr-400">خلاصه سفارش</h3>
      
      <div className="space-y-4">
        <div className="max-h-60 overflow-y-auto custom-scrollbar">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-800">
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-400">{item.quantity || 1} عدد</span>
                  <span className="font-bold">{((item.price) * (item.quantity || 1)).toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 space-y-2">
          <div className="flex justify-between">
            <span>جمع جزء</span>
            <span>{subtotal.toLocaleString('fa-IR')} تومان</span>
          </div>
          
          <div className="flex justify-between">
            <span>هزینه ارسال</span>
            <span>
              {shipping === 0 
                ? <span className="text-green-500">رایگان</span> 
                : `${shipping.toLocaleString('fa-IR')} تومان`
              }
            </span>
          </div>
          
          <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-bold">
            <span>مجموع</span>
            <span className="text-draugr-500">{total.toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useOutletContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
    paymentMethod: 'online',
    gateway: 'shaparak'
  });
  const [orderNumber, setOrderNumber] = useState('');
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
  
  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Navigation functions
  const goToNext = () => setCurrentStep(prev => prev + 1);
  const goToPrevious = () => setCurrentStep(prev => prev - 1);
  
  // Handle order placement
  const placeOrder = () => {
    // In a real app, we would send the order to a backend
    // For now, we'll just generate a random order number
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    setOrderNumber(randomOrderNumber);
    setCurrentStep(4); // Move to confirmation step
  };
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && currentStep !== 4) {
      navigate('/shop');
    }
  }, [cartItems, navigate, currentStep]);
  
  return (
    <div 
      className="min-h-screen py-12 relative"
      style={{
        background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)'
      }}
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-5"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px',
            backdropFilter: 'blur(100px)'
          }}
        />
        
        {/* Subtle fog effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 2000 2000\' fill=\'none\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundSize: '200% 200%'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <Link to="/shop" className="inline-flex items-center text-draugr-500 hover:text-draugr-400 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          بازگشت به فروشگاه
        </Link>
      
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-shadow-horror">تکمیل سفارش</h1>
        
        {currentStep < 4 && (
          <div className="mx-auto max-w-4xl mb-8">
            <CheckoutProgress currentStep={currentStep} />
          </div>
        )}
        
        <div className="mx-auto max-w-6xl">
          {currentStep < 4 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <ShippingForm 
                      key="shipping"
                      formData={formData} 
                      updateFormData={updateFormData} 
                      goToNext={goToNext} 
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <PaymentForm 
                      key="payment"
                      formData={formData} 
                      updateFormData={updateFormData} 
                      goToNext={goToNext} 
                      goToPrevious={goToPrevious} 
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <ReviewOrder 
                      key="review"
                      formData={formData} 
                      cartItems={cartItems} 
                      totalPrice={totalPrice}
                      goToPrevious={goToPrevious} 
                      placeOrder={placeOrder} 
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <div>
                <CheckoutSummary cartItems={cartItems} />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <OrderConfirmation orderNumber={orderNumber} navigate={navigate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 