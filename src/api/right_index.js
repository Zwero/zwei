import axios from '@/utils/myaxios.js'
// 获取所有权限数据
export const allRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 删除角色指定权限
export const delRightList = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
// 添加角色
export const addRole = (data) => {
  return axios({
    url: `roles`,
    method: 'post',
    data
  })
}
// 分配权限提交
export const addRoleRight = (roleId, rids) => {
  // console.log(roleId, data)
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
// 左侧权限菜单权限
export const navMenus = () => {
  return axios({
    url: `menus`
  })
}
