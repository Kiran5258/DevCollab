import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderCode, BarChart3, TrendingUp, Search, Trash2, ShieldAlert, UserCheck, AlertCircle } from 'lucide-react';
import API from '../services/api';
import Avatar from '../components/Avatar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, projects: 0, activeProjects: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get('/users/stats');
        setStats(statsRes.data);
        const usersRes = await API.get('/users');
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
          <ShieldAlert className="text-primary-600" size={36} /> Admin Panel
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your platform, users, and oversee community activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <AdminStatCard icon={<Users className="text-blue-500" />} label="Total Users" value={stats.users} trend="+12% this month" />
        <AdminStatCard icon={<FolderCode className="text-purple-500" />} label="Total Projects" value={stats.projects} trend="+5% this week" />
        <AdminStatCard icon={<BarChart3 className="text-green-500" />} label="Active Status" value={stats.activeProjects} trend="98.2% healthy" />
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.profileImage} name={user.name} size="md" />
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      {user.role === 'admin' ? <ShieldAlert size={14} className="text-primary-600" /> : <UserCheck size={14} className="text-slate-400" />}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => deleteUser(user._id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, trend }) => (
  <div className="glass-card p-8 rounded-[2rem]">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
        {icon}
      </div>
      <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
        <TrendingUp size={14} /> {trend}
      </div>
    </div>
    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-extrabold">{value}</div>
  </div>
);

export default AdminDashboard;
