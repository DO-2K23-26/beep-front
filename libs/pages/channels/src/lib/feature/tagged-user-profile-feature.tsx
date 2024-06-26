import { UserDisplayedEntity } from "@beep/contracts";
import { useFetchProfilePictureQuery } from "@beep/user";

export interface TaggedUserProfileFeatureProps {
    user: UserDisplayedEntity
}

export const TaggedUserProfileFeature = ({ user }: TaggedUserProfileFeatureProps) => {
    const userProfilePicture = useFetchProfilePictureQuery(user.id, {
        skip: !user
      }).currentData

    return (
        <div>
        <div className='flex items-center gap-3 p-3 bg-white rounded-lg'>
            <img
                className="w-9 min-w-[36px] h-9 min-h-[36px] object-cover bg-violet-50 rounded-xl"
                src={userProfilePicture || '/picture.svg'}
                alt={user.username + "'s profile picture"}
            />
            <p>{user.username}</p>
        </div>
        </div>
    );
}