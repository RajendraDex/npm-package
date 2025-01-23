# Create server with TypeScript design patterns':'

1. **Singleton Pattern**: The `Server` class is implemented as a singleton, ensuring only one instance of the server is created.
2. **Factory Pattern**: The `ServerFactory` class is used to create the appropriate server strategy (HTTP or HTTPS) based on the environment.
3. **Strategy Pattern**: The `ServerStrategy` interface and its implementations (`HttpServerStrategy` and `HttpsServerStrategy`) allow for different server types to be used interchangeably.
4. **Dependency Injection**: The `Server` class now takes dependencies like `express` and `ApolloServer` in its constructor, making it easier to test and modify.
5. **Async/Await**: The code uses async/await for better handling of asynchronous operations.
6. **Separation of Concerns**: The server configuration, creation, and startup logic are now separated into different classes and methods, improving maintainability.

This version provides a more modular and extensible structure, making it easier to add new features or modify existing ones. It also improves type safety by leveraging TypeScript's type system throughout the application.
