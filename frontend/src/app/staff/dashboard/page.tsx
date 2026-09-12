'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { ordersApi } from '../../../lib/api';
import { Order, OrderStatus } from '../../../types';
import {
  Utensils,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  AlertCircle,
  Phone,
  MapPin,
  X,
} from '../../../components/Icons';

export default function StaffDashboardPage() {
  const { user, isStaff, login } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getAllOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err: any) {
      console.error('Error loading kitchen orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) {
      fetchOrders();
      const timer = setInterval(fetchOrders, 10000); // 10s auto-refresh
      return () => clearInterval(timer);
    } else {
      setLoading(false);
    }
  }, [isStaff]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await ordersApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(null), 3000);
        await fetchOrders();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick staff auth helper if guest
  const handleQuickStaffLogin = async () => {
    try {
      setLoading(true);
      await login({ email: 'staff@dinedesk.com', password: 'staff123' });
    } catch (err: any) {
      alert(err.message || 'Staff login failed');
    }
  };

  if (!isStaff) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 py-16 px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
            <ChefHat size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Staff Portal Access</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This dashboard is restricted to authorized kitchen and service personnel.
            </p>
          </div>
          <button
            onClick={handleQuickStaffLogin}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
          >
            ⚡ Login as Kitchen Staff (Demo)
          </button>
          <div className="text-xs text-gray-400">
            or{' '}
            <Link href="/login" className="text-orange-600 font-bold hover:underline">
              Sign In with another account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'ALL') return true;
    if (selectedStatusFilter === 'ACTIVE') {
      return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.orderStatus);
    }
    return o.orderStatus === selectedStatusFilter;
  });

  return (
    <div className="min-h-screen bg-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-700">
                Kitchen Display System (KDS)
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              Live Orders & Prep Queue
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                ✓ {statusMessage}
              </span>
            )}
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-stone-50"
            >
              🔄 Refresh Queue
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {['ALL', 'ACTIVE', 'PENDING', 'PREPARING', 'READY', 'DELIVERED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatusFilter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-stone-50 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Order Tickets Grid */}
        {loading && orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-gray-500">Loading live kitchen queue...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl p-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">No orders in this status</h3>
            <p className="text-xs text-gray-500 mt-1">All kitchen stations are clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-base font-black text-gray-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400 block">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.orderType}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                          order.orderStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : order.orderStatus === 'PREPARING'
                            ? 'bg-orange-100 text-orange-800 animate-pulse'
                            : order.orderStatus === 'READY'
                            ? 'bg-purple-100 text-purple-800'
                            : order.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="flex items-center gap-1.5 text-gray-500">
                        <Phone size={12} /> {order.customerPhone}
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-500 line-clamp-1">
                        <MapPin size={12} /> {order.deliveryAddress}
                      </p>
                      {order.specialInstructions && (
                        <p className="p-2 bg-amber-50 text-amber-900 rounded-lg font-medium mt-2">
                          Note: {order.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Ordered Items Checklist */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
                        Kitchen Items
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {order.items?.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-stone-50"
                          >
                            <span className="font-bold text-gray-900">
                              <span className="text-blue-600 mr-1.5">{item.quantity}x</span>
                              {item.menuItem?.name}
                            </span>
                            <span className="text-gray-400 font-mono">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Transition Buttons */}
                  <div className="pt-4 mt-6 border-t border-gray-100 space-y-2">
                    {order.orderStatus === 'PENDING' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                        className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <ChefHat size={16} />
                        Accept & Start Preparing
                      </button>
                    )}

                    {order.orderStatus === 'PREPARING' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Mark as Ready for Pickup
                      </button>
                    )}

                    {order.orderStatus === 'READY' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Truck size={16} />
                        Dispatch for Delivery
                      </button>
                    )}

                    {order.orderStatus === 'OUT_FOR_DELIVERY' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Confirm Delivery Completed
                      </button>
                    )}

                    {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        className="w-full py-2 rounded-xl text-red-600 hover:bg-red-50 text-[11px] font-bold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
