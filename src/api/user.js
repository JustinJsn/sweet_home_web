import request from "@/utils/request";

// 注册
export function register(data) {
  return request({
    url: "/register",
    method: "POST",
    data
  });
}

// 登录
export function login(data) {
  return request({
    url: "/login",
    method: "POST",
    data
  });
}

// 邮箱验证
export function check_email(data) {
  return request({
    url: "/register/check_email",
    method: "POST",
    data
  });
}

// 手机号验证
export function check_phone(data) {
  return request({
    url: "/register/check_phone",
    method: "POST",
    data
  });
}

// 重置密码验证
export function reset_check_phone(data) {
  return request({
    url: "/reset/check_phone",
    method: "POST",
    data
  });
}

// 重置密码
export function reset_password(data) {
  return request({
    url: "/reset/password",
    method: "PUT",
    data
  });
}

// 更新用户头像
export function update_avatar(data, token) {
  return request({
    url: "/update/avatar",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

// 更新用户信息
export function update_info(data, token) {
  return request({
    url: "/update/info",
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

// 获取用户关注房源信息
export function get_follow(params, token) {
  return request({
    url: "/follow/search",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}

// 取消关注
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

// 检测昵称是否唯一
export function check_nickName(params, token) {
  return request({
    url: "/check/nickName",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}

export function validateEmailPhone(params) {
  return request({
    url: "/check/emailOrPhone",
    method: "GET",
    params
  });
}
// 获取手机验证码
export function getVerifyCode(params) {
  return request({
    url: "/code/send",
    method: "GET",
    params
  });
}
// 验证手机验证码
export function checkVerifyCode(data) {
  return request({
    url: "/code/verify",
    method: "POST",
    withCredentials: true,
    data
  });
}

// 验证图形验证码
export function VerifyImgCode(data) {
  return request({
    url: "/code/verifyImgCode",
    method: "POST",
    withCredentials: true,
    data
  });
}

export function authentication(data, token) {
  return request({
    url: "/auth/real",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function checkUser(params) {
  return request({
    url: "/user/check",
    method: "GET",
    params
  });
}
