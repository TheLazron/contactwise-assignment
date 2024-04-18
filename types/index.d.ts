export interface getOrganisationsResponseType {
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
  joinedOn: Date;
}
[];
