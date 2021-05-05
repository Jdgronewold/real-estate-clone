
export interface Apartment {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  isRented: boolean,
  dateAdded: Date,
  uid: string
}

export enum UserRoles {
  ADMIN = "ADMIN",
  ClIENT = "CLIENT",
  REALTOR = "REALTOR"
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  likedApartments?: any[];
}
