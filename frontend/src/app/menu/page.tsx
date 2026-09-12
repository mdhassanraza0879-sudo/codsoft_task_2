'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { MenuItem, Category } from '../../types';
import { menuApi } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import {
  Search,
  Star,
  Clock,
  Flame,
  Leaf,
  ShoppingBag,
  Utensils,
  X,
} from '../../components/Icons';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [loading, setLoading] = useState<boolean>(true);
  const [addedItemIds, setAddedItemIds] = useState<{ [key: string]: boolean }>({});

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [catRes, itemsRes] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getMenu(),
        ]);

        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        if (itemsRes.success && itemsRes.data) {
          setMenuItems(itemsRes.data);
        }
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleAddToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    addToCart(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (selectedCategory !== 'all') {
      const matchCat =
        item.category?.slug === selectedCategory ||
        item.categoryId === selectedCategory;
      if (!matchCat) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // Veg filter
    if (filterVegOnly && !item.isVeg) return false;

    // Spicy filter
    if (filterSpicyOnly && !item.isSpicy) return false;

    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            Artisan Recipes
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mt-1">
            Our Complete Menu
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Explore our curated culinary masterworks crafted daily with passion, authenticity, and fresh ingredients.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-10 space-y-6">
          {/* Top Row: Search & Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name or ingredients..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-stone-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick toggles (Veg / Spicy) & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => setFilterVegOnly(!filterVegOnly)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  filterVegOnly
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                }`}
              >
                <Leaf size={14} />
                Veg Only
              </button>

              <button
                onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  filterSpicyOnly
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                }`}
              >
                <Flame size={14} />
                Spicy
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 border-none text-xs font-bold text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="featured">Featured First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-gray-100">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
              }`}
            >
              All Categories ({menuItems.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-80 bg-white rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No dishes matched your filters</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Try removing some search keywords or changing the selected category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterVegOnly(false);
                setFilterSpicyOnly(false);
              }}
              className="mt-5 px-6 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
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

                      {item.isPopular && (
                        <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Prep time badge */}
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock size={12} />
                      {item.preparationTime} mins
                    </div>

                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-600 text-white font-black text-sm px-4 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase text-orange-600 tracking-wider">
                        {item.category?.name || 'Artisan Special'}
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

                {/* Footer Action */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                  <div>
                    <span className="text-xs text-gray-400 font-medium">Price</span>
                    <p className="text-2xl font-black text-gray-900">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    disabled={!item.isAvailable}
                    onClick={() => handleAddToCart(item)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      !item.isAvailable
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : addedItemIds[item.id]
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
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-orange-600 font-bold">
          Loading Menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
