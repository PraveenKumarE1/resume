const ids=['name','title','email','phone','location','linkedin','github','portfolio','summary','skills','tools','achievements'];
const data={education:[],project:[],experience:[],certification:[]};

const $=id=>document.getElementById(id);
function esc(v=''){return v.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function repeatFields(type,item={}){
  const configs={
    education:[['degree','Degree / Course'],['school','College / University'],['year','Year'],['details','Details']],
    project:[['name','Project Name'],['tech','Technologies'],['link','Project Link'],['description','Description']],
    experience:[['role','Role'],['company','Company'],['period','Period'],['description','Description']],
    certification:[['name','Certificate Name'],['issuer','Issuer'],['year','Year'],['link','Certificate Link']]
  };
  const box=document.createElement('div'); box.className='repeat';
  box.innerHTML='<button class="remove">Remove</button><div class="grid">'+configs[type].map(([k,p])=>`<label>${p}<input data-key="${k}" value="${esc(item[k]||'')}"></label>`).join('')+'</div>';
  box.querySelector('.remove').onclick=()=>{box.remove();sync();render()};
  box.querySelectorAll('input').forEach(i=>i.oninput=()=>{sync();render()});
  return box;
}
function add(type,item={}){data[type].push(item);document.getElementById(type+'List').appendChild(repeatFields(type,item))}
function sync(){
  ['education','project','experience','certification'].forEach(type=>{
    data[type]=[...document.querySelectorAll('#'+type+'List .repeat')].map(box=>{
      const o={};box.querySelectorAll('[data-key]').forEach(i=>o[i.dataset.key]=i.value);return o;
    });
  });
}
function list(items,mapper){return items.length?'<ul>'+items.map(mapper).join('')+'</ul>':'<div class="empty">Not added</div>'}
function render(){
  const v=Object.fromEntries(ids.map(id=>[id,$(id).value.trim()]));
  const contact=[v.email,v.phone,v.location,v.linkedin,v.github,v.portfolio].filter(Boolean).map(esc).join(' • ');
  let h=`<header><h1>${esc(v.name||'Your Name')}</h1><div class="role">${esc(v.title||'Professional Title')}</div><div class="contact">${contact||'Email • Phone • Location • LinkedIn • GitHub'}</div></header>`;
  if(v.summary)h+=`<h2>Professional Summary</h2><p>${esc(v.summary)}</p>`;
  if(data.education.length)h+='<h2>Education</h2>'+data.education.map(x=>`<div class="two"><span class="item-title">${esc(x.degree||'Degree')}</span><span class="muted">${esc(x.year)}</span></div><p>${esc(x.school)}${x.details?' — '+esc(x.details):''}</p>`).join('');
  if(v.skills||v.tools)h+='<h2>Skills</h2>'+(v.skills?`<p><b>Technical:</b> ${esc(v.skills)}</p>`:'')+(v.tools?`<p><b>Tools:</b> ${esc(v.tools)}</p>`:'');
  if(data.project.length)h+='<h2>Projects</h2>'+data.project.map(x=>`<p><span class="item-title">${esc(x.name||'Project')}</span>${x.tech?' — '+esc(x.tech):''}${x.link?' | '+esc(x.link):''}<br>${esc(x.description)}</p>`).join('');
  if(data.experience.length)h+='<h2>Experience</h2>'+data.experience.map(x=>`<div class="two"><span class="item-title">${esc(x.role||'Role')} — ${esc(x.company)}</span><span class="muted">${esc(x.period)}</span></div><p>${esc(x.description)}</p>`).join('');
  if(data.certification.length)h+='<h2>Certifications</h2>'+list(data.certification,x=>`<li><b>${esc(x.name)}</b>${x.issuer?' — '+esc(x.issuer):''}${x.year?' ('+esc(x.year)+')':''}${x.link?' | '+esc(x.link):''}</li>`);
  if(v.achievements)h+='<h2>Achievements & Activities</h2>'+list(v.achievements.split(/\n+/).filter(Boolean),x=>`<li>${esc(x)}</li>`);
  $('resumePreview').innerHTML=h;$('status').textContent='Preview updated';
}
ids.forEach(id=>$(id).addEventListener('input',render));
document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=()=>{add(btn.dataset.add);render()});
$('saveBtn').onclick=()=>{sync();localStorage.setItem('resumeCreator',JSON.stringify({values:Object.fromEntries(ids.map(id=>[id,$(id).value])),data}));$('status').textContent='Saved locally'};
$('clearBtn').onclick=()=>{if(!confirm('Clear the current resume?'))return;ids.forEach(id=>$(id).value='');Object.keys(data).forEach(k=>data[k]=[]);['education','project','experience','certification'].forEach(t=>$(t+'List').innerHTML='');localStorage.removeItem('resumeCreator');render()};
$('printBtn').onclick=()=>window.print();

const saved=localStorage.getItem('resumeCreator');
if(saved){try{const s=JSON.parse(saved);ids.forEach(id=>$(id).value=s.values?.[id]||'');Object.keys(data).forEach(t=>(s.data?.[t]||[]).forEach(x=>add(t,x)))}catch(e){}}
if(!data.education.length)add('education');
if(!data.project.length)add('project');
render();