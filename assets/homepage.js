
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// One-time hero typewriter on each fresh page load; no looping
const heroHeading = $('#hero-heading-text'), heroSubtitle = $('#hero-subtitle-text'), heroCursor = $('#hero-cursor'), heroTypeBox = $('#hero-type-box');
if (heroHeading && heroSubtitle && heroCursor) {
  const headingText = 'What If Work Could Do Itself?';
  const subtitleText = 'We use AI, automation and connected tools to reduce repetitive work, improve efficiency and build smarter, more cost-aware ways to get things done.';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    heroHeading.textContent = headingText;
    heroSubtitle.textContent = subtitleText;
    heroCursor.style.display = 'none';
  } else {
    let hi = 0, si = 0;
    const typeHeading = () => {
      if (hi < headingText.length) {
        heroHeading.textContent += headingText.charAt(hi++);
        if (heroTypeBox) {
          heroTypeBox.animate(
            [{filter:'brightness(1)',boxShadow:'0 .08em 0 #e8b91b'},{filter:'brightness(1.12)',boxShadow:'0 .12em 0 #e8b91b,0 0 12px #FFD83D80'},{filter:'brightness(1)',boxShadow:'0 .08em 0 #e8b91b'}],
            {duration:180,easing:'ease-out'}
          );
        }
        setTimeout(typeHeading, headingText.charAt(hi - 1) === ' ' ? 105 : 62);
      } else {
        const title = $('#hero-title');
        title.animate([{transform:'scale(1)',filter:'brightness(1)'},{transform:'scale(1.025)',filter:'brightness(1.08)'},{transform:'scale(1)',filter:'brightness(1)'}],{duration:420,easing:'ease-out'});
        title.style.textShadow = '0 0 24px #5b2ee833';
        setTimeout(() => { title.style.textShadow = 'none'; }, 650);
        setTimeout(typeSubtitle, 420);
      }
    };
    const typeSubtitle = () => {
      if (si < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(si++);
        setTimeout(typeSubtitle, subtitleText.charAt(si - 1) === ',' ? 180 : subtitleText.charAt(si - 1) === ' ' ? 38 : 19);
      } else {
        heroCursor.style.display = 'none';
      }
    };
    setTimeout(typeHeading, 350);
  }
}
// navbar blur + mobile menu
addEventListener('scroll',()=>{const n=$('#nav');n.style.background=scrollY>20?'#fafaffd9':'transparent';n.style.backdropFilter=scrollY>20?'blur(14px)':'none'});
$('#burger').onclick=e=>{const m=$('#menu');m.classList.toggle('hidden');const expanded=!m.classList.contains('hidden');e.currentTarget.setAttribute('aria-expanded',String(expanded));e.currentTarget.setAttribute('aria-label',expanded?'Close menu':'Open menu')};
$$('#menu a').forEach(a=>a.addEventListener('click',()=>{$('#menu').classList.add('hidden');$('#burger')?.setAttribute('aria-expanded','false');$('#burger')?.setAttribute('aria-label','Open menu')}));
// fade-up + counters
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));
const co=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;const el=x.target,t=+el.dataset.c;let v=0;const s=setInterval(()=>{v+=Math.ceil(t/30);if(v>=t){v=t;clearInterval(s)}el.textContent=v},35);co.unobserve(el)}),{threshold:.5});
$$('[data-c]').forEach(e=>co.observe(e));
// Approved reviews and rating summaries are rendered by AMM_APPROVED_REVIEW_RENDERER_V2 below.
const openFeedback=$('#open-feedback'),feedbackPanel=$('#feedback-panel'),feedbackForm=$('#feedback-form');
window.__ammFeedbackInteracting=false;
openFeedback.onclick=(event)=>{
 event.preventDefault();
 const keepY=window.scrollY;
 window.__ammFeedbackInteracting=true;
 feedbackPanel.classList.remove('hidden');
 openFeedback.setAttribute('aria-expanded','true');
 $('#feedback-status').textContent='';
 // Preserve the visitor's exact position while the inline form opens.
 requestAnimationFrame(()=>window.scrollTo({top:keepY,left:0,behavior:'auto'}));
 requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:keepY,left:0,behavior: 'auto'})));
};
$('#close-feedback').onclick=()=>{
 window.__ammFeedbackInteracting=false;
 feedbackPanel.classList.add('hidden');
 openFeedback.setAttribute('aria-expanded','false');
 openFeedback.focus();
};
let chosenRating=0;
const ratingNames=['','Poor','Fair','Good','Very good','Excellent'];
const starButtons=$$('#feedback-stars .feedback-star');
function setRating(n){
 chosenRating=Math.max(0,Math.min(5,Number(n)||0));
 window.ammFeedbackRating=chosenRating;
 starButtons.forEach(b=>{
  const v=Number(b.dataset.rating);
  b.classList.toggle('is-filled',v<=chosenRating&&chosenRating>0);
  b.setAttribute('aria-checked',String(v===chosenRating&&chosenRating>0));
  b.tabIndex=v===chosenRating&&chosenRating>0?0:(chosenRating===0&&v===1?0:-1);
 });
 $('#feedback-rating-label').textContent=chosenRating?chosenRating+' out of 5 — '+ratingNames[chosenRating]+'.':'Choose a rating from 1 to 5.';
 $('#feedback-rating-error').textContent='';
}
starButtons.forEach((b,i)=>{
 b.tabIndex=i===0?0:-1;
 b.addEventListener('click',()=>setRating(Number(b.dataset.rating)));
 b.addEventListener('keydown',e=>{
  if(!['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End',' ','Enter'].includes(e.key))return;
  e.preventDefault();
  let next=Number(b.dataset.rating);
  if(e.key==='ArrowRight'||e.key==='ArrowUp')next=Math.min(5,next+1);
  else if(e.key==='ArrowLeft'||e.key==='ArrowDown')next=Math.max(1,next-1);
  else if(e.key==='Home')next=1;
  else if(e.key==='End')next=5;
  setRating(next);
  starButtons[next-1].focus();
 });
});
/* Pill clicks are handled by the independent feedback script below. */
/* Feedback text is unrestricted; no character counter or length limit. */

// FAQ
$$('.faq button').forEach(b=>b.onclick=()=>{const c=b.parentElement,o=c.classList.toggle('open');b.setAttribute('aria-expanded',o);b.lastChild.textContent=o?'\u2212':'+'});// Contact form validation, spam honeypot, timeout and duplicate-submit protection
$('#cf').onsubmit=async e=>{
 e.preventDefault();
 const f=e.target,submit=f.querySelector('button[type="submit"]'),status=$('#ok');
 const n=f.elements.namedItem('name').value.trim(),m=f.elements.namedItem('email').value.trim(),g=f.elements.namedItem('message').value.trim();
 $('#en').textContent=n?'':'Enter your name.';
 $('#ee').textContent=/^\S+@\S+\.\S+$/.test(m)?'':'Enter a valid email.';
 $('#em').textContent=g?'':'Enter a message.';
 status.textContent='';
 if(!n||!/^\S+@\S+\.\S+$/.test(m)||!g)return;
 // Formspree's _gotcha field catches simple automated submissions without changing the visible form.
 if(f.elements.namedItem('_gotcha')?.value)return;
 if(submit.disabled)return;
 submit.disabled=true;submit.setAttribute('aria-busy','true');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
 try{
  const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'},signal:controller.signal});
  status.textContent=r.ok?'Thanks. We will reply soon.':'Could not send right now. Please try the email button above.';
  if(r.ok){
   if(typeof window.gtag==='function')window.gtag('event','generate_lead',{form_type:'homepage_contact'});
   f.reset();
  }
 }catch{
  status.textContent='Could not send. Please try the email button above.';
 }finally{
  clearTimeout(timeout);submit.disabled=false;submit.removeAttribute('aria-busy');
 }
};

// Slow, staged AMM workflow demo with a typed customer order and calm handoffs
(function(){
 const cards=[...document.querySelectorAll('[data-flow-stage]')];
 const typed=document.getElementById('amm-order-typed');
 const caption=document.getElementById('amm-flow-caption');
 const progress=document.getElementById('amm-flow-progress');
 const count=document.getElementById('amm-flow-count');
 const percent=document.getElementById('amm-build-percent');
 if(cards.length!==4||!typed||!caption||!progress||!count||!percent)return;
 const order='Hi AMM DS! We need a smarter way to manage customer orders and keep everything organised. Can you help us build a solution?';
 const captions=['A customer is writing a request…','The request is received. The AMM DS team starts planning.','The solution is taking shape, step by step…','The finished work is ready for the customer.'];
 const labels=['NEW REQUEST','TEAM BRIEF','IN THE MAKING','DELIVERED'];
 const durations=[4200,3400,3900,3200];
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let stage=0,runId=0,timer=null,typingTimer=null;
 function clearTimers(){if(timer)clearTimeout(timer);if(typingTimer)clearTimeout(typingTimer);timer=null;typingTimer=null}
 function typeOrder(id,index){
  if(id!==runId||stage!==0||document.hidden)return;
  typed.textContent=order.slice(0,index);
  if(index<order.length){typingTimer=setTimeout(()=>typeOrder(id,index+1),reduce?0:16)}
 }
 // Each panel waits in a calm idle state until its turn begins.
 cards.forEach((card,i)=>{
  const win=card.querySelector('.amm-window');
  if(win&&!win.querySelector('.amm-waiting-state')){
   const waiting=document.createElement('div');waiting.className='amm-waiting-state';
   waiting.innerHTML='<span class="amm-waiting-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="amm-waiting-title">WAITING FOR TASK</span><span class="amm-waiting-sub">Ready when work arrives</span>';
   win.appendChild(waiting);
  }
 });
 function sendWork(from,to){
  const a=cards[from]?.querySelector('.amm-window'),b=cards[to]?.querySelector('.amm-window'),wrap=document.querySelector('#workflow-demo .amm-workflow');
  if(!a||!b||!wrap||reduce)return;
  const wr=wrap.getBoundingClientRect(),ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
  const sx=ar.left+ar.width/2-wr.left,sy=ar.top+ar.height/2-wr.top;
  const ex=br.left+br.width/2-wr.left,ey=br.top+br.height/2-wr.top;
  const packet=document.createElement('span');packet.className='amm-transfer-packet';
  packet.style.setProperty('--packet-x',sx+'px');packet.style.setProperty('--packet-y',sy+'px');
  packet.style.setProperty('--packet-dx',(ex-sx)+'px');packet.style.setProperty('--packet-dy',(ey-sy)+'px');
  packet.style.setProperty('--packet-color',getComputedStyle(cards[from]).getPropertyValue('--stage-accent').trim()||'#7653e8');
  wrap.appendChild(packet);setTimeout(()=>packet.remove(),850);
  cards[from].classList.add('is-sending');cards[to].classList.add('is-receiving');
  setTimeout(()=>{cards[from]?.classList.remove('is-sending');cards[to]?.classList.remove('is-receiving')},760);
 }
 function setStage(next){
  const previousStage=stage;
  runId++;const id=runId;clearTimers();stage=next;
  const shouldTransfer=previousStage!==next&&previousStage<next;

  cards.forEach((card,i)=>{
   card.classList.remove('is-active','is-clearing','is-complete-stage','is-sending','is-receiving');
   if(i<next)card.classList.add('is-complete-stage');
   card.querySelector('.amm-stage-status').textContent=i===next?'WORKING':i<next?(i===3?'TRANSFER TO CONSIGNEE':'TRANSFERRED'): 'WAITING FOR TASK';
  });
  if(shouldTransfer){
   sendWork(previousStage,next);
   // Keep the page position stable on mobile; the demo advances without scrolling the website.
  }
  const active=cards[next];active.classList.add('is-active');
  caption.textContent=captions[next];
  progress.style.width=((next+1)*25)+'%';
  count.textContent='STAGE 0'+(next+1)+' / 04';
  if(next===0){
   typed.textContent='';
   if(reduce){typed.textContent=order}else typeOrder(id,1);
  }
  if(next===1){
   cards[1].querySelectorAll('[data-task]').forEach((row,i)=>{row.classList.remove('is-complete');if(!reduce)setTimeout(()=>{if(id===runId)row.classList.add('is-complete')},700+i*1050);else row.classList.add('is-complete')});
  }
  if(next===2){
   percent.textContent='0%';
   if(reduce)percent.textContent='100%';
   else{
    const start=performance.now(),duration=3000;
    const tick=(now)=>{if(id!==runId||stage!==2)return;const p=Math.min(1,(now-start)/duration);percent.textContent=Math.round(p*100)+'%';if(p<1)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
   }
  }
  if(next===3){
   timer=setTimeout(()=>{
    if(id!==runId)return;
    active.classList.remove('is-active');active.classList.add('is-complete-stage');
    active.querySelector('.amm-stage-status').textContent='TRANSFER TO CONSIGNEE';
    caption.textContent='The completed work is handed over to the client.';
    timer=setTimeout(()=>{if(id===runId)setStage(0)},reduce?0:1100);
   },reduce?durations[next]:durations[next]);
  }else{
   timer=setTimeout(()=>{if(id===runId)setStage(next+1)},reduce?durations[next]:durations[next]);
  }
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimers()}else{setStage(stage)}});
 setStage(0);
 window.__ammWorkflowController = true;
})();



;

/* AMM service cards: stable delegated interaction, independent of card re-renders. */
(function(){
 'use strict';
 const data=[{"title":"AI Automation for Business & Everyday Work","short":"AI-powered workflows, tool integrations & less repetitive work","detail":"Identify repetitive tasks and design practical workflows using AI, supported integrations or simpler rules where they are more suitable. Projects are scoped around real tasks, available tools, permissions, testing and human review where needed.","items":["Identify and map repeatable tasks","AI-assisted drafting, summaries and information sorting","Connect supported apps and approved data sources","Automate suitable steps and route tasks","Define safeguards, exceptions and human approvals","Test, document and hand over the workflow"],"page":"/services/ai-automation-business-everyday-work.html"},{"title":"Google SEO + AI SEO","short":"Search visibility, AEO/GEO foundations & audit reports","detail":"Improve the foundations that help search engines understand your website and visitors understand your offer. Work can cover technical SEO, on-page content, indexing checks and relevant AI-search readiness, without promising rankings.","items":["Technical SEO, crawlability and indexing checks","Titles, descriptions, headings and internal links","Sitemap and Search Console review where access is available","Content structure for Google and AI search experiences","AEO/GEO-oriented content clarity where relevant","Written audit report with prioritized recommendations"],"page":"/services/google-seo-ai-search-visibility.html"},{"title":"Digital Advertising","short":"Google, Meta & TikTok campaign planning and management","detail":"Plan and manage paid campaigns around your offer, audience and campaign objective. Scope can include Google Ads, Meta Ads and eligible TikTok campaigns, with tracking checks and reporting based on available access.","items":["Campaign goals, audience and budget planning","Google Ads setup and management","Meta Ads for Facebook and Instagram","TikTok Ads where the account and market are eligible","Landing-page and conversion tracking readiness checks","Performance reporting and optimization"],"page":"/services/digital-advertising.html"},{"title":"AI Chatbots & Intelligent Agents","short":"Website chatbots, business assistants, task-focused agents & human review","detail":"Build AI chatbots, knowledge assistants and task-focused intelligent agents for customer conversations and defined business tasks. Solutions can answer approved questions, capture leads, retrieve information, draft and summarize content, classify requests and connect supported tools. Permissions, safeguards, testing and human review are agreed for each project.","items":["Website FAQ and service-information bots","Lead generation and qualification flows","Appointment requests with supported calendar access","Product guidance using an available catalogue","Customer support and order-help flows where integrations permit","Business knowledge assistants using approved documents","Use-case discovery and agent task definition","AI assistants for approved information and knowledge tasks","Connections to supported tools and approved data sources","Drafting, summarization, classification and structured task support","Permission checks, output testing, exception handling and quality review","Usage guidance, documentation and handover"],"botCategories":[{"title":"Website FAQ & Service Bot","description":"Answers common questions about services, policies, processes and approved business information."},{"title":"Lead Generation & Qualification Bot","description":"Asks relevant enquiry questions, gathers lead details and routes requests to your team."},{"title":"Appointment & Booking Bot","description":"Helps visitors request appointments or book available slots when connected to a supported calendar."},{"title":"Product Recommendation & Shopping Bot","description":"Guides shoppers through an available product catalogue based on their stated needs."},{"title":"Customer Support & Order Help Bot","description":"Explains support policies and helps with order questions; live order status requires a suitable system integration."},{"title":"Business Knowledge Assistant","description":"Answers staff or customer questions using approved company documents, FAQs and knowledge resources."},{"title":"Task-Focused AI Agent","description":"Supports a clearly defined task such as preparing structured drafts, organizing information or following an approved workflow."},{"title":"Research & Knowledge Assistant","description":"Finds and summarizes information from approved business documents and connected knowledge sources."},{"title":"Content & Document Assistant","description":"Helps prepare, classify and organize business content for human review."},{"title":"Connected Workflow Assistant","description":"Uses supported integrations to assist with defined steps while respecting permissions and approval rules."}],"page":"/services/ai-chatbots-customer-support.html"},{"title":"Website Development & Improvement","short":"New websites, responsive updates, fixes & useful features","detail":"Plan and build a practical business website or improve an existing one around your goals, customers and day-to-day operations. Scope can include responsive pages, landing pages, navigation, content, technical fixes, useful functionality and suitable AI integrations.","items":["New business websites and landing pages","Responsive layouts for mobile and desktop","Content, page structure and navigation improvements","Technical fixes and agreed performance improvements","Contact forms and useful website functionality","Suitable AI chatbot and workflow integrations"],"page":"/services/website-development-improvement.html"},{"title":"Data Management & Data Entry","short":"Data entry, cleanup, spreadsheet organization & checks","detail":"Organize business information with agreed data-entry and data-management tasks. Work can include spreadsheet updates, document-to-sheet processing, cleanup, formatting, duplicate checks and structured Excel or CSV delivery.","items":["Manual data entry and spreadsheet updates","PDF, CSV and Excel data organization where supported","Data cleaning, formatting and duplicate checks","Missing-field and agreed-rule validation","Organized Excel or CSV output","Quality notes and concise delivery summaries"],"page":"/services/data-management-data-entry.html"},{"title":"Creative Design & Digital Content","short":"Social graphics, campaign visuals & branded digital assets","detail":"Create consistent, purposeful visual content for your brand and digital channels. Design assets are developed around your message, audience, platform requirements and agreed project scope.","items":["Social media post and campaign graphics","Digital banners, promotional visuals and branded layouts","Presentation slides and business communication assets","Reusable templates and visual content formats","Brand consistency, layout and readability checks","Platform-ready exports and organized handover files"],"page":"/services/creative-design-digital-content.html"}];
 const style=document.createElement('style');
 style.textContent='.amm-service-page-link{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 17px;border:1px solid #d9d0f2;border-radius:999px;background:#fff;color:#4b2ab8;font-size:14px;font-weight:750;text-decoration:none}.amm-service-page-link:hover{background:#f7f3ff;border-color:#bcaaf2}.amm-service-detail-grid{display:block!important;margin-top:20px!important}.amm-service-detail-main{width:100%;min-width:0}.amm-service-detail-list{margin:0;padding-left:20px}.amm-service-detail-list li{margin-bottom:10px;line-height:1.55}.amm-service-back .amm-service-detail-grid h3{margin-bottom:12px}'+'.amm-bot-category{display:flex;flex-direction:column;gap:4px;margin:0 0 14px;padding-left:0;list-style:none}.amm-bot-category strong{color:#211b35;font-size:14px;line-height:1.4}.amm-bot-category span{color:#625d72;font-size:13px;line-height:1.55}.amm-service-detail-list:has(.amm-bot-category){padding-left:0}'+'.amm-service-overlay{position:fixed!important;inset:0!important;z-index:2147483000!important;display:flex!important;align-items:center;justify-content:center;padding:16px;background:rgba(17,13,34,.64);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .48s ease,visibility .48s ease;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}.amm-service-overlay.is-open{opacity:1!important;visibility:visible!important;pointer-events:auto!important}.amm-service-overlay.is-closing{opacity:0!important;visibility:hidden!important;pointer-events:none!important}.amm-service-overlay .amm-service-dialog{position:relative!important;left:auto!important;top:auto!important;transform:none!important;transform-origin:center center;width:min(900px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:visible;opacity:0;transition:opacity .38s ease!important}.amm-service-overlay.is-open .amm-service-dialog{transform:none!important;opacity:1}.amm-service-overlay.is-closing .amm-service-dialog{transform:none!important;opacity:0;transition:opacity .38s ease!important}.amm-service-overlay .amm-service-back{display:block!important;position:relative!important;max-height:calc(100dvh - 32px);overflow:auto!important;background:#fff!important;pointer-events:auto}.amm-service-overlay .amm-service-close{position:absolute!important;right:14px!important;top:14px!important;z-index:20!important;cursor:pointer;pointer-events:auto}@media(max-width:640px){.amm-service-overlay{padding:10px!important}.amm-service-overlay .amm-service-dialog{width:calc(100vw - 20px);max-height:calc(100dvh - 20px)}.amm-service-overlay .amm-service-back{max-height:calc(100dvh - 20px);padding:22px 18px}}.amm-service-card.rv{opacity:1!important;visibility:visible!important;transform:none!important;pointer-events:auto!important;animation:none!important}.amm-service-card{position:relative;cursor:pointer!important;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.amm-service-card *{pointer-events:none}';
 document.head.appendChild(style);
 const overlay=document.createElement('div');
 overlay.className='amm-service-overlay';
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','AMM DS service details');
 overlay.innerHTML='<div class="amm-service-dialog"><button type="button" class="amm-service-close" aria-label="× Close service details">×</button><div class="amm-service-flipper"><section class="amm-service-face amm-service-front" aria-hidden="true"><div><span class="text-xs font-bold tracking-widest" style="color:#5b2ee8">AMM DATA SOLUTIONS</span><h2 class="f font-extrabold mt-5" style="font-size:clamp(30px,5vw,54px);line-height:1.08;color:#171329"></h2><p class="mt-4 text-lg" style="color:#625d72"></p></div><p class="text-sm font-semibold" style="color:#5b2ee8">Turning business needs into practical solutions ↗</p></section><section class="amm-service-face amm-service-back"><div class="h-1.5 absolute top-0 left-0 right-0" style="background:linear-gradient(90deg,#5b2ee8,#d6f25b)"></div><span class="text-xs font-bold tracking-widest" style="color:#5b2ee8">AMM SERVICE OVERVIEW</span><h2 class="f font-extrabold mt-3 pr-10" style="font-size:clamp(26px,4vw,38px);line-height:1.15;color:#171329"></h2><p class="mt-4 text-sm sm:text-base leading-relaxed" style="color:#625d72"></p><div class="amm-service-detail-grid mt-5"><div class="amm-service-detail-main"><h3 class="f font-bold text-base mb-3" style="color:#171329">What this can include</h3><ul class="amm-service-detail-list"></ul></div></div><div class="amm-service-detail-footer"><h3 class="f font-bold text-base mt-6" style="color:#171329">Built around your business</h3><p class="mt-2 text-sm sm:text-base leading-relaxed" style="color:#625d72">We agree the scope, tools and priorities with you first, then shape a practical solution around your goals. Deliverables depend on your requirements and the agreed project scope.</p><div class="mt-5 flex flex-wrap gap-3"><a class="amm-service-page-link" href="/services/ai-chatbots-customer-support.html">View full service details <span aria-hidden="true" style="margin-left:8px">↗</span></a><a class="amm-service-cta" href="mailto:ammdatasolutions229@gmail.com?subject=AMM%20Service%20Enquiry">Discuss this service <span aria-hidden="true" style="margin-left:8px">↗</span></a></div></div></section></div></div>';
 document.body.appendChild(overlay);
 const dialog=overlay.querySelector('.amm-service-dialog'),close=overlay.querySelector('.amm-service-close');
 let activeIndex=-1,lastCard=null;
 function cards(){return document.querySelectorAll('[data-service-index]')}
 function show(i,card){
  const item=data[i];if(!item)return;
  if(activeIndex===i&&overlay.classList.contains('is-open')){hide();return}
  activeIndex=i;lastCard=card||lastCard;
  const fronts=overlay.querySelectorAll('.amm-service-front');
  fronts[0].querySelector('h2').textContent=item.title;
  fronts[0].querySelector('p').textContent=item.short;
  const back=overlay.querySelector('.amm-service-back');
  back.querySelector('h2').textContent=item.title;
  back.querySelector('p').textContent=item.detail;back.querySelector('.amm-service-page-link').href=item.page;
  const list=back.querySelector('.amm-service-detail-list');list.replaceChildren();
  const listHeading=back.querySelector('.amm-service-detail-grid h3');listHeading.textContent=item.botCategories?'Six chatbot options':'What this can include';if(item.botCategories){item.botCategories.forEach(bot=>{const li=document.createElement('li');li.className='amm-bot-category';const title=document.createElement('strong');title.textContent=bot.title;const description=document.createElement('span');description.textContent=bot.description;li.append(title,description);list.appendChild(li)});}else{item.items.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.appendChild(li)});}
  clearTimeout(closeTimer);
  overlay.classList.remove('is-closing');
  overlay.classList.add('is-open');
  document.body.style.overflow='hidden';
  cards().forEach(c=>c.setAttribute('aria-expanded',String(c===lastCard)));
 }
 let closeTimer=0;
 function hide(){
  if(!overlay.classList.contains('is-open'))return;
  overlay.classList.remove('is-open');overlay.classList.add('is-closing');
  clearTimeout(closeTimer);
  closeTimer=setTimeout(()=>{overlay.classList.remove('is-closing');document.body.style.overflow='';},390);
  cards().forEach(c=>c.setAttribute('aria-expanded','false'));
  activeIndex=-1;
 }
 document.addEventListener('click',function(e){
  const card=e.target&&e.target.closest?e.target.closest('[data-service-index]'):null;
  if(card&&document.contains(card)){
   const i=Number(card.getAttribute('data-service-index'));
   if(Number.isInteger(i)&&i>=0&&i<data.length){e.preventDefault();show(i,card)}
  }
 },true);
 close.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();hide()});
 overlay.addEventListener('click',function(e){if(e.target===overlay)hide()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.classList.contains('is-open'))hide()});
 cards().forEach(c=>{c.setAttribute('aria-haspopup','dialog');c.setAttribute('aria-expanded','false');if(c.tagName!=='BUTTON'&&c.tagName!=='A')c.setAttribute('tabindex','0')});
 document.addEventListener('keydown',function(e){
  const card=e.target&&e.target.closest?e.target.closest('[data-service-index]'):null;
  if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();show(Number(card.getAttribute('data-service-index')),card)}
 });
})();

;

/* Feedback rating state bridge for mouse, touch and keyboard */
(function(){
 function sync(n){
  const value=Math.max(1,Math.min(5,Number(n)||1));
  window.ammFeedbackRating=value;
  const wrap=document.getElementById('feedback-stars');
  if(!wrap)return;
  wrap.querySelectorAll('.feedback-star').forEach(function(star){
   const v=Number(star.dataset.rating);
   star.classList.toggle('is-filled',v<=value);
   star.setAttribute('aria-checked',String(v===value));
   star.tabIndex=v===value?0:-1;
  });
  const names=['','Poor','Fair','Good','Very good','Excellent'];  const label=document.getElementById('feedback-rating-label');
  const error=document.getElementById('feedback-rating-error');
  if(label)label.textContent=value+' out of 5 — '+names[value]+'.';
  if(error)error.textContent='';
 }
 window.setAMMFeedbackRating=sync;
 document.addEventListener('click',function(e){
  const star=e.target&&e.target.closest?e.target.closest('#feedback-stars .feedback-star'):null;
  if(star)sync(star.dataset.rating);
 },true);
})();
;

/* Independent safety net: keep the AMM workflow demo animated if the main page script fails early. */
(function(){
  if(window.__ammWorkflowController) return;
  const root=document.querySelector('#workflow-demo .amm-workflow');
  if(!root) return;
  const cards=[...root.querySelectorAll('[data-flow-stage]')];
  const typed=document.getElementById('amm-order-typed');
  const caption=document.getElementById('amm-flow-caption');
  const progress=document.getElementById('amm-flow-progress');
  const count=document.getElementById('amm-flow-count');
  const percent=document.getElementById('amm-build-percent');
  if(cards.length!==4) return;
  const order='Hi AMM DS! We need a smarter way to manage customer orders and keep everything organised. Can you help us build a solution?';
  const captions=['A customer is writing a request…','The request is received. The AMM DS team starts planning.','The solution is taking shape, step by step…','The finished work is ready for the customer.'];
  const statuses=['NEW REQUEST','TEAM BRIEF','IN THE MAKING','DELIVERED'];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stage=0, timer=0, typing=0, generation=0;
  function activate(next){
    const previousStage=stage;
    generation++;
    const id=generation;
    clearTimeout(timer);clearTimeout(typing);
    stage=next;
    cards.forEach((card,i)=>{
      card.classList.toggle('is-active',i===next);
      card.classList.toggle('is-complete-stage',i<next);
      const status=card.querySelector('.amm-stage-status');
      if(status) status.textContent=i===next?'WORKING':i<next?'COMPLETED':'WAITING FOR TASK';
      card.querySelectorAll('[data-task]').forEach((row,j)=>row.classList.toggle('is-complete',i===1&&j<3));
    });
    // Deliberately do not scroll the page as the live demo changes stages.
    if(caption) caption.textContent=captions[next];
    if(progress) progress.style.width=((next+1)*25)+'%';
    if(count) count.textContent='STAGE 0'+(next+1)+' / 04';
    if(typed){
      typed.textContent='';
      if(next===0){
        if(reduced){typed.textContent=order}
        else {
          let n=0;
          const type=()=>{if(id!==generation||stage!==0)return;typed.textContent=order.slice(0,n++);if(n<=order.length)typing=setTimeout(type,22)};
          type();
        }
      }
    }
    if(percent) percent.textContent=next===2?'100%':'0%';
    timer=setTimeout(()=>activate((next+1)%4),reduced?4200:4200);
  }
  window.__ammWorkflowFallback=true;
  activate(0);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)activate(stage)});
})();

;

/* Keep header contact CTAs pointed directly at the contact section, below the sticky navbar. */
document.querySelectorAll('#nav a[href="#business-cta"]').forEach(link=>{
  link.addEventListener('click',event=>{
    const targetSection=document.getElementById('business-cta');
    if(!targetSection)return;
    event.preventDefault();
    document.getElementById('menu')?.classList.add('hidden');
    document.getElementById('burger')?.setAttribute('aria-expanded','false');
    document.getElementById('burger')?.setAttribute('aria-label','Open menu');
    targetSection.scrollIntoView({
      behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
      block:'start'
    });
    if(location.hash!=='#business-cta') history.replaceState(null,'','#business-cta');
  });
});

;

/* Always start at the website header on a fresh load or reload. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => {
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

;

/* Hide the revealed contact email when the user clicks anywhere outside it. */
(() => {
  const emailDetails = document.getElementById('contact-email-details');
  if (!emailDetails) return;
  document.addEventListener('click', event => {
    if (emailDetails.open && !emailDetails.contains(event.target)) {
      emailDetails.open = false;
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && emailDetails.open) emailDetails.open = false;
  });
})();

;

/* Standalone feedback submission handler: independent of the main page script. */
(function(){
 'use strict';
 const form=document.getElementById('feedback-form');
 if(!form || form.dataset.ammSubmitReady==='true') return;
 form.dataset.ammSubmitReady='true';
 const byId=id=>document.getElementById(id);
 // Independent fallback: open the inline feedback form if its primary handler did not run.
 if(!document.documentElement.dataset.ammFeedbackOpenFallback){
  document.documentElement.dataset.ammFeedbackOpenFallback='true';
  document.addEventListener('click',function(event){
   const trigger=event.target&&event.target.closest?event.target.closest('#open-feedback'):null;
   const panel=byId('feedback-panel');
   if(!trigger||!panel||!panel.classList.contains('hidden'))return;
   const keepY=window.scrollY;
   panel.classList.remove('hidden');
   trigger.setAttribute('aria-expanded','true');
   window.__ammFeedbackInteracting=true;
   requestAnimationFrame(()=>window.scrollTo({top:keepY,left:0,behavior: 'auto'}));
  },true);
 }
 const status=byId('feedback-status');
 const submit=form.querySelector('button[type="submit"]');
 const setError=(id,message)=>{const el=byId(id);if(el)el.textContent=message;};
 let successMessageTimer=0;
 const stars=[...form.querySelectorAll('#feedback-stars .feedback-star')];
 const pills=[...form.querySelectorAll('#feedback-positive .feedback-pill, #feedback-improvements .feedback-pill')];
 const feedbackText=byId('feedback-review');
 const updatePillMessage=()=>{
  const selected=pills.filter(p=>p.getAttribute('aria-pressed')==='true').map(p=>p.textContent.trim());
  if(feedbackText)feedbackText.value=selected.join(' — ');
  const err=byId('feedback-review-error');if(err)err.textContent='';
 };
 pills.forEach(pill=>pill.addEventListener('click',event=>{
  event.preventDefault();
  const pressed=pill.getAttribute('aria-pressed')==='true';
  pill.setAttribute('aria-pressed',String(!pressed));
  if(pill.textContent.trim()==='Everything was good'&&!pressed){
   pills.filter(p=>p.closest('#feedback-improvements')).forEach(p=>p.setAttribute('aria-pressed','false'));
  }
  if(pill.closest('#feedback-improvements')&&!pressed){
   const allGood=pills.find(p=>p.textContent.trim()==='Everything was good');
   if(allGood)allGood.setAttribute('aria-pressed','false');
  }
  updatePillMessage();
 },true));
 form.addEventListener('submit',async function(event){
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  clearTimeout(successMessageTimer);
  window.__ammFeedbackInteracting=true;
  if(!status||!submit)return;
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  const name=(byId('feedback-name')?.value||'').trim();
  const business=(byId('feedback-business')?.value||'').trim();
  const typedReview=(byId('feedback-review')?.value||'').trim();
  const selectedPills=pills.filter(p=>p.getAttribute('aria-pressed')==='true').map(p=>p.textContent.trim());
  const message=(typedReview||selectedPills.join(' — ')).trim();
  const rating=Number(stars.find(s=>s.getAttribute('aria-checked')==='true')?.dataset.rating||window.ammFeedbackRating||0);
  submit.disabled=true;
  submit.setAttribute('aria-busy','true');
  status.textContent='Sending your feedback…';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch('https://yvfumgrywsqhsvjfnmzu.supabase.co/rest/v1/review_feedback_submissions',{
    method:'POST',
    headers:{
     'Content-Type':'application/json',
     'apikey':'sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk',
     'Prefer':'return=minimal'
    },
    body:JSON.stringify({submission_type:'review',display_name:name||null,business:business||null,rating:rating||null,message:message,status:'pending'}),
    signal:controller.signal
   });
   if(!response.ok){
    const detail=await response.text().catch(()=> '');
    console.error('AMM feedback API response:',response.status,detail);
    if(response.status===401||response.status===403)throw new Error('The feedback service rejected access. Please try again later.');
    if(response.status===400)throw new Error('Please check the feedback details and try again.');
    throw new Error('Feedback could not be saved (HTTP '+response.status+'). Please try again.');   }
   form.reset();
   stars.forEach(s=>{s.setAttribute('aria-checked','false');s.classList.remove('is-filled');s.tabIndex=-1;});
   if(stars[0])stars[0].tabIndex=0;
   window.ammFeedbackRating=0;
   const ratingLabel=byId('feedback-rating-label');if(ratingLabel)ratingLabel.textContent='Add a star rating if you want, or leave it blank.';
   pills.forEach(p=>p.setAttribute('aria-pressed','false'));
   byId('feedback-preview')?.classList.add('hidden');
   status.textContent='Thank you for your feedback';
   status.style.color='#166534';
   status.style.fontWeight='700';
   status.setAttribute('tabindex','-1');
   status.focus({preventScroll:true});
   successMessageTimer=window.setTimeout(()=>{status.textContent='';status.style.color='';status.style.fontWeight='';status.removeAttribute('tabindex');},3000);
  }catch(error){
   console.error('AMM feedback submission failed:',error);
   status.textContent=error?.name==='AbortError'
    ?'The request timed out. Please check your connection and try again.'
    :(error instanceof Error?error.message:'Your feedback could not be sent. Please check your connection and try again.');
  }finally{
   clearTimeout(timeout);
   submit.disabled=false;
   submit.removeAttribute('aria-busy');
  }
 },true);
})();

;

/* AMM_APPROVED_REVIEW_RENDERER_V2: independent approved-review renderer */
(function(){
  const endpoint='https://yvfumgrywsqhsvjfnmzu.supabase.co/rest/v1/review_feedback_submissions?select=display_name,business,rating,message&submission_type=eq.review&status=eq.approved&order=created_at.desc&limit=100';
  const apiKey='sb_publishable_n18tAZZZWSJtnNC_umyZcw_HQH5zYpk';
  const $=id=>document.getElementById(id);
  let rows=[],index=0;
  function render(){
    const target=$('tq'); if(!target)return;
    target.replaceChildren();
    if(!rows.length){
      const note=document.createElement('p');
      note.className='mt-4';
      note.textContent='No approved feedback is available to display yet.';
      target.appendChild(note);
    } else {
      const row=rows[index];
      if(Number(row.rating)>=1&&Number(row.rating)<=5){
        const stars=document.createElement('p');
        stars.className='feedback-preview-stars mt-4';
        stars.textContent='★'.repeat(Number(row.rating))+'☆'.repeat(5-Number(row.rating));
        stars.setAttribute('aria-label',Number(row.rating)+' out of 5 stars');
        target.appendChild(stars);
      }
      if(typeof row.message==='string'&&row.message.trim()){
        const quote=document.createElement('p');
        quote.className='text-xl md:text-2xl font-bold mt-4';
        quote.style.cssText='overflow-wrap:anywhere;max-width:100%;line-height:1.5';
        quote.textContent='“'+row.message.trim()+'”';
        target.appendChild(quote);
      } else {
        const quote=document.createElement('p');
        quote.className='text-xl md:text-2xl font-bold mt-4';
        quote.textContent='Shared a rating without a written comment.';
        target.appendChild(quote);
      }
      const name=document.createElement('p');
      name.className='mt-4 font-semibold';
      name.textContent=(row.display_name&&row.display_name.trim())?row.display_name.trim():'Anonymous';
      target.appendChild(name);
      if(row.business&&row.business.trim()){
        const business=document.createElement('p');
        business.className='text-sm mt-1';
        business.style.color='var(--muted)';
        business.textContent=row.business.trim();
        target.appendChild(business);
      }
    }
    target.style.cssText+=';display:block!important;visibility:visible!important;opacity:1!important;min-height:80px';
    const prev=$('tp'),next=$('tn');
    if(prev){prev.hidden=rows.length<2;prev.disabled=rows.length<2;}
    if(next){next.hidden=rows.length<2;next.disabled=rows.length<2;}
  }
  async function load(){
    const target=$('tq'); if(!target)return;
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(endpoint,{headers:{apikey:apiKey,'Accept':'application/json'},cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data))throw new Error('Unexpected response');
      rows=data.filter(r=>((typeof r.message==='string'&&r.message.trim())||(Number(r.rating)>=1&&Number(r.rating)<=5)));
      index=0;render();
      const score=$('feedback-average-score'),stars=$('feedback-average-stars'),count=$('feedback-average-count');
      const ratings=rows.map(r=>Number(r.rating)).filter(n=>Number.isFinite(n)&&n>=1&&n<=5);
      if(score&&stars&&count){
        if(ratings.length){
          const avg=ratings.reduce((a,b)=>a+b,0)/ratings.length;
          score.textContent=avg.toFixed(1)+' / 5';
          stars.textContent='★'.repeat(Math.round(avg))+'☆'.repeat(5-Math.round(avg));
          count.textContent=ratings.length+' approved '+(ratings.length===1?'rating':'ratings')+' overall';
        }else{
          score.textContent='—';stars.textContent='☆☆☆☆☆';count.textContent='No approved ratings yet';
        }
      }
    }catch(err){
      const count=$('feedback-average-count');
      if(count)count.textContent='Reviews are temporarily unavailable.';
      const target=$('tq');
      if(target && !rows.length){
        target.replaceChildren();
        const note=document.createElement('p');
        note.className='mt-4 text-sm';
        note.style.color='var(--muted)';
        note.textContent='Reviews are temporarily unavailable. Please try again later.';
        target.appendChild(note);
      }
    }finally{
      clearTimeout(timeout);
    }
  }
  function step(delta){if(rows.length<2)return;index=(index+delta+rows.length)%rows.length;render();}
  // Script is at the end of the document; load once to avoid duplicate requests.
  load();
  const prev=$('tp'),next=$('tn');
  if(prev)prev.addEventListener('click',()=>step(-1));
  if(next)next.addEventListener('click',()=>step(1));
  // Rotate reviews automatically without scrolling the page; pause when the visitor is interacting.
  let rotationTimer=null;
  function startRotation(){if(rotationTimer!==null)return;rotationTimer=setInterval(()=>{if(rows.length<2||document.hidden)return;const section=$('feedback');const card=section&&section.querySelector('.card');if(card&&(card.matches(':hover')||card.contains(document.activeElement)))return;step(1);},5000);}
  startRotation();
})();

;

(function () {
  'use strict';
  const label = /^ask\\s+amm$/i;
  function removeAskAmmLauncher() {
    const candidates = document.querySelectorAll('button,a,[role="button"],iframe,[aria-label],[title]');
    candidates.forEach(function (node) {
      const text = (node.innerText || node.textContent || '').trim();
      const aria = (node.getAttribute('aria-label') || '').trim();
      const title = (node.getAttribute('title') || '').trim();
      const isMatch = label.test(text) || label.test(aria) || label.test(title);
      if (!isMatch) return;
      let target = node;
      if (node.tagName === 'IFRAME') {
        target = node;
      } else {
        let parent = node;
        for (let i = 0; i < 4 && parent && parent !== document.body; i++, parent = parent.parentElement) {
          const style = window.getComputedStyle(parent);
          if (style.position === 'fixed' || style.position === 'sticky') { target = parent; break; }
        }
      }
      target.remove();
    });
  }
  removeAskAmmLauncher();
  const observer = new MutationObserver(removeAskAmmLauncher);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'title'] });
})();
