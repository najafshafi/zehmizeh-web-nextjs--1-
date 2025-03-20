import { ChangeEvent, ReactNode } from "react";
import { Form } from "react-bootstrap";

interface Props {
  label?: ReactNode | string;
  className?: string;
  toggle?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

function Checkbox({ label = "", className = "", toggle, checked }: Props) {
  return (
    <Form.Check
      type="checkbox"
      className={`fs-1rem ${className}`}
      id={typeof label === "string" ? label : undefined}
      label={label}
      checked={checked}
      onChange={toggle}
    />
  );
}

export default Checkbox;
