import request from '@/utils/request'

// 列表
export function pagesIndexList(data) {
    return request({
        url: '/biz/pages/list',
        method: 'post',
        data: data
    })
}

// 重新采集
export function pagesIndexAgain(data) {
    return request({
        url: '/biz/pages/again',
        method: 'post',
        data: data
    })
}

// 采集排查
export function getDetails(data) {
    return request({
        url: '/biz/pages/getDetails',
        method: 'post',
        data: data
    })
}