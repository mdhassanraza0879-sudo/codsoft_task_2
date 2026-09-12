'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ordersApi } from '../../lib/api';
import { Order } from '../../types';
import {
  CheckCircle,
  Clock,
  Truck,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Calendar,
} from '../../components/Icons';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await ordersApi.getOrderById(orderId as string);
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          setError(res.message || 'Order details not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order summary');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-gray-900">Finalizing Your Culinary Order</h3>
          <p className="text-xs text-gray-500">
            Securely confirming with the DineDesk kitchen dispatch...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-100 shadow-xl shadow-orange-500/5 text-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
            <CheckCircle size={40} className="stroke-[2.5]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200/60">
            <ShieldCheck size={14} /> Order Confirmed & Paid
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Thank You for Dining with DineDesk!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto leading-relaxed">
            Your chef-crafted order has been received and routed straight to our artisan kitchen line.
          </p>

          {order && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-stone-50 border border-gray-200/80 px-6 py-3 rounded-2xl">
              <span className="text-xs text-gray-500 font-medium">Order Reference:</span>
              <span className="text-sm font-black text-orange-600 font-mono tracking-wider">
                {order.orderNumber}
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {order ? (
              <Link
                href={`/orders/${order.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:from-orange-700 hover:to-amber-600 transition-all hover:scale-[1.01]"
              >
                <Truck size={18} />
                Track Live Order Status
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-lg hover:bg-orange-700 transition-all"
              >
                View All Orders
              </Link>
            )}

            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Order More Food
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center justify-between border-b border-gray-100 pb-4">
              <span>Receipt Summary</span>
              <span className="text-xs font-semibold text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </h2>

            {/* Delivery / Pickup Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-gray-100 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Recipient & Contact
                </span>
                <div className="font-bold text-gray-900">{order.customerName}</div>
                <div className="text-gray-600 flex items-center gap-1">
                  <Phone size={12} /> {order.customerPhone}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  Dispatch Method & Address
                </span>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <MapPin size={12} className="text-orange-600 shrink-0" />
                  {order.deliveryAddress}
                </div>
                <div className="text-gray-500">
                  Type:{' '}
                  <span className="font-semibold text-gray-700">
                    {order.orderType === 'DELIVERY' ? 'Doorstep Delivery' : 'Dine-In Service'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      {item.menuItem?.image && (
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-snug">
                        {item.menuItem?.name || 'Chef Specialty'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: <span className="font-bold text-gray-800">{item.quantity}</span> × ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>State & Local Tax (8%)</span>
                <span className="font-semibold text-gray-900">${order.tax.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900">${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>Total Amount Paid</span>
                <span className="text-orange-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
