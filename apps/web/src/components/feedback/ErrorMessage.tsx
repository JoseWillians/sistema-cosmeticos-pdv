export function ErrorMessage({ message }: { message: string }) {
  return <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{message}</div>;
}
