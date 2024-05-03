import { ServerEntity } from "./server.entity";

export interface RoleEntity {
    nom: string;
    server: ServerEntity;
    is_admin: boolean;
}
