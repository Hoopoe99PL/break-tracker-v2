const IOController = require("socket.io-client");
const VerificationView = require("./Views/VerificationView.js").default;
const UserReservations = require("./Views/UserReservations.js").default;
const UserRequests = require("./Views/UserRequests.js").default;
const AdmPanel = require("./Views/AdmPanel.js").default;
// init
const socket = IOController.connect("http://localhost:3000/");
function replaceWithInfo(info, element) {
    element.innerHTML = `<h3 id="signing-info" class="comm-info-details">${info}</h3>`;
}
const loginWindow = new VerificationView();
const userReservationsView = new UserReservations();
const admView = new AdmPanel();
const requestsView = new UserRequests();
socket.on("verify", (error) => {
    document.body.innerHTML = "";
    loginWindow.build();
    const verElements = loginWindow.display();
    if (error.type) {
        alert(error.message);
    }
    verElements.parent.addEventListener("click", e => {
        if (e.target === verElements.login.submit) {
            const loginDetails = {
                username: verElements.login.username.value,
                password: verElements.login.password.value
            };
            socket.emit("login-attempt", loginDetails);
        }
    });
});
socket.on("logged-m-reservations", handshakeData => {
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
            default: break;
        }
    })
})
socket.on("logged-m-requests", handshakeData => {
    document.body.innerHTML = "";
    requestsView.build();
    requestsView.display();
    requestsView.setUserViewConfig(handshakeData.slots, handshakeData.userData.username, handshakeData.userData.status);
    const userReqHandlers = requestsView.getButtons();
    userReqHandlers.btnsHolder.addEventListener("click", e => {
        switch (e.target) {
            case userReqHandlers.requests:
                socket.emit("request-break", requestsView.getCurrentDatetime());
                break;
            case userReqHandlers.cancel:
                socket.emit("cancel-status", requestsView.getCurrentDatetime());
                break;
            default: break;
        }
    })
})
socket.on("logged-as-adm", handshakeData => {
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
            case adm.buttons.passcode:

                break;
            default: break;
        }
    })

})
socket.on("queue-delivery", queueDetails => {
    const mode = document.getElementById("config-mode").textContent;
    console.log(mode);
    if (queueDetails.mode === "reservations") {
        userReservationsView.renderQueue(queueDetails.queue);
    } else if (queueDetails.mode === "requests") {
        requestsView.renderQueue(queueDetails.queue);
    }
});
socket.on("update-user-config", config => {
    if (config.mode === "reservations") {
        userReservationsView.setUserViewConfig(config.slots, config.username, config.status);
    }
})


//user reservations event handlers
