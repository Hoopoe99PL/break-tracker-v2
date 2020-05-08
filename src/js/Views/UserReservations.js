export default class UserReservations {
    constructor() {
        this.DOMElement = {};
    }
    build() {
        this.DOMElement.html =
            `<header id="user-reservations-header" class="welcome">
                <h1 class="welcome__header">Welcome to Break Tracker, pirate!</h1>
             </header>
            <main id="user-reservations-main" class="container">
                <header class="container__intro">
                    <table class="table">
                        <thead class="table__top">
                        <th class="table__heading">Max Breaks</th>
                        <th class="table__heading">Username</th>
                        <th class="table__heading">Current Status</th>
                        <th class="table__heading">Mode</th>
                        </thead>
                        <tbody class="table__body">
                        <tr class="table__row">
                        <td id="config-slots" class="table__item">SLOTS</td>
                        <td id="config-username" class="table__item">USERNAME</td>
                        <td id="config-status" class="table__item">STATUS</td>
                        <td id="config-mode" class="table__item">RESERVATIONS</td>
                        </tr>
                        </tbody>
                    </table>
                    <div id="status-buttons" class="intro__btn-holder">
                        <button id="status-reserve" class="btn btn--primary">Reserve</button>
                        <button id="status-break" class="btn btn--success">Break</button>
                        <button id="status-cancel" class="btn btn--wrong">Cancel</button>
                    </div>
                </header>
                <section class="container__queue">
                    <table class="table">
                        <thead class="table__top">
                        <th class="table__heading">Username</th>
                        <th class="table__heading">Current Status</th>
                        <th class="table__heading">Last Status Change</th>
                        </thead>
                        <tbody id="queue-parent" class="table__body">

                        </tbody>
                    </table>
                </section>
            </main>
            <footer class="footer" id="user-reservations-footer">
        <p class="footer__author">&copy; 2020 <a href="mailto:lukasz-dzierzawski@o2.pl">Contact</a>, <a href="https://www.linkedin.com/in/dzierzawski-lukasz/" target="_blank">LinkedIn - let's connect!</a> / <a href="https://github.com/Hoopoe99PL" target="_blank">GitHub - want to view the source code?</a></p>
    </footer>`;
        this.DOMElement.body = "user-reservations-main";
        this.DOMElement.header = "user-reservations-header";
        this.DOMElement.footer = "user-reservations-footer";
    }
    display() {
        document.body.insertAdjacentHTML("afterbegin", this.DOMElement.html);
    }
    hide() {
        const header = document.getElementById(this.DOMElement.header);
        const body = document.getElementById(this.DOMElement.body);
        const footer = document.getElementById(this.DOMElement.footer);
        if (header) {
            document.body.removeChild(header);
        }
        if (body) {
            document.body.removeChild(body);
        }
        if (footer) {
            document.body.removeChild(footer);
        }
    }
    setUserViewConfig(slots, username, status) {
        document.getElementById("config-slots").textContent = slots;
        document.getElementById("config-username").textContent = username;
        document.getElementById("config-status").textContent = status.toUpperCase();
    }
    renderQueue(queue) {
        document.getElementById("queue-parent").innerHTML = "";
        queue.forEach(e => {
            const queueItemParent = document.createElement("tr");
            queueItemParent.setAttribute("id", `queue-item-${e.idusers}`);
            queueItemParent.setAttribute("class", "table__row");
            const tdName = document.createElement("td");
            tdName.setAttribute("id", `queue-username-${e.idusers}`)
            tdName.setAttribute("class", "table__item");
            tdName.textContent = e.username;
            const tdStatus = document.createElement("td");
            tdStatus.setAttribute("id", `queue-status-${e.status}`)
            tdStatus.setAttribute("class", "table__item");
            tdStatus.textContent = e.status;
            const tdTimestamp = document.createElement("td");
            tdTimestamp.setAttribute("id", `queue-timestamp-${e.statusTimestamp}`)
            tdTimestamp.setAttribute("class", "table__item");
            tdTimestamp.textContent = e.statusTimestamp;
            queueItemParent.appendChild(tdName);
            queueItemParent.appendChild(tdStatus);
            queueItemParent.appendChild(tdTimestamp);
            document.getElementById("queue-parent").appendChild(queueItemParent);
        })
    };
    getButtons() {
        return {
            btnsHolder: document.getElementById("status-buttons"),
            reserve: document.getElementById("status-reserve"),
            break: document.getElementById("status-break"),
            cancel: document.getElementById("status-cancel"),
        }
    }
    getCurrentDatetime() {
        const date = new Date();
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        let day = date.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        const time = date.toLocaleTimeString();
        return `${year}-${month}-${day} ${time}`;
    }
}