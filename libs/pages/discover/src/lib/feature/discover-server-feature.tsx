import { SearchServerRequest } from '@beep/contracts'
import { useDiscoverServersQuery } from '@beep/server'
import { useEffect, useState } from 'react'
import DiscoverServer from '../ui/discover-server-page'
import { useDebounce } from '@beep/utils'
import { useSearchParams } from 'react-router-dom'
export function DiscoverServerFeature() {
  const [directSearch, setDirectSearch] = useState<string>('')
  const search = useDebounce<string>(directSearch, 500)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1') || 1
  const limit = parseInt(searchParams.get('limit') || '8') || 8
  const params: SearchServerRequest =
    search.length > 2
      ? {
          limit: limit,
          page: page,
          query: search,
        }
      : {
          limit: limit,
          page: page,
        }
  const { data, refetch } = useDiscoverServersQuery(params)

  useEffect(() => {
    refetch()
  }, [refetch, search, page])
  console.log(data)

  return (
    <DiscoverServer
      servers={data || []}
      search={directSearch}
      setSearch={setDirectSearch}
      hasNextPage={data?.length === limit}
      page={page}
      setPage={(page) => {
        setSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
      }}
    />
  )
}
