import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container, Button, cn } from '@/design-system';
import { STOREFRONT_HERO } from '../constants';

export function HeroBanner() {
  const { SLIDES, AUTOPLAY_INTERVAL } = STOREFRONT_HERO;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, [SLIDES.length]);

  const goNext = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext, AUTOPLAY_INTERVAL]);

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => { setIsPaused(true); }}
      onMouseLeave={() => { setIsPaused(false); }}
      role="region"
      aria-roledescription="carousel"
      aria-label="عرض الصور الرئيسية"
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${String(current * 100)}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div key={s.id} className="relative w-full shrink-0" role="group" aria-roledescription="slide" aria-label={`الشريحة ${String(i + 1)} من ${String(SLIDES.length)}`}>
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <Container className="absolute inset-0 flex items-center">
              <div className="max-w-xl text-white">
                <p className="text-sm md:text-base font-medium text-amber-400 mb-2">{s.subtitle}</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{s.title}</h2>
                <p className="text-sm md:text-base text-gray-200 mb-6">{s.description}</p>
                <Link to={s.ctaLink}>
                  <Button size="lg">{s.ctaText}</Button>
                </Link>
              </div>
            </Container>
          </div>
        ))}
      </div>

      <>
        <button
          type="button"
          onClick={goPrev}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2" role="tablist" aria-label="مؤشرات الشرائح">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`الشريحة ${String(i + 1)}`}
              onClick={() => { goTo(i); }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80',
              )}
            />
          ))}
        </div>
      </>
    </div>
  );
}
