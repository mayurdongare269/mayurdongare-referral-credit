# Contributing to EduShare

Thank you for your interest in contributing to EduShare! This document provides guidelines for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/edushare.git
   cd edushare
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/mayurdongare/edushare.git
   ```

4. **Install dependencies**
   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

5. **Set up environment variables**
   - Copy `.env.example` files
   - Fill in your credentials

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

## 💻 Development Process

### Creating a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Ensure code follows the style guide
4. Update documentation if needed

### Testing

Before submitting:
- Test all affected features
- Check for TypeScript errors
- Verify responsive design
- Test on different browsers

## 🔄 Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/your-feature-name
   git rebase main
   ```

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

4. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - All tests passing
   - No merge conflicts

## 📝 Coding Standards

### TypeScript

```typescript
// Use explicit types
function calculateCredits(purchases: number): number {
  return purchases * 2;
}

// Use interfaces for objects
interface User {
  id: string;
  name: string;
  credits: number;
}

// Use async/await over promises
async function fetchData() {
  const data = await api.get('/data');
  return data;
}
```

### React Components

```tsx
// Use functional components with TypeScript
interface Props {
  title: string;
  onClose: () => void;
}

export default function Modal({ title, onClose }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `CourseCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages: `kebab-case` folders (e.g., `sign-in/`)

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add trailing commas
- Max line length: 100 characters

## 📝 Commit Messages

Follow the Conventional Commits specification:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(dashboard): add circular progress charts

- Implemented SVG circular progress indicators
- Added gradient colors for each metric
- Animated progress with Framer Motion

Closes #123
```

```bash
fix(purchase): prevent duplicate course purchases

- Added check for existing purchases
- Return proper error message
- Update tests

Fixes #456
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Screenshots** - If applicable
6. **Environment** - OS, browser, versions

## 💡 Suggesting Features

When suggesting features:

1. **Use Case** - Why is this needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other approaches considered
4. **Additional Context** - Mockups, examples

## 📚 Documentation

When updating documentation:

- Keep it clear and concise
- Include code examples
- Update table of contents
- Check for broken links
- Use proper markdown formatting

## ✅ Checklist Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Responsive design verified
- [ ] Browser compatibility checked

## 🎯 Areas for Contribution

### High Priority
- Add comprehensive test coverage
- Implement email notifications
- Add payment integration
- Create admin dashboard

### Medium Priority
- Add course content pages
- Implement video lessons
- Add progress tracking
- Create leaderboards

### Low Priority
- Add social sharing features
- Implement dark mode
- Add more animations
- Improve accessibility

## 📞 Getting Help

If you need help:

1. Check existing documentation
2. Search existing issues
3. Ask in discussions
4. Create a new issue

## 🙏 Thank You!

Your contributions make this project better. Thank you for taking the time to contribute!

---

**Happy Coding! 🚀**
