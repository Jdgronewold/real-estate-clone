import React from "react";
import firebase from "firebase";
import app from "firebase/app";
import { UserRoles } from "../../components/signup";

export const UserContext = React.createContext<User>(null);

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  likedApartments?: any[];
}

class UserProvider extends React.Component<{}, { user: User }> {
  listener: firebase.Unsubscribe;

  constructor(props) {
    super(props);
    
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    this.listener = app.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log('hello!',authUser);
        
        firebase.app()
          .database()
          .ref(`users/${authUser.uid}`)
          .once("value")
          .then((snapshot) => {
            const dbUser = snapshot.val();

            console.log('boop', dbUser);
            

            // merge auth and db user
            const user: User = {
              uid: authUser.uid,
              ...dbUser,
            };

            this.setState({ user });
          });
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
