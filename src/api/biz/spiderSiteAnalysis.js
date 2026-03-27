import request from '@/utils/request'

// 列表
export function spiderSiteAnalysisList(data) {
    return request({
        url: '/biz/spiderSiteAnalysis/list',
        method: 'post',
        data: data
    })
}
