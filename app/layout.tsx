import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PersonaForge — sua presença digital, com intenção',
  description: 'Crie perfis sociais mais claros, distintos e prontos para serem lembrados.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
