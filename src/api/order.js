import request from "@/utils/request";

export function addOrder(data, token) {
  return request({
    url: "/order/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function pay(data, token) {
  return request({
    url: "/order/pay",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function getOrder(params, token) {
  return request({
    url: "/order/list",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}

export function deleteOrder(data, token) {
  return request({
    url: "/order/delete",
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function getLease(params, token) {
  return request({
    url: "/order/lease",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}
