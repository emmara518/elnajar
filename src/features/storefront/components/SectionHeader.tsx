import { Flex } from '@/design-system';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'start' | 'center';
}

export function SectionHeader({ title, subtitle, action, align = 'start' }: SectionHeaderProps) {
  return (
    <Flex align="center" justify="between" className={align === 'center' ? 'text-center' : ''}>
      <div className={align === 'center' ? 'flex-1' : ''}>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </Flex>
  );
}
