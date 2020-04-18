<template>
    <div>
        地图实验室
        <!-- 父组件345:<span>{{ msg }}</span> 
        <Child @getData="getData" /> -->
        <!-- 子组件的值：-->
        <div
            id="allmap"
            ref="allmap">
        </div>
    </div>
</template>

<script>
// import Child from './demo03'
// import BMap from 'BMap'
    export default {
        components:{
            // Child,
        },
        data(){
            return{
                // msg:"父组件的默认值"
            }
        },
        methods: {
        map () {
        let map = new window.BMap.Map(this.$refs.allmap) // 创建Map实例
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11) // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new window.BMap.MapTypeControl({ // 添加地图类型控件
            mapTypes: [
            window.BMAP_NORMAL_MAP,
            window.BMAP_HYBRID_MAP
            ]
        }))
        map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true)// 开启鼠标滚轮缩放
        }
    },
    mounted () {
        this.map()
    }

}
</script>

<style lang="less" scoped>
#allmap {
    width: 300px;
  height: 500px;
  overflow: hidden;
}
</style>