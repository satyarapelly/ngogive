(() => {
  const $ = (id) => document.getElementById(id);
  const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);
  const state = { schools: [], workAreas: [], components: [], selectedSchool: null, saved: [] };
  const clean = (v) => String(v || '').toUpperCase();
  const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();
  const error = (msg) => { $('vj-error').textContent = msg; $('vj-error').style.display = msg ? 'block' : 'none'; if (msg) scrollTo(0, 0); };

  Promise.all([
    fetch('data/vidyanjali/schools.json').then(r => r.json()),
    fetch('data/vidyanjali/workAreas.json').then(r => r.json()),
    fetch('data/vidyanjali/components.json').then(r => r.json())
  ]).then(([schools, workAreas, components]) => {
    Object.assign(state, { schools, workAreas, components });
    fillSelect('state', unique(schools.map(s => s.state)), 'All states');
    $('state').value = 'TELANGANA';
    renderDistricts(); renderSchools(); renderWorkAreas(); updateBudget();
  }).catch(() => error('Unable to load Vidyanjali Excel-derived JSON data.'));

  function fillSelect(id, values, first) { $(id).innerHTML = `<option value="">${first}</option>` + values.map(v => `<option>${v}</option>`).join(''); }
  function filteredSchools() {
    const q = clean($('schoolSearch').value);
    return state.schools.filter(s => (!$('state').value || s.state === $('state').value) && (!$('district').value || s.district === $('district').value) && (!$('block').value || s.block === $('block').value) && (!q || clean([s.udiseCode, s.schoolName, s.address, s.status].join(' ')).includes(q)));
  }
  function renderDistricts() { fillSelect('district', unique(state.schools.filter(s => !$('state').value || s.state === $('state').value).map(s => s.district)), 'All districts'); renderBlocks(); }
  function renderBlocks() { fillSelect('block', unique(state.schools.filter(s => (!$('state').value || s.state === $('state').value) && (!$('district').value || s.district === $('district').value)).map(s => s.block)), 'All blocks'); }
  function renderSchools() {
    const rows = filteredSchools().slice(0, 100).map(s => `<tr><td>${s.udiseCode}</td><td>${s.schoolName}</td><td>${s.address}</td><td>${s.state}</td><td>${s.district}</td><td>${s.block}</td><td><span class="vj-status ${/operational|active/i.test(s.status) ? 'vj-status--ok' : ''}">${s.status}</span></td><td><button class="btn-vj select-school" data-id="${s.id}">Select School</button></td></tr>`).join('');
    $('schoolRows').innerHTML = rows || '<tr><td colspan="8">No matching schools found.</td></tr>';
  }
  function renderSchoolSummary() {
    const s = state.selectedSchool;
    $('schoolSummary').innerHTML = `<h2>School Details</h2><div class="vj-card"><p><strong>UDISE Code:</strong> ${s.udiseCode}</p><p><strong>Status:</strong> <span class="vj-status vj-status--ok">${s.status}</span></p><p><strong>Academic Year:</strong> ${s.academicYear}</p><p><strong>State:</strong> ${s.state}</p><p><strong>District:</strong> ${s.district}</p><p><strong>Block:</strong> ${s.block}</p><p><strong>School:</strong> ${s.schoolName}</p><p><strong>Address:</strong> ${s.address}</p></div>`;
  }
  function renderWorkAreas() {
    $('workAreas').innerHTML = state.workAreas.map(wa => {
      const items = state.components.filter(c => c.workAreaId === wa.id);
      return `<details><summary>${wa.workAreaName} (${items.length} items)</summary><div class="vj-table-wrap"><table class="table table-sm table-bordered vj-table"><thead><tr><th>Select</th><th>Work Area</th><th>Component</th><th>Sub-component</th><th>Item Name</th><th>Unit Type</th><th>Unit Cost</th><th>Quantity / Units</th><th>Estimated Amount</th><th>Remarks & Excel Columns</th></tr></thead><tbody>${items.map(c => `<tr data-work="${wa.workAreaName}" data-id="${c.id}"><td><input type="checkbox" class="item-check"></td><td>${wa.workAreaName}</td><td>${c.componentName}</td><td>${c.subComponentName || '-'}</td><td>${c.itemName}</td><td>${c.unitType || '-'}</td><td><input class="form-control unit-cost" type="number" min="0" value="${c.unitCost}"></td><td><input class="form-control quantity" type="number" min="0" step="0.01" value="${c.defaultQuantity || 1}"></td><td class="amount">${money(c.unitCost * (c.defaultQuantity || 1))}</td><td>${c.remarks || ''}<div class="vj-original">${Object.entries(c.original || {}).map(([k,v]) => v ? `${k}: ${v}` : '').filter(Boolean).join(' | ')}</div></td></tr>`).join('')}</tbody></table></div></details>`;
    }).join('');
  }
  function selectedItems() {
    return [...document.querySelectorAll('tr[data-id]')].filter(r => r.querySelector('.item-check').checked).map(r => {
      const c = state.components.find(x => x.id == r.dataset.id), qty = Number(r.querySelector('.quantity').value), cost = Number(r.querySelector('.unit-cost').value);
      return { ...c, workAreaName: r.dataset.work, quantity: qty, unitCost: cost, estimatedAmount: qty * cost };
    });
  }
  function updateBudget() {
    document.querySelectorAll('tr[data-id]').forEach(r => r.querySelector('.amount').textContent = money(Number(r.querySelector('.quantity').value) * Number(r.querySelector('.unit-cost').value)));
    const items = selectedItems(), areas = unique(items.map(i => i.workAreaName));
    $('waCount').textContent = areas.length; $('itemCount').textContent = items.length; $('grandTotal').textContent = money(items.reduce((s,i)=>s+i.estimatedAmount,0));
    $('subtotalRows').innerHTML = areas.map(a => `<p><strong>${a}:</strong> ${money(items.filter(i => i.workAreaName === a).reduce((s,i)=>s+i.estimatedAmount,0))}</p>`).join('');
  }
  function validate() { const items = selectedItems(); if (!state.selectedSchool) return 'School selection is required before proposal generation.'; if (!items.length) return 'Select at least one work area item.'; if (items.some(i => !(i.quantity > 0))) return 'Quantity must be a positive number for selected items.'; if (items.some(i => Number.isNaN(i.unitCost))) return 'Unit cost must be numeric.'; return ''; }
  function preview() {
    const msg = validate(); if (msg) return error(msg); error('');
    const items = selectedItems(), total = items.reduce((s,i)=>s+i.estimatedAmount,0), s = state.selectedSchool;
    $('proposalOutput').innerHTML = `<h3>${s.schoolName} Requirement Proposal</h3><p><strong>Academic Year:</strong> ${$('academicYear').value} <strong>Start:</strong> ${$('startDate').value || 'Not specified'}</p><p><strong>School:</strong> ${s.udiseCode}, ${s.address}</p><table class="table table-bordered"><thead><tr><th>Work Area</th><th>Item</th><th>Qty</th><th>Unit Cost</th><th>Amount</th></tr></thead><tbody>${items.map(i => `<tr><td>${i.workAreaName}</td><td>${i.itemName}</td><td>${i.quantity}</td><td>${money(i.unitCost)}</td><td>${money(i.estimatedAmount)}</td></tr>`).join('')}</tbody></table><h3>Grand Total: ${money(total)}</h3><p><strong>Notes:</strong> ${$('notes').value || '-'}</p>`;
  }
  function exportExcel() { preview(); const html = $('proposalOutput').innerHTML; const blob = new Blob([html], {type:'application/vnd.ms-excel'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vidyanjali-requirement.xls'; a.click(); }
  $('state').addEventListener('change', () => { renderDistricts(); renderSchools(); }); $('district').addEventListener('change', () => { renderBlocks(); renderSchools(); }); $('block').addEventListener('change', renderSchools); $('schoolSearch').addEventListener('input', renderSchools);
  document.addEventListener('click', e => { if (e.target.matches('.select-school')) { state.selectedSchool = state.schools.find(s => s.id == e.target.dataset.id); renderSchoolSummary(); } });
  document.addEventListener('input', e => { if (e.target.matches('.quantity,.unit-cost,.item-check')) updateBudget(); }); document.addEventListener('change', e => { if (e.target.matches('.item-check')) updateBudget(); });
  $('previewBtn').addEventListener('click', preview); $('printBtn').addEventListener('click', () => { preview(); if (!validate()) print(); }); $('excelBtn').addEventListener('click', exportExcel); $('saveBtn').addEventListener('click', () => { const msg = validate(); if (msg) return error(msg); preview(); localStorage.setItem('vidyanjaliRequirements', JSON.stringify({ school: state.selectedSchool, items: selectedItems(), savedAt: new Date().toISOString() })); alert('Requirement saved in this browser.'); });
})();
