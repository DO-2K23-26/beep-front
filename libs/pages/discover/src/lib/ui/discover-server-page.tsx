import { ServerEntity } from '@beep/contracts'
import { Icon } from '@beep/ui'
import ServerCardFeature from '../feature/server-card-feature'
import { NextPaginate, PreviousPaginate } from './next-paginate'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

export interface DiscoverServerProps {
  setSearch: (value: string) => void
  search: string
  servers: ServerEntity[]
  hasNextPage: boolean
  page: number
  setPage: (page: number) => void
}

export default function DiscoverServer({
  setSearch,
  search,
  servers,
}: DiscoverServerProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1') || 1
  const limit = parseInt(searchParams.get('limit') || '8') || 8
  return (
    <div className="bg-violet-200 rounded-r-3xl w-full p-6 overflow-y-scroll custom-scrollbar">
      <section
        id="search"
        className="rounded-3xl relative overflow-hidden z-10 bg-gradient-to-b from-violet-700 from-5% to-90%"
      >
        <svg
          className="absolute top-0 left-0 bg-blend-screen bg-gradient-to-b from-violet-700 from-5% to-80%  w-full h-full z-10 mix-blend-soft-light contrast-200 saturate-150 brightness-100 opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.5"
              numOctaves="1"
              stitchTiles="stitch"
            />
          </filter>

          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="flex flex-col justify-between items-center gap-10 py-[12dvh] z-20 relative">
          <h2 className="font-bold text-5xl">Find your community on Beep</h2>
          <h3 className="text-sm">
            From studying to music, there's a place for you.
          </h3>
          <span className="flex flex-row align-center justify-center w-full gap-4 ">
            <input
              type="text"
              value={search}
              placeholder="Find a server..."
              className="w-1/2 rounded-lg bg-violet-50 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn  btn--regular btn--square !bg-violet-50 shadow-md ">
              <Icon name="lucide:search" className="w-6 h-6" />
            </button>
          </span>
        </div>
      </section>
      <div className="flex flex-row justify-end py-3 gap-3">
        <PreviousPaginate
          page={page}
          setPage={(page) => {
            setSearchParams({
              page: page.toString(),
              limit: limit.toString(),
            })
          }}
        />
        <NextPaginate
          hasNextPage={servers?.length === limit}
          page={page}
          setPage={(page) => {
            setSearchParams({
              page: page.toString(),
              limit: limit.toString(),
            })
          }}
        />
      </div>
      <div className="grid grid-cols-4 gap-7 grid-rows-2">
        <AnimatePresence>
          {servers.map((server) => (
            <ServerCardFeature
              key={server.id}
              name={server.name}
              description={server.description ?? ''}
              id={server.id}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
