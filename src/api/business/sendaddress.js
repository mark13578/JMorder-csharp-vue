import request from '@/utils/request'

/**
 * 寄送地址維護分页查询
 * @param {查询条件} data
 */
export function listSendaddress(query) {
  return request({
    url: 'business/Sendaddress/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增寄送地址維護
 * @param data
 */
export function addSendaddress(data) {
  return request({
    url: 'business/Sendaddress',
    method: 'post',
    data: data,
  })
}
/**
 * 修改寄送地址維護
 * @param data
 */
export function updateSendaddress(data) {
  return request({
    url: 'business/Sendaddress',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取寄送地址維護详情
 * @param {Id}
 */
export function getSendaddress(id) {
  return request({
    url: 'business/Sendaddress/' + id,
    method: 'get'
  })
}

/**
 * 删除寄送地址維護
 * @param {主键} pid
 */
export function delSendaddress(pid) {
  return request({
    url: 'business/Sendaddress/delete/' + pid,
    method: 'POST'
  })
}
