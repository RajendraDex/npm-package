# Design Patterns Used

1. **Factory Pattern**: To dynamically create files based on their type (e.g., Controller, Service, Repository, etc.).

2. **Singleton Pattern**: For configurations like database settings and shared utilities.

3. **Strategy Pattern**: To handle file generation logic for different components (controller, model, service, etc.).

4. **Template Method Pattern**: To define the skeleton of the file creation algorithm and allow subclasses to implement specific behavior.

5. **Dependency Injection**: To inject dependencies like file helpers, templates, etc., making the code extensible and testable.
