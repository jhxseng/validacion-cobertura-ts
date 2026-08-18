

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}

function Button({
  children,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button