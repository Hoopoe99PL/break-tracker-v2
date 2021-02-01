const IOController = require("socket.io-client");
const VerificationView = require("./Views/VerificationView.js").default;
const UserReservations = require("./Views/UserReservations.js").default;
const UserRequests = require("./Views/UserRequests.js").default;
const AdmPanel = require("./Views/AdmPanel.js").default;
// init
const socket = IOController.connect("url");
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
                socket.emit("adm-change-m-req");
                break;
            case adm.buttons.mode.reservations:
                socket.emit("adm-change-m-res");
                break;
            case adm.buttons.slots:
                socket.emit("adm-change-slots", adm.inputs.slots.value);
                break;
            case adm.buttons.queue.decline:
                socket.emit("reject-break-request", [adm.inputs.reject.value, admView.getCurrentDatetime()]);
                break;
            case adm.buttons.queue.submit:
                socket.emit("accept-break-request", [adm.inputs.acceptance.value, admView.getCurrentDatetime()]);
                break;
            case adm.buttons.adm:
                socket.emit("delegate-new-admin", adm.inputs.adm.value);
                break;
            case adm.buttons.passcode:
                socket.emit("change-passcode", adm.inputs.passcode.value);
                break;
            case adm.buttons.deleteUser:
                socket.emit("adm-delete-user", adm.inputs.deleteUser.value);
                break;
            default: break;
        }
    })

})
socket.on("queue-delivery", queueDetails => {
    const mode = document.getElementById("config-mode").textContent;
    if (queueDetails.mode === "reservations") {
        userReservationsView.renderQueue(queueDetails.queue);
    } else if (queueDetails.mode === "requests") {
        requestsView.renderQueue(queueDetails.queue);
    }
});
socket.on("update-user-config", config => {
    if (config.mode === "reservations") {
        userReservationsView.setUserViewConfig(config.slots, config.username, config.status);
    } else if (config.mod === "requests") {
        requestsView.setUserViewConfig(config.slots, config.username, config.status);
    }
})
socket.on("inform-user", error => {
    alert(error);
})
