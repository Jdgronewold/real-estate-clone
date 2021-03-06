
export interface Apartment {
  name: string,
  description: string,
  floorSize: number,
  pricePerMonth: number,
  numRooms: number,
  realtor: string,
  isRented: boolean,
  dateAdded: Date,
  address: string,
  latLng: string
  uid: string
  imageUrl: string
  location: 'address' | 'gelocation'
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

export interface RegisterData {
  firstName: string
  lastName: string
  email: string,
  passwordOne: string
  passwordTwo: string
  role: UserRoles
  likedApartments?: string[]
}
