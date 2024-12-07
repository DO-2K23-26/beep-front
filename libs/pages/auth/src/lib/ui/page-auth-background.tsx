import { Outlet } from "react-router";

export default function PageAuthBackground() {
  return (
    <div
      className="h-dvh w-dvw bg-no-repeat bg-cover flex justify-center"
      style={{ backgroundImage: `url('/background.svg')` }}
    >
      <Outlet/>
    </div>
  )
}
