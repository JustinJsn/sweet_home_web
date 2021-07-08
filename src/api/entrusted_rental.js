import request from "@/utils/request";

export function createEntrusted(data, token) {
  return request({
    method: "POST",
    url: "/entrusted_rental/create",
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getRental(params, token) {
  return request({
    method: "GET",
    url: "/entrusted_rental",
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getOwnerHouse(params, token) {
  return request({
    method: "GET",
    url: "/house/owner",
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
