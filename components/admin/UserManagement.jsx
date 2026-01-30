"use client";
import { useState, useEffect } from 'react';
import { useUsers, useCreateUser, useDeleteUser, useUpdateUser } from '../../hooks/useUsers';

export default function UserManagement() {
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
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

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showForm]);

    const { data: users = [], isLoading } = useUsers();
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'broker',
            phone: '',
            whatsapp: '',
            status: 'approved'
        });
        setEditingUser(null);
        setFormError('');
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '', // Keep empty unless changing
            role: user.role || 'broker',
            phone: user.phone || '',
            whatsapp: user.whatsapp || '',
            status: user.status || 'approved'
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            if (editingUser) {
                // If password is empty in edit mode, don't send it to backend
                const submissionData = { ...formData };
                if (!submissionData.password) delete submissionData.password;

                await updateUserMutation.mutateAsync({ id: editingUser.id, data: submissionData });
            } else {
                await createUserMutation.mutateAsync(formData);
            }
            setShowForm(false);
            resetForm();
        } catch (err) {
            setFormError(err.response?.data?.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
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
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tighter">Team Management</h2>
                    <p className="text-white/40 text-sm mt-1 font-medium">Manage Alrabie staff access, roles and direct performance profiles.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="px-8 py-3.5 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 active:scale-95"
                >
                    + Add Staff Member
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto glass-effect rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.03]">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Profile</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Auth Identity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">System Role</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Access Level</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Registration</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Strategic Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Accessing secure personnel records...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-20 text-center text-white/20 font-bold uppercase text-xs tracking-widest">Architect your team to begin.</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-white tracking-tight text-lg">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-white/70 font-medium">{user.email}</div>
                                        <div className="text-[10px] text-white/30 font-bold tracking-tighter mt-0.5">{user.phone || 'NO SECURE PHONE'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' :
                                            user.role === 'broker' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-white/10 text-white/40'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-400' : 'bg-blue-400 animate-pulse'}`} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.status === 'approved' || user.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            user.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-white/20 font-bold text-[10px] tracking-widest">
                                        {new Date(user.createdAt || user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-3 bg-white/5 hover:bg-accent text-white/50 hover:text-white rounded-xl transition-all shadow-lg border border-white/5"
                                                title="Edit Intelligence Profile"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-3 bg-red-500/5 hover:bg-red-500 text-red-500/50 hover:text-white rounded-xl transition-all shadow-lg border border-red-500/10"
                                                title="Revoke Secure Access"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit User Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowForm(false)} />

                    {/* Scrollable Wrapper */}
                    <div className="relative w-full max-w-xl max-h-[95vh] overflow-y-auto no-scrollbar scroll-smooth">
                        <div className="glass-effect border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-scale-in my-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px w-8 bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Personnel File</span>
                            </div>

                            <h3 className="text-3xl font-bold text-white mb-1 tracking-tighter">
                                {editingUser ? 'Modify' : 'Enlist'} <span className="text-white/30">{editingUser ? 'Profile' : 'Access'}</span>
                            </h3>
                            <p className="text-white/40 text-xs mb-8 font-medium">Configure credentials and system clearance levels.</p>

                            {formError && (
                                <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3">
                                    <span className="text-lg">⚠️</span> {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Operator Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus-ring font-medium placeholder:text-white/10 text-sm"
                                            placeholder="E.g. Alexander Pierce"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Identity Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus-ring font-medium appearance-none cursor-pointer text-sm"
                                        >
                                            <option value="broker">Executive Broker</option>
                                            <option value="admin">System Administrator</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus-ring font-medium placeholder:text-white/10 text-sm"
                                            placeholder="name@alrabei.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-2">Direct Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus-ring font-medium placeholder:text-white/10 text-sm"
                                            placeholder="+971 XX XXX XXXX"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Intelligence Key (Password)</label>
                                            {editingUser && <span className="text-[8px] font-bold text-accent uppercase">Leave blank to keep current</span>}
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!editingUser}
                                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus-ring font-medium placeholder:text-white/10 text-sm"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-2xl transition-all"
                                    >
                                        Terminate
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createUserMutation.isPending || updateUserMutation.isPending}
                                        className="px-6 py-3.5 bg-accent text-white text-sm font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
                                    >
                                        {createUserMutation.isPending || updateUserMutation.isPending ? 'Syncing...' : (editingUser ? 'Commit' : 'Confirm')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
