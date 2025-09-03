import ProductCard from './ProductCard'

const PRODUCTS = {
  brooms: [
    { id: 1, name: 'Amil Blue Nice Broom', price: '₹98', image: '/images/amil-blue-broom.jpg' },
    { id: 2, name: 'Amil Red Broom', price: '₹115', image: '/images/amil-red-broom.jpg' },
    { id: 3, name: 'Camel Red Broom', price: '₹65', image: '/images/camel-red-broom.jpg' },
    { id: 4, name: 'Camel 5D SS Handle Broom', price: '₹90', image: '/images/camel-5d-broom.jpg' },
    { id: 5, name: 'Chennai Burma Broom', price: '₹88', image: '/images/chennai-burma-broom.jpg' },
    { id: 6, name: 'Chennai Burma Cover Broom', price: '₹111', image: '/images/chennai-burma-cover.jpg' },
    { id: 7, name: 'Chennai Broom Small', price: '₹77', image: '/images/chennai-small.jpg' },
    { id: 8, name: 'Chennai Broom Big', price: '₹88', image: '/images/chennai-big.jpg' },
    { id: 9, name: 'Clean Mart Broom', price: '₹104', image: '/images/clean-mart.jpg' },
    { id: 10, name: 'Delux Nice Broom', price: '₹109', image: '/images/delux-nice.jpg' },
    { id: 11, name: 'Fancy Broom', price: '₹134', image: '/images/fancy-broom.jpg' },
    { id: 12, name: 'Jumbo Red Broom', price: '₹122', image: '/images/jumbo-red.jpg' },
    { id: 13, name: 'Lady Dream Plastic Broom', price: '₹88', image: '/images/lady-dream.jpg' },
    { id: 14, name: 'M.R. Clean Broom', price: '₹50', image: '/images/mr-clean.jpg' },
    { id: 15, name: 'Pinky Blue Broom', price: '₹74', image: '/images/pinky-blue.jpg' },
    { id: 16, name: 'Pinky Red Broom', price: '₹74', image: '/images/pinky-red.jpg' },
    { id: 17, name: 'Shine Red Broom', price: '₹74', image: '/images/shine-red.jpg' },
    { id: 18, name: 'Sitara Broom', price: '₹84', image: '/images/sitara.jpg' },
    { id: 19, name: 'Soft Brush', price: '₹134', image: '/images/soft-brush.jpg' },
    { id: 20, name: 'Supriya Nice Broom', price: '₹109', image: '/images/supriya-nice.jpg' },
    { id: 21, name: 'Thulasi Green Cover Broom', price: '₹103', image: '/images/thulasi-cover.jpg' },
    { id: 22, name: 'Tulasi Green Broom', price: '₹109', image: '/images/tulasi-green.jpg' }
  ],
  brushes: [
    { id: 23, name: 'Avon Carpet Brush', price: '₹131', image: '/images/avon-carpet.jpg' },
    { id: 24, name: 'Black Iron Brush', price: '₹70', image: '/images/black-iron.jpg' },
    { id: 25, name: 'Cloth Brush', price: '₹50', image: '/images/cloth-brush.jpg' },
    { id: 26, name: 'Double Hockey', price: '₹41', image: '/images/double-hockey.jpg' },
    { id: 27, name: 'Double Hockey Jumbo', price: '₹68', image: '/images/hockey-jumbo.jpg' },
    { id: 28, name: 'Double Hockey New Model', price: '₹77', image: '/images/hockey-new.jpg' },
    { id: 29, name: 'Gala Statis Brush', price: '₹109', image: '/images/gala-statis.jpg' },
    { id: 30, name: 'Keetal Brush', price: '₹30', image: '/images/keetal.jpg' },
    { id: 31, name: 'Lady Dream Softbrush', price: '₹70', image: '/images/lady-dream-soft.jpg' },
    { id: 32, name: 'New Carpet Brush', price: '₹70', image: '/images/new-carpet.jpg' },
    { id: 33, name: 'New Container Brush', price: '₹141', image: '/images/new-container.jpg' },
    { id: 34, name: 'Neo Sink Brush', price: '₹48', image: '/images/neo-sink.jpg' },
    { id: 35, name: 'Single Hockey Small', price: '₹30', image: '/images/single-hockey.jpg' },
    { id: 36, name: 'Single Hockey SS', price: '₹36', image: '/images/hockey-ss.jpg' },
    { id: 37, name: 'Sink Brush', price: '₹39', image: '/images/sink-brush.jpg' },
    { id: 38, name: 'Sink Brush Round', price: '₹18', image: '/images/sink-round.jpg' },
    { id: 39, name: 'Sink Brush 4D Square', price: '₹68', image: '/images/sink-4d.jpg' },
    { id: 40, name: 'Supreem Iron Brush', price: '₹70', image: '/images/supreem-iron.jpg' },
    { id: 41, name: 'THK Brush', price: '₹111', image: '/images/thk-brush.jpg' },
    { id: 42, name: 'THK', price: '₹68', image: '/images/thk.jpg' },
    { id: 43, name: 'Toilet Brush Round', price: '₹36', image: '/images/toilet-round.jpg' },
    { id: 44, name: 'Container Brush', price: '₹97', image: '/images/container.jpg' }
  ],
  dusters: [
    { id: 45, name: 'Fan Broom Premium', price: '₹215', image: '/images/fan-broom-premium.jpg' },
    { id: 46, name: 'Fan Broom Basic', price: '₹59', image: '/images/fan-broom-basic.jpg' },
    { id: 47, name: 'Fan Broom Standard', price: '₹118', image: '/images/fan-broom-standard.jpg' },
    { id: 48, name: 'Mini Duster SPL 43 GM', price: '₹43', image: '/images/mini-duster.jpg' },
    { id: 49, name: 'Micro SS Round', price: '₹186', image: '/images/micro-ss.jpg' },
    { id: 50, name: 'Z 12 Micro Gloves', price: '₹186', image: '/images/z12-gloves.jpg' }
  ],
  other: [
    { id: 51, name: 'Cob Web Cleaner Sunflower', price: '₹98', image: '/images/cobweb-cleaner.jpg' },
    { id: 52, name: 'Extent Set', price: '₹87', image: '/images/extent-set.jpg' },
    { id: 53, name: 'Extent Set SPL Outer Lock', price: '₹100', image: '/images/extent-set-spl.jpg' },
    { id: 54, name: 'Sunflower Set', price: '₹82', image: '/images/sunflower-set.jpg' },
    { id: 55, name: 'Cleaning Towel', price: 'Contact for Price', image: '/images/cleaning-towel.jpg' },
    { id: 56, name: 'Lady Dream Body Loofah', price: 'Contact for Price', image: '/images/body-loofah.jpg' },
    { id: 57, name: 'Adhavan Metal Polliria', price: 'Contact for Price', image: '/images/metal-polliria.jpg' },
    { id: 58, name: 'Clothesline', price: 'Contact for Price', image: '/images/clothesline.jpg' },
    { id: 59, name: 'Patilas', price: 'Contact for Price', image: '/images/patilas.jpg' },
    { id: 60, name: 'Saugwunder', price: 'Contact for Price', image: '/images/saugwunder.jpg' }
  ]
}

export default function Featured(){
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Brooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.brooms.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Dusters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.dusters.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Other Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.other.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
