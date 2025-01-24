import request from '@/utils/request'

/**
 * 建立訂單分页查询
 * @param {查询条件} data
 */
export function listCreateOrder(query) {
  return request({
    url: 'business/CreateOrder/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增建立訂單
 * @param data
 */
export function addCreateOrder(data) {
  return request({
    url: 'business/CreateOrder',
    method: 'post',
    data: data,
  })
}
/**
 * 修改建立訂單
 * @param data
 */
export function updateCreateOrder(data) {
  return request({
    url: 'business/CreateOrder',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取建立訂單详情
 * @param {Id}
 */
export function getCreateOrder(id) {
  return request({
    url: 'business/CreateOrder/' + id,
    method: 'get'
  })
}

/**
 * 删除建立訂單
 * @param {主键} pid
 */
export function delCreateOrder(pid) {
  return request({
    url: 'business/CreateOrder/delete/' + pid,
    method: 'POST'
  })
}
