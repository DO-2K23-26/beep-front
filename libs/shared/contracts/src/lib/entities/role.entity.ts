import { DateTime } from "luxon";

export interface Role {
  id: string;
  name: string;
  permissions: number; // Permissions are hexadecimals
  color: number;
  serverId: string;
  createdAt: DateTime;
  updatedAt: DateTime | null;
}