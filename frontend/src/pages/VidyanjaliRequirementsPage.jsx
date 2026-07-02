import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./VidyanjaliRequirementsPage.css";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const pageSizes = [20, 40, 60, 100];
const formatMoney = (value) => currency.format(Number(value) || 0);
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const normalize = (value) => String(value || "").toUpperCase();

function PlanningDocument({ proposal }) {
  if (!proposal) return <p className="vj-muted">Click Final Preview after selecting a school and requirement items to generate the planning document.</p>;

  const areaNames = Object.keys(proposal.totals.byArea);

  return (
    <article className="vj-document">
      <div className="vj-document-cover">
        <p className="vj-kicker">Vidya Jyothi / Vidyanjali School Planning Note</p>
        <h2>{proposal.school.schoolName}</h2>
        <p>Academic Year: {proposal.academicYear}</p>
        <p>Generated for manual entry and proposal preparation in the official Vidyanjali portal.</p>
      </div>

      <section>
        <h3>1. School Details</h3>
        <div className="vj-doc-grid">
          <p><strong>UDISE Code</strong><span>{proposal.school.udiseCode}</span></p>
          <p><strong>Status</strong><span>{proposal.school.status}</span></p>
          <p><strong>State</strong><span>{proposal.school.state}</span></p>
          <p><strong>District</strong><span>{proposal.school.district}</span></p>
          <p><strong>Mandal / Block</strong><span>{proposal.school.block}</span></p>
          <p><strong>Address</strong><span>{proposal.school.address}</span></p>
          <p><strong>Prepared By</strong><span>{proposal.form.preparedBy || "-"}</span></p>
          <p><strong>Prepared For</strong><span>{proposal.form.preparedFor || "-"}</span></p>
          <p><strong>Estimated Start Date</strong><span>{proposal.form.startDate || "Not specified"}</span></p>
        </div>
      </section>

      <section>
        <h3>2. Requirement Summary</h3>
        <div className="vj-doc-summary">
          <p><strong>Selected work areas</strong><span>{areaNames.length}</span></p>
          <p><strong>Selected requirement items</strong><span>{proposal.lines.length}</span></p>
          <p><strong>Grand total estimated budget</strong><span>{formatMoney(proposal.totals.grandTotal)}</span></p>
        </div>
      </section>

      <section>
        <h3>3. Work Area Wise Budget</h3>
        <table>
          <thead><tr><th>Work Area</th><th>Subtotal</th></tr></thead>
          <tbody>{areaNames.map((area) => <tr key={area}><td>{area}</td><td>{formatMoney(proposal.totals.byArea[area])}</td></tr>)}</tbody>
        </table>
      </section>

      <section>
        <h3>4. Detailed Requirement Items for Vidyanjali Portal Entry</h3>
        <table>
          <thead>
            <tr><th>#</th><th>Work Area</th><th>Component</th><th>Sub-component</th><th>Item</th><th>Unit</th><th>Qty</th><th>Unit Cost</th><th>Estimated Amount</th><th>Remarks</th></tr>
          </thead>
          <tbody>
            {proposal.lines.map((line, index) => (
              <tr key={line.id}>
                <td>{index + 1}</td>
                <td>{line.workAreaName}</td>
                <td>{line.componentName}</td>
                <td>{line.subComponentName || "-"}</td>
                <td>{line.itemName}</td>
                <td>{line.unitType || "-"}</td>
                <td>{line.quantity}</td>
                <td>{formatMoney(line.unitCost)}</td>
                <td>{formatMoney(line.quantity * line.unitCost)}</td>
                <td>{line.remarks || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>5. Notes / Planning Remarks</h3>
        <p>{proposal.form.notes || "No additional notes entered."}</p>
        <p className="vj-muted">This document is a planning and proposal preparation aid only. Staff should verify quantities, costs, school needs, and eligibility before entering selections into the real Vidyanjali portal.</p>
      </section>
    </article>
  );
}

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
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

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
  const districts = useMemo(() => unique(schools.filter((school) => !filters.state || school.state === filters.state).map((school) => school.district)), [schools, filters.state]);
  const blocks = useMemo(() => unique(schools.filter((school) => (!filters.state || school.state === filters.state) && (!filters.district || school.district === filters.district)).map((school) => school.block)), [schools, filters.state, filters.district]);
  const filteredSchools = useMemo(() => {
    const query = normalize(filters.search);
    return schools.filter((school) =>
      (!filters.state || school.state === filters.state) &&
      (!filters.district || school.district === filters.district) &&
      (!filters.block || school.block === filters.block) &&
      (!query || normalize([school.udiseCode, school.schoolName, school.address, school.status].join(" ")).includes(query)),
    );
  }, [schools, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / pageSize));
  const pagedSchools = filteredSchools.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    setCurrentPage(1);
  };

  const updateItem = (component, workAreaName, patch) => {
    setSelectedItems((current) => {
      const existing = current[component.id] || { ...component, workAreaName, checked: false, quantity: component.defaultQuantity || 1, unitCost: Number(component.unitCost) || 0 };
      return { ...current, [component.id]: { ...existing, ...patch } };
    });
    setProposal(null);
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
    setTimeout(() => document.getElementById("proposal-output")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    return nextProposal;
  };

  const saveRequirement = () => {
    const nextProposal = previewProposal();
    if (!nextProposal) return;
    localStorage.setItem("vidyanjaliRequirements", JSON.stringify({ ...nextProposal, savedAt: new Date().toISOString() }));
    window.alert("Requirement planning document saved in this browser.");
  };

  const exportExcel = () => {
    const nextProposal = previewProposal();
    if (!nextProposal) return;
    setTimeout(() => {
      const html = document.getElementById("proposal-output")?.innerHTML || "";
      const blob = new Blob([html], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "vidyanjali-planning-document.xls";
      link.click();
    }, 0);
  };

  const printProposal = () => {
    if (previewProposal()) setTimeout(() => window.print(), 50);
  };

  return (
    <>
      <main className="vidyanjali-page">
        <section className="vj-hero no-print">
          <div className="container">
            <Link to="/">← Back to Home</Link>
            <p className="vj-kicker">Vidya Jyothi</p>
            <h1>Vidyanjali – Education Requirement Generation</h1>
            <p>Prepare a ready-to-print school planning and proposal document for manual entry into the real Vidyanjali portal.</p>
          </div>
        </section>

        <div className="container vj-content">
          {error && <div className="vj-error no-print">{error}</div>}

          <section className="vj-card no-print">
            <h2>1. Select School</h2>
            <div className="vj-grid vj-grid-4">
              <label>Academic Year<select value={filters.academicYear} onChange={(event) => updateFilter("academicYear", event.target.value)}><option>2026-27</option></select></label>
              <label>State<select value={filters.state} onChange={(event) => updateFilter("state", event.target.value)}><option value="">All states</option>{states.map((stateName) => <option key={stateName}>{stateName}</option>)}</select></label>
              <label>District<select value={filters.district} onChange={(event) => updateFilter("district", event.target.value)}><option value="">All districts</option>{districts.map((district) => <option key={district}>{district}</option>)}</select></label>
              <label>Mandal / Block<select value={filters.block} onChange={(event) => updateFilter("block", event.target.value)}><option value="">All blocks</option>{blocks.map((block) => <option key={block}>{block}</option>)}</select></label>
            </div>
            <label className="vj-full">Search by UDISE, school name, address, status<input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Try 36021100201 or MPPS SANDGAON" /></label>
          </section>

          <section className="vj-card no-print">
            <div className="vj-section-head">
              <div><h2>2. School Grid</h2><p>{filteredSchools.length} matching schools. Select one school for this planning document.</p></div>
              <label>Rows per page<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}>{pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
            </div>
            <div className="vj-table-wrap"><table><thead><tr><th>UDISE Code</th><th>School Name</th><th>Address</th><th>State</th><th>District</th><th>Block</th><th>Status</th><th>Action</th></tr></thead><tbody>{pagedSchools.map((school) => <tr key={school.id} className={selectedSchool?.id === school.id ? "vj-selected-row" : ""}><td>{school.udiseCode}</td><td>{school.schoolName}</td><td>{school.address}</td><td>{school.state}</td><td>{school.district}</td><td>{school.block}</td><td><span className={`vj-status ${/operational|active/i.test(school.status) ? "vj-status-ok" : ""}`}>{school.status}</span></td><td><button type="button" onClick={() => { setSelectedSchool(school); setProposal(null); }}>Select School</button></td></tr>)}</tbody></table></div>
            <div className="vj-pagination"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>Previous</button><span>Page {currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>Next</button></div>
          </section>

          <div className="vj-layout no-print">
            <div>
              <section className="vj-card"><h2>3. School Details</h2>{selectedSchool ? <div className="vj-school-detail"><p><strong>UDISE Code:</strong> {selectedSchool.udiseCode}</p><p><strong>Status:</strong> <span className="vj-status vj-status-ok">{selectedSchool.status}</span></p><p><strong>Academic Year:</strong> {selectedSchool.academicYear}</p><p><strong>State:</strong> {selectedSchool.state}</p><p><strong>District:</strong> {selectedSchool.district}</p><p><strong>Block:</strong> {selectedSchool.block}</p><p><strong>School:</strong> {selectedSchool.schoolName}</p><p><strong>Address:</strong> {selectedSchool.address}</p></div> : <p>Select a school to review details.</p>}</section>

              <section className="vj-card"><h2>4. Select Work Areas & Components</h2>{workAreas.map((workArea) => <details key={workArea.id}><summary>{workArea.workAreaName} ({components.filter((component) => component.workAreaId === workArea.id).length} items)</summary><div className="vj-table-wrap"><table><thead><tr><th>Select</th><th>Work Area</th><th>Component</th><th>Sub-component</th><th>Item Name</th><th>Unit Type</th><th>Unit Cost</th><th>Quantity / Units</th><th>Estimated Amount</th><th>Remarks & Excel Columns</th></tr></thead><tbody>{components.filter((component) => component.workAreaId === workArea.id).map((component) => { const selected = selectedItems[component.id] || { checked: false, quantity: component.defaultQuantity || 1, unitCost: Number(component.unitCost) || 0 }; return <tr key={component.id}><td><input type="checkbox" checked={selected.checked} onChange={(event) => updateItem(component, workArea.workAreaName, { checked: event.target.checked })} /></td><td>{workArea.workAreaName}</td><td>{component.componentName}</td><td>{component.subComponentName || "-"}</td><td>{component.itemName}</td><td>{component.unitType || "-"}</td><td><input type="number" min="0" value={selected.unitCost} onChange={(event) => updateItem(component, workArea.workAreaName, { unitCost: Number(event.target.value) })} /></td><td><input type="number" min="0" step="0.01" value={selected.quantity} onChange={(event) => updateItem(component, workArea.workAreaName, { quantity: Number(event.target.value) })} /></td><td>{formatMoney(selected.quantity * selected.unitCost)}</td><td>{component.remarks}<div className="vj-original">{Object.entries(component.original || {}).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" | ")}</div></td></tr>; })}</tbody></table></div></details>)}</section>

              <section className="vj-card"><h2>5. Proposal Notes</h2><div className="vj-grid vj-grid-3"><label>Prepared By<input value={form.preparedBy} onChange={(event) => setForm({ ...form, preparedBy: event.target.value })} /></label><label>Prepared For<input value={form.preparedFor} onChange={(event) => setForm({ ...form, preparedFor: event.target.value })} /></label><label>Estimated Start Date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label></div><label className="vj-full">Notes / Remarks<textarea rows="4" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Add planning assumptions, school visit notes, donor remarks, or Vidyanjali portal entry notes." /></label></section>
            </div>

            <aside className="vj-card vj-summary"><h2>Estimated Budget Summary</h2><p>Selected work areas: <strong>{Object.keys(totals.byArea).length}</strong></p><p>Selected items: <strong>{selectedLines.length}</strong></p><div className="vj-total">{formatMoney(totals.grandTotal)}</div>{Object.entries(totals.byArea).map(([area, amount]) => <p key={area}><strong>{area}:</strong> {formatMoney(amount)}</p>)}</aside>
          </div>

          <section className="vj-card vj-final-actions no-print">
            <div><h2>6. Generate Final Planning Document</h2><p>Use this final preview to review the complete school requirement plan before printing or re-entering the selections in the official Vidyanjali portal.</p></div>
            <div className="vj-actions"><button type="button" onClick={previewProposal}>Final Preview</button><button type="button" onClick={saveRequirement}>Save Requirement</button><button type="button" onClick={exportExcel}>Export Excel</button><button type="button" onClick={printProposal}>Print Planning Document</button></div>
          </section>

          <section id="proposal-output" className="vj-card vj-proposal-print">
            <PlanningDocument proposal={proposal} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
