import * as actionCreators from './actionCreators';
import * as middleware from './middleware';

export const register = async ({ email, password }) => {
  try {
    let response = await middleware.register({
      email,
      password
    });
    return actionCreators.registerViaEmail({
      ...response
    });
  } catch (e) {
    return actionCreators.registerError({
      ...e
    });
  }
};
