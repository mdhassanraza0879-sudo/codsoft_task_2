'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem } from '../../../types';
import { menuApi } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';
import {
  Star,
  Clock,
  Flame,
  Leaf,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle,
} from '../../../components/Icons';

export default function MenuItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const res = await menuApi.getMenuItemById(id);
        if (res.success && res.data) {
          setItem(res.data);
        } else {
          setError(res.message || 'Item not found');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading dish');
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!item || !item.isAvailable) return;
    addToCart(item, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-500">Preparing dish details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Dish Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || 'This dish is not available.'}</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-colors"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-orange-600 transition-colors">
            Menu
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{item.name}</span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Dish Image */}
          <div className="lg:col-span-6 relative h-96 lg:h-auto min-h-[400px] bg-stone-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
            {/* Dietary Tags Overlay */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              {item.isVeg ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  <Leaf size={14} /> 100% Vegetarian
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  Non-Veg Signature
                </span>
              )}

              {item.isSpicy && (
                <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  <Flame size={14} /> Chef Spicy Blend
                </span>
              )}
            </div>

            {!item.isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-lg px-6 py-2 rounded-2xl shadow-xl uppercase tracking-wider">
                  Currently Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Dish Info & Purchase */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  {item.category?.name || 'Artisan Special'}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                  <Star size={18} fill="currentColor" />
                  <span>4.9 / 5.0 (120+ ratings)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {item.name}
              </h1>

              <div className="text-3xl font-black text-orange-600">
                ${item.price.toFixed(2)}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                {item.description}
              </p>

              {/* Prep Time & Kitchen Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block">Prep Time</span>
                    <span className="text-sm font-bold text-gray-800">{item.preparationTime} Minutes</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block">Quality</span>
                    <span className="text-sm font-bold text-gray-800">Fresh To Order</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Quantity & Add to Cart */}
            <div className="pt-8 mt-8 border-t border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-stone-200 text-gray-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-stone-200 text-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right flex-1">
                  <span className="text-xs text-gray-400">Total Price</span>
                  <div className="text-lg font-black text-gray-900">
                    ${(item.price * quantity).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={!item.isAvailable}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all ${
                    !item.isAvailable
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25 hover:scale-[1.01]'
                  }`}
                >
                  <ShoppingBag size={20} />
                  {isAdded ? 'Added to Cart!' : `Add to Cart • $${(item.price * quantity).toFixed(2)}`}
                </button>

                <Link
                  href="/cart"
                  className="px-6 py-4 rounded-2xl font-bold text-sm bg-stone-100 hover:bg-stone-200 text-gray-800 transition-colors flex items-center justify-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
