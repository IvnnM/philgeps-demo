
interface PesoProps {
  value: string;
  readonly?: boolean;
  onChange?: (value: string) => void;
}

export function Peso({ value, readonly = false, onChange }: PesoProps) {
  return (
    <input
      type="text"
      className="form-control peso-input"
      value={value}
      readOnly={readonly}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
