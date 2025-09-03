export default function ProductCard({ product }: { product: any }){
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="overflow-hidden rounded-lg">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-contain transform transition-transform duration-300 hover:scale-105"
        />
      </div>
      <h3 className="mt-3 font-medium text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.price}</p>
      <div className="mt-3 flex gap-2">
        <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-4 rounded-lg 
                         hover:bg-blue-700 transition-colors duration-200">
          Add to Cart
        </button>
        <button className="flex-1 border border-gray-200 text-sm py-2 px-4 rounded-lg
                         hover:border-blue-600 hover:text-blue-600 transition-colors duration-200">
          Request a Quote
        </button>
      </div>
    </div>
  )
}
