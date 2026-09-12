'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Flame,
} from '../../components/Icons';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    total,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 py-16 px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Looks like you haven&apos;t added any mouth-watering dishes yet. Explore our freshly prepared menu and treat your tastebuds!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all hover:scale-[1.01]"
          >
            Explore Full Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Your Order Basket
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review selected dishes before proceeding to secure checkout.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3.5 py-2 rounded-xl border border-red-200 transition-colors"
          >
            <Trash2 size={14} />
            Clear Basket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ menuItem, quantity }) => (
              <div
                key={menuItem.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5"
              >
                {/* Item Thumbnail & Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-stone-100">
                    <Image
                      src={menuItem.image}
                      alt={menuItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {menuItem.isVeg ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Leaf size={10} /> Veg
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          Non-Veg
                        </span>
                      )}
                      {menuItem.isSpicy && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Flame size={10} /> Spicy
                        </span>
                      )}
                    </div>
                    <Link href={`/menu/${menuItem.id}`}>
                      <h3 className="text-base font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                        {menuItem.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ${menuItem.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                {/* Counter & Subtotal Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                      className="p-2 hover:bg-stone-200 text-gray-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                      className="p-2 hover:bg-stone-200 text-gray-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-black text-gray-900">
                      ${(menuItem.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                ← Add more culinary dishes from the menu
              </Link>
            </div>
          </div>

          {/* Bill Summary & Checkout Trigger */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
            <h2 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes & Restaurant GST (5%)</span>
                <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Truck size={16} className="text-orange-600" />
                  Estimated Delivery Fee
                </span>
                <span className="font-bold text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 35 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl">
                  Add ${(35 - subtotal).toFixed(2)} more to qualify for <span className="font-bold">FREE delivery!</span>
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block">Total Payable</span>
                <span className="text-3xl font-black text-gray-900">${total.toFixed(2)}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Guaranteed Hot
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Safe & Encrypted 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
