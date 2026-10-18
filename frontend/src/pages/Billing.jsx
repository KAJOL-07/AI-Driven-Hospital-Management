import React, { useState } from "react";
import { BILLING_RECORDS } from "../data/mockData";
import { Receipt, Search, DollarSign, CheckCircle2, AlertCircle, Download } from "lucide-react";

const statusColor = {
  "Paid in Full": "badge-available",
  "Partial Payment": "badge-cleaning",
  "Pending Payment": "badge-critical",
};

const Billing = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = BILLING_RECORDS.filter(b => {
    const matchSearch = b.patientName.toLowerCase().includes(search.toLowerCase()) || b.patientMRN.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = BILLING_RECORDS.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalCollected = BILLING_RECORDS.reduce((sum, b) => sum + b.amountPaid, 0);
  const totalOutstanding = BILLING_RECORDS.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Financial Records</span>
            </div>
            <h1 className="text-2xl font-extrabold text-main">Patient Billing & Accounts</h1>
            <p className="text-sm text-muted mt-1">Manage patient invoices, insurance claims, payment statuses, and outstanding balances.</p>
          </div>
          <button className="btn btn-secondary btn-md">
            <Download size={16} />
            <span>Export Billing Report</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search patient name or MRN..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["ALL","Paid in Full","Partial Payment","Pending Payment"].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-5 border-emerald-200 bg-emerald-50/40">
          <div className="text-xs font-bold text-emerald-800 uppercase">Total Billed (Active Patients)</div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-1 font-mono">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="card p-5 border-sky-200 bg-sky-50/40">
          <div className="text-xs font-bold text-sky-800 uppercase">Amount Collected</div>
          <div className="text-3xl font-extrabold text-sky-700 mt-1 font-mono">${totalCollected.toLocaleString()}</div>
        </div>
        <div className="card p-5 border-rose-200 bg-rose-50/40">
          <div className="text-xs font-bold text-rose-800 uppercase">Outstanding Balance</div>
          <div className="text-3xl font-extrabold text-rose-700 mt-1 font-mono">${totalOutstanding.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Patient</th>
                <th>Ward</th>
                <th>Room</th>
                <th>Lab</th>
                <th>Pharmacy</th>
                <th>Consult</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Insurance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><span className="font-mono text-xs font-bold">{b.id}</span></td>
                  <td>
                    <div className="font-bold text-main">{b.patientName}</div>
                    <div className="text-xs text-muted font-mono">{b.patientMRN}</div>
                  </td>
                  <td><span className="text-xs font-mono font-bold text-primary">{b.ward}</span></td>
                  <td><div className="text-xs font-mono">${b.roomCharges}</div></td>
                  <td><div className="text-xs font-mono">${b.labCharges}</div></td>
                  <td><div className="text-xs font-mono">${b.pharmaCharges}</div></td>
                  <td><div className="text-xs font-mono">${b.consultCharges}</div></td>
                  <td><div className="font-bold text-main font-mono">${b.totalAmount.toLocaleString()}</div></td>
                  <td><div className="font-bold text-emerald-600 font-mono">${b.amountPaid.toLocaleString()}</div></td>
                  <td><div className={`font-bold font-mono ${b.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>${b.balance.toLocaleString()}</div></td>
                  <td>
                    <div className="text-xs text-slate-700">{b.insurance}</div>
                    <div className="text-[11px] text-muted">{b.insuranceCoverage}% covered</div>
                  </td>
                  <td>
                    <span className={`badge text-xs ${statusColor[b.status] || "badge-secondary"}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
