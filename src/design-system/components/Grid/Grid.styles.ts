import type { GridProps } from './Grid.types';

export function getGridClasses(props: GridProps): string {
  const { cols = 1, sm, md, lg, gap = 4, className } = props;

  const isObjectCols = typeof cols === 'object';
  const gapClass = typeof gap === 'number' ? `gap-${gap}` : `gap-${gap}`;

  const classes = [
    'grid',
    isObjectCols ? '' : `grid-cols-${cols}`,
    gapClass,
    sm != null && `sm:grid-cols-${sm}`,
    md != null && `md:grid-cols-${md}`,
    lg != null && `lg:grid-cols-${lg}`,
    className,
  ];

  if (isObjectCols) {
    const colObj = cols as Record<string, number>;
    if (colObj.mobile) classes.push(`grid-cols-${colObj.mobile}`);
    if (colObj.tablet) classes.push(`md:grid-cols-${colObj.tablet}`);
    if (colObj.desktop) classes.push(`lg:grid-cols-${colObj.desktop}`);
    if (colObj.lg) classes.push(`lg:grid-cols-${colObj.lg}`);
  }

  return classes.filter(Boolean).join(' ');
}
