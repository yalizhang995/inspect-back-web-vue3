import request from '@/utils/request'

// 获取站点关系
export function getInspSiteTreeList(data) {
    return request({
      url: '/biz/inspSiteTree/listQuery',
      method: 'post',
      data: data
    })
}
export function searchList(data) {
    return request({
      url: '/biz/search/list',
      method: 'post',
      data: data
    })
}
// 新媒体查询站点
export function getInspMediaInfo(data) {
    return request({
      url: '/biz/inspMediaInfo/listQuery',
      method: 'post',
      data: data
    })
}
// 站点搜索
export function searchTreeListQuery(data) {
    return request({
      url: '/biz/inspSiteTree/searchTreeListQuery',
      method: 'post',
      data: data
    })
}


