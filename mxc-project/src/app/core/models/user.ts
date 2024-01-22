export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  createdAt: Date;
}

export interface IUserListResponse {
  results: IUser[];
  resultsLength: number;
}
