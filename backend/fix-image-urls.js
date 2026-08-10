/**
 * fix-image-urls.js
 * 
 * Patches all products in MongoDB that have broken S3 image URLs,
 * replacing them with working /images/CATALOG IMAGES/ paths that
 * are already present on the VPS in public/images/.
 * 
 * Run this on the VPS:
 *   cd /root/Rose-Chemicals/backend
 *   node fix-image-urls.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Mapping from product name keywords → catalog image filename
// Based on files found in public/images/CATALOG IMAGES/
const IMAGE_MAP = [
  // Raw materials / chemicals
  { keywords: ['acetic acid'], image: '1. Acetic Acid - Rs 170.webp' },
  { keywords: ['stp'], image: '2. STP RS 121.webp' },
  { keywords: ['edta'], image: '3. EDTA - RS 391.webp' },
  { keywords: ['stpp', 'sodium tri'], image: '4. STPP - RS 209.jpg' },
  { keywords: ['glycerine', 'glycerin'], image: '5. Glycerine-RS.webp' },
  { keywords: ['oleic acid'], image: '6. OLEIC ACID - RS.jpg' },
  { keywords: ['acid slurry', 'acid-slurry'], image: '7. Acid-Slurry RS.jpg' },
  { keywords: ['sles', 'sodium lauryl', 'ether sulfate'], image: '8. sodium-lauryl-ether-sulfate-SLES-70_.webp' },
  { keywords: ['acid thickener', 'thickener'], image: '9. Acid-Thickener.jpg' },
  { keywords: ['capb', 'cocamidopropyl'], image: '10. cocamidopropyl-betaine-CAPB - RS 163.webp' },
  { keywords: ['hpmc'], image: '14. HPMC - RS.webp' },
  { keywords: ['sn937'], image: '15. SN937 RS 250.webp' },
  { keywords: ['cdea', 'cocamide'], image: '16. CDEA - RS 111.avif' },
  { keywords: ['rosanam'], image: '17. ROSANAM - RS 100.webp' },

  // Toilet brushes
  { keywords: ['single hockey small', '1101', 'rich look toilet'], image: '201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png' },
  { keywords: ['single hockey big', '1501'], image: '214. 1501 RICH LOOK -TOILET BRUSH SINGLE HOCKY BIG Rs 39.png' },
  { keywords: ['single hockey ss', '1010', 'steel'], image: '215. 1010 RICH LOOK STEEL - TOILET BRUSH SINGLE HOCHY SS Rs 48.png' },
  { keywords: ['double hockey', '8226', '1100'], image: '213. 8226 (1100) TOILET BRUSH DOUBLE HOCKEY Rs 41.png' },
  { keywords: ['jumbo toilet', '3300'], image: '218. 3300 JUMBO TOILET BRUSH DOUBLE HOCKY  Rs 68.png' },
  { keywords: ['sunflower set', '2200'], image: '219. 2200 SUNFLOWER SET (SPL) OUTER LOCK-1.png' },
  { keywords: ['toilet'], image: '201. 1101 RICH LOOK - TOILET BRUSSINGLE HOCKY SMALL Rs 32.png' },

  // Sink brushes
  { keywords: ['1103 sink', 'sink brush 1103'], image: '205. 1103 SINK BRUSH Rs 18.png' },
  { keywords: ['712 sink', 'new sink'], image: '99. NEO SINK BRUSH-Rs 48.png' },
  { keywords: ['2381 sink', '4d square sink'], image: '114. SINK BRUSH 4D SQUARE-Rs 68.png' },
  { keywords: ['1807 sink'], image: '120. SINK BRUSH 1807 A-Rs 39.png' },
  { keywords: ['neo sink'], image: '99. NEO SINK BRUSH-Rs 48.png' },
  { keywords: ['sink'], image: '108. 2381 SINK BRUSH A-Rs 38.png' },

  // Carpet brushes
  { keywords: ['avon carpet', '307 carpet'], image: '83. AVON CARPER BRUSH (307)-Rs 127.png' },
  { keywords: ['1511 carpet', 'new carpet'], image: '113. NEW CARPET BRUSH 1511-Rs 68.png' },
  { keywords: ['gala static', 'gala statis'], image: '84. GALA STATIC BRUSH-Rs 222.png' },
  { keywords: ['carpet'], image: '83. AVON CARPER BRUSH (307)-Rs 127.png' },

  // Long brushes / container brushes
  { keywords: ['8312 container', 'container brush'], image: '91. 8312 CONTAINER BRUSH A-Rs 97.png' },
  { keywords: ['1642 container', 'new container'], image: '119. NEW CONTAINER BRUSH 1642-Rs 141.png' },
  { keywords: ['keetal', '5500'], image: '107. 5500 KEETAL BRUSH-Rs 30.png' },
  { keywords: ['long brush'], image: '91. 8312 CONTAINER BRUSH A-Rs 97.png' },

  // Cobweb cleaners
  { keywords: ['extend cobweb'], image: '221. EXTEND COBWEB SET.png' },
  { keywords: ['cobweb flat'], image: 'cobweb flat-Photoroom.png' },
  { keywords: ['cobweb sunflower'], image: 'cobweb sunflower-Photoroom.png' },
  { keywords: ['cobweb'], image: '221. EXTEND COBWEB SET.png' },

  // Brooms
  { keywords: ['delux nice broom', 'delux'], image: '164. DELUX NICE BROOM 115.png' },
  { keywords: ['sitara broom'], image: '166. SITARA BROOM- 84.png' },
  { keywords: ['supriya broom'], image: '167. SUPRIYA NICE BROOM 115.png' },
  { keywords: ['camel red'], image: '168. CAMEL RED - 65.png' },
  { keywords: ['shine red'], image: '169. SHINE RED- 74.png' },
  { keywords: ['pinky red'], image: '171. PINKY RED BROOM - 78.png' },
  { keywords: ['pinky blue'], image: '172. PINKY BLUE BROOM-78.png' },
  { keywords: ['jumbo red'], image: '173. JUMBO RED BROOM-129.png' },
  { keywords: ['amil red'], image: '174. AMIL RED BROOM- 98.png' },
  { keywords: ['amil blue'], image: '183. AMIL BLUE NICE BROOM 95.png' },
  { keywords: ['tulsi green'], image: '183. TULSI GREEN COVER BROOM-109.png' },
  { keywords: ['mr.clean', 'mr clean'], image: '180. MR.CLEAN- 50.png' },
  { keywords: ['chennai burma cover'], image: '185. chennai burma cover- 93.png' },
  { keywords: ['lady dream plastic'], image: '186. Lady Dream Plastic - 111.png' },
  { keywords: ['chennai burma plastic'], image: '188. chennai burma plastic- 88.png' },
  { keywords: ['fan broom', 'spl fan'], image: '86. FAN BROOM SPL-Rs 215.png' },
  { keywords: ['fancy broom'], image: 'fancy broom-Photoroom.png' },
  { keywords: ['broom'], image: '164. DELUX NICE BROOM 115.png' },

  // Wipers / Glass wipers
  { keywords: ['glass wiper', '3008'], image: '87. 3008 GLASS WIPER Rs 52.JPG' },
  { keywords: ['window wiper'], image: '88. WINDOW WIPER Rs 50.JPG' },
  { keywords: ['venus floor wiper', 'floor wiper'], image: '150. VENUS FLOOR WIPER 18 INCH- rs104.png' },
  { keywords: ['ironman wiper', '20 inch wiper'], image: '155.IRONMAN 20 INCH WIPER- rs 185.JPG' },
  { keywords: ['wiper'], image: '87. 3008 GLASS WIPER Rs 52.JPG' },

  // Scrubbers / Pads
  { keywords: ['ss scrubber', 'scrubber patta'], image: '160. SS SCRUBBER PATTA- rs 65.JPG' },
  { keywords: ['plastic scrubber'], image: '163 PLASTIC SCRUBBER RS81.JPG' },
  { keywords: ['green pad'], image: '159 GREEN PAD 10X15 (10PCS) RS 52.JPG' },
  { keywords: ['metal pad'], image: '124. METAL PAD-Rs 11.png' },
  { keywords: ['magic sponge'], image: '101. MAGIC SPONGE-Rs 68.png' },

  // Iron / Cloth brushes
  { keywords: ['8201 white iron', 'white iron brush'], image: '102. 8201 WHITE IRON BRUSH-Rs 52.png' },
  { keywords: ['supreem iron', 'supreme iron'], image: '103. SUPREEM IRON BRUSH-Rs 68.png' },
  { keywords: ['black iron'], image: '104. BLACK IRON BRUSH-Rs 68.png' },
  { keywords: ['6606 cloth', 'cloth brush'], image: '116. 6606 CLOTH BRUSH-Rs 50.png' },

  // Kitchen / Cleaning towels
  { keywords: ['kitchen roll', '45x500'], image: '82. KITCHEN ROLL 45X500-Rs 295.png' },
  { keywords: ['fablas kitchen', 'fablas'], image: '96. FABLAS KITCHEN ROLL-Rs 186.png' },
  { keywords: ['cleaning towel', 'towel'], image: '125. CLEANING TOWEL-Rs 59.png' },
  { keywords: ['kitchen wiper', 'samarthya', 'samarthya kitchen'], image: '105. SAMARTHYA A1 KITCHEN WIPER Rs 45.JPG' },

  // Polishes
  { keywords: ['silver polish'], image: '117. SILVER POLISH-Rs 68.png' },
  { keywords: ['metal polish'], image: '118. METAL POLISH-Rs 111.png' },

  // Mops
  { keywords: ['twist mop ss', 'twist mop steel'], image: 'TWIST MOP SS-Photoroom.png' },
  { keywords: ['twist mop colour', 'twist mop color'], image: 'twist mop colour a-Photoroom.png' },
  { keywords: ['dodie mop', 'dodie'], image: 'DODIE-MOP-Photoroom.png' },
  { keywords: ['i-mop', 'imop'], image: 'I-MOP-Photoroom.png' },
  { keywords: ['london mop', 'londonmop'], image: 'londonmop-Photoroom.png' },
  { keywords: ['white mop', 'whitemop'], image: 'whitemop-Photoroom.png' },
  { keywords: ['stainless steel mop', 'ss mop'], image: 'STAINLESS STEEL - MOP-Photoroom.png' },
  { keywords: ['spanish mop', 'spanish'], image: 'spanish-Photoroom.png' },
  { keywords: ['mexican mop', 'mexican'], image: 'MEXICAN-Photoroom.png' },
  { keywords: ['mop'], image: 'TWIST MOP SS-Photoroom.png' },

  // Dusters
  { keywords: ['feather duster', '147'], image: '147 FEATHER DUSTER SMALL RS49.JPG' },
  { keywords: ['mini duster', '109'], image: '109. MINI DUSTER SPL 43 GM-Rs 43.png' },
  { keywords: ['duster'], image: '109. MINI DUSTER SPL 43 GM-Rs 43.png' },

  // Murams (dusters/brushes)
  { keywords: ['samarthya muram'], image: '92. SAMARTHYA MURAM-Rs 68.png' },
  { keywords: ['muram special'], image: '93. MURAM SPECIAL-Rs 57.png' },
  { keywords: ['muram sada big', 'muram big'], image: '94. MURAM SADA BIG-Rs 42.png' },
  { keywords: ['muram small', 'muram sada small'], image: '95MURAM SMALL SADA-Rs 34.png' },
  { keywords: ['muram with brush', '1109'], image: '106. MURAM WITH BRUSH 109 SMALL-Rs 29.png' },
  { keywords: ['muram'], image: '92. SAMARTHYA MURAM-Rs 68.png' },

  // Micro cups / Gloves
  { keywords: ['micro cup', 'ncb 4060'], image: '89. NCB 4060 MICRO CUP 160 GM-Rs 118.png' },
  { keywords: ['micro ss', 'micro round', 'zh 09'], image: '90. ZH 09-13 MICRO SSROUND FD 215 GM-Rs 186.png' },
  { keywords: ['micro gloves', 'z 12'], image: '98. Z 12 MICRO GLOVES-Rs 71.png' },

  // Hardy sets
  { keywords: ['hardy set big', '9967 big', '9967 spl big'], image: '80. 9967 SPL HARDY SET BIG A-Rs 288.png' },
  { keywords: ['hardy set', '9965', '9967'], image: '81. 9965 SPL HARDY SET-Rs 229.png' },

  // Double hockey brushes
  { keywords: ['double hockey new', '8851'], image: '85. 8851 DOUBLE HOCKEY NEW MODAL-Rs 77.png' },

  // Fridge cover
  { keywords: ['fridge cover'], image: '121. FRIDGE COVER-Rs 68.png' },

  // THK items
  { keywords: ['thk 1108'], image: '122. THK 1108-Rs 68.png' },
  { keywords: ['thk 140'], image: '123. THK 140 A-Rs 111.png' },

  // Soft brush sets
  { keywords: ['lady dream soft', 'lady dream softbrush'], image: 'LADY DREAM softbrush set-Photoroom.png' },
  { keywords: ['soft brush'], image: 'soft brush-Photoroom.png' },

  // Mates (cloth/cleaning materials)
  { keywords: ['mate'], image: 'mate-1-Photoroom.png' },

  // Sink squire
  { keywords: ['sink squire', '9967 sink'], image: '100. SUPREME SINK SQUIRE Rs 57.JPG' },

  // Products kit (kits)
  { keywords: ['fabric conditioner', 'products kit fabric'], image: '/images/FINAL IMAGES/IMG-20250228-WA0039[1]-Photoroom.png' },
  { keywords: ['liquid detergent ultra', 'liquid detergent – ultra'], image: '/images/FINAL IMAGES/IMG-20250228-WA0041[1]-Photoroom.png' },
  { keywords: ['liquid detergent smart', 'liquid detergent – smart'], image: '/images/FINAL IMAGES/IMG-20250228-WA0044[1]-Photoroom.png' },
  { keywords: ['dish washi', 'dishwash', 'dish wash liquid'], image: '/images/FINAL IMAGES/IMG-20250228-WA0045[1]-Photoroom.png' },
];

function findImageForProduct(productName) {
  const nameLower = productName.toLowerCase();
  for (const entry of IMAGE_MAP) {
    if (entry.keywords.some(kw => nameLower.includes(kw.toLowerCase()))) {
      // If it's already a full path return as-is
      if (entry.image.startsWith('/images/')) {
        return { url: entry.image, key: entry.image };
      }
      const path = `/images/CATALOG IMAGES/${entry.image}`;
      return { url: path, key: path };
    }
  }
  return null;
}

async function fixImageUrls() {
  console.log('Connecting to database...');
  
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  let fixed = 0;
  let noImageFound = 0;
  let alreadyOk = 0;

  for (const product of products) {
    const hasS3Images = product.images.some(img => 
      img.url && (img.url.includes('amazonaws.com') || img.url.includes('s3.'))
    );
    const hasLocalImages = product.images.some(img => 
      img.url && (img.url.startsWith('/images/') || img.url.startsWith('/uploads/'))
    );
    const hasNoImages = product.images.length === 0;

    if (!hasS3Images && !hasNoImages) {
      alreadyOk++;
      continue;
    }

    const imageEntry = findImageForProduct(product.name);
    
    if (!imageEntry) {
      // Keep /images/placeholder-product.svg as fallback
      if (hasNoImages || hasS3Images) {
        await Product.findByIdAndUpdate(product._id, {
          images: [{
            url: '/images/placeholder-product.svg',
            key: 'placeholder',
            alt: product.name,
            isPrimary: true
          }]
        });
        console.log(`[NO MATCH] ${product.name} → placeholder`);
        noImageFound++;
      }
      continue;
    }

    await Product.findByIdAndUpdate(product._id, {
      images: [{
        url: imageEntry.url,
        key: imageEntry.key,
        alt: product.name,
        isPrimary: true
      }]
    });

    console.log(`[FIXED] ${product.name} → ${imageEntry.url}`);
    fixed++;
  }

  console.log('\n=== Summary ===');
  console.log(`Total products: ${products.length}`);
  console.log(`Fixed (S3 → local): ${fixed}`);
  console.log(`Set to placeholder (no match): ${noImageFound}`);
  console.log(`Already OK: ${alreadyOk}`);
  
  await mongoose.disconnect();
  console.log('Done!');
}

fixImageUrls().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
