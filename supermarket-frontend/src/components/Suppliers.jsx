import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, RefreshCw, PackagePlus } from 'lucide-react';

export default function Suppliers({ apiBase, products, onRefreshProducts }) {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', company: '' });
  const [restockData, setRestockData] = useState({ product_id: '', quantity: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${apiBase}/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBase}/suppliers`, newSupplier);
      setNewSupplier({ name: '', phone: '', company: '' });
      fetchSuppliers();
    } catch (err) {
      alert('Failed to add supplier: ' + err.message);
    }
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockData.product_id || !restockData.quantity) return;
    try {
      await axios.post(`${apiBase}/products/restock`, restockData);
      alert('Stock Updated Successfully! 📦');
      setRestockData({ product_id: '', quantity: '' });
      onRefreshProducts();
    } catch (err) {
      alert('Restock failed: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
      
      {/* Left Column: Suppliers & Restock Forms */}
      <div>
        {/* Restock Stock Form */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0, color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PackagePlus size={20} /> Restock Inventory
          </h3>
          <form onSubmit={handleRestock} style={{ display: 'flex', gap: '12px' }}>
            <select
              value={restockData.product_id}
              onChange={e => setRestockData({ ...restockData, product_id: e.target.value })}
              required
              style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">Select Product to Restock</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Current: {p.stock_quantity})</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Qty to Add"
              value={restockData.quantity}
              onChange={e => setRestockData({ ...restockData, quantity: e.target.value })}
              required
              min="1"
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Add Stock
            </button>
          </form>
        </div>

        {/* Suppliers Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #dee2e6', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#dc3545" /> Supplier Directory
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
              <tr>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Company</th>
                <th style={{ padding: '12px' }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No suppliers found.</td>
                </tr>
              ) : (
                suppliers.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '12px' }}>#{s.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.name}</td>
                    <td style={{ padding: '12px' }}>{s.company || '-'}</td>
                    <td style={{ padding: '12px' }}>{s.phone || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Add Supplier Form */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0, color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Supplier
        </h3>
        <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            placeholder="Supplier Name"
            value={newSupplier.name}
            onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            placeholder="Company Name"
            value={newSupplier.company}
            onChange={e => setNewSupplier({ ...newSupplier, company: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            placeholder="Phone Number"
            value={newSupplier.phone}
            onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Save Supplier
          </button>
        </form>
      </div>

    </div>
  );
}