type ButtonProps = {
  label: string
  onClick: () => void
}

function ActionButton({ label, onClick }: ButtonProps) {
  return <button className = "button" onClick={onClick}>{label}</button>
}

export default ActionButton;