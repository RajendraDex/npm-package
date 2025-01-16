class EventManager {
  private listeners: { [event: string]: Function[] } = {};

  public subscribe(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public notify(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

// Usage:
const eventManager = new EventManager();

// Subscribe to file creation events
eventManager.subscribe('fileCreated', (filePath: string) => {
  console.log(`File created: ${filePath}`);
});

// Notify when a file is created
eventManager.notify('fileCreated', '/src/controllers/UserController.ts');
