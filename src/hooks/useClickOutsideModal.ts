import { useEffect, type RefObject } from "react";

export const useClickOutsideModal = (
  ref: RefObject<HTMLDivElement | null>,
  callback: () => void,
  enabled: boolean = true,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (enabled && ref.current && !ref.current.contains(event.target as Node))
        callback();
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      console.log("key detected");
      if (enabled && event.key === "Escape") callback();
    };

    if (enabled) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [ref, callback, enabled]);
};
