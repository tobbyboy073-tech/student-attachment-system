async function loadApplications(q='') {
  const url = q ? `/api/applications?q=${encodeURIComponent(q)}` : '/api/applications';
  const res = await fetch(url);
  const items = await res.json();
  const list = document.getElementById('applicationList');
  list.innerHTML = '';
  if (!items.length) { list.innerHTML = '<li class="empty">No applications</li>'; return; }
  items.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="item"><div class="main"><b>${escape(a.studentName||a.student)}</b> applied to <b>${escape(a.companyName||a.company)}</b> for <i>${escape(a.opportunityTitle||a.opportunity)}</i></div>
      <div class="actions"><button data-id="${a.id}" data-action="delete">Delete</button></div></div>`;
    list.appendChild(li);
  });
}

function escape(s){ return (s==null) ? '' : String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (btn.dataset.action === 'delete') {
    if (!confirm('Delete this application?')) return;
    const res = await fetch(`/api/applications/${btn.dataset.id}`, { method: 'DELETE' });
    const j = await res.json();
    alert(j.message || j.error);
    loadApplications(document.getElementById('search').value.trim());
  }
});

document.getElementById('btnSearch').addEventListener('click', () => loadApplications(document.getElementById('search').value.trim()));
document.getElementById('btnClear').addEventListener('click', () => { document.getElementById('search').value=''; loadApplications(); });
document.getElementById('btnExportCsv').addEventListener('click', () => window.location = '/export/applications');
document.getElementById('btnExportPdf').addEventListener('click', () => exportPdf('applications'));

function exportPdf(entity){
  fetch(`/api/${entity}`).then(r=>r.json()).then(items=>{
    const html = buildPrintHtml(entity, items);
    const w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.focus(); setTimeout(()=>w.print(),300);
  });
}

function buildPrintHtml(entity, items){
  const title = entity.charAt(0).toUpperCase()+entity.slice(1);
  let rows = items.map(i => `<tr><td>${escape(i.studentName||i.student)}</td><td>${escape(i.companyName||i.company)}</td><td>${escape(i.opportunityTitle||i.opportunity)}</td></tr>`).join('');
  if (!rows) rows = '<tr><td colspan="3">No items</td></tr>';
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px}</style></head><body><h1>${title}</h1><table><thead><tr><th>Student</th><th>Company</th><th>Opportunity</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

// initial load
loadApplications();

