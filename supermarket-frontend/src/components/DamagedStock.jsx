import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DamagedStock({ products, apiBase = `${DEFAULT_API_URL}/api`, onRefresh }) {
  const [damagedList, setDamagedList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Expired');

  const fetchDamaged = async () => {
    try {
      const res = await axios.get(`${apiBase}/damaged`);
      setDamagedList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDamaged();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === parseInt(selectedProduct));
    if (!prod) return alert('Please select a product');

    try {
      await axios.post(`${apiBase}/damaged`, {
        product_id: prod.id,
        quantity: parseInt(quantity),
        reason,
        buy_price: prod.buy_price
      });

      alert('Item logged as damaged and stock updated!');
      setSelectedProduct('');
      setQuantity(1);
      fetchDamaged();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to log damaged product: ' + err.message);
    }
  };

  const totalLoss = damagedList.reduce((acc, curr) => acc + parseFloat(curr.cost_loss || 0), 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={24} /> Damaged & Expired Products
      </h2>

      {/* Form */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Product</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Quantity</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Reason</label>
            <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Expired">Expired (منتهي الصلاحية)</option>
              <option value="Damaged Packaging">Damaged Packaging (كيس/علبة خربانة)</option>
              <option value="Defective / Spoiled">Defective / Spoiled (تالف)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{ width: '100%', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Confirm & Remove Stock
            </button>
          </div>
        </form>
      </div>

      {/* Total Loss summary */}
      <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '8px', border: '1px solid #ffc9c9', marginBottom: '20px', color: '#c92a2a', fontWeight: 'bold' }}>
        Total Financial Loss: ${totalLoss.toFixed(2)}
      </div>

      {/* Damaged Logs Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>Qty</th>
              <th style={{ padding: '12px' }}>Reason</th>
              <th style={{ padding: '12px' }}>Cost Loss</th>
            </tr>
          </thead>
          <tbody>
            {damagedList.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '12px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.product_name}</td>
                <td style={{ padding: '12px' }}>{item.quantity}</td>
                <td style={{ padding: '12px' }}><span style={{ background: '#ffe3e3', color: '#c92a2a', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{item.reason}</span></td>
                <td style={{ padding: '12px', color: '#dc3545', fontWeight: 'bold' }}>${parseFloat(item.cost_loss).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}