const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database-enhanced');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');

// Sample product data for Rose Chemicals
const categories = [
  {
    name: 'Bathroom Cleaners',
    description: 'Professional bathroom cleaning products',
    slug: 'bathroom-cleaners',
    image: '/images/categories/bathroom.jpg'
  },
  {
    name: 'Kitchen Cleaners',
    description: 'Kitchen and utensil cleaning solutions',
    slug: 'kitchen-cleaners',
    image: '/images/categories/kitchen.jpg'
  },
  {
    name: 'Floor Cleaners',
    description: 'Floor cleaning and maintenance products',
    slug: 'floor-cleaners',
    image: '/images/categories/floor.jpg'
  },
  {
    name: 'Glass Cleaners',
    description: 'Streak-free glass and mirror cleaners',
    slug: 'glass-cleaners',
    image: '/images/categories/glass.jpg'
  },
  {
    name: 'Disinfectants',
    description: 'Powerful disinfection solutions',
    slug: 'disinfectants',
    image: '/images/categories/disinfectants.jpg'
  },
  {
    name: 'Industrial Cleaners',
    description: 'Heavy-duty industrial cleaning solutions',
    slug: 'industrial-cleaners',
    image: '/images/categories/industrial.jpg'
  },
  {
    name: 'Brooms',
    description: 'High-quality brooms for all cleaning needs',
    slug: 'brooms',
    image: '/images/categories/brooms.jpg'
  },
  {
    name: 'Toilet Brushes',
    description: 'Specialized toilet cleaning brushes and accessories',
    slug: 'toilet-brushes',
    image: '/images/categories/toilet-brushes.jpg'
  },
  {
    name: 'Carpet Brushes',
    description: 'Professional carpet and upholstery cleaning brushes',
    slug: 'carpet-brushes',
    image: '/images/categories/carpet-brushes.jpg'
  },
  {
    name: 'Long Brushes',
    description: 'Extended reach brushes for high and hard-to-reach areas',
    slug: 'long-brushes',
    image: '/images/categories/long-brushes.jpg'
  },
  {
    name: 'Sink Brushes',
    description: 'Kitchen sink and dishware cleaning brushes',
    slug: 'sink-brushes',
    image: '/images/categories/sink-brushes.jpg'
  },
  {
    name: 'Cobweb Cleaners',
    description: 'Specialized tools for removing cobwebs and ceiling cleaning',
    slug: 'cobweb-cleaners',
    image: '/images/categories/cobweb-cleaners.jpg'
  }
];

const products = [
  // BROOMS - All products from BROOMS folder (17 products)
  {
    name: 'Delux Nice Broom',
    description: 'Premium quality delux nice broom for efficient cleaning',
    price: 115,
    mrp: 145,
    category: 'Brooms',
    images: ['/images/BROOMS/164. DELUX NICE BROOM 115.png'],
    stock: 50,
    sku: 'RC-BR-001',
    features: ['Premium quality', 'Efficient cleaning', 'Durable bristles', 'Comfortable grip'],
    ingredients: ['Natural bristles', 'Wooden handle'],
    usage: 'Use for sweeping floors and surfaces',
    weight: '500g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sitara Broom',
    description: 'Durable sitara broom for everyday cleaning needs',
    price: 84,
    mrp: 110,
    category: 'Brooms',
    images: ['/images/BROOMS/166. SITARA BROOM- 84.png'],
    stock: 45,
    sku: 'RC-BR-002',
    features: ['Traditional design', 'Multi-surface', 'Lightweight', 'Easy to use'],
    ingredients: ['Natural bristles', 'Bamboo handle'],
    usage: 'Ideal for daily sweeping of home and office',
    weight: '450g',
    isActive: true
  },
  {
    name: 'Supriya Nice Broom',
    description: 'High-quality Supriya nice broom with excellent cleaning performance',
    price: 115,
    mrp: 145,
    category: 'Brooms',
    images: ['/images/BROOMS/167. SUPRIYA NICE BROOM 115.png'],
    stock: 40,
    sku: 'RC-BR-003',
    features: ['High quality', 'Excellent performance', 'Soft bristles', 'Premium quality'],
    ingredients: ['Premium bristles', 'Ergonomic handle'],
    usage: 'Perfect for delicate floor surfaces',
    weight: '480g',
    isActive: true
  },
  {
    name: 'Camel Red Broom',
    description: 'Sturdy camel red broom for heavy-duty cleaning',
    price: 65,
    mrp: 85,
    category: 'Brooms',
    images: ['/images/BROOMS/168. CAMEL RED - 65.png'],
    stock: 55,
    sku: 'RC-BR-004',
    features: ['Attractive design', 'Heavy-duty', 'Affordable', 'Reliable'],
    ingredients: ['Synthetic bristles', 'Plastic handle'],
    usage: 'Suitable for regular household cleaning',
    weight: '400g',
    isActive: true
  },
  {
    name: 'Shine Red Broom',
    description: 'Bright shine red broom with superior cleaning bristles',
    price: 74,
    mrp: 95,
    category: 'Brooms',
    images: ['/images/BROOMS/169. SHINE RED- 74.png'],
    stock: 35,
    sku: 'RC-BR-005',
    features: ['Bright color', 'Superior bristles', 'Daily use', 'Value for money'],
    ingredients: ['Mixed bristles', 'Durable handle'],
    usage: 'Great for everyday cleaning tasks',
    weight: '420g',
    isActive: true
  },
  {
    name: 'Pinky Red Broom',
    description: 'Attractive pinky red broom with efficient cleaning capabilities',
    price: 78,
    mrp: 100,
    category: 'Brooms',
    images: ['/images/BROOMS/171. PINKY RED BROOM - 78.png'],
    stock: 30,
    sku: 'RC-BR-006',
    features: ['Stylish design', 'Efficient cleaning', 'Easy handling', 'Durable'],
    ingredients: ['Quality bristles', 'Strong handle'],
    usage: 'Ideal for thorough cleaning of all areas',
    weight: '460g',
    isActive: true
  },
  {
    name: 'Pinky Blue Broom',
    description: 'Stylish pinky blue broom for effective cleaning',
    price: 78,
    mrp: 100,
    category: 'Brooms',
    images: ['/images/BROOMS/172. PINKY BLUE BROOM-78.png'],
    stock: 32,
    sku: 'RC-BR-007',
    features: ['Stylish blue color', 'Effective cleaning', 'Comfortable grip', 'Durable'],
    ingredients: ['Quality bristles', 'Strong handle'],
    usage: 'Perfect for modern home cleaning',
    weight: '460g',
    isActive: true
  },
  {
    name: 'Jumbo Red Broom',
    description: 'Large jumbo red broom for extensive cleaning areas',
    price: 129,
    mrp: 160,
    category: 'Brooms',
    images: ['/images/BROOMS/173. JUMBO RED BROOM-129.png'],
    stock: 25,
    sku: 'RC-BR-008',
    features: ['Large size', 'Extensive coverage', 'Professional grade', 'Heavy duty'],
    ingredients: ['Premium bristles', 'Extended handle'],
    usage: 'Ideal for large areas and commercial use',
    weight: '600g',
    isActive: true
  },
  {
    name: 'Amil Red Broom',
    description: 'Premium Amil red broom with durable bristles',
    price: 98,
    mrp: 125,
    category: 'Brooms',
    images: ['/images/BROOMS/174. AMIL RED BROOM- 98.png'],
    stock: 28,
    sku: 'RC-BR-009',
    features: ['Premium quality', 'Durable bristles', 'Professional grade', 'Long lasting'],
    ingredients: ['Premium bristles', 'Quality handle'],
    usage: 'Professional cleaning applications',
    weight: '500g',
    isActive: true
  },
  {
    name: 'Mr. Clean Broom',
    description: 'Affordable Mr. Clean broom for basic cleaning needs',
    price: 50,
    mrp: 65,
    category: 'Brooms',
    images: ['/images/BROOMS/180. MR.CLEAN- 50.png'],
    stock: 60,
    sku: 'RC-BR-010',
    features: ['Affordable', 'Basic cleaning', 'Lightweight', 'Easy to use'],
    ingredients: ['Standard bristles', 'Plastic handle'],
    usage: 'Basic household cleaning',
    weight: '350g',
    isActive: true
  },
  {
    name: 'Amil Blue Nice Broom',
    description: 'Stylish Amil blue nice broom with excellent performance',
    price: 95,
    mrp: 120,
    category: 'Brooms',
    images: ['/images/BROOMS/183. AMIL BLUE NICE BROOM 95.png'],
    stock: 30,
    sku: 'RC-BR-011',
    features: ['Stylish blue', 'Excellent performance', 'Nice quality', 'Professional'],
    ingredients: ['Quality bristles', 'Ergonomic handle'],
    usage: 'Stylish and effective cleaning',
    weight: '480g',
    isActive: true
  },
  {
    name: 'Tulsi Green Cover Broom',
    description: 'Eco-friendly Tulsi green cover broom',
    price: 109,
    mrp: 135,
    category: 'Brooms',
    images: ['/images/BROOMS/183. TULSI GREEN COVER BROOM-109.png'],
    stock: 35,
    sku: 'RC-BR-012',
    features: ['Eco-friendly', 'Green cover', 'Natural materials', 'Sustainable'],
    ingredients: ['Natural bristles', 'Eco-friendly cover'],
    usage: 'Environmentally conscious cleaning',
    weight: '520g',
    isActive: true
  },
  {
    name: 'Chennai Broom Set',
    description: 'Chennai broom set with small and big variants',
    price: 88,
    mrp: 115,
    category: 'Brooms',
    images: ['/images/BROOMS/184&185Chennai Broom Small & Big- 73 - 88.png'],
    stock: 22,
    sku: 'RC-BR-013',
    features: ['Set of 2', 'Small & big sizes', 'Value pack', 'Versatile'],
    ingredients: ['Natural bristles', 'Traditional handles'],
    usage: 'Complete cleaning solution set',
    weight: '700g',
    isActive: true
  },
  {
    name: 'Chennai Burma Cover Broom',
    description: 'Traditional Chennai Burma cover broom',
    price: 93,
    mrp: 120,
    category: 'Brooms',
    images: ['/images/BROOMS/185. chennai burma cover- 93.png'],
    stock: 26,
    sku: 'RC-BR-014',
    features: ['Traditional style', 'Burma cover', 'Authentic design', 'Regional specialty'],
    ingredients: ['Natural bristles', 'Traditional cover'],
    usage: 'Traditional cleaning method',
    weight: '480g',
    isActive: true
  },
  {
    name: 'Lady Dream Plastic Broom',
    description: 'Modern Lady Dream plastic broom with ergonomic design',
    price: 111,
    mrp: 140,
    category: 'Brooms',
    images: ['/images/BROOMS/186. Lady Dream Plastic - 111.png'],
    stock: 33,
    sku: 'RC-BR-015',
    features: ['Modern design', 'Plastic construction', 'Ergonomic', 'Lady-friendly'],
    ingredients: ['Plastic bristles', 'Ergonomic handle'],
    usage: 'Modern home cleaning',
    weight: '400g',
    isActive: true
  },
  {
    name: 'Chennai Burma Plastic Broom',
    description: 'Durable Chennai Burma plastic broom',
    price: 88,
    mrp: 115,
    category: 'Brooms',
    images: ['/images/BROOMS/188. chennai burma plastic- 88.png'],
    stock: 29,
    sku: 'RC-BR-016',
    features: ['Plastic construction', 'Durable', 'Traditional style', 'Modern materials'],
    ingredients: ['Plastic bristles', 'Durable handle'],
    usage: 'Modern traditional cleaning',
    weight: '420g',
    isActive: true
  },
  {
    name: 'Lady Dream Soft Brush',
    description: 'Gentle Lady Dream soft brush for delicate cleaning',
    price: 125,
    mrp: 155,
    category: 'Brooms',
    images: ['/images/BROOMS/lady dream soft brush-Photoroom.png'],
    stock: 24,
    sku: 'RC-BR-017',
    features: ['Soft bristles', 'Gentle cleaning', 'Delicate surfaces', 'Premium quality'],
    ingredients: ['Soft bristles', 'Comfortable handle'],
    usage: 'Delicate surface cleaning',
    weight: '350g',
    isActive: true
  },

  // TOILET BRUSHES - All products from TOILET_BRUSHES folder (12 products)
  {
    name: 'Keetal Toilet Brush',
    description: 'Basic Keetal toilet brush for everyday cleaning',
    price: 30,
    mrp: 40,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/107. 5500 KEETAL BRUSH-Rs 30.png'],
    stock: 50,
    sku: 'RC-TB-001',
    features: ['Basic design', 'Everyday use', 'Affordable', 'Functional'],
    ingredients: ['Plastic bristles', 'Simple handle'],
    usage: 'Basic toilet cleaning',
    weight: '200g',
    isActive: true
  },
  {
    name: 'New Container Toilet Brush',
    description: 'Premium container toilet brush with holder',
    price: 141,
    mrp: 180,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/119. NEW CONTAINER BRUSH 1642-Rs 141.png'],
    stock: 25,
    sku: 'RC-TB-002',
    features: ['Container included', 'Premium quality', 'Hygienic storage', 'Modern design'],
    ingredients: ['Quality bristles', 'Container holder'],
    usage: 'Premium toilet cleaning with storage',
    weight: '400g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'THK Toilet Brush',
    description: 'Sturdy THK toilet brush with comfortable grip',
    price: 68,
    mrp: 85,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/122. THK 1108-Rs 68.png'],
    stock: 35,
    sku: 'RC-TB-003',
    features: ['Sturdy design', 'Comfortable grip', 'Professional grade', 'Durable'],
    ingredients: ['Professional bristles', 'Ergonomic handle'],
    usage: 'Professional toilet cleaning',
    weight: '250g',
    isActive: true
  },
  {
    name: 'Rich Look Single Hockey Small',
    description: 'Rich Look single hockey small toilet brush',
    price: 32,
    mrp: 42,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png'],
    stock: 40,
    sku: 'RC-TB-004',
    features: ['Rich look design', 'Single hockey', 'Small size', 'Compact'],
    ingredients: ['Quality bristles', 'Compact handle'],
    usage: 'Compact toilet cleaning',
    weight: '180g',
    isActive: true
  },
  {
    name: 'Double Hockey Toilet Brush',
    description: 'Double hockey toilet brush for thorough cleaning',
    price: 41,
    mrp: 55,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41.png'],
    stock: 38,
    sku: 'RC-TB-005',
    features: ['Double hockey design', 'Thorough cleaning', 'Enhanced coverage', 'Effective'],
    ingredients: ['Double bristle design', 'Standard handle'],
    usage: 'Thorough toilet cleaning',
    weight: '220g',
    isActive: true
  },
  {
    name: 'Rich Look Single Hockey Big',
    description: 'Rich Look single hockey big toilet brush',
    price: 39,
    mrp: 50,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39.png'],
    stock: 42,
    sku: 'RC-TB-006',
    features: ['Rich look design', 'Single hockey', 'Big size', 'Enhanced reach'],
    ingredients: ['Quality bristles', 'Extended handle'],
    usage: 'Enhanced toilet cleaning',
    weight: '240g',
    isActive: true
  },
  {
    name: 'Rich Look Steel Toilet Brush',
    description: 'Rich Look steel toilet brush with stainless steel handle',
    price: 48,
    mrp: 62,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48.png'],
    stock: 30,
    sku: 'RC-TB-007',
    features: ['Stainless steel', 'Rich look design', 'Corrosion resistant', 'Premium'],
    ingredients: ['Steel handle', 'Quality bristles'],
    usage: 'Premium toilet cleaning',
    weight: '300g',
    isActive: true
  },
  {
    name: 'Jumbo Double Hockey Toilet Brush',
    description: 'Jumbo double hockey toilet brush for heavy-duty cleaning',
    price: 68,
    mrp: 85,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68.png'],
    stock: 28,
    sku: 'RC-TB-008',
    features: ['Jumbo size', 'Double hockey', 'Heavy-duty', 'Professional grade'],
    ingredients: ['Professional bristles', 'Extended handle'],
    usage: 'Heavy-duty toilet cleaning',
    weight: '350g',
    isActive: true
  },
  {
    name: 'Double Hockey New Model',
    description: 'New model double hockey toilet brush',
    price: 77,
    mrp: 95,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png'],
    stock: 32,
    sku: 'RC-TB-009',
    features: ['New model', 'Double hockey', 'Improved design', 'Enhanced performance'],
    ingredients: ['Advanced bristles', 'Ergonomic handle'],
    usage: 'Enhanced toilet cleaning',
    weight: '280g',
    isActive: true
  },
  {
    name: 'Container Brush A',
    description: 'Premium container brush with advanced cleaning head',
    price: 97,
    mrp: 120,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/91. 8312 CONTAINER BRUSH A-Rs 97.png'],
    stock: 26,
    sku: 'RC-TB-010',
    features: ['Advanced cleaning head', 'Container included', 'Premium design', 'Hygienic'],
    ingredients: ['Advanced bristles', 'Container holder'],
    usage: 'Premium toilet cleaning with storage',
    weight: '380g',
    isActive: true
  },
  {
    name: 'Standard Container Brush',
    description: 'Standard container brush for toilet cleaning',
    price: 97,
    mrp: 120,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/91. 8312 CONTAINER BRUSH-Rs 97.png'],
    stock: 24,
    sku: 'RC-TB-011',
    features: ['Standard design', 'Container included', 'Reliable', 'Hygienic storage'],
    ingredients: ['Standard bristles', 'Container holder'],
    usage: 'Standard toilet cleaning with storage',
    weight: '360g',
    isActive: true
  },
  {
    name: 'Double Hockey Jumbo',
    description: 'Double hockey jumbo toilet brush for large areas',
    price: 68,
    mrp: 85,
    category: 'Toilet Brushes',
    images: ['/images/TOILET_BRUSHES/double-hockey-jumbo-68.png'],
    stock: 30,
    sku: 'RC-TB-012',
    features: ['Jumbo size', 'Double hockey', 'Large area coverage', 'Professional'],
    ingredients: ['Professional bristles', 'Extended handle'],
    usage: 'Large area toilet cleaning',
    weight: '320g',
    isActive: true
  },

  // CARPET BRUSHES - All products from CARPET_BRUSHES folder (2 products)
  {
    name: 'New Carpet Brush',
    description: 'New model carpet brush for deep carpet cleaning',
    price: 68,
    mrp: 85,
    category: 'Carpet Brushes',
    images: ['/images/CARPET_BRUSHES/113. NEW CARPET BRUSH 1511-Rs 68.png'],
    stock: 35,
    sku: 'RC-CB-001',
    features: ['New model', 'Deep cleaning', 'Carpet specialist', 'Effective bristles'],
    ingredients: ['Specialized bristles', 'Ergonomic handle'],
    usage: 'Deep carpet and upholstery cleaning',
    weight: '600g',
    isActive: true
  },
  {
    name: 'Avon Carpet Brush',
    description: 'Premium Avon carpet brush for professional cleaning',
    price: 127,
    mrp: 160,
    category: 'Carpet Brushes',
    images: ['/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307)-Rs 127.png'],
    stock: 22,
    sku: 'RC-CB-002',
    features: ['Premium quality', 'Professional grade', 'Avon brand', 'Superior cleaning'],
    ingredients: ['Professional bristles', 'Quality handle'],
    usage: 'Professional carpet cleaning',
    weight: '800g',
    isActive: true,
    isFeatured: true
  },

  // LONG BRUSHES - All products from LONG_BRUSHES folder (11 products)
  {
    name: 'THK Long Brush 140A',
    description: 'THK long brush for extended reach cleaning',
    price: 111,
    mrp: 140,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/123. THK 140 A-Rs 111.png'],
    stock: 28,
    sku: 'RC-LB-001',
    features: ['Extended reach', 'THK quality', 'Professional grade', '140cm length'],
    ingredients: ['Professional bristles', 'Extended handle'],
    usage: 'High reach and extended area cleaning',
    weight: '900g',
    isActive: true
  },
  {
    name: 'THK 140 Long Brush',
    description: 'THK 140 model long brush for professional use',
    price: 111,
    mrp: 140,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/123. THK 140-Rs 111.png'],
    stock: 25,
    sku: 'RC-LB-002',
    features: ['Professional use', 'THK brand', '140cm reach', 'Durable construction'],
    ingredients: ['Professional bristles', 'Reinforced handle'],
    usage: 'Professional extended reach cleaning',
    weight: '850g',
    isActive: true
  },
  {
    name: 'SPL Hardy Set Big A',
    description: 'Special hardy set big for heavy-duty cleaning',
    price: 288,
    mrp: 360,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG A-Rs 288.png'],
    stock: 15,
    sku: 'RC-LB-003',
    features: ['Heavy-duty', 'Special hardy', 'Big size', 'Professional set'],
    ingredients: ['Hardy bristles', 'Reinforced construction'],
    usage: 'Heavy-duty commercial cleaning',
    weight: '1200g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'SPL Hardy Set Big Standard',
    description: 'Standard SPL hardy set big for commercial cleaning',
    price: 288,
    mrp: 360,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG-Rs 288.png'],
    stock: 18,
    sku: 'RC-LB-004',
    features: ['Commercial grade', 'Standard hardy', 'Big size', 'Reliable'],
    ingredients: ['Hardy bristles', 'Commercial handle'],
    usage: 'Commercial and industrial cleaning',
    weight: '1150g',
    isActive: true
  },
  {
    name: 'SPL Hardy Set',
    description: 'SPL hardy set for regular long brush cleaning',
    price: 229,
    mrp: 285,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/81. 9965 SPL HARDY SET-Rs 229.png'],
    stock: 20,
    sku: 'RC-LB-005',
    features: ['Hardy construction', 'Regular size', 'SPL quality', 'Versatile'],
    ingredients: ['Hardy bristles', 'Standard handle'],
    usage: 'Regular extended reach cleaning',
    weight: '1000g',
    isActive: true
  },
  {
    name: 'SPL Hardy Set A',
    description: 'SPL hardy set A variant for versatile cleaning',
    price: 229,
    mrp: 285,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/81. 9965SPL HARDY SET A-Rs 229.png'],
    stock: 22,
    sku: 'RC-LB-006',
    features: ['Versatile cleaning', 'Hardy set A', 'SPL brand', 'Professional'],
    ingredients: ['Hardy bristles', 'Professional handle'],
    usage: 'Versatile professional cleaning',
    weight: '1050g',
    isActive: true
  },
  {
    name: 'Gala Static Brush',
    description: 'Gala static brush for anti-static cleaning',
    price: 222,
    mrp: 275,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/84. GALA STATIC BRUSH-Rs 222.png'],
    stock: 19,
    sku: 'RC-LB-007',
    features: ['Anti-static', 'Gala brand', 'Static control', 'Specialized'],
    ingredients: ['Anti-static bristles', 'Insulated handle'],
    usage: 'Anti-static cleaning applications',
    weight: '950g',
    isActive: true
  },
  {
    name: 'Gala Static Brush A',
    description: 'Gala static brush A model for enhanced cleaning',
    price: 222,
    mrp: 275,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/84. GALA STATIS BRUSH A-Rs 222.png'],
    stock: 21,
    sku: 'RC-LB-008',
    features: ['Enhanced cleaning', 'Static brush A', 'Gala quality', 'Professional'],
    ingredients: ['Enhanced bristles', 'Professional handle'],
    usage: 'Enhanced anti-static cleaning',
    weight: '980g',
    isActive: true
  },
  {
    name: 'Lady Dream Soft Brush Set',
    description: 'Lady Dream soft brush set for gentle cleaning',
    price: 185,
    mrp: 230,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/LADY DREAM softbrush set-Photoroom.png'],
    stock: 16,
    sku: 'RC-LB-009',
    features: ['Soft brushes', 'Lady Dream', 'Gentle cleaning', 'Set included'],
    ingredients: ['Soft bristles', 'Comfortable handle'],
    usage: 'Gentle extended reach cleaning',
    weight: '800g',
    isActive: true
  },
  {
    name: 'Fancy Broom',
    description: 'Decorative fancy broom with cleaning functionality',
    price: 155,
    mrp: 195,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/fancy broom-Photoroom.png'],
    stock: 24,
    sku: 'RC-LB-010',
    features: ['Decorative design', 'Fancy appearance', 'Functional', 'Stylish'],
    ingredients: ['Decorative bristles', 'Stylish handle'],
    usage: 'Decorative and functional cleaning',
    weight: '700g',
    isActive: true
  },
  {
    name: 'Soft Brush',
    description: 'Gentle soft brush for delicate surface cleaning',
    price: 135,
    mrp: 170,
    category: 'Long Brushes',
    images: ['/images/LONG_BRUSHES/soft brush-Photoroom.png'],
    stock: 27,
    sku: 'RC-LB-011',
    features: ['Gentle cleaning', 'Soft bristles', 'Delicate surfaces', 'Extended reach'],
    ingredients: ['Soft bristles', 'Lightweight handle'],
    usage: 'Delicate surface extended cleaning',
    weight: '650g',
    isActive: true
  },

  // SINK BRUSHES - All products from SINK_BRUSHES folder (9 products)
  {
    name: 'Supreme Sink Square',
    description: 'Supreme sink square brush for kitchen cleaning',
    price: 57,
    mrp: 72,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG'],
    stock: 40,
    sku: 'RC-SB-001',
    features: ['Square design', 'Supreme quality', 'Kitchen specialist', 'Ergonomic'],
    ingredients: ['Kitchen-safe bristles', 'Ergonomic handle'],
    usage: 'Kitchen sink and utensil cleaning',
    weight: '150g',
    isActive: true
  },
  {
    name: 'Sink Brush 2381 A',
    description: 'Model 2381 A sink brush for efficient cleaning',
    price: 38,
    mrp: 48,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/108. 2381 SINK BRUSH A-Rs 38.png'],
    stock: 45,
    sku: 'RC-SB-002',
    features: ['Model 2381 A', 'Efficient cleaning', 'Standard design', 'Reliable'],
    ingredients: ['Standard bristles', 'Comfortable handle'],
    usage: 'Standard sink cleaning',
    weight: '120g',
    isActive: true
  },
  {
    name: 'Sink Brush 2381',
    description: 'Standard 2381 sink brush for daily use',
    price: 38,
    mrp: 48,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png'],
    stock: 48,
    sku: 'RC-SB-003',
    features: ['Standard model', 'Daily use', 'Affordable', 'Practical'],
    ingredients: ['Standard bristles', 'Basic handle'],
    usage: 'Daily sink cleaning',
    weight: '110g',
    isActive: true
  },
  {
    name: 'Sink Brush 4D Square',
    description: '4D square sink brush for multi-dimensional cleaning',
    price: 68,
    mrp: 85,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/114. SINK BRUSH 4D SQUARE-Rs 68.png'],
    stock: 32,
    sku: 'RC-SB-004',
    features: ['4D design', 'Square shape', 'Multi-dimensional', 'Advanced cleaning'],
    ingredients: ['4D bristles', 'Ergonomic handle'],
    usage: 'Advanced sink cleaning',
    weight: '180g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sink Brush 1807 A',
    description: 'Model 1807 A sink brush with ergonomic design',
    price: 39,
    mrp: 50,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/120. SINK BRUSH 1807 A-Rs 39.png'],
    stock: 42,
    sku: 'RC-SB-005',
    features: ['Model 1807 A', 'Ergonomic design', 'Comfortable grip', 'Efficient'],
    ingredients: ['Quality bristles', 'Ergonomic handle'],
    usage: 'Ergonomic sink cleaning',
    weight: '130g',
    isActive: true
  },
  {
    name: 'Sink Brush 1807',
    description: 'Standard 1807 sink brush for kitchen use',
    price: 39,
    mrp: 50,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/120. SINK BRUSH 1807-Rs 39.png'],
    stock: 44,
    sku: 'RC-SB-006',
    features: ['Standard 1807', 'Kitchen use', 'Reliable', 'Practical'],
    ingredients: ['Kitchen bristles', 'Standard handle'],
    usage: 'Kitchen sink cleaning',
    weight: '120g',
    isActive: true
  },
  {
    name: 'Sink Brush 1103',
    description: 'Budget-friendly 1103 sink brush',
    price: 18,
    mrp: 25,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/205. 1103 SINK BRUSH Rs 18.png'],
    stock: 60,
    sku: 'RC-SB-007',
    features: ['Budget-friendly', 'Basic model', 'Affordable', 'Essential'],
    ingredients: ['Basic bristles', 'Simple handle'],
    usage: 'Budget sink cleaning',
    weight: '80g',
    isActive: true
  },
  {
    name: 'New Sink Brush 712',
    description: 'New model 712 sink brush for improved cleaning',
    price: 38,
    mrp: 48,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/97. 712 NEW SINK BRUSH Rs 38.JPG'],
    stock: 38,
    sku: 'RC-SB-008',
    features: ['New model 712', 'Improved cleaning', 'Enhanced design', 'Better performance'],
    ingredients: ['Improved bristles', 'Enhanced handle'],
    usage: 'Enhanced sink cleaning',
    weight: '140g',
    isActive: true
  },
  {
    name: 'Neo Sink Brush',
    description: 'Modern Neo sink brush with advanced bristles',
    price: 48,
    mrp: 60,
    category: 'Sink Brushes',
    images: ['/images/SINK_BRUSHES/99. NEO SINK BRUSH-Rs 48.png'],
    stock: 35,
    sku: 'RC-SB-009',
    features: ['Modern Neo design', 'Advanced bristles', 'Contemporary', 'High performance'],
    ingredients: ['Advanced bristles', 'Modern handle'],
    usage: 'Modern sink cleaning',
    weight: '160g',
    isActive: true
  },

  // COBWEB CLEANERS - All products from COBWEB_CLEANERS folder (4 products)
  {
    name: 'Cobweb Sunflower Outer Lock',
    description: 'Cobweb sunflower cleaner with outer lock mechanism',
    price: 95,
    mrp: 120,
    category: 'Cobweb Cleaners',
    images: ['/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png'],
    stock: 25,
    sku: 'RC-CC-001',
    features: ['Sunflower design', 'Outer lock', 'Secure mechanism', 'Extended reach'],
    ingredients: ['Flexible bristles', 'Locking handle'],
    usage: 'High ceiling cobweb removal',
    weight: '400g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Cobweb Cleaner Flat',
    description: 'Flat design cobweb cleaner for tight spaces',
    price: 75,
    mrp: 95,
    category: 'Cobweb Cleaners',
    images: ['/images/COBWEB_CLEANERS/cob web cleaner - flat-Photoroom.png'],
    stock: 30,
    sku: 'RC-CC-002',
    features: ['Flat design', 'Tight spaces', 'Compact', 'Maneuverable'],
    ingredients: ['Flat bristles', 'Compact handle'],
    usage: 'Tight space cobweb cleaning',
    weight: '350g',
    isActive: true
  },
  {
    name: 'Cobweb Flat Cleaner',
    description: 'Specialized flat cobweb cleaner for corners',
    price: 78,
    mrp: 98,
    category: 'Cobweb Cleaners',
    images: ['/images/COBWEB_CLEANERS/cobweb flat-Photoroom.png'],
    stock: 28,
    sku: 'RC-CC-003',
    features: ['Specialized flat', 'Corner cleaning', 'Precision design', 'Effective'],
    ingredients: ['Specialized bristles', 'Precision handle'],
    usage: 'Corner and crevice cobweb removal',
    weight: '380g',
    isActive: true
  },
  {
    name: 'Cobweb Sunflower Cleaner',
    description: 'Sunflower design cobweb cleaner for efficient removal',
    price: 88,
    mrp: 110,
    category: 'Cobweb Cleaners',
    images: ['/images/COBWEB_CLEANERS/cobweb sunflower-Photoroom.png'],
    stock: 32,
    sku: 'RC-CC-004',
    features: ['Sunflower design', 'Efficient removal', 'Attractive design', 'Professional'],
    ingredients: ['Sunflower bristles', 'Professional handle'],
    usage: 'Professional cobweb removal',
    weight: '420g',
    isActive: true
  },

  // CLEANING CHEMICALS - Original products
  {
    name: 'Rose Toilet Bowl Cleaner',
    description: 'Professional strength toilet bowl cleaner with fresh rose fragrance. Removes tough stains and kills 99.9% of germs.',
    price: 299,
    mrp: 399,
    category: 'Bathroom Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 150,
    sku: 'RC-TC-001',
    features: ['Kills 99.9% germs', 'Fresh rose fragrance', 'Removes tough stains', 'Safe for septic tanks'],
    ingredients: ['Hydrochloric Acid (9%)', 'Surfactants', 'Fragrance', 'Colorant'],
    usage: 'Apply under rim and bowl surfaces. Let sit for 5 minutes. Scrub and flush.',
    weight: '500ml',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Bathroom Tile Cleaner',
    description: 'Powerful tile and grout cleaner that removes soap scum, mildew, and hard water stains.',
    price: 249,
    mrp: 329,
    category: 'Bathroom Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 200,
    sku: 'RC-BTC-002',
    features: ['Removes soap scum', 'Anti-mildew formula', 'Safe on all tiles', 'No harsh fumes'],
    ingredients: ['Citric Acid', 'Surfactants', 'Anti-fungal agents', 'Fragrance'],
    usage: 'Spray on surface, wait 2-3 minutes, scrub and rinse thoroughly.',
    weight: '750ml',
    isActive: true
  },
  {
    name: 'Rose Degreaser Pro',
    description: 'Heavy-duty kitchen degreaser for stovetops, ovens, and exhaust fans. Cuts through grease instantly.',
    price: 349,
    mrp: 449,
    category: 'Kitchen Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 100,
    sku: 'RC-KD-003',
    features: ['Instant grease cutting', 'Safe on surfaces', 'Pleasant fragrance', 'Biodegradable'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Emulsifiers', 'Fragrance'],
    usage: 'Spray on greasy surface, let sit for 30 seconds, wipe clean with cloth.',
    weight: '500ml',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Dish Wash Liquid',
    description: 'Concentrated dishwashing liquid with advanced grease-cutting formula and gentle on hands.',
    price: 129,
    mrp: 179,
    category: 'Kitchen Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 300,
    sku: 'RC-DW-004',
    features: ['Concentrated formula', 'Gentle on hands', 'Fresh fragrance', 'Long lasting'],
    ingredients: ['Linear Alkyl Benzene Sulphonate', 'Coconut Oil', 'Glycerin', 'Fragrance'],
    usage: 'Add 2-3 drops to water. Wash dishes and rinse thoroughly.',
    weight: '1L',
    isActive: true
  },
  {
    name: 'Rose Multi-Surface Floor Cleaner',
    description: 'All-in-one floor cleaner suitable for tiles, marble, granite, and wooden floors.',
    price: 199,
    mrp: 249,
    category: 'Floor Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 180,
    sku: 'RC-FC-005',
    features: ['Multi-surface safe', 'No streaks', 'Quick drying', 'Pleasant fragrance'],
    ingredients: ['Isopropyl Alcohol', 'Surfactants', 'Fragrance', 'Colorant'],
    usage: 'Mix 50ml in 1 bucket of water. Mop floor and let air dry.',
    weight: '1L',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Crystal Glass Cleaner',
    description: 'Streak-free glass cleaner for windows, mirrors, and glass surfaces.',
    price: 149,
    mrp: 199,
    category: 'Glass Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 250,
    sku: 'RC-GC-006',
    features: ['Streak-free shine', 'Quick drying', 'Ammonia-free', 'Safe for tinted glass'],
    ingredients: ['Isopropyl Alcohol', 'Surfactants', 'Vinegar', 'Fragrance'],
    usage: 'Spray on glass surface, wipe with clean cloth for streak-free shine.',
    weight: '500ml',
    isActive: true
  },
  {
    name: 'Rose Multi-Purpose Disinfectant',
    description: 'Hospital-grade disinfectant that kills 99.99% of bacteria and viruses.',
    price: 279,
    mrp: 349,
    category: 'Disinfectants',
    images: ['/images/placeholder-product.png'],
    stock: 120,
    sku: 'RC-MPD-007',
    features: ['Kills 99.99% germs', 'Hospital grade', 'Multi-surface safe', 'Long-lasting protection'],
    ingredients: ['Benzalkonium Chloride', 'Isopropyl Alcohol', 'Surfactants', 'Fragrance'],
    usage: 'Spray on surface, let sit for 30 seconds, wipe clean or let air dry.',
    weight: '750ml',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Heavy Duty Cleaner',
    description: 'Industrial strength cleaner for heavy-duty cleaning applications.',
    price: 599,
    mrp: 749,
    category: 'Industrial Cleaners',
    images: ['/images/placeholder-product.png'],
    stock: 80,
    sku: 'RC-HDC-008',
    features: ['Industrial strength', 'Concentrated formula', 'Multi-purpose', 'Cost effective'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Chelating agents', 'Stabilizers'],
    usage: 'Dilute as per requirement. Apply, scrub if needed, and rinse thoroughly.',
    weight: '1L',
    isActive: true
  }
];

const adminUser = {
  name: 'Rose Chemicals Admin',
  email: 'admin@rosechemicals.com',
  password: 'Admin@123',
  role: 'admin',
  isEmailVerified: true
};

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories seeded`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Seed products
const seedProducts = async (categoriesMap) => {
  try {
    await Product.deleteMany({});
    
    // Map category names to IDs
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoriesMap[product.category]
    }));
    
    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ ${createdProducts.length} products seeded`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Don't manually hash - let the User model's pre-save hook handle it
    const admin = new User({
      ...adminUser
    });

    await admin.save();
    console.log('✅ Admin user created');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    return admin;
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDatabase();
    
    // Seed categories first
    const createdCategories = await seedCategories();
    
    // Create category name to ID mapping
    const categoriesMap = {};
    createdCategories.forEach(category => {
      categoriesMap[category.name] = category._id;
    });
    
    // Seed products with category references
    await seedProducts(categoriesMap);
    
    // Seed admin user
    await seedAdmin();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Login as admin with: admin@rosechemicals.com / Admin@123');
    console.log('3. Visit the frontend to see all products');
    
    // Don't exit process when called from server.js
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
