"use client";
import { useState } from 'react';
import { useUsers, useCreateUser, useDeleteUser } from '../../hooks/useUsers';

export default function UserManagement() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'broker',
        phone: '',
        whatsapp: '',
        status: 'approved'
    });
    const [formError, setFormError] = useState('');

    const { data: users = [], isLoading } = useUsers();
    const createUserMutation = useCreateUser();
    const deleteUserMutation = useDeleteUser();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            await createUserMutation.mutateAsync(formData);
            setShowAddForm(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'broker',
                phone: '',
                whatsapp: '',
                status: 'approved'
            });
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to create user');
        }
    };

    const handleDelete = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUserMutation.mutateAsync(userId);
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete user');
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">User Management</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                >
                    + Add New User
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto glass-effect rounded-2xl border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Name</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Email</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Role</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Joined</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-white/40">Loading users...</td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-white/40">No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white tracking-tight">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white/60">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                                                user.role === 'broker' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-white/10 text-white/40'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.status === 'approved' || user.status === 'active' ? 'bg-green-500/10 text-green-400' :
                                                user.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white/40 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                            title="Delete User"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
                    <div className="relative glass-effect border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-tighter">Add New Staff</h3>

                        {formError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus-ring"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus-ring"
                                    placeholder="john@alrabei.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus-ring"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus-ring appearance-none"
                                    >
                                        <option value="broker">Broker</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus-ring appearance-none"
                                    >
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createUserMutation.isPending}
                                    className="flex-1 px-6 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                                >
                                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
