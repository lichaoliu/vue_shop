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
          <el-input placeholder="请输入内容">
            <template #append>
              <el-button icon="Search" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList"
                stripe
                border>
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
            <el-switch v-model="scope.row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="200px">
          <!-- <template v-slot="scope"> -->
          <el-button type="primary"
                     icon="Edit" />
          <el-button type="danger"
                     icon="Delete" />
          <el-tooltip content="修改角色"
                      placement="top"
                      :enterable="false">
            <el-button type="warning"
                       icon="Setting" />
          </el-tooltip>
          <!-- </template> -->
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
