import request from '@/utils/request'

// 查询合同管理列表
export function getOperators() {
  return request({
    url: '/chanhu/process_client/getOperators',
    method: 'get',
  })
}

export function createOperators(data) {
  return request({
    url: '/chanhu/process_client/createOperators',
    data: data,
    method: 'post',
  })
}


export function updateOperators(data) {
  return request({
    url: '/chanhu/process_client/updateOperators',
    data: data,
    method: 'post',
  })
}