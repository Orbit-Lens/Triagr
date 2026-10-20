import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Radar, ChevronRight } from 'lucide-react';

export default function MarketingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <Badge variant="outline" className="gap-2 px-3 py-1 text-xs">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Training Simulation Environment</span>
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Triagr Counter-Drone Simulation Trainer
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Master the complete decision-chain: detect, classify, identify, prioritise, decide, and assess drone threats in realistic operational scenarios.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: 'lg', className: 'gap-2' })}
          >
            <Radar className="size-4" />
            Launch Console
            <ChevronRight className="size-4" />
          </Link>
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
