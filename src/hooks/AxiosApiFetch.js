export function GetHeader(session) {
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "needJson": 1,
      "apiToken": session
    }
  };
  return headers;
};


export function PostHeader(session, params){
  const headers = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "needJson": 1,
      "apiToken": session
    },
    body: JSON.stringify({
      ...params
    })
  };
  return headers;
};