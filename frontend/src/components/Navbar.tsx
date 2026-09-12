'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Utensils,
  ShoppingBag,
  MenuIcon,
  X,
  UserIcon,
  LogOut,
  LayoutDashboard,
  Calendar,
} from './Icons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { totalItems } = useCart();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservation' },
    { name: 'My Orders', href: '/orders' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Utensils size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-gray-900 font-sans">
                Dine<span className="text-orange-600">Desk</span>
              </span>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-orange-500 -mt-1">
                Artisan Dining & Ordering
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isStaff && (
              <Link
                href="/staff/dashboard"
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive('/staff/dashboard')
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Utensils size={14} />
                Kitchen KDS
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  isActive('/admin/dashboard')
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <LayoutDashboard size={14} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Table Reservation Button */}
            <Link
              href="/reservation"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors"
            >
              <Calendar size={14} />
              Book Table
            </Link>

            {/* Cart Button with Count Badge */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Actions */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 hover:bg-orange-50/80 p-1.5 rounded-xl transition-all group"
                  title="View My Profile & Order History"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-200 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-orange-600">
                      {user.role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-orange-600 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl shadow-xs transition-all hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-orange-600"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-orange-600"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isStaff && (
            <Link
              href="/staff/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-blue-700 bg-blue-50"
            >
              Kitchen KDS Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
            >
              Admin Control Panel
            </Link>
          )}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 rounded-xl bg-orange-50/60 hover:bg-orange-50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-orange-600">{user.email} ({user.role})</p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-orange-200">
                    Profile →
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-sm text-red-600 font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-orange-600 text-white font-semibold text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
