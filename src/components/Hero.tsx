import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useStore } from "@/store/useStore";

const Hero = () => {
  const navigate = useNavigate();
  const { hero, user } = useStore();
  const modValues = ({ to, text }: { to: string; text: string }) => {
    const modTo = user && to === "/get-started" ? "/dashboard" : to;
    const modText = user && text === "Get Started" ? "Dashboard" : text;
    return {
      modTo,
      modText,
    };
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center select-none">
      <p className="text-neutral-600 dark:text-neutral-200 text-md sm:text-xl">
        {hero.heading}
      </p>
      <TypewriterEffectSmooth words={hero.words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        {hero.buttons.map(({ text, to, className }, index) => {
          const { modTo, modText } = modValues( { to, text } );
          return (
            <Button
              size={"lg"}
              key={`btn-${index}`}
              onClick={() => navigate(modTo)}
              className={cn(
                "w-40 h-10 rounded-md text-sm cursor-pointer",
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
