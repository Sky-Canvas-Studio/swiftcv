export function InfoGrid(props: {
  items: Array<{ label: string; value?: string | null }>;
}) {
  const visible = props.items.filter((item) => item.value);

  if (visible.length === 0) {
    return <p className="p-5 text-sm text-muted-foreground">No details added yet.</p>;
  }

  return (
    <dl className="grid gap-4 p-5 sm:grid-cols-2">
      {visible.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium uppercase text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 truncate text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
