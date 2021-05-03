import React from 'react'
import Link from 'next/link'
import { slide as Menu } from 'react-burger-menu'

const burgerStyles = {
  bmBurgerButton: {
    position: 'relative',
    width: '36px',
    height: '30px',
  },
  bmBurgerBars: {
    background: '#373a47'
  },
  bmBurgerBarsHover: {
    background: '#a90000'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
    top: 0
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  bmItem: {
    display: 'inline-block',
    marginBottom: '0.5rem'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%'
  },
  versionsContainer: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  button: {
    cursor: 'pointer',
  },
}

const Header = ({ email, signOut }) => (
  <div style={styles.container}>
    <h1>Toptal Real Estate</h1>
    {email ? (
        <Menu styles={burgerStyles} right>
          <div>
            <Link href="/profile">Profile</Link>
          </div>
          <div>
            <Link href="/profile">Saved Apartments</Link>
          </div>   
          <div style={styles.button} onClick={() => signOut()}> Sign Out</div>
        </Menu>
    ) : (
        <Link href="/login"> Sign in </Link>
    )}
  </div>
)

export default Header