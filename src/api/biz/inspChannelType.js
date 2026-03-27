import request from '@/utils/request'

// 查询栏目分类列表
export function listInspChannelType(data) {
  return request({
    url: '/biz/inspChannelType/list',
    method: 'post',
    data: data
  })
}

// 查询栏目分类详细
export function getInspChannelType(data) {
  return request({
    url: '/biz/inspChannelType/getInfo',
    method: 'post',
    data: data
  })
}

// 新增栏目分类
export function addInspChannelType(data) {
  return request({
    url: '/biz/inspChannelType/add',
    method: 'post',
    data: data
  })
}

// 修改栏目分类
export function updateInspChannelType(data) {
  return request({
    url: '/biz/inspChannelType/edit',
    method: 'post',
    data: data
  })
}

// 删除栏目分类
export function delInspChannelType(data) {
  return request({
    url: '/biz/inspChannelType/remove',
    method: 'post',
    data: data
  })
}
