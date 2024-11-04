import request from '@/utils/request'

// 查询合同管理列表
export function getOperators() {
  return request({
    url: '/chanhu/process_client/getOperators',
    method: 'get',
  })
}