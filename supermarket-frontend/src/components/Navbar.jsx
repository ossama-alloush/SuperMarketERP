import React from 'react';
import { ShoppingCart, Package, Tags, BarChart3, Users, CheckCircle, RefreshCw, Layers, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, apiBase, fetchData }) {
  return (
    <>
      <header style={{ backgroundColor: '#dc3545', color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={28} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Supermarket ERP</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
          <span style={{ background: backendStatus === 'online' ? '#198754' : '#6c757d', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CheckCircle size={14} /> {backendStatus.toUpperCase()}
          </span>
          <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6', padding: '0 24px', display: 'flex', gap: '8px' }}>
        {[
          { id: 'pos', label: 'POS Checkout', icon: ShoppingCart },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'categories', label: 'Categories', icon: Tags },
          { id: 'suppliers', label: 'Suppliers & Restock', icon: Users },
          { id: 'damaged', label: 'Damaged & Returns', icon: AlertTriangle }, // <-- تم إضافتها هنا
          { id: 'reports', label: 'Reports & Sales', icon: BarChart3 }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px',
                border: 'none', background: 'none', borderBottom: active ? '3px solid #dc3545' : '3px solid transparent',
                color: active ? '#dc3545' : '#495057', fontWeight: active ? 'bold' : 'normal', cursor: 'pointer'
              }}
            >
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}