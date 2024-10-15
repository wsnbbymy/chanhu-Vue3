import request from '@/utils/request'

// 查询客户经理信息管理列表
export function listProcess_manager(query) {
  return request({
    url: '/chanhu/process_manager/list',
    method: 'get',
    params: query
  })
}

// 查询客户经理信息管理详细
export function getProcess_manager(id) {
  return request({
    url: '/chanhu/process_manager/' + id,
    method: 'get'
  })
}

// 新增客户经理信息管理
export function addProcess_manager(data) {
  return request({
    url: '/chanhu/process_manager',
    method: 'post',
    data: data
  })
}

// 修改客户经理信息管理
export function updateProcess_manager(data) {
  return request({
    url: '/chanhu/process_manager',
    method: 'put',
    data: data
  })
}

// 删除客户经理信息管理
export function delProcess_manager(id) {
  return request({
    url: '/chanhu/process_manager/' + id,
    method: 'delete'
  })
}
