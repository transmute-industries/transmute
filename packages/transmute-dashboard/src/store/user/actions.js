import * as Constants from './constants';
import axios from 'axios';

import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const register = async ({ firstName, lastName, email }) => {
  try {
    let response = await middleware.register({
      firstName,
      lastName,
      email
    });
    return actionCreators.registerSuccess({
      ...response.data
    });
  } catch (e) {
    return actionCreators.registerError({
      ...e
    });
  }
};

export const loginApiCall = (oktaAuth, email, password) => {
  return dispatch => {
    return oktaAuth
      .signIn({
        username: email,
        password: password
      })
      .then(res => {
        console.log(JSON.stringify(res));
        dispatch(actionCreators.loginSuccess(res.sessionToken));
      })
      .catch(err => {
        console.log(err.message + '\n error', err);
        dispatch(actionCreators.loginError(err.message));
      });
  };
};

// NOT SUPPORTED
// export const changePasswordApiCall = data => {
//   return dispatch => {
//     if (!data.oldPassword || !data.newPassword) {
//       dispatch(
//         actionCreators.changePasswordError(
//           'New and Old, both password fields are required'
//         )
//       );
//       setTimeout(() => {
//         dispatch(actionCreators.changePasswordError(null));
//       }, 3000);
//       return;
//     } else if (data.oldPassword.length < 8) {
//       dispatch(
//         actionCreators.changePasswordError(
//           'Old password length must be minimum 8 characters'
//         )
//       );
//       setTimeout(() => {
//         dispatch(actionCreators.changePasswordError(null));
//       }, 3000);
//       return;
//     } else if (data.newPassword.length < 8) {
//       dispatch(
//         actionCreators.changePasswordError(
//           'New password length must be minimum 8 characters'
//         )
//       );
//       setTimeout(() => {
//         dispatch(actionCreators.changePasswordError(null));
//       }, 3000);
//       return;
//     }

//     return axios({
//       method: 'post',
//       url: '/api/users/change_password',
//       data: data,
//       config: {
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json'
//         }
//       }
//     })
//       .then(json => {
//         dispatch(actionCreators.changePasswordSuccess('Password Changed'));
//         setTimeout(() => {
//           dispatch(actionCreators.changePasswordSuccess(null));
//         }, 3000);
//       })
//       .catch(err => {
//         dispatch(actionCreators.changePasswordError(err.message));
//         setTimeout(() => {
//           dispatch(actionCreators.changePasswordError(null));
//         }, 3000);
//       });
//   };
// };
