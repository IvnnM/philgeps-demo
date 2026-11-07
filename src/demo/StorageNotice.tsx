
interface StorageNoticeProps {
  message: string;
  visible: boolean;
}

export default function StorageNotice({ message, visible }: StorageNoticeProps) {
  if (!visible) return null;
  return (
    <div className="alert alert-warning py-2">
      <i className="bi bi-info-circle me-2"></i>
      {message}
    </div>
  );
}
