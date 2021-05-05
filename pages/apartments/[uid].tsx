import React from 'react'
import { getFirebaseAdmin } from 'next-firebase-auth'
import { parseApartments } from '../../utils/parseApartments'
import { Apartment } from '../../types'
import initAuth from '../../utils/initAuth'

initAuth()

const ApartmentPage: React.FC<{apartment: Apartment}> = ({ apartment}) => {
  console.log(apartment);
  
  return (
    <>
    {
      apartment &&
      <div>
        <div>{apartment.name}</div>
        <div>Address Goes Here</div>
        <div>
          <div>{`$${apartment.pricePerMonth}`}</div>
          <div>{apartment.numRooms} Rooms</div>
          <div>{apartment.floorSize} Sq. Ft.</div>
        </div>
        <div>__________________________</div>
        <div>{apartment.description}</div>
      </div>
    }
    </>
  )
}

export async function getStaticPaths() {

  const db = getFirebaseAdmin().database()
  const apartmentsObject = await (await db.ref(`apartments`).once('value')).val()
  const apartments = parseApartments(apartmentsObject)
  
  return {
    paths: apartments.map((apt) => ({ params: { uid: apt.uid } })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const apartment = await (await getFirebaseAdmin().database().ref(`apartments/${params.uid}`).once('value')).val()
  
  return {
    props: { apartment },
    revalidate: 10,
  }
}


export default ApartmentPage