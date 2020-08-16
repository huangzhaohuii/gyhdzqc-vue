import request from '@/utils/request'

// 查询列表
export function listManage(query) {
  return request({
    url: '/system/manage/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getManage(id) {
  return request({
    url: '/system/manage/' + id,
    method: 'get'
  })
}

// 新增
export function addManage(data) {
  return request({
    url: '/system/manage',
    method: 'post',
    data: data
  })
}

// 修改
export function updateManage(data) {
  return request({
    url: '/system/manage',
    method: 'put',
    data: data
  })
}

// 删除
export function delManage(id) {
  return request({
    url: '/system/manage/' + id,
    method: 'delete'
  })
}

// 导出
export function exportManage(query) {
  return request({
    url: '/system/manage/export',
    method: 'get',
    params: query
  })
}