import { logoutUser } from "./actionCreators";

import firebase from 'firebase'

export const logout = async () => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          // Sign-out successful.
          resolve(logoutUser());
        },
        function(error) {
          // An error happened.
          reject(error);
        }
      );
  });
};
