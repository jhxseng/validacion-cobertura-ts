interface InputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

function Input({
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      className="form-input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  )
}

export default Input