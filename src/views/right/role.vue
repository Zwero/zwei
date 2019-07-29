<template>
  <div class="rig">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色 -->
    <el-button round @click="addRolezw">添加角色</el-button>
    <el-dialog title="编辑用户" :visible.sync="allRoleFormVisible">
      <el-form :model="roleform" :label-width="'80px'">
        <el-form-item label="用户名 :">
          <el-input v-model="roleform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户描述 :">
          <el-input v-model="roleform.roleDese" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolezwero">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色列表 -->

    <el-table ref="singleTable" :data="rolesList" highlight-current-row style="width: 100%">
      <el-table-column width="80" type="expand">
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id">
            <el-col :span="4">
              <el-tag closable type="success">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag closable type="info" style="margin:0 5px 5px 5px">{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin:0 5px 5px 5px"
                    @close="delRightId(scope.row, third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" v-show="scope.row.children.length == 0">没有任何权限, 请分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称" width="350"></el-table-column>
      <el-table-column property="roleDesc" label="描述" width="350"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="deituser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色权限" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" @click="allotrole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- // 分配角色权限 -->
    <el-dialog title="分配角色权限" :visible.sync="allotroleFormVisible">
        <el-tree
          ref="mytree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expanded-all="true"
          :default-checked-keys="checkedArr"
          :props="defaultProps"
        ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotroleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 引入封装的功能
import { getAllRolelist } from '@/api/user_index.js'
import { delRightList, addRole, allRightList, addRoleRight } from '@/api/right_index.js'
export default {
  data () {
    return {
      // 角色列表
      rolesList: [],
      rightList: [],
      // 树形列表
      checkedArr: [],
      roleform: {
        roleName: '',
        roleDese: ''
      },
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      allRoleFormVisible: false,
      allotroleFormVisible: false
    }
  },
  methods: {
    // 分配角色权限提交
    async submitRole () {
      var arr = this.$refs.mytree.getCheckedNodes()
      console.log(this.roleId)
      // 1. 遍历数组
      var temp = []
      arr.forEach(item => {
        temp.push(item.id + ',' + item.pid)
      })
      // console.log(temp)
      // 2. 将获取的数组拼接
      var tempstr = temp.join(',')
      // console.log(temstr)
      // 3.将字符串重新转成数组
      var temparr = tempstr.split(',')
      // 4. 数组去重
      var finalarr = [...new Set(temparr)]
      // console.log(this.roleId)
      // 我们要:"102,107,109,154"
      // 调用接口方法实现权限的分配
      let res = await addRoleRight(this.roleId, finalarr.join(','))
      if (res.data.meta.status === 200) {
        console.log(res.data.meta.status)
        this.$message({
          type: 'success',
          message: '权限添加成功'
        })
      }
      this.allotroleFormVisible = false
    },

    // 分配角色权限弹窗树状图渲染
    async allotrole (row) {
      this.roleId = row.id
      this.allotroleFormVisible = true
      // 所有权限数据的获取
      let res = await allRightList('tree')
      this.rightList = res.data.data
      // 获取默认选项
      // console.log('这是row', row.children)
      // 这个数组是全局的所以如果再复用的话会保存有上一次的值
      this.checkedArr.length = 0
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  // 添加 id 到数组
                  this.checkedArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 添加角色弹窗
    addRolezw () {
      this.allRoleFormVisible = true
    },
    // 添加角色提交
    async addRolezwero () {
      let data = this.roleform
      let res = await addRole(data)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }
      this.allRoleFormVisible = false
    },

    // 删除权限
    async delRightId (row, rightId) {
      console.log(row.id, rightId)
      let res = await delRightList(row.id, rightId)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        // 返回的res中会返回删除后的新数组
        row.children = res.data.data
      }
    },
    // 获取角色名称
    async initRole () {
      let res = await getAllRolelist()
      // console.log(res)
      this.rolesList = res.data.data
    }
  },
  // 当dom树加载完的时候就会执行一次(钩子函数)
  mounted () {
    this.initRole()
  }
}
</script>
<style lang="less" scoped>
</style>
