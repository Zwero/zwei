<template>
  <div class="zwero">
    <!-- // 用户列表   面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>

    <!-- 树桩标签页 -->
    <el-form :model="addForm" label-width="120px" ref="addForm">
      <el-tabs
        tab-position="left"
        @tab-click="handleClick"
        v-model="activeName"
        style="margin-top:20px"
        :before-leave="deforeLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称:">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格:">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量:">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量:">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联分类 -->
            <el-cascader
              :options="cateList"
              change-on-select
              v-model="addForm.goods_cat"
              :props="cateprop"
              @change="cateSelect"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="first.attr_name" v-for="first in paramsDy" :key="first.attr_id">
            <!-- 如果在复选框组中绑定一个catecheckList，那么在有多组的时候，会造成多组复选框都指向一个相同 的数组 -->
            <el-checkbox-group v-model="first.attr_vals">
              <el-checkbox
                :label="second"
                v-for="(second,index) in first.attr_vals"
                :key="index"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">

          <el-form-item :label="item.attr_name" v-for='item in paramsStatic' :key='item.attr_id'>
            <el-input :value='item.attr_vals' readonly></el-input>
          </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 文件上传 -->
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :headers="getToken()"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quillEditor v-model="addForm.goods_introduce"></quillEditor>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" class="fr" @click="addGoods">添加商品</el-button>
    </el-form>
  </div>
</template>
<script>
// 富文本框挂载
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { getcateglist, getGoodsParan, setGoodsParan } from '@/api/goods_index.js'
export default {
  data () {
    return {
      paramsDy: [],
      paramsStatic: [],
      fileList: [],
      cateprop: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateList: [],
      activeName: '0',
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_introduce: '',
        goods_cat: '',
        pics: [],
        attrs: []
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    deforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('选择分类')
          return false
        }
      }
    },
    // 添加商品
    async addGoods () {
      console.log('收集')
      // 收集 attrs数据
      for (var i = 0; i < this.paramsDy.length; i++) {
        var id = this.paramsDy[i].attr_id
        for (var j = 0; j < this.paramsDy[i].attr_vals.length; j++) {
          this.addForm.attrs.push({ attr_id: id, attr_value: this.paramsDy[i].attr_vals[j] })
        }
      }
      this.addForm.goods_cat = this.addForm.goods_cat.join(',')

      console.log(this.addForm)
      let res = await setGoodsParan(this.addForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success('添加商品成功')
        // 清空数组
        this.$refs.addForm.resetFields()
        // 跳转列表
        this.$router.push({ name: 'list' })
      }
    },
    // 文件预览时触发
    handlePreview (file) {
      console.log('文件预览时', file)
    },
    // 文件上去成功之后的钩子函数
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      if (response.meta.status === 200) {
        // 我们要的数据就在response, 我们要将上传成功之后的图片的路径(相对路径)存储到addForm的pics中
        this.addForm.pics.push({
          pic: response.data.tmp_path
        })
      }
    },
    // 移除文件时触发
    handleRemove (file, fileList) {
      // file 就是当前删除的图片对象
      // console.log(file)
      var current = file.response.data.tem_path
      for (var i = 0; i < this.addForm.pics.length; i++) {
        if (this.addForm.pics[i].pic === current) {
          this.addForm.pics.splice(i, 1)
          break
        }
      }
    },
    // 获取token数据
    getToken () {
      var token = localStorage.getItem('zwero')
      return { Authorization: token }
    },
    // 选择级联时触发
    cateSelect (obj) {
    //   console.log('这是选中的三个', obj)
    //   console.log(this.addForm.goods_cat.join(','))
    },
    async handleClick (obj) {
      // console.log('这是tab选中', this.activeName)
      // console.log(this.addForm.goods_cat[2])
      if (this.activeName === '1') {
        let res = await getGoodsParan(this.addForm.goods_cat[2], 'many')
        this.paramsDy = res.data.data
        console.log(this.paramsDy)
        this.paramsDy.forEach(value => {
          value.attr_vals = value.attr_vals ? value.attr_vals.split(',') : []
          value.attr_vals = [...value.attr_vals]
        })
        // console.log(this.paramsDy)
      } else {
        let res1 = await getGoodsParan(this.addForm.goods_cat[2], 'only')
        this.paramsStatic = res1.data.data
        // console.log(this.paramsStatic)
      }
    }
  },
  mounted () {
    getcateglist(3).then(res => {
      // console.log(res)
      this.cateList = res.data.data
      // console.log(this.cateList)
    })
  }
}
</script>
<style lang="less" scoped>
</style>
