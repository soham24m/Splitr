/* ======== SPLITR - COMPLETE APPLICATION ======== */
"use strict";

// ===== GLOBAL STATE =====
const splitrState = {};
let currentUser = null;
let currentPage = 'dashboard';
let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();
let reportMonth = new Date().getMonth();
let reportYear = new Date().getFullYear();
let lastExpenseId = null;
let moodTimeout = null;
let currentGroupId = null;

// ===== ICONS =====
const SVGS = {
  trip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;margin-right:6px;"><path d="M20 10v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10"/><path d="M4 10h16"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/><circle cx="12" cy="15" r="2"/></svg>',
  happy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  neutral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  regret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect x="8" y="13" width="8" height="3" rx="1"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  necessary: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="14" x2="16" y2="14"/><path d="M7 8l2 2"/><path d="M17 8l-2 2"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
};

// ===== CATEGORIES =====
const CATEGORIES = [
  { id: 'java-food', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M5 12v3a5 5 0 0 0 10 0v-3"/><path d="M18 12v3a5 5 0 0 1-1.3 3.4"/><path d="M14 4 10 8"/><path d="M19 4 15 8"/><path d="M12 22h-4"/></svg>', label: 'Java Food Court' },
  { id: 'canteen', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18"/><path d="M18 18A6 6 0 0 0 6 18"/><path d="M11 6V2"/><path d="M15 6V2"/><path d="M7 6V2"/></svg>', label: 'University Canteen' },
  { id: 'library', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', label: 'Library / Stationery' },
  { id: 'transport', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M2 12h20"/></svg>', label: 'Bus / Transport' },
  { id: 'market', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', label: 'Kattankulathur Market' },
  { id: 'delivery', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="14" height="10" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="13" cy="18" r="2"/><path d="M17 12h2l2 2v4h-2"/><path d="M8 8V6a2 2 0 0 1 2-2h4"/></svg>', label: 'Zomato / Swiggy' },
  { id: 'recharge', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>', label: 'Recharge / Internet' },
  { id: 'rent', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', label: 'PG / Hostel Rent' },
  { id: 'medical', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>', label: 'Medical / Pharmacy' },
  { id: 'entertainment', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><polygon points="10 10 14 12 10 14 10 10"/></svg>', label: 'Entertainment / OTT' },
  { id: 'shopping', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 2.5 1.5L6 14h12l2-9H5"/><circle cx="8" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>', label: 'Shopping / Amazon' },
  { id: 'fees', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>', label: 'Course / Exam Fees' },
  { id: 'other', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>', label: 'Other' }
];

const KEYWORD_MAP = {
  'delivery': ['zomato','swiggy','delivery','order online'],
  'java-food': ['java','food court','lunch','dinner','breakfast','brunch','mess'],
  'canteen': ['canteen','university canteen','srm canteen'],
  'transport': ['ola','uber','auto','bus','shuttle','petrol','tambaram','train','metro','cab','rapido'],
  'shopping': ['amazon','flipkart','shopping','myntra','clothes'],
  'recharge': ['electricity','wifi','recharge','bill','jio','airtel','internet'],
  'entertainment': ['netflix','hotstar','movie','spotify','prime','disney','theatre','cinema'],
  'medical': ['medicine','pharmacy','doctor','hospital','clinic','apollo'],
  'rent': ['rent','pg','hostel','accommodation'],
  'library': ['book','stationery','pen','notebook','library','xerox','print'],
  'market': ['market','kattankulathur','grocery','vegetables','fruit'],
  'fees': ['fee','exam','course','tuition','semester']
};

const QUIZ_QUESTIONS = [
  { q: "You receive ₹5000 unexpectedly. What do you do?", opts: ["Save it all","Split save and spend","Spend on something needed","Treat yourself"] },
  { q: "How often do you check your bank balance?", opts: ["Multiple times a day","Once a day","Once a week","Rarely"] },
  { q: "You're at a restaurant with friends. The bill comes. You:", opts: ["Calculate your exact share","Split equally without thinking","Offer to pay and sort later","Feel anxious about the cost"] },
  { q: "End of month — you have ₹2000 left. You:", opts: ["Transfer to savings","Keep as buffer","Already spent it","Plan what to buy"] },
  { q: "Your biggest money weakness is:", opts: ["Impulse buying","Forgetting to track","Lending and not getting back","Subscriptions I forgot about"] }
];

const PERSONALITY_TYPES = {
  planner: { name: "The Planner", desc: "You're methodical with money. Every rupee has a purpose, and you rarely overspend.", tips: ["Set up automatic budget alerts to stay on track","Track weekly instead of daily to save time","Reward yourself occasionally — you've earned it!"] },
  impulsive: { name: "The Impulsive", desc: "You live in the moment! Spontaneous spending brings you joy, but your wallet sometimes disagrees.", tips: ["Try a 24-hour rule: wait a day before any purchase over ₹500","Use the No-Spend Day challenge to build discipline","Set a weekly 'fun money' limit and stick to it"] },
  social: { name: "The Social Spender", desc: "Your friends are your world, and you love treating them. Generosity is your superpower — and your kryptonite.", tips: ["Always split bills — it's not rude, it's smart","Track who owes you and follow up gently","Set a monthly 'social spending' budget"] },
  optimizer: { name: "The Optimizer", desc: "You love a good deal and hate waste. You compare prices, hunt coupons, and always find the smartest way to spend.", tips: ["Don't spend too much time optimizing small amounts","Focus your energy on big-ticket savings","Sometimes paying a bit more for convenience is worth it"] }
};

const CHALLENGES_DEF = [
  { id: 'food150', name: "Spend under ₹150 on Food today", desc: "Keep your total food spending below ₹150 for a single day.", type: 'daily' },
  { id: 'noent7', name: "No Entertainment spending for 7 days", desc: "Avoid any entertainment/OTT expenses for a full week.", type: 'weekly' },
  { id: 'track7', name: "Add at least one expense every day for 7 days", desc: "Build the tracking habit — log something every day.", type: 'weekly' },
  { id: 'budget-week', name: "Stay within all budgets this week", desc: "Don't exceed any category budget for 7 straight days.", type: 'weekly' },
  { id: 'save500', name: "Save ₹500 by end of month", desc: "Keep total spending below your total monthly budget by ₹500+.", type: 'monthly' }
];

// ===== UTILITY FUNCTIONS =====
function $(id) { return document.getElementById(id); }
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }
function fmt(n) { return '₹' + Number(n||0).toLocaleString('en-IN'); }
function today() { return new Date().toISOString().split('T')[0]; }
function toast(msg) {
  const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
  $('toast-container').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3000);
}
function getUser() { return splitrState[currentUser]; }
function getGreeting(name) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return g + ', ' + name;
}
function monthName(m,y) {
  return new Date(y,m).toLocaleString('en-IN',{month:'long',year:'numeric'});
}
function daysInMonth(m,y) { return new Date(y,m+1,0).getDate(); }
function isSameMonth(dateStr,m,y) {
  const d = new Date(dateStr); return d.getMonth()===m && d.getFullYear()===y;
}
function showModal(id) { $(id).classList.add('show'); }
function hideModal(id) { $(id).classList.remove('show'); }

// ===== STARTUP / NAV =====
document.addEventListener("DOMContentLoaded", () => {
    // Show landing screen on load
    showScreen('landing-screen');

    // Navigation links to Landing
    qsa('.nav-to-landing').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            showScreen('landing-screen');
        };
    });

    // Navigation links to Auth
    qsa('.nav-to-auth').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const tab = btn.dataset.tab || 'login';
            showScreen('auth-screen');
            // Click the relevant tab
            if(tab === 'login') $('login-tab-btn').click();
            else $('register-tab-btn').click();
        };
    });

    initAuth();
});

function showScreen(id) {
  qsa('.screen').forEach(s=>s.classList.remove('active-screen'));
  $(id).classList.add('active-screen');
  if(id==='app-screen') $('fab-add-expense').style.display='flex';
  else $('fab-add-expense').style.display='none';
}

// ===== AUTH =====
function initAuth() {
  qsa('.auth-tab').forEach(tab => tab.onclick = () => {
    qsa('.auth-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    qsa('.auth-form').forEach(f=>f.classList.remove('active-form'));
    $(tab.dataset.tab === 'login' ? 'login-form' : 'register-form').classList.add('active-form');
  });

  // SRM badge on email input
  $('reg-email').oninput = () => {
    const email = $('reg-email').value.toLowerCase();
    const existing = $('srm-email-badge-hint');
    if(existing) existing.remove();
    if(email.endsWith('@srmist.edu.in')) {
      $('reg-email').insertAdjacentHTML('afterend','<span id="srm-email-badge-hint" class="srm-email-badge">SRM Verified</span>');
    }
  };

  $('register-form').onsubmit = e => {
    e.preventDefault();
    const btn = $('register-submit-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    setTimeout(() => {
        const name = $('reg-name').value.trim();
        const email = $('reg-email').value.trim().toLowerCase();
        const pass = $('reg-password').value;
        const hostel = $('reg-hostel').value.trim();
        const year = $('reg-year').value;
        
        btn.textContent = originalText;
        btn.disabled = false;

        if(!name||!email||!pass) return toast('Please fill all required fields');
        if(splitrState[email]) return toast('Account already exists. Please login.');
        splitrState[email] = {
            name, email, password: pass, hostel, year,
            srmVerified: email.endsWith('@srmist.edu.in'),
            personality: null, quizDone: false,
            expenses: [], groups: [], budgets: {},
            challenges: {},
            longestStreak: 0
        };
        currentUser = email;
        toast('Account created! Welcome to Splitr');
        showScreen('quiz-screen');
        initQuiz();
    }, 600);
  };

  $('login-form').onsubmit = e => {
    e.preventDefault();
    const btn = $('login-submit-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    setTimeout(() => {
        const email = $('login-email').value.trim().toLowerCase();
        const pass = $('login-password').value;

        btn.textContent = originalText;
        btn.disabled = false;

        if(!splitrState[email]) return toast('No account found. Please register first.');
        if(splitrState[email].password !== pass) return toast('Incorrect password');
        
        currentUser = email;
        toast('Welcome back!');
        if(!getUser().quizDone) { showScreen('quiz-screen'); initQuiz(); }
        else { showScreen('app-screen'); initApp(); }
    }, 400);
  };
}

// ===== QUIZ =====
let quizStep = 0;
let quizAnswers = [];
function initQuiz() {
  quizStep = 0; quizAnswers = [];
  renderQuizStep();
}
function renderQuizStep() {
  if(quizStep >= QUIZ_QUESTIONS.length) { finishQuiz(); return; }
  const q = QUIZ_QUESTIONS[quizStep];
  $('quiz-progress-fill').style.width = ((quizStep+1)/QUIZ_QUESTIONS.length*100)+'%';
  $('quiz-step-label').textContent = 'Question '+(quizStep+1)+' of '+QUIZ_QUESTIONS.length;
  let html = '<div class="quiz-question">'+q.q+'</div><div class="quiz-options">';
  q.opts.forEach((o,i) => { html += '<div class="quiz-option" data-idx="'+i+'">'+o+'</div>'; });
  html += '</div>';
  $('quiz-body').innerHTML = html;
  qsa('.quiz-option').forEach(opt => opt.onclick = () => {
    qsa('.quiz-option').forEach(o=>o.classList.remove('selected'));
    opt.classList.add('selected');
    quizAnswers[quizStep] = parseInt(opt.dataset.idx);
    setTimeout(()=>{ quizStep++; renderQuizStep(); }, 400);
  });
}
function finishQuiz() {
  // Score: 0=planner-leaning, 3=impulsive-leaning; map answers to types
  let scores = { planner:0, impulsive:0, social:0, optimizer:0 };
  const mapping = [
    ['planner','optimizer','social','impulsive'],
    ['optimizer','planner','social','impulsive'],
    ['optimizer','social','social','planner'],
    ['planner','planner','impulsive','optimizer'],
    ['impulsive','planner','social','optimizer']
  ];
  quizAnswers.forEach((a,i) => { if(mapping[i]&&mapping[i][a]) scores[mapping[i][a]]++; });
  let maxType = 'planner', maxScore = 0;
  for(let t in scores) { if(scores[t]>maxScore){maxScore=scores[t];maxType=t;} }
  const u = getUser();
  u.personality = maxType;
  u.quizDone = true;
  const pt = PERSONALITY_TYPES[maxType];
  
  let html = '<div class="result-icon">' + SVGS.brain + '</div>';
  html += '<div class="result-type">'+pt.name+'</div>';
  html += '<div class="result-desc">'+pt.desc+'</div>';
  html += '<div class="result-tips"><h3>Your Personalized Tips:</h3><ul>';
  pt.tips.forEach(t => html+='<li>'+t+'</li>');
  html += '</ul></div>';
  html += '<button class="btn btn-primary btn-full" id="quiz-continue-btn">Continue to Dashboard</button>';
  $('quiz-result-card').innerHTML = html;
  showScreen('quiz-result-screen');
  setTimeout(()=>{
    $('quiz-continue-btn').onclick = () => { showScreen('app-screen'); initApp(); };
  },50);
}

// ===== NAVIGATION =====
function initNav() {
  qsa('.nav-link').forEach(link => link.onclick = e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
    // close mobile sidebar
    $('sidebar').classList.remove('open');
    $('sidebar-overlay').classList.remove('show');
  });
  $('hamburger-btn').onclick = () => {
    $('sidebar').classList.toggle('open');
    $('sidebar-overlay').classList.toggle('show');
  };
  $('sidebar-overlay').onclick = () => {
    $('sidebar').classList.remove('open');
    $('sidebar-overlay').classList.remove('show');
  };
  $('logout-btn').onclick = () => {
    currentUser = null;
    showScreen('landing-screen');
    toast('Logged out successfully');
  };
  $('back-to-groups-btn').onclick = () => navigateTo('groups');
}

function navigateTo(page) {
  currentPage = page;
  qsa('.page').forEach(p=>p.classList.remove('active-page'));
  
  // Use timeout for transition
  setTimeout(() => {
    $('page-'+page).classList.add('active-page');
    qsa('.nav-link').forEach(l=>l.classList.remove('active'));
    const nl = qs('[data-page="'+page+'"]');
    if(nl) nl.classList.add('active');
    
    // refresh page data
    if(page==='dashboard') renderDashboard();
    else if(page==='groups') renderGroups();
    else if(page==='expenses') renderExpenses();
    else if(page==='settlements') renderSettlements();
    else if(page==='reports') renderReports();
    else if(page==='challenges') renderChallenges();
    else if(page==='profile') renderProfile();
  }, 50);
}

// ===== INIT APP =====
function initApp() {
  initNav();
  const u = getUser();
  $('sidebar-user-name').textContent = u.name;
  $('sidebar-avatar').textContent = u.name.charAt(0).toUpperCase();
  $('sidebar-user-badge').textContent = u.personality ? PERSONALITY_TYPES[u.personality].name : '';
  initCategoryChips();
  initExpenseModal();
  initGroupModal();
  populateFilterDropdowns();
  navigateTo('dashboard');
}

// ===== DASHBOARD =====
function renderDashboard() {
  const u = getUser();
  $('dashboard-greeting').textContent = getGreeting(u.name);
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  // Total spent this month
  const monthExpenses = u.expenses.filter(e=>isSameMonth(e.date,m,y)&&!e.isGroup);
  const totalSpent = monthExpenses.reduce((s,e)=>s+e.amount,0);
  $('sum-total-spent').textContent = fmt(totalSpent);
  // Pending settlements
  let owed=0,owes=0;
  u.groups.forEach(g => {
    g.expenses.forEach(exp => {
      const share = exp.amount / exp.members.length;
      if(exp.paidBy === u.name) {
        exp.members.forEach(m => { if(m!==u.name) { const s=exp.settled&&exp.settled[m]; if(!s) owed+=share; }});
      } else {
        const s=exp.settled&&exp.settled[u.name]; if(!s) owes+=share;
      }
    });
  });
  const pending = owed - owes;
  $('sum-pending').textContent = (pending>=0?'+':'')+fmt(Math.abs(pending));
  $('sum-pending').style.color = pending>=0?'#6b8e5a':'var(--danger)';
  // Active groups
  $('sum-active-groups').textContent = u.groups.length;
  // Budget remaining
  const totalBudget = Object.values(u.budgets||{}).reduce((s,v)=>s+Number(v),0);
  $('sum-budget-remaining').textContent = fmt(Math.max(0,totalBudget-totalSpent));
  // Calendar
  renderCalendar();
  // Recent expenses
  renderRecentExpenses();
}
function renderCalendar() {
  const u = getUser();
  $('cal-month-label').textContent = monthName(calendarMonth,calendarYear);
  const days = daysInMonth(calendarMonth,calendarYear);
  const firstDay = new Date(calendarYear,calendarMonth,1).getDay();
  const today2 = new Date();
  // dates with expenses
  const expDates = new Set();
  u.expenses.filter(e=>!e.isGroup&&isSameMonth(e.date,calendarMonth,calendarYear)).forEach(e=>expDates.add(new Date(e.date).getDate()));
  let html = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>html+='<div class="cal-day-header">'+d+'</div>');
  for(let i=0;i<firstDay;i++) html+='<div class="cal-day empty"></div>';
  for(let d=1;d<=days;d++) {
    const isToday = d===today2.getDate()&&calendarMonth===today2.getMonth()&&calendarYear===today2.getFullYear();
    // Compare date-only (no time) to avoid same-day being marked future
    const dateObj = new Date(calendarYear,calendarMonth,d);
    const todayDateOnly = new Date(today2.getFullYear(),today2.getMonth(),today2.getDate());
    const isFuture = dateObj > todayDateOnly;
    let cls = 'cal-day';
    if(isToday) cls+=' today';
    if(isFuture) cls+=' future';
    else if(expDates.has(d)) cls+=' has-spend';
    else cls+=' no-spend';
    html+='<div class="'+cls+'">'+d+'</div>';
  }
  $('calendar-grid').innerHTML = html;
  
  // Legend
  const legendHtml = '<div class="cal-legend"><div class="cal-legend-item"><div class="cal-legend-dot no-spend"></div>No Spend Day</div><div class="cal-legend-item"><div class="cal-legend-dot has-spend"></div>Spent Money</div></div>';
  const existingLegend = $('calendar-grid').nextElementSibling;
  if(existingLegend && existingLegend.classList.contains('cal-legend')) existingLegend.remove();
  $('calendar-grid').insertAdjacentHTML('afterend', legendHtml);
  
  // Streaks
  computeStreaks();
}
function computeStreaks() {
  const u = getUser();
  const expDates = new Set(u.expenses.filter(e=>!e.isGroup).map(e=>e.date));
  // If no expenses at all, streak is 0
  if(expDates.size === 0) {
    $('streak-current').textContent = '0 days';
    $('streak-longest').textContent = (u.longestStreak||0)+' day'+((u.longestStreak||0)!==1?'s':'');
    return;
  }
  const today2 = new Date(); today2.setHours(0,0,0,0);
  let streak = 0;
  // Count consecutive days going backwards from yesterday (or today if no expense today)
  let d = new Date(today2);
  // If today already has an expense, streak resets to 0
  const todayStr = d.toISOString().split('T')[0];
  if(expDates.has(todayStr)) {
    $('streak-current').textContent = '0 days';
    if(0 > (u.longestStreak||0)) u.longestStreak = 0;
    $('streak-longest').textContent = (u.longestStreak||0)+' day'+((u.longestStreak||0)!==1?'s':'');
    return;
  }
  // Count from today going backwards while no expense exists
  while(true) {
    const ds = d.toISOString().split('T')[0];
    if(expDates.has(ds)) break;
    streak++;
    d.setDate(d.getDate()-1);
    // Safety: don't go beyond user's registration (approximate with 365 days)
    if(streak > 365) break;
  }
  $('streak-current').textContent = streak+' day'+(streak!==1?'s':'');
  if(streak > (u.longestStreak||0)) u.longestStreak = streak;
  $('streak-longest').textContent = (u.longestStreak||0)+' day'+((u.longestStreak||0)!==1?'s':'');
}

function renderRecentExpenses() {
  const u = getUser();
  const recent = u.expenses.filter(e=>!e.isGroup).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  if(!recent.length) { $('recent-expenses-list').innerHTML='<div class="empty-state">No expenses yet. Start tracking!</div>'; return; }
  let html='';
  recent.forEach(e => {
    const cat = CATEGORIES.find(c=>c.id===e.category)||CATEGORIES[12];
    const moodSvg = SVGS[e.mood] || '';
    html+='<div class="expense-row"><div class="expense-cat-icon">'+cat.icon+'</div><div class="expense-info"><div class="expense-desc">'+e.description+'</div><div class="expense-meta">'+cat.label+' • '+e.date+'</div></div><div class="expense-amount">'+fmt(e.amount)+'</div><div class="expense-mood">'+moodSvg+'</div></div>';
  });
  $('recent-expenses-list').innerHTML=html;
}

// ===== CALENDAR NAV =====
$('cal-prev').onclick = () => { calendarMonth--; if(calendarMonth<0){calendarMonth=11;calendarYear--;} renderCalendar(); };
$('cal-next').onclick = () => { calendarMonth++; if(calendarMonth>11){calendarMonth=0;calendarYear++;} renderCalendar(); };

// ===== EXPENSE MODAL =====
function initCategoryChips() {
  let html='';
  CATEGORIES.forEach(c => {
    html+='<div class="cat-chip" data-cat="'+c.id+'"><span class="cat-chip-icon">'+c.icon+'</span>'+c.label+'</div>';
  });
  $('category-chips').innerHTML=html;
  qsa('.cat-chip').forEach(chip => chip.onclick = () => {
    qsa('.cat-chip').forEach(c=>c.classList.remove('selected'));
    chip.classList.add('selected');
  });
}
function initExpenseModal() {
  $('fab-add-expense').onclick = () => { resetExpenseForm(); showModal('expense-modal-overlay'); };
  $('expense-modal-close').onclick = () => hideModal('expense-modal-overlay');
  $('expense-modal-overlay').onclick = e => { if(e.target===$('expense-modal-overlay')) hideModal('expense-modal-overlay'); };
  $('exp-date').value = today();
  $('exp-is-group').onchange = () => {
    const show = $('exp-is-group').checked;
    $('exp-group-fields').style.display = show?'block':'none';
    if(show) populateGroupSelect();
  };
  // Smart category auto-suggest
  $('exp-description').oninput = () => {
    const val = $('exp-description').value.toLowerCase();
    let detected = null;
    for(let catId in KEYWORD_MAP) {
      if(KEYWORD_MAP[catId].some(kw=>val.includes(kw))) { detected=catId; break; }
    }
    if(detected) {
      const cat = CATEGORIES.find(c=>c.id===detected);
      $('auto-category-hint').textContent = 'Category auto-detected: '+cat.label;
      qsa('.cat-chip').forEach(c=>{c.classList.remove('selected');if(c.dataset.cat===detected)c.classList.add('selected');});
    } else {
      $('auto-category-hint').textContent = '';
    }
  };
  // Save expense
  $('expense-form').onsubmit = e => {
    e.preventDefault();
    const btn = $('save-expense-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;

        const desc = $('exp-description').value.trim();
        const amount = parseFloat($('exp-amount').value);
        const selCat = qs('.cat-chip.selected');
        const category = selCat ? selCat.dataset.cat : 'other';
        const date = $('exp-date').value || today();
        const isGroup = $('exp-is-group').checked;
        if(!desc||!amount||amount<=0) return toast('Please fill description and amount');
        const expense = { id:uid(), description:desc, amount, category, date, mood:'neutral', isGroup:false };
        const u = getUser();
        if(isGroup) {
        const gid = $('exp-group-select').value;
        const paidBy = $('exp-who-paid').value;
        if(!gid) return toast('Select a group');
        const group = u.groups.find(g=>g.id===gid);
        if(!group) return toast('Group not found');
        const gExp = { id:uid(), description:desc, amount, category, date, paidBy, members:[...group.members], settled:{} };
        group.expenses.push(gExp);
        expense.isGroup = true;
        expense.groupId = gid;
        }
        u.expenses.push(expense);
        lastExpenseId = expense.id;
        hideModal('expense-modal-overlay');
        toast('Expense added!');
        showMoodPopup();
        if(currentPage==='dashboard') renderDashboard();
        else if(currentPage==='expenses') renderExpenses();
    }, 400);
  };
  // Voice
  initVoice();
}
function resetExpenseForm() {
  $('exp-description').value=''; $('exp-amount').value='';
  $('exp-date').value=today(); $('exp-is-group').checked=false;
  $('exp-group-fields').style.display='none';
  $('auto-category-hint').textContent='';
  qsa('.cat-chip').forEach(c=>c.classList.remove('selected'));
}
function populateGroupSelect() {
  const u = getUser();
  let html='<option value="">Select group</option>';
  u.groups.forEach(g => html+='<option value="'+g.id+'">'+g.name+'</option>');
  $('exp-group-select').innerHTML=html;
  $('exp-group-select').onchange = () => {
    const g = u.groups.find(gr=>gr.id===$('exp-group-select').value);
    if(g) {
      let mhtml='';
      g.members.forEach(m=>mhtml+='<option value="'+m+'">'+m+'</option>');
      $('exp-who-paid').innerHTML=mhtml;
    }
  };
}

// ===== MOOD POPUP =====
function showMoodPopup() {
  $('mood-popup').style.display='flex';
  if(moodTimeout) clearTimeout(moodTimeout);
  moodTimeout = setTimeout(()=>{ $('mood-popup').style.display='none'; },6000);
  qsa('.mood-btn').forEach(btn => btn.onclick = () => {
    const u = getUser();
    const exp = u.expenses.find(e=>e.id===lastExpenseId);
    if(exp) exp.mood = btn.dataset.mood;
    $('mood-popup').style.display='none';
    if(moodTimeout) clearTimeout(moodTimeout);
    toast('Mood saved');
  });
}

// ===== VOICE =====
function initVoice() {
  $('mic-btn').onclick = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) { toast('Voice input not supported on this browser.'); return; }
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    $('listening-badge').style.display='flex';
    recognition.start();
    recognition.onresult = e => {
      $('listening-badge').style.display='none';
      const text = e.results[0][0].transcript.toLowerCase();
      // parse amount
      const numMatch = text.match(/(\d+)/);
      if(numMatch) $('exp-amount').value = numMatch[1];
      // parse category
      let detCat = null;
      for(let catId in KEYWORD_MAP) {
        if(KEYWORD_MAP[catId].some(kw=>text.includes(kw))) { detCat=catId; break; }
      }
      if(detCat) {
        qsa('.cat-chip').forEach(c=>{c.classList.remove('selected');if(c.dataset.cat===detCat)c.classList.add('selected');});
        const cat = CATEGORIES.find(c=>c.id===detCat);
        $('auto-category-hint').textContent = 'Category auto-detected: '+cat.label;
      }
      // parse date
      if(text.includes('yesterday')) {
        const yd = new Date(); yd.setDate(yd.getDate()-1);
        $('exp-date').value = yd.toISOString().split('T')[0];
      }
      // set description
      $('exp-description').value = text;
      showModal('expense-modal-overlay');
      toast('Voice parsed! Review and save.');
    };
    recognition.onerror = () => {
      $('listening-badge').style.display='none';
      showModal('expense-modal-overlay');
      toast("Couldn't detect details — please fill in manually.");
    };
    recognition.onend = () => { $('listening-badge').style.display='none'; };
  };
}

// ===== GROUPS =====
function initGroupModal() {
  $('create-group-btn').onclick = () => showModal('group-modal-overlay');
  $('group-modal-close').onclick = () => hideModal('group-modal-overlay');
  $('group-modal-overlay').onclick = e => { if(e.target===$('group-modal-overlay')) hideModal('group-modal-overlay'); };
  $('grp-is-trip').onchange = () => { $('trip-fields').style.display=$('grp-is-trip').checked?'block':'none'; };
  $('group-form').onsubmit = e => {
    e.preventDefault();
    const btn = $('group-form').querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;

        const name = $('grp-name').value.trim();
        const desc = $('grp-desc').value.trim();
        const membersStr = $('grp-members').value.trim();
        if(!name||!membersStr) return toast('Name and members required');
        const members = membersStr.split(',').map(s=>s.trim()).filter(Boolean);
        const u = getUser();
        members.push(u.name); // add self
        const uniqueMembers = [...new Set(members)];
        const group = { id:uid(), name, desc, members:uniqueMembers, expenses:[], isTrip:$('grp-is-trip').checked };
        if(group.isTrip) {
        group.tripEnd = $('grp-trip-end').value;
        group.tripBudget = parseFloat($('grp-trip-budget').value)||0;
        group.subBudgets = {
            Food: parseFloat($('trip-sub-food').value)||0,
            Transport: parseFloat($('trip-sub-transport').value)||0,
            Hotels: parseFloat($('trip-sub-hotels').value)||0,
            Activities: parseFloat($('trip-sub-activities').value)||0,
            Other: parseFloat($('trip-sub-other').value)||0
        };
        group.tripStart = today();
        }
        u.groups.push(group);
        hideModal('group-modal-overlay');
        $('group-form').reset();
        toast('Group created!');
        renderGroups();
    }, 400);
  };
  // Share modal close
  $('share-modal-close').onclick = () => hideModal('share-modal-overlay');
  $('share-modal-overlay').onclick = e => { if(e.target===$('share-modal-overlay')) hideModal('share-modal-overlay'); };
  // Simplify modal close
  $('simplify-modal-close').onclick = () => hideModal('simplify-modal-overlay');
  $('simplify-modal-overlay').onclick = e => { if(e.target===$('simplify-modal-overlay')) hideModal('simplify-modal-overlay'); };
  // Edit profile modal
  $('edit-profile-modal-close').onclick = () => hideModal('edit-profile-modal-overlay');
  $('edit-profile-modal-overlay').onclick = e => { if(e.target===$('edit-profile-modal-overlay')) hideModal('edit-profile-modal-overlay'); };
}
function renderGroups() {
  const u = getUser();
  if(!u.groups.length) { $('groups-list').innerHTML='<div class="empty-state">No groups yet. Create one to start splitting!</div>'; return; }
  let html='';
  u.groups.forEach(g => {
    let net = 0;
    g.expenses.forEach(exp => {
      const share = exp.amount / exp.members.length;
      if(exp.paidBy===u.name) {
        exp.members.forEach(m=>{if(m!==u.name&&!(exp.settled&&exp.settled[m])) net+=share;});
      } else {
        if(!(exp.settled&&exp.settled[u.name])) net-=share;
      }
    });
    const totalSpend = g.expenses.reduce((s,e)=>s+e.amount,0);
    const balClass = net>=0?'positive':'negative';
    html+='<div class="group-card" data-gid="'+g.id+'">';
    html+='<div class="group-card-name">'+(g.isTrip?SVGS.trip:'')+g.name+'</div>';
    html+='<div class="group-card-meta">'+g.members.length+' members • Total: '+fmt(totalSpend)+'</div>';
    html+='<div class="group-balance '+balClass+'">'+(net>=0?'You are owed ':'You owe ')+fmt(Math.abs(net))+'</div>';
    html+='</div>';
  });
  $('groups-list').innerHTML=html;
  qsa('.group-card').forEach(card => card.onclick = () => openGroupDetail(card.dataset.gid));
}
function openGroupDetail(gid) {
  currentGroupId = gid;
  const u = getUser();
  const g = u.groups.find(gr=>gr.id===gid);
  if(!g) return;
  // Show group detail page
  qsa('.page').forEach(p=>p.classList.remove('active-page'));
  $('page-group-detail').classList.add('active-page');
  $('group-detail-name').innerHTML = (g.isTrip?SVGS.trip:'')+g.name;
  // Members
  $('group-members-bar').innerHTML = g.members.map(m=>'<span class="member-tag">'+m+'</span>').join('');
  // Trip budget panel
  if(g.isTrip && g.subBudgets) {
    $('trip-budget-panel').style.display='block';
    let barsHtml='', warningsHtml='';
    const tripCatMap = { Food:['java-food','canteen','delivery','market'], Transport:['transport'], Hotels:['rent'], Activities:['entertainment'], Other:['other','library','recharge','medical','shopping','fees'] };
    const now2 = new Date();
    const tripEnd = new Date(g.tripEnd);
    const tripStart = new Date(g.tripStart||g.expenses[0]?.date||today());
    const daysLeft = Math.max(1,Math.ceil((tripEnd-now2)/(86400000)));
    const totalDays = Math.max(1,Math.ceil((tripEnd-tripStart)/(86400000)));
    for(let cat in g.subBudgets) {
      const budget = g.subBudgets[cat];
      if(!budget) continue;
      const catIds = tripCatMap[cat]||[];
      const spent = g.expenses.filter(e=>catIds.includes(e.category)).reduce((s,e)=>s+e.amount,0);
      const pct = Math.min(100,Math.round(spent/budget*100));
      const over = pct>100?'over':'';
      barsHtml+='<div class="budget-bar-wrap"><div class="budget-bar-label"><span>'+cat+'</span><span>'+fmt(spent)+' / '+fmt(budget)+'</span></div><div class="budget-bar"><div class="budget-bar-fill '+over+'" style="width:'+pct+'%"></div></div></div>';
      // Burn rate warning
      const daysPassed = totalDays - daysLeft;
      if(daysPassed>0) {
        const dailyRate = spent / daysPassed;
        const projected = dailyRate * daysLeft;
        if(spent + projected > budget && spent < budget) {
          const daysToExhaust = Math.round((budget-spent)/dailyRate);
          warningsHtml+='<div class="budget-warning">At this rate, '+cat+' budget runs out in '+daysToExhaust+' days.</div>';
        }
      }
    }
    $('trip-budget-bars').innerHTML=barsHtml;
    $('trip-budget-warnings').innerHTML=warningsHtml;
  } else {
    $('trip-budget-panel').style.display='none';
  }
  // Group expenses
  renderGroupExpenses(g);
  // Add group expense button
  $('add-group-expense-btn').onclick = () => {
    resetExpenseForm();
    $('exp-is-group').checked = true;
    $('exp-group-fields').style.display='block';
    populateGroupSelect();
    $('exp-group-select').value = gid;
    $('exp-group-select').dispatchEvent(new Event('change'));
    showModal('expense-modal-overlay');
  };
}
function renderGroupExpenses(g) {
  if(!g.expenses.length) { $('group-expenses-list').innerHTML='<div class="empty-state">No group expenses yet.</div>'; return; }
  let html='';
  g.expenses.forEach(exp => {
    const share = (exp.amount / exp.members.length).toFixed(0);
    const cat = CATEGORIES.find(c=>c.id===exp.category)||CATEGORIES[12];
    html+='<div class="expense-row"><div class="expense-cat-icon">'+cat.icon+'</div><div class="expense-info"><div class="expense-desc">'+exp.description+'</div><div class="expense-meta">Paid by '+exp.paidBy+' • Each: '+fmt(share)+'</div></div><div class="expense-amount">'+fmt(exp.amount)+'</div><button class="btn btn-small btn-ghost" onclick="shareExpense(\''+g.id+'\',\''+exp.id+'\')">Share</button></div>';
  });
  $('group-expenses-list').innerHTML=html;
}
function shareExpense(gid,eid) {
  const u = getUser();
  const g = u.groups.find(gr=>gr.id===gid);
  const exp = g.expenses.find(e=>e.id===eid);
  if(!exp) return;
  const share = (exp.amount/exp.members.length).toFixed(0);
  let html='';
  exp.members.forEach(m => {
    if(m===exp.paidBy) return;
    const msg = 'Hey '+m+', just a heads up — '+exp.paidBy+' paid '+fmt(exp.amount)+' for '+exp.description+'. Your share is '+fmt(share)+'. Please settle when you can! — via Splitr';
    html+='<div class="share-msg-block">'+msg+'<button class="copy-btn" onclick="copyText(this,`'+msg.replace(/`/g,"\\`")+'`)">'+SVGS.copy+' Copy</button></div>';
  });
  $('share-modal-body').innerHTML=html;
  showModal('share-modal-overlay');
}
function copyText(btn,text) {
  navigator.clipboard.writeText(text).then(()=>{btn.innerHTML='Copied!';setTimeout(()=>btn.innerHTML=SVGS.copy+' Copy',2000);});
  toast('Copied to clipboard!');
}

// ===== EXPENSES PAGE =====
function populateFilterDropdowns() {
  let catHtml='<option value="">All Categories</option>';
  CATEGORIES.forEach(c=>catHtml+='<option value="'+c.id+'">'+c.label+'</option>');
  $('expense-filter-cat').innerHTML=catHtml;
  let monthHtml='<option value="">All Months</option>';
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  months.forEach((m,i)=>monthHtml+='<option value="'+i+'">'+m+'</option>');
  $('expense-filter-month').innerHTML=monthHtml;
  $('expense-search').oninput=$('expense-filter-cat').onchange=$('expense-filter-month').onchange=$('expense-sort').onchange=()=>renderExpenses();
}
function renderExpenses() {
  const u = getUser();
  let exps = u.expenses.filter(e=>!e.isGroup);
  const search = $('expense-search').value.toLowerCase();
  const catFilter = $('expense-filter-cat').value;
  const monthFilter = $('expense-filter-month').value;
  const sort = $('expense-sort').value;
  if(search) exps = exps.filter(e=>e.description.toLowerCase().includes(search));
  if(catFilter) exps = exps.filter(e=>e.category===catFilter);
  if(monthFilter!=='') exps = exps.filter(e=>new Date(e.date).getMonth()===parseInt(monthFilter));
  if(sort==='date-desc') exps.sort((a,b)=>new Date(b.date)-new Date(a.date));
  else if(sort==='date-asc') exps.sort((a,b)=>new Date(a.date)-new Date(b.date));
  else if(sort==='amount-desc') exps.sort((a,b)=>b.amount-a.amount);
  else if(sort==='amount-asc') exps.sort((a,b)=>a.amount-b.amount);
  if(!exps.length) { $('expenses-full-list').innerHTML='<div class="empty-state">No expenses found.</div>'; return; }
  let html='';
  exps.forEach(e => {
    const cat = CATEGORIES.find(c=>c.id===e.category)||CATEGORIES[12];
    const moodSvg = SVGS[e.mood] || '';
    html+='<div class="expense-row" data-eid="'+e.id+'"><div class="expense-cat-icon">'+cat.icon+'</div><div class="expense-info"><div class="expense-desc">'+e.description+'</div><div class="expense-meta">'+cat.label+' • '+e.date+'</div></div><div class="expense-amount">'+fmt(e.amount)+'</div><div class="expense-mood">'+moodSvg+'</div></div>';
    html+='<div class="expense-detail-expanded" id="detail-'+e.id+'" style="display:none"><p><strong>Description:</strong> '+e.description+'</p><p><strong>Amount:</strong> '+fmt(e.amount)+'</p><p><strong>Category:</strong> '+cat.label+'</p><p><strong>Date:</strong> '+e.date+'</p><p><strong>Mood:</strong> '+(e.mood||'neutral')+'</p><button class="btn btn-danger btn-small" onclick="deleteExpense(\''+e.id+'\')">Delete</button></div>';
  });
  $('expenses-full-list').innerHTML=html;
  qsa('#expenses-full-list .expense-row').forEach(row => row.onclick = () => {
    const det = $('detail-'+row.dataset.eid);
    det.style.display = det.style.display==='none'?'block':'none';
  });
}
function deleteExpense(eid) {
  const u = getUser();
  u.expenses = u.expenses.filter(e=>e.id!==eid);
  toast('Expense deleted');
  renderExpenses();
  if(currentPage==='dashboard') renderDashboard();
}

// ===== SETTLEMENTS =====
function renderSettlements() {
  const u = getUser();
  let debts = [];
  u.groups.forEach(g => {
    g.expenses.forEach(exp => {
      const share = exp.amount / exp.members.length;
      exp.members.forEach(m => {
        if(m!==exp.paidBy && !(exp.settled&&exp.settled[m])) {
          debts.push({ from:m, to:exp.paidBy, amount:share, groupName:g.name, expId:exp.id, groupId:g.id });
        }
      });
    });
  });
  if(!debts.length) { $('settlements-list').innerHTML='<div class="empty-state">No pending settlements. All clear!</div>'; return; }
  let html='';
  // Group debts by group
  const grouped = {};
  debts.forEach(d => { if(!grouped[d.groupId]) grouped[d.groupId]={name:d.groupName,debts:[],id:d.groupId}; grouped[d.groupId].debts.push(d); });
  for(let gid in grouped) {
    const gd = grouped[gid];
    html+='<div class="section-card"><h3 style="margin-bottom:12px">'+gd.name+'</h3>';
    if(gd.debts.length>=3) {
      html+='<button class="btn btn-primary btn-small" onclick="simplifyDebts(\''+gid+'\')" style="margin-bottom:12px">Simplify Debts</button>';
    }
    gd.debts.forEach(d => {
      html+='<div class="settlement-row"><span class="settlement-text">'+d.from+' owes '+d.to+'</span><span class="settlement-amount">'+fmt(d.amount)+'</span><button class="btn btn-small btn-primary" onclick="markSettled(\''+d.groupId+'\',\''+d.expId+'\',\''+d.from+'\')">Mark Settled</button></div>';
    });
    html+='</div>';
  }
  $('settlements-list').innerHTML=html;
}
function markSettled(gid,eid,member) {
  const u = getUser();
  const g = u.groups.find(gr=>gr.id===gid);
  const exp = g.expenses.find(e=>e.id===eid);
  if(!exp.settled) exp.settled={};
  exp.settled[member]=true;
  toast(member+' settled!');
  renderSettlements();
}
function simplifyDebts(gid) {
  const u = getUser();
  const g = u.groups.find(gr=>gr.id===gid);
  if(!g) return;
  
  $('simplify-modal-body').innerHTML = '<div style="text-align:center;padding:20px;"><div class="spinner" style="margin: 0 auto;"></div><p style="margin-top:12px;color:var(--text2)">Simplifying debts...</p></div>';
  showModal('simplify-modal-overlay');

  setTimeout(() => {
    // Compute net balances
    const balances = {};
    g.members.forEach(m=>balances[m]=0);
    g.expenses.forEach(exp => {
        const share = exp.amount / exp.members.length;
        exp.members.forEach(m => {
        if(!(exp.settled&&exp.settled[m])) {
            if(m===exp.paidBy) balances[m]+=(exp.amount-share);
            else balances[m]-=share;
        }
        });
    });
    // Greedy simplification
    let creditors=[], debtors=[];
    for(let m in balances) {
        if(balances[m]>0.5) creditors.push({name:m,amount:balances[m]});
        else if(balances[m]<-0.5) debtors.push({name:m,amount:-balances[m]});
    }
    creditors.sort((a,b)=>b.amount-a.amount);
    debtors.sort((a,b)=>b.amount-a.amount);
    const originalCount = g.expenses.reduce((c,exp)=>{
        exp.members.forEach(m=>{if(m!==exp.paidBy&&!(exp.settled&&exp.settled[m]))c++;});return c;
    },0);
    const steps = [];
    let ci=0,di=0;
    while(ci<creditors.length && di<debtors.length) {
        const amt = Math.min(creditors[ci].amount,debtors[di].amount);
        if(amt>0.5) steps.push({from:debtors[di].name,to:creditors[ci].name,amount:Math.round(amt)});
        creditors[ci].amount-=amt;
        debtors[di].amount-=amt;
        if(creditors[ci].amount<0.5) ci++;
        if(debtors[di].amount<0.5) di++;
    }
    const saved = originalCount - steps.length;
    let html='<div class="simplify-saved">Simplified! '+(saved>0?saved+' transaction'+(saved>1?'s':'')+' saved.':'Optimal already.')+'</div>';
    steps.forEach((s,i) => {
        html+='<div class="simplified-step"><span>'+(i+1)+'. '+s.from+' pays '+s.to+' '+fmt(s.amount)+'</span><button class="btn btn-small btn-primary" onclick="this.textContent=\'Done\';this.disabled=true">Mark Done</button></div>';
    });
    if(!steps.length) html+='<div class="empty-state">No debts to simplify!</div>';
    $('simplify-modal-body').innerHTML=html;
  }, 600);
}

// ===== REPORTS =====
function renderReports() {
  $('report-month-label').textContent = monthName(reportMonth,reportYear);
  renderChart();
  renderRegretReport();
  $('report-card-content').style.display='none';
}
function renderChart() {
  const canvas = $('report-chart');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const u = getUser();
  const exps = u.expenses.filter(e=>!e.isGroup&&isSameMonth(e.date,reportMonth,reportYear));
  if(!exps.length) {
    ctx.fillStyle = '#9E8070';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('No data for this month', canvas.width/2, canvas.height/2);
    return;
  }
  const cats = {};
  exps.forEach(e => { cats[e.category] = (cats[e.category]||0) + e.amount; });
  let max = 0;
  for(let c in cats) if(cats[c]>max) max=cats[c];
  
  const barWidth = 40;
  const spacing = 30;
  const startX = 50;
  const bottomY = canvas.height - 40;
  const maxBarHeight = canvas.height - 80;
  
  let i = 0;
  for(let c in cats) {
    const h = (cats[c]/max) * maxBarHeight;
    const x = startX + i*(barWidth+spacing);
    // Draw bar
    ctx.fillStyle = '#F4845F';
    ctx.beginPath();
    ctx.roundRect(x, bottomY-h, barWidth, h, [8,8,0,0]);
    ctx.fill();
    // Label
    ctx.fillStyle = '#3A2E28';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    const catLabel = CATEGORIES.find(cat=>cat.id===c)?.label.split(' ')[0]||'Other';
    ctx.fillText(catLabel, x+barWidth/2, bottomY+20);
    // Amount
    ctx.fillStyle = '#9E8070';
    ctx.font = 'bold 12px Inter';
    ctx.fillText(fmt(cats[c]), x+barWidth/2, bottomY-h-10);
    i++;
  }
}
function renderRegretReport() {
  const u = getUser();
  const exps = u.expenses.filter(e=>!e.isGroup&&isSameMonth(e.date,reportMonth,reportYear)&&e.mood==='regret');
  if(!exps.length) { $('regret-report-content').innerHTML='<div class="empty-state">No regret-tagged expenses this month. Great job!</div>'; return; }
  let total = exps.reduce((s,e)=>s+e.amount,0);
  let html='<p style="margin-bottom:16px;color:var(--text2)">You tagged <strong>'+exps.length+'</strong> expenses as "Regret" this month, totaling <strong>'+fmt(total)+'</strong>.</p>';
  exps.forEach(e => {
    const cat = CATEGORIES.find(c=>c.id===e.category)||CATEGORIES[12];
    html+='<div class="expense-row"><div class="expense-cat-icon">'+cat.icon+'</div><div class="expense-info"><div class="expense-desc">'+e.description+'</div><div class="expense-meta">'+cat.label+' • '+e.date+'</div></div><div class="expense-amount">'+fmt(e.amount)+'</div></div>';
  });
  $('regret-report-content').innerHTML=html;
}

$('report-prev').onclick = () => { reportMonth--; if(reportMonth<0){reportMonth=11;reportYear--;} renderReports(); };
$('report-next').onclick = () => { reportMonth++; if(reportMonth>11){reportMonth=0;reportYear++;} renderReports(); };

$('generate-report-card-btn').onclick = () => {
  const btn = $('generate-report-card-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner"></div> Generating...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    const u = getUser();
    const exps = u.expenses.filter(e=>!e.isGroup&&isSameMonth(e.date,reportMonth,reportYear));
    const totalSpent = exps.reduce((s,e)=>s+e.amount,0);
    const totalBudget = Object.values(u.budgets||{}).reduce((s,v)=>s+Number(v),0);
    
    let grade = 'A';
    if(totalBudget>0) {
        if(totalSpent > totalBudget*1.2) grade = 'C';
        else if(totalSpent > totalBudget) grade = 'B';
    }
    
    let html = '<div class="report-card-display">';
    html += '<div class="report-grade">'+grade+'</div>';
    html += '<div class="report-stat"><span>Total Spent</span><span>'+fmt(totalSpent)+'</span></div>';
    if(totalBudget>0) html += '<div class="report-stat"><span>Budget</span><span>'+fmt(totalBudget)+'</span></div>';
    html += '<div class="report-stat"><span>Transactions</span><span>'+exps.length+'</span></div>';
    const regret = exps.filter(e=>e.mood==='regret').reduce((s,e)=>s+e.amount,0);
    html += '<div class="report-stat"><span>Regret Spending</span><span>'+fmt(regret)+'</span></div>';
    
    let tip = 'Keep up the good work! You are managing your expenses well.';
    if(grade === 'C') tip = 'Try to cut back on discretionary spending next month. You exceeded your budget.';
    else if(regret > totalSpent * 0.2) tip = 'You had a lot of regret spending. Consider a 24-hour rule before buying.';
    
    html += '<div class="report-tip">'+tip+'</div></div>';
    $('report-card-content').innerHTML = html;
    $('report-card-content').style.display = 'block';
  }, 800);
};

// ===== CHALLENGES =====
function renderChallenges() {
  const u = getUser();
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  if(!u.challenges) u.challenges={};
  let html='';
  CHALLENGES_DEF.forEach(c => {
    let progress = 0, target = 100, status = 'active'; // dummy logic for display
    if(c.id==='food150') {
      const spent = u.expenses.filter(e=>!e.isGroup&&e.date===today()&&(e.category==='java-food'||e.category==='canteen'||e.category==='delivery')).reduce((s,e)=>s+e.amount,0);
      progress = Math.min(100, (spent/150)*100);
      if(spent>150) status = 'failed';
    } else if(c.id==='noent7') {
      progress = 30; // mock
    }
    html+='<div class="challenge-card">';
    html+='<div class="challenge-name">'+c.name+'</div>';
    html+='<div class="challenge-desc">'+c.desc+'</div>';
    html+='<div class="challenge-progress-bar"><div class="challenge-progress-fill '+(status==='failed'?'failed':'')+'" style="width:'+progress+'%"></div></div>';
    html+='<div class="challenge-status '+status+'">'+(status==='active'?'In Progress':status==='failed'?'Failed':'Completed')+'</div>';
    html+='</div>';
  });
  $('challenges-list').innerHTML=html;
}

// ===== PROFILE =====
function renderProfile() {
  const u = getUser();
  let phtml = '<div class="profile-avatar">'+u.name.charAt(0).toUpperCase()+'</div>';
  phtml += '<div class="profile-name">'+u.name+'</div>';
  phtml += '<div class="profile-email">'+u.email+'</div>';
  if(u.srmVerified) phtml += '<div class="srm-badge">SRM Verified</div>';
  phtml += '<br>';
  if(u.personality) phtml += '<div class="personality-badge-large">'+PERSONALITY_TYPES[u.personality].name+'</div>';
  if(u.hostel) phtml += '<div class="profile-detail">Hostel/PG: '+u.hostel+'</div>';
  if(u.year) phtml += '<div class="profile-detail">Year: '+u.year+'</div>';
  phtml += '<button class="btn btn-ghost" onclick="showModal(\'edit-profile-modal-overlay\')" style="margin-top:20px;">Edit Profile</button>';
  $('profile-card').innerHTML = phtml;
  
  // Fill edit form
  $('edit-name').value = u.name;
  $('edit-hostel').value = u.hostel||'';
  $('edit-year').value = u.year||'';
  
  // Budgets
  let bhtml='';
  CATEGORIES.forEach(c => {
    const val = (u.budgets&&u.budgets[c.id])||'';
    bhtml+='<div class="budget-row"><label>'+c.icon+' '+c.label+'</label><input type="number" id="budget-'+c.id+'" placeholder="₹ Amount" value="'+val+'"></div>';
  });
  $('budget-settings').innerHTML=bhtml;
}

$('edit-profile-form').onsubmit = e => {
  e.preventDefault();
  const u = getUser();
  u.name = $('edit-name').value.trim();
  u.hostel = $('edit-hostel').value.trim();
  u.year = $('edit-year').value;
  hideModal('edit-profile-modal-overlay');
  toast('Profile updated');
  $('sidebar-user-name').textContent = u.name;
  $('sidebar-avatar').textContent = u.name.charAt(0).toUpperCase();
  renderProfile();
};

$('save-budgets-btn').onclick = () => {
  const btn = $('save-budgets-btn');
  const originalText = btn.textContent;
  btn.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div>';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    const u = getUser();
    if(!u.budgets) u.budgets={};
    CATEGORIES.forEach(c => {
        const val = $('budget-'+c.id).value;
        if(val) u.budgets[c.id] = parseFloat(val);
        else delete u.budgets[c.id];
    });
    toast('Budgets saved');
    if(currentPage==='dashboard') renderDashboard();
  }, 400);
};
