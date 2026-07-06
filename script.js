const credentials = {
  username: "dotti",
  password: "dotti2026"
};

const defaultState = {
  parentName: "Noa",
  childName: "Maya",
  childAge: "5",
  routine: "School pickup",
  stress: 6,
  needs: ["Transitions", "Bedtime", "Emotional regulation"],
  note: "",
  completedTasks: [],
  completedDailyTasks: [],
  messages: [
    { role: "dotti", text: "Hi Noa. I am here with a calm plan, not a perfect plan. What feels heaviest today?" }
  ]
};

let state = loadState();

const $ = (selector) => document.querySelector(selector);
const loginView = $("#loginView");
const appView = $("#appView");
const loginForm = $("#loginForm");
const loginError = $("#loginError");
const lockButton = $("#lockButton");
const screenTitle = $("#screenTitle");
const todayLabel = $("#todayLabel");
const homeHeadline = $("#homeHeadline");
const homeSummary = $("#homeSummary");
const calmScore = $("#calmScore");
const nextAction = $("#nextAction");
const completeNextAction = $("#completeNextAction");
const timelineList = $("#timelineList");
const needCloud = $("#needCloud");
const needsCount = $("#needsCount");
const stressRange = $("#stressRange");
const stressValue = $("#stressValue");
const needChoices = $("#needChoices");
const reflectionForm = $("#reflectionForm");
const reflectionNote = $("#reflectionNote");
const recommendationText = $("#recommendationText");
const planBoard = $("#planBoard");
const generatePlan = $("#generatePlan");
const taskCategory = $("#taskCategory");
const dailyTaskList = $("#dailyTaskList");
const clearDailyTasks = $("#clearDailyTasks");
const chatLog = $("#chatLog");
const chatForm = $("#chatForm");
const chatInput = $("#chatInput");
const profileForm = $("#profileForm");

const availableNeeds = [
  "Transitions",
  "Bedtime",
  "Meals",
  "Emotional regulation",
  "School prep",
  "Parent energy",
  "Sibling conflict",
  "Screen time"
];

const routineTemplates = {
  "School pickup": [
    ["14:45", "Before pickup", "Prepare snack, water, and one low-pressure greeting."],
    ["15:20", "Transition home", "Offer two choices: quiet time or music in the car."],
    ["16:00", "Quiet pause", "Ten minutes of decompression before requests."],
    ["19:15", "Bedtime bridge", "Use one repeated sentence and keep the room calm."]
  ],
  "Morning routine": [
    ["06:55", "Wake softly", "Start with light, water, and one simple sentence."],
    ["07:15", "Two-step getting dressed", "Put clothes in order and avoid extra options."],
    ["07:45", "Exit cue", "Use the same final phrase every morning."],
    ["08:05", "After drop-off", "Take one minute to breathe before the next task."]
  ],
  Bedtime: [
    ["18:20", "Dinner landing", "Reduce decisions and name the next two steps."],
    ["18:50", "Body calm", "Warm bath, dim light, or five slow breaths."],
    ["19:10", "Room routine", "Story, water, toilet, one goodnight phrase."],
    ["19:25", "Boundary repeat", "Repeat the same kind sentence without negotiation."]
  ],
  "Weekend planning": [
    ["09:00", "Anchor the day", "Choose one outing and one home activity."],
    ["11:30", "Snack buffer", "Add food before the difficult transition."],
    ["14:00", "Quiet block", "Protect a calm hour with low stimulation."],
    ["17:30", "Evening preview", "Tell the child what happens before bedtime."]
  ]
};

const dailyTasks = [
  { id: "shop-diapers", category: "Shopping", title: "Buy diapers", body: "Check size and buy a backup pack if you are low." },
  { id: "shop-wipes", category: "Shopping", title: "Buy wet wipes", body: "Add one pack for home and one small pack for the bag." },
  { id: "shop-formula", category: "Shopping", title: "Buy formula or milk", body: "Check the exact brand and stage before checkout." },
  { id: "shop-groceries", category: "Shopping", title: "Go to the grocery store", body: "Bread, eggs, fruit, yogurt, vegetables, and one easy dinner option." },
  { id: "shop-snacks", category: "Shopping", title: "Restock kids' snacks", body: "Choose two simple snacks for school, pickup, or the car." },
  { id: "shop-medicine", category: "Shopping", title: "Restock basic medicine", body: "Check thermometer, fever reducer, saline, and plasters." },
  { id: "shop-bag-items", category: "Shopping", title: "Refill stroller or diaper bag", body: "Diapers, wipes, spare clothes, snack, water, and a small toy." },
  { id: "baby-change", category: "Baby care", title: "Change diaper before leaving", body: "Do it before the transition so leaving the house is easier." },
  { id: "baby-cream", category: "Baby care", title: "Apply diaper cream", body: "Use cream if there is redness or after a long diaper stretch." },
  { id: "baby-bath", category: "Baby care", title: "Prepare bath", body: "Towel, pajamas, diaper, cream, and clothes ready before water." },
  { id: "baby-clothes", category: "Baby care", title: "Pack spare clothes", body: "One full outfit, socks, and a plastic bag for dirty clothes." },
  { id: "baby-nails", category: "Baby care", title: "Trim nails", body: "Do it after bath or sleep when the child is calmer." },
  { id: "baby-sunscreen", category: "Baby care", title: "Apply sunscreen", body: "Use before playground, pickup walk, or any outdoor plan." },
  { id: "baby-water", category: "Baby care", title: "Fill child water bottle", body: "Put it near the door or inside the school bag." },
  { id: "food-breakfast", category: "Food", title: "Prepare breakfast", body: "Keep it simple: protein, fruit, and one familiar option." },
  { id: "food-lunchbox", category: "Food", title: "Pack lunchbox", body: "Main item, fruit, snack, water, and napkin." },
  { id: "food-dinner", category: "Food", title: "Plan easy dinner", body: "Pick one meal that can survive interruptions." },
  { id: "food-defrost", category: "Food", title: "Defrost dinner item", body: "Move it from freezer to fridge early in the day." },
  { id: "food-bottles", category: "Food", title: "Wash bottles or cups", body: "Wash, dry, and place them where morning routine starts." },
  { id: "food-fruit", category: "Food", title: "Cut fruit for later", body: "Prepare a small container for pickup or after school." },
  { id: "food-grocery-list", category: "Food", title: "Write grocery list", body: "Add only what is missing for the next two days." },
  { id: "home-laundry", category: "Home", title: "Do kids' laundry", body: "Start one small load: pajamas, socks, school clothes." },
  { id: "home-fold", category: "Home", title: "Fold clean clothes", body: "Focus only on child clothes if time is short." },
  { id: "home-dishes", category: "Home", title: "Run dishwasher", body: "Clear bottles, lunchboxes, and dinner dishes first." },
  { id: "home-trash", category: "Home", title: "Take out trash", body: "Include diaper bin or bathroom trash if needed." },
  { id: "home-toys", category: "Home", title: "Tidy toy area", body: "Use one basket tidy, not a full cleanup." },
  { id: "home-bag", category: "Home", title: "Prepare tomorrow's bag", body: "Clothes, water, forms, lunchbox, and comfort item." },
  { id: "home-car", category: "Home", title: "Clean car seat area", body: "Remove crumbs, old snacks, wet wipes, and trash." },
  { id: "school-form", category: "School", title: "Sign school form", body: "Check bag, messages, and parent group reminders." },
  { id: "school-clothes", category: "School", title: "Lay out school clothes", body: "Choose clothes at night to reduce morning decisions." },
  { id: "school-message", category: "School", title: "Message teacher or daycare", body: "Send updates about pickup, medicine, or missing items." },
  { id: "school-payment", category: "School", title: "Pay school or activity fee", body: "Handle it now if it is blocking registration." },
  { id: "school-showtell", category: "School", title: "Prepare show-and-tell item", body: "Put it in the bag before bedtime." },
  { id: "school-activity", category: "School", title: "Pack activity gear", body: "Shoes, swimsuit, towel, instrument, or sports clothes." },
  { id: "health-appointment", category: "Health", title: "Book doctor appointment", body: "Add symptoms, preferred hours, and child ID if needed." },
  { id: "health-medicine", category: "Health", title: "Give medicine on time", body: "Set a timer and write down the dose time." },
  { id: "health-vitamins", category: "Health", title: "Give vitamins", body: "Attach it to breakfast or tooth brushing." },
  { id: "health-temperature", category: "Health", title: "Check temperature", body: "Log the time and result if the child is sick." },
  { id: "health-insurance", category: "Health", title: "Upload insurance document", body: "Take a photo and save it before you forget." },
  { id: "health-dentist", category: "Health", title: "Schedule dentist checkup", body: "Pick a morning slot if the child handles it better." },
  { id: "sleep-pajamas", category: "Sleep", title: "Set pajamas and diaper", body: "Put them in the bathroom before bath starts." },
  { id: "sleep-story", category: "Sleep", title: "Choose bedtime story", body: "Offer two books, not the whole shelf." },
  { id: "sleep-room", category: "Sleep", title: "Prepare sleep room", body: "Dim light, water, comfort item, and white noise if used." },
  { id: "sleep-routine", category: "Sleep", title: "Start bedtime routine early", body: "Begin ten minutes before the usual friction starts." },
  { id: "sleep-wakeup", category: "Sleep", title: "Prepare morning wake-up", body: "Clothes, bag, and breakfast idea ready tonight." },
  { id: "admin-bills", category: "Parent admin", title: "Pay household bill", body: "Handle one bill only, then stop." },
  { id: "admin-calendar", category: "Parent admin", title: "Update family calendar", body: "Add appointments, pickup changes, birthdays, and activities." },
  { id: "admin-babysitter", category: "Parent admin", title: "Confirm babysitter", body: "Send time, address, food notes, and bedtime routine." },
  { id: "admin-call", category: "Parent admin", title: "Return important call", body: "Doctor, school, insurance, delivery, or family logistics." },
  { id: "admin-budget", category: "Parent admin", title: "Check weekly spending", body: "Look at groceries, pharmacy, school, and activities." },
  { id: "admin-parent-rest", category: "Parent admin", title: "Plan one parent break", body: "Ten minutes alone, shower, walk, or quiet coffee counts." }
];

function normalizeState(rawState) {
  if (/[\u0590-\u05ff]/.test(JSON.stringify(rawState))) {
    return structuredClone(defaultState);
  }

  const nextState = { ...structuredClone(defaultState), ...rawState };
  nextState.routine = routineTemplates[nextState.routine] ? nextState.routine : defaultState.routine;
  nextState.needs = (nextState.needs || defaultState.needs).filter((need) => availableNeeds.includes(need));
  if (!nextState.needs.length) {
    nextState.needs = [...defaultState.needs];
  }
  if (!Array.isArray(nextState.messages)) {
    nextState.messages = structuredClone(defaultState.messages);
  }
  return nextState;
}

function loadState() {
  const saved = localStorage.getItem("dotti-demo-state");
  if (!saved) return structuredClone(defaultState);
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
    home: `Good morning, ${state.parentName}`,
    tasks: "Everyday tasks",
    reflect: "Tell Dotti what feels heavy",
    plan: `${state.childName}'s guided plan`,
    assistant: "Dotti assistant",
    profile: "Family setup"
  };
  screenTitle.textContent = titles[viewName] || "Dotti";
}

function getPlan() {
  const basePlan = routineTemplates[state.routine] || routineTemplates["School pickup"];
  const pressureTask = state.stress >= 8
    ? ["Now", "Reduce the ask", "Pick one thing to solve first and postpone the rest."]
    : ["Now", "Prepare the next step", "Set up the smallest useful action before the rush."];
  return [pressureTask, ...basePlan].slice(0, 5);
}

function getRecommendation() {
  const needText = state.needs.length ? state.needs.join(", ") : "one clear need";
  if (state.stress >= 8) return `Pressure is high. Dotti will focus on ${needText}, shorter steps, and fewer decisions.`;
  if (state.stress <= 3) return `Today looks steadier. Dotti will keep ${needText} supported while leaving more room for flexibility.`;
  return `Dotti will shape the day around ${needText}, with one practical step before each difficult transition.`;
}

function render() {
  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(new Date());
  const score = Math.max(18, 100 - state.stress * 7 + state.completedTasks.length * 3);
  const completedDailyCount = (state.completedDailyTasks || []).length;
  const plan = getPlan();

  todayLabel.textContent = today;
  homeHeadline.textContent = `You have ${plan.length} guided steps and ${dailyTasks.length} everyday tasks ready.`;
  homeSummary.textContent = `Dotti is focusing on ${state.needs.join(", ").toLowerCase()} for ${state.childName}, with ${completedDailyCount} daily tasks completed.`;
  calmScore.textContent = score;
  nextAction.textContent = plan[0][2];
  stressRange.value = state.stress;
  stressValue.textContent = state.stress;
  reflectionNote.value = state.note || "";
  recommendationText.textContent = getRecommendation();
  needsCount.textContent = `${state.needs.length} active`;

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
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.innerHTML = `<span>${time}</span><div><strong>${title}</strong><p>${body}</p></div>`;
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
      <button type="button" aria-label="Toggle task ${index + 1}" data-task="${index}">${done ? "Done" : ""}</button>
      <div><span>${time}</span><strong>${title}</strong><p>${body}</p></div>
    `;
    planBoard.append(card);
  });
}

function renderDailyTasks() {
  if (!taskCategory || !dailyTaskList) return;
  const selectedCategory = taskCategory.value || "All";
  const completed = state.completedDailyTasks || [];
  const visibleTasks = selectedCategory === "All" ? dailyTasks : dailyTasks.filter((task) => task.category === selectedCategory);

  dailyTaskList.innerHTML = "";
  visibleTasks.forEach((task) => {
    const done = completed.includes(task.id);
    const card = document.createElement("article");
    card.className = `daily-task-card${done ? " is-done" : ""}`;
    card.innerHTML = `
      <button type="button" data-daily-task="${task.id}" aria-label="Toggle ${task.title}">${done ? "Done" : ""}</button>
      <div><span>${task.category}</span><strong>${task.title}</strong><p>${task.body}</p></div>
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
  if (lower.includes("bedtime") || lower.includes("sleep")) {
    return `For bedtime, keep the script tiny: "First pajamas, then story, then sleep." If ${state.childName} pushes back, repeat the same sentence with warmth.`;
  }
  if (lower.includes("pickup") || lower.includes("transition")) {
    return "For pickup, reduce surprises. Bring a snack, name the next stop, and offer two choices that both work for you.";
  }
  if (lower.includes("overwhelmed") || lower.includes("stress") || lower.includes("hard")) {
    return "One tiny next step: lower the room pressure before solving the problem. Sit, breathe once, and choose only the next useful action.";
  }
  if (lower.includes("grocery") || lower.includes("diaper") || lower.includes("shopping")) {
    return "For shopping, open Tasks and mark only the urgent three: diapers, wipes, and one simple dinner option.";
  }
  return `I would start with ${state.needs[0] || "the smallest need"}. Make it visible, make it short, and give ${state.childName} one choice inside your boundary.`;
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

  loginError.textContent = "Username or password is incorrect.";
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
  state.messages.push({ role: "dotti", text: getRecommendation() });
  saveState();
  render();
  setView("plan");
});

generatePlan.addEventListener("click", () => {
  state.completedTasks = [];
  state.messages.push({ role: "dotti", text: `I rebuilt the plan around ${state.needs.join(", ").toLowerCase()} and pressure level ${state.stress}.` });
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
  if (!state.completedTasks.includes(0)) state.completedTasks.push(0);
  saveState();
  render();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  state.messages.push({ role: "user", text: message });
  state.messages.push({ role: "dotti", text: getDottiReply(message) });
  chatInput.value = "";
  saveState();
  renderChat();
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  state.parentName = String(formData.get("parentName") || "Noa").trim() || "Noa";
  state.childName = String(formData.get("childName") || "Maya").trim() || "Maya";
  state.childAge = String(formData.get("childAge") || "5").trim() || "5";
  state.routine = String(formData.get("routine") || "School pickup");
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
