import ProductCard from './ProductCard'

const SAMPLE = [
  { id: 1, name: 'Thulasi Broom', price: '₹499', image: '/images/thulasi-broom.jpg' },
  { id: 2, name: 'Avon Carpet Brush', price: '₹349', image: '/images/avon-brush.jpg' },
  { id: 3, name: 'Pro Mop', price: '₹799', image: '/images/pro-mop.jpg' },
  { id: 4, name: 'Soft Duster', price: '₹199', image: '/images/soft-duster.jpg' }
]

export default function Featured(){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {SAMPLE.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
