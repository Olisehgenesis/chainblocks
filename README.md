# ChainBlocks

A modern visual programming environment for blockchain development built with Next.js, React, and Blockly.

## Features

- 🧩 **Visual Programming**: Drag-and-drop interface using Blockly
- ⚡ **Modern Stack**: Next.js 14 with React 18 and TypeScript
- 🎨 **Beautiful UI**: shadcn/ui components with Tailwind CSS
- 🔧 **Developer Experience**: Hot reload, TypeScript support, and modern tooling
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chainblocks/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page with Blockly
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Application header
│   └── Layout.tsx        # Main layout wrapper
├── lib/                   # Utility functions
│   └── utils.ts          # Tailwind class utilities
└── src/                   # Legacy Blockly files (blocks, generators, etc.)
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Technology Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **Visual Programming**: Blockly
- **Language**: TypeScript
- **Package Manager**: pnpm

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Apache-2.0
