import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL='https://yvfumgrywsqhsvjfnmzu.supabase.co';
const SUPABASE_KEY='sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const categoryHost=document.querySelector('[data-lh-categories]');
const resourceHost=document.querySelector('[data-lh-resource-grid]');
const filterHost=document.querySelector('[data-lh-filters]');
const search=document.querySelector('[data-lh-search]');
const empty=document.querySelector('[data-lh-empty]');
let categories=[],resources=[],activeCategory=new URLSearchParams(location.search).get('category')||'all';
const icons={'ai':'✳','automation':'↗','github-development':'⌘','prompts':'✎','roadmaps':'▤','ai-tools':'⚙','web-technology':'⌘','data-productivity':'▦','technology-trends':'◎'};const iconGlyphs={'brain-circuit':'✳','workflow':'↗','github':'⌘','message-square-text':'✎','map':'▤','app-window':'⚙','code':'⌘','chart-no-axes-combined':'▦','newspaper':'◎'};
const typeLabels={guide:'Text guide',prompt:'Prompt',pdf:'PDF',link:'External link',image:'Image',code:'Code / skill',video:'Video',collection:'Collection'};
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function resourceHref(r){return '/learn/r/'+encodeURIComponent(r.slug)+'/';}
function publicUrl(path){return path?supabase.storage.from('amm-learning').getPublicUrl(path).data.publicUrl:'';}
function categoryHref(slug){const url=new URL(location.href);url.searchParams.set('category',slug);url.hash='resources';return url.pathname+url.search+url.hash;}
function renderCategories(){
 if(!categoryHost)return;categoryHost.replaceChildren();
 if(!categories.length){categoryHost.append(node('p','lh-empty','Learning categories are being prepared.'));return;}
 categories.forEach(c=>{const a=node('a','lh-category');a.href=categoryHref(c.slug);const ico=node('span','lh-category-icon',iconGlyphs[c.icon]||icons[c.slug]||'▤');const title=node('strong','',c.name);const desc=node('small','',c.description||'Explore resources in this category.');a.append(ico,title,desc);categoryHost.append(a);});
}
function renderFilters(){
 if(!filterHost)return;filterHost.replaceChildren();
 const all=node('button','lh-filter'+(activeCategory==='all'?' is-active':''),'All resources');all.type='button';all.dataset.categoryFilter='all';filterHost.append(all);
 categories.forEach(c=>{const b=node('button','lh-filter'+(activeCategory===c.slug?' is-active':''),c.name);b.type='button';b.dataset.categoryFilter=c.slug;filterHost.append(b);});
 filterHost.querySelectorAll('[data-category-filter]').forEach(b=>b.addEventListener('click',()=>{activeCategory=b.dataset.categoryFilter;const url=new URL(location.href);if(activeCategory==='all')url.searchParams.delete('category');else url.searchParams.set('category',activeCategory);history.replaceState({},'',url.pathname+url.search+'#resources');renderFilters();renderResources();}));
}
function makeCard(r){
 const article=node('article','lh-card');
 if(r.thumbnail_path){const img=node('img','lh-card-image');img.src=publicUrl(r.thumbnail_path);img.alt='';img.loading='lazy';article.append(img);}
 const top=node('div','lh-card-top');top.append(node('span','lh-tag',typeLabels[r.content_type]||'Resource'));const date=r.published_at?new Date(r.published_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';top.append(node('span','lh-level',date));article.append(top);
 const body=node('div','lh-card-body');if(r.learning_categories?.name)body.append(node('span','lh-card-category',r.learning_categories.name));body.append(node('h3','',r.title),node('p','',r.summary||'Open this resource to explore the full guide and supporting materials.'));
 const link=node('a','lh-card-link','Open resource →');link.href=resourceHref(r);body.append(link);article.append(body);return article;
}
function renderResources(){
 if(!resourceHost)return;const q=(search?.value||'').trim().toLowerCase();
 const shown=resources.filter(r=>(activeCategory==='all'||r.learning_categories?.slug===activeCategory)&&(!q||[r.title,r.summary,r.body,(r.tags||[]).join(' '),r.learning_categories?.name].join(' ').toLowerCase().includes(q)));
 resourceHost.replaceChildren();shown.forEach(r=>resourceHost.append(makeCard(r)));
 if(empty)empty.hidden=shown.length!==0;
}
async function load(){
 try{
  const [catRes,resRes]=await Promise.all([
   supabase.from('learning_categories').select('id,name,slug,description,icon,sort_order').eq('is_active',true).order('sort_order').order('name'),
   supabase.from('learning_resources').select('id,title,slug,summary,content_type,body,thumbnail_path,tags,published_at,featured,sort_order,learning_categories(name,slug)').eq('status','published').order('featured',{ascending:false}).order('published_at',{ascending:false})
  ]);
  if(catRes.error)throw catRes.error;if(resRes.error)throw resRes.error;
  categories=catRes.data||[];resources=resRes.data||[];
  renderCategories();if(!categories.some(c=>c.slug===activeCategory))activeCategory='all';renderFilters();renderResources();
 }catch(err){console.error('AMM Learn library:',err);if(categoryHost)categoryHost.replaceChildren(node('p','lh-empty','The learning library could not load right now. Please refresh in a moment.'));if(resourceHost)resourceHost.replaceChildren();if(empty){empty.hidden=false;empty.textContent='Resources are temporarily unavailable. Please try again shortly.';}}
}
search?.addEventListener('input',renderResources);
load();
