import { resetAll } from '../data/db';
import { useAuth } from '../auth/AuthContext';

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  const { action } = useAuth();

  const handleReset = () => {
    if (window.confirm('Reset all demo data? This cannot be undone.')) {
      resetAll();
      action({ type: 'LOGOUT' });
      onReset();
    }
  };

  return (
    <button className="btn btn-outline-danger btn-sm" onClick={handleReset}>
      <i className="bi bi-arrow-repeat me-1"></i>
      Reset Demo Data
    </button>
  );
}
