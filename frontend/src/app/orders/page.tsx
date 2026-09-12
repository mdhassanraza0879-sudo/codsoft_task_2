'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '../../types';
import { ordersApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
} from '../../components/Icons';

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchNumber, setSearchNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        if (user) {
          const res = await ordersApi.getMyOrders();
          if (res.success && res.data) {
            setOrders(res.data);
          }
        } else {
          // If guest, fetch recent orders from public or fallback sample
          const sample = await ordersApi.getOrderById('DD-2026-1001').catch(() => null);
          if (sample?.data) {
            setOrders([sample.data]);
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNumber.trim()) {
      router.push(`/orders/${encodeURIComponent(searchNumber.trim())}`);
    }
  };

  const getStatusColor = (status: string) => {
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            Real-Time Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1">
            Order Status & History
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your Order ID or reference number below to view live kitchen status and courier progress.
          </p>
        </div>

        {/* Quick Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-12">
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="Enter Order ID or Number (e.g. DD-2026-1001)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all whitespace-nowrap"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Orders Listing */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-gray-900">
            {user ? 'Your Recent Orders' : 'Sample Active Orders'}
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="h-32 bg-white rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
              <p className="text-sm text-gray-500 mb-6">
                You have not placed any orders yet. Check out our menu!
              </p>
              <Link
                href="/menu"
                className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
              >
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-gray-900">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items • {order.orderType}
                    </p>

                    <div className="text-sm font-bold text-gray-900">
                      Total: <span className="text-orange-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs transition-colors"
                  >
                    <span>View Live Timeline</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
