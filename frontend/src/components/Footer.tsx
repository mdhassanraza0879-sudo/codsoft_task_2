import React from 'react';
import Link from 'next/link';
import { Utensils, Phone, Clock, MapPin, ShieldCheck, Heart } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-6 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Fresh Ingredients Guaranteed</h4>
              <p className="text-orange-100 text-sm">Farm-fresh produce and artisan spices delivered to your table every single day.</p>
            </div>
          </div>
          <Link
            href="/menu"
            className="px-6 py-2.5 bg-white text-orange-700 font-bold rounded-full shadow-md hover:bg-orange-50 transition-all hover:scale-105 text-sm whitespace-nowrap"
          >
            Explore Menu Now
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <Utensils size={20} />
              </div>
              <span className="text-2xl font-black text-white">
                Dine<span className="text-orange-500">Desk</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Experience the pinnacle of culinary artistry. From sizzlers to authentic biryanis and gourmet desserts, DineDesk blends passion with flavor.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Kitchen is currently accepting online orders
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-orange-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-orange-400 transition-colors">
                  Full Menu & Specials
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="hover:text-orange-400 transition-colors">
                  Table Reservations
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-orange-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-orange-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-orange-400">
              Opening Hours
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-orange-500 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-200">Monday - Friday</p>
                  <p className="text-xs">Lunch: 11:30 AM - 3:30 PM</p>
                  <p className="text-xs">Dinner: 5:30 PM - 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="text-orange-500 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-200">Saturday & Sunday</p>
                  <p className="text-xs">All Day: 11:00 AM - 11:30 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-orange-400">
              Visit & Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-orange-500 mt-1 shrink-0" />
                <span>402 Gourmet Blvd, Royal Plaza, Culinary Heights</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <span>+1 (800) 555-DINE (3463)</span>
              </li>
              <li className="text-xs text-gray-500 pt-2">
                Need support? Email us at <span className="text-orange-400 font-medium">support@dinedesk.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} DineDesk Restaurant Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            CodSoft Full Stack Web Development Internship • Task 2
          </p>
        </div>
      </div>
    </footer>
  );
}
