import request from "@/utils/request";

// 获取七牛云配置的 token
export function getToken(token) {
  return request({
    url: "/upload/token",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function uploadFile(data) {
  return request({
    url: "/file/upload",
    method: "POST",
    data
  });
}
