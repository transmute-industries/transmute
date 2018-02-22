export const getSearchResults = text => {
  return new Promise(async (resolve, reject) => {
    let response = await fetch("http://localhost:3001/search?text=" + text, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
      // body: JSON.stringify({
      //   firstParam: "yourValue",
      //   secondParam: "yourOtherValue"
      // })
    });
    let data = await response.json();
    resolve(data);
  });
};
