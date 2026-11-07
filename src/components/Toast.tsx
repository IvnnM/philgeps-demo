
interface ToastProps {
  message?: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
}

export function Toast({ message, type = 'info' }: ToastProps) {
  if (!message) return null;
  const bgColor = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning text-dark' : 'bg-info';
  return (
    <div className={`fixed top-0 end-0 m-3 ${bgColor} text-white p-3 rounded shadow`} style={{ zIndex: 1000 }}>
      {message}
    </div>
  );
}
