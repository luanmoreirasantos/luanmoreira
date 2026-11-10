/* ===== Configuração ===== */
const CONFIG={
  checkoutUrl:'',               // link do checkout principal (manual R$ 37) — preencha em config.json
  whatsapp:'5522998250466',
  supabaseUrl:'https://lpxyezpikhixcclocsjy.supabase.co',
  supabaseKey:'sb_publishable_-sxqKfRj3RvJdqJAMHdknQ_UYp-TgYf'
};
fetch('config.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(c=>{if(c.checkoutUrl)CONFIG.checkoutUrl=c.checkoutUrl;if(c.whatsapp)CONFIG.whatsapp=String(c.whatsapp).replace(/\D/g,'')}).catch(()=>{});

const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const waLink=text=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ===== Perguntas ===== */
const steps=[
{type:'option',key:'stage',tag:'01 / SEU MOMENTO',title:'Onde você está hoje?',description:'Não existe resposta certa. Seu ponto de partida define os próximos passos.',options:[['zero','Quero começar do absoluto zero',0],['learning','Já estou aprendendo a usar IA',1],['building','Já criei sites, mas ainda não vendo',2],['selling','Já vendo serviços digitais',3]]},
{type:'option',key:'equipment',tag:'02 / SUA ESTRUTURA',title:'Com o que você pode começar?',description:'A ideia é construir uma rota possível com os recursos disponíveis.',options:[['mobile','Tenho apenas um celular',0],['computer','Tenho notebook ou computador',1],['both','Tenho celular e computador',2]]},
{type:'option',key:'experience',tag:'03 / SUA EXPERIÊNCIA',title:'Qual habilidade você domina melhor hoje?',options:[['none','Estou aprendendo tudo do zero',0],['design','Design, imagens ou redes sociais',1],['tech','Ferramentas de IA e criação de sites',2],['sales','Conversar com clientes e vender',2]]},
{type:'option',key:'goal',tag:'04 / SEU OBJETIVO',title:'O que faria mais diferença para você agora?',options:[['first','Conseguir meu primeiro cliente',0],['better','Melhorar a qualidade da minha entrega',1],['repeat','Vender com mais frequência',2],['ticket','Cobrar mais e oferecer outros serviços',3]]},
{type:'text',key:'blocker',tag:'05 / SEU DESAFIO',title:'O que mais te impede de avançar?',description:'Escreva com suas palavras. Esta resposta ajuda a tornar sua recomendação mais útil.',placeholder:'Ex.: não sei onde encontrar clientes, tenho pouco tempo, não sei montar meu portfólio...'},
{type:'option',key:'time',tag:'06 / TEMPO DISPONÍVEL',title:'Quanto tempo você consegue dedicar por semana?',options:[['up_to_3','Até 3 horas',0],['3_to_7','De 3 a 7 horas',1],['7_to_15','De 7 a 15 horas',2],['15_plus','Mais de 15 horas',3]]},
{type:'contact',key:'contact',tag:'07 / SEU RESULTADO',title:'Para quem envio o seu diagnóstico?',description:'Preencha seus dados para liberar sua cor de temperatura e o seu plano de aceleração.'},
{type:'result',key:'result',tag:'08 / DIAGNÓSTICO',title:''}
];

/* ===== Cores por temperatura ===== */
const COLORS=[
{id:'azul',name:'Azul Gelo',temp:'Temperatura 1 de 5',stage:'Ponto de partida',hex:'#5ec8ff',grad:'linear-gradient(135deg,#bfeaff,#5ec8ff 45%,#2a7fd6)',min:0,max:2,
 texts:['Todo mundo que hoje vive de serviços digitais já esteve exatamente onde você está. A diferença não foi talento: foi a decisão de começar. Ao fazer este diagnóstico, você já saiu na frente de quem só pensa no assunto.',
 'Começar do zero não é desvantagem, é liberdade. Você não tem vícios para desaprender e pode construir do jeito certo desde o primeiro site. Com um método claro, cada semana de prática transforma insegurança em habilidade, e habilidade abre portas.',
 'Seu momento pede uma base sólida, não pressa. Uma habilidade bem aprendida hoje pode virar uma renda extra amanhã e, com o tempo, mais liberdade para decidir como você quer viver.'],
 accel:['Seguir um roteiro pronto em vez de juntar conteúdo solto da internet','Criar seu primeiro site de demonstração nos próximos 7 dias','Ter alguém revisando seus primeiros passos para não perder meses em tentativa e erro']},
{id:'verde',name:'Verde Broto',temp:'Temperatura 2 de 5',stage:'Aquecendo',hex:'#7fdc63',grad:'linear-gradient(135deg,#dbffc9,#7fdc63 45%,#3f9d35)',min:3,max:5,
 texts:['Você já saiu da inércia, e essa é a parte mais difícil. Agora o jogo é transformar curiosidade em prática constante. Quem pratica com direção evolui muito mais rápido do que quem só consome conteúdo.',
 'Você tem a base para começar a criar de verdade. Cada site que você monta, mesmo de demonstração, vira portfólio, confiança e argumento de venda. Seu próximo nível está mais perto do que parece.',
 'O que separa você das primeiras oportunidades não é saber tudo, é organizar o que já sabe em uma oferta simples. Com o passo a passo certo, sua dedicação começa a virar resultado visível.'],
 accel:['Usar prompts prontos para produzir mais rápido e com mais qualidade','Montar dois sites de demonstração para um nicho específico','Começar a conversar com potenciais clientes ainda esta semana']},
{id:'amarelo',name:'Amarelo Solar',temp:'Temperatura 3 de 5',stage:'Em movimento',hex:'#ffd23f',grad:'linear-gradient(135deg,#fff3b8,#ffd23f 45%,#e0a100)',min:6,max:8,
 texts:['Você já tem habilidade nas mãos. O que falta é transformar isso em um serviço que as pessoas entendam e queiram comprar. Quando a oferta fica clara, as conversas ficam mais fáceis e as vendas começam a acontecer.',
 'Seu perfil mostra energia e capacidade de execução. Com processo e uma abordagem comercial bem feita, você sai do "eu sei fazer" para o "eu tenho clientes", e isso muda a forma como você enxerga o seu futuro.',
 'Você está no ponto em que pequenos ajustes geram grandes saltos: uma mensagem de abordagem melhor, uma proposta mais clara, um nicho bem escolhido. É exatamente aqui que muita gente destrava.'],
 accel:['Aplicar modelos de abordagem prontos em vez de improvisar','Definir um nicho e um pacote com preço fechado','Revisar sua oferta com quem já vende para encurtar o caminho']},
{id:'laranja',name:'Laranja Brasa',temp:'Temperatura 4 de 5',stage:'Em brasa',hex:'#ff8a2a',grad:'linear-gradient(135deg,#ffd6a8,#ff8a2a 45%,#d8530c)',min:9,max:10,
 texts:['Você já está em ritmo. Agora o desafio não é começar, é crescer com consistência: mais clientes, entrega melhor e preço mais justo pelo seu trabalho. Você tem tudo para dar esse salto.',
 'Quem chega na sua temperatura costuma estar a poucas decisões de um novo patamar. Organizar o processo, padronizar a entrega e acrescentar serviços complementares pode multiplicar o valor de cada cliente.',
 'Sua dedicação já é visível. Com estratégia, ela se transforma em estabilidade, previsibilidade e na possibilidade de escolher melhor seus projetos e o seu tempo.'],
 accel:['Padronizar briefing, produção e entrega com checklist','Oferecer serviços complementares com escopo claro','Ter acompanhamento semanal para destravar gargalos rapidamente']},
{id:'vermelho',name:'Vermelho Chama',temp:'Temperatura 5 de 5',stage:'Em chamas',hex:'#ff4a3d',grad:'linear-gradient(135deg,#ffc1b8,#ff4a3d 45%,#c4140c)',min:11,max:99,
 texts:['Você está pronto para jogar em outro nível. Experiência, tempo e vontade já estão do seu lado. O próximo passo é posicionamento: cobrar pelo valor que entrega e escolher clientes que valorizam o seu trabalho.',
 'Seu perfil tem a temperatura de quem constrói negócio, não só renda extra. Especialização, ticket maior e recorrência podem transformar seu trabalho em algo sólido e duradouro.',
 'Você já provou que consegue. Agora é hora de crescer com inteligência: menos esforço repetitivo, mais estratégia e oportunidades maiores. Com a orientação certa, esse salto acontece mais rápido.'],
 accel:['Especializar-se em um nicho e elevar o seu ticket','Criar pacotes com manutenção e recorrência','Fazer o acompanhamento individual para montar seu plano de crescimento']}
];

let current=0,answers={},quizOpenedAt=0,result=null,saving=false;

function scoreOf(){let s=0;steps.forEach(st=>{if(st.type==='option'){const o=st.options.find(o=>o[0]===answers[st.key]);if(o)s+=o[2]}});return s}
function colorOf(s){return COLORS.find(c=>s>=c.min&&s<=c.max)||COLORS[0]}

/* ===== Abertura ===== */
function openQuiz(){current=0;answers={};result=null;quizOpenedAt=Date.now();$('quiz-overlay').classList.add('active');$('quiz-overlay').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';render()}
function closeQuiz(){$('quiz-overlay').classList.remove('active');$('quiz-overlay').setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-open-quiz]').forEach(b=>b.addEventListener('click',openQuiz));
$('quiz-close').addEventListener('click',closeQuiz);
$('quiz-overlay').addEventListener('click',e=>{if(e.target===$('quiz-overlay'))closeQuiz()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeQuiz();closePrivacy()}});
function openPrivacy(){$('privacy-overlay').classList.add('active');$('privacy-overlay').setAttribute('aria-hidden','false')}
function closePrivacy(){$('privacy-overlay').classList.remove('active');$('privacy-overlay').setAttribute('aria-hidden','true')}
$('privacy-open').onclick=openPrivacy;$('privacy-close').onclick=closePrivacy;$('privacy-ok').onclick=closePrivacy;
$('privacy-overlay').onclick=e=>{if(e.target===$('privacy-overlay'))closePrivacy()};
$('year').textContent=new Date().getFullYear();

/* ===== Checkout e WhatsApp ===== */
function goCheckout(){
  if(CONFIG.checkoutUrl){const u=new URL(CONFIG.checkoutUrl);const p=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{if(p.get(k)&&!u.searchParams.get(k))u.searchParams.set(k,p.get(k))});if(answers.email&&!u.searchParams.get('email'))u.searchParams.set('email',answers.email);if(answers.name&&!u.searchParams.get('name'))u.searchParams.set('name',answers.name);window.location.assign(u.toString());return}
  window.open(waLink(`Olá, Luan! ${answers.name?`Sou ${answers.name}. `:''}Quero garantir o Manual do Zero aos Primeiros Clientes com IA por R$ 37 na condição de Black Friday.`),'_blank','noopener');
}
function mentorMessage(){return `Olá, Luan! ${answers.name?`Sou ${answers.name}. `:''}${result?`Fiz o diagnóstico e minha cor foi ${result.color.name}. `:''}Quero falar sobre o acompanhamento individual e manter a condição da Black Friday.`}
document.getElementById('mentor-cta')?.addEventListener('click',()=>window.open(waLink(mentorMessage()),'_blank','noopener'));

/* ===== Render ===== */
function setError(t){const n=$('step-error');if(n)n.textContent=t}
function maskPhone(v){v=v.replace(/\D/g,'').slice(0,11);if(v.length<=2)return v.length?`(${v}`:'';if(v.length<=6)return `(${v.slice(0,2)}) ${v.slice(2)}`;if(v.length<=10)return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`}

function render(){
  const step=steps[current];
  $('progress-fill').style.width=`${((current+1)/steps.length)*100}%`;
  $('quiz-counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
  $('quiz-back').disabled=current===0;$('quiz-back').style.visibility=step.type==='result'?'hidden':'visible';
  const wrap=$('quiz-body');
  let inner=step.type==='result'?'':`<div class="question-tag">${step.tag}</div><h2 id="quiz-heading">${step.title}</h2>${step.description?`<p>${step.description}</p>`:''}`;
  if(step.type==='option'){inner+=`<div class="options">${step.options.map(([v,label])=>`<button type="button" class="option ${answers[step.key]===v?'selected':''}" data-value="${v}"><span class="opt-text">${escapeHTML(label)}</span><i class="opt-mark"></i></button>`).join('')}</div>`}
  if(step.type==='text'){inner+=`<label class="field-label" for="answer-text">Seu maior desafio</label><textarea id="answer-text" class="field" maxlength="700" placeholder="${step.placeholder}">${escapeHTML(answers.blocker||'')}</textarea><div id="step-error" class="error" role="alert"></div><button class="btn btn-primary quiz-next" id="next-text"><span>Continuar</span><i class="btn-orb"></i></button>`}
  if(step.type==='contact'){inner+=`<form id="contact-form" novalidate>
    <label class="field-label" for="lead-name">Nome *</label><input id="lead-name" class="field" type="text" autocomplete="name" maxlength="80" required value="${escapeHTML(answers.name||'')}" placeholder="Como posso chamar você?">
    <label class="field-label" for="lead-email">E-mail *</label><input id="lead-email" class="field" type="email" inputmode="email" autocomplete="email" maxlength="200" required value="${escapeHTML(answers.email||'')}" placeholder="voce@exemplo.com">
    <label class="field-label" for="lead-phone">WhatsApp com DDD *</label><input id="lead-phone" class="field" type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" required value="${escapeHTML(answers.phone||'')}" placeholder="(22) 99999-9999">
    <label class="consent"><input type="checkbox" id="lead-consent" ${answers.consent?'checked':''}><span>Concordo em receber meu diagnóstico e contato sobre esta oferta por e-mail e WhatsApp. <a href="#" id="inline-privacy">Ver privacidade</a>.</span></label>
    <div id="step-error" class="error" role="alert"></div>
    <button class="btn btn-primary btn-glow quiz-next" id="submit-contact" type="submit"><span>Liberar meu diagnóstico</span><i class="btn-orb"></i></button>
    <p class="secure-note"><i></i>Seus dados ficam protegidos e não são compartilhados.</p></form>`}
  if(step.type==='result'){inner+=resultHTML()}
  wrap.classList.remove('swap');void wrap.offsetWidth;wrap.innerHTML=inner;wrap.classList.add('swap');wrap.scrollTop=0;$('quiz-body').closest('.quiz-shell').scrollTop=0;
  if(step.type==='option'){wrap.querySelectorAll('[data-value]').forEach(b=>b.onclick=()=>{answers[step.key]=b.dataset.value;b.classList.add('selected');setTimeout(advance,180)})}
  if(step.type==='text'){$('next-text').onclick=()=>{const t=$('answer-text').value.trim();if(t.length<3){setError('Escreva pelo menos algumas palavras.');return}answers.blocker=t;advance()}}
  if(step.type==='contact'){const ph=$('lead-phone');ph.addEventListener('input',()=>{ph.value=maskPhone(ph.value)});$('inline-privacy').onclick=e=>{e.preventDefault();openPrivacy()};$('contact-form').onsubmit=submitLead}
  if(step.type==='result'){
    $('res-checkout').onclick=goCheckout;$('res-checkout-2').onclick=goCheckout;
    requestAnimationFrame(()=>setTimeout(()=>{const m=$('thermo-marker');if(m)m.style.left=m.dataset.pos},120));
  }
}
function advance(){current=Math.min(current+1,steps.length-1);render()}
$('quiz-back').onclick=()=>{if(current>0&&steps[current].type!=='result'){current--;render()}};

function resultHTML(){
  const c=result.color,first=(answers.name||'').split(' ')[0];
  const idx=COLORS.indexOf(c),pos=`${(idx+.5)/COLORS.length*100}%`;
  const blocker=answers.blocker?`<div class="res-blocker"><small>SEU DESAFIO</small><p>"${escapeHTML(answers.blocker)}"</p><span>O manual e o acompanhamento foram pensados exatamente para destravar pontos como esse.</span></div>`:'';
  return `<div class="res" style="--c:${c.hex};--cg:${c.grad}">
  <div class="res-head">
    <div class="res-orb"><span></span></div>
    <div><div class="question-tag">SUA COR DE TEMPERATURA</div><h2 id="quiz-heading" class="res-title">${escapeHTML(first)}, você é <em>${c.name}</em></h2><span class="res-temp">${c.temp} · ${c.stage}</span></div>
  </div>
  <div class="thermo"><div class="thermo-bar">${COLORS.map(k=>`<span style="background:${k.hex}" class="${k===c?'on':''}"></span>`).join('')}</div><i id="thermo-marker" data-pos="${pos}"></i><div class="thermo-labels"><span>Frio</span><span>Quente</span></div></div>
  <p class="res-text">${result.text}</p>
  ${blocker}
  <div class="res-block"><div class="res-block-title">COMO ACELERAR O SEU PROCESSO</div><ol class="accel">${c.accel.map(a=>`<li><b></b>${a}</li>`).join('')}</ol></div>
  <div class="rec rec-main">
    <span class="rec-flag"><span class="bf-live"></span>RECOMENDADO PARA VOCÊ · BLACK FRIDAY</span>
    <h3>Manual do Zero aos Primeiros Clientes com IA</h3>
    <p>Passo a passo, prompts, modelos de abordagem, plano de 30 dias e checklist de entrega para você avançar da sua temperatura atual para a próxima.</p>
    <div class="rec-price"><span>R$</span><strong>37</strong><small>condição de Black Friday</small></div>
    <button class="btn btn-primary btn-glow btn-block" id="res-checkout"><span>Quero o manual por R$ 37</span><i class="btn-orb"></i></button>
  </div>
  <div class="rec rec-mentor">
    <span class="rec-flag alt">PARA ACELERAR AINDA MAIS</span>
    <h3>Acompanhamento individual com o Luan</h3>
    <p>Uma reunião por semana comigo para revisar metas, ajustar sua oferta e definir os próximos passos junto com você. Fale direto comigo no WhatsApp e garanta a condição da Black Friday.</p>
    <div class="rec-price small"><span>R$</span><strong>497</strong></div>
    <a class="btn btn-wa btn-block" href="${waLink(mentorMessage())}" target="_blank" rel="noopener"><i class="wa-dot"></i><span>Falar com o Luan no WhatsApp</span></a>
  </div>
  <button class="btn btn-ghost btn-block" id="res-checkout-2"><span>Começar agora pelo manual</span></button>
  <p class="quiz-note">Diagnóstico educativo. Resultados dependem da sua execução e não há promessa de ganhos.</p>
  </div>`;
}

/* ===== Envio do lead (banco na nuvem) ===== */
function utm(){const p=new URLSearchParams(location.search);return Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].map(k=>[k,p.get(k)||'']))}
async function sendLead(body){
  const r=await fetch(`${CONFIG.supabaseUrl}/rest/v1/rpc/luan_bf_submit_lead`,{method:'POST',headers:{apikey:CONFIG.supabaseKey,'Content-Type':'application/json'},body:JSON.stringify({p:body}),keepalive:true});
  if(!r.ok)throw new Error('lead_'+r.status);return r.json();
}
const QKEY='lm_bf_pending';
function queue(body){try{const q=JSON.parse(localStorage.getItem(QKEY)||'[]');q.push(body);localStorage.setItem(QKEY,JSON.stringify(q.slice(-10)))}catch(e){}}
async function flushQueue(){let q;try{q=JSON.parse(localStorage.getItem(QKEY)||'[]')}catch(e){return}if(!q.length)return;const rest=[];for(const b of q){try{await sendLead(b)}catch(e){rest.push(b)}}try{localStorage.setItem(QKEY,JSON.stringify(rest))}catch(e){}}
flushQueue();addEventListener('online',flushQueue);

async function submitLead(e){
  e.preventDefault();if(saving)return;
  const name=$('lead-name').value.trim(),email=$('lead-email').value.trim(),phone=$('lead-phone').value.trim(),digits=phone.replace(/\D/g,'');
  if(name.length<2)return setError('Informe seu nome.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setError('Informe um e-mail válido.');
  if(digits.length<10||digits.length>11)return setError('Informe seu WhatsApp com DDD.');
  if(!$('lead-consent').checked)return setError('Marque a autorização para receber seu diagnóstico.');
  answers={...answers,name,email,phone,consent:true};
  const score=scoreOf(),color=colorOf(score);
  result={score,color,text:color.texts[Math.floor(Math.random()*color.texts.length)]};
  const body={name,email,whatsapp:'55'+digits,consent:true,score,color:color.id,color_label:color.name,
    answers:{stage:answers.stage,equipment:answers.equipment,experience:answers.experience,goal:answers.goal,blocker:answers.blocker,time:answers.time,texto_exibido:result.text},
    utm:utm(),page:location.href.slice(0,300),user_agent:navigator.userAgent.slice(0,400),elapsed_seconds:Math.round((Date.now()-quizOpenedAt)/1000)};
  saving=true;const btn=$('submit-contact');btn.disabled=true;btn.querySelector('span').textContent='Calculando sua temperatura...';
  const req=sendLead(body).catch(()=>queue(body));
  await Promise.race([req,new Promise(r=>setTimeout(r,8000))]);
  saving=false;
  try{if(window.fbq)fbq('track','Lead')}catch(e){}
  advance();
}
/* ===== Interações e motion ===== */
(function(){
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.getElementById('site-header'),bar=document.getElementById('scroll-bar'),photo=document.getElementById('hero-photo'),mcta=document.getElementById('mobile-cta'),hero=document.getElementById('inicio');
let ticking=false;
function onScroll(){const y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('scrolled',y>30);bar.style.transform=`scaleX(${h>0?y/h:0})`;if(photo&&!reduce&&y<innerHeight*1.2){photo.style.translate=`0 ${y*.18}px`}if(mcta){const past=y>hero.offsetHeight*.7;const nearEnd=y>h-260;mcta.classList.toggle('show',past&&!nearEnd)}ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});onScroll();

// reveal
const fmt=n=>n.toLocaleString('pt-BR');
function countUp(el){const to=+el.dataset.to;if(reduce){el.textContent=fmt(to);return}const t0=performance.now(),dur=1600;(function f(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);el.textContent=fmt(Math.round(to*e));if(k<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.count').forEach(countUp);io.unobserve(e.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// nav ativo
const links=[...document.querySelectorAll('.site-header nav a')];
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
links.forEach(a=>{const t=document.querySelector(a.getAttribute('href'));if(t)so.observe(t)});

// spotlight
document.querySelectorAll('.spot').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}));

// rolagem do site demonstrativo
const dp=document.getElementById('demo-page');
function setDemo(){if(!dp)return;const vp=dp.parentElement;dp.style.setProperty('--demo-dist',Math.max(0,dp.scrollHeight-vp.clientHeight)+'px')}
addEventListener('load',setDemo);addEventListener('resize',setDemo);setTimeout(setDemo,600);

// FAQ: abre um por vez
const ds=document.querySelectorAll('.faq details');ds.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)ds.forEach(o=>{if(o!==d)o.open=false})}));

/* ===== Bloqueio de zoom ===== */
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1||(e.scale&&e.scale!==1))e.preventDefault()},{passive:false});
let lastTouch=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastTouch<320&&!e.target.closest('input,textarea,select'))e.preventDefault();lastTouch=n},{passive:false});
document.addEventListener('dblclick',e=>e.preventDefault());
addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)e.preventDefault()},{passive:false});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','-','=','0','_'].includes(e.key))e.preventDefault()});

/* ===== Proteção de imagens ===== */
const isMedia=t=>t&&t.closest&&t.closest('img,picture,video,svg,.protect,.demo-stage,.ig-card');
document.addEventListener('contextmenu',e=>{if(isMedia(e.target))e.preventDefault()});
document.addEventListener('dragstart',e=>{if(isMedia(e.target)||e.target.tagName==='IMG')e.preventDefault()});
document.querySelectorAll('img').forEach(i=>{i.setAttribute('draggable','false')});
})();
