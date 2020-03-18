<template>
    <div class="shopsList">
        <!-- 商品组件 -->
        <div  v-for="obj in shopsListArr" :key="obj.id">
            {{obj.name}}
            <span>{{ obj.text }}</span>
        </div>
        
    </div>
</template>

<script>
    export default {
        data(){
            return{
                shopsListArr:[{id:1,name:'商品1',text:'绝对正品物有所值1'},{id:2,name:'商品2',text:'绝对正品物有所值2'},{id:3,name:'商品3',text:'绝对正品物有所值3'}],
            }
        },
        methods:{
            fn(){
                console.log('11111')
            }
        }
    }
</script>

<style lang="less" scoped>
.shopsList{
    width: 180px;
    height: 160px;
    background-color: rgb(184, 166, 166);
    color: #ffff;
}
</style>