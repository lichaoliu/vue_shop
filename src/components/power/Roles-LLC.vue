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
            <el-row :class="['bdbottom',idx1 === 0?'bdtop':'']"
                    v-for="(item1,idx1) in scope.row.children"
                    :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <el-icon>
                  <CaretRight />
                </el-icon>
              </el-col>
              <el-col :span="19">
                <el-row :class="[idx2 !== 0?'bdtop':'']"
                        v-for="(item2,idx2) in item1.children"
                        :key="item2.id">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <el-icon>
                      <CaretRight />
                    </el-icon>
                  </el-col>
                  <el-col :span="18">
                    <el-row v-for="(item3) in item2.children"
                            :key="item3.id">
                      <el-tag type="warning">{{item3.authName}}</el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> -->
            <!-- {{scope.row}} -->
            <!-- </pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"></el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"></el-table-column>
        <el-table-column label="操作"
                         width="300px">
          <!-- <template v-slot="scope"> -->
          <el-button size="small"
                     type="primary"
                     icon="Edit">编辑</el-button>
          <el-button size="small"
                     type="danger"
                     icon="Delete">删除</el-button>
          <el-button size="small"
                     type="warning"
                     icon="Setting">分配</el-button>
          <!-- </template> -->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: []
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
</style>
