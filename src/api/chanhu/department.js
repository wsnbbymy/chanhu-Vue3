import request from '@/utils/request'

// 查询客户单位部门管理列表
export function listDepartment(query) {
  return request({
    url: '/chanhu/department/list',
    method: 'get',
    params: query
  })
}

// 查询客户单位部门管理详细
export function getDepartment(id) {
  return request({
    url: '/chanhu/department/' + id,
    method: 'get'
  })
}

// 新增客户单位部门管理
export function addDepartment(data) {
  return request({
    url: '/chanhu/department',
    method: 'post',
    data: data
  })
}

// 修改客户单位部门管理
export function updateDepartment(data) {
  return request({
    url: '/chanhu/department',
    method: 'put',
    data: data
  })
}

// 删除客户单位部门管理
export function delDepartment(id) {
  return request({
    url: '/chanhu/department/' + id,
    method: 'delete'
  })
}
