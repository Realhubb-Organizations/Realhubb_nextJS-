export interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  email: string;
  linkedin: string;
  phone: string;
  order?: number;
}

export const EMPTY_TEAM_MEMBER: Omit<AdminTeamMember, "id"> = {
  name: "",
  role: "",
  image: "",
  bio: "",
  email: "",
  linkedin: "",
  phone: "",
  order: 0,
};
