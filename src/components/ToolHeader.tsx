export function ToolHeader({ name, description }: { name: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">{name}</h1>
      <p className="mt-1 text-[15px] text-[var(--color-ink-dim)]">{description}</p>
    </div>
  );
}
