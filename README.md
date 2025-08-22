# Video Hub

A modern video upload, management + widget(library share) UI built with React, TypeScript, Vite, Zustand, and Tailwind CSS. **WORK IN PROGRESS, UPDATES PENDING**

## Live Preview

Access the full app and all routes here: [Video Hub Preview](https://video-hub-git-no-protected-routes-mikeaig4reals-projects.vercel.app/)

## Features

- Video upload with client-side validation
- Video library management
- User authentication (login/register)
- Responsive design for mobile and desktop
- Error boundaries and notifications
- Customizable themes

## Tech Stack

- **React** (v19)
- **TypeScript**
- **Vite**
- **Zustand** (state management)
- **Tailwind CSS**
- **Radix UI** (components)
- **Axios** (API requests)
- **Sonner** (notifications)

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory and set your API base URL:

VITE_API_BASE_URL=https://your-api-url.com/api

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import your repository into Vercel.
3. Set environment variables in Vercel dashboard (e.g., `VITE_API_BASE_URL`).
4. Deploy!

## Security & Best Practices

- API URLs and secrets should be stored in environment variables.
- All uploads are validated client-side, but server-side validation is required for security.
- Uses HTTPS for API endpoints in production.
- No sensitive data is persisted in localStorage.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
