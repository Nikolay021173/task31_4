import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";

import taskFieldTemplate from "./templates/taskField.html";

import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import { generateTestUser, getFromStorage, colorCorrection, addZero } from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import { statesTask, createItemTask, submitItemTask, activeAndFinishedTasksNumb } from "./services/tasks";
import { showMenuUser, addNewUser } from "./services/users";

generateTestUser(User); // Создаются новые пользователи

export const appState = new State();

const date = new Date();

export const loginForm = document.querySelector("#app-login-form");

let LoggedUser;
let TasksData = [];

colorCorrection();

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  authorization();
});

const authorization = function () {
  const formData = new FormData(loginForm);
  let login = formData.get("login");
  let password = formData.get("password");

  const session = localStorage.getItem('session');

  if (session && session !== 'undefined' && session !== 'null') {
    login = session;
    password = JSON.parse(localStorage.getItem('users')).filter(el => el.login === login)[0]['password'];
  }

  if((!session || session === 'undefined' || session === 'null') && (login === '' || password === '')) {
    return
  }

  let fieldHTMLContent = authUser(login, password)
    ? taskFieldTemplate
    : noAccessTemplate;

  console.log(authUser(login, password))

  document.querySelector("#content").innerHTML = fieldHTMLContent;

  if (fieldHTMLContent === taskFieldTemplate) {
    document.querySelector(".navbar").classList.add("higen");
  }

  if (authUser(appState._currentUser.login, appState._currentUser.password)) {
    LoggedUser = appState._currentUser.login;
    TasksData = getFromStorage(LoggedUser);

    localStorage.setItem('session', LoggedUser);

    if (!TasksData) {
      TasksData = [];
    }

    for (const taskDat of TasksData) {
      let taskElemUser = document.createElement("div");
      taskElemUser.classList.add("app-task-text");
      taskElemUser.classList.add("app-task");
      taskElemUser.setAttribute("draggable", "true");
      taskElemUser.textContent = taskDat.taskText;
      taskElemUser.statusTask = taskDat.statusTask;
      taskElemUser.id = `${taskDat.id}`;
      taskElemUser.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
      });

      let tasksStates;
      switch (taskDat.statusTask) {
        case "backlog":
          tasksStates = ".backlog";
          break;
        case "ready":
          tasksStates = ".ready";
          break;
        case "progress":
          tasksStates = ".progr";
          break;
        case "finished":
          tasksStates = ".finished";
          break;
        default:
          tasksStates = ".backlog";
      }
      const columnState = document.querySelector(tasksStates);
      columnState.appendChild(taskElemUser);
    }
  }

  const taskKanbanUser = document.querySelector(".app-left-margin-task-kanban");
  taskKanbanUser.textContent = `Kanban board by ${login}, 
        ${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${addZero(
    date.getFullYear()
  )}`;


  const menuAdmin = document.querySelector(".list-menu-admin");
  const header = document.querySelector(".header");
  const main = document.querySelector(".main");
  const footer = document.querySelector(".footer");

  const addUser = document.querySelector(".button-menu");

  main.classList.add("higen");


  showMenuUser(main, header, footer, menuAdmin, addUser);
  activeAndFinishedTasksNumb(1);

  const appButBacklogAdd = document.querySelector(".app-but-backlog");
  const appBacklogSubmit = document.querySelector(".app-backlog-submit");

  let listBacklog = document.querySelector(".backlog");

  createItemTask(appBacklogSubmit, appButBacklogAdd, listBacklog, LoggedUser);

  submitItemTask(appBacklogSubmit, appButBacklogAdd);

  statesTask(LoggedUser);

  addNewUser(menuAdmin, addUser);
}

authorization()