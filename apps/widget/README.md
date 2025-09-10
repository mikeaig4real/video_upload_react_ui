# Video Embed Widget

A lightweight embeddable video player widget built with **Vite**, **TypeScript**, and **Video.js**.

This widget is designed to be embedded into external websites or apps via an `<iframe>`, providing a simple, customizable way to stream videos.

**This project complements the main UI: [Video Hub](../main/README.md)**  
**Backend: [video_upload_fastapi](https://github.com/mikeaig4real/video_upload_fastapi.git)**

## WORK IN PROGRESS, UPDATES PENDING

## Key Features

- **Embeddable via `<iframe>`**: Easily add video playback to any external site.
- **Dynamic Video Loading**: Videos are resolved using a URL like `/embed/:id`.
- **Fallback Player**: If no video ID is provided, a default demo video from Video.js is loaded.
- **Video.js Integration**: Industry-standard video player with adaptive streaming (HLS).
- **Lightweight Build**: No React, no frameworks – just Vite + Vanilla TS.
- **Custom API Integration**: Fetches video metadata and playback URLs from the backend.
- **Responsive Design**: The player scales within its iframe container.

## Tech Stack

- **TypeScript**
- **Vite**
- **Video.js**
- **Axios** (API requests)
- **Tailwind CSS** (optional styling for iframe container)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 6

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

### Build

```bash
pnpm run build
```

### Embedding the Widget

To embed the video player widget in an external site, you could do like so:

```html
<iframe
  src="https://widget-url.com/embed/:id"
  width="640" 
  height="360"
  frameborder="0"
  allowfullscreen
></iframe>
```

Replace `https://widget-url.com/embed/:id` with the actual URL of your widget, including the video ID you want to embed else a default video will be loaded.

#### Notes

You can adjust the width and height values to fit your layout — the video player inside will automatically resize.

Always include allowfullscreen so users can expand the video.

Replace the id parameter in the URL with the ID of the video you want to embed.

### Environment Variables

Create a `.env` file in the root directory and set your as seen in `.env.example`:

```env
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_ENV=development
```
