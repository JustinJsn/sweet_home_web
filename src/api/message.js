import request from "@/utils/request";

// 获取未读信息数
export function getMsg(token) {
  return request({
    url: "/socket/msg",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });
}

// 查看信息
export function uploadView(token) {
  return request({
    url: "/socket/msg/view",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });
}

export function getInfoList(params, token) {
  return request({
    url: "/socket/msg/info",
    method: "GET",
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function uploadRead(data, token) {
  return request({
    url: "/socket/msg/read",
    method: "PUT",
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getUnreadNum(params, token) {
  return request({
    url: "/socket/msg/readNum",
    method: "GET",
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function delOne(data, token) {
  return request({
    url: "/msg/one",
    method: "DELETE",
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function delMany(data, token) {
  return request({
    url: "/msg/many",
    method: "DELETE",
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function delContract(data, token) {
  return request({
    url: "/order/contract/del",
    method: "DELETE",
    data,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
