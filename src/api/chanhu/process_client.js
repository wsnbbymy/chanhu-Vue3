import request from '@/utils/request'

// 查询客户信息列表
export function listProcess_client(query) {
  return request({
    url: '/chanhu/process_client/list',
    method: 'get',
    params: query
  })
}

// 查询客户信息详细
export function getProcess_client(id) {
  return request({
    url: '/chanhu/process_client/' + id,
    method: 'get'
  })
}

// 新增客户信息
export function addProcess_client(data) {
  return request({
    url: '/chanhu/process_client',
    method: 'post',
    data: data
  })
}

// 修改客户信息
export function updateProcess_client(data) {
  return request({
    url: '/chanhu/process_client',
    method: 'put',
    data: data
  })
}

// 删除客户信息
export function delProcess_client(id) {
  return request({
    url: '/chanhu/process_client/' + id,
    method: 'delete'
  })
}
