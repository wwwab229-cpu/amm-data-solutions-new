/* AMM Data Solutions custom web assistant. Chat history stays in this tab only. */
(function(){
  'use strict';
  if(document.getElementById('amm-webbot-root')) return;
  const API_ENDPOINT='https://yvfumgrywsqhsvjfnmzu.supabase.co/functions/v1/amm-webbot';
  const root=document.createElement('div');
  root.id='amm-webbot-root';
  root.innerHTML=`
    <div id="amm-webbot-tip" hidden role="status"><span id="amm-webbot-tip-text"></span><button id="amm-webbot-tip-dismiss" type="button" aria-label="Dismiss tip">×</button></div>
    <button id="amm-webbot-launcher" type="button" aria-expanded="false" aria-controls="amm-webbot-panel" aria-label="Open AMM AI assistant"><span class="amm-bot-dot" aria-hidden="true"></span><span>Ask AMM</span></button>
    <section id="amm-webbot-panel" role="dialog" aria-modal="false" aria-labelledby="amm-webbot-heading" hidden>
      <header id="amm-webbot-header"><div><h2 id="amm-webbot-heading">AMM AI Assistant</h2><p id="amm-webbot-subheading">Ask about our services and next steps.</p></div><button id="amm-webbot-close" type="button" aria-label="Close chat">×</button></header>
      <div id="amm-webbot-tools"><label for="amm-webbot-language" class="amm-webbot-visually-hidden">Chat language</label><select id="amm-webbot-language" aria-label="Chat language"><option value="auto">Auto-detect language</option><option value="en">English</option><option value="roman-urdu">Roman Urdu</option><option value="hi">Hindi</option><option value="ar">العربية — Arabic</option></select><span id="amm-webbot-status" role="status">Ready</span></div>
      <div id="amm-webbot-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div id="amm-webbot-quick-prompts"><button type="button" data-prompt="What services does AMM offer?">Our services</button><button type="button" data-prompt="What are your starting prices?">Starting prices</button><button type="button" data-prompt="How can I discuss a project with AMM?">Discuss a project</button></div>
      <form id="amm-webbot-form"><textarea id="amm-webbot-input" rows="1" maxlength="500" required placeholder="Type your question…" aria-label="Your question"></textarea><button id="amm-webbot-send" type="submit" aria-label="Send message">➤</button></form>
      <p id="amm-webbot-privacy">Please don’t share passwords or sensitive personal information. Chat messages are kept only in this tab; a small session preference remembers dismissed tips.</p>
    </section>`;
  document.body.appendChild(root);
  const panel=root.querySelector('#amm-webbot-panel'),launcher=root.querySelector('#amm-webbot-launcher'),close=root.querySelector('#amm-webbot-close');
  const messages=root.querySelector('#amm-webbot-messages'),form=root.querySelector('#amm-webbot-form'),input=root.querySelector('#amm-webbot-input');
  const send=root.querySelector('#amm-webbot-send'),status=root.querySelector('#amm-webbot-status'),language=root.querySelector('#amm-webbot-language');
  const history=[];
  const tip=root.querySelector('#amm-webbot-tip'),tipText=root.querySelector('#amm-webbot-tip-text'),tipDismiss=root.querySelector('#amm-webbot-tip-dismiss');
  let tipShown=false, scrollTipTimer=null;
  const path=window.location.pathname.toLowerCase();
  function getGuidance(){
    if(path.includes('ai-chatbots'))return ['Want to see what an AI chatbot can do? 🤖','Ask me about customer support, lead capture, or multilingual bots.'];
    if(path.includes('ai-business-automation'))return ['Less repetitive work, more time for business ✨','I can explain how automation may fit your workflow.'];
    if(path.includes('google-seo'))return ['Curious how customers find you online? 🔎','Ask me about Google SEO and AI search visibility.'];
    if(path.includes('digital-advertising'))return ['Planning your next campaign? 📣','I can explain our ad service and what details matter.'];
    if(path.includes('data-management'))return ['Messy spreadsheets? We can help tidy the data 📊','Ask about data entry, cleanup, and quality checks.'];
    if(path.includes('website-design'))return ['Thinking about a website refresh? ✨','I can guide you through website and digital-solution options.'];
    if(path.includes('pricing'))return ['Need help understanding starting prices? 💡','Tap me and I’ll explain estimates versus a final quote.'];
    if(path.includes('privacy'))return ['Have a question about sharing information? 🔒','I can explain what to avoid sharing in this chat.'];
    const headings=Array.from(document.querySelectorAll('main h1, main h2, section h1, section h2')).map(el=>(el.textContent||'').trim().toLowerCase());
    if(headings.some(h=>/contact|need a solution|talk to/.test(h)))return ['Ready to talk through an idea? 💬','I can help you figure out what to discuss with AMM.'];
    if(headings.some(h=>/service|what we do|solutions/.test(h)))return ['Not sure which service fits? 👀','Tell me your goal and I’ll help narrow down the options.'];
    return ['Exploring AMM Data Solutions? 👋','I can guide you through services, starting prices, and next steps.'];
  }
  function showTip(){
    if(tipShown||!panel.hidden||sessionStorage.getItem('ammBotTipsDismissed')==='1')return;
    const key='ammBotTipSeen:'+path;
    if(sessionStorage.getItem(key)==='1')return;
    const tips=getGuidance();
    tipText.textContent=tips[Math.min(Math.floor(window.scrollY/850),tips.length-1)];
    tip.hidden=false;tipShown=true;sessionStorage.setItem(key,'1');
  }
  function dismissTip(){tip.hidden=true;sessionStorage.setItem('ammBotTipsDismissed','1');}
  tipDismiss.addEventListener('click',dismissTip);
  window.addEventListener('scroll',()=>{
    if(tipShown||!panel.hidden||window.scrollY<180)return;
    if(scrollTipTimer)clearTimeout(scrollTipTimer);
    scrollTipTimer=setTimeout(showTip,450);
  },{passive:true});
  const services=[
    ['AI & Business Automation','$150','Workflow assessment, supported integrations, task routing, notifications, error handling and testing.'],
    ['AI Chatbots & Customer Support','$170','Website FAQ bots, lead qualification, customer-support flows, booking/product guidance where supported, and human handoff.'],
    ['Google SEO & AI Search Visibility','$140','Technical and on-page SEO, indexing checks, content clarity for AI search, and a prioritized audit report.'],
    ['Digital Advertising','$140','Google Ads, Meta Ads and TikTok Ads campaign planning/setup where eligible, tracking readiness, reporting and optimization.'],
    ['Website Design & Digital Solutions','$200','Responsive websites and landing pages, enquiry forms, mobile usability and launch-readiness checks.'],
    ['Data Management & Data Entry','$15','Data entry, spreadsheet cleanup, formatting, duplicate/missing-field checks and structured Excel/CSV delivery.']
  ];
  function addMessage(text,who){
    const el=document.createElement('div');el.className='amm-bot-message '+who;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el;
  }
  function greeting(){
    const lang=language.value;
    if(lang==='roman-urdu')return 'Assalam-o-alaikum! Main AMM Data Solutions ka assistant hoon. Aap services, starting prices ya apne project ke bare mein pooch sakte hain.';
    if(lang==='hi')return 'नमस्ते! मैं AMM Data Solutions का सहायक हूँ। आप हमारी सेवाओं, शुरुआती कीमतों या अपने प्रोजेक्ट के बारे में पूछ सकते हैं।';
    if(lang==='ar')return 'مرحبًا! أنا مساعد AMM Data Solutions. يمكنك السؤال عن خدماتنا والأسعار المبدئية وخطوات بدء المشروع.';
    return 'Hello! I’m the AMM Data Solutions assistant. Ask me about our services, starting prices, languages, or how to discuss a project.';
  }
  function openChat(){tip.hidden=true;panel.hidden=false;launcher.setAttribute('aria-expanded','true');if(!messages.childElementCount)addMessage(greeting(),'assistant');input.focus();}
  function closeChat(){panel.hidden=true;launcher.setAttribute('aria-expanded','false');launcher.focus();}
  function fallback(text){
    const q=text.toLowerCase();
    if(/price|pricing|cost|rate|qeemat|keemat|kitnay|kitne|قیمت|سعر|कीमत/.test(q)){
      return 'Starting estimates (not fixed quotes):\n'+services.map(s=>'• '+s[0]+': from '+s[1]).join('\n')+'\nFinal pricing depends on scope and is confirmed before work begins. Ad spend, hosting, software and API costs are separate where applicable.';
    }
    if(/service|services|what do you|kya kart|konsi|کون سی|خدمات|सेवाएं|सेवा/.test(q)){
      return 'AMM Data Solutions offers six services:\n'+services.map(s=>'• '+s[0]+' — '+s[2]).join('\n');
    }
    if(/language|roman urdu|hindi|arabic|اردو|عربی|हिंदी/.test(q)){
      return 'The assistant is designed for English, Roman Urdu, Hindi and Arabic. The language selector can be changed at any time; other languages can be configured for a specific client project.';
    }
    if(/contact|email|discuss|project|start|order|enquiry|enquiry|rabta|رابطہ|संपर्क/.test(q)){
      return 'You can use the website’s Contact section to discuss your requirements. This chat does not confirm an order or quote. AMM reviews project scope first, then confirms the next steps.';
    }
    return 'I can help with AMM’s six services, starting prices, language support and project next steps. Please try one of those topics, or use the website Contact section for a project-specific discussion.';
  }
  async function ask(text){
    const clean=text.trim();if(!clean)return;
    addMessage(clean,'user');history.push({role:'user',content:clean});
    if(history.length>12)history.splice(0,history.length-12);
    input.value='';input.style.height='auto';send.disabled=true;status.textContent='Thinking…';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),18000);
    try{
      const response=await fetch(API_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history,language:language.value}),signal:controller.signal,cache:'no-store'});
      if(!response.ok)throw new Error('Assistant unavailable');
      const data=await response.json();
      if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Empty assistant response');
      history.push({role:'assistant',content:data.reply});
      if(history.length>12)history.splice(0,history.length-12);
      addMessage(data.reply,'assistant');status.textContent='AI assistant';
    }catch(error){
      const answer=fallback(clean);
      addMessage(answer,'assistant');
      status.textContent='Basic help mode';
      // Do not add the fallback to AI conversation history.
      if(error.name==='AbortError')console.warn('AMM webbot request timed out.');
    }finally{clearTimeout(timer);send.disabled=false;input.focus();}
  }
  launcher.addEventListener('click',openChat);close.addEventListener('click',closeChat);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closeChat();});
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
  input.addEventListener('input',()=>{input.style.height='auto';input.style.height=Math.min(input.scrollHeight,100)+'px';});
  root.querySelectorAll('[data-prompt]').forEach(btn=>btn.addEventListener('click',()=>ask(btn.dataset.prompt)));
  language.addEventListener('change',()=>{panel.dir=language.value==='ar'?'rtl':'ltr';});
})();