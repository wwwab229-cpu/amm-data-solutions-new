/* AMM Data Solutions custom web assistant. Chat history stays in this tab only. */
(function(){
  'use strict';
  if(document.getElementById('amm-webbot-root')) return;
  const API_ENDPOINT='https://yvfumgrywsqhsvjfnmzu.supabase.co/functions/v1/amm-webbot';
  const root=document.createElement('div');
  root.id='amm-webbot-root';
  root.innerHTML=`
    <button id="amm-webbot-launcher" type="button" aria-expanded="false" aria-controls="amm-webbot-panel" aria-label="Open AMM AI assistant"><span class="amm-bot-dot" aria-hidden="true"></span><span>Ask AMM</span></button>
    <section id="amm-webbot-panel" role="dialog" aria-modal="false" aria-labelledby="amm-webbot-heading" hidden>
      <header id="amm-webbot-header"><div><h2 id="amm-webbot-heading">AMM AI Assistant</h2><p id="amm-webbot-subheading">Ask about our services and next steps.</p></div><button id="amm-webbot-close" type="button" aria-label="Close chat">×</button></header>
      <div id="amm-webbot-tools"><label for="amm-webbot-language" class="sr-only">Chat language</label><select id="amm-webbot-language" aria-label="Chat language"><option value="auto">Auto-detect language</option><option value="en">English</option><option value="roman-urdu">Roman Urdu</option><option value="hi">Hindi</option><option value="ar">العربية — Arabic</option></select><span id="amm-webbot-status" role="status">Ready</span></div>
      <div id="amm-webbot-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div id="amm-webbot-quick-prompts"><button type="button" data-prompt="What services does AMM offer?">Our services</button><button type="button" data-prompt="What are your starting prices?">Starting prices</button><button type="button" data-prompt="How can I discuss a project with AMM?">Discuss a project</button></div>
      <form id="amm-webbot-form"><textarea id="amm-webbot-input" rows="1" maxlength="500" required placeholder="Type your question…" aria-label="Your question"></textarea><button id="amm-webbot-send" type="submit" aria-label="Send message">➤</button></form>
      <p id="amm-webbot-privacy">Please don’t share passwords or sensitive personal information. Chat is not stored by this widget.</p>
    </section>`;
  document.body.appendChild(root);
  const panel=root.querySelector('#amm-webbot-panel'),launcher=root.querySelector('#amm-webbot-launcher'),close=root.querySelector('#amm-webbot-close');
  const messages=root.querySelector('#amm-webbot-messages'),form=root.querySelector('#amm-webbot-form'),input=root.querySelector('#amm-webbot-input');
  const send=root.querySelector('#amm-webbot-send'),status=root.querySelector('#amm-webbot-status'),language=root.querySelector('#amm-webbot-language');
  const history=[];
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
  function openChat(){panel.hidden=false;launcher.setAttribute('aria-expanded','true');if(!messages.childElementCount)addMessage(greeting(),'assistant');input.focus();}
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