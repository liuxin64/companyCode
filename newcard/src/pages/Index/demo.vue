<template>
    <div class="demo">
        <!-- 左边组件 -->
        <div class="left">
            <div class="top">组件</div>
            <div class="shopList">
            <!-- :w 默认宽度
            :h 默认高度
            :x="50" 默认水平坐标 注意相对元素是谁
            :y="50" 默认垂直最表 注意相对元素是谁
            :min-width="50" 最小宽度
            :min-height="50" 最小高度
            :parent="true" 限制不能拖出父元素
            parent=".p-event" 限制不能拖出class为p-event的元素
            :grid 水平和垂直移动 每次分别能够走多少像素
            class-name 自定义组件class 下面定义一个dragging1
            @dragstop="onDragstop" 每当组件停止拖动时调用。
            @resizestop="onResizstop" 每当组件停止调整大小时调用
            @deactivated="onDeactivated" 每当用户单击组件外的任何位置时调用
            @activated="onActivated" 单击组件时调用，以显示句柄。备注：句柄就是点击组件后上下左右的可以拉伸的方块点-->
                <div class="elementList" v-for="(i,k) in elementList" :key="k">
                    <vue-draggable-resizable
                    v-for="(item) in i.controlsArr"
                    :key="item.customId"
                    :custom-id="item.customId"
                    :x="item.x"
                    :y="item.y"
                    :h="100"
                    :w="100" 
                    :min-height="20"
                    :min-width="20"                
                    @activated="onActivated"
                    class="draggable"
                    ref="shopList"
                    >
                    {{ i.name }}
                    <!-- <draggable ref="shopList">
                    </draggable> -->
                    </vue-draggable-resizable>  
                </div>
            </div>
            
        </div>
        
        <!-- 中间展示区 -->
        <div class="center">
            <div class="top">中间展示区</div>
        </div>

        <!-- 右边编辑 -->
        <div class="right">
            <div class="top">右边编辑区</div>
            <!-- 字体大小 -->
            <div class="font-size content">
                <button @click="getFontSize(-1)">-</button>
                <span class="fontSize" ref="fontSize">字体大小</span>
                <button @click="getFontSize(1)">+</button>
            </div>
            <!-- 内容编辑 -->
            <el-button type="text" @click="dialog = true" class="content">内容编辑</el-button>
                <el-drawer
                    :before-close="handleClose"
                    :visible.sync="dialog"
                    direction="rtl"
                    custom-class="demo-drawer"
                    ref="drawer"
                    size="30%"
                    >
                    <div class="demo-drawer__content">
                        <el-form :model="form">
                        <el-form-item label="商品名称：" :label-width="formLabelWidth">
                            <el-input v-model="form.commodityName" autocomplete="off" class="inp" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="商品内容:" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off" class="inp"  clearable></el-input>
                        </el-form-item>
                        </el-form>
                        <div class="demo-drawer__footer">
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                        </div>
                    </div>
                </el-drawer>
            <!-- 背景颜色 -->
            <div class="background-color content">
                <div>背景颜色</div>
                <button v-for="(item) in backgroundColorArr" 
                :key="item.id" class="btnBgd" 
                :style="{'backgroundColor':item.name}"
                @click="getBackgroundColor(item.name)"></button>
            </div>
        </div>
    </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
// import draggable from '../../components/draggable';
    export default {
        // components: { VueDraggableResizable,draggable },
        components: { VueDraggableResizable},
        data() {
            return {
                dialog: false,
                loading: false,
                fontSize:16, //商品的字体大小
                commodityBackground:'#ccc' , //商品的背景颜色，默认为灰色
                // controlsArr:[{customId:1,name:'商品00',x:110,y:50,h:200,w:200},{customId:2,name:'商品00',x:110,y:50,h:200,w:200}],
                form: {
                    name: '',//商品内容
                    commodityName:'',//商品名称
                },
                formLabelWidth: '90px',
                timer: null,
                // 背景颜色表：
                backgroundColorArr:[{name:'#409EFF',id:1},{name:'#67C23A',id:2},{name:'#E6A23C',id:3},{name:'#F56C6C',id:4},{name:'#909399',id:5},{name:'#eee',id:6}],
                // 组件列表
                // :x="50" 默认水平坐标 注意相对元素是谁
                // :y="50" 默认垂直最表 注意相对元素是谁
                elementList:
                [{id:1,name:'优惠券',EnglishName:'discounts',controlsArr:[{customId:1,name:'商品00',x:-670,y:0},{customId:2,name:'商品00',x:-670,y:0}]},
                {id:2,name:'地址',EnglishName:'site',controlsArr:[{customId:1,name:'商品11',x:-440,y:0},{customId:2,name:'商品11',x:-440,y:0}]},
                {id:3,name:'电话',EnglishName:'phone',controlsArr:[{customId:1,name:'商品22',x:-670,y:100},{customId:2,name:'商品11',x:-670,y:100}]},
                {id:4,name:'新闻资讯',EnglishName:'news-information',controlsArr:[{customId:1,name:'商品33',x:-440,y:100},{customId:2,name:'商品11',x:-440,y:100}]},
                {id:5,name:'图片',EnglishName:'picture',controlsArr:[{customId:1,name:'商品44',x:-670,y:200},{customId:2,name:'商品11',x:-670,y:200}]},
                {id:6,name:'富文本',EnglishName:'rich-text',controlsArr:[{customId:1,name:'商品55',x:-440,y:200},{customId:2,name:'商品11',x:-440,y:200}]},
                {id:7,name:'视频',EnglishName:'video',controlsArr:[{customId:1,name:'商品66',x:-670,y:300},{customId:2,name:'商品11',x:-670,y:300}]},
                {id:8,name:'文本',EnglishName:'text',controlsArr:[{customId:1,name:'商品77',x:-440,y:300},{customId:2,name:'商品11',x:-440,y:300}]},
                {id:9,name:'辅助线',EnglishName:'subline',controlsArr:[{customId:1,name:'商品88',x:-670,y:400},{customId:2,name:'商品11',x:-670,y:400}]},
                {id:10,name:'图文广告',EnglishName:'image-text-advertising',controlsArr:[{customId:1,name:'商品33',x:-440,y:400},{customId:2,name:'商品11',x:-440,y:400}]},
                {id:11,name:'营销活动',EnglishName:'marketing-campaign',controlsArr:[{customId:1,name:'商品88',x:-670,y:500},{customId:2,name:'商品11',x:-670,y:500}]},
                {id:12,name:'标签商品',EnglishName:'label-commodity',controlsArr:[{customId:1,name:'商品33',x:-440,y:500},{customId:2,name:'商品11',x:-440,y:500}]},
                {id:13,name:'标题',EnglishName:'title',controlsArr:[{customId:1,name:'商品88',x:-670,y:600},{customId:2,name:'商品11',x:-670,y:600}]},
                {id:14,name:'图文导航',EnglishName:'image-text-label',controlsArr:[{customId:1,name:'商品33',x:-440,y:600},{customId:2,name:'商品11',x:-440,y:600}]},
                {id:15,name:'空白辅助',EnglishName:'blank-assist',controlsArr:[{customId:1,name:'商品88',x:-670,y:700},{customId:2,name:'商品11',x:-670,y:700}]},
                {id:16,name:'商品',EnglishName:'commodity',controlsArr:[{customId:1,name:'商品33',x:-440,y:700},{customId:2,name:'商品11',x:-440,y:700}]},
                ]
            };
        },
        methods: {
            // 点击控件
            onActivated(customId) {
                // console.log(customId);
                this.activedId = customId;
                console.log(this.$refs.shopList,customId);
                // this.form.commodityName = this.$refs.shopList[1].$data.shopsListArr[0].name  //将商品名称赋值在商品名称上
            },
            // 改变商品字体大小
            getFontSize(i){
                // this.$refs.fontSize.style.fontSize = this.fontSize+ i + "px"
                // this.$refs.shopList[1]._vnode.elm.style.fontSize = this.fontSize+ i + "px"
                // this.fontSize = this.fontSize + i
                // console.log(this.$refs.shopList[0]._vnode.elm.style);
                // console.log(this.$refs.shopList[0]._vnode.elm.firstElementChild);
                // console.log(this.$refs.shopList[0].$data.shopsListArr[0].name)
                // console.log(this.$refs.shopList[0].$data.shopsListArr[0].text) 
                console.log(this.fontSize,i);             
            },
            // 点击编辑内容
             handleClose(done) {
                if (this.loading) {
                    return;
                }
                this.$confirm('确定要提交表单吗？')
                    .then( () => {
                        // this.$refs.shopList[1].$data.shopsListArr[0].name = this.form.commodityName
                        // this.$refs.shopList[1].$data.shopsListArr[0].text = this.form.name
                        this.loading = true;
                        this.timer = setTimeout(() => {
                            done();
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                            this.loading = false;
                            }, 200);
                        }, 500);
                    })
                    .catch( () => {});
                },
                cancelForm() {
                this.loading = false;
                this.dialog = false;
                clearTimeout(this.timer);
            },
            // 点击改变背景颜色
            getBackgroundColor(i){
                // console.log(this.$refs.shopList[0]._vnode.elm.style.backgroundColor);     
                console.log(i)
                // this.$refs.shopList[1]._vnode.elm.style.backgroundColor = i
            }
        }
    }
</script>

<style lang="less" scoped>
.demo{
    display: flex;
    height: 100%;
    // 左边工作区
    .left{
        background-color: #cccc;
        width: 25%;
        text-align: center;
        .shopList{
            position: absolute;
            background: #eee;
            width: 25%;
            height: 80%;
            top: 10%;
            left: 39%;
            .draggable{                
                text-align: center;
                line-height: 100px;
                background: rgb(143, 38, 38);
            }
        }
    }
    // 中间展示区
    .center{
        background-color: aliceblue;
        flex: 1;
        text-align: center;
    }
    // 右边编辑区
    .right{
        background-color: aqua;
        width: 20%;
        height: 100%;
        text-align: center;
        .fontSize{
            font-size: 16px;
        };
        .content{
            width: 50%;
            height: 50px;
            background-color: #cccc;
            border-radius: 10px;
            margin: 10px auto;
            font-size: 16px;
            text-align: center;
        }
        .font-size{
            padding-top: 20px;
        }
        .background-color{
            width: 100%;
            height: 100px;
            background-color: #cccc;
            border-radius: 10px;
            .btnBgd{
            width: 20px;
            height: 20px;
            border: none;
            margin: 10px;
            }
        }
    }
    .top{
        font-size: 30px;
        color: rgb(90, 136, 235);
    }
    .inp{
        width: 70%;
    }
}
</style>