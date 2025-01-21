import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";
import { appState } from "../app";

export class Task extends BaseModel {
    constructor(taskText, statusTask) {
        super();
        this.statusTask = statusTask;
        this.user = appState.currentUser == null ? -1 : appState.currentUser.id;
        this.login = appState.currentUser == null ? '' : appState.currentUser.login;
        this.taskText = taskText;
        this.storageKey = "tasks";
    }

    get task() {
        return getFromStorage(this.storageKey);
    }

    set task(statusTask) {
      this.statusTask = statusTask;
   }

    static save(task) {
        try {
          addToStorage(task, task.storageKey);
          return true;
        } catch (e) {
          throw new Error(e);
        }
      }
}