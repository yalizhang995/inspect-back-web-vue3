
import request from '@/utils/request'

// 查询站点信息列表
export function listInspSiteInfo(data) {
    return request({
        url: '/biz/mediaInfoTaskLog/list',
        method: 'post',
        data: data
    })
}