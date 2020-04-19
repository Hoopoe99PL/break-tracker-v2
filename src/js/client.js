const IOController = require("socket.io-client");
const VerificationView = require("./Classes/VerificationView.js").default;
// init
socket = IOController.connect("http://localhost:3000/");
function replaceWithInfo(info, element){
    element.innerHTML = `<h3 id="signing-info" class="comm-info-details">${info}</h3>`;
}
socket.on("verify", (error)=>{

    const loginWindow = new VerificationView();
    loginWindow.hide();
    loginWindow.build();
    const verElements = loginWindow.display();
    if(error.type){
        alert(error.message);
    }
    verElements.parent.addEventListener("click", e=>{
        switch(e.target){
            case verElements.login.submit:
                const loginDetails = {
                    username: verElements.login.username.value,
                    password: verElements.login.password.value
                };
                socket.emit("login-attempt", loginDetails);
            break;
            case verElements.register.submit:
                const registerDetails = {
                    username: verElements.register.username.value,
                    password: verElements.register.password.value,
                    passwordConfirmation: verElements.register.passwordConf.value
                };
                socket.emit("register-attempt", registerDetails);
            break;
            default: break;
        }
    });
});
