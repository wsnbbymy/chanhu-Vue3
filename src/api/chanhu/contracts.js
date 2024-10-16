import request from '@/utils/request'

// 查询合同管理列表
export function listContracts(query) {
  return request({
    url: '/chanhu/contracts/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContracts(id) {
  return request({
    url: '/chanhu/contracts/' + id,
    method: 'get'
  })
}

// 新增合同管理
export function addContracts(data) {
  return request({
    url: '/chanhu/contracts',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContracts(data) {
  return request({
    url: '/chanhu/contracts',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContracts(id) {
  return request({
    url: '/chanhu/contracts/' + id,
    method: 'delete'
  })
}
