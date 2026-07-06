const credentials = {
  username: "dotti",
  password: "dotti2026"
};

const loginView = document.querySelector("#loginView");
const siteView = document.querySelector("#siteView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const lockButton = document.querySelector("#lockButton");

const unlock = () => {
  sessionStorage.setItem("dotti-preview-authenticated", "true");
  loginView.classList.add("is-hidden");
  siteView.classList.remove("is-hidden");
};

const lock = () => {
  sessionStorage.removeItem("dotti-preview-authenticated");
  siteView.classList.add("is-hidden");
  loginView.classList.remove("is-hidden");
  loginForm.reset();
};

if (sessionStorage.getItem("dotti-preview-authenticated") === "true") {
  unlock();
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

lockButton.addEventListener("click", lock);
