import { memo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function BlockCinima({ children }: Props) {
  return <div className="cinima">{children}</div>;
}
export default memo(BlockCinima);
