import type { FlexProps } from './Flex.types';

export function getFlexClasses(props: FlexProps): string {
  const {
    inline, direction = 'row', align = 'center',
    justify = 'start', wrap, gap, flex: flexVal, className,
  } = props;

  return [
    inline ? 'inline-flex' : 'flex',
    direction !== 'row' && `flex-${direction}`,
    align !== 'start' && `items-${align}`,
    justify !== 'start' && `justify-${justify}`,
    wrap && 'flex-wrap',
    gap != null && (typeof gap === 'number' ? `gap-${String(gap)}` : `gap-${gap}`),
    flexVal && `flex-${flexVal}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
