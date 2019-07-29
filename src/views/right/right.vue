<template>
  <div class="rig">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-table ref="singleTable" :data="rightList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="autName" label="权限名称" width="300"></el-table-column>
      <el-table-column property="path" label="路径" width="300"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope='scope'>{{scope.row.level | levelFormat}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { allRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      } else {
        return ''
      }
    }
  },
  mounted () {
    allRightList('list')
      .then(res => {
        // console.log(res)
        this.rightList = res.data.data
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
</style>
