// src/observer/Observable.ts
type Observer = (data: any) => void;

export class Observable {
  private observers: Observer[] = [];

  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  public notify(data: any): void {
    this.observers.forEach((observer) => observer(data));
  }
}
