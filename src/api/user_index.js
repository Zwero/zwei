import axios from '@/utils/myaxios.js'
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
// 用户数据
export const getuser = (data) => {
  return axios({
    url: 'users',
    params: data
  })
}
//  添加用户
export const steuser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 根据id删除用户数据
export const delId = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
// 状态
export const listate = (id, type) => {
  return axios({
    url: `users/${id}/state/${type}`,
    method: 'put'
  })
}
// 编辑提交数据
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: { email: data.email, mobile: data.mobile }
  })
}
// 获取角色数据
export const getAllRolelist = () => {
  return axios({
    url: 'roles'
  })
}
// 角色提交
export const steAllRolelist = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    dta: { id: data.id, rid: data.rid }
  })
}
