import request from "@/utils/request";

export function getDetailInfo(params) {
  return request({
    url: "/house/detail",
    method: "GET",
    params
  });
}

export function getOwnFollow(params, token) {
  return request({
    url: "/follow/own",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}
export function createFollow(data, token) {
  return request({
    url: "/follow/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function del_follow(data, token) {
  return request({
    url: "/follow/del",
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function getEquipmentInfo(params) {
  return request({
    url: "/equipment",
    method: "GET",
    params
  });
}
