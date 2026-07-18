import { useState } from 'react';
import { Input, Button } from '@/design-system';
import { newsletterSchema } from '../schemas';
import { Mail, Send } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    setError(null);

    const result = newsletterSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'بريد إلكتروني غير صحيح');
      return;
    }

    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setEmail(''); }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="بريدك الإلكتروني"
            error={error ?? undefined}
            disabled={isLoading}
            prefix={<Mail className="w-4 h-4" />}
            aria-label="البريد الإلكتروني"
          />
        </div>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          <Send className="w-4 h-4" />
          اشتراك
        </Button>
      </div>
    </form>
  );
}
