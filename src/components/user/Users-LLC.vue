<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <template #append>
              <el-button icon="Search"
                         @click="getUserList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="addDialogVisble = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList"
                :stripe="true"
                :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username"
                         label="姓名" />
        <el-table-column prop="email"
                         label="邮箱" />
        <el-table-column prop="mobile"
                         label="电话" />
        <el-table-column prop="role_name"
                         label="角色" />
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px">
          <template v-slot="scope">
            <el-button type="primary"
                       icon="Edit"
                       @click="showEditDialog(scope.row.id)" />
            <el-button type="danger"
                       icon="Delete"
                       @click="removeUserById(scope.row.id)" />
            <el-tooltip content="修改角色"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         icon="Setting"
                         @click="setRole(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:currentPage="queryInfo.pagenum"
                     v-model:page-size="queryInfo.pagesize"
                     :page-sizes="[1, 2, 5, 10]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog v-model="addDialogVisble"
               title="添加用户"
               width="30%"
               @close="resetFormFileds">
      <!-- 用户表单 -->
      <el-form ref="ruleFormRef"
               :model="addForm"
               :rules="addFormRules"
               label-width="120px"
               status-icon>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisble = false">取 消</el-button>
          <el-button type="primary"
                     @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog v-model="ditDialogVisiBle"
               title="修改用户"
               width="30%"
               @close="ditDialogClosed()">
      <el-form ref="editFormRef"
               :model="editForm"
               :rules="editFormRules"
               label-width="70px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="editForm.username"
                    disabled />
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ditDialogVisiBle = false">取 消</el-button>
          <el-button type="primary"
                     @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog v-model="editRoledialogVisible"
               title="分配角色"
               width="50%"
               @close="setRoledialogClosed">
      <div>
        <p>当前用户:{{userInfo.username}}</p>
        <p>当前角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id" />
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editRoledialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="saveRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regexEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regexEmail.test(value)) {
        // 合法的邮箱
        callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 手机号规则
    const checkMobile = (rule, value, callback) => {
      const regexMobile = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regexMobile.test(value)) {
        // 合法的邮箱
        callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisble: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '用户名必须在3-10个字符之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '密码必须在6-15个字符之间', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }]
      },
      ditDialogVisiBle: false,
      editForm: {},
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }]
      },
      editRoledialogVisible: false,
      // 分配角色的用户信息
      userInfo: {},
      rolesList: [],
      // 选中的角色id值
      selectedRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put('users/' + userInfo.id + '/state/' + userInfo.mg_state)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      return this.$message.success('修改用户状态成功')
    },
    resetFormFileds () {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮 添加新用户
    addUser () {
      this.$refs.ruleFormRef.validate(async isValid => {
        if (!isValid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisble = false
        this.getUserList()
      })
    },
    // 展示编辑对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      this.ditDialogVisiBle = true
    },
    // 监听修改用户对话框 关闭 情况校验结果
    ditDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户
    editUserInfo () {
      this.$refs.editFormRef.validate(async isValid => {
        if (!isValid) {
          return
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.ditDialogVisiBle = false
        // 刷新数据
        this.getUserList()
        // 提示用户更新数据成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 删除用户
    async removeUserById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id, { id: id })
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.getUserList()
      this.$message.success('删除用户成功')
    },
    // 修改角色
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 展示对话框之前 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
      this.editRoledialogVisible = true
    },
    // 保存角色
    async saveRole () {
      const { data: res } = await this.$http.put('users/' + this.userInfo.id + '/role', { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('保存用户角色失败')
      }
      this.getUserList()
      this.editRoledialogVisible = false
      this.$message.success('保存用户角色成功')
    },
    // 关闭角色分配对话框
    setRoledialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>
