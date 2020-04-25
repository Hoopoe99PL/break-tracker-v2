export default class VerificationPopup {
  constructor() {
    this.DOMElement;
  }
  build() {
    this.DOMElement = `<main class="verification" id="verification-hook">
        <header class="verification__header">
          <h1 class="verification__heading">Welcome to AskIT Break Tracker. Please sign in or sign up.</h1>
        </header>
        <section class="login">
          <header class="login__header">
            <h2 class="login__heading">Sign in with your account</h2>
          </header>
          <div class="form--toLeft">
          <section class="credentials-form" id="verification-login-form">
            <label class="credentials-form__label" for="login-username">Your username</label>
            <input type="text" class="credentials-form__input" id="login-username" minlength="5" maxlength="15">
            <label class="credentials-form__label" for="login-password">Your password</label>
            <input type="password" class="credentials-form__input" id="login-password" minlength="8" maxlength="15">
            <button class="btn btn--success" id="login-submit">Sign in</button>
          </section>
          </div>
        </section>
        <section class="register">
          <header class="register__header">
            <h2 class="register__heading">Create new account</h2>
            <ul class="requirements">
              <li class="requirements__item">Password can contain only letters (both lower and upper case) and digits.</li>
              <li class="requirements__item">Password must be at least 8 and maximum 15 characters long.</li>
              <li class="requirements__item">Username can contain only letters (both lower and upper case).</li>
              <li class="requirements__item">Username must be at least 5 and maximum 15 characters long.</li>
            </ul>
          </header>
          <section class="credentials-form form--toLeft" id="verification-register-form">
            <label class="credentials-form__label" for="register-username">Your username</label>
            <input type="text" class="credentials-form__input" id="register-username" minlength="5" maxlength="15">
            <label class="credentials-form__label" for="register-password">Your password</label>
            <input type="password" class="credentials-form__input" id="register-password" minlength="8" maxlength="15">
            <label class="credentials-form__label" for="register-password-confirm">Re-type your password</label>
            <input type="password" class="credentials-form__input" id="register-password-confirm" minlength="8" maxlength="15">
            <button class="btn btn--wrong" id="register-submit">Sign up</button>
          </section>
        </section>
        <footer class="footer">
        <p class="footer__author">&copy; 2020 <a href="mailto:lukasz-dzierzawski@o2.pl">Contact</a>, <a href="https://www.linkedin.com/in/dzierzawski-lukasz/" target="_blank">LinkedIn - let's connect!</a> / <a href="https://github.com/Hoopoe99PL" target="_blank">GitHub - want to view the source code?</a></p>
    </footer>
      </main>`
  }
  display() {
    document.body.insertAdjacentHTML("afterbegin", this.DOMElement);
    return {
      parent: document.getElementById("verification-hook"),
      login: {
        username: document.getElementById("login-username"),
        password: document.getElementById("login-password"),
        submit: document.getElementById("login-submit"),
      },
      register: {
        username: document.getElementById("register-username"),
        password: document.getElementById("register-password"),
        passwordConf: document.getElementById("register-password-confirm"),
        submit: document.getElementById("register-submit"),
      }
    }
  }
  hide() {
    const parent = document.getElementById("verification-hook");
    if (parent) {
      document.body.removeChild(parent);
    }
  }
};
