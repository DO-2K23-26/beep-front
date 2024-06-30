import { ChannelAttachment } from "@beep/contracts"
import AttachmentFeature from "../feature/attachment-feature";

export interface PageAttachmentsProps {
  attachments?: ChannelAttachment[]
}

export default function PageAttachments({ attachments }: PageAttachmentsProps) {
  console.log(attachments);
  
  return (
    <div className="bg-violet-200 w-full p-6 flex flex-col gap-6 justify-between h-[100dvh]">
      <div className='grid grid-cols-3 gap-2'>
        {attachments?.map((attachment, index) => (

          <AttachmentFeature 
            key={index}
            attachment={attachment}
          />
        ))}
      </div>
    </div>
  )
}