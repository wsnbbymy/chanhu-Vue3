import request from '@/utils/request'

// 查询合同管理列表
export function getContractsMenu() {
  return request({
    url: '/chanhu/process_contracts_menu/menu',
    method: 'get',
  })
}

// 查询合同菜单列表
export function listProcess_contracts_menu(query) {
  return request({
    url: '/chanhu/process_contracts_menu/list',
    method: 'get',
    params: query
  })
}

// 查询合同菜单详细
export function getProcess_contracts_menu(id) {
  return request({
    url: '/chanhu/process_contracts_menu/' + id,
    method: 'get'
  })
}

// 新增合同菜单
export function addProcess_contracts_menu(data) {
  return request({
    url: '/chanhu/process_contracts_menu',
    method: 'post',
    data: data
  })
}

// 修改合同菜单
export function updateProcess_contracts_menu(data) {
  return request({
    url: '/chanhu/process_contracts_menu',
    method: 'put',
    data: data
  })
}

// 删除合同菜单
export function delProcess_contracts_menu(id) {
  return request({
    url: '/chanhu/process_contracts_menu/' + id,
    method: 'delete'
  })
}

