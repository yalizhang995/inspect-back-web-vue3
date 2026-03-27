import request from '@/utils/request'

// 列表
export function getRepairWord(data) {
    return request({
        url: '/biz/repairWord/list',
        method: 'post',
        data: data
    })
}