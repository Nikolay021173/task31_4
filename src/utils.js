
export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key) || [] ;
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User) {
  const user1 = new User("Петя", "123");
  User.save(user1);
  const user2 = new User("Вася", "1111");
  User.save(user2);
  const admin = new User("admin", "777");
  User.save(admin);
};

export const colorCorrection = function() {
  document.querySelector("nav").classList.remove("bg-dark");
  document.querySelector("nav").classList.add('bg-blue');
}

export const addZero = function(num) {
  if (num >= 0 && num <= 9) {
    return "0" + num;
  } else {
    return num;
  }
}
