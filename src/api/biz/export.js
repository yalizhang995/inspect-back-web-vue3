import request from '@/utils/request'

// 大批量导出
export function insertInspExcelTaskMaxBatch(data) {
    return request({
      url: '/biz/inspExcelTask/insertInspExcelTaskMaxBatch',
      method: 'post',
      data: data
    })
}
// 导出任务列表
export function list(data) {
    return request({
      url: '/biz/inspExcelTask/list',
      method: 'post',
      data: data
    })
}
// 删除
export function removeTask(data) {
    return request({
      url: '/biz/inspExcelTask/remove',
      method: 'post',
      data: data
    })
}
// 修改
export function editTask(data) {
    return request({
      url: '/biz/inspExcelTask/edit',
      method: 'post',
      data: data
    })
}