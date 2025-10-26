"use client"
import { useState } from 'react'

export default function RequestQuoteFab(){
  const [open, setOpen] = useState(false)
  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="fixed right-6 bottom-6 bg-header-cta text-header-cta-text px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-pulse"
      >
        Request Quote
      </button>

      {open && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div 
            className="bg-tile-bg rounded-lg p-6 w-full max-w-md shadow-xl transition-all duration-300 transform"
          >
            <h3 className="text-lg font-semibold text-tile-text-primary">Request a Quote</h3>
            <form className="mt-4 flex flex-col gap-3">
              <input 
                placeholder="Name" 
                className="bg-white border border-tile-text-secondary p-2 rounded-lg focus:outline-none focus:border-header-bg transition-colors" 
              />
              <input 
                placeholder="Company" 
                className="bg-white border border-tile-text-secondary p-2 rounded-lg focus:outline-none focus:border-header-bg transition-colors" 
              />
              <input 
                placeholder="Email" 
                type="email"
                className="bg-white border border-tile-text-secondary p-2 rounded-lg focus:outline-none focus:border-header-bg transition-colors" 
              />
              <textarea 
                placeholder="Details" 
                rows={4}
                className="bg-white border border-tile-text-secondary p-2 rounded-lg focus:outline-none focus:border-header-bg transition-colors resize-none" 
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setOpen(false)} 
                  className="px-4 py-2 border border-tile-text-secondary text-tile-text-secondary rounded-lg hover:border-tile-text-primary hover:text-tile-text-primary transition-colors"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-header-cta text-header-cta-text rounded-lg hover:bg-header-cta/90 transition-colors"
                >
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
