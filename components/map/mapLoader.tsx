import React, { useState, useEffect} from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export const GmapContext = React.createContext<{ mapsLoaded: boolean}>(null)

export const GoogleMapLoader: React.FC = ({ children }) => {
  const [mapsLoaded, setMapsLoaded] = useState(false)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
            setMapsLoaded(true)
    })
  }, [])

  return (
    <GmapContext.Provider value={{ mapsLoaded }}>
      {children}
    </GmapContext.Provider>
  )
}


