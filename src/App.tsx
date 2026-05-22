import { lazy, Suspense } from "react";

const VIewPort = lazy(() => import("./components/VIewPort"));
const TimeLine = lazy(() => import("./components/TimeLine/TimeLine"));

export default function App() {
  return (
    <div className="app">
      <Suspense fallback={"loading.."}>
        <VIewPort />
        <TimeLine />
      </Suspense>
    </div>
  );
}
