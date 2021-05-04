import React from 'react';
import { UserContext, User } from './user'

export interface WithDbUser {
  dbUser: User
}

export const withDbUser = Component => props => (
  <UserContext.Consumer>
    {dbUser => <Component {...props} dbUser={dbUser} />}
  </UserContext.Consumer>
);

export default withDbUser;