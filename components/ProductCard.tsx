export default function ProductCard({ product }: { product: any }){
  return (
    <div className="bg-tile-bg rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-tertiary">
      <div className="overflow-hidden rounded-lg bg-white">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-contain transform transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="mt-3 font-medium text-tile-text-primary">{product.name}</h3>
      <p className="text-sm text-tile-text-secondary">{product.price}</p>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 bg-header-cta text-header-cta-text font-medium text-sm py-2 px-4 rounded-lg 
                         hover:bg-highlight/90 transition-colors duration-200">
          Add to Cart
        </button>
        <button className="flex-1 bg-transparent border border-tile-text-secondary text-tile-text-secondary text-sm py-2 px-4 rounded-lg
                         hover:border-tile-text-primary hover:text-tile-text-primary transition-colors duration-200">
          Request Quote
        </button>
      </div>
    </div>
  )
}
