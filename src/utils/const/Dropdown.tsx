import { memo } from "react";
import type { ReactNode } from "react";
interface Props {
  trigger: ReactNode;
  children: ReactNode;
}

function Dropdown({ trigger, children }: Props) {
  return (
    <div className="dropdown">
      {trigger}
      <ul className="dropdown-menu">{children}</ul>
    </div>
  );
}

export default memo(Dropdown);
