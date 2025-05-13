<div align="center">

# فروشگاه دراگر (DRAUGR)

<hr/>

**یک فروشگاه آنلاین با تم ترسناک بر پایه React، Tailwind CSS و Framer Motion**

</div>

<div dir="rtl" align="center">

<hr/>

## معرفی

</div>

<div dir="rtl">

فروشگاه دراگر یک وب‌سایت تجارت الکترونیک با تم ترسناک است که با استفاده از React، Tailwind CSS و Framer Motion توسعه یافته است. این پروژه یک محیط خرید آنلاین با استایل منحصر به فرد و تعاملی را فراهم می‌کند.

</div>

<div dir="rtl" align="center">

## ویژگی‌ها

</div>

<div dir="rtl">

- **طراحی ترسناک**: ظاهر کاملاً سفارشی‌شده با تم وحشت
- **انیمیشن‌های پیشرفته**: افکت‌های انیمیشنی متنوع با استفاده از Framer Motion
- **افکت‌های سه‌بعدی**: کارت‌های محصول با افکت‌های سه‌بعدی و پرسپکتیو
- **افکت‌های ویژه**: عناصر شناور، صدای تپش قلب و دیگر جلوه‌های ویژه
- **واکنش‌گرا**: طراحی کاملاً واکنش‌گرا برای تمامی دستگاه‌ها
- **پشتیبانی RTL**: کاملاً سازگار با زبان فارسی و جهت راست به چپ

</div>

<div dir="rtl" align="center">

## تکنولوژی‌ها

</div>

<div dir="rtl">

- **React**: برای توسعه رابط کاربری
- **Vite**: برای محیط توسعه سریع
- **Tailwind CSS**: برای استایل‌دهی
- **Framer Motion**: برای انیمیشن‌ها
- **LocalStorage**: برای ذخیره‌سازی ترجیحات کاربر

</div>

<div dir="rtl" align="center">

## نصب و راه‌اندازی

</div>

<div dir="rtl">

### پیش‌نیازها

- Node.js نسخه 14 یا بالاتر
- npm نسخه 6 یا بالاتر یا yarn

### مراحل نصب

1. **کلون کردن مخزن**:
   ```bash
   git clone https://github.com/Mahdiglm/DRAUGR-FrontEnd.git
   ```

2. **وارد شدن به پوشه پروژه**:
   ```bash
   cd DRAUGR-FrontEnd
   ```

3. **نصب وابستگی‌ها**:
   ```bash
   npm install
   # یا
   yarn
   ```

4. **اجرای نسخه توسعه**:
   ```bash
   npm run dev
   # یا
   yarn dev
   ```

5. **مشاهده پروژه**:
   پس از اجرای دستور بالا، پروژه در آدرس زیر قابل مشاهده خواهد بود:
   ```
   http://localhost:5173
   ```

### ساخت نسخه تولید

برای ساخت نسخه تولید و بهینه‌سازی شده پروژه، از دستور زیر استفاده کنید:

```bash
npm run build
# یا
yarn build
```

فایل‌های خروجی در پوشه `dist` قرار خواهند گرفت.

</div>

<div dir="rtl" align="center">

## راهنمای عیب‌یابی

</div>

<div dir="rtl">

### مشکلات رایج و راه‌حل‌ها

1. **خطای نصب وابستگی‌ها**:
   
   اگر هنگام نصب وابستگی‌ها با خطا مواجه شدید، مراحل زیر را امتحان کنید:
   
   - حذف پوشه `node_modules` و فایل `package-lock.json`:
     ```bash
     rm -rf node_modules package-lock.json
     ```
   
   - نصب مجدد وابستگی‌ها:
     ```bash
     npm install
     ```
   
   - در صورت ادامه مشکل، نصب با پرچم `--legacy-peer-deps`:
     ```bash
     npm install --legacy-peer-deps
     ```

2. **خطای اجرای توسعه**:
   
   اگر هنگام اجرای `npm run dev` با خطا مواجه شدید:
   
   - اطمینان از نصب آخرین نسخه Node.js (حداقل نسخه 14)
   - بررسی پورت 5173 (اگر قبلاً در حال استفاده است):
     ```bash
     npx kill-port 5173
     ```
   
   - اجرای مجدد با پورت متفاوت:
     ```bash
     npm run dev -- --port 3000
     ```

3. **مشکلات نمایشی یا استایل**:
   
   اگر با مشکلات استایل یا نمایش نادرست مواجه شدید:
   
   - اطمینان از نصب صحیح Tailwind CSS:
     ```bash
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init -p
     ```
   
   - پاک کردن کش مرورگر با کلیدهای `Ctrl+Shift+R` یا `Cmd+Shift+R`

4. **خطای ساخت پروژه**:
   
   اگر هنگام ساخت پروژه با خطا مواجه شدید:
   
   - بررسی فضای دیسک کافی برای ساخت
   - اجرای دستور با پرچم `--force`:
     ```bash
     npm run build --force
     ```

</div>

<div dir="rtl" align="center">

## ساختار پروژه

</div>

<div dir="rtl">

```
draugr-shop/
├── public/            # فایل‌های عمومی 
├── src/               # کدهای منبع
│   ├── assets/        # تصاویر و فایل‌های استاتیک
│   ├── components/    # کامپوننت‌های React
│   │   ├── cart/      # کامپوننت‌های سبد خرید
│   │   ├── layout/    # کامپوننت‌های طرح‌بندی (هدر، فوتر)
│   │   └── product/   # کامپوننت‌های مرتبط با محصول
│   ├── utils/         # توابع و ابزارهای کمکی
│   ├── App.jsx        # کامپوننت اصلی برنامه
│   ├── App.css        # استایل‌های اصلی
│   ├── index.css      # استایل‌های سراسری
│   └── main.jsx       # نقطه ورودی برنامه
├── package.json       # وابستگی‌ها و اسکریپت‌ها
├── tailwind.config.js # پیکربندی Tailwind
└── vite.config.js     # پیکربندی Vite
```

</div>

<div dir="rtl" align="center">

## مشارکت در پروژه

</div>

<div dir="rtl">

برای مشارکت در این پروژه، لطفاً مراحل زیر را دنبال کنید:

1. Repository را fork کنید
2. یک branch جدید برای ویژگی یا رفع باگ ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات خود را commit کنید (`git commit -m 'افزودن ویژگی جدید'`)
4. تغییرات را به fork خود push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request ایجاد کنید

</div>

<div dir="rtl" align="center">

## مجوز

</div>

<div dir="rtl">

این پروژه تحت مجوز MIT منتشر شده است. برای اطلاعات بیشتر به فایل LICENSE مراجعه کنید.

<hr/>

<p align="center">
ساخته شده با ❤️ توسط تیم درآگر
</p>

</div>

## Authentication Features

The newly added authentication system includes:

- **Login Page**: Modern form with validation and error messages
- **Signup Page**: Interactive form with password strength meter
- **Blood Drop Animations**: Creepy blood drops for the horror theme
- **Responsive Design**: Full mobile support for auth pages
- **Form Validation**: Client-side validation for all inputs

## Deployment to GitHub Pages

```bash
# Build and deploy the project
npm run deploy
```

## Technologies Used

- React
- TailwindCSS
- Framer Motion
- React Router DOM

## Project Structure

```
draugr-shop/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthLayout.jsx     # Shared layout for auth pages
│   │   │   ├── Login.jsx          # Login form component
│   │   │   └── SignUp.jsx         # Signup form component
│   │   ├── cart/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── product/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
└── vite.config.js
```

## Styling

The horror theme is built using Tailwind CSS, with custom gradients and animations. Key styling features include:

- Blood-red color scheme
- Dark backgrounds with subtle textures
- Animated blood drops
- Glowing effects on hover
- Custom horror shadows

## Localization

The site is fully localized in Persian with RTL (right-to-left) layout. This is done using:

- RTL CSS direction
- Persian text and translations
- Vazirmatn font for Persian characters

## Known Issues

- Sound effects may not work in browsers with autoplay restrictions
- Some animations might be processing-intensive on lower-end devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.
