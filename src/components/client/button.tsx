"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ButtonLoader = ({ className }: { className?: string }) => (
  <div className="flex gap-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <motion.div
        key={index}
        animate={{
          translateY: [-5, 5],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.15,
          },
        }}
        className={cn("w-2 h-2 bg-primary rounded-full", className)}
      />
    ))}
  </div>
);

type SubmitButtonProps = ButtonProps & {
  loaderClassName?: string;
};
const SubmitButton = ({
  children,
  loaderClassName,
  ...props
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      className={cn("disabled:opacity-100", props.className)}
      disabled={pending}
      type="submit"
    >
      {pending ? <ButtonLoader className={loaderClassName} /> : children}
    </Button>
  );
};

export { SubmitButton };
