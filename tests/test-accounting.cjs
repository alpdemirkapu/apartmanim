// Basit Node.js regresyon testleri. Komut: node tests/test-accounting.cjs
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const source = fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8').replace(/\binit\(\);\s*$/, '');
const sandbox={document:{getElementById:()=>({})},window:{APARTMAN_CONFIG:{}},Intl,Date,console, setTimeout,clearTimeout};
const tests=`
function ensure(v,msg){if(!v)throw new Error(msg);}
state.period='2026-11';
state.org={id:'org',monthly_fee:500};
state.accounts=[{id:'cash',name:'Kasa',kind:'cash',opening_balance:100},{id:'bank',name:'Banka',kind:'bank',opening_balance:200}];
state.units=[{id:'u1',number:1,opening_debt:40}];
state.dues=[{apartment_id:'u1',period:'2026-11-01',amount:100}];
state.tx=[
 {kind:'aidat',apartment_id:'u1',period:'2026-11-01',account_id:'bank',amount:80,occurred_on:'2026-11-03'},
 {kind:'devir',apartment_id:'u1',account_id:'cash',amount:10,occurred_on:'2026-11-07'},
 {kind:'gider',account_id:'cash',amount:30,occurred_on:'2026-11-09'},
 {kind:'virman',from_account_id:'cash',to_account_id:'bank',amount:40,occurred_on:'2026-11-10'}
];
let x=calc();
ensure(x.balances.get('cash')===40,'Cash balance: 100+10-30-40 = 40');
ensure(x.balances.get('bank')===320,'Bank balance: 200+80+40 = 320');
ensure(x.totalMoney===360,'Total money: 300+90-30 = 360');
ensure(x.totalDebt===50,'Debt: 100+40-80-10 = 50');
ensure(x.mExpected===100 && x.mPaid===80,'Monthly due vs allocated payment');
ensure(x.income===90 && x.expense===30,'Transfers excluded from income/expense');
ensure(status(state.dues[0],80).label==='Kısmi ödeme','Partial payment');
state.tx.push({kind:'aidat',apartment_id:'u1',period:'2026-11-01',account_id:'bank',amount:90,occurred_on:'2026-12-03'});
x=calc();
ensure(x.totalDebt===0 && x.credit===40,'Overpayment treated as apartment credit');
ensure(x.mPaid===170 && x.income===90,'Period payment totals independent of cash receipt date');
ensure(asCSV([{name:'A"B',amount:'1,2'}],[['Ad','name'],['Tutar','amount']]).includes('"A""B"'),'CSV quotes escaped');
console.log('PASS: balances, transfers, debts, monthly dates, partial payments, credits, CSV');
`;
try {vm.runInNewContext(source+'\n'+tests,sandbox,{timeout:1500});}
catch(e){console.error('FAILED:',e);process.exitCode=1;}
