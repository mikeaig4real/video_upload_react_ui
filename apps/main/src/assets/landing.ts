import { WIDGET_URL } from "./constants";

const sampleFile = {
  id: "68bb21db4b5b4d9be15b864a",
  height: 360,
  width: 640,
};
const isPortrait = sampleFile.height > sampleFile.width;
const embedUrl = `${WIDGET_URL}/embed/${sampleFile.id}`;
const embedCode = `<iframe 
  src="${embedUrl}" 
  width="${isPortrait ? "360" : "640"}"
  height="${isPortrait ? "640" : "360"}"
  frameborder="0"
  allowfullscreen>
</iframe>
`;
export default {
  words: [
    {
      text: "Upload,",
    },
    {
      text: " Manage,",
    },
    {
      text: " Showcase,",
    },
    {
      text: "with",
    },
    {
      text: "Vide🎥 Hub.",
      className: "text-purple-500 dark:text-purple-500",
    },
  ],
  heading: "Wanna be your Video Manager...? 😉",
  buttons: [
    {
      text: "Get Started",
      to: "/get-started",
      className:
        "bg-black text-white border dark:border-white border-transparent hover:bg-purple-500",
    },
    {
      text: "Video Library",
      to: "/video-library",
      className:
        "bg-white text-black border border-black hover:bg-purple-500 hover:text-white",
    },
  ],
  embedCode,
  embedUrl,
};
