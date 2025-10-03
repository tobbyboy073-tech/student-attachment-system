async function loadCompanies(q='') {
  const url = q ? `/api/companies?q=${encodeURIComponent(q)}` : '/api/companies';
  const res = await fetch(url);
  const companies = await res.json();
  const list = document.getElementById('companyList');
  list.innerHTML = '';
  if (!companies.length) {
    list.innerHTML = '<li class="empty">No companies found</li>';
    return;
  }
  companies.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item">
        <div class="main"><strong>${escape(c.name)}</strong> (${escape(c.location||'')})<div class="muted">${escape(c.description||'')}</div></div>
        <div class="actions">
          <button data-id="${c.id}" data-action="edit">Edit</button>
          <button data-id="${c.id}" data-action="delete">Delete</button>
        </div>
      </div>`;
    list.appendChild(li);
  });
}

function escape(s){ return (s==null) ? '' : String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'delete') {
    if (!confirm('Delete this company?')) return;
    const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
    const j = await res.json();
    alert(j.message || j.error);
    loadCompanies(document.getElementById('search').value.trim());
  } else if (action === 'edit') {
    // simple prompt-based edit
    const li = btn.closest('li');
    const oldName = li.querySelector('.main strong').textContent;
    const oldDesc = li.querySelector('.muted')?.textContent || '';
    const oldLocationMatch = li.querySelector('.main')?.textContent.match(/\(([^)]+)\)/);
    const oldLocation = oldLocationMatch ? oldLocationMatch[1] : '';
    const name = prompt('Company name', oldName);
    if (name == null) return;
    const location = prompt('Location', oldLocation);
    if (location == null) return;
    const description = prompt('Description', oldDesc);
    if (description == null) return;
    const res = await fetch(`/api/companies/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, location, description })
    });
    const j = await res.json();
    alert(j.message || j.error);
    loadCompanies(document.getElementById('search').value.trim());
  }
});

document.getElementById('btnSearch').addEventListener('click', () => loadCompanies(document.getElementById('search').value.trim()));
document.getElementById('btnClear').addEventListener('click', () => { document.getElementById('search').value=''; loadCompanies(); });
document.getElementById('btnExportCsv').addEventListener('click', () => window.location = '/export/companies');
document.getElementById('btnExportPdf').addEventListener('click', () => exportPdf('companies'));

function exportPdf(entity){
  fetch(`/api/${entity}`).then(r=>r.json()).then(items=>{
    const html = buildPrintHtml(entity, items);
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(()=>w.print(),300);
  });
}

function buildPrintHtml(entity, items){
  const title = entity.charAt(0).toUpperCase()+entity.slice(1);
  let rows = items.map(it => `<tr><td>${escape(it.name||it.title||'')}</td><td>${escape(it.location||it.company||'')}</td><td>${escape(it.description||it.opportunityTitle||'')}</td></tr>`).join('');
  if (!rows) rows = '<tr><td colspan="3">No items</td></tr>';
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px}</style></head><body><h1>${title}</h1><table><thead><tr><th>Name/Title</th><th>Company/Location</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

// initial load
loadCompanies();
