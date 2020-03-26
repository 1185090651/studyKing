<template>
  <div class="index_container">
    <div class="header">
      <div class="sub_name" style="font-size:20px;font-weight:500;">{{activeSubject.sub_name}}</div>
      <div class="nav">
          <routerLink :to="item.path" v-for="item in navItems" :key="item.title" class="nav_item" tag="div">{{item.title}}</routerLink>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  computed: {
    ...mapState(['activeSubject'])
  },
  data() {
    return {
      navItems: [
        {
          title: "首页",
          path: "/home/index/main"
        },
        {
          title: "资料",
          path: "/home/index/material"
        },
        {
          title: "通知",
          path: "/home/index/notification"
        },
        {
          title: "作业",
          path: "/home/index/homework"
        },
        {
          title: "讨论",
          path: "/home/index/discussion"
        },
        {
          title: "管理",
          path: "/home/index/management"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.index_container {
  .header {
    height: 70px;
    padding: 0 160px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    .nav {
        display: flex;
        .nav_item {
            margin-left: 40px;
            cursor: pointer;
            padding: 3px;
        }
        .nav_item:hover {
            background-color: #777;
            border-radius: 2px;
            color: #fff;
        }
        .router-link-active {
            background-color: #777;
            border-radius: 2px;
            color: #fff;
        }
    }
  }
}
</style>