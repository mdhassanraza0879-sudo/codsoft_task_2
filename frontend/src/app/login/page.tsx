'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Utensils, AlertCircle, ArrowRight, ShieldCheck } from '../../components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsLoading(true);
      await login({ email, password });
      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);

    try {
      setIsLoading(true);
      await login({ email: demoEmail, password: demoPass });
      if (demoEmail.includes('admin')) {
        router.push('/admin/dashboard');
      } else if (demoEmail.includes('staff')) {
        router.push('/staff/dashboard');
      } else {
        router.push('/menu');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-600/20">
            <Utensils size={24} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome to DineDesk
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to track orders, manage reservations, and access staff portals.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Logins for Quick Testing */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-800 block text-center">
            ⚡ Quick Demo Logins (1-Click)
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@dinedesk.com', 'customer123')}
              className="py-2 px-1 rounded-xl bg-white border border-orange-200 font-bold text-gray-800 hover:bg-orange-600 hover:text-white transition-all text-center"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff@dinedesk.com', 'staff123')}
              className="py-2 px-1 rounded-xl bg-white border border-blue-200 font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition-all text-center"
            >
              Staff / Kitchen
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@dinedesk.com', 'admin123')}
              className="py-2 px-1 rounded-xl bg-white border border-purple-200 font-bold text-purple-800 hover:bg-purple-600 hover:text-white transition-all text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium placeholder:text-gray-400 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25 hover:scale-[1.01]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to DineDesk</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-orange-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
