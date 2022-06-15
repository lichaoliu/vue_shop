<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-logo">
        <img src="../assets/logo2.png"
             alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button"
             @click="toggleCollapse">|||</div>
        <el-menu active-text-color="#409EFF"
                 background-color="#333744"
                 text-color="#fff"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router
                 :default-active="activePath">
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id + ''"
                       v-for="item in menuList"
                       :key="item.id">
            <template #title>
              <!-- 图标 -->
              <el-icon :class="iconObj[item.id]">
              </el-icon>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveActivePath('/' + subItem.path)">
              <!-- 图标 -->
              <el-icon>
                <Menu />
              </el-icon>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否展开侧边栏
      isCollapse: false,
      // 被激活的菜单栏
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // 缓存中取出激活地址
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/')
    },
    async getMenuList () {
      const { data: res } = await this.$http('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveActivePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-mai {
  background-color: #eaedf1;
}

.home-container {
  height: 100%;
}

.header-logo img {
  height: 50px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
