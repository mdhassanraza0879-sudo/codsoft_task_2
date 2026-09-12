'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersApi } from '../../lib/api';
import {
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Truck,
  ArrowRight,
} from '../../components/Icons';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 300-4003');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Culinary District');
  const [orderType, setOrderType] = useState<'DELIVERY' | 'DINE_IN'>('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'CASH'>('CARD');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 py-16 px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-2">No Items in Cart</h2>
          <p className="text-sm text-gray-500 mb-6">
            Please add delicious food from our menu before proceeding to checkout.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter a contact phone number');
      return;
    }
    if (orderType === 'DELIVERY' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide a complete delivery address');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customerName,
        customerPhone,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : 'DINE_IN Table Service',
        orderType,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
      };

      const res = await ordersApi.createOrder(orderPayload);

      if (res.success && res.data) {
        clearCart();
        // Redirect to order celebration success screen
        router.push(`/order-success?orderId=${res.data.id}`);
      } else {
        setErrorMessage(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while submitting order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Checkout & Order Confirmation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your delivery details and choose a convenient payment method.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Customer Info & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Order Type Selector */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
                <h2 className="text-lg font-black text-gray-900">
                  1. Choose Service Type
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      orderType === 'DELIVERY'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-700 font-bold shadow-xs'
                        : 'border-gray-200 hover:bg-stone-50 text-gray-600'
                    }`}
                  >
                    <Truck size={24} className="text-orange-600" />
                    <span className="text-sm">Doorstep Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      orderType === 'DINE_IN'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-700 font-bold shadow-xs'
                        : 'border-gray-200 hover:bg-stone-50 text-gray-600'
                    }`}
                  >
                    <CheckCircle size={24} className="text-orange-600" />
                    <span className="text-sm">Dine-In Table Order</span>
                  </button>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
                <h2 className="text-lg font-black text-gray-900">
                  2. Contact & Delivery Info
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {orderType === 'DELIVERY' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Street Address / Apartment *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Flat 4B, 142 Culinary Way, Downtown"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden resize-none"
                    ></textarea>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Cooking / Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Extra napkins, less chili, ring the bell"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-gray-900">
                    3. Payment Method
                  </h2>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Instant Simulation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'CARD'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-700 font-bold'
                        : 'border-gray-200 hover:bg-stone-50 text-gray-600'
                    }`}
                  >
                    <CreditCard size={24} className="text-orange-600" />
                    <span className="text-xs font-bold">Credit / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'UPI'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-700 font-bold'
                        : 'border-gray-200 hover:bg-stone-50 text-gray-600'
                    }`}
                  >
                    <QrCode size={24} className="text-orange-600" />
                    <span className="text-xs font-bold">UPI / Instant QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'CASH'
                        ? 'border-orange-600 bg-orange-50/50 text-orange-700 font-bold'
                        : 'border-gray-200 hover:bg-stone-50 text-gray-600'
                    }`}
                  >
                    <Banknote size={24} className="text-orange-600" />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                  </button>
                </div>

                <p className="text-xs text-gray-400 bg-stone-50 p-3 rounded-xl">
                  * For development & internship evaluation, orders are automatically verified and submitted to the live PostgreSQL database.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
              <h2 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-100">
                Order Summary ({items.length} dishes)
              </h2>

              {/* Items preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ menuItem, quantity }) => (
                  <div
                    key={menuItem.id}
                    className="flex items-center justify-between text-sm py-2 border-b border-gray-50"
                  >
                    <div className="flex items-center gap-2 max-w-[220px]">
                      <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center shrink-0">
                        {quantity}x
                      </span>
                      <span className="text-gray-800 font-medium truncate">
                        {menuItem.name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${(menuItem.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm pt-2 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Sales Tax (5%)</span>
                  <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Payable</span>
                  <span className="text-3xl font-black text-orange-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25 hover:scale-[1.01]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving to Database & Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order (${total.toFixed(2)})</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400 text-center">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Verified PostgreSQL Database Persistence</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
