export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-rose-200">{message}</p>;
}
