import request from '@/utils/request'

// 列表
export function getWarnStrategyInfoList(data) {
    return request({
      url: '/biz/warnStrategyInfo/list',
      method: 'post',
      data: data
    })
}
// 详情
export function getInfoList(data) {
    return request({
      url: '/biz/warnStrategyInfo/getInfo',
      method: 'post',
      data: data
    })
}
// 添加
export function warnStrategyInfoAdd(data) {
    return request({
      url: '/biz/warnStrategyInfo/add',
      method: 'post',
      data: data
    })
}
// 修改
export function warnStrategyInfoEdif(data) {
    return request({
      url: '/biz/warnStrategyInfo/edit',
      method: 'post',
      data: data
    })
}
// 删除
export function warnStrategyInfoRemove(data) {
    return request({
      url: '/biz/warnStrategyInfo/remove',
      method: 'post',
      data: data
    })
}
// 禁用，启用
export function warnStrategyInfoEnabled(data) {
    return request({
      url: '/biz/warnStrategyInfo/enabled',
      method: 'post',
      data: data
    })
}
// 获取站点关系
export function getInspSiteTreeList(data) {
    return request({
      url: '/biz/inspSiteTree/list',
      method: 'post',
      data: data
    })
}
// 查询联系人
export function getInspSiteDirector(data) {
    return request({
      url: '/biz/inspSiteDirector/warnList',
      method: 'post',
      data: data
    })
}
// 查询可配置预警项
export function getConfigurable(data) {
    return request({
      url: '/biz/warnStrategyInfo/getConfigurable',
      method: 'post',
      data: data
    })
}
// 日志
export function getLogList(data) {
    return request({
      url: '/biz/warnSendLog/list',
      method: 'post',
      data: data
    })
}
// 异常日志
export function getFailLogList(data) {
    return request({
      url: '/biz/warnFailSendLog/list',
      method: 'post',
      data: data
    })
}

// H5页面路由
export function getWarnRoute(data) {
    return request({
      url: '/biz/warnPageDetail/warnRoute',
      method: 'post',
      data: data
    })
}


export function getWarnPageDetail(data) {
    return request({
      url: '/biz/warnPageDetail/list',
      method: 'post',
      data: data
    })
}

// 预警项是否可以选择 
export function getWarnStrategyInfo(data) {
    return request({
      url: '/biz/warnStrategyInfo/isChoose',
      method: 'post',
      data: data
    })
}

// 根据表示码获取下级单位（包含本级）
export function getOrganizationUnit(data) {
    return request({
      url: '/biz/warnStrategyInfo/getOrganizationUnit',
      method: 'post',
      data: data
    })
}
// 根据表示码获取填报单位
export function getUnit(data) {
    return request({
      url: '/biz/warnStrategyInfo/getUnit',
      method: 'post',
      data: data
    })
}
export function getMediaList(data) {
    return request({
      url: '/biz/warnStrategyInfo/mediaList',
      method: 'post',
      data: data
    })
}