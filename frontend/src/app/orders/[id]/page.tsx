'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '../../../types';
import { ordersApi } from '../../../lib/api';
import {
  CheckCircle,
  Clock,
  Truck,
  ChefHat,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowRight,
  AlertCircle,
} from '../../../components/Icons';

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Order Received', desc: 'Awaiting restaurant confirmation' },
  { status: 'CONFIRMED', label: 'Order Confirmed', desc: 'Sent to the kitchen' },
  { status: 'PREPARING', label: 'In the Kitchen', desc: 'Master chefs are preparing your meal' },
  { status: 'READY', label: 'Food Ready', desc: 'Packed and waiting for pickup/dispatch' },
  { status: 'OUT_FOR_DELIVERY', label: 'On the Way', desc: 'Delivery partner is en route' },
  { status: 'DELIVERED', label: 'Delivered', desc: 'Enjoy your artisan meal!' },
];

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
        setLastRefreshed(new Date());
      } else {
        setError(res.message || 'Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, [id]);

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'CANCELLED') return -1;
    return STEPS.findIndex((s) => s.status === status);
  };

  if (loading && !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-gray-500">Connecting to live tracker...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find an order matching reference &ldquo;{id}&rdquo;.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition-colors"
          >
            Track Another Order
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-md">
                Order #{order.orderNumber}
              </span>
              <span className="text-xs text-gray-400">
                Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              Live Order Tracker
            </h1>
          </div>

          <button
            onClick={fetchOrder}
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-stone-100 transition-colors"
          >
            🔄 Refresh Status
          </button>
        </div>

        {/* Visual Stepper Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm mb-10">
          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center">
              <h3 className="text-xl font-bold text-red-700">Order Cancelled</h3>
              <p className="text-xs text-red-600 mt-1">
                This order was cancelled. Please contact support or place a new order.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                  <span className="text-xs font-semibold text-gray-400">Current Kitchen Stage</span>
                  <p className="text-2xl font-black text-orange-600">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-400">Estimated Delivery</span>
                  <p className="text-xl font-black text-gray-900">25 - 35 Minutes</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={step.status}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          isCurrent
                            ? 'border-orange-500 bg-orange-50/70 shadow-sm'
                            : isCompleted
                            ? 'border-emerald-200 bg-emerald-50/40 text-gray-700'
                            : 'border-gray-100 bg-stone-50/40 text-gray-400 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                            isCurrent
                              ? 'bg-orange-600 text-white animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle size={16} /> : idx + 1}
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Details & Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
            <h2 className="text-lg font-black text-gray-900">
              Ordered Dishes ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.menuItem?.name || 'Dish'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {item.menuItem?.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-black text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Math */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span className="font-bold text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">
                  {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-black text-gray-900">
                <span>Total Paid</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-black text-gray-900">
                Delivery Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800">Address</span>
                    <p className="text-gray-500 mt-0.5">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-orange-600 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800">Recipient</span>
                    <p className="text-gray-500 mt-0.5">{order.customerName} ({order.customerPhone})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Payment:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-orange-600 text-white space-y-3">
              <h4 className="font-bold text-sm">Need help with your order?</h4>
              <p className="text-xs text-orange-100 leading-relaxed">
                Contact our customer support desk anytime for instant status checks or address changes.
              </p>
              <div className="text-xs font-extrabold text-white">
                📞 Call Kitchen: +1 (800) 555-DINE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
