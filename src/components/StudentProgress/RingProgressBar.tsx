import clsx from "clsx";
import type { ReactNode } from "react";

export interface CircularProgressBarProps {
  value: number;
  children?: ReactNode;
  failedColor?: boolean;
  className?: string;
}

// WARNING: do not remove this comment.
// this component uses these specific colors and it's possible for the colors to be optimized out
// if any of the colors are not used in any other location in the code, it may render this component
// non-functional. having this comment assures that tailwind will not optimize it out
// bg-red-400 bg-emerald-300

const RingProgressBar = (props: CircularProgressBarProps) => {
  const finishedContentAngle = Math.round(props.value * 360);
  const progressBackgroundColor = `var(--color-${props.failedColor ? "red-400" : "emerald-300"})`;
  const trailColor = "var(--color-gray-300)";

  return (
    <div
      className="flex aspect-square h-16 w-16 items-center justify-center rounded-full p-1"
      style={{
        backgroundImage: `conic-gradient(${progressBackgroundColor}, ${progressBackgroundColor} ${finishedContentAngle}deg, ${trailColor} ${finishedContentAngle}deg, ${trailColor})`,
      }}
    >
      <div
        className={clsx(
          "flex h-full w-full items-center justify-center rounded-full bg-white/70",
          props.failedColor ? "text-red-700" : "text-green-700",
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default RingProgressBar;
