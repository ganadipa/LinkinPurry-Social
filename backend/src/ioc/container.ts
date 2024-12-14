import { Container, interfaces } from "inversify";

export class IOCContainer {
  private static instance: IOCContainer;
  private container: Container;

  private constructor() {
    this.container = new Container();
  }

  public static getInstance(): IOCContainer {
    if (!this.instance) {
      this.instance = new IOCContainer();
    }

    return this.instance;
  }

  public getContainer(): Container {
    return this.container;
  }

  public bind<T>(
    serviceIdentifier: symbol,
    constructor: interfaces.Newable<T>
  ): void {
    this.container
      .bind<T>(serviceIdentifier)
      .to(constructor)
      .inSingletonScope();
  }

  public get<T>(serviceIdentifier: symbol): T {
    return this.container.get<T>(serviceIdentifier);
  }
}
