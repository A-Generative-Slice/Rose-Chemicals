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
    { id: 17, name: 'Chennai Burma Plastic Broom', price: '₹88', image: '/images/BROOMS/188. chennai burma plastic- 88.png' },
    { id: 18, name: 'Lady Dream Soft Brush', price: 'Contact for Price', image: '/images/BROOMS/lady dream soft brush-Photoroom.png' }
  ],
  brushes: [
    // Carpet Brushes
    { id: 101, name: 'Avon Carpet Brush', price: '₹131', image: '/images/BRUSHES/83. AVON CARPER BRUSH (307).png' },
    { id: 102, name: 'Black Iron Brush', price: '₹70', image: '/images/BRUSHES/104. BLACK IRON BRUSH.png' },
    { id: 103, name: 'Cloth Brush', price: '₹50', image: '/images/BRUSHES/116. 6606 CLOTH BRUSH.png' },
    
    // Cobweb Cleaners
    { id: 201, name: 'Cobweb Sunflower Outer Lock', price: '₹98', image: '/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png' },
    { id: 202, name: 'Cobweb Cleaner Flat', price: '₹85', image: '/images/COBWEB_CLEANERS/cob web cleaner - flat-Photoroom.png' },
    { id: 203, name: 'Cobweb Flat', price: '₹78', image: '/images/COBWEB_CLEANERS/cobweb flat-Photoroom.png' },
    { id: 204, name: 'Cobweb Sunflower', price: '₹92', image: '/images/COBWEB_CLEANERS/cobweb sunflower-Photoroom.png' },
    
    // Long Brushes
    { id: 301, name: 'THK 140', price: '₹111', image: '/images/LONG_BRUSHES/123. THK 140-Rs 111.png' },
    { id: 302, name: 'SPL Hardy Set Big', price: '₹288', image: '/images/LONG_BRUSHES/80. 9967 SPL HARDY SET BIG-Rs 288.png' },
    { id: 303, name: 'SPL Hardy Set', price: '₹229', image: '/images/LONG_BRUSHES/81. 9965 SPL HARDY SET-Rs 229.png' },
    { id: 304, name: 'Gala Static Brush', price: '₹222', image: '/images/LONG_BRUSHES/84. GALA STATIC BRUSH-Rs 222.png' },
    { id: 305, name: 'Fancy Broom', price: 'Contact for Price', image: '/images/LONG_BRUSHES/fancy broom-Photoroom.png' },
    { id: 306, name: 'Lady Dream Softbrush Set', price: 'Contact for Price', image: '/images/LONG_BRUSHES/LADY DREAM softbrush set-Photoroom.png' },
    { id: 307, name: 'Soft Brush', price: 'Contact for Price', image: '/images/LONG_BRUSHES/soft brush-Photoroom.png' },
    
    // Sink Brushes
    { id: 401, name: 'Supreme Sink Square', price: '₹57', image: '/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG' },
    { id: 402, name: '2381 Sink Brush', price: '₹38', image: '/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png' },
    { id: 403, name: 'Sink Brush 4D Square', price: '₹68', image: '/images/SINK_BRUSHES/114. SINK BRUSH 4D SQUARE-Rs 68.png' },
    { id: 404, name: 'Sink Brush 1807', price: '₹39', image: '/images/SINK_BRUSHES/120. SINK BRUSH 1807-Rs 39.png' },
    { id: 405, name: '1103 Sink Brush', price: '₹18', image: '/images/SINK_BRUSHES/205. 1103 SINK BRUSH Rs 18.png' },
    { id: 406, name: '712 New Sink Brush', price: '₹38', image: '/images/SINK_BRUSHES/97. 712 NEW SINK BRUSH Rs 38.JPG' },
    { id: 407, name: 'Neo Sink Brush', price: '₹48', image: '/images/SINK_BRUSHES/99. NEO SINK BRUSH-Rs 48.png' },
    
    // Other Brushes
    { id: 501, name: 'Container Brush', price: '₹97', image: '/images/BRUSHES/91. 8312 CONTAINER BRUSH.png' },
    { id: 502, name: 'Double Hockey', price: '₹41', image: '/images/BRUSHES/213. 8226 TOILET BRUSH DOUBLE HOCKEY.png' },
    { id: 503, name: 'Double Hockey Jumbo', price: '₹68', image: '/images/BRUSHES/218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY.png' },
    { id: 504, name: 'Double Hockey New Model', price: '₹77', image: '/images/BRUSHES/85. 8851 DOUBLE HOCKEY NEW MODAL.png' },
    { id: 505, name: 'Gala Statis Brush', price: '₹109', image: '/images/BRUSHES/84. GALA STATIS BRUSH.png' },
    { id: 506, name: 'Keetal Brush', price: '₹30', image: '/images/BRUSHES/107. 5500 KEETAL BRUSH.png' },
    { id: 507, name: 'Lady Dream Softbrush', price: '₹70', image: '/images/BRUSHES/LADY DREAM softbrush.png' },
    { id: 508, name: 'New Container Brush', price: '₹141', image: '/images/BRUSHES/119. NEW CONTAINER BRUSH 1642.png' },
    { id: 509, name: 'Supreem Iron Brush', price: '₹70', image: '/images/BRUSHES/103. SUPREEM IRON BRUSH.png' },
    { id: 510, name: 'THK Brush', price: '₹111', image: '/images/BRUSHES/123. THK 140.png' },
    { id: 511, name: 'THK', price: '₹68', image: '/images/BRUSHES/122. THK 1108.png' },
    { id: 512, name: 'Toilet Brush Round', price: '₹36', image: '/images/BRUSHES/201. TOILET BRUSH SINGLE HOCKY SMALL.png' }
  ],
  dusters: [
    { id: 601, name: 'Fan Broom Premium', price: '₹215', image: '/images/fan-broom-premium.jpg' },
    { id: 602, name: 'Fan Broom Basic', price: '₹59', image: '/images/fan-broom-basic.jpg' },
    { id: 603, name: 'Fan Broom Standard', price: '₹118', image: '/images/fan-broom-standard.jpg' },
    { id: 604, name: 'Mini Duster SPL 43 GM', price: '₹43', image: '/images/mini-duster.jpg' },
    { id: 605, name: 'Micro SS Round', price: '₹186', image: '/images/micro-ss.jpg' },
    { id: 606, name: 'Z 12 Micro Gloves', price: '₹186', image: '/images/z12-gloves.jpg' }
  ],
  other: [
    { id: 701, name: 'Extent Set', price: '₹87', image: '/images/extent-set.jpg' },
    { id: 702, name: 'Extent Set SPL Outer Lock', price: '₹100', image: '/images/extent-set-spl.jpg' },
    { id: 703, name: 'Sunflower Set', price: '₹82', image: '/images/sunflower-set.jpg' },
    { id: 704, name: 'Cleaning Towel', price: 'Contact for Price', image: '/images/cleaning-towel.jpg' },
    { id: 705, name: 'Lady Dream Body Loofah', price: 'Contact for Price', image: '/images/body-loofah.jpg' },
    { id: 706, name: 'Adhavan Metal Polliria', price: 'Contact for Price', image: '/images/metal-polliria.jpg' },
    { id: 707, name: 'Clothesline', price: 'Contact for Price', image: '/images/clothesline.jpg' },
    { id: 708, name: 'Patilas', price: 'Contact for Price', image: '/images/patilas.jpg' },
    { id: 709, name: 'Saugwunder', price: 'Contact for Price', image: '/images/saugwunder.jpg' }
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
