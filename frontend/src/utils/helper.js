export function toDate(date) {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
}

let json = require("../config.json");
const urlBase = "http://localhost:" + json.BACKEND_PORT;


export default async function makeRequest(
  route,
  method,
  errorContext,
  handleData,
  body = null,
  token = null
) {
  const url = urlBase + route;
  const headers = {
    "Content-type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const sendOptions = {
    method: method,
    headers: headers,
  };
  if (body) {
    sendOptions.body = JSON.stringify(body);
  }
  const response = await fetch(url, sendOptions);
  const data = await response.json();
  if (data.error) {
    errorContext.setHasError(true);
    errorContext.setErrorMessage(data.error);
    return null;
  } else {
    await handleData(data);
    return data;
  }
}

export async function getListingDetail(listingId, errorCtx) {
  const data = await makeRequest(
    "/listings/" + listingId,
    "GET",
    errorCtx,
    () => {}
  );
  const listing = data.listing;
  listing.id = listingId;
  return listing;
}
