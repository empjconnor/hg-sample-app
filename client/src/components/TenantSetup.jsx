import React, { useState, useEffect } from 'react';

const PLANS = [
  { value: 'starter', label: 'Starter' },
  { value: 'professional', label: 'Professional' },
  { value: 'enterprise', label: 'Enterprise' }
];

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'provisioning', label: 'Provisioning' },
  { value: 'active', label: 'Active' },
  { value: 'failed', label: 'Failed' }
];

function TenantSetup({ selectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({ status: 'pending', plan: 'starter' });
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
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCustomerId]);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/tenants/${selectedId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTenant(data);
        setForm({ status: data.status, plan: data.plan });
      })
      .catch(() => {
        setTenant(null);
        setForm({ status: 'pending', plan: 'starter' });
      });
  }, [selectedId]);

  function handleCustomerChange(e) {
    setSelectedId(e.target.value);
    setMessage(null);
  }

  function handleSelectChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/tenants/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error(`Server error (${res.status})`); }
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setTenant(data);
      setMessage({ type: 'success', text: 'Tenant configuration saved successfully' });

      // Mark the Tenant Setup onboarding step as completed
      fetch(`/api/customers/${selectedId}/onboarding/steps/step_3`, {
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
    return <div className="placeholder"><p>Loading...</p></div>;
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
    <div className="tenant-setup-tab">
      <h2>Tenant Setup</h2>
      <p className="tenant-setup-subtitle">Configure and provision customer tenant</p>

      <div className="customer-selector">
        <label htmlFor="tenant-customer-select">Select Customer</label>
        <select id="tenant-customer-select" value={selectedId} onChange={handleCustomerChange}>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {tenant && (
        <div className="tenant-details">
          <div className="tenant-id">Tenant ID: {tenant.id}</div>

          <form className="tenant-setup-form" onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="tenant-plan">Plan</label>
              <select
                id="tenant-plan"
                name="plan"
                value={form.plan}
                onChange={handleSelectChange}
              >
                {PLANS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tenant-status">Status</label>
              <select
                id="tenant-status"
                name="status"
                value={form.status}
                onChange={handleSelectChange}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {message && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="save-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save Tenant Configuration'}
            </button>
          </form>
        </div>
      )}

      {!tenant && selectedId && (
        <div className="placeholder">
          <p>No tenant found for this customer</p>
        </div>
      )}
    </div>
  );
}

export default TenantSetup;
