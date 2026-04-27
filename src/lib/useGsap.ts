import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Tiny helper to scope GSAP animations to a container and clean up on unmount.
 * Usage:
 *   const ref = useGsap((ctx, root) => {
 *     gsap.from(root.querySelectorAll(".reveal"), { y: 40, opacity: 0, stagger: 0.08 });
 *   });
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context, root: T) => void,
  deps: ReadonlyArray<unknown> = []
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const ctx = gsap.context((self) => setup(self, root), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
