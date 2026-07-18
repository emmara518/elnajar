import type { StackProps } from './Stack.types';

const directionMap = {
  row: 'flex-row',
  column: 'flex-col',
} as const;

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

export function getStackClasses(props: StackProps): string {
  const { direction = 'column', spacing, gap, align = 'stretch', justify = 'start', wrap, className } = props;

  const space = spacing !== undefined ? `gap-${spacing}` : gap ?? 'gap-4';

  return [
    'flex',
    directionMap[direction],
    alignMap[align],
    justifyMap[justify],
    wrap && 'flex-wrap',
    space,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
