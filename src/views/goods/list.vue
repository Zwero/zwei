<template>
  <div class="zwero">
    <!-- // 用户列表   面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="userobj.query"
      class="input-with-select"
      style="width:300px;margin-right:10px"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="primary" plain @click='$router.push("add")'>添加商品</el-button>

    <!-- 商品表格 -->
    <el-table ref="singleTable" :data="goodList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column property="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column property="goods_state" label="商品状态"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
              {{scope.row.add_time | timeFormat}}
          </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-d-caret" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

     <!-- 分页 组件的添加-->
    <el-pagination
      @size-change="ndleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getGoods } from '@/api/goods_index.js'
export default {
  data () {
    return {
      total: 100,
      // 分页
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //   商品列表数据
      goodList: []
    }
  },
  filters: {
    timeFormat (time) {
      time = new Date(time * 1000)
      return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
    }
  },
  methods: {
    // 获取所有商品数据
    getallGoods () {
      getGoods(this.userobj)
        .then(res => {
          this.goodList = res.data.data.goods
          this.total = res.data.data.total
        })
    },
    ndleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.getallGoods()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      // 重新获取数据
      this.getallGoods()
    }
  },
  mounted () {
    this.getallGoods()
  }
}
</script>
<style lang="less" scoped>
</style>
