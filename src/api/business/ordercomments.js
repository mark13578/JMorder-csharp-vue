import request from '@/utils/request'

/**
* 建立訂單_建立備註分页查询
* @param {查询条件} data
*/
export function listOrderComments(query) {
  return request({
    url: '/business/OrderComments/list',
    method: 'get',
    data: query,
  })
}

/**
* 新增建立訂單_建立備註
* @param data
*/
export function addOrderComments(data) {
  return request({
    url: '/business/OrderComments',
    method: 'post',
    data: data,
  })
}
/**
* 修改建立訂單_建立備註
* @param data
*/
export function updateOrderComments(data) {
  return request({
    url: '/business/OrderComments',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取建立訂單_建立備註详情
* @param {Id}
*/
export function getOrderComments(id) {
  return request({
    url: '/business/OrderComments/' + id,
    method: 'get'
  })
}

/**
* 删除建立訂單_建立備註
* @param {主键} pid
*/
export function delOrderComments(pid) {
  return request({
    url: '/business/OrderComments/delete/' + pid,
    method: 'delete'
  })
}
