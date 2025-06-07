// Import asset service instead of direct imports
// import { productImages } from '../services/assetService';

// Temporary fallback images for development
const productImages = {
  product1: "http://localhost:5000/static/images/products/Product_1.jpg",
  product2: "http://localhost:5000/static/images/products/Product_2.jpg",
  product3: "http://localhost:5000/static/images/products/Product_3.jpg",
  product4: "http://localhost:5000/static/images/products/Product_4.jpg",
  product5: "http://localhost:5000/static/images/products/Product_5.jpg",
  product6: "http://localhost:5000/static/images/products/Product_6.jpg",
  product7: "http://localhost:5000/static/images/products/Product_7.jpg",
  product8: "http://localhost:5000/static/images/products/Product_8.jpg",
  product9: "http://localhost:5000/static/images/products/Product_9.jpg",
  product10: "http://localhost:5000/static/images/products/Product_10.jpg",
  product11: "http://localhost:5000/static/images/products/Product_11.jpg",
  product12: "http://localhost:5000/static/images/products/Product_12.jpg",
  product13: "http://localhost:5000/static/images/products/Product_13.jpg",
  product14: "http://localhost:5000/static/images/products/Product_14.jpg",
  product15: "http://localhost:5000/static/images/products/Product_15.jpg"
};

// Blog placeholder images (using null to trigger the fallback)
const blogPlaceholderJangal = null;
const blogPlaceholderEmarat = null;
const blogPlaceholderMoumiaei = null;
const blogPlaceholderDarya = null;

const products = [
  {
    id: 1,
    name: "شمشیر DRAUGR",
    description: "یک شمشیر باستانی نوردیک آغشته به جادوی یخ، گرفته شده از اعماق یک گور اسکایریم.",
    price: 199.99,
    imageUrl: productImages.product1,
    category: "weapons"
  },
  {
    id: 2,
    name: "کلاه‌خود نوردیک",
    description: "بازسازی اصیل از طراحی کلاه‌خود باستانی نوردیک، با شاخ‌های محافظ و حکاکی‌های رونی.",
    price: 149.99,
    imageUrl: productImages.product2,
    category: "armor"
  },
  {
    id: 3,
    name: "معجون شفا",
    description: "به سرعت نقاط سلامتی را بازیابی می‌کند. ساخته شده با گل‌های کوهستانی و سایر مواد مخفی.",
    price: 29.99,
    imageUrl: productImages.product3,
    category: "potions"
  },
  {
    id: 4,
    name: "طومار باستانی",
    description: "طوماری اسرارآمیز با رون‌های قدرتمند که دانش فراموش شده را آشکار می‌کند.",
    price: 89.99,
    imageUrl: productImages.product4,
    category: "magic"
  },
  {
    id: 5,
    name: "گردنبند مقدس",
    description: "گردنبندی با قدرت محافظت در برابر ارواح خبیث، ساخته شده از نقره و سنگ‌های قیمتی.",
    price: 79.99,
    imageUrl: productImages.product5,
    category: "accessories"
  },
  {
    id: 6,
    name: "دستبند محافظ",
    description: "دستبندی با نقوش باستانی که نیروی دفاعی خود را به دارنده منتقل می‌کند.",
    price: 59.99,
    imageUrl: productImages.product6,
    category: "accessories"
  },
  {
    id: 7,
    name: "فندک اژدها",
    description: "فندکی به شکل سر اژدها که شعله‌های آن هرگز خاموش نمی‌شود.",
    price: 39.99,
    imageUrl: productImages.product7,
    category: "accessories"
  },
  {
    id: 8,
    name: "ویجا بورد نفرین شده",
    description: "تخته ویجا باستانی برای ارتباط با ارواح، استفاده با احتیاط توصیه می‌شود.",
    price: 129.99,
    imageUrl: productImages.product8,
    category: "accessories"
  },
  {
    id: 9,
    name: "پیک گیتار استخوانی",
    description: "پیک گیتاری ساخته شده از استخوان‌های باستانی، برای صدایی عمیق و تاریک.",
    price: 19.99,
    imageUrl: productImages.product9,
    category: "accessories"
  },
  {
    id: 10,
    name: "زیرسیگاری جمجمه",
    description: "زیرسیگاری به شکل جمجمه انسان، دست‌ساز با جزئیات دقیق.",
    price: 49.99,
    imageUrl: productImages.product10,
    category: "accessories"
  },
  {
    id: 11,
    name: "ماگ استخوانی",
    description: "ماگی با طراحی استخوانی برای نوشیدنی‌های گرم، ساخته شده از سرامیک با کیفیت.",
    price: 34.99,
    imageUrl: productImages.product11,
    category: "accessories"
  },
  {
    id: 12,
    name: "کتاب نفرین‌ها",
    description: "کتاب کمیاب و قدیمی حاوی نفرین‌های باستانی، با صفحات چرمی دست‌ساز.",
    price: 159.99,
    imageUrl: productImages.product12,
    category: "rare_books"
  },
  {
    id: 13,
    name: "چوب بیسبال خون‌آلود",
    description: "چوب بیسبال قدیمی با لکه‌های قرمز و داستانی مرموز پشت آن.",
    price: 89.99,
    imageUrl: productImages.product13,
    category: "accessories"
  },
  {
    id: 14,
    name: "وست چرمی",
    description: "وست چرمی سیاه با طرح‌های فلزی و گوتیک، مناسب برای طرفداران سبک تاریک.",
    price: 199.99,
    imageUrl: productImages.product14,
    category: "accessories"
  },
  {
    id: 15,
    name: "کامیک هارور",
    description: "کامیک کمیاب با داستان‌های ترسناک و تصاویر منحصربه‌فرد، چاپ محدود.",
    price: 69.99,
    imageUrl: productImages.product15,
    category: "accessories"
  }
];

const categories = [
  { id: 1, name: "سلاح‌ها", slug: "weapons", themeColor: "#8B0000" },
  { id: 2, name: "زره‌ها", slug: "armor", themeColor: "#4A4A4A" },
  { id: 3, name: "معجون‌ها", slug: "potions", themeColor: "#800080" },
  { id: 4, name: "اقلام جادویی", slug: "magic", themeColor: "#4B0082" },
  { id: 5, name: "اکسسوری", slug: "accessories", themeColor: "#8B4513" },
  { id: 6, name: "کتاب‌های نایاب", slug: "rare_books", themeColor: "#654321" }
];

const additionalCategories = [
  { id: 7, name: "ابزار شکار", slug: "hunting_gear", themeColor: "#556B2F" },
  { id: 8, name: "طلسم‌ها", slug: "charms", themeColor: "#9932CC" },
  { id: 9, name: "گیاهان نادر", slug: "rare_herbs", themeColor: "#006400" },
  { id: 10, name: "سنگ‌های جادویی", slug: "magic_stones", themeColor: "#1E90FF" },
  { id: 11, name: "نوشته‌های باستانی", slug: "ancient_scrolls", themeColor: "#8B4513" },
  { id: 12, name: "عناصر ماورایی", slug: "occult_items", themeColor: "#2F4F4F" }
];

const thirdRowCategories = [
  { id: 13, name: "جواهرات افسونگر", slug: "enchanted_jewelry", themeColor: "#FFD700" },
  { id: 14, name: "ابزارهای نجومی", slug: "astronomical_tools", themeColor: "#191970" },
  { id: 15, name: "نقشه‌های باستانی", slug: "ancient_maps", themeColor: "#8B4513" },
  { id: 16, name: "جام‌های مقدس", slug: "sacred_chalices", themeColor: "#B8860B" },
  { id: 17, name: "تندیس‌های کهن", slug: "ancient_statues", themeColor: "#708090" },
  { id: 18, name: "ادویه‌های نادر", slug: "rare_spices", themeColor: "#CD5C5C" }
];

const fourthRowCategories = [
  { id: 19, name: "نشان‌های قبیله‌ای", slug: "tribal_emblems", themeColor: "#CD853F" },
  { id: 20, name: "رمزنگاری‌ها", slug: "cryptic_writings", themeColor: "#2F4F4F" },
  { id: 21, name: "چوب‌دستی‌های جادویی", slug: "magic_wands", themeColor: "#800080" },
  { id: 22, name: "نقاب‌های آیینی", slug: "ritual_masks", themeColor: "#A0522D" },
  { id: 23, name: "ابزارهای کیمیاگری", slug: "alchemy_tools", themeColor: "#DAA520" },
  { id: 24, name: "سازهای موسیقی کهن", slug: "ancient_instruments", themeColor: "#8B008B" }
]; 

const blogPosts = [
  {
    id: "bp1",
    title: "رازهای نهفته در جنگل تاریک",
    slug: "razhaye-nahofte-dar-jangal-tarik",
    author: "نویسنده مرموز",
    date: "۱۴ مرداد ۱۴۰۳", // Persian date
    featuredImageUrl: blogPlaceholderJangal,
    snippet: "سفری به اعماق جنگلی که هرگز نور خورشید را به خود ندیده است. موجودات عجیب و داستان‌های فراموش شده در انتظار شما هستند. آیا جرات ورود دارید؟",
    content: `
      <p><strong>مقدمه:</strong> جنگل تاریک، مکانی است که نامش با لرز بر زبان‌ها جاری می‌شود. محلی که درختان کهنسال آن سایه‌هایی عمیق و دائمی بر زمین افکنده‌اند و نور خورشید به ندرت جرات نفوذ به آن را پیدا می‌کند. این مقاله به بررسی افسانه‌ها و حقایق پیرامون این مکان اسرارآمیز می‌پردازد.</p>
      <br />
      <h2>افسانه‌های باستانی</h2>
      <p>بر اساس روایت‌های قدیمی، جنگل تاریک توسط یک نفرین باستانی محافظت می‌شود. گفته می‌شود که قرن‌ها پیش، جادوگری قدرتمند برای محافظت از گنجینه‌ای پنهان، این نفرین را بر جنگل نهاده است. <em>هرکس که با نیت پلید وارد شود، راه خروج را نخواهد یافت.</em></p>
      <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
      <br />
      <h3>موجودات ساکن جنگل</h3>
      <p>شایعاتی مبنی بر وجود موجوداتی عجیب و غریب در اعماق جنگل وجود دارد. از گرگینه‌هایی که در شب‌های مهتابی زوزه می‌کشند تا ارواح سرگردانی که به دنبال آرامش ابدی هستند. برخی از مسافران نیز از دیدن نورهای عجیب و شنیدن صداهای ناشناس در طول شب گزارش داده‌اند.</p>
      <ul>
        <li><strong>گرگینه‌ها:</strong> موجوداتی نیمه انسان، نیمه گرگ که گفته می‌شود در شب‌های کامل ماه قدرت می‌گیرند.</li>
        <li><em>ارواح گمشده:</em> روح مسافرانی که در جنگل راه خود را گم کرده‌اند و اکنون در آن سرگردانند.</li>
        <li>نورهای اسرارآمیز: برخی معتقدند این نورها نشانه‌ای از فعالیت‌های ماوراء طبیعی است.</li>
      </ul>
      <br />
      <h2>تحقیقات اخیر</h2>
      <p>با وجود تمام داستان‌ها، تیم‌های تحقیقاتی کمی جرات کرده‌اند به اعماق جنگل نفوذ کنند. آخرین گروهی که وارد شد، پس از چند روز بدون هیچ اثری ناپدید گشت. تنها یک دفترچه خاطرات نیمه‌سوخته از آن‌ها باقی ماند که حاوی توصیفات وحشتناکی از سایه‌های متحرک و زمزمه‌های تهدیدآمیز بود.</p>
      <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد.</p>
    `
  },
  {
    id: "bp2",
    title: "عمارت تسخیر شده بالای تپه",
    slug: "emarat-taskhir-shode-balaye-tape",
    author: "شاهد عینی",
    date: "۲۲ شهریور ۱۴۰۳", // Persian date
    featuredImageUrl: blogPlaceholderEmarat,
    snippet: "داستان عمارتی قدیمی که بر فراز تپه‌ای قرار دارد و گفته می‌شود توسط ارواح ساکنان قبلی‌اش تسخیر شده است. صداهای عجیب، اشیاء متحرک و سایه‌های وهم‌آور تنها بخشی از اتفاقات این خانه هستند.",
    content: `
      <p>عمارت ویکتوریایی که بر بلندای تپه سایه‌افکن قرار گرفته، دهه‌هاست که خالی از سکنه است، اما نه کاملاً آرام. مردم محلی از شنیدن صداهای عجیب در شب، از ناله‌های غم‌انگیز گرفته تا خنده‌های شیطانی، حکایت می‌کنند. <em>هیچکس جرات نزدیک شدن به آن را پس از غروب آفتاب ندارد.</em></p>
      <br />
      <h2>تاریخچه عمارت</h2>
      <p>این عمارت در اواخر قرن نوزدهم توسط خانواده‌ای ثروتمند اما منزوی ساخته شد. شایعات حاکی از آن است که این خانواده درگیر فعالیت‌های ocult بوده‌اند و سرنوشت شومی برایشان رقم خورده است. برخی می‌گویند که ارواح آن‌ها هنوز در راهروهای خالی عمارت پرسه می‌زنند.</p>
      <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.</p>
      <br />
      <h3>اتفاقات گزارش شده</h3>
      <p>بازدیدکنندگانی که به اندازه کافی شجاع (یا بی‌فکر) بوده‌اند تا وارد عمارت شوند، تجربیات وحشتناکی را گزارش کرده‌اند:</p>
      <ul>
        <li><strong>درهای خود به خود باز و بسته شونده:</strong> حتی در روزهای بدون باد.</li>
        <li>اشیاء پرتاب شونده: کتاب‌ها، گلدان‌ها و سایر وسایل به ظاهر توسط نیرویی نامرئی حرکت می‌کنند.</li>
        <li><em>احساس سرمای ناگهانی:</em> حتی در گرم‌ترین روزها، نقاط خاصی از خانه به شدت سرد هستند.</li>
        <li>سایه‌های متحرک: سایه‌هایی که در گوشه چشم دیده می‌شوند اما با نگاه مستقیم ناپدید می‌گردند.</li>
      </ul>
      <br />
      <p><strong>تحقیقات فراطبیعی:</strong> چندین گروه از محققان پدیده‌های فراطبیعی سعی در بررسی عمارت داشته‌اند، اما بسیاری از آن‌ها با تجهیزات خراب شده و اعضای وحشت‌زده گروه، کار را نیمه‌تمام رها کرده‌اند. آیا کسی خواهد توانست راز این عمارت را فاش کند؟</p>
    `
  },
  {
    id: "bp3",
    title: "نفرین مومیایی گمشده",
    slug: "nefrin-moumiaei-gomshode",
    author: "باستان شناس ماجراجو",
    date: "۰۵ آبان ۱۴۰۳", // Persian date
    featuredImageUrl: blogPlaceholderMoumiaei,
    snippet: "کشف یک مقبره باستانی و نفرینی که گریبان‌گیر تمام کسانی می‌شود که آرامش مومیایی را برهم زنند. آیا این تنها یک افسانه است یا قدرتی تاریک در کار است؟",
    content: `
      <p>در اعماق شنزارهای سوزان مصر، مقبره‌ای فراموش شده کشف شد که گفته می‌شود متعلق به یک فرعون گمنام اما قدرتمند است. بر روی ورودی مقبره، هشداری به خط هیروگلیف حک شده بود: <em>"مرگ بال‌های سیاهش را بر هر آنکس که خواب ابدی پادشاه را برآشوبد، خواهد گسترد."</em></p>
      <br />
      <h2>اولین قربانیان</h2>
      <p>تیم باستان‌شناسی که مقبره را کشف کرد، به سرعت دچار حوادث ناگوار و بیماری‌های مرموزی شد. اولین کسی که وارد مقبره شد، در اثر یک حادثه عجیب در محل حفاری جان باخت. دیگران نیز به تدریج یا دیوانه شدند یا در شرایطی غیرقابل توضیح مردند.</p>
      <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.</p>
      <br />
      <h3>قدرت نفرین</h3>
      <p>آیا این حوادث صرفاً تصادفی بودند یا نفرین مومیایی واقعاً قدرت داشت؟ برخی از ویژگی‌های نسبت داده شده به نفرین عبارتند از:</p>
      <ul>
        <li><strong>بدشانسی‌های پی در پی:</strong> از دست دادن ثروت، شکست در روابط و حوادث غیرمنتظره.</li>
        <li><em>بیماری‌های ناشناخته:</em> بیماری‌هایی که پزشکان از تشخیص و درمان آن‌ها عاجزند.</li>
        <li>توهمات وحشتناک: دیدن سایه‌ها، شنیدن صداها و کابوس‌های زنده.</li>
      </ul>
      <p><strong>هشدار:</strong> این داستان‌ها نشان می‌دهد که برخی از رازهای گذشته بهتر است دست‌نخورده باقی بمانند. گاهی اوقات، کنجکاوی می‌تواند بهایی سنگین داشته باشد.</p>
      <br />
      <p>کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.</p>
    `
  },
  {
    id: "bp4",
    title: "موجودات اعماق دریا: افسانه یا واقعیت؟",
    slug: "mojodat-amaq-darya",
    author: "اقیانوس شناس کنجکاو",
    date: "۱۸ دی ۱۴۰۳", // Persian date
    featuredImageUrl: blogPlaceholderDarya,
    snippet: "گفته می‌شود اعماق ناشناخته اقیانوس‌ها، پناهگاه موجوداتی غول‌پیکر و ترسناک است که از دید انسان پنهان مانده‌اند. نگاهی به داستان‌های کراکن، لویاتان و دیگر هیولاهای دریایی.",
    content: `
      <p>بیش از هشتاد درصد اقیانوس‌های جهان هنوز کاوش نشده باقی مانده‌اند. در این تاریکی بی‌پایان، چه موجوداتی ممکن است پنهان شده باشند؟ افسانه‌های ملوانان قدیمی پر از داستان‌هایی درباره هیولاهای دریایی است که کشتی‌ها را به کام خود می‌کشیدند.</p>
      <br />
      <h2>کراکن: هیولای افسانه‌ای شمال</h2>
      <p>کراکن، موجودی غول‌پیکر شبیه به هشت‌پا یا ماهی مرکب، یکی از معروف‌ترین هیولاهای دریایی است. گفته می‌شود که بازوهای عظیم آن می‌توانند بزرگترین کشتی‌ها را در هم بشکنند و به اعماق آب بکشند. <em>ملوانان اسکاندیناوی قرن‌ها از مواجهه با این هیولا وحشت داشتند.</em></p>
      <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.</p>
      <br />
      <h3>لویاتان: مار دریایی عظیم‌الجثه</h3>
      <p>لویاتان، که در متون باستانی نیز به آن اشاره شده، یک مار دریایی عظیم‌الجثه با قدرتی ویرانگر است. برخی توصیفات آن را موجودی آتشین نفس با چندین سر ذکر کرده‌اند. آیا چنین موجودی می‌تواند واقعی باشد؟</p>
      <ul>
        <li><strong>اندازه غیرقابل تصور:</strong> برخی داستان‌ها طول آن را به چندین کیلومتر می‌رسانند.</li>
        <li><em>پوست نفوذناپذیر:</em> گفته می‌شود که سلاح‌های انسانی بر آن کارگر نیست.</li>
        <li>کنترل طوفان‌ها: برخی افسانه‌ها ادعا می‌کنند که لویاتان می‌تواند طوفان‌های سهمگین ایجاد کند.</li>
      </ul>
      <br />
      <h2>اکتشافات مدرن</h2>
      <p>اگرچه وجود کراکن یا لویاتان به شکلی که در افسانه‌ها آمده، اثبات نشده است، اما اکتشافات اخیر در اعماق اقیانوس‌ها موجودات شگفت‌انگیز و گاه ترسناکی را آشکار کرده است. از ماهی مرکب غول‌پیکر واقعی گرفته تا موجودات بیولومینسانس که در تاریکی می‌درخشند. شاید افسانه‌ها، هرچند اغراق‌آمیز، ریشه‌ای در واقعیت داشته باشند.</p>
      <p><strong>نتیجه‌گیری:</strong> اعماق اقیانوس همچنان یکی از بزرگترین رازهای سیاره ماست. تا زمانی که نتوانیم به طور کامل آن را کاوش کنیم، داستان‌ها و افسانه‌های مربوط به هیولاهای دریایی به حیات خود ادامه خواهند داد و تخیل ما را به چالش می‌کشند.</p>
    `
  }
];

// Main mock data export
export const mockData = {
  products,
  categories: [...categories, ...additionalCategories, ...thirdRowCategories, ...fourthRowCategories],
  blogPosts,
  
  // Add mock users
  users: [
    {
      _id: 'user-1',
      firstName: 'کاربر',
      lastName: 'تست',
      email: 'test@test.local',
      role: 'user',
      avatar: null,
      phone: '+98 900 000 0000',
      address: 'آدرس تست',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: 'user-2',
      firstName: 'کاربر',
      lastName: 'دوم',
      email: 'user2@test.local',
      role: 'user',
      avatar: null,
      phone: '+98 900 000 0001',
      address: 'آدرس تست دوم',
      createdAt: '2024-01-02T00:00:00.000Z'
    }
  ],

  // Add mock orders
  orders: [
    {
      _id: 'order-1',
      user: 'user-2',
      items: [
        { product: products[0], quantity: 1, price: products[0].price },
        { product: products[1], quantity: 2, price: products[1].price }
      ],
      total: products[0].price + (products[1].price * 2),
      status: 'completed',
      shippingAddress: 'اصفهان، خیابان چهارباغ',
      createdAt: '2024-01-03T00:00:00.000Z'
    }
  ],

  // Add mock assets
  assets: [
    {
      _id: 'asset-1',
      name: 'Product_1',
      type: 'image',
      category: 'product',
      url: 'http://localhost:5000/static/images/products/Product_1.jpg',
      altText: 'محصول شماره یک',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      _id: 'asset-2',
      name: 'background_dark',
      type: 'image',
      category: 'background',
      url: 'http://localhost:5000/static/images/backgrounds/dark_bg.jpg',
      altText: 'پس‌زمینه تاریک',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};