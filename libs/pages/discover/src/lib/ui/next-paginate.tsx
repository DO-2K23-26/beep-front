import { Icon } from '@beep/ui'

interface NextPaginateProps {
  page: number
  setPage: (page: number) => void
  hasNextPage: boolean
}

interface PreviousPaginateProps {
  setPage: (page: number) => void
  page: number
}

export function NextPaginate({
  page,
  setPage,
  hasNextPage,
}: NextPaginateProps) {
  return (
    <div className="flex justify-center">
      <button
        className="bg-violet-50 font-bold py-2 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(page + 1)}
        disabled={!hasNextPage}
      >
        <Icon name="lucide:chevron-right" className="w-5 h-5" />
      </button>
    </div>
  )
}

export function PreviousPaginate({ page, setPage }: PreviousPaginateProps) {
  return (
    <div className="flex justify-center">
      <button
        className="bg-violet-50 font-bold py-2 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        <Icon name="lucide:chevron-left" className="w-5 h-5" />
      </button>
    </div>
  )
}
