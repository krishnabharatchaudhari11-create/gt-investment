// Simple front-end demo logic (no backend).
// Stores demo wallet & transactions in localStorage.

const STORAGE_KEY = 'gt_demo_v1';
const defaultData = {
  balance: 0,
  tx: [],
  plans: []
};

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){ localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData)); return {...defaultData}; }
    return JSON.parse(raw);
  }catch(e){ console.error(e); localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData)); return {...defaultData}; }
}

function saveData(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function formatRupee(n){ return '₹' + Number(n).toLocaleString(); }

function renderStats(){
  const data = loadData();
  document.getElementById('totalBalance').textContent = formatRupee(data.balance || 0);
  document.getElementById('activePlans').textContent = data.plans.length || 0;
  document.getElementById('recentTx').textContent = (data.tx.length > 0) ? data.tx.length : 0;
  renderTxList();
}

function renderTxList(){
  const data = loadData();
  const txList = document.getElementById('txList');
  txList.innerHTML = '';
  if(!data.tx.length){
    txList.innerHTML = '<div class="muted">No transactions yet</div>';
    return;
  }
  data.tx.slice().reverse().forEach(t=>{
    const div = document.createElement('div');
    div.className = 'txItem';
    div.innerHTML = `<div>
      <div style="font-weight:600">${t.type}</div>
      <div class="muted">${t.date} • ${t.plan || ''}</div>
    </div>
    <div class="txAmount ${t.type==='Credit'?'text-success':''}">${formatRupee(t.amount)}</div>`;
    txList.appendChild(div);
  });
}

// INVEST / WITHDRAW
document.getElementById('investBtn').addEventListener('click', ()=>{
  const amt = Number(document.getElementById('amountInput').value || 0);
  const plan = document.getElementById('planSelect').value;
  if(amt <= 0){ alert('Enter valid amount'); return; }
  const data = loadData();
  data.balance = Number(data.balance || 0) + amt;
  data.plans.push({ plan, amount: amt, started: new Date().toISOString() });
  data.tx.push({ type:'Credit', amount:amt, plan, date: new Date().toLocaleString() });
  saveData(data);
  renderStats();
  alert('Invested ' + formatRupee(amt) + ' into ' + plan + ' (demo only)');
});

document.getElementById('withdrawBtn').addEventListener('click', ()=>{
  const amt = Number(document.getElementById('amountInput').value || 0);
  if(amt <= 0){ alert('Enter valid amount'); return; }
  const data = loadData();
  if((data.balance || 0) < amt){ alert('Insufficient balance'); return; }
  data.balance = Number(data.balance || 0) - amt;
  data.tx.push({ type:'Debit', amount:amt, date: new Date().toLocaleString() });
  saveData(data);
  renderStats();
  alert('Withdrew ' + formatRupee(amt) + ' (demo only)');
});

// QR generation (client-side)
const genBtn = document.getElementById('genQrBtn');
const downloadBtn = document.getElementById('downloadQr');
genBtn.addEventListener('click', async ()=>{
  const amount = Number(document.getElementById('qrAmount').value || 0);
  const name = document.getElementById('qrName').value || '';
  if(amount <= 0){ alert('Enter QR amount'); return; }
  // For demo we create a JSON payload inside QR. In real integration send to payment provider.
  const payload = JSON.stringify({ vendor:'gt-investment-demo', amount, name, time: new Date().toISOString() });
  const canvas = document.getElementById('qrCanvas');
  try{
    await QRCode.toCanvas(canvas, payload, { width:300, margin:1, color: { dark:'#111', light:'#f8fafc' }});
    document.getElementById('qrText').textContent = `Amount: ₹${amount}` + (name ? ' • ' + name : '');
  }catch(e){ console.error(e); alert('QR generate failed'); }
});

downloadBtn.addEventListener('click', ()=>{
  const canvas = document.getElementById('qrCanvas');
  if(!canvas) return alert('No QR to download');
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'payment-qr.png';
  a.click();
});

// small helper: set current year
document.getElementById('year').textContent = new Date().getFullYear();

// initial render
renderStats();
