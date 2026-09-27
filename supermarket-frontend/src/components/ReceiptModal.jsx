import React from 'react';
import { Printer, CheckCircle, X } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, saleDetails }) {
  if (!isOpen || !saleDetails) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000
    }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div style={{
        backgroundColor: '#fff', width: '380px', borderRadius: '8px',
        padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} className="no-print" style={{
          position: 'absolute', top: '12px', right: '12px', border: 'none',
          background: 'none', cursor: 'pointer', color: '#6c757d'
        }}>
          <X size={20} />
        </button>

        {/* Printable Area */}
        <div id="receipt-print-area" style={{ textAlign: 'center', color: '#212529' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }} className="no-print">
            <CheckCircle size={48} color="#198754" />
          </div>
          <h2 style={{ margin: '4px 0', fontSize: '20px', color: '#dc3545' }}>Supermarket ERP</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Official Sales Receipt</p>
          
          <div style={{ margin: '16px 0', borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc', padding: '8px 0', fontSize: '12px', textAlign: 'left' }}>
            <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
            <div><strong>Receipt No:</strong> #{saleDetails.id || Math.floor(100000 + Math.random() * 900000)}</div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '16px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '4px 0' }}>Item</th>
                <th style={{ padding: '4px 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '4px 0', textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {saleDetails.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '6px 0', textAlign: 'left' }}>{item.name}</td>
                  <td style={{ padding: '6px 0', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '6px 0', textAlign: 'right' }}>${(parseFloat(item.sell_price) * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ borderTop: '2px solid #212529', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
            <span>TOTAL:</span>
            <span style={{ color: '#dc3545' }}>${saleDetails.total.toFixed(2)}</span>
          </div>

          <p style={{ marginTop: '20px', fontSize: '11px', color: '#888' }}>Thank you for shopping with us!</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }} className="no-print">
          <button onClick={handlePrint} style={{
            flex: 1, backgroundColor: '#dc3545', color: '#fff', border: 'none',
            padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Printer size={18} /> Print Receipt
          </button>
          <button onClick={onClose} style={{
            backgroundColor: '#e9ecef', color: '#495057', border: 'none',
            padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}