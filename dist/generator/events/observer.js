"use strict";
class EventManager {
    constructor() {
        this.listeners = {};
    }
    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    notify(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(data));
        }
    }
}
const eventManager = new EventManager();
eventManager.subscribe('fileCreated', (filePath) => {
    console.log(`File created: ${filePath}`);
});
eventManager.notify('fileCreated', '/src/controllers/UserController.ts');
//# sourceMappingURL=observer.js.map