# Contributing to next-advanced-sitemap

First off, thank you for considering contributing to next-advanced-sitemap. It is people like you who make the open-source community such an amazing place to learn, inspire, and create.

## Code of Conduct

By participating in this project, you are expected to uphold a professional and respectful conduct at all times.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the existing issues to see if the problem has already been reported. When creating a bug report, please include:
- A clear and descriptive title.
- Steps to reproduce the problem.
- Your environment (Node.js version, Next.js version).
- Expected vs. actual behavior.

### Suggesting Enhancements

We are always open to new ideas. If you have a suggestion for an enhancement:
- Open an issue to discuss the change before implementing it.
- Explain why this feature would be useful to most users.

### Pull Requests

To contribute code:
1. Fork the repository.
2. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`).
3. Ensure your code follows the existing style and is properly typed with TypeScript.
4. Add or update tests for your changes.
5. Run `npm test` to ensure all tests pass.
6. Commit your changes using clear and descriptive commit messages.
7. Push to your fork and submit a pull request.

## Development Setup

1. Clone your fork locally.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the build in watch mode:
    ```bash
    npm run dev
    ```

4. Run tests:
    ```bash
    npm test
    ```

## Design Principles

* **Zero Dependencies** : We aim to keep the library lightweight. Avoid adding external packages unless absolutely necessary.

* **Type Safety**: All public APIs must be strictly typed.

* **Next.js Alignment**: Features should prioritize compatibility with the Next.js App Router and Route Handlers.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.