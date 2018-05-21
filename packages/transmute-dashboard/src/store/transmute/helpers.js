export const getOktaAccessToken = () => {
  let storage = localStorage.getItem('okta-token-storage');
  if (storage) {
    return JSON.parse(storage).accessToken.accessToken;
  }
  return null;
};
