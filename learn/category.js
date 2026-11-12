import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const SUPABASE_URL='https://yvfumgrywsqhsvjfnmzu.supabase.co';
const SUPABASE_KEY='sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const slug=decodeURIComponent(location.pathname.replace(/\\/+$/,'').split('/').pop()||new URLSearchParams(location.search).get('slug')||'');
const $=s=>document.querySelector(s);
const typeLabels={guide:'Text guide',prompt:'Prompt',pdf:'PDF',link:'External link',image:'Image',code:'Code / skill',video:'Video',collection:'Collection'};
const typeIcons={guide:'GUIDE',prompt:'PROMPT',pdf:'PDF',link:'LINK',image:'IMAGE',code:'CODE',video:'VIDEO',collection:'COLLECTION'};
let resources=[];
function node(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;}
function publicUrl(path){return path?supabase.storage.from('amm-learning').getPublicUrl(path).data.publicUrl:'';}
function card(r){
 const a=node('article','lh-card');
 if(r.thumbnail_path){const img=node('img','lh-card-image');img.src=publicUrl(r.thumbnail_path);img.alt='';img.loading='lazy';a.append(img);}
 const top=node('div','lh-card-top');top.append(node('span','lh-tag',typeLabels[r.content_type]||'Resource'));
 const date=r.published_at?new Date(r.published_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'';top.append(node('span','lh-level',date));a.append(top);
 const body=node('div','lh-card-body');body.append(node('span','lh-card-category',typeIcons[r.content_type]||'RESOURCE'),node('h3','',r.title),node('p','',r.summary||'Open this resource to explore the full guide and supporting materials.'));
 const link=node('a','lh-card-link','Open resource →');link.href='/learn/r/'+encodeURIComponent(r.slug)+'/';body.append(link);a.append(body);return a;
}
function render(){
 const q=($('#category-search')?.value||'').trim().toLowerCase();
 const type=$('[data-category-type]')?.value||'all';
 const shown=resources.filter(r=>(type==='all'||r.content_type===type)&&(!q||[r.title,r.summary,r.body,(r.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)));
 const host=$('[data-category-resources]');host.replaceChildren();shown.forEach(r=>host.append(card(r)));
 const empty=$('[data-category-empty]');if(empty)empty.hidden=shown.length>0;
 const count=$('[data-category-count]');if(count)count.textContent=shown.length+' '+(shown.length===1?'resource':'resources')+' in this category';
}
async function load(){
 if(!slug){$('[data-category-title]').textContent='Category not found';return;}
 try{
  const {data:category,error}=await supabase.from('learning_categories').select('id,name,slug,description').eq('slug',slug).eq('is_active',true).maybeSingle();
  if(error)throw error;if(!category){$('[data-category-title]').textContent='Category not available';$('[data-category-description]').textContent='This category may have been moved or is currently unavailable.';return;}
  document.title=category.name+' | AMM Learn';
  const description=category.description||'Explore practical learning resources from AMM Data Solutions.';
  const desc=$('meta[name="description"]');if(desc)desc.content=description;
  const canonical='https://amm-data-solutions-new.vercel.app/learn/c/'+encodeURIComponent(category.slug)+'/';
  const canon=$('link[rel="canonical"]');if(canon)canon.href=canonical;
  const ogTitle=$('meta[property="og:title"]');if(ogTitle)ogTitle.content=category.name+' | AMM Learn';
  const ogDesc=$('meta[property="og:description"]');if(ogDesc)ogDesc.content=description;
  const ogUrl=$('meta[property="og:url"]');if(ogUrl)ogUrl.content=canonical;
  $('[data-category-name]').textContent=category.name;
  $('[data-category-title]').textContent=category.name;
  $('[data-category-description]').textContent=description;
  const {data,error:resourceError}=await supabase.from('learning_resources').select('id,title,slug,summary,content_type,body,thumbnail_path,tags,published_at').eq('category_id',category.id).eq('status','published').order('featured',{ascending:false}).order('sort_order').order('published_at',{ascending:false});
  if(resourceError)throw resourceError;resources=data||[];render();
  const ld={'@context':'https://schema.org','@type':'CollectionPage','name':category.name+' | AMM Learn','description':description,'url':canonical,'isPartOf':{'@type':'WebSite','name':'AMM Data Solutions','url':'https://amm-data-solutions-new.vercel.app/'},'mainEntity':{'@type':'ItemList','itemListElement':resources.map((r,i)=>({'@type':'ListItem','position':i+1,'name':r.title,'url':'https://amm-data-solutions-new.vercel.app/learn/r/'+encodeURIComponent(r.slug)+'/'}))}};
  const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(ld);document.head.append(script);
 }catch(err){console.error('AMM Learn category:',err);$('[data-category-title]').textContent='Unable to load this category';$('[data-category-description]').textContent='Please refresh the page or return to the AMM Learn library.';$('[data-category-resources]').replaceChildren(node('p','lh-empty','This category could not be loaded right now.'));}
}
$('[data-category-search]')?.addEventListener('input',render);
$('[data-category-type]')?.addEventListener('change',render);
load();
