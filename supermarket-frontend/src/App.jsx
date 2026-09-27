import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import POSCheckout from './components/POSCheckout';
import Inventory from './components/Inventory';
import Categories from './components/Categories';
import Reports from './components/Reports';
import ReceiptModal from './components/ReceiptModal';
import Suppliers from './components/Suppliers';
import DamagedStock from './components/DamagedStock';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('pos');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [backendStatus, setBackendStatus] = useState('connecting');

  // Receipt Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastSaleDetails, setLastSaleDetails] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', barcode: '', category_id: '', buy_price: '', sell_price: '', stock_quantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resCat, resProd] = await Promise.all([
        axios.get(`${API_BASE}/categories`),
        axios.get(`${API_BASE}/products`)
      ]);
      setCategories(resCat.data);
      setProducts(resProd.data);
      setBackendStatus('online');
    } catch (err) {
      console.error('API Error:', err);
      setBackendStatus('offline');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.qty >= product.stock_quantity) return alert('Out of stock!');
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      if (product.stock_quantity < 1) return alert('Out of stock!');
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty <= 0) return null;
        if (newQty > item.stock_quantity) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));

  const totalCart = cart.reduce((sum, item) => sum + (parseFloat(item.sell_price) * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const payload = {
        total_amount: totalCart,
        items: cart.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          unit_price: parseFloat(i.sell_price)
        }))
      };
      const res = await axios.post(`${API_BASE}/sales`, payload);
      
      setLastSaleDetails({
        id: res.data.sale_id,
        items: [...cart],
        total: totalCart
      });
      setIsReceiptOpen(true);

      setCart([]);
      fetchData();
    } catch (err) {
      alert('Sale failed: ' + err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      await axios.post(`${API_BASE}/categories`, { name: newCategoryName });
      setNewCategoryName('');
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/products`, {
        ...newProduct,
        buy_price: parseFloat(newProduct.buy_price),
        sell_price: parseFloat(newProduct.sell_price),
        stock_quantity: parseInt(newProduct.stock_quantity),
        category_id: parseInt(newProduct.category_id)
      });
      setNewProduct({ name: '', barcode: '', category_id: '', buy_price: '', sell_price: '', stock_quantity: '' });
      fetchData();
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#212529' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        apiBase={API_BASE}
        fetchData={fetchData}
      />

      <main style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'pos' && (
          <POSCheckout
            products={products}
            categories={categories}
            cart={cart}
            search={search}
            setSearch={setSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
            totalCart={totalCart}
            handleCheckout={handleCheckout}
          />
        )}

        {activeTab === 'inventory' && (
          <Inventory
            products={products}
            categories={categories}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleAddProduct={handleAddProduct}
            apiBase={API_BASE}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'categories' && (
          <Categories
            categories={categories}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            handleAddCategory={handleAddCategory}
          />
        )}

        {activeTab === 'suppliers' && (
          <Suppliers apiBase={API_BASE} products={products} onRefreshProducts={fetchData} />
        )}

        {activeTab === 'damaged' && (
          <DamagedStock 
            products={products} 
            apiBase={API_BASE} 
            onRefresh={fetchData} // تم تعديلها هنا إلى fetchData
          />
        )}

        {activeTab === 'reports' && (
          <Reports apiBase={API_BASE} />
        )}
      </main>

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        saleDetails={lastSaleDetails}
      />
    </div>
  );
}