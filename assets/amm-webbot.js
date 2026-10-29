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
  let tipShown=false, scrollTipTimer=null, hideTipTimer=null, lastTipY=-900, tipIndex=0;
  const path=window.location.pathname.toLowerCase();
  function getGuidance(){
    let first='Exploring AMM Data Solutions? 👋',second='I can guide you through services, starting prices, and next steps.',third='Have a question about your project? Tap me and let’s figure it out 💬';
    if(path.includes('ai-chatbots')){first='Want to see what an AI chatbot can do? 🤖';second='Ask me about customer support, lead capture, or multilingual bots.';third='Every chatbot can be tailored to the client’s needs ✨';}
    else if(path.includes('ai-business-automation')){first='Less repetitive work, more time for business ✨';second='I can explain how automation may fit your workflow.';third='Tell me what task takes too much time 💬';}
    else if(path.includes('google-seo')){first='Curious how customers find you online? 🔎';second='Ask me about Google SEO and AI search visibility.';third='SEO takes a clear plan—rankings can’t be guaranteed.';}
    else if(path.includes('digital-advertising')){first='Planning your next campaign? 📣';second='I can explain our ad service and what details matter.';third='Ad spend is separate from our service fee 💡';}
    else if(path.includes('data-management')){first='Messy spreadsheets? We can help tidy the data 📊';second='Ask about data entry, cleanup, and quality checks.';third='You can describe your data task without sharing private records 🔒';}
    else if(path.includes('website-design')){first='Thinking about a website refresh? ✨';second='I can guide you through website and digital-solution options.';third='Tell me what you want your website to help people do 💬';}
    else if(path.includes('pricing')){first='Need help understanding starting prices? 💡';second='These are estimates; the final quote depends on scope.';third='I can help you identify which service may fit your goal.';}
    else if(path.includes('privacy')){first='Have a question about sharing information? 🔒';second='Please don’t share passwords or sensitive details in chat.';third='Ask me about the bot’s basic privacy approach.';}
    else {
      const headings=Array.from(document.querySelectorAll('main h1, main h2, section h1, section h2')).map(el=>(el.textContent||'').trim().toLowerCase());
      if(headings.some(h=>/contact|need a solution|talk to/.test(h))){first='Ready to talk through an idea? 💬';second='I can help you figure out what to discuss with AMM.';third='Project details are reviewed before a final quote is confirmed.';}
      else if(headings.some(h=>/service|what we do|solutions/.test(h))){first='Not sure which service fits? 👀';second='Tell me your goal and I’ll help narrow down the options.';third='You can ask me about any of AMM’s six services.';}
    }
    return [first,second,third];
  }
  function showTip(){
    if(tipShown||!panel.hidden||window.scrollY<180||tipIndex>=3)return;
    const key='ammBotTipSeen:'+path+':'+tipIndex;
    if(sessionStorage.getItem(key)==='1'){tipIndex++;return;}
    const tips=getGuidance();
    tipText.textContent=tips[tipIndex];
    tip.hidden=false;tipShown=true;lastTipY=window.scrollY;
    sessionStorage.setItem(key,'1');
    if(hideTipTimer)clearTimeout(hideTipTimer);
    hideTipTimer=setTimeout(()=>{tip.hidden=true;tipShown=false;},6500);
  }
  function dismissTip(){tip.hidden=true;tipShown=false;tipIndex++;if(hideTipTimer)clearTimeout(hideTipTimer);}
  tipDismiss.addEventListener('click',dismissTip);
  window.addEventListener('scroll',()=>{
    if(!panel.hidden||tipShown||tipIndex>=3||window.scrollY<180||window.scrollY-lastTipY<700)return;
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
  function openChat(){if(!tip.hidden){tipIndex++;}tip.hidden=true;tipShown=false;panel.hidden=false;launcher.setAttribute('aria-expanded','true');if(!messages.childElementCount)addMessage(greeting(),'assistant');input.focus();}
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