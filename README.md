# arXiv Research Hub

A modern, responsive web application for discovering and browsing the latest research papers from arXiv, organized by research domains. Built with React, TypeScript, and Vite for fast performance and excellent developer experience.

![arXiv Research Hub](https://img.shields.io/badge/arXiv-Research%20Hub-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3-green)

## 🌟 Features

- **📊 Topic-Based Browsing**: Navigate papers by 8 specialized research domains (LLMs & NLP, Computer Vision, Multimodal, Robotics & RL, IR/RAG, Speech/Audio, Safety/Evals, ML Systems)
- **🔍 Advanced Search**: Search papers by keywords across all topics with pagination support
- **⚡ Smart Caching**: Client-side caching reduces API calls and improves performance (10-minute cache duration)
- **🌙 Dark/Light Mode**: Toggle between themes for comfortable reading
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🚀 Real-time Data**: Direct integration with arXiv API for the latest papers
- **♿ Accessible**: Built with accessibility best practices using Radix UI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ppiova/arxiv-research-hub.git
   cd arxiv-research-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 Usage

### Browsing by Topics

1. **Select a Research Domain**: Click on any of the 8 topic tabs (LLMs & NLP, Computer Vision, etc.)
2. **View Papers**: Papers are displayed in cards showing title, authors, publication date, and categories
3. **Access Papers**: Click on paper titles to view abstracts, or use the HTML/PDF buttons for full access
4. **Load More**: Use the "Load more papers" button to fetch additional results

### Searching Papers

1. **Enter Keywords**: Use the search bar to find papers by specific terms
2. **View Results**: Search results are displayed with pagination
3. **Clear Search**: Click the "Clear" button or X icon to return to topic browsing

### Theme Toggle

- Use the moon/sun icon in the top-right corner to switch between dark and light modes
- Theme preference is preserved in browser storage

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── PaperCard.tsx   # Paper display component
│   ├── SearchBar.tsx   # Search functionality
│   └── ...
├── lib/                # Core utilities and logic
│   ├── api.ts          # arXiv API integration
│   ├── types.ts        # TypeScript type definitions
│   ├── queryBuilder.ts # Query construction utilities
│   └── utils.ts        # General utilities
├── hooks/              # Custom React hooks
├── styles/             # Global styles and themes
└── App.tsx             # Main application component
```

### Key Technologies

- **Frontend**: React 19, TypeScript 5.7, Vite 6.3
- **UI Components**: Radix UI primitives with Tailwind CSS
- **State Management**: React useState/useEffect hooks
- **Data Fetching**: Native fetch API with custom caching
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Phosphor Icons React

### Data Flow

1. **User Interaction** → Topic selection or search input
2. **Query Building** → Parameters processed by queryBuilder
3. **Cache Check** → Local cache checked for recent results
4. **API Request** → arXiv API called if cache miss
5. **Data Processing** → XML parsing and transformation
6. **UI Update** → Components re-render with new data

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (requires configuration)

### Environment Setup

The application requires no environment variables as it uses arXiv's public API directly. However, ensure your development environment meets these requirements:

- Modern browser with ES2020+ support
- Node.js 18+ for development
- Internet connection for arXiv API access

## 📚 API Reference

For detailed API documentation, see [API.md](./docs/API.md)

## 🧩 Components

For component documentation and usage examples, see [COMPONENTS.md](./docs/COMPONENTS.md)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [arXiv.org](https://arxiv.org) - The source of all research papers
- [arXiv API Documentation](https://arxiv.org/help/api) - Official API documentation
- [Radix UI](https://radix-ui.com) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 🌟 Acknowledgments

- Built with inspiration from the need to make arXiv research more accessible
- UI components based on shadcn/ui design system
- Thanks to the arXiv community for providing free access to research papers