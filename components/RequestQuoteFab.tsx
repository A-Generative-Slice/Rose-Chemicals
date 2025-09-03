"use client"
import { useState } from 'react'

export default function RequestQuoteFab(){
  const [open, setOpen] = useState(false)
  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="fixed right-6 bottom-6 bg-accent text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-pulse"
      >
        Request Quote
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transition-all duration-300 transform"
          >
            <h3 className="text-lg font-semibold text-gray-800">Request a Quote</h3>
            <form className="mt-4 flex flex-col gap-3">
              <input 
                placeholder="Name" 
                className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-primary transition-colors" 
              />
              <input 
                placeholder="Company" 
                className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-primary transition-colors" 
              />
              <input 
                placeholder="Email" 
                type="email"
                className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-primary transition-colors" 
              />
              <textarea 
                placeholder="Details" 
                rows={4}
                className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none" 
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setOpen(false)} 
                  className="btn-secondary"
                >
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
