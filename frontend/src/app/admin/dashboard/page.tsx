'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import {
  adminApi,
  menuApi,
  ordersApi,
  reservationsApi,
} from '../../../lib/api';
import {
  DashboardStats,
  MenuItem,
  Category,
  Order,
  Reservation,
  User,
} from '../../../types';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Clock,
  Flame,
  Leaf,
  Users,
} from '../../../components/Icons';

export default function AdminDashboardPage() {
  const { user, isAdmin, login } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MENU' | 'ORDERS' | 'RESERVATIONS' | 'USERS'>('OVERVIEW');
  const [loading, setLoading] = useState(true);

  // Data lists
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemPrepTime, setNewItemPrepTime] = useState('20');
  const [newItemIsVeg, setNewItemIsVeg] = useState(true);
  const [newItemIsSpicy, setNewItemIsSpicy] = useState(false);

  // Status feedback
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, menuRes, catRes, ordersRes, resRes, usersRes] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        menuApi.getMenu().catch(() => null),
        menuApi.getCategories().catch(() => null),
        ordersApi.getAllOrders().catch(() => null),
        reservationsApi.getAllReservations().catch(() => null),
        adminApi.getUsers().catch(() => null),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (menuRes?.data) setMenuItems(menuRes.data);
      if (catRes?.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !newItemCategory) {
          setNewItemCategory(catRes.data[0].id);
        }
      }
      if (ordersRes?.data) setOrders(ordersRes.data);
      if (resRes?.data) setReservations(resRes.data);
      if (usersRes?.data) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await adminApi.updateUserRole(userId, newRole);
      if (res.success) {
        setActionMessage(`User role successfully changed to ${newRole}`);
        setTimeout(() => setActionMessage(null), 3000);
        const usersRes = await adminApi.getUsers().catch(() => null);
        if (usersRes?.data) setUsersList(usersRes.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleQuickAdminLogin = async () => {
    try {
      setLoading(true);
      await login({ email: 'admin@dinedesk.com', password: 'admin123' });
    } catch (err: any) {
      alert(err.message || 'Admin login failed');
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await menuApi.toggleAvailability(item.id, !item.isAvailable);
      setMenuItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
        )
      );
      setActionMessage(`Updated "${item.name}" availability`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle availability');
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    try {
      await menuApi.deleteMenuItem(itemId);
      setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
      setActionMessage(`Deleted "${itemName}"`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete item');
    }
  };

  // Add Item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await menuApi.createMenuItem({
        name: newItemName,
        description: newItemDesc,
        price: parseFloat(newItemPrice),
        image: newItemImage,
        categoryId: newItemCategory,
        preparationTime: parseInt(newItemPrepTime, 10),
        isVeg: newItemIsVeg,
        isSpicy: newItemIsSpicy,
        isAvailable: true,
      });

      if (res.success && res.data) {
        setMenuItems((prev) => [res.data, ...prev]);
        setShowAddModal(false);
        setNewItemName('');
        setNewItemDesc('');
        setNewItemPrice('');
        setActionMessage('Added new menu item successfully!');
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create menu item');
    }
  };

  // Update Reservation
  const handleReservationStatus = async (id: string, status: any) => {
    try {
      await reservationsApi.updateReservationStatus(id, status);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setActionMessage(`Reservation marked as ${status}`);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update reservation');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 py-16 px-4">
        <div className="text-center max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">Admin Panel Access</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This management console requires Restaurant Administrator privileges.
            </p>
          </div>
          <button
            onClick={handleQuickAdminLogin}
            className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
          >
            ⚡ Login as Admin (Demo)
          </button>
          <div className="text-xs text-gray-400">
            or{' '}
            <Link href="/login" className="text-orange-600 font-bold hover:underline">
              Sign In with custom credentials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              Executive Console
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
              DineDesk Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {actionMessage && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                ✓ {actionMessage}
              </span>
            )}
            <button
              onClick={loadAdminData}
              className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-stone-50"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          {[
            { id: 'OVERVIEW', label: 'KPI Overview', icon: LayoutDashboard },
            { id: 'MENU', label: `Menu Items (${menuItems.length})`, icon: Utensils },
            { id: 'ORDERS', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'RESERVATIONS', label: `Reservations (${reservations.length})`, icon: Calendar },
            { id: 'USERS', label: `Users & Roles (${usersList.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-xs tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white text-purple-700 border-t-2 border-purple-700 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400">Total Revenue</span>
                <p className="text-3xl font-black text-gray-900 mt-2">
                  ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                  ↑ Verified PostgreSQL transactions
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400">Total Orders</span>
                <p className="text-3xl font-black text-gray-900 mt-2">
                  {stats?.totalOrders || orders.length}
                </p>
                <span className="text-[11px] text-purple-600 font-bold mt-1 block">
                  {stats?.pendingOrders || 0} currently pending
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400">Table Reservations</span>
                <p className="text-3xl font-black text-gray-900 mt-2">
                  {stats?.totalReservations || reservations.length}
                </p>
                <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                  Bookings stored in database
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
                <span className="text-xs font-bold text-gray-400">Menu Offerings</span>
                <p className="text-3xl font-black text-gray-900 mt-2">
                  {stats?.totalMenuItems || menuItems.length}
                </p>
                <span className="text-[11px] text-orange-600 font-bold mt-1 block">
                  Across 7 curated categories
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-gray-900">Admin Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setActiveTab('MENU');
                    setShowAddModal(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus size={16} /> Add New Dish
                </button>
                <Link
                  href="/staff/dashboard"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Utensils size={16} /> Open Kitchen KDS
                </Link>
                <Link
                  href="/menu"
                  className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold text-xs flex items-center gap-2"
                >
                  View Public Customer Menu
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. MENU ITEMS TAB */}
        {activeTab === 'MENU' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                Menu Management ({menuItems.length} Dishes)
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Add New Dish
              </button>
            </div>

            {/* Add Dish Modal */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-xl w-full p-8 rounded-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">Add New Dish</h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateMenuItem} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Dish Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g. Saffron Truffle Risotto"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="Key ingredients and culinary flavor profile"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="14.99"
                          className="w-full px-4 py-2.5 rounded-xl border text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={newItemCategory}
                          onChange={(e) => setNewItemCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border text-sm bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={newItemImage}
                        onChange={(e) => setNewItemImage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm"
                      />
                    </div>

                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={newItemIsVeg}
                          onChange={(e) => setNewItemIsVeg(e.target.checked)}
                          className="w-4 h-4 rounded text-orange-600"
                        />
                        Vegetarian
                      </label>

                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={newItemIsSpicy}
                          onChange={(e) => setNewItemIsSpicy(e.target.checked)}
                          className="w-4 h-4 rounded text-orange-600"
                        />
                        Spicy
                      </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs"
                      >
                        Save to Menu
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-5 py-3 bg-stone-100 text-gray-700 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Menu Items Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-gray-200 text-gray-400 font-extrabold uppercase">
                    <tr>
                      <th className="py-4 px-6">Dish</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{item.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {item.isVeg && (
                                  <span className="text-[10px] text-emerald-600 font-bold">Veg</span>
                                )}
                                {item.isSpicy && (
                                  <span className="text-[10px] text-amber-600 font-bold">Spicy</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {item.category?.name || 'Uncategorized'}
                        </td>
                        <td className="py-4 px-4 font-black text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Sold Out'}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">
              Customer Orders ({orders.length})
            </h2>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-gray-200 text-gray-400 font-extrabold uppercase">
                    <tr>
                      <th className="py-4 px-6">Order #</th>
                      <th className="py-4 px-4">Customer</th>
                      <th className="py-4 px-4">Items</th>
                      <th className="py-4 px-4">Amount</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/50">
                        <td className="py-4 px-6 font-mono font-bold text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-900">{order.customerName}</p>
                          <p className="text-[11px] text-gray-400">{order.customerPhone}</p>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {order.items?.length || 0} items
                        </td>
                        <td className="py-4 px-4 font-black text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-stone-100 text-gray-800">
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/orders/${order.id}`}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-gray-700 font-bold text-[11px]"
                          >
                            View Tracker
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. RESERVATIONS TAB */}
        {activeTab === 'RESERVATIONS' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">
              Table Bookings ({reservations.length})
            </h2>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-gray-200 text-gray-400 font-extrabold uppercase">
                    <tr>
                      <th className="py-4 px-6">Guest</th>
                      <th className="py-4 px-4">Date & Time</th>
                      <th className="py-4 px-4">Party</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-6 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-stone-50/50">
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900">{res.customerName}</p>
                          <p className="text-[11px] text-gray-400">{res.customerEmail} • {res.customerPhone}</p>
                          {res.specialRequest && (
                            <p className="text-[10px] text-amber-700 italic mt-0.5">Note: {res.specialRequest}</p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-800 font-semibold">
                          {res.date} at {res.time}
                        </td>
                        <td className="py-4 px-4 text-gray-600 font-bold">
                          {res.guests} Guests
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              res.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : res.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-1">
                          {res.status === 'PENDING' && (
                            <button
                              onClick={() => handleReservationStatus(res.id, 'CONFIRMED')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                          )}
                          {res.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleReservationStatus(res.id, 'COMPLETED')}
                              className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold"
                            >
                              Complete
                            </button>
                          )}
                          {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleReservationStatus(res.id, 'CANCELLED')}
                              className="px-2.5 py-1 rounded-md bg-stone-100 text-red-600 hover:bg-red-50 text-[10px] font-bold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. USERS & ROLES TAB */}
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">User Accounts & Role Management</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage permissions for restaurant customers, kitchen staff, and executive administrators.
                  </p>
                </div>
                <div className="text-xs font-bold text-gray-500 bg-stone-100 px-3 py-1.5 rounded-xl">
                  Total Users: {usersList.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-stone-50 text-[11px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="py-4 px-6">User / Contact</th>
                      <th className="py-4 px-4">Current Role</th>
                      <th className="py-4 px-4">Registered Date</th>
                      <th className="py-4 px-4">Activity</th>
                      <th className="py-4 px-6 text-right">Role Assignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                              <div className="text-gray-400 text-[11px]">{u.email}</div>
                              {u.phone && <div className="text-gray-400 text-[10px]">{u.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : u.role === 'STAFF'
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-700">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-[11px]">
                          <div>Orders: <span className="font-bold text-gray-800">{u._count?.orders ?? 0}</span></div>
                          <div>Reservations: <span className="font-bold text-gray-800">{u._count?.reservations ?? 0}</span></div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            disabled={user?.id === u.id && u.role === 'ADMIN'}
                            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white font-bold text-xs text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="STAFF">STAFF</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
