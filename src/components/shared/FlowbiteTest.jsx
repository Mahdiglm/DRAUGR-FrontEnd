import React, { useEffect } from 'react';
import { initFlowbite } from 'flowbite';

const FlowbiteTest = () => {
  useEffect(() => {
    // Initialize Flowbite when component mounts
    initFlowbite();
  }, []);

  return (
    <div className="p-6 bg-draugr-charcoal rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-horror text-blood mb-6">تست کامپوننت‌های Flowbite</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alert Component */}
        <div className="col-span-full">
          <h3 className="text-xl mb-3 text-draugr-accent-red">هشدارها</h3>
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">هشدار!</span> این یک هشدار خطر از Flowbite است.
          </div>
        </div>

        {/* Badge Component */}
        <div>
          <h3 className="text-xl mb-3 text-draugr-accent-red">نشان‌ها</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">پیش‌فرض</span>
            <span className="bg-dark-red-100 text-dark-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-dark-red-900 dark:text-dark-red-300">قرمز</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">سبز</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">زرد</span>
          </div>
        </div>

        {/* Button Component */}
        <div>
          <h3 className="text-xl mb-3 text-draugr-accent-red">دکمه‌ها</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">پیش‌فرض</button>
            <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">متناوب</button>
            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">قرمز</button>
            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">سبز</button>
          </div>
        </div>

        {/* Modal Component */}
        <div className="col-span-full">
          <h3 className="text-xl mb-3 text-draugr-accent-red">پنجره مودال</h3>
          
          <button data-modal-target="defaultModal" data-modal-toggle="defaultModal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            باز کردن مودال
          </button>

          <div id="defaultModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-draugr-charcoal">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    مودال Flowbite
                  </h3>
                  <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">بستن</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    این یک مودال آزمایشی برای تست Flowbite در Draugr Shop است.
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 space-x-2 space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                  <button data-modal-hide="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">پذیرفتن</button>
                  <button data-modal-hide="defaultModal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">لغو</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Component */}
        <div className="col-span-full">
          <h3 className="text-xl mb-3 text-draugr-accent-red">آکاردیون</h3>
          
          <div id="accordion-collapse" data-accordion="collapse">
            <h2 id="accordion-collapse-heading-1">
              <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
                <span>آیتم اول آکاردیون</span>
                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                </svg>
              </button>
            </h2>
            <div id="accordion-collapse-body-1" className="hidden" aria-labelledby="accordion-collapse-heading-1">
              <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <p className="mb-2 text-gray-500 dark:text-gray-400">این محتوای آکاردیون اول است. می‌توانید از این قسمت برای توضیحات بیشتر استفاده کنید.</p>
              </div>
            </div>
            <h2 id="accordion-collapse-heading-2">
              <button type="button" className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2">
                <span>آیتم دوم آکاردیون</span>
                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                </svg>
              </button>
            </h2>
            <div id="accordion-collapse-body-2" className="hidden" aria-labelledby="accordion-collapse-heading-2">
              <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
                <p className="mb-2 text-gray-500 dark:text-gray-400">این محتوای آکاردیون دوم است. می‌توانید از این قسمت برای توضیحات بیشتر استفاده کنید.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowbiteTest; 