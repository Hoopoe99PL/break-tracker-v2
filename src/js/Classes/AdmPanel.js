export default class AdmPanel {
    constructor() {
        this.HTMLElement;
    }
    build() {
        this.HTMLElement =
            `<section class="adm-reservations" id="adm-reservations-panel">
                <h3 class="adm-reservations__heading">Admin panel</h3>
                <div id="btns-mode-container" class="adm-reservations__ctrl-group">
                <h4 class="adm-reservations__subtitle">Choose mode:</h4>
                <button id="mode-requests" class="btn btn--primary btn--static">Switch Mode to REQUESTS</button>
                <button id="mode-reservations" class="btn btn--success btn--static">Switch Mode to RESERVATIONS</button>
                </div>
                <div id="btns-slots-container" class="adm-reservations__ctrl-group">
                <h4 class="adm-reservations__subtitle">Change amount of available break slots:</h4>
                <input type="number" id="change-slots-amount" class="adm-reservations__slotsinpt">
                <button id="change-slots-submit" class="btn btn--success">Update Slots</button>
                </div>
                <div id="btns-kick-reject-container" class="adm-reservations__ctrl-group">
                <h4 class="adm-reservations__subtitle">Remove user from queue or reject a break request:</h4>
                <label for="queue-removal-username" class="credentials-form__label">Provide exact username of the user to confirm your decision</label>
                <input type="text" id="queue-removal-username" class="credentials-form__input">
                <button id="kick-f-queue" class="btn btn--wrong">Remove/Reject</button>
                </div>
                <div id="btns-add-accept-container" class="adm-reservations__ctrl-group">
                <h4 class="adm-reservations__subtitle">Add user to queue or accept a request:</h4>
                <label for="queue-add-username" class="credentials-form__label">Provide exact username of the user to confirm your decision</label>
                <input type="text" id="queue-add-username" class="credentials-form__input">
                <button id="add-to-queue" class="btn btn--success">Add/Accept</button>
                </div>
                <div id="btns-add-as-admin-container" class="adm-reservations__ctrl-group">
                <h4 class="adm-reservations__subtitle">Change user to Admin:</h4>
                <label for="queue-add-username" class="credentials-form__label">Provide exact username of the user to confirm your decision</label>
                <input type="text" id="add-adm" class="credentials-form__input">
                <button id="add-to-adm" class="btn btn--success">Add</button>
                </div>
            </section>`
    }
    display() {
        document.body.insertAdjacentHTML("beforeend", this.HTMLElement);
    }
    getButtons() {
        return {
            parent: document.getElementById("adm-reservations-panel"),
            mode: {
                requests: document.getElementById("mode-requests"),
                reservations: document.getElementById("mode-reservations"),
            },
            slots: document.getElementById("change-slots-submit"),
            queue: {
                submit: document.getElementById("add-to-queue"),
                decline: document.getElementById("kick-f-queue"),
            },
            adm: document.getElementById("add-to-adm"),
        }
    }
    getInputs() {
        return {
            parent: document.getElementById("adm-reservations-panel"),
            slots: document.getElementById("change-slots-amount"),
            acceptance: document.getElementById("queue-add-username"),
            reject: document.getElementById("queue-removal-username"),
            adm: document.getElementById("add-adm"),
        }
    }
}