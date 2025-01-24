import request from '@/utils/request'

/**
* Order4分页查询
* @param {查询条件} data
*/
export function listOrderAddress(query) {
  return request({
    url: '/business/OrderAddress/list',
    method: 'get',
    data: query,
  })
}

/**
* 新增Order4
* @param data
*/
export function addOrderAddress(data) {
  return request({
    url: '/business/OrderAddress',
    method: 'post',
    data: data,
  })
}
/**
* 修改Order4
* @param data
*/
export function updateOrderAddress(data) {
  return request({
    url: '/business/OrderAddress',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取Order4详情
* @param {Id}
*/
export function getOrderAddress(id) {
  return request({
    url: '/business/OrderAddress/' + id,
    method: 'get'
  })
}

/**
* 删除Order4
* @param {主键} pid
*/
export function delOrderAddress(pid) {
  return request({
    url: '/business/OrderAddress/delete/' + pid,
    method: 'delete'
  })
}
