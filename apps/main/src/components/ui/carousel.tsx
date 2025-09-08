import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId } from "react";
import PixelatedCanvas from "./pixelated-canvas";
import { useStore } from "@/store/useStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { Play } from "lucide-react";
import type { UploadedVideo } from "@shared/types/uploaded_video";

export interface SlideProps {
  slide: UploadedVideo;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  toTrigger: ((file: UploadedVideo, isMobile: boolean) => React.ReactNode) | null;
  onTrigger?: (slide: UploadedVideo) => void;
  offTrigger?: (file?: UploadedVideo) => void;
  triggered: boolean;
}

const Slide = ({
  slide,
  index,
  current,
  handleSlideClick,
  toTrigger = null,
  onTrigger,
  triggered,
}: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const { currTheme } = useStore();
  const isMobile = useIsMobile();
  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { thumbnail_url, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        title={
          current === index
            ? "Click to play/pause"
            : "Click to scroll into view"
        }
        className={`flex flex-1 flex-col items-center justify-center relative z-60
              text-center text-white opacity-100 transition-all duration-300 ease-in-out 
              ${
                isMobile
                  ? "w-[80%] aspect-[9/16] my-4"
                  : "w-[70vmin] h-[70vmin] mx-[4vmin]"
              }`}
        onClick={() => handleSlideClick(index)}
        onTouchEnd={() => handleSlideClick(index)}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full transparent rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          {current === index ? (
            triggered && toTrigger ? (
              toTrigger(slide, isMobile)
            ) : (
              <img
                className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
                style={{
                  opacity: current === index ? 1 : 0.5,
                }}
                alt={title}
                src={thumbnail_url}
                onLoad={imageLoaded}
                loading="eager"
                decoding="sync"
              />
            )
          ) : (
            <PixelatedCanvas
              className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
              width={1000}
              height={1000}
              cellSize={9}
              dotScale={0.4}
              shape="circle"
              backgroundColor={currTheme === "dark" ? "black" : "white"}
              dropoutStrength={0.1}
              interactive
              distortionStrength={0.1}
              distortionRadius={200}
              distortionMode="attract"
              followSpeed={0.2}
              jitterStrength={4}
              jitterSpeed={1}
              sampleAverage
              src={thumbnail_url!}
            />
          )}
        </div>
        {current === index && !triggered && (
          <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        )}
        {
          <article
            className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
              current === index && !triggered
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
          >
            <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold  relative">
              {title}
            </h2>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (onTrigger) onTrigger(slide);
                }}
                className="cursor-pointer mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              >
                <Play className="h-6 w-6 ml-1 cursor-pointer" />
              </button>
            </div>
          </article>
        }
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  const isMobile = useIsMobile();
  return (
    <button
      className={`z-61 w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight
        className={`text-neutral-600 dark:text-neutral-200 cursor-pointer
              ${isMobile && type === "previous" ? "rotate-[-270deg]" : ""} 
              ${isMobile && type === "next" ? "rotate-90" : ""}`}
      />
    </button>
  );
};

interface CarouselProps {
  slides: UploadedVideo[];
  toTrigger: ((file: UploadedVideo, isMobile: boolean) => React.ReactNode) | null;
  onTrigger?: (file: UploadedVideo) => void;
  offTrigger?: (file?: UploadedVideo) => void;
  triggered: boolean;
}

export default function Carousel({
  slides,
  toTrigger = null,
  onTrigger,
  offTrigger,
  triggered,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const isMobile = useIsMobile();

  const handlePreviousClick = () => {
    if (offTrigger) offTrigger();
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    if (offTrigger) offTrigger();
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      if (offTrigger) offTrigger();
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div
      className={`flex relative mx-auto 
              ${isMobile ? "w-[90vw] h-[90vh]" : "w-[70vmin] h-[70vmin]"}`}
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className={`absolute transition-transform duration-1000 ease-in-out
              ${isMobile ? "flex-col" : "flex"}`}
        style={{
          transform: isMobile
            ? `translateY(-${current * (100 / slides.length)}%)`
            : `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
            toTrigger={toTrigger}
            onTrigger={onTrigger}
            triggered={triggered}
          />
        ))}
      </ul>

      <div
        className={`z-50 absolute flex
              ${
                isMobile
                  ? "flex-col items-center justify-between top-0 right-[2rem] h-[80svh]"
                  : "justify-center top-[calc(100%+1rem)] w-full"
              }`}
      >
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
