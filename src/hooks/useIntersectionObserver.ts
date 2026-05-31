import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverArgs {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverArgs = {}): [RefObject<HTMLDivElement>, boolean] {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        if (isElementIntersecting) {
          setIntersecting(true);
          if (triggerOnce && observer) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
}
