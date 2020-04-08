<template>
  <div class="home_container">
    <div class="header">
      <span style="color:#fff;">学习通</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar
            size="small"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <span style="margin-left:6px;">{{profileInfo.name}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-caret-right" @click.native="selectSub">选择课程</el-dropdown-item>
          <el-dropdown-item icon="el-icon-s-promotion" @click.native="logOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <router-view class="main_container"></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["profileInfo"])
  },
  methods: {
    logOut() {
      this.$store.commit("clearInfo");
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    selectSub() {
      this.$router.push("/home/selectsub");
    }
  }
};
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 44px;
    background-color: #636363;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }
  .main_container {
    flex: 1;
    overflow: auto;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #ccc;
  display: flex;
  align-items: center;
}
.el-icon-arrow-down {
  font-size: 16px;
}
</style>