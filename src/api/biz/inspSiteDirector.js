import request from '@/utils/request'

// 查询站点联系人列表
export function listInspSiteDirector(data) {
  return request({
    url: '/biz/inspSiteDirector/list',
    method: 'post',
    data: data
  })
}

// 查询站点联系人详细
export function getInspSiteDirector(data) {
  return request({
    url: '/biz/inspSiteDirector/getInfo',
    method: 'post',
    data: data
  })
}

// 新增站点联系人
export function addInspSiteDirector(data) {
  return request({
    url: '/biz/inspSiteDirector/addBack',
    method: 'post',
    data: data
  })
}

// 修改站点联系人
export function updateInspSiteDirector(data) {
  return request({
    url: '/biz/inspSiteDirector/editBack',
    method: 'post',
    data: data
  })
}

// 删除站点联系人
export function delInspSiteDirector(data) {
  return request({
    url: '/biz/inspSiteDirector/remove',
    method: 'post',
    data: data
  })
}
// 重置密码
export function resetPwd(data) {
    return request({
      url: '/biz/inspSiteDirector/resetPwd',
      method: 'post',
      data: data
    })
  }
