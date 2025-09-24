import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CustomButtonProps = React.ComponentProps<typeof Button> & {
  children?: React.ReactNode;
  className?: string;
  btnType?: "fill" | "outline";
}
const CustomButton = ({
  children = null,
  className = "",
  btnType = "outline",
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      className={cn(
        `cursor-pointer ${
          btnType === "fill"
            ? "bg-black text-white border dark:border-white border-transparent hover:bg-purple-500"
            : "bg-white text-black border border-black hover:bg-purple-500 hover:text-white"
        }`,
        className
      )}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
