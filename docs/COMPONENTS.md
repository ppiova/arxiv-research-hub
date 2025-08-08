# Component Documentation

This document provides detailed information about the React components used in the arXiv Research Hub application.

## Component Architecture

The application follows a modular component architecture with clear separation of concerns:

- **UI Components** (`/src/components/ui/`): Base components from shadcn/ui
- **Feature Components** (`/src/components/`): Application-specific components
- **Layout Components**: Page-level layout and structure
- **Utility Components**: Loading states, error handling, etc.

## Main Application Components

### `App` (App.tsx)

The root application component that manages global state and orchestrates all functionality.

**State Management:**
```typescript
interface AppState {
  papers: ArxivPaper[];        // Current paper list
  loading: boolean;            // Loading state
  error: string | null;        // Error message
  currentTopic: TopicKey | null; // Selected topic
  searchQuery: string;         // Search input
  totalResults: number;        // Total available results
  loadedResults: number;       // Currently loaded results
  darkMode: boolean;           // Theme preference
  currentPage: number;         // Current pagination page
}
```

**Key Features:**
- Topic-based navigation with tabs
- Search functionality with query management
- Pagination with "Load More" button
- Dark/light mode toggle
- Error handling and loading states
- Cache-aware data fetching

**Usage:**
```jsx
// Root component, no props required
<App />
```

### `PaperCard` (PaperCard.tsx)

Displays individual paper information in a card layout.

**Props:**
```typescript
interface PaperCardProps {
  paper: ArxivPaper;  // Paper data object
}
```

**Features:**
- Responsive card layout
- Paper title as clickable link to abstract
- Author list with intelligent formatting
- Publication date with relative formatting
- Category badges (first 3 + overflow indicator)
- HTML link button for alternative viewing
- Hover effects and transitions

**Usage:**
```jsx
<PaperCard paper={paperData} />
```

**Styling:**
- Uses `Card` base component
- Responsive grid layout
- Truncated text with line clamping
- Accessible color contrast
- Dark mode support

### `SearchBar` (SearchBar.tsx)

Provides search functionality with input validation and state management.

**Props:**
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;  // Search callback
  isLoading?: boolean;                // Loading state
  placeholder?: string;               // Input placeholder
}
```

**Features:**
- Controlled input with local state
- Search icon and clear button
- Form submission handling
- Loading state support
- Responsive design
- Keyboard accessibility

**Usage:**
```jsx
<SearchBar 
  onSearch={handleSearch}
  isLoading={loading}
  placeholder="Search papers by keyword..."
/>
```

**Behavior:**
- Submits on Enter key or button click
- Clears input and calls onSearch('') when clear button clicked
- Disables input during loading states
- Trims whitespace from queries

## UI Components (shadcn/ui)

### Base Components

The application uses shadcn/ui components for consistent design:

- **`Button`**: Primary actions, links, and interactive elements
- **`Card`**: Container for paper information and states
- **`Input`**: Text input for search functionality
- **`Badge`**: Category and tag display
- **`Tabs`**: Topic navigation
- **`Skeleton`**: Loading placeholders

### `Tabs` Navigation

Used for topic-based browsing with 8 research domains:

```jsx
<Tabs value={currentTopic} onValueChange={handleTopicChange}>
  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
    {Object.entries(TOPICS).map(([key, { label }]) => (
      <TabsTrigger key={key} value={key}>
        {label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

**Responsive Design:**
- 4 columns on mobile/tablet
- 8 columns on desktop
- Scrollable on overflow

## State Management Components

### `ErrorState` (ErrorState.tsx)

Displays error messages with optional retry functionality.

**Props:**
```typescript
interface ErrorStateProps {
  message: string;           // Error message to display
  onRetry?: () => void;     // Optional retry callback
  showRetry?: boolean;      // Show/hide retry button
}
```

**Features:**
- Centered card layout
- Error icon with semantic colors
- Descriptive error message
- Optional retry button
- Accessible design

**Usage:**
```jsx
<ErrorState
  message="Failed to load papers. Please check your connection."
  onRetry={handleRetry}
/>
```

### `EmptyState` (ErrorState.tsx)

Displays empty state messages with optional actions.

**Props:**
```typescript
interface EmptyStateProps {
  title: string;              // Main heading
  description: string;        // Descriptive text
  action?: {                 // Optional action button
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```jsx
<EmptyState
  title="No papers found"
  description="Try different keywords or browse by topic."
  action={{
    label: "Clear search",
    onClick: () => handleSearch('')
  }}
/>
```

## Loading Components

### `PaperCardSkeleton` (PaperCardSkeleton.tsx)

Provides loading placeholders that match the paper card layout.

**Components:**
- `PaperCardSkeleton`: Single card skeleton
- `PaperGridSkeleton`: Grid of skeleton cards

**Props (PaperGridSkeleton):**
```typescript
interface PaperGridSkeletonProps {
  count?: number;  // Number of skeleton cards (default: 6)
}
```

**Features:**
- Matches exact layout of paper cards
- Responsive grid system
- Smooth loading animations
- Consistent spacing and proportions

**Usage:**
```jsx
// Single skeleton
<PaperCardSkeleton />

// Grid of skeletons
<PaperGridSkeleton count={3} />
```

## Icon Components

### Phosphor Icons

The application uses Phosphor Icons React for consistent iconography:

**Primary Icons:**
- `MagnifyingGlass`: Search functionality
- `Moon`/`Sun`: Theme toggle
- `ArrowDown`: Load more actions
- `X`: Clear/close actions
- `ExternalLink`: External links
- `Globe`: HTML view links
- `Calendar`: Date information
- `Users`: Author information
- `AlertTriangle`: Error states
- `ArrowCounterClockwise`: Retry actions

**Usage:**
```jsx
import { MagnifyingGlass, Calendar } from '@phosphor-icons/react';

<MagnifyingGlass size={20} className="text-muted-foreground" />
<Calendar size={14} className="shrink-0" />
```

## Responsive Design Patterns

### Grid Layouts

**Paper Grid:**
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop

**Tab Navigation:**
```css
grid-cols-4 lg:grid-cols-8
```
- 4 tabs visible on mobile
- 8 tabs visible on desktop

### Spacing System

The application uses Tailwind's spacing scale:
- `gap-6`: Primary grid gaps
- `p-6`: Card padding
- `mb-4`/`mt-4`: Section spacing
- `gap-2`: Small element spacing

## Accessibility Features

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Enter key submits forms
- Escape key clears search (where applicable)

### Screen Reader Support

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for informative icons
- ARIA labels where needed
- Focus management

### Color Contrast

- All text meets WCAG AA contrast requirements
- Dark mode support with appropriate contrast
- Interactive states are clearly visible
- Error states use appropriate semantic colors

## Styling Architecture

### CSS-in-JS Pattern

Components use Tailwind classes with the `cn()` utility:

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

### Theme Variables

Dark/light mode uses CSS custom properties:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  /* ... */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  /* ... */
}
```

## Performance Optimizations

### Component Optimization

- Minimal re-renders through proper state management
- Skeleton loading for perceived performance
- Efficient list rendering with stable keys
- Lazy loading for images (where applicable)

### Memory Management

- Component cleanup in useEffect
- Event listener removal
- Cache size management
- Proper dependency arrays

## Testing Considerations

### Component Testing

Each component should be tested for:
- Prop handling and validation
- User interaction (clicks, form submission)
- Accessibility compliance
- Responsive behavior
- Error state handling

### Example Test Structure

```typescript
describe('PaperCard', () => {
  const mockPaper: ArxivPaper = {
    // ... test data
  };

  it('renders paper information correctly', () => {
    render(<PaperCard paper={mockPaper} />);
    // Assertions...
  });

  it('handles link clicks', () => {
    render(<PaperCard paper={mockPaper} />);
    // Test link behavior...
  });
});
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component has one clear purpose
2. **Prop Interface**: Clear TypeScript interfaces for all props
3. **Composition**: Prefer composition over inheritance
4. **Accessibility**: Built-in a11y support from the start
5. **Performance**: Optimized rendering and memory usage

### Code Organization

1. **Consistent Naming**: PascalCase for components, camelCase for props
2. **File Structure**: One component per file with matching names
3. **Import Order**: External deps → internal deps → relative imports
4. **Export Pattern**: Named exports for components, default for pages

### Styling Guidelines

1. **Utility First**: Use Tailwind utilities for styling
2. **Responsive Design**: Mobile-first responsive classes
3. **Consistent Spacing**: Use design system spacing scale
4. **Color Usage**: Semantic color variables for theme support