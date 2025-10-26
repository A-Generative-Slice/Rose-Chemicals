"use client"
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'

const PRODUCTS = {
  brooms: [
    { id: 1, name: 'Delux Nice Broom', price: '₹115', image: '/images/BROOMS/164. DELUX NICE BROOM 115.png' },
    { id: 2, name: 'Sitara Broom', price: '₹84', image: '/images/BROOMS/166. SITARA BROOM- 84.png' },
    { id: 3, name: 'Supriya Nice Broom', price: '₹115', image: '/images/BROOMS/167. SUPRIYA NICE BROOM 115.png' },
    { id: 4, name: 'Camel Red Broom', price: '₹65', image: '/images/BROOMS/168. CAMEL RED - 65.png' },
    { id: 5, name: 'Shine Red Broom', price: '₹74', image: '/images/BROOMS/169. SHINE RED- 74.png' },
    { id: 6, name: 'Pinky Red Broom', price: '₹78', image: '/images/BROOMS/171. PINKY RED BROOM - 78.png' },
    { id: 7, name: 'Pinky Blue Broom', price: '₹78', image: '/images/BROOMS/172. PINKY BLUE BROOM-78.png' },
    { id: 8, name: 'Jumbo Red Broom', price: '₹129', image: '/images/BROOMS/173. JUMBO RED BROOM-129.png' },
    { id: 9, name: 'Amil Red Broom', price: '₹98', image: '/images/BROOMS/174. AMIL RED BROOM- 98.png' },
    { id: 10, name: 'MR Clean Broom', price: '₹50', image: '/images/BROOMS/180. MR.CLEAN- 50.png' },
    { id: 11, name: 'Amil Blue Nice Broom', price: '₹95', image: '/images/BROOMS/183. AMIL BLUE NICE BROOM 95.png' },
    { id: 12, name: 'Tulsi Green Cover Broom', price: '₹109', image: '/images/BROOMS/183. TULSI GREEN COVER BROOM-109.png' },
    { id: 13, name: 'Chennai Broom Small', price: '₹73', image: '/images/BROOMS/184&185Chennai Broom Small & Big- 73 - 88.png' },
    { id: 14, name: 'Chennai Broom Big', price: '₹88', image: '/images/BROOMS/184&185Chennai Broom Small & Big- 73 - 88.png' },
    { id: 15, name: 'Chennai Burma Cover Broom', price: '₹93', image: '/images/BROOMS/185. chennai burma cover- 93.png' },
    { id: 16, name: 'Lady Dream Plastic Broom', price: '₹111', image: '/images/BROOMS/186. Lady Dream Plastic - 111.png' },
    { id: 17, name: 'Chennai Burma Plastic Broom', price: '₹88', image: '/images/BROOMS/188. chennai burma plastic- 88.png' }
  ],
  carpet_brushes: [
    { id: 101, name: 'Avon Carpet Brush', price: '₹127', image: '/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307)-Rs 127.png' },
    { id: 102, name: 'New Carpet Brush 1511', price: '₹68', image: '/images/CARPET_BRUSHES/113. NEW CARPET BRUSH 1511-Rs 68.png' }
  ],
  cobweb_cleaners: [
    { id: 201, name: 'Cobweb Sunflower Outer Lock', price: '₹98', image: '/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png' },
    { id: 202, name: 'Cobweb Cleaner Flat', price: '₹85', image: '/images/COBWEB_CLEANERS/cob web cleaner - flat-Photoroom.png' },
    { id: 203, name: 'Cobweb Flat', price: '₹78', image: '/images/COBWEB_CLEANERS/cobweb flat-Photoroom.png' },
    { id: 204, name: 'Cobweb Sunflower', price: '₹92', image: '/images/COBWEB_CLEANERS/cobweb sunflower-Photoroom.png' }
  ],
  long_brushes: [
    { id: 301, name: 'THK 140', price: '₹111', image: '/images/LONG_BRUSHES/123. THK 140-Rs 111.png' },
    { id: 302, name: 'SPL Hardy Set Big', price: '₹288', image: '/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG-Rs 288.png' },
    { id: 303, name: 'SPL Hardy Set', price: '₹229', image: '/images/LONG_BRUSHES/81. 9965 SPL HARDY SET-Rs 229.png' },
    { id: 304, name: 'Gala Static Brush', price: '₹222', image: '/images/LONG_BRUSHES/84. GALA STATIC BRUSH-Rs 222.png' }
  ],
  sink_brushes: [
    { id: 401, name: 'Supreme Sink Square', price: '₹57', image: '/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG' },
    { id: 402, name: '2381 Sink Brush', price: '₹38', image: '/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png' },
    { id: 403, name: 'Sink Brush 4D Square', price: '₹68', image: '/images/SINK_BRUSHES/114. SINK BRUSH 4D SQUARE-Rs 68.png' },
    { id: 404, name: 'Sink Brush 1807', price: '₹39', image: '/images/SINK_BRUSHES/120. SINK BRUSH 1807-Rs 39.png' },
    { id: 405, name: '1103 Sink Brush', price: '₹18', image: '/images/SINK_BRUSHES/205. 1103 SINK BRUSH Rs 18.png' },
    { id: 406, name: '712 New Sink Brush', price: '₹38', image: '/images/SINK_BRUSHES/97. 712 NEW SINK BRUSH Rs 38.JPG' },
    { id: 407, name: 'Neo Sink Brush', price: '₹48', image: '/images/SINK_BRUSHES/99. NEO SINK BRUSH-Rs 48.png' }
  ],
  toilet_brushes: [
    { id: 801, name: 'Keetal Brush', price: '₹30', image: '/images/TOILET_BRUSHES/107. 5500 KEETAL BRUSH-Rs 30.png' },
    { id: 802, name: 'New Container Brush', price: '₹141', image: '/images/TOILET_BRUSHES/119. NEW CONTAINER BRUSH 1642-Rs 141.png' },
    { id: 803, name: 'Plus Brush', price: '₹29', image: '/images/TOILET_BRUSHES/124. PLUS BRUSH 611-Rs 29.png' },
    { id: 804, name: 'Toilet Brush SOS', price: '₹56', image: '/images/TOILET_BRUSHES/125. TOILET BRUSH SOS- Rs 56.png' },
    { id: 805, name: 'Rim Brush', price: '₹33', image: '/images/TOILET_BRUSHES/201. RIM BRUSH- Rs 33.png' },
    { id: 806, name: 'Nirmal Toilet Brush', price: '₹25', image: '/images/TOILET_BRUSHES/208. NIRMAL TOILET BRUSH- Rs 25.png' },
    { id: 807, name: 'RIM Brush 7502', price: '₹29', image: '/images/TOILET_BRUSHES/209. RIM BRUSH 7502-Rs 29.png' },
    { id: 808, name: 'Container Brush', price: '₹59', image: '/images/TOILET_BRUSHES/93. CONTAINER BRUSH 1641- Rs 59.png' }
  ],
  other_brushes: [
    { id: 501, name: 'Magic Sponge', price: '₹68', image: '/images/CATALOG/101. MAGIC SPONGE-Rs 68.png' },
    { id: 502, name: 'White Iron Brush', price: '₹52', image: '/images/CATALOG/102. 8201 WHITE IRON BRUSH-Rs 52.png' }
  ],
  dusters: [
    { id: 601, name: 'Cotton Duster', price: '₹45', image: '/images/CATALOG/103. COTTON DUSTER-Rs 45.png' },
    { id: 602, name: 'Microfiber Duster', price: '₹75', image: '/images/CATALOG/104. MICROFIBER DUSTER-Rs 75.png' }
  ],
  other: [
    { id: 701, name: 'Acetic Acid', price: '₹170', image: '/images/CATALOG/1. Acetic Acid - Rs 170.webp' },
    { id: 702, name: 'Cocamidopropyl Betaine', price: '₹163', image: '/images/CATALOG/10. cocamidopropyl-betaine-CAPB - RS 163.webp' }
  ]
}

type Category = keyof typeof PRODUCTS | 'all'

const CATEGORIES = [
  { key: 'all', name: 'All Products', icon: '🧹', description: 'View our complete range' },
  { key: 'brooms', name: 'Brooms', icon: '🧹', description: 'Industrial & household brooms' },
  { key: 'carpet_brushes', name: 'Carpet Brushes', icon: '🏠', description: 'Specialized carpet cleaning' },
  { key: 'cobweb_cleaners', name: 'Cobweb Cleaners', icon: '🕸️', description: 'Corner & ceiling cleaning' },
  { key: 'long_brushes', name: 'Long Brushes', icon: '🖌️', description: 'Extended reach brushes' },
  { key: 'sink_brushes', name: 'Sink Brushes', icon: '🚿', description: 'Kitchen & bathroom cleaning' },
  { key: 'toilet_brushes', name: 'Toilet Brushes', icon: '🚽', description: 'Bathroom sanitation tools' },
  { key: 'other_brushes', name: 'Other Brushes', icon: '🪥', description: 'Specialized cleaning tools' },
  { key: 'dusters', name: 'Dusters', icon: '🧽', description: 'Dust removal tools' },
  { key: 'other', name: 'Chemicals', icon: '🧪', description: 'Cleaning chemicals & supplies' }
] as const

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Get all products or filtered by category
  const getDisplayProducts = () => {
    if (activeCategory === 'all') {
      return Object.values(PRODUCTS).flat()
    }
    return PRODUCTS[activeCategory as keyof typeof PRODUCTS] || []
  }

  // Get product count for a category
  const getCategoryCount = (categoryKey: Category) => {
    if (categoryKey === 'all') {
      return Object.values(PRODUCTS).flat().length
    }
    return PRODUCTS[categoryKey as keyof typeof PRODUCTS]?.length || 0
  }

  const activeCategoryData = CATEGORIES.find(cat => cat.key === activeCategory)
  const displayProducts = getDisplayProducts()

  return (
    <div className="space-y-8">
      {/* Category Selection - Tabs for Desktop */}
      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as Category)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeCategory === category.key
                    ? 'border-hero-bg text-hero-bg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {getCategoryCount(category.key as Category)}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Category Selection - Dropdown for Mobile */}
      <div className="md:hidden">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{activeCategoryData?.icon}</span>
              <span className="font-medium">{activeCategoryData?.name}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {getCategoryCount(activeCategory)}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    setActiveCategory(category.key as Category)
                    setDropdownOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                    activeCategory === category.key ? 'bg-hero-bg bg-opacity-10 text-hero-bg' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {getCategoryCount(category.key as Category)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Category Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">{activeCategoryData?.icon}</span>
          <h2 className="text-2xl font-bold text-gray-900">{activeCategoryData?.name}</h2>
        </div>
        <p className="text-gray-600 mb-4">{activeCategoryData?.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Showing {displayProducts.length} products</span>
          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-hero-bg hover:text-hero-bg font-medium"
            >
              View All Categories →
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            No products available in this category. Please select a different category.
          </p>
        </div>
      )}
    </div>
  )
}
