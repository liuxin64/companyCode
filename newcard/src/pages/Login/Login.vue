<template>
    <div class="login">    
        <div class="input">
            <el-input
            placeholder="请输入账号"
            v-model="userName"
            clearable
            class="username">
            </el-input>
            <el-input placeholder="请输入密码" v-model="pwd" show-password></el-input>
            <div class="btn">
              <el-button type="primary" @click="goToIndex">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      pwd: ""
    };
  },
  methods: {
    goToIndex() {
      this.$router.history.push("/index");
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 63%;
  text-align: center;
  padding-top: 18%;
  background: url('../../assets/imgs/login.png') no-repeat;
  background-size: 100%;
  .input {
    width: 300px;
    padding: 50px 50px 40px;
    margin: 0 auto;
    border: 1px solid #999;
    margin-right: 15%;
    .username {
      margin-bottom: 20px;
    }
    .btn{
        margin-top: 20px;
        button{
        width: 100%;
      }
    }
  }
}
</style>