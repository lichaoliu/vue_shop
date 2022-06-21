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
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData"
                    :border="true"
                    stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 显示参数标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable>
                  {{item}}
                </el-tag>
                <!-- 新增属性标签 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter="handleInputConfirm"
                          @blur="handleInputConfirm">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary"
                           icon="Edit"
                           @click="showEditDialog(scope.row.attr_id)">编 辑</el-button>
                <el-button type="danger"
                           icon="Delete"
                           @click="deleteParam(scope.row.attr_id)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数"
                     name="only">
          <!-- 添加静态参数 -->
          <el-button type="primary"
                     size="small"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData"
                    :border="true"
                    stripe>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary"
                           icon="Edit"
                           @click="showEditDialog(scope.row.attr_id)">编 辑</el-button>
                <el-button type="danger"
                           icon="Delete"
                           @click="deleteParam(scope.row.attr_id)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog v-model="addDialogVisible"
               :title="'添加'+titleText"
               width="50%"
               @close="addDialogClosed">
      <!-- 添加参数表单 -->
      <el-form ref="addFormRef"
               :model="addForm"
               :rules="addFormRules"
               label-width="100px"
               status-icon>
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addParams">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog v-model="editDialogVisible"
               :title="'编辑'+titleText"
               width="50%"
               @close="editDialogClosed">
      <!-- 添加参数表单 -->
      <el-form ref="editFormRef"
               :model="editForm"
               :rules="editFormRules"
               label-width="100px"
               status-icon>
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editParams">确 认</el-button>
        </span>
      </template>
    </el-dialog>
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
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数表单对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 编辑显示对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
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
    },
    // 级联选择框数据变化触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // 标签区域切换触发的事件
    handleTabClick () {
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
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 新增 按钮和输入框切换
        item.inputVisible = false
        // 新增输入框值
        item.inputValue = ''
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取对应参数失败')
      }
      if (this.activeName === 'many') {
        // 动态属性数据
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加属性对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams () {
      //  表单验证通过
      this.$refs.addFormRef.validate(async isValid => {
        if (!isValid) {
          return
        }
        const { data: res } = await this.$http.post('categories/' + this.cateId + '/attributes', { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败')
        }
        this.getParamsData()
        this.addDialogVisible = false
        this.$message.success('添加属性成功')
      })
    },
    // 关闭编辑对话框，清空编辑对话框验证
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 显示编辑对话框
    async showEditDialog (attrId) {
      const { data: res } = await this.$http.get('categories/' + this.cateId + '/attributes/' + attrId)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 提交修改参数
    async editParams () {
      const { data: res } = await this.$http.put('categories/' + this.cateId + '/attributes/' + this.editForm.attr_id,
        { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.getParamsData()
      this.editDialogVisible = false
      this.$message.success('修改参数成功')
    },
    // 删除参数
    async deleteParam (attrId) {
      const confirm = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirm !== 'confirm') {
        return this.$message.info('已取消')
      }
      const { data: res } = await this.$http.delete('categories/' + this.cateId + '/attributes/' + attrId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除属性失败')
      }
      this.getParamsData()
      this.$message.success('删除属性成功')
    },
    // 新增属性标签,输入完触发的事件
    handleInputConfirm () {
      console.log('输入完成')
    },
    // 隐藏按钮 显示输入框
    showInput (row) {
      row.inputVisible = true
      console.log(row)
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
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
