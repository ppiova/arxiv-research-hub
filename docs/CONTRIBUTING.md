# Contributing to arXiv Research Hub

Thank you for your interest in contributing to arXiv Research Hub! This document provides guidelines and information for contributors.

## 🎯 Project Vision

arXiv Research Hub aims to make academic research more accessible by providing a modern, user-friendly interface for discovering and browsing papers from arXiv. Our goal is to create an efficient, responsive, and inclusive tool for researchers worldwide.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A modern web browser for testing

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/arxiv-research-hub.git
   cd arxiv-research-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Setup**
   Open `http://localhost:5173` and ensure the application loads correctly.

## 📝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **✨ Feature Requests**: Suggest new functionality
- **🔧 Code Contributions**: Implement fixes and features
- **📚 Documentation**: Improve guides and API docs
- **🎨 Design**: UI/UX improvements and accessibility enhancements
- **🧪 Testing**: Add tests and improve coverage
- **🔍 Code Review**: Review pull requests from other contributors

### Before You Start

1. **Check Existing Issues**: Look for existing issues or discussions about your idea
2. **Create an Issue**: For significant changes, create an issue to discuss first
3. **Fork the Repository**: Create your own fork to work in
4. **Create a Branch**: Use descriptive branch names (`feature/search-filters`, `fix/mobile-layout`)

## 🔄 Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/improvements

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): brief description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(search): add keyword highlighting in results
fix(mobile): resolve layout issues on small screens
docs(api): update API documentation with new endpoints
```

## 🏗️ Code Guidelines

### TypeScript Standards

- **Strict Mode**: We use TypeScript in strict mode
- **Type Safety**: Avoid `any` types; use proper type definitions
- **Interfaces**: Define clear interfaces for props and data structures
- **Generic Types**: Use generics for reusable components

```typescript
// Good: Proper interface definition
interface PaperCardProps {
  paper: ArxivPaper;
  onFavorite?: (paperId: string) => void;
}

// Avoid: Using any
function handleData(data: any) { ... }

// Good: Proper typing
function handleData(data: PapersResponse) { ... }
```

### React Best Practices

- **Functional Components**: Use function components with hooks
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Props Validation**: Use TypeScript interfaces for prop validation
- **Performance**: Use `useMemo` and `useCallback` judiciously

```typescript
// Good: Functional component with proper typing
export function PaperCard({ paper, onFavorite }: PaperCardProps) {
  const formattedDate = useMemo(() => 
    formatRelativeDate(paper.published), 
    [paper.published]
  );

  return (
    // Component JSX
  );
}
```

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utilities for styling
- **Consistent Spacing**: Follow the established spacing scale
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ensure all components support dark mode
- **Accessibility**: Maintain WCAG AA compliance

```typescript
// Good: Responsive, accessible styling
<button className={cn(
  "px-4 py-2 rounded-md font-medium transition-colors",
  "bg-primary text-primary-foreground hover:bg-primary/90",
  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  className
)}>
  {children}
</button>
```

### File Organization

- **Component Files**: One component per file
- **Index Files**: Use for clean imports
- **Constants**: Group related constants in separate files
- **Types**: Centralize type definitions

```
src/
├── components/
│   ├── ui/           # Base components
│   ├── PaperCard/    # Complex components in folders
│   │   ├── index.ts
│   │   ├── PaperCard.tsx
│   │   └── PaperCard.test.tsx
│   └── index.ts      # Export all components
├── lib/
│   ├── api/         # API-related code
│   ├── types/       # Type definitions
│   └── utils/       # Utility functions
└── hooks/           # Custom hooks
```

## 🧪 Testing

### Testing Requirements

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure WCAG compliance
- **Browser Testing**: Test across different browsers

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { PaperCard } from './PaperCard';
import { mockPaper } from '../../../__mocks__/papers';

describe('PaperCard', () => {
  it('displays paper information correctly', () => {
    render(<PaperCard paper={mockPaper} />);
    
    expect(screen.getByText(mockPaper.title)).toBeInTheDocument();
    expect(screen.getByText(/by/i)).toBeInTheDocument();
  });

  it('calls onFavorite when favorite button is clicked', () => {
    const onFavorite = jest.fn();
    render(<PaperCard paper={mockPaper} onFavorite={onFavorite} />);
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(onFavorite).toHaveBeenCalledWith(mockPaper.id);
  });
});
```

## 🔍 Code Review Process

### Submitting Pull Requests

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Follow coding guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Thoroughly**
   ```bash
   npm run test
   npm run build
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/new-feature
   ```

### Pull Request Guidelines

**PR Title:** Use conventional commit format
**Description:** Include:
- Summary of changes
- Motivation and context
- How to test the changes
- Screenshots (for UI changes)
- Breaking changes (if any)

**PR Template:**
```markdown
## Summary
Brief description of changes

## Changes Made
- [ ] Feature/fix 1
- [ ] Feature/fix 2

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Accessibility checked

## Screenshots
[Include screenshots for UI changes]

## Checklist
- [ ] Code follows project guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Criteria

Reviewers will check for:
- **Code Quality**: Follows established patterns and guidelines
- **Functionality**: Changes work as intended
- **Performance**: No significant performance regressions
- **Accessibility**: Maintains or improves accessibility
- **Testing**: Adequate test coverage
- **Documentation**: Updated when necessary

## 🐛 Bug Reports

### Before Reporting

1. **Search Existing Issues**: Check if the bug is already reported
2. **Reproduce**: Ensure you can reproduce the bug consistently
3. **Test Environment**: Try in different browsers/devices

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g. macOS 13.1]
- Browser: [e.g. Chrome 108, Safari 16]
- Device: [e.g. iPhone 13, Desktop]

**Screenshots**
Add screenshots if applicable

**Additional Context**
Any other context about the problem
```

## 💡 Feature Requests

### Before Requesting

1. **Check Roadmap**: Review existing plans and discussions
2. **Consider Scope**: Ensure the feature aligns with project goals
3. **Research**: Look for existing solutions or alternatives

### Feature Request Template

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
Detailed description of your proposed feature

**Alternative Solutions**
Other approaches you've considered

**Use Cases**
Specific scenarios where this would be helpful

**Implementation Ideas**
Technical suggestions (if any)

**Additional Context**
Screenshots, mockups, or examples
```

## 🎨 Design Contributions

### Design System

We follow a consistent design system:
- **Colors**: Semantic color tokens for light/dark themes
- **Typography**: Inter font family with defined hierarchy
- **Spacing**: 4px base scale (4, 8, 12, 16, 24, 32...)
- **Components**: Radix UI primitives with custom styling

### Design Guidelines

- **Accessibility First**: WCAG AA compliance minimum
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimize images and animations
- **Consistency**: Follow established patterns

### Contributing Designs

1. **Create Issues**: Describe the design problem or opportunity
2. **Provide Mockups**: Use Figma, Sketch, or similar tools
3. **Consider Implementation**: Think about technical feasibility
4. **Gather Feedback**: Discuss with maintainers and community

## 📊 Analytics and Performance

### Performance Guidelines

- **Core Web Vitals**: Maintain good scores
- **Bundle Size**: Keep bundle size reasonable
- **Accessibility**: 100% Lighthouse accessibility score
- **SEO**: Maintain good SEO practices

### Monitoring

We track:
- Application performance metrics
- User interaction patterns
- Error rates and types
- API response times

## 🔒 Security

### Security Guidelines

- **Dependencies**: Keep dependencies updated
- **API Security**: Secure API integration practices
- **Data Privacy**: Respect user privacy
- **XSS Prevention**: Sanitize user inputs

### Reporting Security Issues

For security vulnerabilities, please email [security email] rather than creating public issues.

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Code Reviews**: For implementation feedback

### Maintainer Response Times

- **Issues**: We aim to respond within 48 hours
- **Pull Requests**: Reviews typically within 1 week
- **Security Issues**: Within 24 hours

## 🎉 Recognition

We appreciate all contributions! Contributors will be:
- Listed in the project's contributors file
- Mentioned in release notes for significant contributions
- Invited to join the maintainers team for ongoing contributors

## 📜 License

By contributing to arXiv Research Hub, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to arXiv Research Hub! Your efforts help make academic research more accessible to everyone. 🚀