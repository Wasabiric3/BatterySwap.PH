import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';

export default function DemoOne() {
  return (
    <div className="relative size-full overflow-hidden">
      <DottedSurface className="size-full opacity-80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,rgba(245,196,0,0.14),transparent_55%)]',
            'blur-[30px]',
          )}
        />
        <h1 className="font-mono text-4xl font-semibold text-foreground">
          Dotted Surface
        </h1>
      </div>
    </div>
  );
}
