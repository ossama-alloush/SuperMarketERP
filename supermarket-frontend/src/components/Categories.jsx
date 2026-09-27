import React from 'react';

export default function Categories({ categories, newCategoryName, setNewCategoryName, handleAddCategory }) {
  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, color: '#dc3545' }}>+ Add Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '12px' }}>
          <input
            placeholder="Category Name"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            required
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Add Category
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
            <tr>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '12px' }}>{c.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{c.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}