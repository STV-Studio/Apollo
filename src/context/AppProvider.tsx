import { type ReactNode } from "react";
import { ClipProvider } from "./ClipContext/ClipProvider";
import { CurrentTimeProvider } from "./CurrentTimeContext/CurrentTimeProvider";
import { PreviewProvider } from "./PreviewContext/PreviewProvider";
import { DrawShapeProvider } from "./DrawShapeContext/DrawShapeProvider";
import SelectionProvider from "./SelectionContext/SelectionProvider";

type Props = {
  children: ReactNode;
};

export function AppProvider({ children }: Props) {
  return (
    <ClipProvider>
      <CurrentTimeProvider>
        <PreviewProvider>
          <DrawShapeProvider>
            <SelectionProvider>{children}</SelectionProvider>
          </DrawShapeProvider>
        </PreviewProvider>
      </CurrentTimeProvider>
    </ClipProvider>
  );
}
