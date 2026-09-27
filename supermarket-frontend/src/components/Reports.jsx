import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, FileText, ShoppingBag } from 'lucide-react';

export default function Reports({ apiBase }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${apiBase}/sales`);
      setSales(res.data);
    } catch (err) {
      console.error('Failed to fetch sales history:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + parseFloat(s.total_amount || 0), 0);

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#ffe3e3', color: '#dc3545', padding: '12px', borderRadius: '50%' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: 'bold' }}>TOTAL REVENUE</span>
            <h2 style={{ margin: 0, color: '#dc3545' }}>${totalRevenue.toFixed(2)}</h2>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e6fcf5', color: '#0ca678', padding: '12px', borderRadius: '50%' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: 'bold' }}>TOTAL ORDERS</span>
            <h2 style={{ margin: 0, color: '#212529' }}>{sales.length}</h2>
          </div>
        </div>
      </div>

      {/* Sales History Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #dee2e6', fontWeight: 'bold', fontSize: '16px' }}>
          Sales History & Invoices
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '12px' }}>Sale ID</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Items Sold</th>
              <th style={{ padding: '12px' }}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No sales recorded yet.</td>
              </tr>
            ) : (
              sales.map(s => (
                <tr key={s.sale_id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>#{s.sale_id}</td>
                  <td style={{ padding: '12px', color: '#6c757d', fontSize: '13px' }}>
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {s.items ? s.items.map(i => `${i.product_name} (x${i.quantity})`).join(', ') : '-'}
                  </td>
                  <td style={{ padding: '12px', color: '#dc3545', fontWeight: 'bold' }}>
                    ${parseFloat(s.total_amount).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}