"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
class Observable {
    constructor() {
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    notify(data) {
        this.observers.forEach((observer) => observer(data));
    }
}
exports.Observable = Observable;
//# sourceMappingURL=observer.js.map