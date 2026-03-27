
import request from '@/utils/request'

// 导入记录列表
export function list(data) {
    return request({
        url: '/biz/inspImportExcelTask/list',
        method: 'post',
        data: data
    })
}
// 记录详情
export function infoList(data) {
    return request({
        url: '/biz/inspImportExcelInfo/list',
        method: 'post',
        data: data
    })
}
// 上传
export function excelImport(data) {
    return request({
        url: '/biz/inspImportExcelTask/excelImport',
        method: 'post',
        data: data
    })
}

// 重采
export function again(data) {
    return request({
        url: '/biz/inspImportExcelInfo/again',
        method: 'post',
        data: data
    })
}

