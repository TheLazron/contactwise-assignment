import { Permissions, Role } from "@prisma/client";

export interface getOrganisationsResponseType {
  currentUserId: string;
  id: string;
  memberCount: number;
  name: string;
  bannerImg: string;
  members: {
    userId: string;
  }[];
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
  };
}

export interface membersTableDataType {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
  };
  role: $Enums.Role;
  currentUser: {
    id: string;
    role: Role;
    permissions: Permissions[];
  };
  joinedOn: Date;
  id: string;
  permissions: $Enums.Permissions[];
}
[];
