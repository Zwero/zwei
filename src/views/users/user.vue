<template>
  <div class="ten">
    <!-- // 用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <!-- 搜索框 -->
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        @keyup.13.native="init"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="primary" round @click="dialogFormVisible=true">添加用户</el-button>
    </div>
    <!-- // 表单 -->
    <el-table ref="singleTable" :data="userList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="mobile" label="电话" width="200"></el-table-column>
      <el-table-column property="username" label="姓名" width="200"></el-table-column>
      <el-table-column property="email" label="邮箱"></el-table-column>
      <el-table-column property="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin-right: 30px;"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="deituser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" @click="allotuser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 组件的添加-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- // 添加模板 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="用户名称 :" label-width="90px" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码 :" label-width="90px" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱:" label-width="90px" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机 号:" label-width="90px" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- // 编辑用户模板 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
      <el-form :model="addform" :rules="rules" ref="addform">
        <el-form-item label="用户名称 :" label-width="90px">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱:" label-width="90px" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机 号:" label-width="90px" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deituserok">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="编辑用户" :visible.sync="allotdialogFormVisible">
      <!-- 下拉框 -->
      <el-form :model="grantform" :label-width="'80px'">
        <el-form-item label="用户名 :">
          <span>{{grantform.username}}</span>
        </el-form-item>
        <el-form-item label="用户角色 :">
          <el-select v-model="grantform.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantrole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getuser,
  steuser,
  delId,
  listate,
  editUser,
  getAllRolelist
} from '@/api/user_index.js'
export default {
  data () {
    return {
      // 分配角色数据
      roleList: [],
      allotdialogFormVisible: false,
      grantform: {
        id: '',
        rid: '',
        username: '爸爸'
      },
      // 添加盒子是否隐藏
      dialogFormVisible: false,
      // 添加用户数据
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        status: ''
      },
      // 总数据
      total: 0,
      // 用户搜索关键字
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 将服务器数据获取并保存
      userList: [],
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请求输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '你这邮箱不合法啊逗比',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '你这手机号不合法啊大逗比',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取所有用户数据
    async roleListInit () {
      let res = await getAllRolelist()
      this.roleList = res.data.data
    },
    // 分配提交
    async grantrole () {
      if (!this.grantform.rid) {
        this.$message({
          type: 'warning',
          message: '请选择一个角色'
        })
      } else {
        let res = await getAllRolelist(this.grantform)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '角色设置成功'
          })
          this.allotdialogFormVisible = false
          this.init()
        }
      }
    },
    //  分配角色
    async allotuser (row) {
      console.log(row)
      this.allotdialogFormVisible = true
      this.grantform.id = row.id
      this.grantform.username = row.username
      this.grantform.rid = row.rid
    },
    // 编辑发送服务器
    async deituserok () {
      let res = await editUser(this.addform)
      console.log(res)
      if (res.data.meta.status === 200) {
        console.log(123)
        this.$message({
          type: 'success',
          message: '数据编辑成功'
        })
        // 隐藏对话框
        this.dialogFormVisible = false
        // 重置表单元素数据
        this.$refs.editform.resetFields()
        // 刷新
        this.init()
      } else {
        this.$message({
          type: 'success',
          message: '数据编辑失败'
        })
      }
    },
    // 显示对话编辑框
    deituser (row) {
      this.dialogFormVisible = true
      this.addform.id = row.id
      this.addform.username = row.username
      this.addform.email = row.email
      this.addform.mobile = row.mobile
    },
    // 修改用户状态
    async changeState (id, type) {
      let res = await listate(id, type)
      console.log(type)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '状态修改成功'
        })
      }
    },
    // 弹窗确认框
    del (id) {
      // 调用ID发送给服务器
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delId(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.userobj.pagenum = Math.ceil(
                  (this.total - 1) / this.userobj.pagesize
                )
                  ? --this.userobj.pagenum
                  : this.userobj.pagenum
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加用户
    adduser () {
      this.$refs.addform.validate(valid => {
        if (valid) {
          // 调用接口方法
          steuser(this.addform)
            .then(res => {
              if (res.data.meta.status === 201) {
                console.log(123)

                this.$message({
                  type: 'success',
                  message: '数据添加成功'
                })
                // 隐藏对话框
                this.dialogFormVisible = false
                // 重置表单
                this.$refs.addform.resetFields()
                // 刷新
                this.init()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            type: 'error',
            message: '数据输入不合法'
          })
          return false
        }
      })
    },
    // 分页功能
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      // 重新获取数据
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      // 重新获取数据
      this.init()
    },
    // 数据初始化
    init () {
      getuser(this.userobj)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取总记录数
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  // 钩子函数
  mounted () {
    this.init()
    this.roleListInit()
  }
}
</script>
<style lang="less" scoped>
.ten {
  .input-with-select {
    width: 300px;
    margin-right: 15px;
  }
}
</style>
