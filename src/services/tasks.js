import { Task } from "../models/Task";
import { getFromStorage, addToStorage } from "../utils";



export const statesTask = function(LoggedUser) {
  const AllLists = document.querySelectorAll(".app-state-task");

  for (let item of AllLists) {
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    item.addEventListener("drop", (e) => {
      let id = e.dataTransfer.getData("text/plain");
      item
        .querySelector(".app-task-list")
        .appendChild(document.getElementById(id));


      const newState = item.id;
      
      activeAndFinishedTasksNumb(1);
      const tasks = getFromStorage(LoggedUser);
      const updatedTasks = tasks.map((t) => {
        if (t.id == id) {
          t.statusTask = newState;
          Task.save(t);
        }

        return t;
      });

      localStorage.setItem(LoggedUser, JSON.stringify(updatedTasks));

      activeAndFinishedTasksNumb(1);

    });
  }
}

export const createItemTask = function(appBacklogSubmit, appButBacklogAdd, listBacklog, LoggedUser) {
  appButBacklogAdd.addEventListener("click", () => {
  let taskElem = document.createElement("div");
    taskElem.classList.add("app-task-text");
    taskElem.classList.add("app-task");
    taskElem.setAttribute("draggable", "true");
    let textInput = document.createElement("textarea");
    textInput.style.borderLeft = "none";
    textInput.style.borderTop = "none";
    textInput.style.borderRight = "none";
    textInput.style.borderWidth = "2px";

    textInput.addEventListener("blur", function () {
      const task = new Task(textInput.value, "backlog");
      task.taskText = this.value;
      addToStorage(task, LoggedUser);
      taskElem.innerHTML = task.taskText;
      taskElem.statusTask = task.statusTask;
      taskElem.id = `${task.id}`;

      this.remove();
    });


    taskElem.addEventListener("dragstart", (e) => {
      console.log(e.target.id);
      e.dataTransfer.setData("text/plain", e.target.id);
    });

    appBacklogSubmit.classList.remove("higen");
    appButBacklogAdd.classList.add("higen");

    taskElem.append(textInput);

    listBacklog.append(taskElem);
  });
}

export const submitItemTask = function(appBacklogSubmit, appButBacklogAdd) {
  appBacklogSubmit.addEventListener("click", () => {
    appBacklogSubmit.classList.add("higen");
    appButBacklogAdd.classList.remove("higen");

    activeAndFinishedTasksNumb(2);

  });
}

export const activeAndFinishedTasksNumb = function(n) {
  let backlogCount = document.querySelectorAll(".backlog .app-task-text").length;
  let readyCount = document.querySelectorAll(".ready .app-task-text").length;
  let progressCount = document.querySelectorAll(".progr .app-task-text").length;
  let finishedCount = document.querySelectorAll(".finished .app-task-text").length;
  let activeTasksNumb = backlogCount + readyCount + progressCount;;
 
   
  let finishedTasksNumb = finishedCount;
  const appActive = document.querySelector(".app-active");
   const appFinish = document.querySelector(".app-finish");
   switch(n) {
    case 1:
      appActive.textContent = `Active tasks: ${activeTasksNumb}`; 
      break;
      case 2:
        appActive.textContent = `Active tasks: ${activeTasksNumb++}`; 
      break;
  }
   appFinish.textContent = `Finished tasks: ${finishedTasksNumb}`; 
}