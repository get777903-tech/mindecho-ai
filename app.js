/* ==========================================================================
   MindEcho AI — Main Application & Engine Script
   ========================================================================== */

// Configurable Webhook URL for Google Sheets logging
const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx_DEMO_MINDECHO_WEBHOOK/exec";

// Audio Track File Name
const MEDITATION_AUDIO_SRC = "meditation1.mp3";

// Global Application State
const appState = {
  lang: 'ru',
  isRecording: false,
  isPlayingAudio: false,
  isAnnualBilling: false,
  selectedPlan: 'Premium',
  selectedPrice: 14.99,
  audioTrack: null
};

// Multilingual Dictionary (RU, EN, HE)
const i18n = {
  ru: {
    nav_mission: "Миссия",
    nav_modes: "Аудиорежимы",
    nav_generator: "Студия",
    nav_pricing: "Тарифы",
    btn_login: "Войти",
    hero_badge: "ИИ + Детская Нейропсихология + КПТ",
    hero_title: "Превращаем родительскую рутину в <span class='text-gradient'>бережную терапию</span>",
    hero_subtitle: "Мы создаем глобальное технологическое решение для защиты ментального здоровья семей. Легальный способ сохранить эмоциональные ресурсы родителей и вырастить счастливого ребенка.",
    btn_try_free: "🚀 Попробовать бесплатно (2 запроса/день)",
    btn_support_project: "[ Поддержать проект / Получить ссылку ]",
    tag_supermission: "Супермиссия MindEcho AI",
    title_supermission: "4 Столпа Общественного Проекта",
    sub_supermission: "Мы создаем не просто коммерческий софт, а самую защищенную и научно выверенную экосистему для ментального здоровья семей во всем мире.",
    m1_title: "1. Глобальная инклюзивность",
    m1_desc: "Стираем социальное и экономическое неравенство. Платформа доступна даже для малоимущих семей — каждый ребенок имеет право на здоровое развитие. Диалог по КПТ и ACT с супервизором.",
    m2_title: "2. Гармония в доме без ссор",
    m2_desc: "Прогрессивные аудиорежимы и геймификация привычек исключают из жизни семьи истерики, упреки и обиды, мягко повышая эмоциональный интеллект (EQ).",
    m3_title: "3. Сбережение энергии родителей",
    m3_desc: "Защищаем родителей от выгорания, гарантируя 1–2 часа личного времени в день, а детей — от ментального перенапряжения.",
    m4_title: "4. Искоренение детских психотравм",
    m4_desc: "Превентивно и мягко исцеляем дневные стрессы, обиды и страхи ребенка прямо в процессе засыпания, программируя на уверенность.",
    tag_modes: "Быстрый запуск",
    title_modes: "3 Входных Аудиорежима Терапии",
    sub_modes: "Выберите требуемый сценарий для мгновенной генерации рассказа-медитации или помощи",
    mode_morning_title: "Утренняя медитация",
    mode_morning_desc: "Заряд бодрости, веры в свои силы, лёгкости в учебе и радости перед новым днем.",
    btn_start_morning: "Запустить утренний настрой",
    mode_bedtime_title: "Медитация перед сном",
    mode_bedtime_desc: "Мягкий уход в сон, снятие дневных обид, растворение страхов и выработка глубинного покоя.",
    btn_start_bedtime: "Запустить сонную терапию",
    mode_emergency_title: "Экстренная помощь при истерике",
    mode_emergency_desc: "Мгновенный 4-шаговый алгоритм для родителя + экспресс-генерация аудио для заземления ребенка.",
    btn_start_emergency: "🚨 Активировать скорую помощь",
    btn_gen_emergency: "✨ Сгенерировать экспресс-аудио",
    tag_studio: "Студия Медитации",
    title_studio: "Персональный Рассказ-Медитация",
    sub_studio: "Студийная фонограмма высокого качества (MP3)",
    btn_generate: "✨ Запустить рассказ-медитацию (MP3)",
    tag_pricing: "Прозрачная монетизация",
    title_pricing: "Выберите Тариф Подписки",
    sub_pricing: "Freemium доступ + Лимиты генерации + Докупка минут",
    btn_plan_free: "Начать бесплатно",
    btn_plan_basic: "Выбрать Базовый",
    btn_plan_premium: "Активировать Премиум",
    btn_plan_platinum: "Выбрать Платиновый",
    sticky_text: "Инвестируйте в гармонию семьи от $7/мес",
    btn_choose_plan: "Выбрать тариф"
  },
  en: {
    nav_mission: "Mission",
    nav_modes: "Audio Modes",
    nav_generator: "Studio",
    nav_pricing: "Pricing",
    btn_login: "Log In",
    hero_badge: "AI + Child Neuropsychology + CBT",
    hero_title: "Transforming parenting routine into <span class='text-gradient'>gentle therapy</span>",
    hero_subtitle: "We build a global tech ecosystem for family mental health. A legal way to save parents' emotional resources and raise happy children.",
    btn_try_free: "🚀 Try Free (2 requests/day)",
    btn_support_project: "[ Support Project / Get Link ]",
    tag_supermission: "MindEcho AI Super-Mission",
    title_supermission: "4 Pillars of Public Impact",
    sub_supermission: "Creating a scientifically validated and secure ecosystem for family mental health worldwide.",
    m1_title: "1. Global Inclusivity",
    m1_desc: "Erasing social inequality. Platform remains accessible even for low-income families — every child deserves healthy mental growth.",
    m2_title: "2. Family Harmony Without Fights",
    m2_desc: "Progressive audio modes eliminate tantrums and resentment, gently boosting emotional intelligence (EQ).",
    m3_title: "3. Saving Parents' Energy",
    m3_desc: "Protecting parents from burnout, guaranteeing 1–2 hours of personal daily time.",
    m4_title: "4. Preventing Child Trauma",
    m4_desc: "Gently healing daytime stress and fears right during sleep transition, programming confidence.",
    tag_modes: "Quick Launch",
    title_modes: "3 Core Audio Therapy Modes",
    sub_modes: "Select a scenario for instant personalized narrative meditation or emergency relief",
    mode_morning_title: "Morning Meditation",
    mode_morning_desc: "Boost of energy, self-belief, learning ease, and joy for the new day.",
    btn_start_morning: "Start Morning Vibe",
    mode_bedtime_title: "Bedtime Meditation",
    mode_bedtime_desc: "Gentle sleep transition, dissolving daytime fears, and cultivating deep peace.",
    btn_start_bedtime: "Start Sleep Therapy",
    mode_emergency_title: "Emergency Tantrum Relief",
    mode_emergency_desc: "Instant 4-step algorithm for parents + express audio for child grounding.",
    btn_start_emergency: "🚨 Activate Emergency Relief",
    btn_gen_emergency: "✨ Generate Express Audio",
    tag_studio: "Meditation Studio",
    title_studio: "Personal Narrative Meditation",
    sub_studio: "Studio Quality MP3 Audio Track",
    btn_generate: "✨ Play Narrative Meditation (MP3)",
    tag_pricing: "Transparent Pricing",
    title_pricing: "Select Subscription Plan",
    sub_pricing: "Freemium access + Generation credits + Top-up minutes",
    btn_plan_free: "Start Free",
    btn_plan_basic: "Choose Basic",
    btn_plan_premium: "Activate Premium",
    btn_plan_platinum: "Choose Platinum",
    sticky_text: "Invest in family harmony from $7/mo",
    btn_choose_plan: "Choose Plan"
  },
  he: {
    nav_mission: "משימה",
    nav_modes: "מצבי שמע",
    nav_generator: "סטודיו",
    nav_pricing: "תעריפים",
    btn_login: "התחבר",
    hero_badge: "בינה מלאכותית + נוירופסיכולוגיה",
    hero_title: "הופכים את שגרת ההורות ל<span class='text-gradient'>תרפיה עדינה</span>",
    hero_subtitle: "פתרון טכנולוגי גלובלי לבריאות הנפש של המשפחה. לשמור על המשאבים הרגשיים של ההורים ולגדל ילדים מאושרים.",
    btn_try_free: "🚀 נסה בחינם (2 בקשות ביום)",
    btn_support_project: "[ תמוך בפרויקט / קבל קישור ]",
    tag_supermission: "סופר-משימה של MindEcho AI",
    title_supermission: "4 עמודי התווך של הפרויקט",
    sub_supermission: "מערכת אקולוגית בטוחה ומוכחת מדעית לבריאות הנפש של משפחות ברחבי העולם.",
    m1_title: "1. הכלה גלובלית",
    m1_desc: "מחיקת אי-שוויון חברתי. הפלטפורמה נגישה לכל המשפחות — לכל ילד מגיעה צמיחה נפשית בריאה.",
    m2_title: "2. הרמוניה בבית ללא מריבות",
    m2_desc: "מצבי שמע מתקדמים מונעים התקפי זעם ומעלים בעדינות את האינטליגנציה הרגשית (EQ).",
    m3_title: "3. חיסכון באנרגיה של ההורים",
    m3_desc: "הגנה על ההורים מפני שחיקה, עם הבטחה ל-1–2 שעות זמן אישי ביום.",
    m4_title: "4. מניעת טראומות ילדות",
    m4_desc: "ריפוי עדין של פחדים ומתחים ישירות בתהליך ההרדמה, תוך תכנות ביטחון עצמי.",
    tag_modes: "הפעלה מהירה",
    title_modes: "3 מצבי טיפול בשמע",
    sub_modes: "בחר תרחיש ליצירה מיידית של מדיטציה או עזרה דחופה",
    mode_morning_title: "מדיטציית בוקר",
    mode_morning_desc: "חיזוק הביטחון, הקלה בלימודים ושמחה ליום החדש.",
    btn_start_morning: "התחל מדיטציית בוקר",
    mode_bedtime_title: "מדיטציה לפני השינה",
    mode_bedtime_desc: "מעבר עדין לשינה, הפגת פחדים וטיפוח שלווה עמוקה.",
    btn_start_bedtime: "התחל תרפיית שינה",
    mode_emergency_title: "עזרה דחופה בזמן התקף זעם",
    mode_emergency_desc: "אלגוריתם מיידי של 4 שלבים להורה + שמע מהיר לקרקוע הילד.",
    btn_start_emergency: "🚨 הפעל עזרה דחופה",
    btn_gen_emergency: "✨ צור שמע מהיר",
    tag_studio: "סטודיו מדיטציה",
    title_studio: "סיפור-מדיטציה אישי",
    sub_studio: "הקלטת MP3 באיכות אולפן",
    btn_generate: "✨ נגן סיפור-מדיטציה (MP3)",
    tag_pricing: "תמחור שקוף",
    title_pricing: "בחר תוכנית מנוי",
    sub_pricing: "גישת Freemium + קרדיטים ליצירה",
    btn_plan_free: "התחל בחינם",
    btn_plan_basic: "בחר בסיסי",
    btn_plan_premium: "הפעל פרימיום",
    btn_plan_platinum: "בחר פלטינום",
    sticky_text: "השקע בהרמוניה משפחתית החל מ-$7 לחודש",
    btn_choose_plan: "בחר תוכנית"
  }
};

// Base Meditation Master Template Text
const BASE_MEDITATION_TEMPLATE = `
{NAME}, я хочу взять тебя с собой в небольшое путешествие в волшебное место, где мысли становятся реальностью... И чтобы мы смогли туда попасть, нам нужно будет раскрыть свою душу. Так что слушай меня внимательно и давай отправимся в это весёлое путешествие.

Закрой глаза и начни дышать спокойно и ровно. Успокойся и расслабься, расслабься... Обрати внимание на свой нос. Найди его, не открывая глаз. Почувствуй его мысленно. Дыши спокойно и ровно, сосредоточься на ощущении воздуха у ноздрей.

А теперь обрати внимание на свои уши. Найди их, мысленно их ощути. Побудь с ними. Почувствуй их тепло и мысленно представь их форму.

А теперь обрати внимание на пространство между своими ушами внутри своей головы, вот на это пространство. Почувствуй его, понаблюдай за ним. 

А теперь обрати внимание на пространство вокруг своих ушей и за их пределами. Понаблюдай за ним. И обрати внимание на пространство вокруг всей своей головы, вот на это пространство. Ощути его мыслями, понаблюдай за ним, мысленно побудь в нем. Чувствуй, как твое внимание расширяется, словно невидимое облако вокруг головы.

А сейчас обрати внимание на пространство между своими ушами и стенами комнаты, где ты сейчас находишься, вот на это пространство. Ощути его, мысленно побудь в нем. Открой свой разум тому, насколько оно велико — оно повсюду вокруг тебя. Думай о том, как много свободного места в комнате, дыши легко и свободно.

А теперь давай отправимся в дружелюбное местечко. Представь, что у тебя в голове есть такое место, где тебе хорошо. Найди его и побудь там. Представь самое красивое и безопасное место, которое ты можешь вообразить, где мама и папа всегда рядом с тобой и помогают тебе.

Потому что это тот мир, который ты построил{GENDER_END} сам{GENDER_END} и в котором всё, во что ты веришь — это правда. Это тот самый мир, где всё действительно сбывается, где мысли становятся реальными и где всё, во что ты веришь, может случится. Думай о том, что в этом месте ты — настоящ{GENDER_ADJ} волшебни{GENDER_WIZARD} и всё подвластно твоей воле.

Поверь в то, что ты умн{GENDER_ADJ}, и что ты очень быстро и легко учишься. Поверь в это, и всё сбудется. Почувствуй уверенность в своих силах, думай о том, как легко тебе даются любые новые знания.

Поверь в то, что тебя очень сильно любят, и почувствуй это всем своим сердцем, и пусть душа наполнится счастьем. Представь теплое сияние в груди, вдыхай это чувство любви каждой клеточкой. Знай, что мама и папа тебя очень любят, мама и папа рады, что ты у них есть.

Поверь в то, что тебя любят и почувствуй это всем своим сердцем, и пусть душа наполнится счастьем. Это место, где у тебя верные друзья и отличные родственники.

Поверь в своих друзей и родственников и будь сам{GENDER_END} верн{GENDER_ADJ} друг{GENDER_FRIEND}. Обращайся с людьми так, как ты хочешь, чтобы обращались с тобой, и они станут твоими друзьями. Почувствуй это и будь добр{GENDER_END} к ним. Думай о своих близких с нежностью и добротой.

Поверь в то, что ты всегда можешь быть здоров{GENDER_ADJ}, и какое сильное у тебя тело. Ощути это и будь там здоров{GENDER_ADJ}. Почувствуй прилив энергии и силы в теле, дыши глубоко и уверенно.

Поверь в то, что ты счастливый человек, и ты будешь счастлива в жизни. Будь же счастлива в этом месте и верь в это. Улыбнись мысленно, почувствуй, как внутри тебя рождается тихая радость.

Поверь в то, что ты можешь слушать и всё понимать и хорошо выполнять то, о чем тебя просят. Ощути, что ты это можешь, и так всё и будет. Думай о своей способности быть внимательн{GENDER_ADJ} и заботливой.

Поверь, что все неприятности, которые тебя беспокоят, могут исчезнуть. Пусть беды растают, как снег под жаркими лучами солнца. Поверь, так и будет. На длинном выдохе представляй, как все твои страхи и тревоги просто испаряются.

Поверь в саму себя. Поверь, что ты можешь усердно трудиться и наслаждайся, когда приходится усердно трудиться, и ты насладишься, когда получишь, что хотела. Просто поверь, что ты способна ради чего-то постараться, и когда ты постараешься — ты это получишь. Думай о том, как приятно достигать целей своим трудом и старанием и как радостно помогать людям вокруг.

Поверь в себя, и ты станешь таким человеком, кем захочешь. Поверь же, что можешь быть кем захочешь, и ты станешь таким человеком. Подумай об этом. Представь себя в будущем, как выглядишь, как ты счастлива.

Будь уверена — это место, где мечты становятся реальностью. Поверь, что еда, которая тебе полезна, становится очень вкусной, и она будет очень вкусной. Почувствуй вкус и пользу здоровой пищи.

Поверь, что ты неповторима и талантлива, и у тебя есть множество отличных идей, и у тебя хватит смелости, чтобы их воплотить. Ты станешь волшебницей, полной отличных идей. Ощути свою уникальность, думай о своих способностях как о сокровищах. Вспомни, что мама и папа очень рады, что ты у них есть.

Стань же мысленно таким человеком просто ради веселья и от всей души полюби человека, который предстал — это же ты. Какой ты хочешь стать? Счастливой, здоровой, влюбленной в жизнь, свободной. Почувствуй огромную нежность и любовь к самой себе, дыши полной грудью. 

Ты всегда под защитой невидимой силы. Она всегда любит тебя и наблюдает за тобой. Она живет внутри тебя, помогает твоему сердцу биться, дает тебе жизнь и создает в этой жизни новые пути. Поверь в эту невидимую силу, ведь она верит в тебя. Приложи руку к сердцу, почувствуй его ритм, думай о том, что ты никогда не бываешь одна. 

Ты и есть волшебство своей жизни. Верь в волшебство, верь в реальность вещей и верь в возможности. Если ты веришь в возможности — ты веришь в себя. Доверяй же себе в этом мире. Почувствуй свою внутреннюю силу, думай про себя так: «Я всё могу».

Верь, что ты важна, что ты любима, что ты особенная, ты можешь изменить весь наш мир и в тебе есть величие. Поверь в то, что ты способна сделать что угодно. Ощути свою значимость, представь, как ты приносишь добро в этот мир.

Полюби же себя прямо сейчас, полюби свою жизнь прямо сейчас, полюби людей в своей жизни прямо сейчас и прости тех, кого ты не любишь, чтобы освободить больше места для любви. Мысленно отпусти все старые обиды, почувствуй, как на сердце становится легко и чисто.

Знай, что мама и папа тебя очень любят.

Теперь давай научим твое тело новым, чудесным чувствам. Что такое храбрость? Почувствуй прямо сейчас, каково это — быть совершенно бесстрашной. 
Что такое свобода? Почувствуй, каково это — быть абсолютно свободной и счастливой. 
Что такое изобилие? Почувствуй, что у тебя уже есть всё, что тебе нужно для счастья.
Что такое вдохновение? Представь, что у тебя появилась отличная идея и ты точно знаешь, как её исполнить.
Что такое жизненная сила? Почувствуй, что в тебе живет неограниченная энергия.Что такое страсть? Почувствуй, как сильно ты влюблена в свою жизнь.

Положи левую руку на сердце и благослови свое тело на новый, светлый разум. Благослови свою жизнь, которая полна приключений, и свою душу, которая всегда подсказывает тебе верный путь.

Открой свое сердце и вырази благодарность за свою новую, чудесную жизнь ещё до того, как она случилась. Благодарность — это знак того, что всё прекрасное уже произошло в твоем мире.

Что бы ни случилось, мама и папа будут тебя любить так же сильно.

Пришло время покинуть это место, но запомни: когда ты веришь, всё, что происходит в этом мире, происходит и в твоей жизни. Сохрани это состояние уверенности и внутреннего покоя.

Хорошенько потянись и вспомни, что пора возвращаться к той жизни, которой ты живешь, еще более бодрой и внимательной. Знай: сегодня с тобой могут произойти замечательные вещи. Сделай глубокий вдох, потянись всем телом, чувствуя прилив бодрости и сил.

Открой глаза и улыбнись жизни, и тогда она улыбнется тебе в ответ. Открывай глаза с широкой улыбкой, чувствуя готовность к прекрасному и счастливому дню.
`;

// Initialize Page Load & Audio Player
document.addEventListener('DOMContentLoaded', () => {
  setupScrollListener();
  registerServiceWorker();
  initAudioPlayer();
});

// Initialize Audio Element
function initAudioPlayer() {
  appState.audioTrack = new Audio(MEDITATION_AUDIO_SRC);

  appState.audioTrack.addEventListener('timeupdate', () => {
    if (appState.audioTrack.duration) {
      const progress = (appState.audioTrack.currentTime / appState.audioTrack.duration) * 100;
      document.getElementById('player-progress').style.width = `${progress}%`;
      
      const currentMin = Math.floor(appState.audioTrack.currentTime / 60);
      const currentSec = Math.floor(appState.audioTrack.currentTime % 60).toString().padStart(2, '0');
      document.getElementById('player-time').innerText = `${currentMin}:${currentSec}`;
    }
  });

  appState.audioTrack.addEventListener('ended', () => {
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
    document.getElementById('player-progress').style.width = "100%";
  });
}

// Switch Language
function switchLanguage(langKey) {
  appState.lang = langKey;
  
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (langKey === 'he') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', langKey);
  }

  const dictionary = i18n[langKey] || i18n.ru;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dictionary[key]) {
      el.innerHTML = dictionary[key];
    }
  });
}

// Scroll & Sticky Bar
function setupScrollListener() {
  const stickyBar = document.getElementById('sticky-bar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      stickyBar.classList.remove('hidden');
    } else {
      stickyBar.classList.add('hidden');
    }
  });
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// Select 3 Primary Audio Modes
function selectAudioMode(modeKey) {
  const typeSelect = document.getElementById('meditation-type');
  if (typeSelect) typeSelect.value = modeKey;

  const emergencyPanel = document.getElementById('emergency-panel');
  if (modeKey === 'emergency') {
    emergencyPanel.classList.remove('hidden');
    emergencyPanel.scrollIntoView({ behavior: 'smooth' });
  } else {
    emergencyPanel.classList.add('hidden');
    scrollToSection('generator');
  }

  logClickAnalytics('AudioMode_Select', modeKey, 0);
}

function closeEmergencyPanel() {
  document.getElementById('emergency-panel').classList.add('hidden');
}

// Generate Emergency Tantrum Audio
function generateEmergencyAudio() {
  const contextInput = document.getElementById('emergency-context').value || "Ребенок растревожен и не может успокоиться";
  const name = document.getElementById('child-name').value || "Ребенок";

  const emergencyScript = `
    ${name}, сделай глубокий выдох вместе со мной... Один... два... три... 
    Я знаю, что ситуация: "${contextInput}" вызывает много эмоций. 
    Но сейчас ты находишься в полной безопасности. 
    Почувствуй, как мягкая волна покоя наполняет твое тело. Ты сильный, ты любимый, ты справишься.
  `;

  document.getElementById('meditation-text-box').innerHTML = `<p><strong>🚨 ЭКСТРЕННОЕ АУДИО ЗАЗЕМЛЕНИЯ:</strong><br><br>${emergencyScript}</p>`;
  playMP3AudioTrack();

  logClickAnalytics('EmergencyAudio_Generated', contextInput, 0);
}

// Microphone Recording Simulation
function toggleVoiceRecord() {
  const micBtn = document.getElementById('mic-btn');
  const micText = document.getElementById('mic-text');
  const micWave = document.getElementById('mic-wave');

  if (!appState.isRecording) {
    appState.isRecording = true;
    micBtn.classList.add('recording');
    micText.innerText = "Идет запись голоса... Задайте вопрос";
    micWave.classList.remove('hidden');

    setTimeout(() => {
      if (appState.isRecording) {
        toggleVoiceRecord();
        alert("Голос записан! ИИ проанализировал тембр. Готов к воспроизведению студийный рассказ-медитация (MP3).");
      }
    }, 4000);
  } else {
    appState.isRecording = false;
    micBtn.classList.remove('recording');
    micText.innerText = "Запись завершена (Голос проанализирован)";
    micWave.classList.add('hidden');
  }

  logClickAnalytics('VoiceRecord_Toggled', appState.isRecording ? 'Start' : 'Stop', 0);
}

// Generate Personal Meditation Text & Play MP3 Audio Track
function generatePersonalMeditation() {
  const name = document.getElementById('child-name').value || "София";
  const gender = document.getElementById('child-gender').value;

  const isGirl = (gender === 'girl');
  const genderEnd = isGirl ? 'а' : '';
  const genderAdj = isGirl ? 'ая' : 'ый';
  const genderWizard = isGirl ? 'ца' : '';
  const genderFriend = isGirl ? 'ой' : 'ом';

  let customText = BASE_MEDITATION_TEMPLATE
    .replace(/{NAME}/g, name)
    .replace(/{GENDER_END}/g, genderEnd)
    .replace(/{GENDER_ADJ}/g, genderAdj)
    .replace(/{GENDER_WIZARD}/g, genderWizard)
    .replace(/{GENDER_FRIEND}/g, genderFriend);

  document.getElementById('meditation-text-box').innerText = customText;
  document.getElementById('player-title').innerText = `${name} — Рассказ-Медитация`;
  
  playMP3AudioTrack();

  logClickAnalytics('Meditation_Generated', name, 0);
}

// Play Studio Audio Track (meditation1.mp3)
function playMP3AudioTrack() {
  if (!appState.audioTrack) {
    initAudioPlayer();
  }

  if (appState.isPlayingAudio) {
    appState.audioTrack.pause();
    appState.isPlayingAudio = false;
    document.getElementById('play-btn').innerText = "▶";
  } else {
    appState.audioTrack.play().then(() => {
      appState.isPlayingAudio = true;
      document.getElementById('play-btn').innerText = "⏸";
    }).catch(err => {
      console.warn("Audio playback error, falling back to speech synthesis:", err);
      // Fallback to SpeechSynthesis if MP3 fails to load
      speakTextFallback();
    });
  }
}

function togglePlayAudio() {
  playMP3AudioTrack();
}

// Fallback Speech Synthesis if needed
function speakTextFallback() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const text = document.getElementById('meditation-text-box').innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.6;
  utterance.pitch = 0.75;
  window.speechSynthesis.speak(utterance);
}

// Pricing Toggle (Monthly vs Annual)
function toggleBillingCycle() {
  const isAnnual = document.getElementById('billing-switch').checked;
  appState.isAnnualBilling = isAnnual;

  const basicPrice = document.querySelector('.price-basic');
  const premiumPrice = document.querySelector('.price-premium');
  const platinumPrice = document.querySelector('.price-platinum');

  const premiumAnnualSub = document.querySelector('.price-premium-annual');
  const platinumAnnualSub = document.querySelector('.price-platinum-annual');

  if (isAnnual) {
    premiumPrice.innerHTML = "$59.99 <span>/ год</span>";
    platinumPrice.innerHTML = "$99.99 <span>/ год</span>";
    premiumAnnualSub.classList.remove('hidden');
    platinumAnnualSub.classList.remove('hidden');
  } else {
    premiumPrice.innerHTML = "$14.99 <span>/ месяц</span>";
    platinumPrice.innerHTML = "$24.99 <span>/ месяц</span>";
    premiumAnnualSub.classList.add('hidden');
    platinumAnnualSub.classList.add('hidden');
  }

  logClickAnalytics('BillingCycle_Toggled', isAnnual ? 'Annual' : 'Monthly', 0);
}

// Plan Selection & Checkout Modal
function selectPlan(planName, price) {
  appState.selectedPlan = planName;
  appState.selectedPrice = price;

  logClickAnalytics('TariffButton_Click', planName, price);

  if (price === 0) {
    openAuthModal('free');
  } else {
    document.getElementById('checkout-plan-name').innerText = planName;
    document.getElementById('checkout-plan-price').innerText = `$${price}`;
    document.getElementById('checkout-modal').classList.remove('hidden');
  }
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.add('hidden');
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  alert(`🎉 Подписка "${appState.selectedPlan}" успешно активирована! Добро пожаловать в экосистему MindEcho AI.`);
  closeCheckoutModal();
  logClickAnalytics('Payment_Completed', appState.selectedPlan, appState.selectedPrice);
}

// Auth Modal Handlers
function openAuthModal(type = 'login') {
  document.getElementById('auth-modal').classList.remove('hidden');
  logClickAnalytics('AuthModal_Opened', type, 0);
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function simulateSocialAuth(provider) {
  const userId = 'USER-' + Math.floor(100000 + Math.random() * 900000);
  const sampleName = provider === 'Google' ? 'Google User' : 'Apple User';
  const sampleEmail = provider.toLowerCase() + '_user@mindecho.ai';

  alert(`🎉 Вход через ${provider} выполнен успешно!\nВаш ID: ${userId}`);
  closeAuthModal();

  logClickAnalytics('Social_Registration', provider, 0, {
    user_id: userId,
    user_name: sampleName,
    email: sampleEmail,
    phone: 'Не указан',
    address: 'Облачный профиль ' + provider,
    auth_provider: provider
  });
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const userId = 'USER-' + Math.floor(100000 + Math.random() * 900000);
  const name = document.getElementById('auth-name').value || 'Анонимный пользователь';
  const email = document.getElementById('auth-email').value;
  const phone = document.getElementById('auth-phone').value || 'Не указан';
  const address = document.getElementById('auth-address').value || 'Не указан';

  alert(`🎉 Спасибо, ${name}! Аккаунт зарегистрирован.\nВаш ID: ${userId}`);
  closeAuthModal();

  logClickAnalytics('Email_Registration', 'Email Form', 0, {
    user_id: userId,
    user_name: name,
    email: email,
    phone: phone,
    address: address,
    auth_provider: 'Email/Phone Form'
  });
}

// Google Sheets Webhook Click & Onboarding Logger
function logClickAnalytics(eventType, planName, priceAmount, extraData = {}) {
  const payload = {
    timestamp: new Date().toLocaleString('ru-RU'),
    event_type: eventType,
    plan_name: planName,
    price: priceAmount,
    language: appState.lang,
    billing_cycle: appState.isAnnualBilling ? 'Annual' : 'Monthly',
    user_agent: navigator.userAgent,
    user_id: extraData.user_id || 'GUEST',
    user_name: extraData.user_name || '-',
    email: extraData.email || '-',
    phone: extraData.phone || '-',
    address: extraData.address || '-',
    auth_provider: extraData.auth_provider || '-',
    ...extraData
  };

  console.log("📊 [MindEcho Analytics] Sending Payload to Google Sheets:", payload);

  try {
    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn("Google Sheets Webhook notice:", err));
  } catch (err) {
    console.warn("Analytics fetch error:", err);
  }
}

// Register PWA Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log("📱 [PWA] Service Worker registered"))
      .catch(err => console.log("PWA SW registration failed:", err));
  }
}
