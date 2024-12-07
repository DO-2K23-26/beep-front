import { DateTime } from 'luxon';
import { UserDisplayedEntity } from './user-displayed.entity';

export interface InvitationEntity {
  id: string;
  creatorId: string;
  serverId: string | null;
  targetId: string | null;
  type: number;
  status: number;
  expiration: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime | null;
  creator: UserDisplayedEntity | null;
  target: UserDisplayedEntity | null;
}
