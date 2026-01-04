# ROI Calculator

A React-based ROI calculator component built with TypeScript, Redux Toolkit, and Vite. Designed for use as a standalone app and as a Webflow Code Component.

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

This starts Vite at `http://localhost:3000` with hot module replacement.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests with Vitest |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run webflow:share` | Bundle and upload to Webflow |
| `npm run webflow:share:ci` | Bundle and upload to Webflow (CI mode) |

## Webflow Integration

This project uses [Webflow Code Components](https://developers.webflow.com/code-components/introduction) to export React components to Webflow.

### Component Structure

Webflow components are defined in `*.webflow.tsx` files:

```
src/components/Calculator/Calculator.webflow.tsx
```

These files wrap your React components with `declareComponent()` from `@webflow/react`.

### Sharing to Webflow

#### Interactive (Browser Auth)

```bash
npm run webflow:share
```

This will:
1. Use `WEBFLOW_WORKSPACE_API_TOKEN` env variable if set
2. Otherwise, open a browser for authentication

#### With API Token

Set the environment variable:

```bash
export WEBFLOW_WORKSPACE_API_TOKEN=your_token_here
npm run webflow:share
```

#### CI/CD Pipeline

For automated deployments, use the CI script with the token:

```bash
WEBFLOW_WORKSPACE_API_TOKEN=your_token npm run webflow:share:ci
```

The `:ci` variant uses `--no-input` to skip all interactive prompts.

### Getting a Workspace API Token

1. Go to your Webflow Workspace settings
2. Navigate to **Integrations** > **API Access**
3. Generate a Workspace API token

## Project Structure

```
src/
├── components/
│   └── Calculator/
│       ├── Calculator.tsx          # Main component
│       ├── Calculator.webflow.tsx  # Webflow wrapper
│       ├── InputPanel.tsx
│       ├── ResultsPanel.tsx
│       └── AssumptionsPanel.tsx
├── store/                          # Redux store
├── selectors/                      # Redux selectors
└── utils/                          # Utility functions
```

## Configuration

- `vite.config.ts` - Vite configuration
- `vitest.config.ts` - Test configuration
- `webflow.json` - Webflow library configuration
- `tsconfig.json` - TypeScript configuration
