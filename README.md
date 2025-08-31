# Video Hub

A modern video upload and management UI built with React, TypeScript, Vite, Zustand, and Tailwind CSS.

**This project complements the backend: [video_upload_fastapi](https://github.com/mikeaig4real/video_upload_fastapi.git)**

## WORK IN PROGRESS, UPDATES PENDING

## Key Strengths & Features

- **Duplicate Video Prevention:** Uses robust hashing to prevent uploading the same video twice.
- **Automatic Retries:** Failed uploads and finalization steps are automatically retried for reliability.
- **Real-Time Notifications:** Users receive instant feedback on upload progress, errors, and completion via toast notifications.
- **Batch Uploads:** Upload multiple videos at once, with each handled independently.
- **Client-Side Validation:** Video type, size, and metadata are validated before upload.
- **Error Boundaries:** UI remains stable and user-friendly even if something goes wrong.
- **Responsive Design:** Works seamlessly on mobile and desktop.
- **Customizable Themes:** Easily switch between light, dark, and system themes.
- **Video Library Management:** Browse, filter, and manage uploaded videos.
- **Integration with FastAPI Backend:** All uploads, metadata, and authentication are powered by a robust Python backend.

## Tech Stack

- **React** (v19)
- **TypeScript**
- **Vite**
- **Zustand** (state management)
- **Tailwind CSS**
- **Radix UI** (components)
- **Axios** (API requests)
- **Sonner** (notifications)
- **Framer Motion** (animations)

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

Create a `.env` file in the root directory and set your API base URL and others in .env.example:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

## Deployment

This project is ready to deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import your repository into Vercel.
3. Set environment variables in Vercel dashboard (e.g., `VITE_API_BASE_URL`).
4. Deploy!

## Security & Best Practices

- API URLs and secrets are stored in environment variables.
- All uploads are validated client-side, but server-side validation is required for security.
- Uses HTTPS for API endpoints in production.
- No sensitive data is persisted in localStorage.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
