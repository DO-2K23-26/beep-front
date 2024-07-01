import { ChannelEntity } from "@beep/contracts";

export interface DynamicSelectorChannelProps {
    channel: ChannelEntity
}

export const DynamicSelectorChannelFeature = ({ channel }: DynamicSelectorChannelProps) => {

    return (
        <div className='flex items-center gap-4'>
          <p>{channel.name}</p>
        </div>
    );
}
