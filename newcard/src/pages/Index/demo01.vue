<template>
    <div class="demo01">
        <!-- 组件 -->
        <div class="left">
            <div class="top">组件</div>
            <div class="text-wrapper">
                <draggable
                class="dragArea list-group  element"
                :list="list1"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :clone="cloneShow"
                @change="log"
                >
                <div class="list-group-item item" v-for="item in list1" :key="item.id">
                    {{ item.name }}
                </div>
                </draggable>
            </div>
            
        </div>
        <!-- 中间展示区 -->
        <div class="center">
            <div class="top">中间展示区</div>
            <div class="showElement">
                <!-- 顶部标题和设置 -->
                <div class="showElementTop">
                    <div class="title">仙剑</div>
                    <div class="set" @click="setShowElementTop"></div>
                </div>
                <!-- 中间 -->
                <div class="showElementCenter">
                    <draggable
                    class="dragArea list-group"
                    :list="list2"
                    group="people"
                    @change="log"
                    style="min-height:375px;"
                    >
                    <div class="list-group-item item" v-for="i in list2" :key="i.id">
                        <div class="items">
                            {{ i.name }}
                        </div>
                        <div class="del"></div>
                    </div>
                    </draggable>
                </div>
                
            </div>
            
        </div>

        <!-- 右边编辑 -->
        <div class="right">
            <div class="top">右边编辑区</div>
            <!-- 字体大小 -->
            <div class="font-size ">
                <button @click="getFontSize(-1)">-</button>
                <span class="fontSize" ref="fontSize">字体大小</span>
                <button @click="getFontSize(1)">+</button>
            </div>
            <!-- 内容编辑 -->
            <div class="set-text">

            </div>
            <!-- 背景颜色 -->
            <div class="background-color">
            </div>
        </div>
    </div>
  
</template>

<script>
import draggable from "vuedraggable";
// let idGlobal = 8;
export default {
  order: 3,
  components: {
    draggable
  },
  data() {
    return {
      list1: [
        { name: "优惠券", id: 1 },
        { name: "地址", id: 2 },
        { name: "电话", id: 3 },
        { name: "新闻资讯", id: 4 },
        { name: "图片", id: 5 },
        { name: "富文本", id: 6 },
        { name: "视频", id: 7 },
        { name: "文本", id: 8 },
        { name: "辅助线", id: 9 },
        { name: "图文广告", id: 10 },
        { name: "营销活动", id: 11 },
        { name: "标签商品", id: 12 },
        { name: "标题", id: 13 },
        { name: "图文导航", id: 14 },
        { name: "空白辅助", id: 15 },
        { name: "商品", id: 16 },
      ],
      list2: []
    };
  },
  methods: {
    log: function(evt) {
      window.console.log(evt);
    },
    cloneShow({ name }){
        // console.log(name)
        return{
            name: `${ name }`
        }
    },
    // 点击顶部设置
    setShowElementTop(){
        console.log(111)
    }
  }
};
</script>
<style scoped lang="less">
    .demo01{
        display: flex;
        height: 100%;
        text-align: center;
        .top{
            font-size: 30px;
            color: rgb(90, 136, 235);
        }
        .left{
            width: 30%;
            height: 100%;
            overflow: auto;
            background-color: #ccc;
            .text-wrapper{
                padding-top:20px;
                .element{
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: space-around;
                    .item{
                        cursor: pointer;
                        width: 40%;
                        height: 60px;
                        line-height: 60px;
                        border: 1px dashed #eee;
                        overflow: hidden;
                    }
                    
                }
            }
        }
        .center{
            flex: 1;
            height: 100%;
            background-color: #eee;
            .showElement{
                width: 60%;
                height: 70%;
                margin: 0 auto;
                border: 1px solid #fff;
                overflow: auto;
                .showElementTop{
                    display: flex;
                    justify-content: flex-end;
                    border: 1px solid #fff;
                    height: 5%;
                    padding: 1% 4% 1%;
                    .title{
                        flex: 1;
                        padding-left: 18%;
                        margin-top: 1.5%;
                    }
                    .set{
                        width: 20%;
                        height: 100%;
                        background: url('../../assets/imgs/setdraggable.png')  no-repeat;
                        background-size: 100%;
                        margin-top: 0 auto;
                    }
                }
                .showElementCenter{
                    .item{
                        cursor: pointer;
                        width: 99%;
                        display: flex;
                        height: 60px;
                        line-height: 60px;
                        // border: 1px dashed #eee;
                        // border: 1px solid rgb(90, 136, 235);
                        background-color: #fff;
                        // overflow: hidden;
                        justify-content: flex-end;
                        .items{
                            width: 90%;
                        }
                        .del{
                            width: 10%;
                            height: 55%;
                            background: url('../../assets/imgs/del.png')  no-repeat;
                            background-size: 100%;
                        }
                    }
                    .item:hover{
                        border: 1px dashed rgb(90, 136, 235);
                    }
                    
                }
            }
        }
        .right{
            width: 30%;
        }
    }
</style>