const credentials = {
  username: "dotti",
  password: "dotti2026"
};

const defaultState = {
  parentName: "נועה",
  childName: "מאיה",
  childAge: "5",
  routine: "איסוף מהגן",
  stress: 6,
  needs: ["מעברים", "שעת שינה", "ויסות רגשי"],
  note: "",
  completedTasks: [],
  completedDailyTasks: [],
  messages: [
    {
      role: "dotti",
      text: "היי נועה. אני כאן כדי לבנות תוכנית רגועה, לא מושלמת. מה הכי מכביד היום?"
    }
  ]
};

let state = loadState();

const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const lockButton = document.querySelector("#lockButton");
const screenTitle = document.querySelector("#screenTitle");
const todayLabel = document.querySelector("#todayLabel");
const homeHeadline = document.querySelector("#homeHeadline");
const homeSummary = document.querySelector("#homeSummary");
const calmScore = document.querySelector("#calmScore");
const nextAction = document.querySelector("#nextAction");
const completeNextAction = document.querySelector("#completeNextAction");
const timelineList = document.querySelector("#timelineList");
const needCloud = document.querySelector("#needCloud");
const needsCount = document.querySelector("#needsCount");
const stressRange = document.querySelector("#stressRange");
const stressValue = document.querySelector("#stressValue");
const needChoices = document.querySelector("#needChoices");
const reflectionForm = document.querySelector("#reflectionForm");
const reflectionNote = document.querySelector("#reflectionNote");
const recommendationText = document.querySelector("#recommendationText");
const planBoard = document.querySelector("#planBoard");
const generatePlan = document.querySelector("#generatePlan");
const taskCategory = document.querySelector("#taskCategory");
const dailyTaskList = document.querySelector("#dailyTaskList");
const clearDailyTasks = document.querySelector("#clearDailyTasks");
const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const profileForm = document.querySelector("#profileForm");

const availableNeeds = [
  "מעברים",
  "שעת שינה",
  "אוכל",
  "ויסות רגשי",
  "התארגנות לגן",
  "אנרגיה של ההורה",
  "ריבים בין אחים",
  "מסכים"
];

const routineTemplates = {
  "איסוף מהגן": [
    ["14:45", "לפני האיסוף", "להכין נשנוש, מים ומשפט פתיחה רגוע."],
    ["15:20", "מעבר הביתה", "להציע שתי אפשרויות: זמן שקט או מוזיקה באוטו."],
    ["16:00", "הפסקה שקטה", "עשר דקות של הורדת עומס לפני בקשות ומשימות."],
    ["19:15", "גשר לשינה", "להשתמש במשפט קבוע אחד ולשמור על חדר רגוע."]
  ],
  "שגרת בוקר": [
    ["06:55", "התעוררות רכה", "אור, מים ומשפט אחד פשוט לפתיחת היום."],
    ["07:15", "התלבשות בשני צעדים", "להניח בגדים לפי סדר ולהימנע מעודף בחירות."],
    ["07:45", "סימן יציאה", "להשתמש באותו משפט סיום בכל בוקר."],
    ["08:05", "אחרי פרידה", "לקחת דקה לנשום לפני המשימה הבאה."]
  ],
  "שעת שינה": [
    ["18:20", "נחיתה אחרי ארוחת ערב", "להפחית החלטות ולומר את שני הצעדים הבאים."],
    ["18:50", "הרגעת הגוף", "אמבטיה חמימה, אור עמום או חמש נשימות איטיות."],
    ["19:10", "שגרת חדר", "סיפור, מים, שירותים ומשפט לילה טוב קבוע."],
    ["19:25", "גבול חוזר", "לחזור על אותו משפט נעים בלי להיכנס למשא ומתן."]
  ],
  "תכנון סוף שבוע": [
    ["09:00", "עוגן ליום", "לבחור פעילות אחת בחוץ ופעילות אחת בבית."],
    ["11:30", "מרווח אוכל", "להכניס נשנוש לפני מעבר שעלול להיות קשה."],
    ["14:00", "שעה שקטה", "לשמור שעה רגועה עם מעט גירויים."],
    ["17:30", "תצוגה מקדימה לערב", "להגיד לילד/ה מה קורה לפני שעת השינה."]
  ]
};

const dailyTasks = [
  { id: "shop-diapers", category: "קניות", title: "לקנות חיתולים", body: "לבדוק מידה לפני שיוצאים ולקנות חבילת גיבוי אם נשאר מעט." },
  { id: "shop-wipes", category: "קניות", title: "לקנות מגבונים", body: "חבילה אחת לבית וחבילה קטנה לתיק." },
  { id: "shop-formula", category: "קניות", title: "לקנות תמ״ל או חלב", body: "לבדוק מותג, שלב וכמות לפני התשלום." },
  { id: "shop-groceries", category: "קניות", title: "ללכת למכולת", body: "לחם, ביצים, פירות, יוגורט, ירקות ואפשרות פשוטה לארוחת ערב." },
  { id: "shop-snacks", category: "קניות", title: "לחדש מלאי נשנושים", body: "לבחור שני נשנושים פשוטים לגן, לאיסוף או לאוטו." },
  { id: "shop-medicine", category: "קניות", title: "להשלים תרופות בסיסיות", body: "לבדוק מדחום, מוריד חום, מי מלח ופלסטרים." },
  { id: "shop-bag-items", category: "קניות", title: "למלא תיק החתלה או עגלה", body: "חיתולים, מגבונים, בגדים להחלפה, נשנוש, מים ומשחק קטן." },
  { id: "baby-change", category: "טיפול בילד", title: "להחליף חיתול לפני יציאה", body: "לעשות את זה לפני המעבר כדי שהיציאה תהיה קלה יותר." },
  { id: "baby-cream", category: "טיפול בילד", title: "למרוח משחת החתלה", body: "למרוח אם יש אדמומיות או אחרי פרק זמן ארוך עם חיתול." },
  { id: "baby-bath", category: "טיפול בילד", title: "להכין אמבטיה", body: "מגבת, פיג׳מה, חיתול, משחה ובגדים מוכנים לפני המים." },
  { id: "baby-clothes", category: "טיפול בילד", title: "לארוז בגדים להחלפה", body: "סט מלא, גרביים ושקית לבגדים מלוכלכים." },
  { id: "baby-nails", category: "טיפול בילד", title: "לגזור ציפורניים", body: "עדיף אחרי אמבטיה או בזמן שהילד/ה רגועים." },
  { id: "baby-sunscreen", category: "טיפול בילד", title: "למרוח קרם הגנה", body: "לפני גינה, הליכה לאיסוף או כל יציאה לשמש." },
  { id: "baby-water", category: "טיפול בילד", title: "למלא בקבוק מים", body: "להניח ליד הדלת או בתוך תיק הגן." },
  { id: "food-breakfast", category: "אוכל", title: "להכין ארוחת בוקר", body: "פשוט: חלבון, פרי ואפשרות מוכרת אחת." },
  { id: "food-lunchbox", category: "אוכל", title: "להכין קופסת אוכל", body: "מנה עיקרית, פרי, נשנוש, מים ומפית." },
  { id: "food-dinner", category: "אוכל", title: "לתכנן ארוחת ערב קלה", body: "לבחור ארוחה שיכולה לשרוד הפרעות באמצע." },
  { id: "food-defrost", category: "אוכל", title: "להפשיר משהו לארוחת ערב", body: "להעביר מהמקפיא למקרר מוקדם ביום." },
  { id: "food-bottles", category: "אוכל", title: "לשטוף בקבוקים או כוסות", body: "לשטוף, לייבש ולהניח במקום שבו מתחיל הבוקר." },
  { id: "food-fruit", category: "אוכל", title: "לחתוך פירות להמשך היום", body: "להכין קופסה קטנה לאיסוף או אחרי הגן." },
  { id: "food-grocery-list", category: "אוכל", title: "לכתוב רשימת קניות", body: "להוסיף רק מה שחסר ליומיים הקרובים." },
  { id: "home-laundry", category: "בית", title: "לעשות כביסה לילדים", body: "להפעיל מכונה קטנה: פיג׳מות, גרביים ובגדי גן." },
  { id: "home-fold", category: "בית", title: "לקפל בגדים נקיים", body: "אם הזמן קצר, להתמקד רק בבגדי הילדים." },
  { id: "home-dishes", category: "בית", title: "להפעיל מדיח", body: "להתחיל מבקבוקים, קופסאות אוכל וכלים מארוחת ערב." },
  { id: "home-trash", category: "בית", title: "להוציא זבל", body: "לבדוק גם פח חיתולים או פח אמבטיה אם צריך." },
  { id: "home-toys", category: "בית", title: "לסדר אזור משחקים", body: "סידור סל אחד בלבד, לא ניקיון מלא." },
  { id: "home-bag", category: "בית", title: "להכין תיק למחר", body: "בגדים, מים, טפסים, קופסת אוכל וחפץ מעבר." },
  { id: "home-car", category: "בית", title: "לנקות אזור כיסא בטיחות", body: "להוציא פירורים, נשנושים ישנים, מגבונים וזבל." },
  { id: "school-form", category: "גן ובית ספר", title: "לחתום על טופס", body: "לבדוק תיק, הודעות וקבוצת הורים." },
  { id: "school-clothes", category: "גן ובית ספר", title: "להכין בגדים לגן", body: "לבחור בגדים בערב כדי לצמצם החלטות בבוקר." },
  { id: "school-message", category: "גן ובית ספר", title: "לשלוח הודעה לגננת או למורה", body: "לעדכן על איסוף, תרופה או חפץ חסר." },
  { id: "school-payment", category: "גן ובית ספר", title: "לשלם לגן או לחוג", body: "לטפל בזה אם זה חוסם הרשמה או השתתפות." },
  { id: "school-showtell", category: "גן ובית ספר", title: "להכין חפץ להצגה", body: "להכניס לתיק לפני שעת השינה." },
  { id: "school-activity", category: "גן ובית ספר", title: "לארוז ציוד לחוג", body: "נעליים, בגד ים, מגבת, כלי נגינה או בגדי ספורט." },
  { id: "health-appointment", category: "בריאות", title: "לקבוע תור לרופא", body: "להוסיף תסמינים, שעות נוחות ומספר תעודה אם צריך." },
  { id: "health-medicine", category: "בריאות", title: "לתת תרופה בזמן", body: "להגדיר תזכורת ולכתוב מתי ניתנה המנה." },
  { id: "health-vitamins", category: "בריאות", title: "לתת ויטמינים", body: "לחבר את זה לארוחת בוקר או לצחצוח שיניים." },
  { id: "health-temperature", category: "בריאות", title: "למדוד חום", body: "לרשום שעה ותוצאה אם הילד/ה חולים." },
  { id: "health-insurance", category: "בריאות", title: "להעלות מסמך לקופה", body: "לצלם ולשמור לפני שזה נשכח." },
  { id: "health-dentist", category: "בריאות", title: "לקבוע בדיקת שיניים", body: "לבחור תור בוקר אם זה קל יותר לילד/ה." },
  { id: "sleep-pajamas", category: "שינה", title: "להכין פיג׳מה וחיתול", body: "להניח באמבטיה לפני שמתחילים את הערב." },
  { id: "sleep-story", category: "שינה", title: "לבחור סיפור לשינה", body: "להציע שני ספרים, לא את כל המדף." },
  { id: "sleep-room", category: "שינה", title: "להכין חדר לשינה", body: "אור עמום, מים, חפץ מעבר ורעש לבן אם משתמשים." },
  { id: "sleep-routine", category: "שינה", title: "להתחיל שגרה מוקדם", body: "להתחיל עשר דקות לפני נקודת החיכוך הרגילה." },
  { id: "sleep-wakeup", category: "שינה", title: "להכין את הבוקר", body: "בגדים, תיק ורעיון לארוחת בוקר מוכנים מהערב." },
  { id: "admin-bills", category: "סידורי הורים", title: "לשלם חשבון", body: "לטפל בחשבון אחד בלבד ואז לעצור." },
  { id: "admin-calendar", category: "סידורי הורים", title: "לעדכן יומן משפחתי", body: "להוסיף תורים, שינויי איסוף, ימי הולדת וחוגים." },
  { id: "admin-babysitter", category: "סידורי הורים", title: "לאשר בייביסיטר", body: "לשלוח שעה, כתובת, הערות אוכל ושגרת שינה." },
  { id: "admin-call", category: "סידורי הורים", title: "לחזור לשיחה חשובה", body: "רופא, גן, ביטוח, משלוח או לוגיסטיקה משפחתית." },
  { id: "admin-budget", category: "סידורי הורים", title: "לבדוק הוצאות שבועיות", body: "קניות, פארם, גן, חוגים והוצאות קטנות." },
  { id: "admin-parent-rest", category: "סידורי הורים", title: "לתכנן הפסקה להורה", body: "עשר דקות לבד, מקלחת, הליכה או קפה שקט נחשבים." }
];

function normalizeState(rawState) {
  const nextState = { ...structuredClone(defaultState), ...rawState };
  const legacyRoutineMap = {
    "School pickup": "איסוף מהגן",
    "Morning routine": "שגרת בוקר",
    "Bedtime": "שעת שינה",
    "Weekend planning": "תכנון סוף שבוע"
  };
  const legacyNeedsMap = {
    Transitions: "מעברים",
    Bedtime: "שעת שינה",
    Meals: "אוכל",
    "Emotional regulation": "ויסות רגשי",
    "School prep": "התארגנות לגן",
    "Parent energy": "אנרגיה של ההורה",
    "Sibling conflict": "ריבים בין אחים",
    "Screen time": "מסכים"
  };

  nextState.parentName = nextState.parentName === "Noa" ? "נועה" : nextState.parentName;
  nextState.childName = nextState.childName === "Maya" ? "מאיה" : nextState.childName;
  nextState.routine = legacyRoutineMap[nextState.routine] || nextState.routine || defaultState.routine;
  nextState.needs = (nextState.needs || defaultState.needs).map((need) => legacyNeedsMap[need] || need);
  if (!Array.isArray(nextState.messages) || nextState.messages.some((message) => /[A-Za-z]/.test(message.text))) {
    nextState.messages = structuredClone(defaultState.messages);
  }
  return nextState;
}

function loadState() {
  const saved = localStorage.getItem("dotti-demo-state");
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    return normalizeState(JSON.parse(saved));
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("dotti-demo-state", JSON.stringify(state));
}

function unlock() {
  sessionStorage.setItem("dotti-preview-authenticated", "true");
  loginView.classList.add("is-hidden");
  appView.classList.remove("is-hidden");
  render();
}

function lock() {
  sessionStorage.removeItem("dotti-preview-authenticated");
  appView.classList.add("is-hidden");
  loginView.classList.remove("is-hidden");
  loginForm.elements.username.value = "";
  loginForm.elements.password.value = "";
}

function setView(viewName) {
  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === viewName);
  });

  document.querySelectorAll("[data-view-link]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewLink === viewName);
  });

  const titles = {
    home: `בוקר טוב, ${state.parentName}`,
    tasks: "משימות יומיומיות",
    reflect: "ספרו ל־Dotti מה מכביד",
    plan: `התוכנית של ${state.childName}`,
    assistant: "העוזרת של Dotti",
    profile: "הגדרות משפחה"
  };
  screenTitle.textContent = titles[viewName] || "Dotti";
}

function getPlan() {
  const basePlan = routineTemplates[state.routine] || routineTemplates["איסוף מהגן"];
  const pressureTask = state.stress >= 8
    ? ["עכשיו", "להקטין את הדרישה", "לבחור דבר אחד לפתור עכשיו ולדחות את השאר."]
    : ["עכשיו", "להכין את הצעד הבא", "להגדיר פעולה קטנה וברורה לפני שהעומס מתחיל."];
  return [pressureTask, ...basePlan].slice(0, 5);
}

function getRecommendation() {
  const needText = state.needs.length ? state.needs.join(", ") : "צורך אחד ברור";
  if (state.stress >= 8) {
    return `רמת העומס גבוהה. Dotti תתמקד ב־${needText}, בצעדים קצרים ובפחות החלטות.`;
  }
  if (state.stress <= 3) {
    return `היום נראה יציב יותר. Dotti תשמור על תמיכה ב־${needText} ותשאיר יותר מקום לגמישות.`;
  }
  return `Dotti תבנה את היום סביב ${needText}, עם פעולה מעשית אחת לפני כל מעבר מאתגר.`;
}

function render() {
  const today = new Intl.DateTimeFormat("he-IL", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const score = Math.max(18, 100 - state.stress * 7 + state.completedTasks.length * 3);
  const completedDailyCount = (state.completedDailyTasks || []).length;
  const plan = getPlan();

  todayLabel.textContent = today;
  homeHeadline.textContent = `יש לך ${plan.length} צעדים מונחים ו־${dailyTasks.length} משימות יומיומיות מוכנות.`;
  homeSummary.textContent = `Dotti מתמקדת ב־${state.needs.join(", ")} עבור ${state.childName}, עם ${completedDailyCount} משימות שסומנו כבוצעו.`;
  calmScore.textContent = score;
  nextAction.textContent = plan[0][2];
  stressRange.value = state.stress;
  stressValue.textContent = state.stress;
  reflectionNote.value = state.note || "";
  recommendationText.textContent = getRecommendation();
  needsCount.textContent = `${state.needs.length} פעילים`;

  renderNeeds();
  renderTimeline(plan);
  renderPlan(plan);
  renderDailyTasks();
  renderChat();
  renderProfile();
}

function renderNeeds() {
  needCloud.innerHTML = "";
  state.needs.forEach((need) => {
    const pill = document.createElement("span");
    pill.className = "need-pill";
    pill.textContent = need;
    needCloud.append(pill);
  });

  needChoices.innerHTML = "";
  availableNeeds.forEach((need) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = need;
    input.checked = state.needs.includes(need);
    label.append(input, need);
    needChoices.append(label);
  });
}

function renderTimeline(plan) {
  timelineList.innerHTML = "";
  plan.slice(1, 5).forEach(([time, title, body]) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `<span class="timeline-time">${time}</span><div><strong>${title}</strong><p>${body}</p></div>`;
    timelineList.append(item);
  });
}

function renderPlan(plan) {
  planBoard.innerHTML = "";
  plan.forEach(([time, title, body], index) => {
    const done = state.completedTasks.includes(index);
    const card = document.createElement("article");
    card.className = `task-card${done ? " is-done" : ""}`;
    card.innerHTML = `
      <button type="button" aria-label="סימון משימה ${index + 1}" data-task="${index}">${done ? "בוצע" : ""}</button>
      <div>
        <span class="timeline-time">${time}</span>
        <strong>${title}</strong>
        <p>${body}</p>
      </div>
    `;
    planBoard.append(card);
  });
}

function renderDailyTasks() {
  if (!taskCategory || !dailyTaskList) {
    return;
  }

  const selectedCategory = taskCategory.value || "הכל";
  const completed = state.completedDailyTasks || [];
  const visibleTasks = selectedCategory === "הכל"
    ? dailyTasks
    : dailyTasks.filter((task) => task.category === selectedCategory);

  dailyTaskList.innerHTML = "";
  visibleTasks.forEach((task) => {
    const done = completed.includes(task.id);
    const card = document.createElement("article");
    card.className = `daily-task-card${done ? " is-done" : ""}`;
    card.innerHTML = `
      <button type="button" data-daily-task="${task.id}" aria-label="סימון ${task.title}">${done ? "בוצע" : ""}</button>
      <div>
        <span>${task.category}</span>
        <strong>${task.title}</strong>
        <p>${task.body}</p>
      </div>
    `;
    dailyTaskList.append(card);
  });
}

function renderChat() {
  chatLog.innerHTML = "";
  state.messages.forEach((message) => {
    const bubble = document.createElement("div");
    bubble.className = `message ${message.role}`;
    bubble.textContent = message.text;
    chatLog.append(bubble);
  });
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderProfile() {
  profileForm.elements.parentName.value = state.parentName;
  profileForm.elements.childName.value = state.childName;
  profileForm.elements.childAge.value = state.childAge;
  profileForm.elements.routine.value = state.routine;
}

function getDottiReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("שינה") || lower.includes("לישון")) {
    return `בשעת שינה כדאי לשמור על משפט קצר וקבוע: "קודם פיג׳מה, אחר כך סיפור, ואז לילה טוב." אם ${state.childName} מתנגדת, חוזרים על אותו משפט ברוגע.`;
  }
  if (lower.includes("איסוף") || lower.includes("מעבר")) {
    return "במעבר אחרי איסוף כדאי להפחית הפתעות: נשנוש קטן, משפט שמסביר מה קורה עכשיו, ושתי אפשרויות ששתיהן מקובלות עליך.";
  }
  if (lower.includes("עומס") || lower.includes("לחוץ") || lower.includes("קשה")) {
    return "צעד אחד קטן: קודם מורידים את הלחץ בחדר לפני שמנסים לפתור הכול. לשבת, לנשום פעם אחת, ולבחור רק את הפעולה הבאה.";
  }
  if (lower.includes("מכולת") || lower.includes("חיתולים") || lower.includes("קניות")) {
    return "לקניות, כדאי לפתוח את מסך המשימות ולסמן רק שלושה דברים דחופים: חיתולים, מגבונים ומשהו פשוט לארוחת ערב.";
  }
  return `הייתי מתחילה מ־${state.needs[0] || "הצורך הכי קטן"}. להפוך אותו לגלוי, קצר ובר ביצוע, ולתת ל־${state.childName} בחירה אחת בתוך הגבול שלך.`;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim().toLowerCase();

  if (username === credentials.username && password === credentials.password) {
    loginError.textContent = "";
    unlock();
    return;
  }

  loginError.textContent = "שם המשתמש או הסיסמה אינם נכונים.";
});

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-link]");
  if (viewButton) {
    event.preventDefault();
    setView(viewButton.dataset.viewLink);
  }

  const taskButton = event.target.closest("[data-task]");
  if (taskButton) {
    const taskIndex = Number(taskButton.dataset.task);
    state.completedTasks = state.completedTasks.includes(taskIndex)
      ? state.completedTasks.filter((item) => item !== taskIndex)
      : [...state.completedTasks, taskIndex];
    saveState();
    render();
  }

  const dailyTaskButton = event.target.closest("[data-daily-task]");
  if (dailyTaskButton) {
    const taskId = dailyTaskButton.dataset.dailyTask;
    const completed = state.completedDailyTasks || [];
    state.completedDailyTasks = completed.includes(taskId)
      ? completed.filter((item) => item !== taskId)
      : [...completed, taskId];
    saveState();
    render();
  }

  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) {
    chatInput.value = promptButton.dataset.prompt;
    chatForm.requestSubmit();
  }
});

stressRange.addEventListener("input", () => {
  stressValue.textContent = stressRange.value;
});

reflectionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.stress = Number(stressRange.value);
  state.needs = [...needChoices.querySelectorAll("input:checked")].map((input) => input.value);
  state.note = reflectionNote.value.trim();
  state.completedTasks = [];
  state.messages.push({
    role: "dotti",
    text: getRecommendation()
  });
  saveState();
  render();
  setView("plan");
});

generatePlan.addEventListener("click", () => {
  state.completedTasks = [];
  state.messages.push({
    role: "dotti",
    text: `בניתי מחדש את התוכנית סביב ${state.needs.join(", ")} וברמת עומס ${state.stress}.`
  });
  saveState();
  render();
});

taskCategory?.addEventListener("change", renderDailyTasks);

clearDailyTasks?.addEventListener("click", () => {
  state.completedDailyTasks = [];
  saveState();
  render();
});

completeNextAction.addEventListener("click", () => {
  if (!state.completedTasks.includes(0)) {
    state.completedTasks.push(0);
  }
  saveState();
  render();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) {
    return;
  }
  state.messages.push({ role: "user", text: message });
  state.messages.push({ role: "dotti", text: getDottiReply(message) });
  chatInput.value = "";
  saveState();
  renderChat();
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  state.parentName = String(formData.get("parentName") || "נועה").trim() || "נועה";
  state.childName = String(formData.get("childName") || "מאיה").trim() || "מאיה";
  state.childAge = String(formData.get("childAge") || "5").trim() || "5";
  state.routine = String(formData.get("routine") || "איסוף מהגן");
  state.completedTasks = [];
  saveState();
  render();
  setView("home");
});

lockButton.addEventListener("click", lock);

if (sessionStorage.getItem("dotti-preview-authenticated") === "true") {
  unlock();
} else {
  render();
}
