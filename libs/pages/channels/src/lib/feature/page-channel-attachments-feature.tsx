import { useGetAttachmentsQuery } from "@beep/channel"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import PageAttachments from "../ui/page-attachments"

export function PageChannelAttachementsFeature() {
  const { channelId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const [params, setParams] = useState<string[]>([])

  const { data, refetch } = useGetAttachmentsQuery({
    channelId: channelId,
    search: `${params.join('&')}`
  })

  useEffect(() => {
    if (params.length) {
      refetch()
    }
  }, [params, refetch])

  useEffect(() => {
    setParams([])

    for (const param of searchParams.entries()) {
      setParams((params) => [...params, param.join('=')])
    }
  }, [searchParams])

  useEffect(() => {
    console.log(channelId)
  }, [channelId])

  return (
    <PageAttachments
      attachments={data?.data}
    />
  )
}