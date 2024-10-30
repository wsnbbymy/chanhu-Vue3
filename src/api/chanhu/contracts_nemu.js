import request from '@/utils/request'

// 查询合同管理列表
export function getContractsMenu() {
  return request({
    url: '/chanhu/contracts/menu',
    method: 'get',
  })
}



