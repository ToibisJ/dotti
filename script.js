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
  messages: [
    {
      role: "dotti",
      text: "Hi Noa. I am here with a calm plan, not a perfect plan. What feels heaviest today?"
    }
  ]
};

let state = loadState();

const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const lockButton = document.querySelector("#lockButton");
const resetButton = document.querySelector("#resetButton");
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
const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const profileForm = document.querySelector("#profileForm");

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
    ["16:00", "Reset moment", "Ten minutes of decompression before requests."],
    ["19:15", "Bedtime bridge", "Use one repeated sentence and keep the room calm."]
  ],
  "Morning routine": [
    ["06:55", "Wake softly", "Start with light, water, and one simple sentence."],
    ["07:15", "Two-step getting dressed", "Put clothes in order and avoid extra options."],
    ["07:45", "Exit cue", "Use the same final phrase every morning."],
    ["08:05", "After drop-off", "Take one minute to reset your own nervous system."]
  ],
  "Bedtime": [
    ["18:20", "Dinner landing", "Reduce decisions and name the next two steps."],
    ["18:50", "Body reset", "Warm bath, dim light, or five slow breaths."],
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

function loadState() {
  const saved = localStorage.getItem("dotti-demo-state");
  if (!saved) {
    return structuredClone(defaultState);
  }

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
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
  loginForm.reset();
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
  if (state.stress >= 8) {
    return `Pressure is high. Dotti will focus on ${needText}, shorter steps, and fewer decisions.`;
  }
  if (state.stress <= 3) {
    return `Today looks steadier. Dotti will keep ${needText} supported while leaving more room for flexibility.`;
  }
  return `Dotti will shape the day around ${needText}, with one practical step before each difficult transition.`;
}

function render() {
  const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(new Date());
  const score = Math.max(18, 100 - state.stress * 7 + state.completedTasks.length * 3);
  const plan = getPlan();

  todayLabel.textContent = today;
  homeHeadline.textContent = `You have ${plan.length} guided steps for ${state.routine.toLowerCase()}.`;
  homeSummary.textContent = `Dotti is focusing on ${state.needs.join(", ").toLowerCase()} for ${state.childName}, age ${state.childAge}.`;
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
      <button type="button" aria-label="Toggle task ${index + 1}" data-task="${index}">${done ? "✓" : ""}</button>
      <div>
        <span class="timeline-time">${time}</span>
        <strong>${title}</strong>
        <p>${body}</p>
      </div>
    `;
    planBoard.append(card);
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
  if (lower.includes("bedtime")) {
    return `For bedtime, keep the script tiny: "First pajamas, then story, then sleep." If ${state.childName} pushes back, repeat the same sentence with warmth.`;
  }
  if (lower.includes("pickup") || lower.includes("transition")) {
    return `For pickup, reduce surprises. Bring a snack, name the next stop, and offer two choices that both work for you.`;
  }
  if (lower.includes("overwhelmed") || lower.includes("stress")) {
    return "One tiny next step: lower the room pressure before solving the problem. Sit, breathe once, and choose only the next useful action.";
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
    text: `I rebuilt the plan around ${state.needs.join(", ").toLowerCase()} and pressure level ${state.stress}.`
  });
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
  state.parentName = String(formData.get("parentName") || "Noa").trim() || "Noa";
  state.childName = String(formData.get("childName") || "Maya").trim() || "Maya";
  state.childAge = String(formData.get("childAge") || "5").trim() || "5";
  state.routine = String(formData.get("routine") || "School pickup");
  state.completedTasks = [];
  saveState();
  render();
  setView("home");
});

resetButton.addEventListener("click", () => {
  state = structuredClone(defaultState);
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
