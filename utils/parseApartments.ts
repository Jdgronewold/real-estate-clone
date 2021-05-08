import { Apartment } from "../types";

export const parseApartments = (aptObject: { [key: string]: Apartment }, filterForClient: boolean): Apartment[] => {
  return Object.keys(aptObject).map((key) => ({ ...aptObject[key], uid: key })).filter((apt: Apartment) => {
    return filterForClient ? !apt.isRented : true
  })
}