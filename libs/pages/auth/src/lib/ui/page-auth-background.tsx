import { Outlet } from 'react-router'
import ContainerLight from './container-light'

export default function PageAuthBackground() {
  return (
    <div className="min-h-dvh w-dvw bg-backgroundV2 flex justify-center">
      <div className="flex justify-center items-center p-4">
        {/* Container */}
        <ContainerLight>
          <Outlet />
        </ContainerLight>
      </div>
    </div>
  )
}
