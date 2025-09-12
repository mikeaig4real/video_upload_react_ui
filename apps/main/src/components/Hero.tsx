import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useStore } from "@/store/useStore";
import { useAuthStore } from "@/store/useAuthStore";

const Hero = () => {
  const navigate = useNavigate();
  const { hero } = useStore();
  const { user } = useAuthStore();
  const modValues = ({ to, text }: { to: string; text: string }) => {
    const modTo = user && to === "/get-started" ? "/dashboard/upload" : to;
    const modText = user && text === "Get Started" ? "Dashboard" : text;
    return {
      modTo,
      modText,
    };
  };
  return (
    <div className="safe-top h-dvh flex flex-col items-center justify-center select-none px-4">
      <p className="text-neutral-600 dark:text-neutral-200 text-lg sm:text-xl md:text-2xl lg:text-3xl text-center mb-2">
        {hero.heading}
      </p>
      <div className="w-full flex justify-center mb-4">
        <TypewriterEffectSmooth words={hero.words} />
      </div>
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 space-x-0 md:space-x-4 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto justify-center items-center">
        {hero.buttons.map(({ text, to, className }, index) => {
          const { modTo, modText } = modValues({ to, text });
          return (
            <Button
              size="lg"
              key={`btn-${index}`}
              onClick={() => navigate(modTo)}
              className={cn(
                "w-full md:w-40 h-12 rounded-lg text-base sm:text-lg cursor-pointer",
                className
              )}
            >
              {modText}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
