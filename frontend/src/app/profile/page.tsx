'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ordersApi, reservationsApi } from '../../lib/api';
import { Order, Reservation } from '../../types';
import {
  UserIcon,
  ShoppingBag,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  LogOut,
  Utensils,
  LayoutDashboard,
  ShieldCheck,
  Phone,
  AlertCircle,
} from '../../components/Icons';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAdmin, isStaff, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'RESERVATIONS'>('ORDERS');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchUserData() {
      try {
        setLoading(true);
        const [ordersRes, reservationsRes] = await Promise.all([
          ordersApi.getMyOrders().catch(() => ({ success: false, data: [] })),
          reservationsApi.getMyReservations().catch(() => ({ success: false, data: [] })),
        ]);

        if (ordersRes.data) setOrders(ordersRes.data);
        if (reservationsRes.data) setReservations(reservationsRes.data);
      } catch (err) {
        console.error('Error fetching user profile data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-stone-50 py-16 px-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto">
            <UserIcon size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Sign in to Your Account</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Access your personalized order history, live delivery tracking, and VIP dining table reservations.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 shadow-md transition-all"
            >
              Sign In to DineDesk
            </Link>
            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-stone-100 text-gray-800 font-bold text-sm hover:bg-stone-200 transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'READY':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {user.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isAdmin
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : isStaff
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {user.role === 'ADMIN'
                    ? 'Restaurant Admin'
                    : user.role === 'STAFF'
                    ? 'Kitchen Staff'
                    : 'Artisan Patron'}
                </span>
              </div>
              <p className="text-xs text-gray-500">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone size={12} /> {user.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isStaff && (
              <Link
                href="/staff/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                <Utensils size={14} />
                Kitchen KDS
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
              >
                <LayoutDashboard size={14} />
                Admin Console
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-bold transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ORDERS'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <ShoppingBag size={16} />
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('RESERVATIONS')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'RESERVATIONS'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <Calendar size={16} />
            Table Bookings ({reservations.length})
          </button>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Experience our artisanal dishes crafted fresh by our master culinary team.
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-gray-900 text-sm">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-700">
                      {order.items?.length || 0} items •{' '}
                      <span className="font-semibold">{order.orderType}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Total
                      </span>
                      <span className="text-base font-black text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-600 hover:text-white text-xs font-bold transition-colors"
                    >
                      Track
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Table Bookings */}
        {activeTab === 'RESERVATIONS' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Reservations</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Reserve an intimate candle-lit table for birthdays, celebrations, or family dinners.
                </p>
                <Link
                  href="/reservation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors"
                >
                  Book a Table
                </Link>
              </div>
            ) : (
              reservations.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">
                        Table for {res.guests} Guests
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        {res.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Calendar size={12} className="text-orange-600" />
                        {res.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Clock size={12} className="text-orange-600" />
                        {res.time}
                      </span>
                    </div>
                    {res.specialRequest && (
                      <p className="text-xs text-gray-500 italic mt-1">
                        Note: &ldquo;{res.specialRequest}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-gray-400">
                    Booked for <span className="font-bold text-gray-800">{res.customerName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
