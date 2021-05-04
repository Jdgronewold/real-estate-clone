import '../styles/globals.css'
import initAuth from '../utils/initAuth'
import { UserProvider } from '../state/user'

initAuth()

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp