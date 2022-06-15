<template>
  <div>
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- <el-input placeholder="Please input">
        <template #prepend>

        </template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input> -->
      <el-input v-model="input1"
                class="w-50 m-2"
                size="large"
                placeholder="Please Input"
                :suffix-icon="Search" />
      <el-input v-model="input2"
                class="w-50 m-2"
                placeholder="Please Input"
                :suffix-icon="Search" />
    </el-card>
  </div>
</template>
<script>
</script>
<style lang="less" scoped>
</style>
