import React from "react";
import firebase from "firebase";
import app from "firebase/app";
import { UserRoles, User } from "../../types";

export const UserContext = React.createContext<User>(null);

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
        
        firebase.app()
          .database()
          .ref(`users/${authUser.uid}`)
          .once("value")
          .then((snapshot) => {
            const dbUser = snapshot.val();
            
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
