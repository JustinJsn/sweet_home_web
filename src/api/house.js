import request from "@/utils/request";

/**
 * 搜索框下拉推荐数据
 * @param params
 * @returns {AxiosPromise}
 */
export function search(params) {
  return request({
    url: "/house/search",
    method: "GET",
    params
  });
}

/**
 * 首页随机数据
 * @param params
 * @returns {AxiosPromise}
 */
export function condition(params) {
  return request({
    url: "/house/condition",
    method: "GET",
    params
  });
}

/**
 * 获取房源列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getHouseInfo(params) {
  return request({
    url: "/house/info",
    method: "GET",
    params
  });
}

/**
 * 条件查询房源信息
 * @param data
 * @returns {AxiosPromise}
 */
export function getHouseOfCondition(data) {
  return request({
    url: "/house/filter",
    method: "POST",
    data
  });
}

/**
 * 查找房源信息
 * @param params
 * @returns {AxiosPromise}
 */
export function searchHouseInfo(params) {
  return request({
    url: "/house/search_info",
    method: "GET",
    params
  });
}

/**
 * 获取委托信息
 * @param params
 * @param token
 * @returns {AxiosPromise}
 */
export function getRental(params, token) {
  return request({
    url: "/entrusted_rental/info",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}

/**
 * 完善信息
 * @param data
 * @param token
 * @returns {AxiosPromise}
 */
export function createHouse(data, token) {
  return request({
    url: "/house/create",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  });
}

export function getContract(params, token) {
  return request({
    url: "/house/contract",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  });
}
