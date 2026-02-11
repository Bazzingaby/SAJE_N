# Contributing to SAJE_N (Cosmos)

Thank you for your interest in contributing! This guide will help you get started.

## How to Contribute

### Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include reproduction steps, expected vs actual behavior, and environment details

### Suggesting Features
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Describe the problem your feature solves and any proposed solution

### Code Contributions

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/your-feature`
3. **Make changes** following our coding standards (below)
4. **Test** your changes
5. **Commit** with clear messages: `git commit -m "feat: add workflow node palette"`
6. **Push** to your fork: `git push origin feature/your-feature`
7. **Open a Pull Request** against `main`

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use |
|--------|-----|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no feature change |
| `test:` | Adding/updating tests |
| `chore:` | Build, tooling, dependencies |

### Coding Standards

- **TypeScript** for all source code
- **ESLint + Prettier** for formatting
- **Tailwind CSS** for styling (no inline styles)
- **shadcn/ui** for UI components
- **Zustand** for state management
- Components in `PascalCase`, utilities in `camelCase`
- Files named to match their default export

### Architecture Guidelines

- Touch targets must be minimum 44x44px
- All canvas interactions must work with both mouse and touch
- AI features must be LLM-agnostic (go through the AI Router)
- New pipeline nodes must implement the `PipelineNode` interface
- All user-facing text must be i18n-ready

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SAJE_N.git
cd SAJE_N

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint
```

## Community

- **Discord**: Coming soon
- **GitHub Discussions**: For questions and ideas
- **Issues**: For bugs and feature requests

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
