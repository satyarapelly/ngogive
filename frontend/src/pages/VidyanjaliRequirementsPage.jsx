import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import SiteHeader from "../components/SiteHeader";
import "./VidyanjaliRequirementsPage.css";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const formatMoney = (value) => currency.format(Number(value) || 0);
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const normalize = (value) => String(value || "").toUpperCase();

export default function VidyanjaliRequirementsPage() {
  const [schools, setSchools] = useState([]);
  const [workAreas, setWorkAreas] = useState([]);
  const [components, setComponents] = useState([]);
  const [filters, setFilters] = useState({ academicYear: "2026-27", state: "TELANGANA", district: "", block: "", search: "" });
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ preparedBy: "", preparedFor: "", startDate: "", notes: "" });

  useEffect(() => {
    Promise.all([
      fetch("/data/vidyanjali/schools.json").then((response) => response.json()),
      fetch("/data/vidyanjali/workAreas.json").then((response) => response.json()),
      fetch("/data/vidyanjali/components.json").then((response) => response.json()),
    ])
      .then(([schoolData, workAreaData, componentData]) => {
        setSchools(schoolData);
        setWorkAreas(workAreaData);
        setComponents(componentData);
      })
      .catch(() => setError("Unable to load Vidyanjali Excel-derived JSON data."));
  }, []);

  const states = useMemo(() => unique(schools.map((school) => school.state)), [schools]);
  const districts = useMemo(
    () => unique(schools.filter((school) => !filters.state || school.state === filters.state).map((school) => school.district)),
    [schools, filters.state],
  );
  const blocks = useMemo(
    () => unique(schools.filter((school) => (!filters.state || school.state === filters.state) && (!filters.district || school.district === filters.district)).map((school) => school.block)),
    [schools, filters.state, filters.district],
  );
  const filteredSchools = useMemo(() => {
    const query = normalize(filters.search);
    return schools.filter((school) =>
      (!filters.state || school.state === filters.state) &&
      (!filters.district || school.district === filters.district) &&
      (!filters.block || school.block === filters.block) &&
      (!query || normalize([school.udiseCode, school.schoolName, school.address, school.status].join(" ")).includes(query)),
    );
  }, [schools, filters]);

  const selectedLines = useMemo(() => Object.values(selectedItems).filter((item) => item.checked), [selectedItems]);
  const totals = useMemo(() => {
    const byArea = selectedLines.reduce((acc, item) => {
      acc[item.workAreaName] = (acc[item.workAreaName] || 0) + item.quantity * item.unitCost;
      return acc;
    }, {});
    return { byArea, grandTotal: Object.values(byArea).reduce((sum, amount) => sum + amount, 0) };
  }, [selectedLines]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value, ...(name === "state" ? { district: "", block: "" } : {}), ...(name === "district" ? { block: "" } : {}) }));
  };

  const updateItem = (component, workAreaName, patch) => {
    setSelectedItems((current) => {
      const existing = current[component.id] || { ...component, workAreaName, checked: false, quantity: component.defaultQuantity || 1, unitCost: Number(component.unitCost) || 0 };
      return { ...current, [component.id]: { ...existing, ...patch } };
    });
  };

  const validate = () => {
    if (!selectedSchool) return "School selection is required before proposal generation.";
    if (!selectedLines.length) return "Select at least one work area item.";
    if (selectedLines.some((item) => !(Number(item.quantity) > 0))) return "Quantity must be a positive number for selected items.";
    if (selectedLines.some((item) => Number.isNaN(Number(item.unitCost)))) return "Unit cost must be numeric.";
    return "";
  };

  const previewProposal = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setProposal(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return null;
    }
    setError("");
    const nextProposal = { school: selectedSchool, form, lines: selectedLines, totals, academicYear: filters.academicYear };
    setProposal(nextProposal);
    return nextProposal;
  };

  const saveRequirement = () => {
    const nextProposal = previewProposal();
    if (!nextProposal) return;
    localStorage.setItem("vidyanjaliRequirements", JSON.stringify({ ...nextProposal, savedAt: new Date().toISOString() }));
    window.alert("Requirement saved in this browser.");
  };

  const exportExcel = () => {
    const nextProposal = previewProposal();
    if (!nextProposal) return;
    const html = document.getElementById("proposal-output")?.innerHTML || "";
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vidyanjali-requirement.xls";
    link.click();
  };

  const printProposal = () => {
    if (previewProposal()) window.print();
  };

  return (
    <>
      <SiteHeader />
      <main className="vidyanjali-page">
        <section className="vj-hero">
          <div className="container">
            <Link to="/">← Back to Home</Link>
            <h1>Vidyanjali – Education Requirement Generation</h1>
            <p>Generate school adoption requirements from Excel-derived school and budget master data.</p>
          </div>
        </section>

        <div className="container vj-content">
          {error && <div className="vj-error">{error}</div>}

          <section className="vj-card">
            <h2>Select School</h2>
            <div className="vj-grid vj-grid-4">
              <label>Academic Year<select value={filters.academicYear} onChange={(event) => updateFilter("academicYear", event.target.value)}><option>2026-27</option></select></label>
              <label>State<select value={filters.state} onChange={(event) => updateFilter("state", event.target.value)}><option value="">All states</option>{states.map((stateName) => <option key={stateName}>{stateName}</option>)}</select></label>
              <label>District<select value={filters.district} onChange={(event) => updateFilter("district", event.target.value)}><option value="">All districts</option>{districts.map((district) => <option key={district}>{district}</option>)}</select></label>
              <label>Mandal / Block<select value={filters.block} onChange={(event) => updateFilter("block", event.target.value)}><option value="">All blocks</option>{blocks.map((block) => <option key={block}>{block}</option>)}</select></label>
            </div>
            <label className="vj-full">Search by UDISE, school name, address, status<input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Try 36021100201 or MPPS SANDGAON" /></label>
          </section>

          <section className="vj-card">
            <h2>School Grid</h2>
            <div className="vj-table-wrap"><table><thead><tr><th>UDISE Code</th><th>School Name</th><th>Address</th><th>State</th><th>District</th><th>Block</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredSchools.slice(0, 100).map((school) => <tr key={school.id}><td>{school.udiseCode}</td><td>{school.schoolName}</td><td>{school.address}</td><td>{school.state}</td><td>{school.district}</td><td>{school.block}</td><td><span className={`vj-status ${/operational|active/i.test(school.status) ? "vj-status-ok" : ""}`}>{school.status}</span></td><td><button type="button" onClick={() => setSelectedSchool(school)}>Select School</button></td></tr>)}</tbody></table></div>
          </section>

          <div className="vj-layout">
            <div>
              <section className="vj-card"><h2>School Details</h2>{selectedSchool ? <div><p><strong>UDISE Code:</strong> {selectedSchool.udiseCode}</p><p><strong>Status:</strong> <span className="vj-status vj-status-ok">{selectedSchool.status}</span></p><p><strong>Academic Year:</strong> {selectedSchool.academicYear}</p><p><strong>State:</strong> {selectedSchool.state}</p><p><strong>District:</strong> {selectedSchool.district}</p><p><strong>Block:</strong> {selectedSchool.block}</p><p><strong>School:</strong> {selectedSchool.schoolName}</p><p><strong>Address:</strong> {selectedSchool.address}</p></div> : <p>Select a school to review details.</p>}</section>

              <section className="vj-card"><h2>Select Work Areas & Components</h2>{workAreas.map((workArea) => <details key={workArea.id}><summary>{workArea.workAreaName} ({components.filter((component) => component.workAreaId === workArea.id).length} items)</summary><div className="vj-table-wrap"><table><thead><tr><th>Select</th><th>Work Area</th><th>Component</th><th>Sub-component</th><th>Item Name</th><th>Unit Type</th><th>Unit Cost</th><th>Quantity / Units</th><th>Estimated Amount</th><th>Remarks & Excel Columns</th></tr></thead><tbody>{components.filter((component) => component.workAreaId === workArea.id).map((component) => { const selected = selectedItems[component.id] || { checked: false, quantity: component.defaultQuantity || 1, unitCost: Number(component.unitCost) || 0 }; return <tr key={component.id}><td><input type="checkbox" checked={selected.checked} onChange={(event) => updateItem(component, workArea.workAreaName, { checked: event.target.checked })} /></td><td>{workArea.workAreaName}</td><td>{component.componentName}</td><td>{component.subComponentName || "-"}</td><td>{component.itemName}</td><td>{component.unitType || "-"}</td><td><input type="number" min="0" value={selected.unitCost} onChange={(event) => updateItem(component, workArea.workAreaName, { unitCost: Number(event.target.value) })} /></td><td><input type="number" min="0" step="0.01" value={selected.quantity} onChange={(event) => updateItem(component, workArea.workAreaName, { quantity: Number(event.target.value) })} /></td><td>{formatMoney(selected.quantity * selected.unitCost)}</td><td>{component.remarks}<div className="vj-original">{Object.entries(component.original || {}).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" | ")}</div></td></tr>; })}</tbody></table></div></details>)}</section>

              <section className="vj-card"><h2>Requirement / Proposal Preview</h2><div className="vj-grid vj-grid-3"><label>Prepared By<input value={form.preparedBy} onChange={(event) => setForm({ ...form, preparedBy: event.target.value })} /></label><label>Prepared For<input value={form.preparedFor} onChange={(event) => setForm({ ...form, preparedFor: event.target.value })} /></label><label>Estimated Start Date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label></div><label className="vj-full">Notes / Remarks<textarea rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label><div id="proposal-output" className="vj-proposal">{proposal && <><h3>{proposal.school.schoolName} Requirement Proposal</h3><p><strong>Academic Year:</strong> {proposal.academicYear} <strong>Start:</strong> {proposal.form.startDate || "Not specified"}</p><p><strong>School:</strong> {proposal.school.udiseCode}, {proposal.school.address}</p><table><thead><tr><th>Work Area</th><th>Item</th><th>Qty</th><th>Unit Cost</th><th>Amount</th></tr></thead><tbody>{proposal.lines.map((line) => <tr key={line.id}><td>{line.workAreaName}</td><td>{line.itemName}</td><td>{line.quantity}</td><td>{formatMoney(line.unitCost)}</td><td>{formatMoney(line.quantity * line.unitCost)}</td></tr>)}</tbody></table><h3>Grand Total: {formatMoney(proposal.totals.grandTotal)}</h3><p><strong>Notes:</strong> {proposal.form.notes || "-"}</p></>}</div></section>
            </div>

            <aside className="vj-card vj-summary"><h2>Estimated Budget Summary</h2><p>Selected work areas: <strong>{Object.keys(totals.byArea).length}</strong></p><p>Selected items: <strong>{selectedLines.length}</strong></p><div className="vj-total">{formatMoney(totals.grandTotal)}</div>{Object.entries(totals.byArea).map(([area, amount]) => <p key={area}><strong>{area}:</strong> {formatMoney(amount)}</p>)}<div className="vj-actions"><button type="button" onClick={saveRequirement}>Save Requirement</button><button type="button" onClick={previewProposal}>Preview Proposal</button><button type="button" onClick={exportExcel}>Export Excel</button><button type="button" onClick={printProposal}>Print</button></div></aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
