const OWNER='wwwab229-cpu';
const REPO='amm-data-solutions-new';
const BRANCH=process.env.AMM_LEARN_GITHUB_BRANCH||'main';
const API='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/';
function json(res,status,payload){res.status(status).setHeader('Content-Type','application/json; charset=utf-8').setHeader('Cache-Control','no-store').end(JSON.stringify(payload));}
function secureEqual(a,b){const crypto=require('crypto');const x=Buffer.from(String(a||''));const y=Buffer.from(String(b||''));return x.length===y.length&&crypto.timingSafeEqual(x,y);}
async function github(path,options={}){const [filePath,query='']=path.split('?');const url=API+filePath.split('/').map(encodeURIComponent).join('/')+(query?'?'+query:'');const response=await fetch(url,{...options,headers:{Authorization:'Bearer '+process.env.AMM_LEARN_GITHUB_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(options.headers||{})}});const body=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(body.message||'GitHub request failed ('+response.status+').');error.status=response.status;throw error;}return body;}
function decodeContent(file){return Buffer.from(file.content||'','base64').toString('utf8');}
module.exports=async function handler(req,res){
 res.setHeader('Vary','Origin');
 if(!['GET','POST'].includes(req.method))return json(res,405,{error:'Method not allowed.'});
 if(!process.env.AMM_LEARN_ADMIN_PASSWORD||!process.env.AMM_LEARN_GITHUB_TOKEN)return json(res,503,{error:'AMM Learning GitHub publishing is not configured yet. Add the required Vercel environment variables.'});
 const auth=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
 if(!secureEqual(auth,process.env.AMM_LEARN_ADMIN_PASSWORD))return json(res,401,{error:'Admin password is incorrect.'});
 try{
  if(req.method==='GET'){
   const name=String(req.query.file||'');
   if(!['categories','resources'].includes(name))return json(res,400,{error:'Unknown content file.'});
   const file=await github('learn/data/'+name+'.json?ref='+encodeURIComponent(BRANCH));
   return json(res,200,{data:JSON.parse(decodeContent(file)),sha:file.sha,branch:BRANCH});
  }
  const body=req.body||{};
  if(body.action==='save'){
   const name=String(body.file||'');
   if(!['categories','resources'].includes(name)||!Array.isArray(body.data))return json(res,400,{error:'Invalid content update.'});
   const path='learn/data/'+name+'.json';
   let sha;try{sha=(await github(path+'?ref='+encodeURIComponent(BRANCH))).sha;}catch(e){if(e.status!==404)throw e;}
   const saved=await github(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update AMM Learning '+name+' via admin',content:Buffer.from(JSON.stringify(body.data,null,2)+'\n').toString('base64'),branch:BRANCH,...(sha?{sha}:{})})});
   return json(res,200,{ok:true,commit:saved.commit?.sha,branch:BRANCH});
  }
  if(body.action==='upload'){
   const original=String(body.name||'resource-file').toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(-100)||'resource-file';
   const mime=String(body.mime||'application/octet-stream');
   const base64=String(body.base64||'');
   if(!base64||base64.length>Math.ceil(4.2*1024*1024*4/3))return json(res,413,{error:'File is empty or exceeds the 4 MB upload limit.'});
   const buffer=Buffer.from(base64,'base64');
   if(buffer.length>3*1024*1024)return json(res,413,{error:'Maximum file size is 3 MB per upload.'});
   const allowed=['application/pdf','image/jpeg','image/png','image/webp','text/plain','text/markdown','application/zip'];
   if(!allowed.includes(mime))return json(res,415,{error:'Unsupported file type.'});
   const crypto=require('crypto');
   const path='learn/assets/uploads/'+crypto.randomUUID()+'-'+original;
   const saved=await github(path,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Upload AMM Learning resource asset: '+original,content:buffer.toString('base64'),branch:BRANCH})});
   return json(res,200,{ok:true,path:'/learn/assets/uploads/'+path.split('/').pop(),name:original,mime,size:buffer.length,commit:saved.commit?.sha});
  }
  return json(res,400,{error:'Unsupported action.'});
 }catch(error){console.error('AMM Learn admin API:',error);return json(res,error.status||500,{error:error.message||'Publishing failed.'});}
};
