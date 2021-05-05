import React, { useRef, useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { Marker } from './marker'
import styles from './map.module.css'


interface MapProps {
  shouldAllowSearch?: boolean
  shouldShowPlanner?: boolean
  updateContext?: (map: google.maps.Map, mapApi: any) => void
}

const gmapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY


const Map: React.FC<MapProps> = ({ shouldAllowSearch = false, shouldShowPlanner = false, updateContext }) => {
  const [mapIsLoaded, setMapLoaded] = useState(false)
  const [currentMarker, setCurrentMarker] = useState<google.maps.places.PlaceResult>(null)
  const searchBoxRef = useRef()
  const directionsRenderer = useRef<google.maps.DirectionsRenderer>(null)
  const drawnPolylines = useRef<{ [polyline: string]: google.maps.Polyline}>({})
  const searchBox = useRef<google.maps.places.SearchBox>(null)
  const map = useRef<google.maps.Map>(null)
  const mapsApi = useRef<any>(null)
  const geometry = useRef<any>(null)  


  const onPlacesChanged = () => {
    const selected = searchBox.current.getPlaces();
    const { 0: place } = selected;
    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.current.fitBounds(place.geometry.viewport);
    } else {
      map.current.setCenter(place.geometry.location);
      map.current.setZoom(17);
    }

    setCurrentMarker(place)
  }
  
  return (
    <div className={styles.mapRoot}>
      <GoogleMapReact
          defaultZoom={10}
          bootstrapURLKeys={{
            key: gmapKey,
            libraries: ['places', 'geometry']
          }}
          defaultCenter={{ lat: 40.0150, lng: -105.2705}}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(gmaps) => {
            
            mapsApi.current = gmaps.maps
            map.current = gmaps.map
            
            directionsRenderer.current = new mapsApi.current.DirectionsRenderer()            
            geometry.current = mapsApi.current.geometry

            if (shouldAllowSearch) {
              searchBox.current = new mapsApi.current.places.SearchBox(searchBoxRef.current)
              searchBox.current.addListener('places_changed', onPlacesChanged);
            }
            
            setMapLoaded(true)
            
            if (updateContext) {
              updateContext(gmaps.map, gmaps.maps)
            }
          }}
        >
          {
            currentMarker &&
            <Marker
              lat={currentMarker.geometry.location.lat()}
              lng={currentMarker.geometry.location.lng()}
              place={currentMarker}
            />
          }
        </GoogleMapReact>
    </div>
  )
}

export default Map