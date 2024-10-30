
export interface MemberEntity {
  nickname: string;
  avatar: string;
  deaf: boolean;
  mute: boolean;
  pending: boolean;
  timedOutUntil: string | null;
  serverId: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
}
