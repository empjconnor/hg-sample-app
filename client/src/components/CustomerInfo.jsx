import React, { useState, useEffect } from 'react';

function CustomerInfo({ selectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({ name: '', industry: '', region: '', contactEmail: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCustomers(data);
        const initial = selectedCustomerId
          ? data.find(c => c.id === selectedCustomerId) || data[0]
          : data[0];
        if (initial) {
          setSelectedId(initial.id);
          setForm({
            name: initial.name,
            industry: initial.industry,
            region: initial.region,
            contactEmail: initial.contactEmail
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCustomerId]);

  function handleCustomerChange(e) {
    const id = e.target.value;
    setSelectedId(id);
    setMessage(null);
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setForm({
        name: customer.name,
        industry: customer.industry,
        region: customer.region,
        contactEmail: customer.contactEmail
      });
    }
  }

  function handleInputChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Customer name is required' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/customers/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error(`Server error (${res.status})`); }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setCustomers(prev => prev.map(c => c.id === data.id ? data : c));
      setMessage({ type: 'success', text: 'Customer info saved successfully' });

      // Mark the Customer Info onboarding step as completed
      fetch(`/api/customers/${selectedId}/onboarding/steps/step_1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      }).catch(() => {});
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="placeholder"><p>Loading customers...</p></div>;
  }

  if (error) {
    return (
      <div className="placeholder">
        <p style={{ color: '#dc2626' }}>Failed to load customers</p>
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{error}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return <div className="placeholder"><p>No customers found</p></div>;
  }

  return (
    <div className="customer-info-tab">
      <h2>Customer Information</h2>
      <p className="customer-info-subtitle">Review and update customer details for onboarding</p>

      <div className="customer-selector">
        <label htmlFor="customer-select">Select Customer</label>
        <select id="customer-select" value={selectedId} onChange={handleCustomerChange}>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <form className="customer-info-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="customer-name">Company Name</label>
          <input
            id="customer-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-industry">Industry</label>
          <input
            id="customer-industry"
            name="industry"
            type="text"
            value={form.industry}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-region">Region</label>
          <input
            id="customer-region"
            name="region"
            type="text"
            value={form.region}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-email">Contact Email</label>
          <input
            id="customer-email"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleInputChange}
          />
        </div>

        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button type="submit" className="save-button" disabled={saving}>
          {saving ? 'Saving...' : 'Save Customer Info'}
        </button>
      </form>
    </div>
  );
}

export default CustomerInfo;
