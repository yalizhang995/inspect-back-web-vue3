import request from '@/utils/request'

// 查询站点和新媒体账号关联列表
export function listInspSiteXmt(data) {
    return request({
        url: '/biz/inspSiteXmt/list',
        method: 'post',
        data: data
    })
}

// 查询站点和新媒体账号关联详细
export function getInspSiteXmt(data) {
    return request({
        url: '/biz/inspSiteXmt/getInfo',
        method: 'post',
        data: data
    })
}

// 新增站点和新媒体账号关联
export function addInspSiteXmt(data) {
    return request({
        url: '/biz/inspSiteXmt/add',
        method: 'post',
        data: data
    })
}

// 修改站点和新媒体账号关联
export function updateInspSiteXmt(data) {
    return request({
        url: '/biz/inspSiteXmt/edit',
        method: 'post',
        data: data
    })
}

// 删除站点和新媒体账号关联
export function delInspSiteXmt(data) {
    return request({
        url: '/biz/inspSiteXmt/remove',
        method: 'post',
        data: data
    })
}

// 模糊查询网站标识码
export function inspSiteInfo(data) {
    return request({
        url: '/biz/inspSiteInfo/queryList',
        method: 'post',
        data: data
    })
}
// 模糊查询新媒体标识码
export function inspMediaInfo(data) {
    return request({
        url: '/biz/inspMediaInfo/queryList',
        method: 'post',
        data: data
    })
}


// 模板上传
export function batchImport(data) {
    return request({
        // url: '/biz/inspSiteXmt/batchImport',
        url: '/biz/wrongWords/batchImport',
        method: 'post',
        data: data
    })
}

// 模板下载
export function templateDownload(data) {
    return request({
        url: '/biz/inspSiteXmt/templateDownload',
        method: 'post',
        data: data
    })
}

// export function templateDownload() {
//     return request({
//         // url: '/biz/inspSiteXmt/templateDownload',
//         url: '/common/download/downloadExcelTpl?type=1',
//         method: 'get',
//     })
// }