import React from 'react';
import { Search, ShoppingCart, Trash2 } from 'lucide-react';

export default function POSCheckout({
  products,
  categories,
  cart,
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  addToCart,
  updateCartQty,
  removeFromCart,
  totalCart,
  handleCheckout
}) {
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode && p.barcode.includes(search));
    const matchesCat = selectedCategory === 'ALL' || p.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
      {/* Products Area */}
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6c757d' }} />
            <input
              type="text"
              placeholder="Search Products (Barcode or Name)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '6px', border: '1px solid #ced4da', outline: 'none' }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {filteredProducts.map(p => (
            <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e9ecef', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: 'bold' }}>{p.category_name || 'General'}</span>
                <h4 style={{ margin: '4px 0', fontSize: '16px' }}>{p.name}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#888' }}>BC: {p.barcode || 'N/A'}</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>${parseFloat(p.sell_price).toFixed(2)}</span>
                  <span style={{ fontSize: '12px', background: p.stock_quantity < 5 ? '#ffe3e3' : '#e6fcf5', color: p.stock_quantity < 5 ? '#c92a2a' : '#0ca678', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {p.stock_quantity} left
                  </span>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.stock_quantity < 1}
                  style={{ width: '100%', backgroundColor: p.stock_quantity < 1 ? '#e9ecef' : '#dc3545', color: p.stock_quantity < 1 ? '#adb5bd' : '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: p.stock_quantity < 1 ? 'not-allowed' : 'pointer' }}
                >
                  {p.stock_quantity < 1 ? 'Out of Stock' : '+ Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 180px)', position: 'sticky', top: '20px' }}>
        <div>
          <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #f1f3f5', pb: '10px' }}>
            <ShoppingCart size={20} color="#dc3545" /> Current Sale
          </h3>
          
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#adb5bd', margin: '40px 0' }}>Cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f3f5' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>${parseFloat(item.sell_price).toFixed(2)} x {item.qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => updateCartQty(item.id, -1)} style={{ background: '#e9ecef', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} style={{ background: '#e9ecef', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', marginLeft: '6px' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Total & Checkout */}
        <div style={{ borderTop: '2px solid #f1f3f5', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>Total:</span>
            <span style={{ color: '#dc3545' }}>${totalCart.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{ width: '100%', backgroundColor: cart.length === 0 ? '#e9ecef' : '#dc3545', color: cart.length === 0 ? '#adb5bd' : '#fff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            COMPLETE SALE
          </button>
        </div>
      </div>
    </div>
  );
}