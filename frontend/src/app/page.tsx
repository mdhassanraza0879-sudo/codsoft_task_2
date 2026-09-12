'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItem, Category } from '../types';
import { menuApi } from '../lib/api';
import { useCart } from '../context/CartContext';
import {
  Utensils,
  Star,
  Clock,
  Flame,
  Leaf,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChefHat,
  Calendar,
  Sparkles,
} from '../components/Icons';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catRes, menuRes] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getMenu({ isPopular: true }),
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        if (menuRes.success && menuRes.data) {
          setPopularItems(menuRes.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-stone-50 to-stone-50 py-16 lg:py-24 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-orange-600" />
                <span>Premier Culinary Experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
                Savor Every Moment With{' '}
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Artisan Dining
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                From sizzling chef-crafted appetizers to rich royal dum biryanis and wood-fired sourdough pizzas. Order online for lightning-fast delivery or book an intimate dining table.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-amber-600 transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag size={20} />
                  Order Food Now
                </Link>

                <Link
                  href="/reservation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-base hover:bg-orange-50/50 hover:border-orange-200 transition-all"
                >
                  <Calendar size={20} className="text-orange-600" />
                  Reserve a Table
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-gray-200/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-lg font-black text-gray-900">4.9/5</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Over 2,500+ Reviews</p>
                </div>

                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-orange-600">
                    <Clock size={18} />
                    <span className="text-lg font-black text-gray-900">25-35m</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Average Delivery Time</p>
                </div>

                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-emerald-600">
                    <Leaf size={18} />
                    <span className="text-lg font-black text-gray-900">100%</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Organic & Fresh</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-amber-300 rounded-3xl blur-2xl opacity-30"></div>

                <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl bg-white aspect-4/3 sm:aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                    alt="DineDesk Signature Gourmet Feast"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Floating Promo Chip */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                        🔥
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">Chef&apos;s Royal Feast</h3>
                        <p className="text-xs text-gray-500">Free gourmet dessert on orders $40+</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1.5 bg-orange-600 text-white rounded-lg">
                      HOT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOOD CATEGORIES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Our Curated Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
              Explore By Category
            </h2>
          </div>
          <Link
            href="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            View Complete Menu
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, idx) => (
              <div key={idx} className="h-36 bg-gray-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/menu?category=${category.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-lg hover:border-orange-200 transition-all hover:-translate-y-1"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-orange-100 group-hover:border-orange-500 transition-colors">
                  <Image
                    src={
                      category.image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. POPULAR DISHES SECTION */}
      <section className="py-20 bg-stone-100/60 border-y border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
              Customer Favorites
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
              Popular Dishes This Week
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Cooked to perfection using the finest seasonal herbs and prime ingredients.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-80 bg-white rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Food Thumbnail */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {item.isVeg ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                            <Leaf size={12} /> Veg
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                            Non-Veg
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                            <Flame size={12} /> Spicy
                          </span>
                        )}
                      </div>

                      {/* Prep Time pill */}
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock size={12} />
                        {item.preparationTime} mins
                      </div>
                    </div>

                    {/* Food Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold uppercase text-orange-600 tracking-wider">
                          {item.category?.name || 'Chef Special'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star size={14} fill="currentColor" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <Link href={`/menu/${item.id}`}>
                        <h3 className="text-lg font-black text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                    <div>
                      <span className="text-xs text-gray-400 font-medium">Price</span>
                      <p className="text-2xl font-black text-gray-900">${item.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        addedItemIds[item.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      {addedItemIds[item.id] ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE DINEDESK */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600">
            The DineDesk Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
            Why DineDesk Stands Out
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every dish tells a story of relentless dedication to hygiene, flavor, and swift service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
              <Truck size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Doorstep Delivery</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thermal-insulated packaging ensures your food reaches you smoking hot within 30 minutes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Effortless Reservations</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Skip queues by reserving your fine dining table in seconds with immediate confirmation.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
              <ChefHat size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Master Chefs & Fresh Food</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Prepared daily from scratch with farm-fresh ingredients and zero artificial preservatives.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Order Tracking</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time updates from kitchen preparation right up to delivery at your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RESTAURANT STORY / AMBIANCE SECTION */}
      <section className="py-20 bg-stone-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
                Our Heritage & Ambiance
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Where Culinary Passion Meets Unforgettable Memories
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                Founded with a mission to redefine everyday dining, DineDesk seamlessly unites heritage culinary tradition with modern speed. Whether you are hosting a romantic candlelit dinner, gathering with family, or ordering your midnight craving, our kitchen caters with uncompromising love.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                <div>
                  <h4 className="text-3xl font-black text-orange-500">15+</h4>
                  <p className="text-xs text-gray-400 mt-1">Years of Culinary Excellence</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-orange-500">50K+</h4>
                  <p className="text-xs text-gray-400 mt-1">Delighted Guests Served</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all"
                >
                  Book Your Dining Table
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                  alt="DineDesk Dining Room"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                  alt="DineDesk Kitchen Fire"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-10 sm:p-16 overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                Instant Online Ordering
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready for an Unmatched Feast?
              </h2>
              <p className="text-orange-100 text-base leading-relaxed">
                Order your favorites now and enjoy fast, hot, and hygienic doorstep delivery.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="px-8 py-4 bg-white text-orange-700 font-extrabold rounded-2xl shadow-lg hover:bg-orange-50 transition-all hover:scale-105 text-sm"
                >
                  Browse Full Menu
                </Link>
                <Link
                  href="/reservation"
                  className="px-8 py-4 bg-orange-950/40 border border-white/20 text-white font-extrabold rounded-2xl hover:bg-orange-950/60 transition-all text-sm"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
