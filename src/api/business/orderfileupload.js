import request from '@/utils/request'

/**
* 檔案上傳分页查询
* @param {查询条件} data
*/
export function listOrderFileUpload(query) {
  return request({
    url: '/business/OrderFileUpload/list',
    method: 'get',
    data: query,
  })
}

/**
* 新增檔案上傳
* @param data
*/
export function addOrderFileUpload(data) {
  return request({
    url: '/business/OrderFileUpload',
    method: 'post',
    data: data,
  })
}
/**
* 修改檔案上傳
* @param data
*/
export function updateOrderFileUpload(data) {
  return request({
    url: '/business/OrderFileUpload',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取檔案上傳详情
* @param {Id}
*/
export function getOrderFileUpload(id) {
  return request({
    url: '/business/OrderFileUpload/' + id,
    method: 'get'
  })
}

/**
* 删除檔案上傳
* @param {主键} pid
*/
export function delOrderFileUpload(pid) {
  return request({
    url: '/business/OrderFileUpload/delete/' + pid,
    method: 'delete'
  })
}
