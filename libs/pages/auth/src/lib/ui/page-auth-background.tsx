import { Outlet } from "react-router";

export default function PageAuthBackground() {
  return (
    <div
      className="min-h-dvh w-dvw bg-backgroundV2 flex justify-center"
    >
      <Outlet/>
    </div>
  )
}
