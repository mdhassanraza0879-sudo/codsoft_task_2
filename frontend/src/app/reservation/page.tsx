'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { reservationsApi } from '../../lib/api';
import { Reservation } from '../../types';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Phone,
  ArrowRight,
} from '../../components/Icons';

export default function ReservationPage() {
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'customer@dinedesk.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 (555) 300-4003');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please fill in all contact details');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await reservationsApi.createReservation({
        customerName,
        customerEmail,
        customerPhone,
        date,
        time,
        guests: Number(guests),
        specialRequest: specialRequest.trim() || undefined,
      });

      if (res.success && res.data) {
        setConfirmedReservation(res.data);
      } else {
        setErrorMessage(res.message || 'Failed to submit reservation');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error booking table reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>Fine Dining Experience</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Reserve Your Table
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Enjoy guaranteed priority seating, intimate ambiance, and personalized culinary attention.
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Success Card */
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
                Reservation Submitted
              </span>
              <h2 className="text-2xl font-black text-gray-900">
                Table Booking Confirmed!
              </h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Thank you, <span className="font-bold text-gray-800">{confirmedReservation.customerName}</span>. Your reservation has been saved to the DineDesk database.
              </p>
            </div>

            {/* Reservation Voucher Summary */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-gray-100 space-y-3 text-xs text-left">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Booking Reference</span>
                <span className="font-mono font-bold text-gray-900">{confirmedReservation.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Scheduled Date</span>
                <span className="font-bold text-gray-900">{confirmedReservation.date}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Arrival Time</span>
                <span className="font-bold text-gray-900">{confirmedReservation.time}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500">Party Size</span>
                <span className="font-bold text-gray-900">{confirmedReservation.guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reservation Status</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  {confirmedReservation.status}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                href="/menu"
                className="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors"
              >
                Pre-Order Menu Items
              </Link>
              <button
                onClick={() => setConfirmedReservation(null)}
                className="px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          /* Reservation Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
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

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>

                {/* Date, Time & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Time Slot *
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    >
                      <option value="12:00">12:00 PM (Lunch)</option>
                      <option value="13:00">01:00 PM (Lunch)</option>
                      <option value="14:00">02:00 PM (Lunch)</option>
                      <option value="18:30">06:30 PM (Dinner)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:30">08:30 PM (Dinner)</option>
                      <option value="21:30">09:30 PM (Dinner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Party Size *
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Request */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Seating Preferences or Celebrations (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Quiet corner table, anniversary celebration, high chair needed"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden resize-none"
                  ></textarea>
                </div>

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
                      <span>Saving Reservation to PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Table Reservation</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Information Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
                <h3 className="text-base font-black text-gray-900">
                  Reservation Policies
                </h3>
                <ul className="space-y-3 text-xs text-gray-500 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0"></span>
                    Tables are held for a maximum of 15 minutes past your reserved time.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0"></span>
                    For parties greater than 20, kindly contact restaurant concierge directly.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 shrink-0"></span>
                    Cancellations can be made anytime online or via telephone at zero charge.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-amber-500 text-white space-y-2">
                <h4 className="font-bold text-sm">Host Private Banquets</h4>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Planning a corporate event or private birthday celebration? Book our executive dining hall.
                </p>
                <p className="text-xs font-black pt-1">
                  events@dinedesk.com • +1 (800) 555-3463
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
