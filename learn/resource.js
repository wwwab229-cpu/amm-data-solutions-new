import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL='https://yvfumgrywsqhsvjfnmzu.supabase.co';
const SUPABASE_KEY='sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const slug=decodeURIComponent(location.pathname.replace(/\/+$/,'').split('/').pop()||new URLSearchParams(location.search).get('slug')||'');
const $=s=>document.querySelector(s);
const typeLabels={guide:'Text guide',prompt:'Copy-ready prompt',pdf:'Downloadable PDF',link:'External resource',image:'Image resource',code:'Code & GitHub skill',video:'Video resource',collection:'Resource collection'};
function text(el,value){if(el)el.textContent=value||'';}
function safeUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}}
function publicUrl(path){return path?supabase.storage.from('amm-learning').getPublicUrl(path).data.publicUrl:'';}
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function markdown(source){
 const lines=String(source||'').replace(/\r/g,'').split('\n');let out=[],paragraph=[],list=[];
 const flushP=()=>{if(paragraph.length){out.push('<p>'+inline(paragraph.join(' '))+'</p>');paragraph=[];}};
 const flushL=()=>{if(list.length){out.push('<ul>'+list.map(x=>'<li>'+inline(x)+'</li>').join('')+'</ul>');list=[];}};
 for(const line of lines){const s=line.trim();if(!s){flushP();flushL();continue;}if(s.startsWith('### ')){flushP();flushL();out.push('<h3>'+inline(s.slice(4))+'</h3>');}else if(s.startsWith('## ')){flushP();flushL();out.push('<h2>'+inline(s.slice(3))+'</h2>');}else if(s.startsWith('# ')){flushP();flushL();out.push('<h2>'+inline(s.slice(2))+'</h2>');}else if(/^[-*] /.test(s)){flushP();list.push(s.slice(2));}else{flushL();paragraph.push(s);}}
 flushP();flushL();return out.join('');
}
function inline(value){let s=esc(value);s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');s=s.replace(/\*(.+?)\*/g,'<em>$1</em>');s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(_,label,url)=>'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');return s;}
function el(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;}
function addAction(host,label,url,download){if(!url)return;const a=el('a','lh-button',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';if(download)a.setAttribute('download','');host.append(a);}
function card(r){const a=el('article','lh-card');const top=el('div','lh-card-top');top.append(el('span','lh-tag',typeLabels[r.content_type]||'Resource'));a.append(top);const body=el('div','lh-card-body');body.append(el('h3','',r.title),el('p','',r.summary||''));const link=el('a','lh-card-link','Open resource →');link.href='/learn/r/'+encodeURIComponent(r.slug)+'/';body.append(link);a.append(body);return a;}
async function load(){
 if(!slug){text($('[data-resource-title]'),'Resource not found');return;}
 try{
  const {data:r,error}=await supabase.from('learning_resources').select('*,learning_categories(id,name,slug)').eq('slug',slug).eq('status','published').maybeSingle();
  if(error)throw error;if(!r){text($('[data-resource-title]'),'This resource is not available');text($('[data-resource-summary]'),'It may have been unpublished or moved. Browse the AMM Learn library to find other resources.');$('[data-resource-content]').innerHTML='<div class="lh-content-card"><a class="lh-button" href="/learn/">Return to AMM Learn</a></div>';return;}
  const title=r.seo_title||r.title;const description=r.seo_description||r.summary||'Explore this practical learning resource from AMM Learn.';
  document.title=/\|\s*AMM Learn$/i.test(title)?title:title+' | AMM Learn';const desc=$('meta[name="description"]');if(desc)desc.content=description;
  const canonical='https://amm-data-solutions-new.vercel.app/learn/r/'+encodeURIComponent(r.slug)+'/';let canon=$('link[rel="canonical"]');if(canon)canon.href=canonical;
  const ogTitle=$('meta[property="og:title"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{content:title}));ogTitle.setAttribute('property','og:title');ogTitle.content=title;
  const ogDesc=$('meta[property="og:description"]')||document.head.appendChild(document.createElement('meta'));ogDesc.setAttribute('property','og:description');ogDesc.content=description;
  const ogUrl=$('meta[property="og:url"]')||document.head.appendChild(document.createElement('meta'));ogUrl.setAttribute('property','og:url');ogUrl.content=canonical;
  text($('[data-resource-category]'),r.learning_categories?.name||'Resource');text($('[data-resource-type]'),typeLabels[r.content_type]||'Learning resource');text($('[data-resource-title]'),r.title);text($('[data-resource-summary]'),r.summary);
  const meta=$('[data-resource-meta]');meta.append(el('span','lh-meta-pill','Published '+new Date(r.published_at||r.created_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})));if(r.updated_at)meta.append(el('span','lh-meta-pill','Updated '+new Date(r.updated_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})));
  const content=$('[data-resource-content]');content.replaceChildren();
  if(r.thumbnail_path){const img=el('img','lh-resource-hero-image');img.src=publicUrl(r.thumbnail_path);img.alt=r.title;img.loading='eager';content.append(img);}const attachments=Array.isArray(r.metadata?.attachments)?r.metadata.attachments:(r.file_path?[{path:r.file_path,name:'Download resource',mime_type:''}]:[]);if(r.content_type==='image'){attachments.forEach(file=>{const img=el('img','lh-resource-hero-image');img.src=publicUrl(file.path);img.alt=file.name||r.title;img.loading='lazy';content.append(img);});}
  if(r.content_type==='prompt'||r.content_type==='code'){
   const box=el('section','lh-content-card');box.append(el('h2','',r.content_type==='prompt'?'Copy-ready prompt':'Code and commands'));const pre=el('pre','lh-prompt');pre.textContent=r.body||'No text content has been added.';pre.id='resource-copy-content';box.append(pre);const actions=el('div','lh-prompt-actions');const copy=el('button','lh-button','Copy '+(r.content_type==='code'?'code':'prompt')+' ⧉');copy.type='button';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.textContent);copy.textContent='Copied!';}catch{copy.textContent='Select and copy';}});actions.append(copy);box.append(actions);content.append(box);
  }else if(r.body){const box=el('section','lh-content-card');box.className+=' lh-rich-content';box.innerHTML=markdown(r.body);content.append(box);}
  if(r.related_video_url){const u=safeUrl(r.related_video_url);if(u){const box=el('section','lh-content-card');box.append(el('h2','',"Watch the related video"));const a=el('a','lh-card-link','Open video ↗');a.href=u;a.target='_blank';a.rel='noopener noreferrer';box.append(a);content.append(box);}}
  const actions=$('[data-resource-actions]');actions.replaceChildren(el('h2','',"Resource files"));
  attachments.forEach((file,index)=>{const url=publicUrl(file.path);if(url)addAction(actions,file.name||((r.content_type==='pdf'?'Download PDF':'Download file')+(attachments.length>1?' '+(index+1):'')),url,true);});
  const external=safeUrl(r.resource_url);if(external)addAction(actions,'Open external resource ↗',external,false);
  const extraLinks=Array.isArray(r.metadata?.links)?r.metadata.links:[];extraLinks.forEach(item=>{const url=safeUrl(item.url);if(url)addAction(actions,(item.label||'Open link')+' ↗',url,false);});
  if(!attachments.length&&!external&&!extraLinks.length)actions.append(el('p','lh-muted','This resource is available to read and copy on this page.'));
  if(Array.isArray(r.tags)&&r.tags.length){const tags=el('div','lh-resource-tags');r.tags.forEach(t=>tags.append(el('span','lh-tag',t)));actions.append(tags);}
  const ld={'@context':'https://schema.org','@type':'LearningResource','name':r.title,'description':description,'url':canonical,'learningResourceType':typeLabels[r.content_type]||r.content_type,'inLanguage':'en','datePublished':r.published_at||r.created_at,'dateModified':r.updated_at,'author':{'@type':'Organization','name':'AMM Data Solutions'},'publisher':{'@type':'Organization','name':'AMM Data Solutions','url':'https://amm-data-solutions-new.vercel.app/'}};
  const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(ld);document.head.append(script);
  if(r.learning_categories?.id){const {data:related}=await supabase.from('learning_resources').select('title,slug,summary,content_type').eq('category_id',r.category_id).eq('status','published').neq('id',r.id).order('published_at',{ascending:false}).limit(3);if(related?.length){const host=$('[data-related-resources]');related.forEach(item=>host.append(card(item)));$('[data-related-section]').hidden=false;}}
 }catch(err){console.error(err);text($('[data-resource-title]'),'Unable to load this resource');text($('[data-resource-summary]'),'Please refresh the page or return to the AMM Learn library.');const host=$('[data-resource-content]');if(host)host.replaceChildren(el('div','lh-content-card','The resource could not be loaded. Please return to the AMM Learn library.'));}
}
load();
