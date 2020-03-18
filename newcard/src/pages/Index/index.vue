<template>
    <div class="index">
        <!-- 顶部导航 -->
        <div class="top">
            <div class="left">
                <img src="../../assets/imgs/login.png" alt="">
                <div>个人中心</div>
            </div>
            <div class="center">
                云家居 V
            </div>
            <div class="right">
                <el-button type="primary" @click="goToLogin">退出</el-button>                
            </div>
            
        </div>
        <!-- 中间内容 -->
        <div class="center">
            <el-button @click="goToDemo">拖拽</el-button>
            <el-button @click="goToDemo01">拖拽01</el-button>
        </div>
    </div>
</template>

<script>
    export default {
    data() {
    return {
      
    };
  },
  methods: {
    goToLogin() {
      this.$router.history.push("/");
    },
    goToDemo() {
      this.$router.history.push("/demo");
    },
    goToDemo01() {
      this.$router.history.push("/demo01");
    }
  }
    }
</script>

<style lang="less" scoped>
    .index{
        color: #ccc;
        padding:  10px;
        .top{
            display: flex;
            justify-content: space-between;
            height: 40px;
            margin-top: 20px;
            text-align: center;
            line-height: 35px;
            .left{
                width: 15%;
                display: flex;
                border-radius: 20px;
                // border: 1px solid #DCDFE6;
                background-color: #ccc;
                div{
                    color: #000;
                }
                img{
                    width: 38px;
                    height: 38px;
                    margin-left: 18px;
                    margin-right: 20px;
                }
            }
            .center{
                flex: 1;
                background-color: #eee;
            }
            .right{
                width: 20%;
                background-color: aqua;
                border-radius: 20px;
            }
        }
        .center{
            width: 100%;
        }
    }
</style>