import React from "react";
import { PHARMACY_INVENTORY } from "../data/mockData";
import { Package, AlertCircle, Search, PlusCircle } from "lucide-react";
import { useState } from "react";

const statusColor = {
  "In Stock": "badge-available",
  "Low Stock": "badge-cleaning",
  "Critical Low": "badge-critical",
};

const Pharmacy = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = PHARMACY_INVENTORY.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || item.status === filter;
    return matchSearch && matchFilter;
  });

  const criticalCount = PHARMACY_INVENTORY.filter(i => i.status === "Critical Low").length;
  const lowCount = PHARMACY_INVENTORY.filter(i => i.status === "Low Stock").length;
  const totalItems = PHARMACY_INVENTORY.length;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-ai">Medication Registry</span>
              {criticalCount > 0 && <span className="badge badge-critical">{criticalCount} Critical Low</span>}
            </div>
            <h1 className="text-2xl font-extrabold text-main">Pharmacy & Drug Inventory</h1>
            <p className="text-sm text-muted mt-1">Monitor hospital drug stock levels, expiry dates, dispensing records and low-stock alerts.</p>
          </div>
          <button className="btn btn-primary btn-md">
            <PlusCircle size={16} />
            <span>Add Inventory</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="form-control pl-9 text-sm" placeholder="Search drug name or category..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {["ALL","In Stock","Low Stock","Critical Low"].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Drug Items", value: totalItems, color: "text-main" },
          { label: "In Stock", value: PHARMACY_INVENTORY.filter(i => i.status === "In Stock").length, color: "text-emerald-600" },
          { label: "Low Stock Alert", value: lowCount, color: "text-amber-600" },
          { label: "Critical Low", value: criticalCount, color: "text-rose-600" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="text-xs text-muted font-semibold">{s.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Drug / Medication</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Stock Required</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
                <th>Unit Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="font-bold text-main">{item.name}</div>
                    <div className="text-xs text-muted font-mono">{item.id}</div>
                  </td>
                  <td><span className="badge badge-secondary text-xs">{item.category}</span></td>
                  <td>
                    <div className={`font-bold font-mono text-sm ${item.status === "Critical Low" ? "text-rose-600" : item.status === "Low Stock" ? "text-amber-600" : "text-emerald-600"}`}>
                      {item.stock} {item.unit}
                    </div>
                  </td>
                  <td><div className="text-xs text-slate-700">{item.minStock} {item.unit}</div></td>
                  <td><div className="text-xs text-muted">{item.expiryDate}</div></td>
                  <td><div className="text-xs text-slate-700">{item.supplier}</div></td>
                  <td><div className="text-xs font-bold text-emerald-700">${item.price}</div></td>
                  <td>
                    <span className={`badge text-xs ${statusColor[item.status] || "badge-secondary"}`}>{item.status}</span>
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

export default Pharmacy;
