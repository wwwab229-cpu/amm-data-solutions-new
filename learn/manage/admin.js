import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL='https://yvfumgrywsqhsvjfnmzu.supabase.co';
const SUPABASE_KEY='sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk';
const ADMIN_EMAIL='ammdatasolutions229@gmail.com';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s);
const loginPanel=$('#loginPanel'),dashboard=$('#dashboard'),signOut=$('#signOut');
let categories=[],resources=[];
const slugify=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function message(el,text,error=false){el.textContent=text;el.classList.toggle('error',error);}
function formData(form){return Object.fromEntries(new FormData(form).entries());}
function setSelectOptions(select,items,selected){select.replaceChildren(new Option('Choose a category',''));items.forEach(c=>select.add(new Option(c.name,c.id)));if(selected)select.value=selected;}
function statusBadge(status){const s=document.createElement('span');s.className='admin-status '+status;s.textContent=status;return s;}
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;}
function resetCategory(){const f=$('#categoryForm');f.reset();f.elements.id.value='';f.elements.sort_order.value=String((categories.length+1)*10);f.elements.is_active.checked=true;}
function resetResource(){const f=$('#resourceForm');f.reset();f.elements.id.value='';f.elements.existing_file_path.value='';f.elements.existing_thumbnail_path.value='';f.elements.existing_attachments.value='[]';f.elements.additional_links.value='';f.elements.status.value='draft';f.elements.sort_order.value='0';f.elements.featured.checked=false;$('#editorTitle').textContent='Create a resource';$('#resourceMessage').textContent='';setSelectOptions(f.elements.category_id,categories);$('#resourceEditor').classList.remove('hidden');$('#resourceEditor').scrollIntoView({behavior:'smooth',block:'start'});}
async function loadAll(){
 const [c,r]=await Promise.all([
  supabase.from('learning_categories').select('*').order('sort_order').order('name'),
  supabase.from('learning_resources').select('*,learning_categories(name,slug)').order('updated_at',{ascending:false})
 ]);
 if(c.error)throw c.error;if(r.error)throw r.error;categories=c.data||[];resources=r.data||[];
 $('#categoryCount').textContent=categories.length;$('#resourceCount').textContent=resources.length;$('#publishedCount').textContent=resources.filter(x=>x.status==='published').length;$('#draftCount').textContent=resources.filter(x=>x.status==='draft').length;
 renderCategories();renderResources();setSelectOptions($('#resourceForm').elements.category_id,categories);
}
function renderCategories(){
 const host=$('#categoryList');host.replaceChildren();
 categories.forEach(c=>{const row=el('div','admin-list-item');const info=el('div','');info.append(el('strong','',c.name),el('small','', '/learn/?category='+c.slug+' · '+(c.is_active?'Visible':'Hidden')));const actions=el('div','admin-item-actions');const edit=el('button','','Edit');edit.type='button';edit.addEventListener('click',()=>{const f=$('#categoryForm');f.elements.id.value=c.id;f.elements.name.value=c.name;f.elements.slug.value=c.slug;f.elements.description.value=c.description||'';f.elements.icon.value=c.icon||'book-open';f.elements.sort_order.value=c.sort_order;f.elements.is_active.checked=c.is_active;f.scrollIntoView({behavior:'smooth',block:'center'});});const toggle=el('button','',c.is_active?'Hide':'Show');toggle.type='button';toggle.addEventListener('click',async()=>{const {error}=await supabase.from('learning_categories').update({is_active:!c.is_active}).eq('id',c.id);if(error)return alert(error.message);await loadAll();});actions.append(edit,toggle);row.append(info,actions);host.append(row);});
}
function renderResources(){
 const host=$('#resourceList');host.replaceChildren();const q=$('#resourceSearch').value.trim().toLowerCase(),status=$('#statusFilter').value;
 const rows=resources.filter(r=>(status==='all'||r.status===status)&&(!q||[r.title,r.slug,r.summary,r.learning_categories?.name,(r.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)));
 if(!rows.length){host.append(el('p','lh-muted','No resources match this filter.'));return;}
 rows.forEach(r=>{const row=el('div','admin-list-item');const info=el('div','');info.append(el('strong','',r.title));const meta=el('small','',(r.learning_categories?.name||'Uncategorised')+' · '+r.content_type+' · '+r.slug);info.append(meta,statusBadge(r.status));const actions=el('div','admin-item-actions');const edit=el('button','','Edit');edit.type='button';edit.addEventListener('click',()=>editResource(r.id));actions.append(edit);if(r.status==='published'){const open=el('a','','View');open.href='/learn/r/'+encodeURIComponent(r.slug)+'/';open.target='_blank';open.rel='noopener';actions.append(open);const copy=el('button','','Copy URL');copy.type='button';copy.addEventListener('click',async()=>{await navigator.clipboard.writeText(location.origin+'/learn/r/'+r.slug+'/');copy.textContent='Copied';});actions.append(copy);}const archive=el('button','',r.status==='archived'?'Restore':'Archive');archive.type='button';archive.addEventListener('click',async()=>{const next=r.status==='archived'?'draft':'archived';const {error}=await supabase.from('learning_resources').update({status:next}).eq('id',r.id);if(error)return alert(error.message);await loadAll();});const del=el('button','danger','Delete');del.type='button';del.addEventListener('click',async()=>{if(!confirm('Delete this resource record? Uploaded files remain in Storage so no other page is broken.'))return;const {error}=await supabase.from('learning_resources').delete().eq('id',r.id);if(error)return alert(error.message);await loadAll();});actions.append(archive,del);row.append(info,actions);host.append(row);});
}
function editResource(id){
 const r=resources.find(x=>x.id===id);if(!r)return;resetResource();const f=$('#resourceForm');$('#editorTitle').textContent='Edit resource';f.elements.id.value=r.id;f.elements.title.value=r.title;f.elements.slug.value=r.slug;f.elements.category_id.value=r.category_id;f.elements.content_type.value=r.content_type;f.elements.summary.value=r.summary||'';f.elements.body.value=r.body||'';f.elements.resource_url.value=r.resource_url||'';f.elements.related_video_url.value=r.related_video_url||'';f.elements.existing_file_path.value=r.file_path||'';f.elements.existing_thumbnail_path.value=r.thumbnail_path||'';const savedAttachments=Array.isArray(r.metadata?.attachments)?r.metadata.attachments:(r.file_path?[{path:r.file_path,name:r.file_path.split('/').pop(),mime_type:''}]:[]);f.elements.existing_attachments.value=JSON.stringify(savedAttachments);f.elements.additional_links.value=(Array.isArray(r.metadata?.links)?r.metadata.links:[]).map(x=>(x.label||x.url)+' | '+x.url).join('\n');f.elements.tags.value=(r.tags||[]).join(', ');f.elements.seo_title.value=r.seo_title||'';f.elements.seo_description.value=r.seo_description||'';f.elements.status.value=r.status;f.elements.featured.checked=r.featured;f.elements.sort_order.value=r.sort_order||0;
}
async function uploadFile(file,folder){
 if(!file)return null;
 const allowed=['application/pdf','image/jpeg','image/png','image/webp','text/plain','text/markdown','application/zip'];
 if(!allowed.includes(file.type))throw new Error('Unsupported file type. Upload a PDF, JPG, PNG, WebP, TXT, Markdown or ZIP file.');
 if(file.size>20*1024*1024)throw new Error('Each upload must be 20 MB or smaller.');
 const safeName=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-|-$/g,'');
 const path=folder+'/'+crypto.randomUUID()+'-'+safeName;
 const {error}=await supabase.storage.from('amm-learning').upload(path,file,{cacheControl:'3600',contentType:file.type,upsert:false});
 if(error)throw error;return {path,name:file.name,mime_type:file.type||'application/octet-stream',size:file.size};
}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const b=$('#loginButton');b.disabled=true;b.textContent='Sending…';message($('#loginMessage'),'');try{const {error}=await supabase.auth.signInWithOtp({email:ADMIN_EMAIL,options:{emailRedirectTo:location.origin+location.pathname,shouldCreateUser:true}});if(error)throw error;message($('#loginMessage'),'Sign-in link sent. Open the email and use the link on this device.');}catch(err){message($('#loginMessage'),err.message,true);}finally{b.disabled=false;b.textContent='Email me a sign-in link';}});
async function showSession(session){
 if(!session?.user){loginPanel.classList.remove('hidden');dashboard.classList.add('hidden');signOut.classList.add('hidden');return;}
 const {data:{user},error}=await supabase.auth.getUser();if(error||!user||String(user.email||'').toLowerCase()!==ADMIN_EMAIL){await supabase.auth.signOut();loginPanel.classList.remove('hidden');dashboard.classList.add('hidden');signOut.classList.add('hidden');message($('#loginMessage'),'This account is not authorised to manage AMM Learning.',true);return;}
 loginPanel.classList.add('hidden');dashboard.classList.remove('hidden');signOut.classList.remove('hidden');try{await loadAll();}catch(err){alert('Could not load the library: '+err.message);}
}
signOut.addEventListener('click',async()=>{await supabase.auth.signOut();});
supabase.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>showSession(session),0);});
const {data:{session}}=await supabase.auth.getSession();await showSession(session);
$('#categoryForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,d=formData(f),payload={name:d.name.trim(),slug:slugify(d.slug||d.name),description:d.description||'',icon:d.icon||'book-open',sort_order:Number(d.sort_order)||0,is_active:f.elements.is_active.checked};const q=d.id?supabase.from('learning_categories').update(payload).eq('id',d.id):supabase.from('learning_categories').insert(payload);const {error}=await q;if(error)return alert(error.message);resetCategory();await loadAll();});
$('#resetCategory').addEventListener('click',resetCategory);
$('#newResource').addEventListener('click',resetResource);
$('#closeEditor').addEventListener('click',()=>$('#resourceEditor').classList.add('hidden'));
$('#cancelResource').addEventListener('click',()=>$('#resourceEditor').classList.add('hidden'));
$('#resourceForm').elements.title.addEventListener('input',e=>{const f=$('#resourceForm');if(!f.elements.id.value)f.elements.slug.value=slugify(e.target.value);});
$('#resourceForm').elements.slug.addEventListener('input',e=>{e.target.value=slugify(e.target.value);});
$('#resourceForm').addEventListener('submit',async e=>{
 e.preventDefault();const f=e.currentTarget,b=$('#saveResource');b.disabled=true;b.textContent='Saving…';message($('#resourceMessage'),'');
 try{
  const d=formData(f);
  let existingAttachments=[];try{existingAttachments=JSON.parse(f.elements.existing_attachments.value||'[]');if(!Array.isArray(existingAttachments))existingAttachments=[];}catch{existingAttachments=[];}
  const selectedFiles=Array.from(f.elements.resourceFiles.files||[]);
  const uploadedAttachments=await Promise.all(selectedFiles.map(file=>uploadFile(file,'resources')));
  const attachments=[...existingAttachments,...uploadedAttachments];
  let filePath=attachments[0]?.path||f.elements.existing_file_path.value||null,thumbPath=f.elements.existing_thumbnail_path.value||null;
  if(f.elements.thumbnailFile.files[0]){const uploadedThumb=await uploadFile(f.elements.thumbnailFile.files[0],'thumbnails');thumbPath=uploadedThumb.path;}
  const resourceUrl=d.resource_url.trim();if(resourceUrl&&!/^https?:\/\//i.test(resourceUrl))throw new Error('External resource URL must begin with http:// or https://');
  const videoUrl=d.related_video_url.trim();if(videoUrl&&!/^https?:\/\//i.test(videoUrl))throw new Error('Related video URL must begin with http:// or https://');
  const links=(d.additional_links||'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map(line=>{const parts=line.split('|');const raw=(parts.length>1?parts.slice(1).join('|'):parts[0]).trim();const label=(parts.length>1?parts[0]:raw).trim();let parsed;try{parsed=new URL(raw);}catch{throw new Error('Every additional link must be a valid http:// or https:// URL.');}if(!['http:','https:'].includes(parsed.protocol))throw new Error('Additional links must use http:// or https://.');return {label:label||parsed.hostname,url:parsed.href};});
  const existing=resources.find(r=>r.id===d.id);
  const payload={category_id:d.category_id,title:d.title.trim(),slug:slugify(d.slug),summary:d.summary||'',content_type:d.content_type,body:d.body||'',resource_url:resourceUrl||null,file_path:filePath,thumbnail_path:thumbPath,metadata:{...(existing?.metadata||{}),attachments,links},tags:(d.tags||'').split(',').map(x=>x.trim()).filter(Boolean),seo_title:d.seo_title||null,seo_description:d.seo_description||null,related_video_url:videoUrl||null,status:d.status,featured:f.elements.featured.checked,sort_order:Number(d.sort_order)||0,published_at:d.status==='published'?(resources.find(r=>r.id===d.id)?.published_at||new Date().toISOString()):(resources.find(r=>r.id===d.id)?.published_at||null)};
  if(!payload.slug)throw new Error('Please enter a valid URL slug.');
  const result=d.id?await supabase.from('learning_resources').update(payload).eq('id',d.id):await supabase.from('learning_resources').insert(payload);
  if(result.error)throw result.error;
  message($('#resourceMessage'),d.status==='published'?'Published successfully. Your direct resource page is now available.':'Resource saved successfully.');
  await loadAll();f.reset();f.elements.id.value='';f.elements.existing_file_path.value='';f.elements.existing_thumbnail_path.value='';f.elements.existing_attachments.value='[]';$('#resourceEditor').classList.add('hidden');
 }catch(err){message($('#resourceMessage'),err.message||'Could not save resource.',true);}
 finally{b.disabled=false;b.textContent='Save resource';}
});
$('#resourceSearch').addEventListener('input',renderResources);$('#statusFilter').addEventListener('change',renderResources);
resetCategory();
