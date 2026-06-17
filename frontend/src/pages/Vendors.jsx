import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Search, Filter, ArrowUpDown, ChevronLeft, 
  ChevronRight, Edit, Trash2, ArrowUpRight, CheckCircle, AlertCircle 
} from 'lucide-react';

function Vendors() {
  const { token, isAuthorizedForEdit, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Vendors State
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Queries State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [riskLevel, setRiskLevel] = useState('All');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', category: 'Software', status: 'Active',
    contactPerson: '', email: '', phone: '',
    contractValue: '', contractStartDate: '', contractEndDate: ''
  });
  const [formError, setFormError] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        category,
        riskLevel,
        sort,
        order,
        page,
        limit: 8
      });

      const res = await fetch(`/api/vendors?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setVendors(data.vendors);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [search, category, riskLevel, sort, order, page, token]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on search
  };

  const handleFilterChange = (type, val) => {
    if (type === 'category') setCategory(val);
    if (type === 'risk') setRiskLevel(val);
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
    setPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setSelectedVendorId(null);
    setFormData({
      name: '', category: 'Software', status: 'Active',
      contactPerson: '', email: '', phone: '',
      contractValue: '',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (vendor, e) => {
    e.stopPropagation();
    setEditMode(true);
    setSelectedVendorId(vendor._id || vendor.id);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      status: vendor.status,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      contractValue: vendor.contractValue,
      contractStartDate: new Date(vendor.contractStartDate).toISOString().split('T')[0],
      contractEndDate: new Date(vendor.contractEndDate).toISOString().split('T')[0]
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleDeleteVendor = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this vendor? This will remove all logs and history.')) {
      return;
    }

    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchVendors();
      }
    } catch (err) {
      console.error('Error deleting vendor:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const url = editMode ? `/api/vendors/${selectedVendorId}` : '/api/vendors';
    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          contractValue: Number(formData.contractValue)
        })
      });

      if (res.ok) {
        setModalOpen(false);
        fetchVendors();
      } else {
        const errorData = await res.json();
        setFormError(errorData.message || 'Saving vendor details failed');
      }
    } catch (err) {
      console.error('Error saving vendor:', err);
      setFormError('Failed to establish database write connection');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            Vendor Directory
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Manage vendor profiles, contracts, and tracking records
          </p>
        </div>
        {isAuthorizedForEdit() && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:scale-102 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      {/* Query Filters Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by vendor name..."
            className="w-full bg-slate-50 dark:bg-slate-850 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-brand-500 font-semibold"
          />
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-850 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:border-brand-500 font-semibold appearance-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Software">Software</option>
            <option value="Logistics">Logistics</option>
            <option value="Hardware">Hardware</option>
            <option value="Consulting">Consulting</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Services">Services</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="relative flex items-center">
          <Filter className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={riskLevel}
            onChange={(e) => handleFilterChange('risk', e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-850 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:border-brand-500 font-semibold appearance-none cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs font-bold text-slate-400 px-2 uppercase tracking-wide">
          Found {total} Vendors
        </div>

      </div>

      {/* Vendors Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('name')}>
                  <span className="flex items-center space-x-1">
                    <span>Vendor Name</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </span>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('category')}>
                  <span className="flex items-center space-x-1">
                    <span>Category</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </span>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('contractValue')}>
                  <span className="flex items-center space-x-1">
                    <span>Contract Value</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </span>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" onClick={() => toggleSort('riskScore')}>
                  <span className="flex items-center space-x-1">
                    <span>Risk Index</span>
                    <ArrowUpDown className="h-3 w-3 shrink-0" />
                  </span>
                </th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">
                    No vendor registers found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr 
                    key={vendor._id || vendor.id}
                    onClick={() => navigate(`/vendors/${vendor._id || vendor.id}`)}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{vendor.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{vendor.contactPerson}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 text-[10px] uppercase font-bold tracking-wider">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      ${vendor.contractValue.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        vendor.riskLevel === 'High' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                          : vendor.riskLevel === 'Medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-405'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}>
                        {vendor.riskLevel} ({vendor.riskScore})
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`h-2 w-2 rounded-full inline-block mr-1.5 ${
                        vendor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                      <span className="text-xs">{vendor.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      {isAuthorizedForEdit() && (
                        <button 
                          onClick={(e) => handleOpenEditModal(vendor, e)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {isAdmin() && (
                        <button 
                          onClick={(e) => handleDeleteVendor(vendor._id || vendor.id, e)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/vendors/${vendor._id || vendor.id}`)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-950/10"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* CREATE & EDIT VENDOR DIALOG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">
                {editMode ? 'Edit Supplier Details' : 'Create Vendor Profile'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">Close</button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-700 dark:text-red-400 font-semibold">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
                    placeholder="Apex Systems Ltd"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Software">Software</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Fulfillment Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contract Value ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.contractValue}
                    onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
                    placeholder="e.g. 250000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contract Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.contractStartDate}
                    onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Contract End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 col-span-2 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Contact Person Details</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Work Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        placeholder="jsmith@apex.com"
                      />
                    </div>
                    <div className="space-y-1 col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Phone Line</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        placeholder="+1-555-0100"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Vendors;
