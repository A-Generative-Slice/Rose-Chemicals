"use client"
import React, { useEffect, useState } from "react";
import { cartAPI } from "../src/services/api";

export default function CartModal({ open, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      cartAPI.getCart().then(data => {
        setCart(data.cart || data);
        setLoading(false);
      }).catch(() => {
        setCart(null);
        setLoading(false);
      });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {loading ? (
          <div>Loading...</div>
        ) : cart && cart.items && cart.items.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {cart.items.map(item => (
              <li key={item.product._id} className="py-2 flex justify-between items-center">
                <span>{item.product.name}</span>
                <span>x {item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>Your cart is empty.</div>
        )}
      </div>
    </div>
  );
}
