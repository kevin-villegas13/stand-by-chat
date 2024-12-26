export interface ChatDetails {
  id: number;
  users: { id: string; username: string }[];
  createdAt: Date;
}
