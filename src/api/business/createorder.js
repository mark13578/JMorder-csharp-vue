import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
 * 建立工單分页查询
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
 * 新增建立工單
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
 * 修改建立工單
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
 * 获取建立工單详情
 * @param {Id}
 */
export function getCreateOrder(id) {
  return request({
    url: 'business/CreateOrder/' + id,
    method: 'get'
  })
}

/**
 * 删除建立工單
 * @param {主键} pid
 */
export function delCreateOrder(pid) {
  return request({
    url: 'business/CreateOrder/delete/' + pid,
    method: 'POST'
  })
}
// 导出建立工單
export async function exportCreateOrder(query) {
  await downFile('business/CreateOrder/export', { ...query })
}
