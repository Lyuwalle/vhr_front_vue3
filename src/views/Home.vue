<template>
  <div>
<!--布局容器-->
    <el-container >
      <el-header class="homeHeader">

        <div class="title" >
          <a style="text-decoration-line: none; color: #9a6759">Homebrew Management System</a>
        </div>
        <div>
          <el-dropdown class="userInfo" @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.name}}<i><img :src="user.userface" alt=""></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
<!--          菜单 -->
<!--          @select="handleSelect"表示点击菜单会跳转到哪一个页面，@select="handleSelect"可以用router代替，下面的method也不用写了-->
<!--          是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
          <el-menu @select="handleSelect">
<!--            在vue.js 2.x版本里面v-for可以和v-if一起使用-->
<!--            item.hidden没法获取，原因在于v-for和v-if不能一起使用，v-if的优先级高于v-for-->
<!--            这个routes指的是computed里面的routes-->
            <el-submenu :index="index+''" v-for="(item, index) in routes" v-if="!item.hidden" :key="index">
                <template #title >
                  <i style="color: #180c0c; margin-right: 5px" :class="item.iconCls"></i>
                  <span>{{item.name}}</span>
                </template>
                <!--              index表示点击菜单项要跳转的路径-->
                <el-menu-item :index="child.path" v-for="(child, indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
<!--        容器布局：main-->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

  export default {
    name: "Home",
    data() {
      return {
        user: JSON.parse(window.sessionStorage.getItem("user"))
      }
    },
    computed: {
      routes() {
        return this.$store.state.routes;
      }
    },
    methods: {
      handleSelect(index) {
        this.$router.push(index)
      },
      handleCommand(cmd) {
        if (cmd == 'logout') {
          this.$confirm('此操作将注销登录, 是否继续?', '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
          ).then(() => {
            getRequest('/logout');
            //清除用户信息并回到登录页面
            window.sessionStorage.removeItem("user");
            /*注销之后清除菜单*/
            this.$store.commit('initRoutes', []);
            this.$router.replace('/')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消注销'
            });
          });
        }
      }
    }
  }
</script>

<style>
.homeHeader {
  background-color: #90b7de;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
}
.homeHeader .title {
   font-size: 30px;
   font-family: cursive;
   color: #ffffff
 }
.homeHeader .userInfo {
  /*手指符号*/
  cursor: pointer;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
}
/*用户头像的样式*/
.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}
</style>
