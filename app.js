/* Apartmanım • 10 daire, çoklu yönetici, güvenli Supabase erişimi. */
const APP = document.getElementById('app');
const CFG = window.APARTMAN_CONFIG || {};
const ISTANBUL_DATE = () => new Date().toLocaleDateString('sv-SE', {timeZone:'Europe/Istanbul'});
const MONTH = () => ISTANBUL_DATE().slice(0,7);
const PERIOD = (v) => `${v || MONTH()}-01`;
const money = n => new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2}).format(Number(n)||0);
const number = n => new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(Number(n)||0);
const monthLabel = v => {const [y,m]=String(v||MONTH()).slice(0,7).split('-').map(Number);return new Intl.DateTimeFormat('tr-TR',{month:'long',year:'numeric'}).format(new Date(y,m-1,1));};
const shortDate = s => s ? String(s).slice(0,10).split('-').reverse().join('.') : '—';
const esc = v => String(v??'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr = esc;
const num = v => Number(v)||0;
const pad2 = n => String(n).padStart(2,'0');
const icons = {
  building:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M11 21v-3h2v3"/>',
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-16a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
  wallet:'<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 15h2"/>',
  receipt:'<path d="M4 3v18l3-2 3 2 3-2 3 2 4-2V3zM8 8h8M8 12h8M8 16h5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 5 5v1"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1-2 2-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21h-3v-.2a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1-2-2 .1-.1a1.6 1.6 0 0 0 .3-1.7A1.6 1.6 0 0 0 6.1 14H6v-3h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1 2-2 .1.1A1.6 1.6 0 0 0 11 6.6a1.6 1.6 0 0 0 1-1.5V5h3v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1 2 2-.1.1a1.6 1.6 0 0 0-.3 1.7 1.6 1.6 0 0 0 1.5 1h.1v3h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
  chart:'<path d="M4 20V11m5 9V5m5 15v-8m5 8V8M2 21h20"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  transfer:'<path d="M4 7h15m-5-4 5 4-5 4M20 17H5m5-4-5 4 5 4"/>',
  down:'<path d="M12 3v18m-6-6 6 6 6-6"/>',
  up:'<path d="M12 21V3m-6 6 6-6 6 6"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
  logout:'<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M13 7l5 5-5 5M8 12h10"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 9a8 8 0 0 1 13-2l2 5M4 12l2 5a8 8 0 0 0 13-2"/>',
  edit:'<path d="M4 20h4l12-12a2.3 2.3 0 0 0-4-3L4 17z"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  shield:'<path d="M12 2 4 6v5c0 5 3 8 8 11 5-3 8-6 8-11V6z"/><path d="m9 12 2 2 4-4"/>',
  bank:'<path d="m3 9 9-6 9 6M3 9h18M5 10v9m5-9v9m4-9v9m5-9v9M3 21h18"/>',
  search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  file:'<path d="M6 2h9l5 5v15H6zM15 2v6h5M9 12h8M9 16h8"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7v1"/>',
  dots:'<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>'
};
const icon=(name,size=18)=>`<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]||icons.info}</svg>`;

const state={client:null, session:null,user:null, member:null,org:null, units:[],accounts:[],dues:[],tx:[],members:[],invites:[],audit:[],page:'dashboard',period:MONTH(),txMonth:'',txKind:'',modal:null,busy:false,authMode:'login',authNote:'',isLoading:true,recovery:false,sub:null,pendingRefresh:false};
let loadingSeq=0,reloadTimer=null,authSeq=0;

function toast(msg,style='success'){
 const root=document.getElementById('toast-stack');if(!root)return;
 const e=document.createElement('div');e.className='toast '+style;e.textContent=msg;root.append(e);setTimeout(()=>e.remove(),5500);
}
function errMsg(e){
 if(!e)return'Bilinmeyen hata';
 const t=e.message||String(e);
 if(/foreign key constraint/i.test(t))return'Bu kayıt bağlantılı başka kayıtlarda kullanılıyor. Önce ilgili kayıtları kontrol edin.';
 if(/duplicate key/i.test(t))return'Bu kayıt zaten mevcut.';
 if(/row.level security|permission denied/i.test(t))return'Bu işlem için erişim izniniz yok. Üyelik ve Supabase güvenlik kurallarını kontrol edin.';
 if(/Failed to fetch|network|Load failed/i.test(t))return'İnternet veya Supabase bağlantısı kurulamadı.';
 return t;
}
const getUnit=id=>state.units.find(x=>x.id===id);
const getAccount=id=>state.accounts.find(x=>x.id===id);
const unitName=id=>{const u=getUnit(id);return u?`${u.number} Nolu Daire`:'—';};
const accountName=id=>getAccount(id)?.name||'—';
const kindLabel=k=>({aidat:'Aidat',devir:'Devreden Borç Tahsilatı',gelir:'Diğer Gelir',gider:'Gider',virman:'Virman'})[k]||k;
const incomeKind = k => ['aidat','devir','gelir'].includes(k);
const availableAccounts=()=>state.accounts.filter(a=>a.active);

function calc(){
 const balances=new Map(state.accounts.map(a=>[a.id,num(a.opening_balance)]));
 for(const t of state.tx){const a=num(t.amount);
  if(t.kind==='virman'){balances.set(t.from_account_id,(balances.get(t.from_account_id)||0)-a);balances.set(t.to_account_id,(balances.get(t.to_account_id)||0)+a);}
  else balances.set(t.account_id,(balances.get(t.account_id)||0)+(t.kind==='gider'?-a:a));
 }
 const month=state.period;
 const paidByUnit=new Map(),allPaidByUnit=new Map(),devirPaid=new Map();
 for(const t of state.tx){if(t.kind==='aidat'){
  allPaidByUnit.set(t.apartment_id,(allPaidByUnit.get(t.apartment_id)||0)+num(t.amount));
  if(t.period?.slice(0,7)===month)paidByUnit.set(t.apartment_id,(paidByUnit.get(t.apartment_id)||0)+num(t.amount));
 }else if(t.kind==='devir')devirPaid.set(t.apartment_id,(devirPaid.get(t.apartment_id)||0)+num(t.amount));}
 const debts=new Map();for(const u of state.units){const totalDue=state.dues.filter(d=>d.apartment_id===u.id).reduce((s,d)=>s+num(d.amount),0);
 debts.set(u.id,num(u.opening_debt)+totalDue-(allPaidByUnit.get(u.id)||0)-(devirPaid.get(u.id)||0));}
 const mTx=state.tx.filter(t=>t.occurred_on?.slice(0,7)===month);
 const income=mTx.filter(t=>incomeKind(t.kind)).reduce((s,t)=>s+num(t.amount),0);
 const expense=mTx.filter(t=>t.kind==='gider').reduce((s,t)=>s+num(t.amount),0);
 const mDues=state.dues.filter(d=>d.period?.slice(0,7)===month);
 const mExpected=mDues.reduce((s,d)=>s+num(d.amount),0);
 const mPaid=mDues.reduce((s,d)=>s+(paidByUnit.get(d.apartment_id)||0),0);
 return {balances,debts,paidByUnit,income,expense,mDues,mExpected,mPaid,totalMoney:[...balances.values()].reduce((a,b)=>a+b,0),totalDebt:[...debts.values()].reduce((a,b)=>a+Math.max(0,b),0),credit:[...debts.values()].reduce((a,b)=>a+Math.max(0,-b),0)};
}
function status(due,paid){if(!due)return{label:'Tahakkuk yok',cls:'neutral'};if(paid>=num(due.amount)-.009)return{label:'Ödendi',cls:'success'};if(paid>0)return{label:'Kısmi ödeme',cls:'warning'};return{label:'Ödenmedi',cls:'danger'};}
function ptag(label,cls='neutral'){return`<span class="pill ${cls}">${esc(label)}</span>`;}
function empty(msg,emoji='◌'){return `<div class="empty"><span class="emptyicon">${emoji}</span>${esc(msg)}</div>`;}
function navButton(page,label,ico){return `<button class="nav-item ${state.page===page?'active':''}" data-action="nav" data-page="${page}">${icon(ico)}<span>${esc(label)}</span></button>`;}

function layout(content){
 const isAdmin=state.member?.role==='admin';
 return `<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-logo">${icon('building',23)}</div><div class="brand-copy">apartmanım<small>Yönetim sistemi</small></div></div><div class="nav-group-label">GENEL YÖNETİM</div>
 ${navButton('dashboard','Genel Bakış','home')}${navButton('dues','Aidat Takibi','calendar')}${navButton('transactions','Gelir & Gider','receipt')}${navButton('units','Daireler','building')}${navButton('accounts','Kasa & Banka','wallet')}
 <div class="nav-group-label">YÖNETİM</div>${navButton('reports','Raporlar','chart')}${isAdmin?navButton('team','Yöneticiler','users'):''}${navButton('settings','Ayarlar','cog')}
 <div class="side-spacer"></div><div class="side-mini">${icon('shield',17)} <strong>Ortak ve güvenli kayıtlar</strong><br><small>Yapılan değişiklikler diğer cihazlara aktarılır.</small></div>
 <div class="profile"><div class="avatar">${esc((state.user?.email||'?')[0].toUpperCase())}</div><div class="profile-info"><strong>${esc(state.user?.email)}</strong><small>${isAdmin?'Ana yönetici':'Yönetici'}</small></div><button class="logout" title="Çıkış yap" data-action="logout">${icon('logout')}</button></div></aside>
 <main class="main"><div class="topbar"><div class="topbar-left"><small>${esc(state.org?.name||'Apartmanımız')}</small><strong>Yönetici çalışma alanı</strong></div><div class="topbar-right"><div class="mobile-topbar"><div style="display:flex;align-items:center;gap:8px"><div class="brand-logo">${icon('building',19)}</div><strong>apartmanım</strong></div></div><div class="topchip"><span class="online-dot"></span> Ortak sistem</div><button title="Verileri yenile" class="btn light sm" data-action="reload">${icon('refresh',15)}<span class="hide-mobile">Yenile</span></button></div></div>
 ${content}</main>
 <nav class="mobile-bottom">${[['dashboard','Genel','home'],['dues','Aidatlar','calendar'],['transactions','Hareketler','receipt'],['units','Daireler','building'],['more','Daha','dots']].map(([p,l,i])=>`<button data-action="${p==='more'?'mobile-more':'nav'}" data-page="${p}" class="${state.page===p?'active':''}">${icon(i)}${l}</button>`).join('')}</nav></div><div id="modal-layer">${state.modal?modalMarkup():''}</div>`;
}
function pageHeader(title,desc,actions=''){return `<header class="page-head"><div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>${actions?`<div class="header-actions">${actions}</div>`:''}</header>`;}
function periodPicker(){return `<input type="month" class="input" aria-label="Ay seç" data-filter="period" value="${attr(state.period)}">`;}
function bankCard(a,c){const val=c.balances.get(a.id)||0;return `<div class="account-item"><span class="account-icon">${icon(a.kind==='bank'?'bank':'wallet',20)}</span><div class="desc"><strong>${esc(a.name)}</strong><span>${a.kind==='bank'?'Banka hesabı':'Nakit kasa'}</span></div><div class="num mono ${val<0?'negative':''}">${money(val)}<small>Güncel bakiye</small></div></div>`;}
function kpi(title,value,ico,sub){return `<article class="kpi"><div class="kpi-icon">${icon(ico,20)}</div><label>${esc(title)}</label><strong class="mono">${esc(value)}</strong><small>${esc(sub)}</small></article>`;}
function chartHtml(){
 const months=[];const [y,m]=state.period.split('-').map(Number);
 for(let off=5;off>=0;off--){const dt=new Date(y,m-1-off,1);months.push(`${dt.getFullYear()}-${pad2(dt.getMonth()+1)}`);}
 const monthly=months.map(k=>({month:k,income:state.tx.filter(t=>t.occurred_on?.startsWith(k)&&incomeKind(t.kind)).reduce((s,t)=>s+num(t.amount),0),expense:state.tx.filter(t=>t.occurred_on?.startsWith(k)&&t.kind==='gider').reduce((s,t)=>s+num(t.amount),0)}));
 const max=Math.max(1,...monthly.flatMap(x=>[x.income,x.expense]));
 return `<div class="chart">${monthly.map(r=>`<div class="chart-pair" title="${esc(monthLabel(r.month))}: Gelir ${money(r.income)}, Gider ${money(r.expense)}"><div class="chart-bar" style="height:${Math.max(2,Math.round(r.income/max*100))}%"></div><div class="chart-bar expense" style="height:${Math.max(2,Math.round(r.expense/max*100))}%"></div></div>`).join('')}</div><div class="chartlabels">${monthly.map(r=>`<span>${esc(monthLabel(r.month).split(' ')[0])}</span>`).join('')}</div><div class="legend"><span><b></b>Gelir</span><span><b class="expense"></b>Gider</span></div>`;
}
function recentRows(list){return `<div class="scroll-x"><table class="table"><thead><tr><th>İşlem</th><th>Tarih</th><th>Hesap</th><th class="right">Tutar</th></tr></thead><tbody>${list.map(t=>`<tr><td><strong class="idname">${esc(kindLabel(t.kind))}</strong><small class="secondary">${esc(t.description || (t.apartment_id?unitName(t.apartment_id):t.category||'—'))}</small></td><td class="muted nowrap">${shortDate(t.occurred_on)}</td><td>${esc(t.kind==='virman'?`${accountName(t.from_account_id)} → ${accountName(t.to_account_id)}`:accountName(t.account_id))}</td><td class="right mono bold ${t.kind==='gider'?'negative':t.kind==='virman'?'':'positive'}">${t.kind==='gider'?'-':t.kind==='virman'?'':'+'}${money(t.amount)}</td></tr>`).join('')}</tbody></table></div>`;}
function mobileDuesList(units,dues,paidByUnit,debts){
 return `<div class="mobile-dues-list">${units.map(u=>{const d=dues.find(x=>x.apartment_id===u.id);const paid=paidByUnit.get(u.id)||0;const bal=debts.get(u.id)||0;const st=status(d,paid);return `<div class="mobile-due-card"><div class="mobile-due-top"><div class="unit-chip"><span class="circle-index">${u.number}</span><div><strong>Daire ${u.number}</strong><small>${esc(u.owner||'İsim girilmedi')}</small></div></div>${ptag(st.label,st.cls)}</div><div class="mobile-due-values"><div><small>Tahakkuk</small><strong>${d?money(d.amount):'—'}</strong></div><div><small>Bu Ay Ödenen</small><strong>${money(paid)}</strong></div><div><small>Toplam Bakiye</small><strong class="${bal>0?'negative':bal<0?'positive':''}">${money(bal)}</strong></div></div>${d?`<button class="btn light sm block" data-action="modal" data-type="tx" data-kind="aidat" data-unit="${u.id}">${icon('plus',13)} Aidat Ödemesi Ekle</button><button class="btn ghost sm block" data-action="modal" data-type="due" data-id="${d.id}">${icon('edit',13)} Tahakkuk Düzenle</button>`:''}</div>`;}).join('')}</div>`;
}
function dashboard(){const c=calc();const overdue=state.units.filter(u=>(c.debts.get(u.id)||0)>.009).length;
 const monthDues=c.mDues;
 return `${pageHeader(`İyi günler 👋`,`${esc(state.org.name)} için ${monthLabel(state.period)} özeti.`,`<button class="btn primary" data-action="modal" data-type="tx">${icon('plus',16)} Yeni İşlem</button>`)}
 <div class="kpi-grid">${kpi('Toplam Kasa + Banka',money(c.totalMoney),'wallet',`${state.accounts.length} hesap toplamı`)}${kpi('Toplam Daire Borcu',money(c.totalDebt),'clock',`${overdue} daire borçlu`)}${kpi('Bu Ay Tahsilat',money(c.income),'up',monthLabel(state.period))}${kpi('Bu Ay Gider',money(c.expense),'down',monthLabel(state.period))}</div>
 <div class="toolbar"><div class="toolbar-left"><span class="eyebrow">AYLIK DURUM</span>${periodPicker()}</div><div class="toolbar-right"><button class="btn light sm" data-action="nav" data-page="dues">Aidat detayları ${icon('arrow',13)}</button></div></div>
 <section class="grid-2"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Gelir / Gider Trendi</h2><div class="panel-sub">Son 6 ay • işlem tarihine göre</div></div></div>${chartHtml()}</article>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Kasa ve Banka</h2><div class="panel-sub">Hesapların güncel toplamı</div></div><button class="btn ghost sm" data-action="nav" data-page="accounts">Detay ${icon('arrow',13)}</button></div>${state.accounts.map(a=>bankCard(a,c)).join('')||empty('Henüz hesap eklenmedi.')}<div class="separator"></div><div class="actions"><button class="btn light sm" data-action="modal" data-type="tx" data-kind="virman">${icon('transfer',15)} Virman yap</button></div></article></section>
 <section class="grid-2"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">${esc(monthLabel(state.period))} Aidat Durumu</h2><div class="panel-sub">${monthDues.length} daire için tahakkuk oluşturuldu</div></div><button class="btn ghost sm" data-action="nav" data-page="dues">Tümünü gör ${icon('arrow',13)}</button></div>
 <div class="scroll-x desktop-dues-table"><table class="table"><thead><tr><th>Daire</th><th>Beklenen</th><th>Ödenen</th><th>Durum</th><th></th></tr></thead><tbody>${state.units.slice(0,6).map(u=>{const d=monthDues.find(x=>x.apartment_id===u.id);const paid=c.paidByUnit.get(u.id)||0;const s=status(d,paid);return `<tr><td><strong class="idname">Daire ${u.number}</strong><span class="secondary">${esc(u.owner||'İsim girilmemiş')}</span></td><td>${d?money(d.amount):'—'}</td><td class="mono">${money(paid)}</td><td>${ptag(s.label,s.cls)}</td><td>${d?`<button class="btn xs light" data-action="modal" data-type="tx" data-kind="aidat" data-unit="${u.id}">Ödeme</button>`:''}</td></tr>`;}).join('')}</tbody></table></div>${mobileDuesList(state.units.slice(0,6),monthDues,c.paidByUnit,c.debts)}${monthDues.length===0?`<div style="margin-top:18px" class="alert warn">${esc(monthLabel(state.period))} için aidat tahakkuku oluşturulmamış. <button class="link-btn" data-action="generate">Şimdi oluştur</button></div>`:''}</article>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Hızlı İşlemler</h2><div class="panel-sub">Sık kullandığınız yönetim işleri</div></div></div><div class="shortcuts"><button class="shortcut" data-action="modal" data-type="tx" data-kind="aidat"><span class="shortcuticon">${icon('check',19)}</span>Aidat al</button><button class="shortcut" data-action="modal" data-type="tx" data-kind="gider"><span class="shortcuticon">${icon('receipt',19)}</span>Gider ekle</button><button class="shortcut" data-action="modal" data-type="tx" data-kind="virman"><span class="shortcuticon">${icon('transfer',19)}</span>Virman</button></div><div class="separator"></div><div class="note">${icon('info',16)} Aidat tahakkukları aylık oluşturulur. Banka–kasa virmanları gelir sayılmaz; yalnızca hesap bakiyelerini değiştirir.</div></article></section>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Son Hareketler</h2><div class="panel-sub">Tüm yöneticilerin son kayıtları</div></div><button class="btn ghost sm" data-action="nav" data-page="transactions">Tüm hareketler ${icon('arrow',14)}</button></div>${state.tx.length?recentRows([...state.tx].sort((a,b)=>b.occurred_on.localeCompare(a.occurred_on)||b.created_at.localeCompare(a.created_at)).slice(0,7)):empty('Henüz gelir, gider veya ödeme kaydı yok.','☷')}</article>`;
}
function duesPage(){const c=calc();const dues=c.mDues,expected=c.mExpected,paid=c.mPaid,unpaid=Math.max(0,expected-paid);
 return `${pageHeader('Aidat Takibi','Dairelerin aylık tahakkuklarını, ödemelerini ve toplam borçlarını izleyin.',`<button class="btn primary" data-action="generate">${icon('plus',15)} Ayın aidatlarını oluştur</button>`)}
 <div class="toolbar"><div class="toolbar-left">${periodPicker()}<button class="btn light sm" data-action="modal" data-type="tx" data-kind="aidat">${icon('plus',14)} Aidat Tahsilatı</button></div><div class="toolbar-right">${ptag(`${dues.length}/${state.units.length} tahakkuk`,'blue')}</div></div>
 <div class="kpi-grid">${kpi('Aylık Tahakkuk',money(expected),'calendar',monthLabel(state.period))}${kpi('Aylık Ödenen',money(paid),'check','Bu aya mahsup edilen')}${kpi('Aylık Kalan',money(unpaid),'clock','Bu ay için')}${kpi('Geçmiş Dahil Borç',money(c.totalDebt),'wallet','Tüm dönemler')}</div>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Daire Bazında Aidatlar</h2><div class="panel-sub">Ödeme kaydetmek için ilgili daireye tıklayın.</div></div><button class="btn light sm" data-action="export" data-file="dues">${icon('download',14)} CSV</button></div>
 <div class="scroll-x desktop-dues-table"><table class="table"><thead><tr><th>Daire</th><th>Malik / İlgili</th><th>Bu Ay Borç</th><th>Bu Ay Ödenen</th><th>Durum</th><th>Toplam Bakiye</th><th></th></tr></thead><tbody>${state.units.map(u=>{const d=dues.find(x=>x.apartment_id===u.id);const paid=c.paidByUnit.get(u.id)||0;const s=status(d,paid);const debt=c.debts.get(u.id)||0;return`<tr><td><div class="unit-chip"><span class="circle-index">${u.number}</span><strong class="idname">Daire ${u.number}</strong></div></td><td>${esc(u.owner||'—')}</td><td class="mono">${d?money(d.amount):'—'}</td><td class="mono">${money(paid)}</td><td>${ptag(s.label,s.cls)}</td><td class="mono bold ${debt>0?'negative':debt<0?'positive':''}">${money(debt)}</td><td>${d?`<div class="actions" style="flex-wrap:nowrap"><button class="btn light xs" data-action="modal" data-type="tx" data-kind="aidat" data-unit="${u.id}">${icon('plus',12)} Öde</button><button class="btn ghost xs" title="Tahakkuku düzenle" data-action="modal" data-type="due" data-id="${d.id}">${icon('edit',13)}</button></div>`:ptag('Önce oluştur','neutral')}</td></tr>`;}).join('')}</tbody></table></div>${mobileDuesList(state.units,dues,c.paidByUnit,c.debts)}
 ${dues.length===0?`<div class="alert warn" style="margin-top:18px">Bu ay henüz tahakkuk oluşturulmadı. Üstteki <b>Ayın aidatlarını oluştur</b> butonuna basın.</div>`:''}
 </article><div class="note">Tahakkuklar bir kez oluşturulduktan sonra aidat tutarının ayarlardan değiştirilmesi geçmiş ayları etkilemez. Geçmiş borçlar için dairenin <b>Devir borcu</b> alanını kullanın; ödeme alırken <b>Devir borcu tahsilatı</b> seçin. Negatif toplam bakiye, dairenin alacağını gösterir.</div>`;
}
function txPage(){let tx=[...state.tx];if(state.txMonth)tx=tx.filter(t=>t.occurred_on.startsWith(state.txMonth));if(state.txKind)tx=tx.filter(t=>t.kind===state.txKind);tx.sort((a,b)=>b.occurred_on.localeCompare(a.occurred_on)||b.created_at.localeCompare(a.created_at));
 return `${pageHeader('Gelir & Gider','Aidat tahsilatı, diğer gelirler, harcamalar ve hesaplar arası transferler.',`<button class="btn primary" data-action="modal" data-type="tx">${icon('plus',15)} Yeni Hareket</button>`)}
 <article class="panel"><div class="toolbar"><div class="toolbar-left"><input class="input" type="month" aria-label="İşlem ayı" data-filter="txMonth" value="${attr(state.txMonth)}"><select class="select" data-filter="txKind" aria-label="İşlem türü"><option value="">Tüm işlemler</option>${['aidat','devir','gelir','gider','virman'].map(k=>`<option value="${k}" ${state.txKind===k?'selected':''}>${esc(kindLabel(k))}</option>`).join('')}</select><button class="btn light sm" data-action="clear-filters">Temizle</button></div><div class="toolbar-right"><span class="muted small">${tx.length} hareket</span><button class="btn light sm" data-action="export" data-file="transactions">${icon('download',14)} CSV</button></div></div>
 ${tx.length?`<div class="scroll-x"><table class="table"><thead><tr><th>Tarih</th><th>Tür</th><th>Daire / Kategori</th><th>Açıklama</th><th>Hesap</th><th class="right">Tutar</th><th></th></tr></thead><tbody>${tx.map(t=>`<tr><td class="nowrap">${shortDate(t.occurred_on)}</td><td>${ptag(kindLabel(t.kind),t.kind==='gider'?'danger':t.kind==='virman'?'blue':'success')}</td><td>${esc(t.apartment_id?unitName(t.apartment_id):t.category||'—')}${t.period?`<span class="secondary">${monthLabel(t.period)}</span>`:''}</td><td style="max-width:230px">${esc(t.description||'—')}</td><td>${esc(t.kind==='virman'?`${accountName(t.from_account_id)} → ${accountName(t.to_account_id)}`:accountName(t.account_id))}</td><td class="right bold mono ${t.kind==='gider'?'negative':t.kind==='virman'?'':'positive'}">${t.kind==='gider'?'-':t.kind==='virman'?'':'+'}${money(t.amount)}</td><td><div class="actions" style="gap:3px;flex-wrap:nowrap">${t.receipt_path?`<button class="btn ghost xs" title="Dekontu aç" data-action="receipt" data-id="${t.id}">${icon('file',14)}</button>`:''}<button class="btn ghost xs" title="Düzenle" data-action="modal" data-type="tx" data-id="${t.id}">${icon('edit',14)}</button><button class="btn ghost xs danger-text" title="Sil" data-action="delete-tx" data-id="${t.id}">${icon('trash',14)}</button></div></td></tr>`).join('')}</tbody></table></div>`:empty('Bu filtre için hareket bulunamadı.','☷')}
 </article><div class="note">Virmanlar gelir-gider hesabına alınmaz. Yapılan ekleme, değişiklik ve silme işlemleri veritabanında denetim kaydına işlenir.</div>`;
}
function unitsPage(){const c=calc();return `${pageHeader('Daire Yönetimi','İsimleri, telefonları, özel aidat tutarlarını ve devreden borçları yönetin.',`<button class="btn primary" data-action="modal" data-type="unit">${icon('plus',15)} Daire Ekle</button>`)}
 <div class="unit-grid">${state.units.map(u=>{const debt=c.debts.get(u.id)||0;return `<article class="unit-card"><div class="meta"><span class="eyebrow">DAİRE</span>${ptag(debt>.01?'Borçlu':debt<-.01?'Alacaklı':'Güncel',debt>.01?'danger':debt<-.01?'blue':'success')}</div><div class="number">${u.number.padStart?esc(u.number):u.number}</div><div class="owner" title="${attr(u.owner)}">${esc(u.owner||'İsim girilmedi')}</div><div class="meta"><span class="muted tiny">Güncel bakiye</span><strong class="money mono ${debt>0?'negative':debt<0?'positive':''}">${money(debt)}</strong></div><button class="btn light sm block" data-action="modal" data-type="unit" data-id="${u.id}">${icon('edit',13)} Daireyi Düzenle</button></article>`;}).join('')}</div>
 <div class="note" style="margin-top:17px">Aidatı farklı olan daireler için özel aylık aidat tanımlayabilirsiniz. Bu tutar, bundan sonra oluşturacağınız tahakkuklarda kullanılır.</div>`;}
function accountsPage(){const c=calc();return `${pageHeader('Kasa & Banka','Nakit, banka, devir bakiyeleri ve hesaplar arası aktarımlar.',`<button class="btn primary" data-action="modal" data-type="tx" data-kind="virman">${icon('transfer',16)} Virman Yap</button>`)}
 <div class="account-grid">${state.accounts.map(a=>`<article class="big-account"><div style="display:flex;align-items:center;justify-content:space-between"><div class="account-icon">${icon(a.kind==='bank'?'bank':'wallet',21)}</div>${ptag(a.active?'Aktif':'Pasif',a.active?'success':'neutral')}</div><h2 class="panel-title" style="margin-top:15px">${esc(a.name)}</h2><strong class="mono ${c.balances.get(a.id)<0?'negative':''}">${money(c.balances.get(a.id))}</strong><small>Açılış: ${money(a.opening_balance)}</small><div class="separator"></div><button class="btn light sm" data-action="modal" data-type="account" data-id="${a.id}">${icon('edit',14)} Hesap Düzenle</button></article>`).join('')}</div>
 <div class="actions" style="margin-top:19px"><button class="btn light" data-action="modal" data-type="account">${icon('plus',15)} Yeni Hesap</button><button class="btn light" data-action="modal" data-type="tx" data-kind="gelir">${icon('up',15)} Gelir Ekle</button><button class="btn light" data-action="modal" data-type="tx" data-kind="gider">${icon('down',15)} Gider Ekle</button></div>
 <div class="note" style="margin-top:16px">Açılış bakiyesi, sistemi kullanmaya başladığınız günün hesap mevcududur. Virman yapmak mevcut toplam paranızı değiştirmez, yalnızca paranın bulunduğu hesabı değiştirir.</div>`;}
function reportsPage(){const c=calc();const rows=state.units.map(u=>({no:u.number,owner:u.owner,debt:c.debts.get(u.id)||0}));const borc=rows.filter(x=>x.debt>0).sort((a,b)=>b.debt-a.debt);
return `${pageHeader('Raporlar','Aylık durum ve daire borç listeleri. Dökümleri CSV olarak indirebilirsiniz.',`<button class="btn light" data-action="print">${icon('file',15)} Yazdır</button>`)}
 <div class="toolbar">${periodPicker()}<div class="actions"><button class="btn light sm" data-action="export" data-file="transactions">${icon('download',14)} Hareketler CSV</button><button class="btn light sm" data-action="export" data-file="debts">${icon('download',14)} Borçlar CSV</button></div></div>
 <div class="report-grid"><div class="report-item"><span class="label">AYLIK GELİR</span><div class="amount positive mono">${money(c.income)}</div><p>${monthLabel(state.period)}</p></div><div class="report-item"><span class="label">AYLIK GİDER</span><div class="amount negative mono">${money(c.expense)}</div><p>${monthLabel(state.period)}</p></div><div class="report-item"><span class="label">AYLIK FARK</span><div class="amount mono ${c.income-c.expense<0?'negative':'positive'}">${money(c.income-c.expense)}</div><p>Gelir eksi gider</p></div></div>
 <div class="grid-half" style="margin-top:19px"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Borçlu Daireler</h2><div class="panel-sub">Geçmiş ve mevcut dönemler dahil</div></div>${ptag(`${borc.length} daire`,'danger')}</div><div class="scroll-x"><table class="table" style="min-width:370px"><thead><tr><th>Daire</th><th>İlgili</th><th class="right">Bakiye</th></tr></thead><tbody>${borc.map(x=>`<tr><td>Daire ${x.no}</td><td>${esc(x.owner||'—')}</td><td class="right mono negative bold">${money(x.debt)}</td></tr>`).join('')}</tbody></table></div>${!borc.length?empty('Borçlu daire bulunmuyor.','✓'):''}</article><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Hesap Özeti</h2><div class="panel-sub">Tüm hesapların güncel bakiyesi</div></div></div>${state.accounts.map(a=>bankCard(a,c)).join('')}<div class="separator"></div><div class="account-item"><strong style="flex:1">TOPLAM</strong><strong class="mono">${money(c.totalMoney)}</strong></div><div class="note">Toplam daire borcu: <strong>${money(c.totalDebt)}</strong><br>Dairelerin toplam alacağı: <strong>${money(c.credit)}</strong></div></article></div>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Dönem Grafiği</h2><div class="panel-sub">Seçili aya kadar son altı ay</div></div></div>${chartHtml()}</article>`;}
function teamPage(){if(state.member?.role!=='admin')return settingsPage();return `${pageHeader('Yöneticiler','Bu apartmanın kullanıcıları ve yeni yönetici davetleri.')}
 <div class="grid-half"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Yetkili Kullanıcılar</h2><div class="panel-sub">Tüm yöneticiler aidat ve hareket girebilir.</div></div></div><div class="scroll-x"><table class="table" style="min-width:400px"><thead><tr><th>E-posta</th><th>Yetki</th><th></th></tr></thead><tbody>${state.members.map(m=>`<tr><td>${esc(m.email)}</td><td>${ptag(m.role==='admin'?'Ana yönetici':'Yönetici',m.role==='admin'?'blue':'success')}</td><td class="right">${m.user_id!==state.user.id?`<button class="btn ghost xs danger-text" data-action="remove-member" data-id="${m.user_id}">${icon('trash',13)}</button>`:''}</td></tr>`).join('')}</tbody></table></div></article><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Yönetici Davet Et</h2><div class="panel-sub">İzin verilen e-postayla hesap oluşturulabilir.</div></div></div><form data-form="invite"><div class="field"><label>E-posta adresi</label><input class="input" type="email" name="email" placeholder="yonetici@ornek.com" required autocomplete="email"></div><button class="btn primary" type="submit" style="margin-top:13px">${icon('plus',15)} Davet Yetkisi Ver</button></form><p class="tip" style="margin-top:14px">Daveti ekledikten sonra kişiye uygulama bağlantısını gönderin. Kişi kendi e-postasıyla kaydolup e-postasını doğrulayınca “Daveti kontrol et” diyerek yönetime katılabilir. Sistem davet e-postası göndermez.</p></article></div>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Davet Listesi</h2><div class="panel-sub">Kullanılmamış izinler beklemede görünür.</div></div></div><div class="scroll-x"><table class="table" style="min-width:410px"><thead><tr><th>E-posta</th><th>Durum</th><th>Tarih</th><th></th></tr></thead><tbody>${state.invites.map(i=>`<tr><td>${esc(i.email)}</td><td>${ptag(i.used_at?'Kullanıldı':'Bekliyor',i.used_at?'success':'warning')}</td><td>${shortDate(i.created_at)}</td><td class="right">${!i.used_at?`<button class="btn ghost xs danger-text" data-action="remove-invite" data-id="${i.id}">${icon('trash',13)}</button>`:''}</td></tr>`).join('')}</tbody></table></div>${!state.invites.length?empty('Henüz davet verilmedi.'):''}</article>`;}
function settingsPage(){const o=state.org;return `${pageHeader('Apartman Ayarları','Apartman adı, varsayılan aidat ve sistem bilgileri.')}
 <div class="grid-half"><article class="panel"><div class="panel-head"><div><h2 class="panel-title">Genel Ayarlar</h2><div class="panel-sub">Gelecekte oluşturulan aidatlar için</div></div></div><form data-form="settings" class="form-grid"><div class="field full"><label>Apartman Adı</label><input class="input" name="name" required maxlength="120" value="${attr(o.name)}"></div><div class="field full"><label>Varsayılan Aylık Aidat (TL)</label><input class="input" name="monthly_fee" required type="number" min="0" step="0.01" value="${attr(o.monthly_fee)}"></div><div class="full"><button type="submit" class="btn primary">${icon('check',15)} Kaydet</button></div></form></article>
 <article class="panel"><div class="panel-head"><div><h2 class="panel-title">Sistem Bilgileri</h2><div class="panel-sub">Çok cihazlı ortak kullanım</div></div></div><div class="account-item"><span class="account-icon">${icon('building')}</span><div class="desc"><strong>Toplam daire</strong><span>Tanımlı birimler</span></div><strong>${state.units.length}</strong></div><div class="account-item"><span class="account-icon">${icon('users')}</span><div class="desc"><strong>Kayıtlı yönetici</strong><span>Aktif ortak hesaplar</span></div><strong>${state.members.length}</strong></div><div class="account-item"><span class="account-icon">${icon('receipt')}</span><div class="desc"><strong>Toplam işlem</strong><span>Veritabanındaki hareketler</span></div><strong>${state.tx.length}</strong></div><div class="separator"></div><button class="btn light sm" data-action="logout">${icon('logout',14)} Çıkış Yap</button></article></div>
 <div class="note">Yönetici şifreleri Supabase Auth tarafından yönetilir. Ayarlardan aidatı değiştirmek önceki dönem tahakkuklarını değiştirmez. Aynı ay için birden fazla tahakkuk oluşmaz. Kaydı silmeden önce gerekli raporları indirmeniz önerilir.</div>`;}

function render(){if(!state.client)return renderNoConfig();if(!state.user||!state.member){renderAuth();return;}let page;
 switch(state.page){case'dues':page=duesPage();break;case'transactions':page=txPage();break;case'units':page=unitsPage();break;case'accounts':page=accountsPage();break;case'reports':page=reportsPage();break;case'team':page=teamPage();break;case'settings':page=settingsPage();break;default:page=dashboard();}
 APP.innerHTML=layout(page);
}
function renderNoConfig(message=''){
 APP.innerHTML=`<div class="auth-layout"><div class="auth-visual"><div class="auth-brand"><span>▦</span> apartmanım</div><div class="auth-copy"><div class="eyebrow" style="color:#81e5c5">APARTMAN YÖNETİMİ</div><h1>Apartmanınızın tüm hesapları <em>tek yerde.</em></h1><p>10 daire, 3 yönetici, ortak gelir-gider takibi. Tek uygulama, tüm cihazlar.</p><div class="auth-features"><div class="auth-feature"><strong>10</strong><small>DAİRE</small></div><div class="auth-feature"><strong>3</strong><small>YÖNETİCİ</small></div><div class="auth-feature"><strong>7/24</strong><small>ORTAK KAYIT</small></div></div></div><div class="auth-foot">© Apartmanım • Bağımsız apartman yönetimi</div></div><div class="auth-form-panel"><div class="auth-card"><div class="eyebrow">İLK KURULUM</div><h2>Supabase bağlantısı gerekli</h2><p>Uygulama dosyaları hazır. Güvenli ortak kullanım için yalnızca Supabase proje bilgilerini girmeniz gerekiyor.</p><div class="alert warn">GitHub'a yüklemeden önce <b>config.js</b> dosyasındaki proje URL'si ve <b>publishable/anon</b> anahtarını doldurun. Veritabanını <b>sql/kurulum.sql</b> dosyasıyla kurun.</div>${message?`<div class="alert error" style="margin-top:12px">${esc(message)}</div>`:''}<p class="tip">Adım adım talimatlar: <b>README.md</b>. Gizli <b>service_role</b> anahtarını hiçbir zaman config.js'ye koymayın.</p></div></div></div>`;
}
function renderAuth(){
 if(!state.client)return renderNoConfig();const pending=!!state.user&&!state.member;
 const mode=state.recovery?'new-password':pending?'pending':state.authMode;
 const title=({login:'Yönetici girişi',register:'Hesap oluştur',forgot:'Şifremi unuttum',pending:'Davet / erişim kontrolü','new-password':'Yeni şifre belirle'})[mode];
 const desc=({login:'Aidatları, gelir-giderleri ve tüm daireleri tek yerden yönetin.',register:'Yöneticinin verdiği davetli e-posta ile hesap oluşturun.',forgot:'E-posta adresinize şifre sıfırlama bağlantısı gönderilecek.',pending:'Giriş yaptınız; fakat bu hesap için henüz apartman üyeliği yok.','new-password':'Yeni bir şifre belirleyip kaydedin.'})[mode];
 const fields=mode==='pending'?`<div class="alert warn">${icon('info',16)} E-posta hesabınızı doğruladığınızdan emin olun. Davet verilmişse aşağıdan kontrol edin. İlk kullanıcı için README'deki ana yönetici tanımlama SQL'ini uygulayın.</div><button class="btn primary block" data-action="claim">${icon('refresh',16)} Daveti kontrol et</button><button class="btn light block" data-action="logout">Farklı hesapla giriş yap</button>`:
 mode==='new-password'?`<form data-form="new-password"><div class="field"><label>Yeni şifre</label><input class="input" type="password" name="password" required minlength="8" autocomplete="new-password"></div><button type="submit" class="btn primary block">Şifremi değiştir</button></form>`:
 `<form data-form="auth"><div class="field"><label>E-posta</label><input class="input" type="email" name="email" placeholder="yonetici@ornek.com" autocomplete="email" required></div>${mode!=='forgot'?`<div class="field"><label>Şifre</label><input class="input" type="password" name="password" minlength="8" placeholder="En az 8 karakter" autocomplete="${mode==='register'?'new-password':'current-password'}" required></div>`:''}<button type="submit" class="btn primary block">${mode==='login'?'Giriş Yap':mode==='register'?'Hesap Oluştur':'Sıfırlama Bağlantısı Gönder'} ${icon('arrow',16)}</button></form>`;
 APP.innerHTML=`<div class="auth-layout"><div class="auth-visual"><div class="auth-brand"><span>▦</span> apartmanım</div><div class="auth-copy"><div class="eyebrow" style="color:#81e5c5">DAHA KOLAY APARTMAN YÖNETİMİ</div><h1>Tüm daireler.<br>Tüm hesaplar.<br><em>Tek platform.</em></h1><p>Aidat, gider, kasa ve banka hareketleri yönetici cihazlarında güncel kalsın.</p><div class="auth-features"><div class="auth-feature"><strong>10</strong><small>DAİRE</small></div><div class="auth-feature"><strong>2–3</strong><small>YÖNETİCİ</small></div><div class="auth-feature"><strong>1</strong><small>ORTAK SİSTEM</small></div></div></div><div class="auth-foot">Güvenli giriş • Supabase Auth</div></div><div class="auth-form-panel"><div class="auth-card"><div class="eyebrow" style="margin-bottom:14px">YÖNETİM PORTALI</div><h2>${title}</h2><p>${desc}</p>${state.authNote?`<div class="alert" style="margin-bottom:18px">${esc(state.authNote)}</div>`:''}${fields}
 ${mode==='login'?`<div class="auth-switch"><span>İlk kez mi giriş yapacaksınız?</span><button class="link-btn" data-action="auth-mode" data-mode="register">Hesap oluştur</button></div><div class="auth-switch" style="justify-content:flex-end"><button class="link-btn" data-action="auth-mode" data-mode="forgot">Şifremi unuttum</button></div>`:''}${mode==='register'||mode==='forgot'?`<div class="auth-switch"><span>Hesabınız zaten var mı?</span><button class="link-btn" data-action="auth-mode" data-mode="login">Giriş yap</button></div>`:''}</div></div></div>`;
}
function selOptions(values,selected,placeholder='Seçin'){
 return `<option value="">${esc(placeholder)}</option>`+values.map(x=>`<option value="${attr(x.value)}" ${String(x.value)===String(selected)?'selected':''}>${esc(x.label)}</option>`).join('');
}
function field(label,control,hint=''){return `<div class="field"><label>${esc(label)}</label>${control}${hint?`<span class="field-hint">${esc(hint)}</span>`:''}</div>`;}
function accountSelect(name,selected,label='Hesap',all=false){const arr=all?state.accounts:availableAccounts();return field(label,`<select class="select" name="${name}" required>${selOptions(arr.map(a=>({value:a.id,label:a.name})),selected,'Hesap seçin')}</select>`);}
function modalMarkup(){const m=state.modal;if(!m)return'';
 if(m.type==='more'){
  const tabs=[['accounts','Kasa & Banka','wallet'],['reports','Raporlar','chart'],['team','Yöneticiler','users'],['settings','Ayarlar','cog']].filter(([p])=>p!=='team'||state.member?.role==='admin');
  return `<div class="modal-backdrop" data-overlay="1"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h3>Diğer Bölümler</h3><button class="modal-close" data-action="close" aria-label="Kapat">×</button></div><div class="modal-content"><div class="more-grid">${tabs.map(([p,l,i])=>`<button class="more-item" data-action="nav" data-page="${p}">${icon(i,20)}<span>${l}</span>${icon('arrow',15)}</button>`).join('')}<button class="more-item" data-action="logout">${icon('logout',20)}<span>Çıkış yap</span>${icon('arrow',15)}</button></div></div></div></div>`;
 }
 if(m.type==='due'){
  const d=state.dues.find(x=>x.id===m.id);if(!d)return'';
  const paid=state.tx.filter(t=>t.kind==='aidat'&&t.apartment_id===d.apartment_id&&t.period===d.period).reduce((a,t)=>a+num(t.amount),0);
  return `<div class="modal-backdrop" data-overlay="1"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h3>Aidat Tahakkuku Düzenle</h3><button class="modal-close" data-action="close">×</button></div><div class="modal-content"><p class="tip"><strong>${esc(unitName(d.apartment_id))}</strong> • ${monthLabel(d.period)}<br>Ödenen: ${money(paid)}</p><form data-form="due" class="form-grid"><div class="full">${field('Bu Ayın Aidat Tutarı (TL)',`<input class="input" name="amount" type="number" min="0" step="0.01" required value="${attr(d.amount)}">`)}</div><div class="full">${field('Açıklama',`<textarea class="textarea" name="description" rows="2">${esc(d.description)}</textarea>`)}</div><div class="full form-actions" style="justify-content:space-between"><button type="button" class="btn red" data-action="delete-due" data-id="${d.id}" ${paid>0?'disabled title="Ödenmiş tahakkuk silinemez"':''}>${icon('trash',14)} Sil</button><div class="actions"><button type="button" class="btn light" data-action="close">Vazgeç</button><button type="submit" class="btn primary">${icon('check',14)} Kaydet</button></div></div></form></div></div></div>`;
 }
 if(m.type==='unit'){
  const u=getUnit(m.id)||{};
  return `<div class="modal-backdrop" data-overlay="1"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h3>${m.id?'Daire Düzenle':'Yeni Daire'}</h3><button class="modal-close" data-action="close" aria-label="Kapat">×</button></div><div class="modal-content"><form data-form="unit" class="form-grid">
 ${field('Daire Numarası',`<input class="input" type="number" min="1" step="1" required name="number" value="${attr(u.number??'')}">`)}
 ${field('Malik / Sorumlu Adı',`<input class="input" name="owner" maxlength="120" value="${attr(u.owner)}">`)}
 ${field('Telefon',`<input class="input" name="phone" maxlength="35" inputmode="tel" value="${attr(u.phone)}">`)}
 ${field('Özel Aylık Aidat (TL)',`<input class="input" name="monthly_fee_override" type="number" min="0" step="0.01" value="${attr(u.monthly_fee_override??'')}">`,'Boşsa genel aidat kullanılır.')}
 ${field('Devreden Borç / Alacak (TL)',`<input class="input" name="opening_debt" type="number" step="0.01" value="${attr(u.opening_debt??0)}">`,'Eski borç pozitif, eski alacak negatif girilir.')}
 <div class="field full">${field('Not',`<textarea class="textarea" name="notes" rows="2">${esc(u.notes)}</textarea>`)}</div>
 <div class="full form-actions"><button type="button" class="btn light" data-action="close">Vazgeç</button><button type="submit" class="btn primary">${icon('check',15)} Kaydet</button></div></form></div></div></div>`;
 }
 if(m.type==='account'){
 const a=getAccount(m.id)||{};
 return `<div class="modal-backdrop" data-overlay="1"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h3>${m.id?'Hesabı Düzenle':'Yeni Hesap'}</h3><button class="modal-close" data-action="close">×</button></div><div class="modal-content"><form data-form="account" class="form-grid">
 <div class="full">${field('Hesap Adı',`<input class="input" name="name" required maxlength="80" value="${attr(a.name)}">`)}</div>
 ${field('Hesap Türü',`<select class="select" name="kind"><option value="cash" ${a.kind==='cash'?'selected':''}>Kasa / Nakit</option><option value="bank" ${a.kind==='bank'?'selected':''}>Banka</option></select>`)}
 ${field('Açılış Bakiyesi (TL)',`<input class="input" name="opening_balance" type="number" required step="0.01" value="${attr(a.opening_balance??0)}">`)}
 <div class="full"><label class="small"><input type="checkbox" name="active" ${a.active!==false?'checked':''}> Bu hesap aktif</label></div>
 <div class="alert warn full">Açılış bakiyesini değiştirirseniz güncel hesap bakiyesi de değişir. Geçmiş gerçek hareketleri açılış bakiyesi yerine işlem olarak kaydedin.</div>
 <div class="full form-actions"><button type="button" class="btn light" data-action="close">Vazgeç</button><button type="submit" class="btn primary">${icon('check',15)} Kaydet</button></div></form></div></div></div>`;
 }
 if(m.type==='tx'){
 const t=state.tx.find(x=>x.id===m.id)||{};
 const kind=m.kind||t.kind||'aidat';
 const unitId=m.unit||t.apartment_id||'';
 const date=t.occurred_on||ISTANBUL_DATE();
 const accountId=t.account_id||availableAccounts()[0]?.id||'';
 const fromId=t.from_account_id||availableAccounts()[0]?.id||'';
 const toId=t.to_account_id||availableAccounts().find(a=>a.id!==fromId)?.id||'';
 const due=state.dues.find(d=>d.apartment_id===unitId&&d.period===PERIOD(state.period));
 const alreadyPaid=state.tx.filter(x=>x.kind==='aidat'&&x.apartment_id===unitId&&x.period===PERIOD(state.period)&&x.id!==m.id).reduce((s,x)=>s+num(x.amount),0);
 const defaultAmount=kind==='aidat'&&due?Math.max(0,num(due.amount)-alreadyPaid):'';
 const aopts=state.accounts.filter(a=>a.active||[accountId,fromId,toId].includes(a.id));
 const aSel=(name,value,label)=>field(label,`<select class="select" name="${name}">${selOptions(aopts.map(a=>({value:a.id,label:a.name})),value,'Hesap seçin')}</select>`);
 const units=state.units.map(u=>({value:u.id,label:`Daire ${u.number}${u.owner?' • '+u.owner:''}`}));
 const payPeriod=t.period?.slice(0,7)||state.period;
 return `<div class="modal-backdrop" data-overlay="1"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h3>${m.id?'Hareketi Düzenle':'Yeni Finansal Hareket'}</h3><button class="modal-close" data-action="close">×</button></div><div class="modal-content"><form data-form="tx" class="form-grid">
 <div class="field full">${field('İşlem Türü',`<select class="select" name="kind" id="tx-kind">${['aidat','devir','gelir','gider','virman'].map(k=>`<option value="${k}" ${kind===k?'selected':''}>${esc(kindLabel(k))}</option>`).join('')}</select>`)}</div>
 ${field('İşlem Tarihi',`<input class="input" name="occurred_on" type="date" value="${attr(date)}" required>`)}
 ${field('Tutar (TL)',`<input class="input" name="amount" type="number" min="0.01" step="0.01" value="${attr(t.amount??defaultAmount)}" required>`)}
 <div data-kinds="aidat devir">${field('Daire',`<select class="select" name="apartment_id">${selOptions(units,unitId,'Daire seçin')}</select>`)}</div>
 <div data-kinds="aidat">${field('Aidat Dönemi',`<input class="input" name="period" type="month" value="${attr(payPeriod)}">`,'Önce bu ay için tahakkuk oluşturulmalı.')}</div>
 <div data-kinds="aidat devir gelir gider">${aSel('account_id',accountId,'Tahsilat / Ödeme Hesabı')}</div>
 <div data-kinds="virman">${aSel('from_account_id',fromId,'Gönderen Hesap')}</div>
 <div data-kinds="virman">${aSel('to_account_id',toId,'Alıcı Hesap')}</div>
 <div data-kinds="gelir gider" class="field full">${field('Kategori',`<input class="input" list="categories" name="category" value="${attr(t.category)}" placeholder="Örn. elektrik, temizlik"><datalist id="categories"><option>Elektrik</option><option>Su</option><option>Temizlik</option><option>Asansör</option><option>Bakım-Onarım</option><option>Personel</option><option>Demirbaş</option><option>Diğer</option></datalist>`)}</div>
 <div class="field full">${field('Açıklama',`<textarea class="textarea" name="description" rows="2" placeholder="İsteğe bağlı işlem notu">${esc(t.description)}</textarea>`)}</div>
 <div class="field full">${field('Dekont / Fatura (isteğe bağlı)',`<input type="file" class="input" name="receipt" accept="image/jpeg,image/png,image/webp,application/pdf">`,t.receipt_path?'Mevcut dosya korunur. Yeni dosya seçilirse değiştirilir.':'JPG, PNG, WEBP veya PDF • En fazla 10 MB')}${t.receipt_path?`<div class="small">${icon('file',13)} Kayıtlı dekont mevcut</div>`:''}</div>
 <div class="full alert">${icon('info',16)} Aidat tahsilatı yalnızca ilgili ayın aidat borcuna mahsup edilir. Devir tahsilatı ise eski borcu azaltır. Virman gelir oluşturmaz.</div>
 <div class="full form-actions"><button type="button" class="btn light" data-action="close">Vazgeç</button><button type="submit" class="btn primary">${icon('check',15)} ${m.id?'Güncelle':'Kaydet'}</button></div>
 </form></div></div></div>`;
 }
 return '';
}
function toggleTransactionSections(){const f=document.querySelector('form[data-form="tx"]');if(!f)return;const kind=f.elements.kind.value;
 f.querySelectorAll('[data-kinds]').forEach(el=>el.classList.toggle('hide',!el.dataset.kinds.split(' ').includes(kind)));
}
function changePage(page){state.page=page;state.modal=null;render();window.scrollTo({top:0,behavior:'instant'});}
function openModal(type,id=null,kind=null,unit=null){state.modal={type,id,kind,unit};render();if(type==='tx')toggleTransactionSections();}
function closeModal(){state.modal=null;render();if(state.pendingRefresh)loadData(true);}

async function allRows(table,orgId,otherFilters=[]){let offset=0,all=[];const limit=1000;
 while(true){let q=state.client.from(table).select('*').eq('organization_id',orgId).range(offset,offset+limit-1);
 for(const [name,value] of otherFilters)q=q.eq(name,value);
 const {data,error}=await q;if(error)throw error;
 all.push(...(data||[]));if((data||[]).length<limit)break;
 offset+=limit;if(offset>20000)throw new Error(`${table} tablosunda 20.000 kaydı aşan veri bulundu. Veri sorgusu sınırlandı.`);
 }return all;
}
async function loadData(silent=false){if(!state.user||!state.member)return;const seq=++loadingSeq;const orgId=state.member.organization_id;
 if(!silent){state.isLoading=true;APP.innerHTML='<div class="boot"><div class="spinner"></div><p>Ortak kayıtlar yükleniyor...</p></div>';}
 try{
  const [org,units,accounts,dues,tx,members,invites]=await Promise.all([
    state.client.from('organizations').select('*').eq('id',orgId).single(),
    allRows('apartments',orgId),allRows('accounts',orgId),allRows('dues',orgId),allRows('transactions',orgId),
    allRows('memberships',orgId),state.member.role==='admin'?allRows('invites',orgId):Promise.resolve([])
  ]);
  if(seq!==loadingSeq)return;
  if(org.error)throw org.error;
  state.org=org.data;state.units=units.sort((a,b)=>a.number-b.number);state.accounts=accounts.sort((a,b)=>a.created_at.localeCompare(b.created_at));
  state.dues=dues;state.tx=tx;state.members=members;state.invites=invites;
  state.isLoading=false;state.pendingRefresh=false;render();
 }catch(e){state.isLoading=false;toast('Veriler alınamadı: '+errMsg(e),'error');if(!silent)APP.innerHTML=`<div class="boot"><p>Bağlantı hatası: ${esc(errMsg(e))}</p><button class="btn primary" data-action="reload">Tekrar dene</button></div>`;}
}
async function setupMembership(){const seq=++authSeq;try{
 const {data:{session},error}=await state.client.auth.getSession();if(error)throw error;if(seq!==authSeq)return;
 state.session=session;state.user=session?.user||null;
 if(!state.user){state.member=null;state.org=null;render();return;}
 const {data,error:memErr}=await state.client.from('memberships').select('*').eq('user_id',state.user.id).limit(1).maybeSingle();
 if(memErr)throw memErr;
 if(seq!==authSeq)return;
 state.member=data||null;
 if(!state.member){render();return;}
 await loadData();subscribeRealtime();
 }catch(e){toast(errMsg(e),'error');render();}}
function subscribeRealtime(){if(!state.client||!state.member)return;
 if(state.sub)state.client.removeChannel(state.sub);
 const id=state.member.organization_id;
 state.sub=state.client.channel('apartman-'+id)
  .on('postgres_changes',{event:'*',schema:'public'},payload=>{
    // Tablo yayını Supabase SQL kurulumu tarafından açılır. Liste yeniden sorgulanır.
    if(!['transactions','dues','accounts','apartments','organizations','memberships','invites'].includes(payload.table))return;
    if(state.modal||state.busy){state.pendingRefresh=true;return;}
    clearTimeout(reloadTimer);reloadTimer=setTimeout(()=>loadData(true),450);
  }).subscribe();
}
async function claimInvitation(){try{const {data,error}=await state.client.rpc('claim_manager_invitation');if(error)throw error;
 if(data)toast('Davet kabul edildi. Apartman hesabınız açıldı.');
 else toast('Bu e-posta için bekleyen davet bulunamadı.','error');
 await setupMembership();
 }catch(e){toast(errMsg(e),'error');}}
async function runLocked(fn){if(state.busy)return;state.busy=true;document.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=true);
 try{await fn();}catch(e){toast(errMsg(e),'error');}finally{state.busy=false;document.querySelectorAll('button[type="submit"]').forEach(b=>b.disabled=false);}
}
async function generateDues(){if(!state.org)return;
 const month=state.period;const existing=state.dues.filter(d=>d.period===PERIOD(month));
 const missing=state.units.filter(u=>!existing.some(d=>d.apartment_id===u.id));
 if(!missing.length){toast('Bu ay için tüm dairelerin tahakkuku zaten oluşturulmuş.');return;}
 if(!confirm(`${monthLabel(month)} için ${missing.length} dairenin aidat tahakkuku oluşturulsun mu?`))return;
 await runLocked(async()=>{
 const rows=missing.map(u=>({organization_id:state.org.id,apartment_id:u.id,period:PERIOD(month),amount:u.monthly_fee_override==null?num(state.org.monthly_fee):num(u.monthly_fee_override)}));
 const {error}=await state.client.from('dues').upsert(rows,{onConflict:'organization_id,apartment_id,period',ignoreDuplicates:true});if(error)throw error;
 toast(`${missing.length} daire için tahakkuk kontrol edildi / oluşturuldu.`);await loadData(true);
 });
}
async function deleteTx(id){const t=state.tx.find(x=>x.id===id);if(!t)return;
 if(!confirm(`${shortDate(t.occurred_on)} tarihli ${money(t.amount)} tutarındaki “${kindLabel(t.kind)}” kaydı silinsin mi? Bu işlem denetim günlüğüne kaydedilir.`))return;
 await runLocked(async()=>{const {error}=await state.client.from('transactions').delete().eq('id',id).eq('organization_id',state.org.id);if(error)throw error;
 if(t.receipt_path){const {error:storageError}=await state.client.storage.from('apartman-dekontlari').remove([t.receipt_path]);if(storageError)toast('İşlem silindi fakat dekont dosyası temizlenemedi.','error');}
 toast('Hareket silindi.');await loadData(true);
 });
}
async function deleteDue(id){const d=state.dues.find(x=>x.id===id);if(!d)return;
 if(state.tx.some(t=>t.kind==='aidat'&&t.apartment_id===d.apartment_id&&t.period===d.period)){toast('Ödeme yapılmış tahakkuk silinemez.','error');return;}
 if(!confirm(`${unitName(d.apartment_id)} için ${monthLabel(d.period)} tahakkuku silinsin mi?`))return;
 await runLocked(async()=>{const {error}=await state.client.from('dues').delete().eq('id',id).eq('organization_id',state.org.id);if(error)throw error;state.modal=null;toast('Tahakkuk silindi.');await loadData(true);});
}
async function removeMember(id){const m=state.members.find(x=>x.user_id===id);if(!m||id===state.user.id)return;
 if(!confirm(`${m.email} adresinin yönetici erişimi kaldırılsın mı?`))return;
 await runLocked(async()=>{const {error}=await state.client.from('memberships').delete().eq('user_id',id).eq('organization_id',state.org.id);if(error)throw error;toast('Yönetici erişimi kaldırıldı.');await loadData(true);});
}
async function removeInvite(id){if(!confirm('Bu davet izni iptal edilsin mi?'))return;
 await runLocked(async()=>{const {error}=await state.client.from('invites').delete().eq('id',id).eq('organization_id',state.org.id);if(error)throw error;toast('Davet iptal edildi.');await loadData(true);});
}
async function openReceipt(id){const t=state.tx.find(x=>x.id===id);if(!t?.receipt_path)return;
 const win=window.open('about:blank','_blank');
 const {data,error}=await state.client.storage.from('apartman-dekontlari').createSignedUrl(t.receipt_path,120);
 if(error){win?.close();toast(errMsg(error),'error');return;}
 if(win)win.location.href=data.signedUrl;else window.location.assign(data.signedUrl);
}
function asCSV(rows,headers){const quote=v=>`"${String(v??'').replace(/"/g,'""')}"`;return '\ufeff'+headers.map(h=>quote(h[0])).join(';')+'\r\n'+rows.map(r=>headers.map(([_,k])=>quote(r[k])).join(';')).join('\r\n');}
function downloadCSV(data,filename){const url=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function exportCSV(file){const c=calc(),today=ISTANBUL_DATE();let headers,rows;
 if(file==='transactions'){
 headers=[['Tarih','date'],['Tür','kind'],['Daire','unit'],['Aidat Dönemi','period'],['Hesap','account'],['Kategori','category'],['Açıklama','description'],['Tutar TL','amount']];
 rows=state.tx.map(t=>({date:shortDate(t.occurred_on),kind:kindLabel(t.kind),unit:t.apartment_id?unitName(t.apartment_id):'',period:t.period?.slice(0,7)||'',account:t.kind==='virman'?`${accountName(t.from_account_id)} -> ${accountName(t.to_account_id)}`:accountName(t.account_id),category:t.category,description:t.description,amount:String(num(t.amount)).replace('.',',')}));
 }else if(file==='dues'){
 headers=[['Daire','unit'],['Malik','owner'],['Dönem','period'],['Tahakkuk TL','amount'],['Ödenen TL','paid'],['Toplam Bakiye TL','debt']];
 rows=state.units.map(u=>{const d=c.mDues.find(x=>x.apartment_id===u.id);return{unit:u.number,owner:u.owner,period:state.period,amount:d?.amount||0,paid:c.paidByUnit.get(u.id)||0,debt:c.debts.get(u.id)||0};});
 }else{
 headers=[['Daire','unit'],['Malik','owner'],['Telefon','phone'],['Toplam Bakiye TL','debt']];
 rows=state.units.map(u=>({unit:u.number,owner:u.owner,phone:u.phone,debt:c.debts.get(u.id)||0}));
 }
 downloadCSV(asCSV(rows,headers),`apartman_${file}_${today}.csv`);toast('CSV dosyası indirildi.');
}

async function handleForm(event){const f=event.target.closest('form[data-form]');if(!f)return;event.preventDefault();
 const typ=f.dataset.form;const data=Object.fromEntries(new FormData(f).entries());
 if(typ==='auth')return runLocked(async()=>{
  const email=String(data.email).trim().toLowerCase(),password=data.password;
  if(state.authMode==='forgot'){
   const {error}=await state.client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error)throw error;
   state.authNote='Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.';state.authMode='login';renderAuth();return;
  }
  if(state.authMode==='register'){
   const {data:result,error}=await state.client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;
   state.authNote=result.session?'Hesap oluşturuldu. Davetiniz kontrol edilecek.':'Hesap oluşturuldu. E-postanıza gelen doğrulama bağlantısına tıklayın.';
   state.authMode='login';renderAuth();if(result.session)await setupMembership();return;
  }
  const {error}=await state.client.auth.signInWithPassword({email,password});if(error)throw error;
  await setupMembership();
 });
 if(typ==='new-password')return runLocked(async()=>{
  const {error}=await state.client.auth.updateUser({password:data.password});if(error)throw error;
  state.recovery=false;state.authNote='Yeni şifreniz kaydedildi.';toast('Şifreniz değiştirildi.');await setupMembership();
 });
 if(!state.org)return;
 if(typ==='unit')return runLocked(async()=>{
  const v={organization_id:state.org.id,number:Number(data.number),owner:String(data.owner||'').trim(),phone:String(data.phone||'').trim(),notes:String(data.notes||'').trim(),monthly_fee_override:data.monthly_fee_override===''?null:num(data.monthly_fee_override),opening_debt:num(data.opening_debt)};
  const query=state.modal?.id?state.client.from('apartments').update(v).eq('id',state.modal.id):state.client.from('apartments').insert(v);
  const {error}=await query;if(error)throw error;state.modal=null;toast('Daire bilgileri kaydedildi.');await loadData(true);
 });
 if(typ==='due')return runLocked(async()=>{
  const amount=Number(data.amount);if(!Number.isFinite(amount)||amount<0)throw new Error('Aidat 0 veya daha büyük bir tutar olmalı.');
  const {error}=await state.client.from('dues').update({amount,description:String(data.description||'').trim()}).eq('id',state.modal.id).eq('organization_id',state.org.id);
  if(error)throw error;state.modal=null;toast('Tahakkuk tutarı güncellendi.');await loadData(true);
 });
 if(typ==='account')return runLocked(async()=>{
  const v={organization_id:state.org.id,name:String(data.name).trim(),kind:data.kind,opening_balance:num(data.opening_balance),active:f.elements.active.checked};
  const query=state.modal?.id?state.client.from('accounts').update(v).eq('id',state.modal.id):state.client.from('accounts').insert(v);
  const {error}=await query;if(error)throw error;state.modal=null;toast('Hesap kaydedildi.');await loadData(true);
 });
 if(typ==='settings')return runLocked(async()=>{
  const {error}=await state.client.from('organizations').update({name:String(data.name).trim(),monthly_fee:num(data.monthly_fee)}).eq('id',state.org.id);if(error)throw error;toast('Apartman ayarları güncellendi.');await loadData(true);
 });
 if(typ==='invite')return runLocked(async()=>{
  const email=String(data.email).trim().toLowerCase();if(state.members.some(m=>m.email.toLowerCase()===email)){toast('Bu kişi zaten yönetici.','error');return;}
  const {error}=await state.client.from('invites').upsert({organization_id:state.org.id,email,used_at:null},{onConflict:'organization_id,email'});if(error)throw error;
  toast('Davet izni açıldı. Kişiye uygulama bağlantısını iletin.');await loadData(true);
 });
 if(typ==='tx')return runLocked(async()=>{
  const kind=data.kind,amount=Number(data.amount),date=data.occurred_on;
  if(!Number.isFinite(amount)||amount<=0)throw new Error('Tutar sıfırdan büyük olmalı.');
  const v={organization_id:state.org.id,kind,amount,occurred_on:date,category:'',description:String(data.description||'').trim(),account_id:null,from_account_id:null,to_account_id:null,apartment_id:null,period:null};
  if(kind==='aidat'||kind==='devir'){
   if(!data.apartment_id)throw new Error('Daire seçin.');v.apartment_id=data.apartment_id;
   if(kind==='aidat'){
    v.period=PERIOD(data.period);
    if(!state.dues.some(d=>d.apartment_id===v.apartment_id&&d.period===v.period))throw new Error('Seçilen daire/dönem için aidat tahakkuku bulunmuyor. Önce ilgili ayda tahakkuk oluşturun.');
   }
  }
  if(kind==='virman'){
   if(!data.from_account_id||!data.to_account_id)throw new Error('Gönderen ve alıcı hesabı seçin.');
   if(data.from_account_id===data.to_account_id)throw new Error('Virman için iki farklı hesap seçin.');
   v.from_account_id=data.from_account_id;v.to_account_id=data.to_account_id;
  }else{
   if(!data.account_id)throw new Error('İşlem hesabı seçin.');v.account_id=data.account_id;
   if(kind==='gelir'||kind==='gider')v.category=String(data.category||'').trim();
  }
  const existing=state.tx.find(t=>t.id===state.modal?.id);
  const file=f.elements.receipt?.files?.[0];
  if(file){if(file.size>10*1024*1024)throw new Error('Dekont 10 MB sınırını aşıyor.');if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type))throw new Error('Dekont yalnızca JPEG, PNG, WEBP veya PDF olabilir.');}
  const query=existing?state.client.from('transactions').update(v).eq('id',existing.id).eq('organization_id',state.org.id).eq('updated_at',existing.updated_at).select().maybeSingle():state.client.from('transactions').insert({...v,created_by:state.user.id}).select().single();
  const {data:record,error}=await query;if(error)throw error;
  if(existing&&!record){state.pendingRefresh=true;throw new Error('Bu kayıt başka bir yönetici tarafından değiştirildi veya silindi. Formu kapatıp listeyi yenileyin.');}
  if(file){const ext=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','application/pdf':'pdf'})[file.type];
   const path=`${state.org.id}/${record.id}/${crypto.randomUUID()}.${ext}`;
   const {error:upError}=await state.client.storage.from('apartman-dekontlari').upload(path,file,{contentType:file.type,upsert:false});
   if(upError){toast('İşlem kaydedildi fakat dekont yüklenemedi: '+errMsg(upError),'error');}
   else{
    const {error:linkError}=await state.client.from('transactions').update({receipt_path:path}).eq('id',record.id);
    if(linkError)toast('Dekont yüklendi ancak işlem kaydıyla ilişkilendirilemedi.','error');
    else if(existing?.receipt_path){await state.client.storage.from('apartman-dekontlari').remove([existing.receipt_path]);}
   }
  }
  state.modal=null;toast(existing?'Hareket güncellendi.':'Hareket kaydedildi.');await loadData(true);
 });
}
async function handleAction(event){const button=event.target.closest('[data-action]');if(!button)return;
 const {action,id,page,type,kind,unit,mode,file}=button.dataset;
 switch(action){
  case'nav':changePage(page);break;
  case'mobile-more':openModal('more');break;
  case'close':closeModal();break;
  case'modal':openModal(type,id||null,kind||null,unit||null);break;
  case'generate':await generateDues();break;
  case'delete-tx':await deleteTx(id);break;
  case'delete-due':await deleteDue(id);break;
  case'remove-member':await removeMember(id);break;
  case'remove-invite':await removeInvite(id);break;
  case'receipt':await openReceipt(id);break;
  case'reload':await loadData(true);toast('Kayıtlar güncellendi.');break;
  case'claim':await claimInvitation();break;
  case'logout':if(state.sub){state.client.removeChannel(state.sub);state.sub=null;}await state.client.auth.signOut();state.member=null;state.user=null;state.org=null;state.modal=null;state.authNote='';state.authMode='login';renderAuth();break;
  case'auth-mode':state.authMode=mode;state.authNote='';renderAuth();break;
  case'clear-filters':state.txMonth='';state.txKind='';render();break;
  case'export':exportCSV(file);break;
  case'print':window.print();break;
 }
}
function handleChange(event){const el=event.target;
 if(el.name==='kind'&&el.closest('form[data-form="tx"]')){toggleTransactionSections();return;}
 if(el.dataset.filter==='period'){if(/^\d{4}-\d{2}$/.test(el.value)){state.period=el.value;render();}return;}
 if(el.dataset.filter==='txMonth'){state.txMonth=el.value;render();return;}
 if(el.dataset.filter==='txKind'){state.txKind=el.value;render();return;}
}
async function init(){document.addEventListener('submit',handleForm);document.addEventListener('click',event=>{if(event.target?.matches?.('.modal-backdrop[data-overlay]')){closeModal();return;}handleAction(event);});document.addEventListener('change',handleChange);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.modal)closeModal();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.user&&state.member){if(state.modal||state.busy)state.pendingRefresh=true;else loadData(true);}});
 setInterval(()=>{if(document.visibilityState==='visible'&&state.user&&state.member){if(state.modal||state.busy)state.pendingRefresh=true;else loadData(true);}},30000);
 if(!CFG.supabaseUrl?.startsWith('https://')||!CFG.supabaseAnonKey||CFG.supabaseAnonKey.includes('BURAYA_')||CFG.supabaseUrl.includes('BURAYA_')){renderNoConfig();return;}
 try{
  const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
  state.client=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  state.client.auth.onAuthStateChange((event)=>{
   if(event==='PASSWORD_RECOVERY'){state.recovery=true;renderAuth();}
   if(['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))setTimeout(()=>setupMembership(),0);
  });
  await setupMembership();
  if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
 }catch(e){renderNoConfig('Supabase SDK yüklenemedi: '+errMsg(e));}
}
init();
