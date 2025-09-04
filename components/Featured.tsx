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
    { id: 803, name: 'THK 1108', price: '₹68', image: '/images/TOILET_BRUSHES/122. THK 1108-Rs 68.png' },
    { id: 804, name: 'Rich Look Toilet Brush Small', price: '₹32', image: '/images/TOILET_BRUSHES/201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png' },
    { id: 805, name: 'Double Hockey Toilet Brush', price: '₹41', image: '/images/TOILET_BRUSHES/213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41.png' },
    { id: 806, name: 'Rich Look Toilet Brush Big', price: '₹39', image: '/images/TOILET_BRUSHES/214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39.png' },
    { id: 807, name: 'Rich Look Steel Toilet Brush', price: '₹48', image: '/images/TOILET_BRUSHES/215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48.png' },
    { id: 808, name: 'Jumbo Double Hockey Toilet Brush', price: '₹68', image: '/images/TOILET_BRUSHES/double-hockey-jumbo-68.png' },
    { id: 809, name: 'Double Hockey New Model', price: '₹77', image: '/images/TOILET_BRUSHES/85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png' },
    { id: 810, name: 'Container Brush', price: '₹97', image: '/images/TOILET_BRUSHES/91. 8312 CONTAINER BRUSH-Rs 97.png' }
  ],
  other_brushes: [
    { id: 501, name: 'Container Brush', price: '₹97', image: '/images/CATALOG/91. 8312 CONTAINER BRUSH-Rs 97.png' },
    { id: 502, name: 'Double Hockey New Model', price: '₹77', image: '/images/CATALOG/85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png' },
    { id: 503, name: 'Gala Static Brush', price: '₹222', image: '/images/CATALOG/84. GALA STATIC BRUSH-Rs 222.png' },
    { id: 504, name: 'Supreem Iron Brush', price: '₹68', image: '/images/CATALOG/103. SUPREEM IRON BRUSH-Rs 68.png' },
    { id: 505, name: 'Black Iron Brush', price: '₹68', image: '/images/CATALOG/104. BLACK IRON BRUSH-Rs 68.png' },
    { id: 506, name: 'White Iron Brush', price: '₹52', image: '/images/CATALOG/102. 8201 WHITE IRON BRUSH-Rs 52.png' },
    { id: 507, name: 'Cloth Brush', price: '₹50', image: '/images/CATALOG/116. 6606 CLOTH BRUSH-Rs 50.png' },
    { id: 508, name: 'Magic Sponge', price: '₹68', image: '/images/CATALOG/101. MAGIC SPONGE-Rs 68.png' },
    { id: 509, name: 'Metal Pad', price: '₹11', image: '/images/CATALOG/124. METAL PAD-Rs 11.png' }
  ],
  dusters: [
    { id: 601, name: 'Fan Broom SPL', price: '₹215', image: '/images/CATALOG/86. FAN BROOM SPL-Rs 215.png' },
    { id: 602, name: 'Mini Duster SPL 43 GM', price: '₹43', image: '/images/CATALOG/109. MINI DUSTER SPL 43 GM-Rs 43.png' },
    { id: 603, name: 'Micro SS Round 215 GM', price: '₹186', image: '/images/CATALOG/90. ZH 09-13 MICRO SSROUND FD 215 GM-Rs 186.png' },
    { id: 604, name: 'Z 12 Micro Gloves', price: '₹71', image: '/images/CATALOG/98. Z 12 MICRO GLOVES-Rs 71.png' },
    { id: 605, name: 'Micro Cup 160 GM', price: '₹118', image: '/images/CATALOG/89. NCB 4060 MICRO CUP 160 GM-Rs 118.png' },
    { id: 606, name: 'Feather Duster Small', price: '₹49', image: '/images/CATALOG/147 FEATHER DUSTER SMALL RS49.jpg' },
    { id: 607, name: 'Cleaning Towel', price: '₹59', image: '/images/CATALOG/125. CLEANING TOWEL-Rs 59.png' }
  ],
  other: [
    { id: 701, name: 'Sunflower Set', price: '₹82', image: '/images/CATALOG/207 2200 SUNFLOWER SET RS82.jpg' },
    { id: 702, name: 'Sunflower Set SPL Outer Lock', price: '₹82', image: '/images/CATALOG/219. 2200 SUNFLOWER SET (SPL) OUTER LOCK.png' },
    { id: 703, name: 'Extend Cobweb Set', price: '₹87', image: '/images/CATALOG/221. EXTEND COBWEB SET.png' },
    { id: 704, name: 'Kitchen Roll 45X500', price: '₹295', image: '/images/CATALOG/82. KITCHEN ROLL 45X500-Rs 295.png' },
    { id: 705, name: 'Fablas Kitchen Roll', price: '₹186', image: '/images/CATALOG/96. FABLAS KITCHEN ROLL-Rs 186.png' },
    { id: 706, name: 'Glass Wiper', price: '₹26', image: '/images/CATALOG/154 GLASS WIPER RS26.JPG' },
    { id: 707, name: 'Window Wiper', price: '₹50', image: '/images/CATALOG/88. WINDOW WIPER Rs 50.JPG' },
    { id: 708, name: 'Venus Floor Wiper 18 Inch', price: '₹104', image: '/images/CATALOG/150. VENUS FLOOR WIPER 18 INCH- rs104.png' },
    { id: 709, name: 'Ironman 20 Inch Wiper', price: '₹185', image: '/images/CATALOG/155.IRONMAN 20 INCH WIPER- rs 185.JPG' },
    { id: 710, name: 'Green Pad 10X15 (10PCS)', price: '₹52', image: '/images/CATALOG/159 GREEN PAD 10X15 (10PCS) RS 52.JPG' },
    { id: 711, name: 'SS Scrubber Patta', price: '₹65', image: '/images/CATALOG/160. SS SCRUBBER PATTA- rs 65.JPG' },
    { id: 712, name: 'Plastic Scrubber', price: '₹81', image: '/images/CATALOG/163 PLASTIC SCRUBBER RS81.JPG' },
    { id: 713, name: 'Samarthya Kitchen Wiper', price: '₹45', image: '/images/CATALOG/105. SAMARTHYA A1 KITCHEN WIPER Rs 45.JPG' },
    { id: 714, name: 'Muram with Brush Small', price: '₹29', image: '/images/CATALOG/106. MURAM WITH BRUSH 109 SMALL-Rs 29.png' },
    { id: 715, name: 'Samarthya Muram', price: '₹68', image: '/images/CATALOG/92. SAMARTHYA MURAM-Rs 68.png' },
    { id: 716, name: 'Muram Special', price: '₹57', image: '/images/CATALOG/93. MURAM SPECIAL-Rs 57.png' },
    { id: 717, name: 'Muram Sada Big', price: '₹42', image: '/images/CATALOG/94. MURAM SADA BIG-Rs 42.png' },
    { id: 718, name: 'Muram Small Sada', price: '₹34', image: '/images/CATALOG/95MURAM SMALL SADA-Rs 34.png' },
    { id: 719, name: 'Fridge Cover', price: '₹68', image: '/images/CATALOG/121. FRIDGE COVER-Rs 68.png' },
    { id: 720, name: 'Silver Polish', price: '₹68', image: '/images/CATALOG/117. SILVER POLISH-Rs 68.png' },
    { id: 721, name: 'Metal Polish', price: '₹111', image: '/images/CATALOG/118. METAL POLISH-Rs 111.png' }
  ]
}

export default function Featured(){
  const mainHeadingStyle = "text-3xl font-bold mb-6 text-gray-800 border-b-2 border-rose-500 pb-2";

  return (
    <div className="space-y-8">
      <section>
        <h2 className={mainHeadingStyle}>Brooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.brooms.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className={mainHeadingStyle}>Brushes</h2>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Carpet Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.carpet_brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Cobweb Cleaners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.cobweb_cleaners.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Long Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.long_brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Sink Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.sink_brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Toilet Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.toilet_brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Other Brushes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.other_brushes.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className={mainHeadingStyle}>Dusters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.dusters.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className={mainHeadingStyle}>Other Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PRODUCTS.other.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
