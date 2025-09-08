# Development Guide

## Available Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run test:all` - Run all tests (frontend + backend)
- `npm run test:frontend` - Run only frontend tests
- `npm run test:backend` - Run only backend tests
- `npm run test:watch` - Run tests in watch mode for both
- `npm run validate` - Run complete validation (format check + lint + tests)
- `npm run lint` - Run ESLint on both projects
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are properly formatted

## Git Hooks & Commit Standards

This project uses Husky for git hooks and enforces conventional commit standards.

### Pre-commit Hook

- Runs Prettier on staged files
- Validates code formatting

### Commit Message Standards

Commit messages must follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pre-push Hook

- Runs all tests before pushing to ensure code quality

## Testing

The project uses Vitest for testing across both frontend and backend:

- Frontend: 26 tests covering React components
- Backend: 7 tests covering API endpoints

Run `npm run test:all` to execute the complete test suite.
