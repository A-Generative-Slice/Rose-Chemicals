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
  },
  {
    name: 'Other',
    description: 'Other cleaning products and accessories',
    slug: 'other',
    image: '/images/categories/other.jpg'
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
    images: [{ url: '/images/BROOMS/164. DELUX NICE BROOM 115.png', key: '164. DELUX NICE BROOM 115', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/166. SITARA BROOM- 84.png', key: '166. SITARA BROOM- 84', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/167. SUPRIYA NICE BROOM 115.png', key: '167. SUPRIYA NICE BROOM 115', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/168. CAMEL RED - 65.png', key: '168. CAMEL RED - 65', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/169. SHINE RED- 74.png', key: '169. SHINE RED- 74', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/171. PINKY RED BROOM - 78.png', key: '171. PINKY RED BROOM - 78', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/172. PINKY BLUE BROOM-78.png', key: '172. PINKY BLUE BROOM-78', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/173. JUMBO RED BROOM-129.png', key: '173. JUMBO RED BROOM-129', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/174. AMIL RED BROOM- 98.png', key: '174. AMIL RED BROOM- 98', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/180. MR.CLEAN- 50.png', key: '180. MR.CLEAN- 50', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/183. AMIL BLUE NICE BROOM 95.png', key: '183. AMIL BLUE NICE BROOM 95', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/183. TULSI GREEN COVER BROOM-109.png', key: '183. TULSI GREEN COVER BROOM-109', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/184&185Chennai Broom Small & Big- 73 - 88.png', key: '184&185Chennai Broom Small & Big- 73 - 88', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/185. chennai burma cover- 93.png', key: '185. chennai burma cover- 93', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/186. Lady Dream Plastic - 111.png', key: '186. Lady Dream Plastic - 111', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/188. chennai burma plastic- 88.png', key: '188. chennai burma plastic- 88', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/BROOMS/lady dream soft brush-Photoroom.png', key: 'lady dream soft brush-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/107. 5500 KEETAL BRUSH-Rs 30.png', key: '107. 5500 KEETAL BRUSH-Rs 30', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/119. NEW CONTAINER BRUSH 1642-Rs 141.png', key: '119. NEW CONTAINER BRUSH 1642-Rs 141', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/122. THK 1108-Rs 68.png', key: '122. THK 1108-Rs 68', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png', key: '201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41.png', key: '213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39.png', key: '214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48.png', key: '215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68.png', key: '218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png', key: '85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/91. 8312 CONTAINER BRUSH A-Rs 97.png', key: '91. 8312 CONTAINER BRUSH A-Rs 97', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/91. 8312 CONTAINER BRUSH-Rs 97.png', key: '91. 8312 CONTAINER BRUSH-Rs 97', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/TOILET_BRUSHES/double-hockey-jumbo-68.png', key: 'double-hockey-jumbo-68', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/CARPET_BRUSHES/113. NEW CARPET BRUSH 1511-Rs 68.png', key: '113. NEW CARPET BRUSH 1511-Rs 68', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307)-Rs 127.png', key: '83. AVON CARPER BRUSH (307)-Rs 127', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/123. THK 140 A-Rs 111.png', key: '123. THK 140 A-Rs 111', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/123. THK 140-Rs 111.png', key: '123. THK 140-Rs 111', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG A-Rs 288.png', key: '80. 9967 SPL HARDY SET BIG A-Rs 288', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG-Rs 288.png', key: '80. 9967 SPL HARDY SET BIG-Rs 288', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/81. 9965 SPL HARDY SET-Rs 229.png', key: '81. 9965 SPL HARDY SET-Rs 229', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/81. 9965SPL HARDY SET A-Rs 229.png', key: '81. 9965SPL HARDY SET A-Rs 229', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/84. GALA STATIC BRUSH-Rs 222.png', key: '84. GALA STATIC BRUSH-Rs 222', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/84. GALA STATIS BRUSH A-Rs 222.png', key: '84. GALA STATIS BRUSH A-Rs 222', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/LADY DREAM softbrush set-Photoroom.png', key: 'LADY DREAM softbrush set-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/fancy broom-Photoroom.png', key: 'fancy broom-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/LONG_BRUSHES/soft brush-Photoroom.png', key: 'soft brush-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG', key: '100. SUPREME SINK SQUIRE Rs 57', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/108. 2381 SINK BRUSH A-Rs 38.png', key: '108. 2381 SINK BRUSH A-Rs 38', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png', key: '108. 2381 SINK BRUSH- Rs 38', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/114. SINK BRUSH 4D SQUARE-Rs 68.png', key: '114. SINK BRUSH 4D SQUARE-Rs 68', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/120. SINK BRUSH 1807 A-Rs 39.png', key: '120. SINK BRUSH 1807 A-Rs 39', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/120. SINK BRUSH 1807-Rs 39.png', key: '120. SINK BRUSH 1807-Rs 39', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/205. 1103 SINK BRUSH Rs 18.png', key: '205. 1103 SINK BRUSH Rs 18', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/97. 712 NEW SINK BRUSH Rs 38.JPG', key: '97. 712 NEW SINK BRUSH Rs 38', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/SINK_BRUSHES/99. NEO SINK BRUSH-Rs 48.png', key: '99. NEO SINK BRUSH-Rs 48', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png', key: '219. cobweb sunflower-outer-lock', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/COBWEB_CLEANERS/cob web cleaner - flat-Photoroom.png', key: 'cob web cleaner - flat-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/COBWEB_CLEANERS/cobweb flat-Photoroom.png', key: 'cobweb flat-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/COBWEB_CLEANERS/cobweb sunflower-Photoroom.png', key: 'cobweb sunflower-Photoroom', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
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
    images: [{ url: '/images/placeholder-product.png', key: 'placeholder-product', alt: '', isPrimary: true }],
    stock: 80,
    sku: 'RC-HDC-008',
    features: ['Industrial strength', 'Concentrated formula', 'Multi-purpose', 'Cost effective'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Chelating agents', 'Stabilizers'],
    usage: 'Dilute as per requirement. Apply, scrub if needed, and rinse thoroughly.',
    weight: '1L',
    isActive: true
  }
  ,
  {
    "name": "Acetic Acid",
    "description": "Acetic Acid - High quality cleaning product",
    "price": 170,
    "mrp": 190,
    "category": "Bathroom Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/1. Acetic Acid - Rs 170.webp",
        "key": "1. Acetic Acid - Rs 170",
        "alt": "Acetic Acid",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-1",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "cocamidopropyl betaine CAPB",
    "description": "cocamidopropyl betaine CAPB - High quality cleaning product",
    "price": 163,
    "mrp": 183,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/10. cocamidopropyl-betaine-CAPB - RS 163.webp",
        "key": "10. cocamidopropyl-betaine-CAPB - RS 163",
        "alt": "cocamidopropyl betaine CAPB",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-2",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SUPREME SINK SQUIRE",
    "description": "SUPREME SINK SQUIRE - High quality cleaning product",
    "price": 57,
    "mrp": 77,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/100. SUPREME SINK SQUIRE Rs 57.JPG",
        "key": "100. SUPREME SINK SQUIRE Rs 57",
        "alt": "SUPREME SINK SQUIRE",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-3",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MAGIC SPONGE",
    "description": "MAGIC SPONGE - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/101. MAGIC SPONGE-Rs 68.png",
        "key": "101. MAGIC SPONGE-Rs 68",
        "alt": "MAGIC SPONGE",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-4",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "8201 WHITE IRON BRUSH",
    "description": "8201 WHITE IRON BRUSH - High quality cleaning product",
    "price": 52,
    "mrp": 72,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/102. 8201 WHITE IRON BRUSH-Rs 52.png",
        "key": "102. 8201 WHITE IRON BRUSH-Rs 52",
        "alt": "8201 WHITE IRON BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-5",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SUPREEM IRON BRUSH",
    "description": "SUPREEM IRON BRUSH - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/103. SUPREEM IRON BRUSH-Rs 68.png",
        "key": "103. SUPREEM IRON BRUSH-Rs 68",
        "alt": "SUPREEM IRON BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-6",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "BLACK IRON BRUSH",
    "description": "BLACK IRON BRUSH - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/104. BLACK IRON BRUSH-Rs 68.png",
        "key": "104. BLACK IRON BRUSH-Rs 68",
        "alt": "BLACK IRON BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-7",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SAMARTHYA A1 KITCHEN WIPER",
    "description": "SAMARTHYA A1 KITCHEN WIPER - High quality cleaning product",
    "price": 45,
    "mrp": 65,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/105. SAMARTHYA A1 KITCHEN WIPER Rs 45.JPG",
        "key": "105. SAMARTHYA A1 KITCHEN WIPER Rs 45",
        "alt": "SAMARTHYA A1 KITCHEN WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-8",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MURAM WITH BRUSH 109 SMALL",
    "description": "MURAM WITH BRUSH 109 SMALL - High quality cleaning product",
    "price": 29,
    "mrp": 49,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/106. MURAM WITH BRUSH 109 SMALL-Rs 29.png",
        "key": "106. MURAM WITH BRUSH 109 SMALL-Rs 29",
        "alt": "MURAM WITH BRUSH 109 SMALL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-9",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "5500 KEETAL BRUSH",
    "description": "5500 KEETAL BRUSH - High quality cleaning product",
    "price": 30,
    "mrp": 50,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/107. 5500 KEETAL BRUSH-Rs 30.png",
        "key": "107. 5500 KEETAL BRUSH-Rs 30",
        "alt": "5500 KEETAL BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-10",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "2381 SINK BRUSH A",
    "description": "2381 SINK BRUSH A - High quality cleaning product",
    "price": 38,
    "mrp": 58,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/108. 2381 SINK BRUSH A-Rs 38.png",
        "key": "108. 2381 SINK BRUSH A-Rs 38",
        "alt": "2381 SINK BRUSH A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-11",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "2381 SINK BRUSH",
    "description": "2381 SINK BRUSH - High quality cleaning product",
    "price": 38,
    "mrp": 58,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/108. 2381 SINK BRUSH- Rs 38.png",
        "key": "108. 2381 SINK BRUSH- Rs 38",
        "alt": "2381 SINK BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-12",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MINI DUSTER SPL 43 GM",
    "description": "MINI DUSTER SPL 43 GM - High quality cleaning product",
    "price": 43,
    "mrp": 63,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/109. MINI DUSTER SPL 43 GM-Rs 43.png",
        "key": "109. MINI DUSTER SPL 43 GM-Rs 43",
        "alt": "MINI DUSTER SPL 43 GM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-13",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "NEW CARPET BRUSH 1511",
    "description": "NEW CARPET BRUSH 1511 - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Carpet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/113. NEW CARPET BRUSH 1511-Rs 68.png",
        "key": "113. NEW CARPET BRUSH 1511-Rs 68",
        "alt": "NEW CARPET BRUSH 1511",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-14",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SINK BRUSH 4D SQUARE",
    "description": "SINK BRUSH 4D SQUARE - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/114. SINK BRUSH 4D SQUARE-Rs 68.png",
        "key": "114. SINK BRUSH 4D SQUARE-Rs 68",
        "alt": "SINK BRUSH 4D SQUARE",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-15",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "6606 CLOTH BRUSH",
    "description": "6606 CLOTH BRUSH - High quality cleaning product",
    "price": 50,
    "mrp": 70,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/116. 6606 CLOTH BRUSH-Rs 50.png",
        "key": "116. 6606 CLOTH BRUSH-Rs 50",
        "alt": "6606 CLOTH BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-16",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SILVER POLISH",
    "description": "SILVER POLISH - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/117. SILVER POLISH-Rs 68.png",
        "key": "117. SILVER POLISH-Rs 68",
        "alt": "SILVER POLISH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-17",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "METAL POLISH",
    "description": "METAL POLISH - High quality cleaning product",
    "price": 111,
    "mrp": 131,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/118. METAL POLISH-Rs 111.png",
        "key": "118. METAL POLISH-Rs 111",
        "alt": "METAL POLISH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-18",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "NEW CONTAINER BRUSH 1642",
    "description": "NEW CONTAINER BRUSH 1642 - High quality cleaning product",
    "price": 141,
    "mrp": 161,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/119. NEW CONTAINER BRUSH 1642-Rs 141.png",
        "key": "119. NEW CONTAINER BRUSH 1642-Rs 141",
        "alt": "NEW CONTAINER BRUSH 1642",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-19",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SINK BRUSH 1807 A",
    "description": "SINK BRUSH 1807 A - High quality cleaning product",
    "price": 39,
    "mrp": 59,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/120. SINK BRUSH 1807 A-Rs 39.png",
        "key": "120. SINK BRUSH 1807 A-Rs 39",
        "alt": "SINK BRUSH 1807 A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-20",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SINK BRUSH 1807",
    "description": "SINK BRUSH 1807 - High quality cleaning product",
    "price": 39,
    "mrp": 59,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/120. SINK BRUSH 1807-Rs 39.png",
        "key": "120. SINK BRUSH 1807-Rs 39",
        "alt": "SINK BRUSH 1807",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-21",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "FRIDGE COVER",
    "description": "FRIDGE COVER - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/121. FRIDGE COVER-Rs 68.png",
        "key": "121. FRIDGE COVER-Rs 68",
        "alt": "FRIDGE COVER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-22",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "THK 1108",
    "description": "THK 1108 - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/122. THK 1108-Rs 68.png",
        "key": "122. THK 1108-Rs 68",
        "alt": "THK 1108",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-23",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "THK 140 A",
    "description": "THK 140 A - High quality cleaning product",
    "price": 111,
    "mrp": 131,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/123. THK 140 A-Rs 111.png",
        "key": "123. THK 140 A-Rs 111",
        "alt": "THK 140 A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-24",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "THK 140",
    "description": "THK 140 - High quality cleaning product",
    "price": 111,
    "mrp": 131,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/123. THK 140-Rs 111.png",
        "key": "123. THK 140-Rs 111",
        "alt": "THK 140",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-25",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "METAL PAD",
    "description": "METAL PAD - High quality cleaning product",
    "price": 11,
    "mrp": 31,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/124. METAL PAD-Rs 11.png",
        "key": "124. METAL PAD-Rs 11",
        "alt": "METAL PAD",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-26",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "CLEANING TOWEL",
    "description": "CLEANING TOWEL - High quality cleaning product",
    "price": 59,
    "mrp": 79,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/125. CLEANING TOWEL-Rs 59.png",
        "key": "125. CLEANING TOWEL-Rs 59",
        "alt": "CLEANING TOWEL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-27",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "HPMC",
    "description": "HPMC - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/14. HPMC - RS.jpg",
        "key": "14. HPMC - RS",
        "alt": "HPMC",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-28",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "HPMC",
    "description": "HPMC - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/14. HPMC - RS.webp",
        "key": "14. HPMC - RS",
        "alt": "HPMC",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-29",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "FEATHER DUSTER SMALL",
    "description": "FEATHER DUSTER SMALL - High quality cleaning product",
    "price": 49,
    "mrp": 69,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/147 FEATHER DUSTER SMALL  RS49.JPG",
        "key": "147 FEATHER DUSTER SMALL  RS49",
        "alt": "FEATHER DUSTER SMALL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-30",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "FEATHER DUSTER SMALL",
    "description": "FEATHER DUSTER SMALL - High quality cleaning product",
    "price": 49,
    "mrp": 69,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/147 FEATHER DUSTER SMALL RS49.jpg",
        "key": "147 FEATHER DUSTER SMALL RS49",
        "alt": "FEATHER DUSTER SMALL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-31",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SN937",
    "description": "SN937 - High quality cleaning product",
    "price": 250,
    "mrp": 270,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/15. SN937 RS 250.webp",
        "key": "15. SN937 RS 250",
        "alt": "SN937",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-32",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SN937",
    "description": "SN937 - High quality cleaning product",
    "price": 251,
    "mrp": 271,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/15. SN937 RS 251.jpeg",
        "key": "15. SN937 RS 251",
        "alt": "SN937",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-33",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "VENUS FLOOR WIPER 18 INCH",
    "description": "VENUS FLOOR WIPER 18 INCH - High quality cleaning product",
    "price": 104,
    "mrp": 124,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/150. VENUS FLOOR WIPER 18 INCH- rs104.png",
        "key": "150. VENUS FLOOR WIPER 18 INCH- rs104",
        "alt": "VENUS FLOOR WIPER 18 INCH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-34",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GLASS WIPER",
    "description": "GLASS WIPER - High quality cleaning product",
    "price": 26,
    "mrp": 46,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/154 GLASS WIPER RS26.JPG",
        "key": "154 GLASS WIPER RS26",
        "alt": "GLASS WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-35",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GLASS WIPERRS26",
    "description": "GLASS WIPERRS26 - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/154 GLASS WIPERRS26.JPG",
        "key": "154 GLASS WIPERRS26",
        "alt": "GLASS WIPERRS26",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-36",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IRONMAN 20 INCH WIPER",
    "description": "IRONMAN 20 INCH WIPER - High quality cleaning product",
    "price": 185,
    "mrp": 205,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/155.IRONMAN 20 INCH WIPER- rs 185.JPG",
        "key": "155.IRONMAN 20 INCH WIPER- rs 185",
        "alt": "IRONMAN 20 INCH WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-37",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GREEN PAD 10X15 (10PCS)",
    "description": "GREEN PAD 10X15 (10PCS) - High quality cleaning product",
    "price": 52,
    "mrp": 72,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/159 GREEN PAD 10X15 (10PCS) RS 52.JPG",
        "key": "159 GREEN PAD 10X15 (10PCS) RS 52",
        "alt": "GREEN PAD 10X15 (10PCS)",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-38",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "CDEA",
    "description": "CDEA - High quality cleaning product",
    "price": 111,
    "mrp": 131,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/16. CDEA - RS 111.avif",
        "key": "16. CDEA - RS 111",
        "alt": "CDEA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-39",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "CDEA",
    "description": "CDEA - High quality cleaning product",
    "price": 112,
    "mrp": 132,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/16. CDEA - RS 112.jpg",
        "key": "16. CDEA - RS 112",
        "alt": "CDEA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-40",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Cocamide Dea Detergent Cdea",
    "description": "Cocamide Dea Detergent Cdea - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/16. Cocamide-Dea-Detergent-Cdea.avif",
        "key": "16. Cocamide-Dea-Detergent-Cdea",
        "alt": "Cocamide Dea Detergent Cdea",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-41",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SS SCRUBBER PATTA",
    "description": "SS SCRUBBER PATTA - High quality cleaning product",
    "price": 60,
    "mrp": 80,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/160 SS SCRUBBER PATTA RS 60.JPG",
        "key": "160 SS SCRUBBER PATTA RS 60",
        "alt": "SS SCRUBBER PATTA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-42",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SS SCRUBBER PATTA",
    "description": "SS SCRUBBER PATTA - High quality cleaning product",
    "price": 65,
    "mrp": 85,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/160. SS SCRUBBER PATTA- rs 65.JPG",
        "key": "160. SS SCRUBBER PATTA- rs 65",
        "alt": "SS SCRUBBER PATTA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-43",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "PLASTIC SCRUBBER",
    "description": "PLASTIC SCRUBBER - High quality cleaning product",
    "price": 81,
    "mrp": 101,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/163 PLASTIC SCRUBBER RS81.JPG",
        "key": "163 PLASTIC SCRUBBER RS81",
        "alt": "PLASTIC SCRUBBER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-44",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "DELUX NICE BROOM",
    "description": "DELUX NICE BROOM - High quality cleaning product",
    "price": 115,
    "mrp": 135,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/164. DELUX NICE BROOM 115.png",
        "key": "164. DELUX NICE BROOM 115",
        "alt": "DELUX NICE BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-45",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SITARA BROOM",
    "description": "SITARA BROOM - High quality cleaning product",
    "price": 84,
    "mrp": 104,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/166. SITARA BROOM- 84.png",
        "key": "166. SITARA BROOM- 84",
        "alt": "SITARA BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-46",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SUPRIYA NICE BROOM",
    "description": "SUPRIYA NICE BROOM - High quality cleaning product",
    "price": 115,
    "mrp": 135,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/167. SUPRIYA NICE BROOM 115.png",
        "key": "167. SUPRIYA NICE BROOM 115",
        "alt": "SUPRIYA NICE BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-47",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "CAMEL RED",
    "description": "CAMEL RED - High quality cleaning product",
    "price": 65,
    "mrp": 85,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/168. CAMEL RED - 65.png",
        "key": "168. CAMEL RED - 65",
        "alt": "CAMEL RED",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-48",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SHINE RED",
    "description": "SHINE RED - High quality cleaning product",
    "price": 74,
    "mrp": 94,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/169. SHINE RED- 74.png",
        "key": "169. SHINE RED- 74",
        "alt": "SHINE RED",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-49",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "ROSANAM",
    "description": "ROSANAM - High quality cleaning product",
    "price": 100,
    "mrp": 120,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/17. ROSANAM - RS 100.webp",
        "key": "17. ROSANAM - RS 100",
        "alt": "ROSANAM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-50",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "ROSANAM",
    "description": "ROSANAM - High quality cleaning product",
    "price": 101,
    "mrp": 121,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/17. ROSANAM - RS 101.jpg",
        "key": "17. ROSANAM - RS 101",
        "alt": "ROSANAM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-51",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "PINKY RED BROOM",
    "description": "PINKY RED BROOM - High quality cleaning product",
    "price": 78,
    "mrp": 98,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/171. PINKY RED BROOM - 78.png",
        "key": "171. PINKY RED BROOM - 78",
        "alt": "PINKY RED BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-52",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "PINKY BLUE BROOM",
    "description": "PINKY BLUE BROOM - High quality cleaning product",
    "price": 78,
    "mrp": 98,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/172. PINKY BLUE BROOM-78.png",
        "key": "172. PINKY BLUE BROOM-78",
        "alt": "PINKY BLUE BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-53",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "JUMBO RED BROOM",
    "description": "JUMBO RED BROOM - High quality cleaning product",
    "price": 129,
    "mrp": 149,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/173. JUMBO RED BROOM-129.png",
        "key": "173. JUMBO RED BROOM-129",
        "alt": "JUMBO RED BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-54",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "AMIL RED BROOM",
    "description": "AMIL RED BROOM - High quality cleaning product",
    "price": 98,
    "mrp": 118,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/174. AMIL RED BROOM- 98.png",
        "key": "174. AMIL RED BROOM- 98",
        "alt": "AMIL RED BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-55",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MR.CLEAN",
    "description": "MR.CLEAN - High quality cleaning product",
    "price": 50,
    "mrp": 70,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/180. MR.CLEAN- 50.png",
        "key": "180. MR.CLEAN- 50",
        "alt": "MR.CLEAN",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-56",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "AMIL BLUE NICE BROOM",
    "description": "AMIL BLUE NICE BROOM - High quality cleaning product",
    "price": 95,
    "mrp": 115,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/183. AMIL BLUE NICE BROOM 95.png",
        "key": "183. AMIL BLUE NICE BROOM 95",
        "alt": "AMIL BLUE NICE BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-57",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "TULSI GREEN COVER BROOM",
    "description": "TULSI GREEN COVER BROOM - High quality cleaning product",
    "price": 109,
    "mrp": 129,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/183. TULSI GREEN COVER BROOM-109.png",
        "key": "183. TULSI GREEN COVER BROOM-109",
        "alt": "TULSI GREEN COVER BROOM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-58",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "chennai burma cover",
    "description": "chennai burma cover - High quality cleaning product",
    "price": 93,
    "mrp": 113,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/185. chennai burma cover- 93.png",
        "key": "185. chennai burma cover- 93",
        "alt": "chennai burma cover",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-59",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Lady Dream Plastic",
    "description": "Lady Dream Plastic - High quality cleaning product",
    "price": 111,
    "mrp": 131,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/186. Lady Dream Plastic - 111.png",
        "key": "186. Lady Dream Plastic - 111",
        "alt": "Lady Dream Plastic",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-60",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "chennai burma plastic",
    "description": "chennai burma plastic - High quality cleaning product",
    "price": 88,
    "mrp": 108,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/188. chennai burma plastic- 88.png",
        "key": "188. chennai burma plastic- 88",
        "alt": "chennai burma plastic",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-61",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "STP",
    "description": "STP - High quality cleaning product",
    "price": 121,
    "mrp": 141,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/2. STP RS 121.webp",
        "key": "2. STP RS 121",
        "alt": "STP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-62",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "1101 RICH LOOK   TOILET BRUSSINGLE HOCKY SMALL",
    "description": "1101 RICH LOOK   TOILET BRUSSINGLE HOCKY SMALL - High quality cleaning product",
    "price": 32,
    "mrp": 52,
    "category": "Toilet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png",
        "key": "201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32",
        "alt": "1101 RICH LOOK   TOILET BRUSSINGLE HOCKY SMALL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-63",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "1103 SINK BRUSH",
    "description": "1103 SINK BRUSH - High quality cleaning product",
    "price": 18,
    "mrp": 38,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/205 1103 SINK BRUSH RS18.jpg",
        "key": "205 1103 SINK BRUSH RS18",
        "alt": "1103 SINK BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-64",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "1103 SINK BRUSH",
    "description": "1103 SINK BRUSH - High quality cleaning product",
    "price": 18,
    "mrp": 38,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/205. 1103 SINK BRUSH Rs 18.png",
        "key": "205. 1103 SINK BRUSH Rs 18",
        "alt": "1103 SINK BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-65",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "2200 SUNFLOWER SET",
    "description": "2200 SUNFLOWER SET - High quality cleaning product",
    "price": 82,
    "mrp": 102,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/207 2200 SUNFLOWER SET RS82.jpg",
        "key": "207 2200 SUNFLOWER SET RS82",
        "alt": "2200 SUNFLOWER SET",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-66",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "fancy broom",
    "description": "fancy broom - High quality cleaning product",
    "price": 135,
    "mrp": 155,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/209. fancy broom-rs 135.png",
        "key": "209. fancy broom-rs 135",
        "alt": "fancy broom",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-67",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "8226 (1100) TOILET BRUSH DOUBLE HOCKEY",
    "description": "8226 (1100) TOILET BRUSH DOUBLE HOCKEY - High quality cleaning product",
    "price": 41,
    "mrp": 61,
    "category": "Toilet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41.png",
        "key": "213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41",
        "alt": "8226 (1100) TOILET BRUSH DOUBLE HOCKEY",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-68",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "1501 RICH LOOK  TOILET BRUSH SINGLE HOCKY BIG",
    "description": "1501 RICH LOOK  TOILET BRUSH SINGLE HOCKY BIG - High quality cleaning product",
    "price": 39,
    "mrp": 59,
    "category": "Toilet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39.png",
        "key": "214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39",
        "alt": "1501 RICH LOOK  TOILET BRUSH SINGLE HOCKY BIG",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-69",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "1010 RICH LOOK STEEL   TOILET BRUSH SINGLE HOCHY SS",
    "description": "1010 RICH LOOK STEEL   TOILET BRUSH SINGLE HOCHY SS - High quality cleaning product",
    "price": 48,
    "mrp": 68,
    "category": "Toilet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48.png",
        "key": "215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48",
        "alt": "1010 RICH LOOK STEEL   TOILET BRUSH SINGLE HOCHY SS",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-70",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "3300 JUMBO TOILET BRUSH DOUBLE HOCKY",
    "description": "3300 JUMBO TOILET BRUSH DOUBLE HOCKY - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Toilet Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68.png",
        "key": "218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68",
        "alt": "3300 JUMBO TOILET BRUSH DOUBLE HOCKY",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-71",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "2200 SUNFLOWER SET (SPL) OUTER LOCK",
    "description": "2200 SUNFLOWER SET (SPL) OUTER LOCK - High quality cleaning product",
    "price": 1,
    "mrp": 21,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/219. 2200 SUNFLOWER SET (SPL) OUTER LOCK-1.png",
        "key": "219. 2200 SUNFLOWER SET (SPL) OUTER LOCK-1",
        "alt": "2200 SUNFLOWER SET (SPL) OUTER LOCK",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-72",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "2200 SUNFLOWER SET (SPL) OUTER LOCK",
    "description": "2200 SUNFLOWER SET (SPL) OUTER LOCK - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/219. 2200 SUNFLOWER SET (SPL) OUTER LOCK.png",
        "key": "219. 2200 SUNFLOWER SET (SPL) OUTER LOCK",
        "alt": "2200 SUNFLOWER SET (SPL) OUTER LOCK",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-73",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "EXTEND COBWEB SET",
    "description": "EXTEND COBWEB SET - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Cobweb Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/221. EXTEND COBWEB SET.png",
        "key": "221. EXTEND COBWEB SET",
        "alt": "EXTEND COBWEB SET",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-74",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "EDTA",
    "description": "EDTA - High quality cleaning product",
    "price": 391,
    "mrp": 411,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/3. EDTA - RS 391.webp",
        "key": "3. EDTA - RS 391",
        "alt": "EDTA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-75",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GLASS WIPER",
    "description": "GLASS WIPER - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/3008 GLASS WIPER.JPG",
        "key": "3008 GLASS WIPER",
        "alt": "GLASS WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-76",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "STPP",
    "description": "STPP - High quality cleaning product",
    "price": 209,
    "mrp": 229,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/4. STPP - RS 209.jpg",
        "key": "4. STPP - RS 209",
        "alt": "STPP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-77",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Glycerine",
    "description": "Glycerine - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/5. Glycerine-RS.webp",
        "key": "5. Glycerine-RS",
        "alt": "Glycerine",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-78",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "OLEIC ACID",
    "description": "OLEIC ACID - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Bathroom Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/6. OLEIC ACID - RS.jpg",
        "key": "6. OLEIC ACID - RS",
        "alt": "OLEIC ACID",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-79",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Acid Slurry",
    "description": "Acid Slurry - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Bathroom Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/7. Acid-Slurry RS.jpg",
        "key": "7. Acid-Slurry RS",
        "alt": "Acid Slurry",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-80",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "sodium lauryl ether sulfate SLES 70",
    "description": "sodium lauryl ether sulfate SLES 70 - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/8. sodium-lauryl-ether-sulfate-SLES-70_.webp",
        "key": "8. sodium-lauryl-ether-sulfate-SLES-70_",
        "alt": "sodium lauryl ether sulfate SLES 70",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-81",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "9967 SPL HARDY SET BIG A",
    "description": "9967 SPL HARDY SET BIG A - High quality cleaning product",
    "price": 288,
    "mrp": 308,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/80. 9967 SPL HARDY SET BIG A-Rs 288.png",
        "key": "80. 9967 SPL HARDY SET BIG A-Rs 288",
        "alt": "9967 SPL HARDY SET BIG A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-82",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "9967 SPL HARDY SET BIG",
    "description": "9967 SPL HARDY SET BIG - High quality cleaning product",
    "price": 288,
    "mrp": 308,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/80. 9967 SPL HARDY SET BIG-Rs 288.png",
        "key": "80. 9967 SPL HARDY SET BIG-Rs 288",
        "alt": "9967 SPL HARDY SET BIG",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-83",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "9965 SPL HARDY SET",
    "description": "9965 SPL HARDY SET - High quality cleaning product",
    "price": 229,
    "mrp": 249,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/81. 9965 SPL HARDY SET-Rs 229.png",
        "key": "81. 9965 SPL HARDY SET-Rs 229",
        "alt": "9965 SPL HARDY SET",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-84",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "9965SPL HARDY SET A",
    "description": "9965SPL HARDY SET A - High quality cleaning product",
    "price": 229,
    "mrp": 249,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/81. 9965SPL HARDY SET A-Rs 229.png",
        "key": "81. 9965SPL HARDY SET A-Rs 229",
        "alt": "9965SPL HARDY SET A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-85",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "KITCHEN ROLL 45X500",
    "description": "KITCHEN ROLL 45X500 - High quality cleaning product",
    "price": 295,
    "mrp": 315,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/82. KITCHEN ROLL 45X500-Rs 295.png",
        "key": "82. KITCHEN ROLL 45X500-Rs 295",
        "alt": "KITCHEN ROLL 45X500",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-86",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "KITCHEN ROLL 45X500",
    "description": "KITCHEN ROLL 45X500 - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/82. KITCHEN ROLL 45X500.JPG",
        "key": "82. KITCHEN ROLL 45X500",
        "alt": "KITCHEN ROLL 45X500",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-87",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "AVON CARPER BRUSH (307)",
    "description": "AVON CARPER BRUSH (307) - High quality cleaning product",
    "price": 127,
    "mrp": 147,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/83. AVON CARPER BRUSH (307)-Rs 127.png",
        "key": "83. AVON CARPER BRUSH (307)-Rs 127",
        "alt": "AVON CARPER BRUSH (307)",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-88",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GALA STATIC BRUSH",
    "description": "GALA STATIC BRUSH - High quality cleaning product",
    "price": 222,
    "mrp": 242,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/84. GALA STATIC BRUSH-Rs 222.png",
        "key": "84. GALA STATIC BRUSH-Rs 222",
        "alt": "GALA STATIC BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-89",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "GALA STATIS BRUSH A",
    "description": "GALA STATIS BRUSH A - High quality cleaning product",
    "price": 222,
    "mrp": 242,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/84. GALA STATIS BRUSH A-Rs 222.png",
        "key": "84. GALA STATIS BRUSH A-Rs 222",
        "alt": "GALA STATIS BRUSH A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-90",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "8851 DOUBLE HOCKEY NEW MODAL",
    "description": "8851 DOUBLE HOCKEY NEW MODAL - High quality cleaning product",
    "price": 77,
    "mrp": 97,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png",
        "key": "85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77",
        "alt": "8851 DOUBLE HOCKEY NEW MODAL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-91",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "FAN BROOM SPL",
    "description": "FAN BROOM SPL - High quality cleaning product",
    "price": 215,
    "mrp": 235,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/86. FAN BROOM SPL-Rs 215.png",
        "key": "86. FAN BROOM SPL-Rs 215",
        "alt": "FAN BROOM SPL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-92",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Fan broom",
    "description": "Fan broom - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/86. Fan broom.JPG",
        "key": "86. Fan broom",
        "alt": "Fan broom",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-93",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "3008 GLASS WIPER",
    "description": "3008 GLASS WIPER - High quality cleaning product",
    "price": 52,
    "mrp": 72,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/87. 3008 GLASS WIPER Rs 52.JPG",
        "key": "87. 3008 GLASS WIPER Rs 52",
        "alt": "3008 GLASS WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-94",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Glass Wiper",
    "description": "Glass Wiper - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/87. Glass Wiper.JPG",
        "key": "87. Glass Wiper",
        "alt": "Glass Wiper",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-95",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "WINDOW WIPER",
    "description": "WINDOW WIPER - High quality cleaning product",
    "price": 50,
    "mrp": 70,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/88. WINDOW WIPER Rs 50.JPG",
        "key": "88. WINDOW WIPER Rs 50",
        "alt": "WINDOW WIPER",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-96",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Window Wiper",
    "description": "Window Wiper - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/88. Window Wiper.JPG",
        "key": "88. Window Wiper",
        "alt": "Window Wiper",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-97",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Micro Cup 160gm",
    "description": "Micro Cup 160gm - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/89. Micro Cup 160gm.JPG",
        "key": "89. Micro Cup 160gm",
        "alt": "Micro Cup 160gm",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-98",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "NCB 4060 MICRO CUP 160 GM",
    "description": "NCB 4060 MICRO CUP 160 GM - High quality cleaning product",
    "price": 118,
    "mrp": 138,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/89. NCB 4060 MICRO CUP 160 GM-Rs 118.png",
        "key": "89. NCB 4060 MICRO CUP 160 GM-Rs 118",
        "alt": "NCB 4060 MICRO CUP 160 GM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-99",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Acid Thickener",
    "description": "Acid Thickener - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Bathroom Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/9. Acid-Thickener.jpg",
        "key": "9. Acid-Thickener",
        "alt": "Acid Thickener",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-100",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Micro SS Round 215 gm",
    "description": "Micro SS Round 215 gm - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/90. Micro SS Round 215 gm.JPG",
        "key": "90. Micro SS Round 215 gm",
        "alt": "Micro SS Round 215 gm",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-101",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "ZH 09 13 MICRO SSROUND FD 215 GM",
    "description": "ZH 09 13 MICRO SSROUND FD 215 GM - High quality cleaning product",
    "price": 186,
    "mrp": 206,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/90. ZH 09-13 MICRO SSROUND FD 215 GM-Rs 186.png",
        "key": "90. ZH 09-13 MICRO SSROUND FD 215 GM-Rs 186",
        "alt": "ZH 09 13 MICRO SSROUND FD 215 GM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-102",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "8312 CONTAINER BRUSH A",
    "description": "8312 CONTAINER BRUSH A - High quality cleaning product",
    "price": 97,
    "mrp": 117,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/91. 8312 CONTAINER BRUSH A-Rs 97.png",
        "key": "91. 8312 CONTAINER BRUSH A-Rs 97",
        "alt": "8312 CONTAINER BRUSH A",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-103",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "8312 CONTAINER BRUSH",
    "description": "8312 CONTAINER BRUSH - High quality cleaning product",
    "price": 97,
    "mrp": 117,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/91. 8312 CONTAINER BRUSH-Rs 97.png",
        "key": "91. 8312 CONTAINER BRUSH-Rs 97",
        "alt": "8312 CONTAINER BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-104",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "SAMARTHYA MURAM",
    "description": "SAMARTHYA MURAM - High quality cleaning product",
    "price": 68,
    "mrp": 88,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/92. SAMARTHYA MURAM-Rs 68.png",
        "key": "92. SAMARTHYA MURAM-Rs 68",
        "alt": "SAMARTHYA MURAM",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-105",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MURAM SPECIAL",
    "description": "MURAM SPECIAL - High quality cleaning product",
    "price": 57,
    "mrp": 77,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/93. MURAM SPECIAL-Rs 57.png",
        "key": "93. MURAM SPECIAL-Rs 57",
        "alt": "MURAM SPECIAL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-106",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MURAM SADA BIG",
    "description": "MURAM SADA BIG - High quality cleaning product",
    "price": 42,
    "mrp": 62,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/94. MURAM SADA BIG-Rs 42.png",
        "key": "94. MURAM SADA BIG-Rs 42",
        "alt": "MURAM SADA BIG",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-107",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MURAM SMALL SADA",
    "description": "MURAM SMALL SADA - High quality cleaning product",
    "price": 34,
    "mrp": 54,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/95MURAM SMALL SADA-Rs 34.png",
        "key": "95MURAM SMALL SADA-Rs 34",
        "alt": "MURAM SMALL SADA",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-108",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "FABLAS KITCHEN ROLL",
    "description": "FABLAS KITCHEN ROLL - High quality cleaning product",
    "price": 186,
    "mrp": 206,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/96. FABLAS KITCHEN ROLL-Rs 186.png",
        "key": "96. FABLAS KITCHEN ROLL-Rs 186",
        "alt": "FABLAS KITCHEN ROLL",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-109",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "712 NEW SINK BRUSH",
    "description": "712 NEW SINK BRUSH - High quality cleaning product",
    "price": 38,
    "mrp": 58,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/97. 712 NEW SINK BRUSH Rs 38.JPG",
        "key": "97. 712 NEW SINK BRUSH Rs 38",
        "alt": "712 NEW SINK BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-110",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "Z 12 MICRO GLOVES",
    "description": "Z 12 MICRO GLOVES - High quality cleaning product",
    "price": 71,
    "mrp": 91,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/98. Z 12 MICRO GLOVES-Rs 71.png",
        "key": "98. Z 12 MICRO GLOVES-Rs 71",
        "alt": "Z 12 MICRO GLOVES",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-111",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "NEO SINK BRUSH",
    "description": "NEO SINK BRUSH - High quality cleaning product",
    "price": 48,
    "mrp": 68,
    "category": "Sink Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/99. NEO SINK BRUSH-Rs 48.png",
        "key": "99. NEO SINK BRUSH-Rs 48",
        "alt": "NEO SINK BRUSH",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-112",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "DODIE MOP",
    "description": "DODIE MOP - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/DODIE-MOP-Photoroom.png",
        "key": "DODIE-MOP-Photoroom",
        "alt": "DODIE MOP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-113",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "I MOP",
    "description": "I MOP - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/I-MOP-Photoroom (1).png",
        "key": "I-MOP-Photoroom (1)",
        "alt": "I MOP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-114",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "I MOP",
    "description": "I MOP - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/I-MOP-Photoroom.png",
        "key": "I-MOP-Photoroom",
        "alt": "I MOP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-115",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0039[1]",
    "description": "IMG 20250228 WA0039[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0039[1]-Photoroom.png",
        "key": "IMG-20250228-WA0039[1]-Photoroom",
        "alt": "IMG 20250228 WA0039[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-116",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0041[1]",
    "description": "IMG 20250228 WA0041[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0041[1]-Photoroom.png",
        "key": "IMG-20250228-WA0041[1]-Photoroom",
        "alt": "IMG 20250228 WA0041[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-117",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0044[1]",
    "description": "IMG 20250228 WA0044[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0044[1]-Photoroom.png",
        "key": "IMG-20250228-WA0044[1]-Photoroom",
        "alt": "IMG 20250228 WA0044[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-118",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0045[1]",
    "description": "IMG 20250228 WA0045[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0045[1]-Photoroom.png",
        "key": "IMG-20250228-WA0045[1]-Photoroom",
        "alt": "IMG 20250228 WA0045[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-119",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0046[1]",
    "description": "IMG 20250228 WA0046[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0046[1]-Photoroom.png",
        "key": "IMG-20250228-WA0046[1]-Photoroom",
        "alt": "IMG 20250228 WA0046[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-120",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0051[1]",
    "description": "IMG 20250228 WA0051[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0051[1]-Photoroom.png",
        "key": "IMG-20250228-WA0051[1]-Photoroom",
        "alt": "IMG 20250228 WA0051[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-121",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0053[1]",
    "description": "IMG 20250228 WA0053[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0053[1]-Photoroom.png",
        "key": "IMG-20250228-WA0053[1]-Photoroom",
        "alt": "IMG 20250228 WA0053[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-122",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0056[1]",
    "description": "IMG 20250228 WA0056[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0056[1]-Photoroom.png",
        "key": "IMG-20250228-WA0056[1]-Photoroom",
        "alt": "IMG 20250228 WA0056[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-123",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0057[1]",
    "description": "IMG 20250228 WA0057[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0057[1]-Photoroom.png",
        "key": "IMG-20250228-WA0057[1]-Photoroom",
        "alt": "IMG 20250228 WA0057[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-124",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0059[1]",
    "description": "IMG 20250228 WA0059[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0059[1]-Photoroom.png",
        "key": "IMG-20250228-WA0059[1]-Photoroom",
        "alt": "IMG 20250228 WA0059[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-125",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0065[1]",
    "description": "IMG 20250228 WA0065[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0065[1]-Photoroom.png",
        "key": "IMG-20250228-WA0065[1]-Photoroom",
        "alt": "IMG 20250228 WA0065[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-126",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0066[1]",
    "description": "IMG 20250228 WA0066[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0066[1]-Photoroom.png",
        "key": "IMG-20250228-WA0066[1]-Photoroom",
        "alt": "IMG 20250228 WA0066[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-127",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "IMG 20250228 WA0069[1]",
    "description": "IMG 20250228 WA0069[1] - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/IMG-20250228-WA0069[1]-Photoroom.png",
        "key": "IMG-20250228-WA0069[1]-Photoroom",
        "alt": "IMG 20250228 WA0069[1]",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-128",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "LADY DREAM softbrush set",
    "description": "LADY DREAM softbrush set - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/LADY DREAM softbrush set-Photoroom.png",
        "key": "LADY DREAM softbrush set-Photoroom",
        "alt": "LADY DREAM softbrush set",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-129",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "MEXICAN",
    "description": "MEXICAN - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/MEXICAN-Photoroom.png",
        "key": "MEXICAN-Photoroom",
        "alt": "MEXICAN",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-130",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "STAINLESS STEEL   MOP",
    "description": "STAINLESS STEEL   MOP - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/STAINLESS STEEL - MOP-Photoroom.png",
        "key": "STAINLESS STEEL - MOP-Photoroom",
        "alt": "STAINLESS STEEL   MOP",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-131",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "TWIST MOP SS",
    "description": "TWIST MOP SS - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/TWIST MOP SS-Photoroom.png",
        "key": "TWIST MOP SS-Photoroom",
        "alt": "TWIST MOP SS",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-132",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "cobweb flat",
    "description": "cobweb flat - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Cobweb Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/cobweb flat-Photoroom.png",
        "key": "cobweb flat-Photoroom",
        "alt": "cobweb flat",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-133",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "cobweb sunflower",
    "description": "cobweb sunflower - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Cobweb Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/cobweb sunflower-Photoroom.png",
        "key": "cobweb sunflower-Photoroom",
        "alt": "cobweb sunflower",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-134",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "fancy broom",
    "description": "fancy broom - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Brooms",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/fancy broom-Photoroom.png",
        "key": "fancy broom-Photoroom",
        "alt": "fancy broom",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-135",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "kitchen wiper",
    "description": "kitchen wiper - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/kitchen wiper.JPG",
        "key": "kitchen wiper",
        "alt": "kitchen wiper",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-136",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "lady dream soft brush",
    "description": "lady dream soft brush - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/lady dream soft brush-Photoroom.png",
        "key": "lady dream soft brush-Photoroom",
        "alt": "lady dream soft brush",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-137",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "londonmop",
    "description": "londonmop - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/londonmop-Photoroom.png",
        "key": "londonmop-Photoroom",
        "alt": "londonmop",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-138",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "mate 1",
    "description": "mate 1 - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/mate-1-Photoroom.png",
        "key": "mate-1-Photoroom",
        "alt": "mate 1",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-139",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "mate 2",
    "description": "mate 2 - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/mate-2-Photoroom.png",
        "key": "mate-2-Photoroom",
        "alt": "mate 2",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-140",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "soft brush",
    "description": "soft brush - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Long Brushes",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/soft brush-Photoroom.png",
        "key": "soft brush-Photoroom",
        "alt": "soft brush",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-141",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "spanish",
    "description": "spanish - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Other",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/spanish-Photoroom.png",
        "key": "spanish-Photoroom",
        "alt": "spanish",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-142",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "twist mop colour a",
    "description": "twist mop colour a - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/twist mop colour a-Photoroom.png",
        "key": "twist mop colour a-Photoroom",
        "alt": "twist mop colour a",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-143",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  },
  {
    "name": "whitemop",
    "description": "whitemop - High quality cleaning product",
    "price": 99,
    "mrp": 119,
    "category": "Floor Cleaners",
    "images": [
      {
        "url": "/images/CATALOG IMAGES/whitemop-Photoroom.png",
        "key": "whitemop-Photoroom",
        "alt": "whitemop",
        "isPrimary": true
      }
    ],
    "stock": 50,
    "sku": "RC-NEW-144",
    "features": [
      "High quality",
      "Durable",
      "Effective"
    ],
    "ingredients": [],
    "usage": "Use as directed",
    "weight": "N/A",
    "isActive": true
  }
];

const adminUser = {
  name: 'Rose Chemicals Admin',
  email: 'admin@rosechemical.in',
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
