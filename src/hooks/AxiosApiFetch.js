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

export function PutHeader(session, params) {
  const headers = {
    method: "PUT",
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

export function DeleteHeader(session) {
  const headers = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "needJson": 1,
      "apiToken": session
    }
  };
  return headers;
};

export function PostImageHeader(session, form) {
  const headers = {
    method: 'POST',
    body: form,
    headers: {
      "Cache-Control": "max-age=0, no-cache, no-store",
      "Accept": "application/json",
      "apiToken": session,
      "needJson": "1"
    }
  };
  return headers;
};

export function PutHeaderWithoutParams(session) {
  const headers = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "needJson": 1,
      "apiToken": session
    },
  };
  return headers;
};