import { appState } from "../app";
import { User } from "../models/User";
import { getFromStorage } from "../utils";



export const showMenuUser = function (main, header, footer, menuAdmin, addUser) {
  const formControl = document.querySelectorAll(".form-control");
  const usersAndAdminPersonalAccount = document.querySelectorAll(".item-menu-text");
  const showAndCloseMenu = document.querySelector(".show-and-close-menu");
  const downListMenu = document.querySelector(".down-list-menu");
  const admin = document.querySelector(".admin");
  showAndCloseMenu.addEventListener('click', () => {
    downListMenu.classList.remove("higen");
    document.querySelector(".close-img").classList.add("higen");
    document.querySelector(".show-img").classList.remove("higen");
  });
  if (appState._currentUser.login === 'admin') {
    admin.classList.remove("higen");
    addUser.classList.remove("higen");
    console.log('777');
  }

  for (let i = 0; i < usersAndAdminPersonalAccount.length; i++) {

    usersAndAdminPersonalAccount[i].addEventListener('click', () => {
      if (i === 0) {
        main.classList.add("higen");
        downListMenu.classList.add("higen");
        document.querySelector(".close-img").classList.remove("higen");
        document.querySelector(".show-img").classList.add("higen");
      } else if (i === 1) {
        main.classList.remove("higen");
        downListMenu.classList.add("higen");
        document.querySelector(".close-img").classList.remove("higen");
        document.querySelector(".show-img").classList.add("higen");
      } else if (i === 2) {
        main.classList.add("higen");
        menuAdmin.classList.toggle("higen");
      } else if (i === 3) {
        document.querySelector(".navbar").classList.remove("higen");
        for (let elem of formControl) {
          elem.value = "";
        }
        localStorage.removeItem('session');
        header.classList.add("higen");
        main.classList.add("higen");
        footer.classList.add("higen");
      }
    });
  }
}

const createNewUser = function (user, menuAdmin) {
  let liUser = document.createElement("li");
  liUser.classList.add("item-menu-admin");
  let refUser = document.createElement("a");
  refUser.href = "#";
  refUser.classList.add("item-menu-text-admin");
  refUser.textContent = `Логин: ${user.login} Пароль: ${user.password}`;
  let delUser = document.createElement("button");
  delUser.textContent = "Delete";
  delUser.classList.add("removeUser");
  delUser.addEventListener("click", function () {
    deleteUser(user.login, menuAdmin);
  });
  liUser.append(refUser);
  liUser.append(delUser);
  menuAdmin.append(liUser);
}

export const addNewUser = function (menuAdmin, addUser) {
  addUser.addEventListener('click', () => {
    const newLogin = prompt('Введите логин нового пользователя:');
    const newPassword = prompt('Введите пароль нового пользователя:');
    if(newLogin === '' || newPassword === '') {
      alert('Ошибка!!!' +'\n' +
        'Вы позабыли указать логин или пароль нового пользователя.');
      return;
    }
    const newUser = new User(newLogin, newPassword);

    let users = getFromStorage("users");
    const existingUser = users.find((u) => u.login === newUser.login);
    if (existingUser) {
      alert("Пользователь с таким именем уже существует!");
      return;
    }

    users.push(newUser);
    User.save(newUser);

    const uniqueUsers = users.filter((user, index, self) =>
      index === self.findIndex((u) => u.login === user.login)
    );
    menuAdmin.textContent = '';

    uniqueUsers.forEach((user) => {
      createNewUser(user, menuAdmin);
    })
  });
  let users = getFromStorage("users");

  const elem = users.filter((user, index, self) =>
    index === self.findIndex((u) => u.login === user.login)
  );

  elem.forEach((user) => {
    createNewUser(user, menuAdmin);
  })
}

const deleteUser = function (login, menuAdmin) {
  if (login === appState._currentUser.login) {
    alert("Вы не можите удалить сами себя!!!!!");
    return;
  }

  let users = getFromStorage("users");

  let existingUsers = users.filter((user, index, self) =>
    index === self.findIndex((u) => u.login === user.login)
  );



  existingUsers = existingUsers.filter((user) => user.login !== login);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  localStorage.setItem(login, null);

  menuAdmin.textContent = '';
  existingUsers.forEach((user) => {
    createNewUser(user, menuAdmin);
  });
}