import request from '@/utils/request'

// 查询列表
export function listTasks(query) {
  return request({
    url: '/system/tasks/list',
    method: 'get',
    params: query
  })
}

// 查询未完成列表
export function undoTasks(query) {
  return request({
    url: '/system/tasks/undoList',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getTasks(id) {
  return request({
    url: '/system/tasks/' + id,
    method: 'get'
  })
}

// 新增
export function addTasks(data) {
  return request({
    url: '/system/tasks',
    method: 'post',
    data: data
  })
}

// 修改
export function updateTasks(data) {
  return request({
    url: '/system/tasks/edit',
    method: 'post',
    data: data
  })
}

// 确认完成任务
export function completeTasks(data) {
  return request({
    url: '/system/tasks/complete',
    method: 'post',
    data: data
  })
}

// 数据分析
export function analysis(data) {
  return request({
    url: '/system/tasks/analysis',
    method: 'post',
    data: data
  })
}

// 删除
export function delTasks(id) {
  return request({
    url: '/system/tasks/' + id,
    method: 'post'
  })
}

// 导出
export function exportTasks(query) {
  return request({
    url: '/system/tasks/export',
    method: 'get',
    params: query
  })
}
//获取未完成任务
export function getUndoTask(query) {
  return request({
    url: '/system/tasks/unDoTask',
    method: 'get',
    params: query
  })
}