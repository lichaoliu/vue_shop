<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意: 只允许为第三季分类设置相关参数!"
                type="warning"
                :closable="false"
                show-icon />
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader v-model="selectedCateKeys"
                       :options="cateList"
                       :props="props"
                       @change="handleChange" />
        </el-col>
      </el-row>
      <!-- tab标签区域 -->
      <el-tabs v-model="activeName"
               @tab-change="handleTabClick">
        <el-tab-pane label="动态参数"
                     name="many">
          <!-- 添加动态参数 -->
          <el-button type="primary"
                     size="small"
                     :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData"
                    :border="true"
                    stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <!-- <template slot-scope="scope"> -->
              <el-button type="primary"
                         icon="Edit">编 辑</el-button>
              <el-button type="danger"
                         icon="Delete">删 除</el-button>
              <!-- </template> -->
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数"
                     name="only">
          <!-- 添加静态参数 -->
          <el-button type="primary"
                     size="small"
                     :disabled="isBtnDisabled">添加参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData"
                    :border="true"
                    stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <!-- <template slot-scope="scope"> -->
              <el-button type="primary"
                         icon="Edit">编 辑</el-button>
              <el-button type="danger"
                         icon="Delete">删 除</el-button>
              <!-- </template> -->
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      cateList: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框选中的值
      selectedCateKeys: [],
      // 标签区域选择的值
      activeName: 'many',
      // 动态属性数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框数据变化触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // 标签区域切换触发的事件
    handleTabClick () {
      console.log('切换的是' + this.activeName)
      this.getParamsData()
    },
    // 获取所选分类参数
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return
      }
      // 根据所选分类id 和 当前所处面板，获取对应参数
      const { data: res } = await this.$http.get('categories/' + this.cateId + '/attributes', { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取对应参数失败')
      }
      if (this.activeName === 'many') {
        // 动态属性数据
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    }

  },
  computed: {
    // tab区域按钮是否禁用
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中 第三分类id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
