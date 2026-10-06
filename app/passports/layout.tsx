import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PassportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
