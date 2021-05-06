import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import { UserProvider } from '../state/user'
import { GoogleMapLoader } from '../components/map/mapLoader'

initAuth()

function MyApp({ Component, pageProps }) {
  return (
    <GoogleMapLoader>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </GoogleMapLoader>
  )
}

export default MyApp