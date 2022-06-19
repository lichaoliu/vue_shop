<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList"
                :stripe="true"
                :border="true">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom','vcenter',idx1 === 0?'bdtop':'']"
                    v-for="(item1,idx1) in scope.row.children"
                    :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <el-icon>
                  <CaretRight />
                </el-icon>
              </el-col>
              <el-col :span="19">
                <el-row :class="['vcenter',idx2 !== 0?'bdtop':'']"
                        v-for="(item2,idx2) in item1.children"
                        :key="item2.id">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <el-icon>
                      <CaretRight />
                    </el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-row v-for="(item3) in item2.children"
                            :key="item3.id">
                      <el-tag type="warning"
                              closable
                              @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <template v-slot="scope">
            <el-button size="small"
                       type="primary"
                       icon="Edit">编辑</el-button>
            <el-button size="small"
                       type="danger"
                       icon="Delete">删除</el-button>
            <el-button size="small"
                       type="warning"
                       icon="Setting"
                       @click="showSetRightDialog(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog v-model="setRightDialogVisible"
               title="分配权限"
               width="30%"
               @close="SetRightDialogClosed">
      <el-tree :data="rightList"
               :props="rightProps"
               :show-checkbox="true"
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      // 所有权限的数据
      rightList: [],
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认展开的节点的 key 的数组
      defKeys: [],
      // 保存权限用的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(res)
    },
    // 删除用户权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将删除用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
      if (res.meta.status !== 200) {
        return this.$message.error('权限删除失败')
      }
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据保存到data中
      this.rightList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.roleId = role.id
      this.setRightDialogVisible = true
    },
    // 通过递归形式获取角色下所有三级权限
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭对话框 清空选中数组
    SetRightDialogClosed () {
      this.defKeys = []
    },
    // 添加角色权限
    async allotRights () {
      // 所有选中的节点id
      const ckeckedKeys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()]
      const rids = ckeckedKeys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: rids })
      if (res.meta.status !== 200) {
        return this.$message.error('授权失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
