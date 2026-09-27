import React, { useState } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export default function Inventory({ products, categories, newProduct, setNewProduct, handleAddProduct, apiBase = "http://localhost:5000/api", onRefresh = () => {} }) {
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setEditFormData({ ...p });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // --- تحديث دالة الحفظ هنا ---
 

   const handleSaveEdit = async (id) => {
  try {
    const payload = {
      name: editFormData.name,
      barcode: editFormData.barcode || '',
      category_id: parseInt(editFormData.category_id),
      buy_price: parseFloat(editFormData.buy_price) || 0,
      sell_price: parseFloat(editFormData.sell_price) || 0,
      stock_quantity: parseInt(editFormData.stock_quantity) || 0
    };

    const targetUrl = `${apiBase}/products/${id}`;
    console.log('Sending PUT request to:', targetUrl); // <-- أضف هذا السطر

    await axios.put(targetUrl, payload);
    setEditingId(null);
    onRefresh();
  } catch (err) {
    console.error('Update Error Details:', err.response || err);
    alert('Failed to update product: ' + (err.response?.data?.error || err.message));
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${apiBase}/products/${id}`);
      onRefresh();
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div>
      {/* Add New Product Form */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, color: '#dc3545' }}>+ Add New Product</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <input placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="Barcode" value={newProduct.barcode} onChange={e => setNewProduct({...newProduct, barcode: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <select value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Buy Price" type="number" step="0.01" value={newProduct.buy_price} onChange={e => setNewProduct({...newProduct, buy_price: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="Sell Price" type="number" step="0.01" value={newProduct.sell_price} onChange={e => setNewProduct({...newProduct, sell_price: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="Stock Qty" type="number" value={newProduct.stock_quantity} onChange={e => setNewProduct({...newProduct, stock_quantity: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Save Product</button>
        </form>
      </div>

      {/* Inventory Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Barcode</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Buy Price</th>
              <th style={{ padding: '12px' }}>Sell Price</th>
              <th style={{ padding: '12px' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const isEditing = editingId === p.id;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px' }}>{p.id}</td>
                  
                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <input value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} style={{ width: '100%', padding: '4px' }} />
                    ) : (
                      <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                    )}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <input value={editFormData.barcode || ''} onChange={e => setEditFormData({...editFormData, barcode: e.target.value})} style={{ width: '100%', padding: '4px' }} />
                    ) : (
                      p.barcode || '-'
                    )}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <select value={editFormData.category_id} onChange={e => setEditFormData({...editFormData, category_id: e.target.value})} style={{ width: '100%', padding: '4px' }}>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      p.category_name || '-'
                    )}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <input type="number" step="0.01" value={editFormData.buy_price} onChange={e => setEditFormData({...editFormData, buy_price: e.target.value})} style={{ width: '80px', padding: '4px' }} />
                    ) : (
                      `$${parseFloat(p.buy_price || 0).toFixed(2)}`
                    )}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <input type="number" step="0.01" value={editFormData.sell_price} onChange={e => setEditFormData({...editFormData, sell_price: e.target.value})} style={{ width: '80px', padding: '4px' }} />
                    ) : (
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>${parseFloat(p.sell_price).toFixed(2)}</span>
                    )}
                  </td>

                  <td style={{ padding: '12px' }}>
                    {isEditing ? (
                      <input type="number" value={editFormData.stock_quantity} onChange={e => setEditFormData({...editFormData, stock_quantity: e.target.value})} style={{ width: '60px', padding: '4px' }} />
                    ) : (
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px', background: p.stock_quantity < 5 ? '#ffe3e3' : '#e6fcf5', color: p.stock_quantity < 5 ? '#c92a2a' : '#0ca678' }}>
                        {p.stock_quantity}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleSaveEdit(p.id)} style={{ background: '#198754', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><Check size={16} /></button>
                        <button onClick={handleCancelEdit} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><X size={16} /></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button onClick={() => handleEditClick(p)} style={{ background: 'none', border: 'none', color: '#0d6efd', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}