class GitHubSearch {
  constructor(url, get, async, type, input) {
    this.url = url + this.getValueInput('input[name = "userName"]');
    this.get = get;
    this.async = async;
    this.type = type;
    this.input = input;
  }

  serverRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open(this.get, this.url, this.async);
    xhr.responseType = this.type;
    xhr.send();
    xhr.addEventListener("error", () => {
      alert(`Some internal error was encountered: ${xhr.status}`);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        this.render(this.checkingForNull(xhr.response), ".user-info");
        this.input.value = "";
      } else if (xhr.status === 404) {
        this.input.value = "";
        alert("Помилка запиту");
      }
    });
  }

  render(xhrResponse, selector) {
    const parentDiv = document.querySelector(selector);
    parentDiv.innerHTML = "";
    parentDiv.insertAdjacentHTML(
      "beforeend",
      `
            <div class = "user">
            <img src=" ${xhrResponse.avatar_url}" alt="">
            <p class = 'name'>Ім'я: <span>${xhrResponse.name}</span> </p>
            <p class = 'city'>Місто:<span>${xhrResponse.location}</span> </p>
            <p class = 'login'>Логін:<span> ${xhrResponse.login}</span></p>
            <p class = 'email'>Пошта:<span> ${xhrResponse.email}</span></p>
            <p class = 'blog'>Посилання на блог: <a href=" ${xhrResponse.blog}"> ${xhrResponse.blog}</a></p>
            <p class = 'gitHub'>Посилання на GitHub: <a href="${xhrResponse.html_url}"
            target="_blank">${xhrResponse.html_url}</a></p> 
            <div class = 'followers'>
               <p >Кількість підписників: <span>${xhrResponse.followers}</span></p>
               <p >Кількість підписок: <span>${xhrResponse.following}</span></p>
             </div>
            </div>
            `
    );
  }
  checkingForNull(obj) {
    for (let key in obj) {
      if (obj[key] === null) {
        obj[key] = `Дані не доступні`;
      }
    }
    return obj;
  }

  getValueInput(selector) {
    const input = document.querySelector(selector);
    const userName = input.value.trim();
    if (!userName) {
      throw new Error("Поле введеня не може бути пустим.");
    }
    return userName;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", (e) => {
    const input = document.querySelector('input[name = "userName"]');
    const url = `https://api.github.com/users/`;
    const gitHubSearch = new GitHubSearch(url, "GET", true, "json", input);
    try {
      gitHubSearch.serverRequest();
    } catch (e) {
      alert(e.message);
    }
  });
});
