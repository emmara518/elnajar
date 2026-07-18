function getEnv(key: string, fallback = ''): string {
  return (import.meta.env[key as keyof ImportMetaEnv] as string | undefined) ?? fallback;
}

export const env = {
  get supabaseUrl(): string {
    return getEnv('VITE_SUPABASE_URL');
  },
  get supabaseAnonKey(): string {
    return getEnv('VITE_SUPABASE_ANON_KEY');
  },
  get appName(): string {
    return getEnv('VITE_APP_NAME', 'TOKYO Store');
  },
  get appUrl(): string {
    return getEnv('VITE_APP_URL', 'http://localhost:5173');
  },
} as const;
