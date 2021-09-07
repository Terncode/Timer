let targetDate: undefined | number;
let notification: undefined | Notification; // = new Notification("Hi there!");
let title: undefined | string;
self.addEventListener("message", async ({ data }) => {
    const dateString = data.date;
    title = data.title;
    const notif = data.notification;
    if (notif) {
        notification = new Notification("Timer", {
            body: 'Timer is running in background'
        });
    } else {
        notification = undefined;
    }
    const date = new Date(dateString);
    targetDate = date.getTime();
});

function loop() {
    if (targetDate) {
        const now = Date.now();
        if (targetDate < now) {
            if (notification) {
                notification = new Notification("Timer", {
                    body: title || 'Time is up'
                });
            }
            self.postMessage("done")
            targetDate = undefined;
        }
    }
    requestAnimationFrame(loop);
}
loop();
