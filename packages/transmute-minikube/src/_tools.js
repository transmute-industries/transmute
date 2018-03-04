export const sleep = seconds => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds);
  });
};
