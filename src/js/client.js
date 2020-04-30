const IOController = require("socket.io-client");
const VerificationView = require("./Classes/VerificationView.js").default;
const UserReservations = require("./Classes/UserReservations.js").default;
const AdmPanel = require("./Classes/AdmPanel.js").default;
// init
const socket = IOController.connect("http://localhost:3000/");
function replaceWithInfo(info, element) {
    element.innerHTML = `<h3 id="signing-info" class="comm-info-details">${info}</h3>`;
}
const loginWindow = new VerificationView();
const userReservationsView = new UserReservations();
const admView = new AdmPanel();
socket.on("verify", (error) => {
    loginWindow.hide();
    loginWindow.build();
    const verElements = loginWindow.display();
    if (error.type) {
        alert(error.message);
    }
    verElements.parent.addEventListener("click", e => {
        switch (e.target) {
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
socket.on("registered", () => {
    alert("Account registered correctly, you can now sign in.")
});
socket.on("logged-as-user-m-reservations", handshakeData => {
    document.body.innerHTML = "";
    userReservationsView.build();
    userReservationsView.display();
    userReservationsView.setUserViewConfig(handshakeData.slots, handshakeData.userData.username, handshakeData.userData.status);
    const userResHandlers = userReservationsView.getButtons();
    userResHandlers.btnsHolder.addEventListener("click", e => {
        switch (e.target) {
            case userResHandlers.reserve:
                socket.emit("reserve-break", userReservationsView.getCurrentDatetime());
                break;
            case userResHandlers.break:
                socket.emit("take-break", userReservationsView.getCurrentDatetime());
                break;
            case userResHandlers.cancel:
                socket.emit("cancel-status", userReservationsView.getCurrentDatetime());
                break;
        }
    })
})
socket.on("logged-as-adm-m-reservations", handshakeData => {
    document.body.innerHTML = "";
    userReservationsView.build();
    userReservationsView.display();
    userReservationsView.setUserViewConfig(handshakeData.slots, handshakeData.userData.username, handshakeData.userData.status);
    admView.build();
    admView.display();
    const adm = {};
    adm.inputs = admView.getInputs();
    adm.buttons = admView.getButtons();
    adm.inputs.parent.addEventListener("click", e => {
        switch (e.target) {
            case adm.buttons.mode.requests:

                break;
            case adm.buttons.mode.reservations:

                break;
            case adm.buttons.slots:

                break;
            case adm.buttons.queue.decline:

                break;
            case adm.buttons.queue.submit:

                break;
            case adm.buttons.adm:

                break;
            default: break;
        }
    })

})
socket.on("queue-delivery", queueList => {
    userReservationsView.renderQueue(queueList);
});
socket.on("update-user-config", config => {
    if (config.mode === "reservations") {
        userReservationsView.setUserViewConfig(config.slots, config.username, config.status);
    }
})


//user reservations event handlers
