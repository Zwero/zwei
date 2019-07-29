import axios from '@/utils/myaxios.js'
// import { match } from 'minimatch';*
// 获取商品列表数据
export const getGoods = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
// 三级商品列表
export const getcateglist = (data) => {
  return axios({
    url: 'categories',
    data
  })
}
//  参数列表
export const getGoodsParan = (id, sel) => {
  // console.log(123)
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
// 添加商品
export const setGoodsParan = (data) => {
  console.log(data)
  return axios({
    url: `goods`,
    method: 'post',
    data
  })
}
