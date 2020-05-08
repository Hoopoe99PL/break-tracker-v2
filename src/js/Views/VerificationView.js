export default class VerificationPopup {
  constructor() {
    this.DOMElement;
  }
  build() {
    this.DOMElement = `<main class="verification" id="verification-hook">
        <header class="verification__header">
          <h1 class="verification__heading">Hey! Stop right there! Who are you and what is your passcode?</h1>
        </header>
        <section class="login">
          <header class="login__header">
            <h2 class="login__heading">Sign in with your username and passcode for your project.</h2>
          </header>
          <section class="credentials-form" id="verification-login-form">
            <label class="credentials-form__label" for="login-username">Who are you?</label>
            <input type="text" class="credentials-form__input" id="login-username" minlength="5" maxlength="15" required>
            <label class="credentials-form__label" for="login-password">Okay, your passcode?</label>
            <input type="password" class="credentials-form__input" id="login-password" minlength="8" maxlength="15" required>
            <button class="btn btn--success" id="login-submit">Let me in now...</button>
          </section>
        </section>
      </main>
      <footer class="footer">
        <p class="footer__author">&copy; 2020 <a href="mailto:lukasz-dzierzawski@o2.pl">Contact</a>, <a href="https://www.linkedin.com/in/dzierzawski-lukasz/" target="_blank">LinkedIn - let's connect!</a> / <a href="https://github.com/Hoopoe99PL" target="_blank">GitHub - want to view the source code?</a></p>
      </footer>`
  }
  display() {
    document.body.insertAdjacentHTML("afterbegin", this.DOMElement);
    return {
      parent: document.getElementById("verification-hook"),
      login: {
        username: document.getElementById("login-username"),
        password: document.getElementById("login-password"),
        submit: document.getElementById("login-submit"),
      }
    }
  }
};
