import { Apartment } from "../types";

export const parseApartments = (aptObject: { [key: string]: Apartment }): Apartment[] => {
  return Object.keys(aptObject).map((key) => ({ ...aptObject[key], uid: key }))
}