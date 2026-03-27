<template>
    <el-dialog 
        title="" 
        :visible.sync="open"  
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="cancel">
            <div class="imgBox" :style="imageStyle" @wheel="handleWheel">
                <img :src="imgSrc" alt="" ref="imageElement"  @load="onImageLoad"  >
                <span class="k" v-for="(item,index) in bjkList" :key="index" :style="{width: item.width,height: item.height, top: item.top, left: item.left}"></span>
            </div>
    </el-dialog>
</template>

<script>
import { getCodeImg, register } from "@/api/login";

export default {
    name: "Register",
    props: {
        getImgOpen: Boolean,
        getImgIdObj: String,
    },
    computed: {
        // 计算属性，用于动态生成图片的样式
        imageStyle() {
            return {
                transform: `scale(${this.scale})`,
            };
        },
    },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            obj: null,
            imgSrc: null,
            naturalWidth: 0,
            naturalHeight: 0,
            displayWidth: 0,
            displayHeight: 0,
            bjkList: [],

            scale: 1
        }
    },
    created() {
        this.open = this.getImgOpen;
        this.obj = JSON.parse(this.getImgIdObj);
        this.imgSrc = this.obj.fileObsPath;
    },
    methods: {
        zoomIn(){
            if (this.scale < 3) { // 设置最大放大倍数
                this.scale += 0.1;
            }
        },
        // 缩小
        zoomOut() {
            if (this.scale > 0.5) { // 设置最小缩小倍数
                this.scale -= 0.1;
            }
        },
        // 处理鼠标滚轮事件
        handleWheel(event) {
            // 阻止页面默认的滚动行为
            event.preventDefault();
            // deltaY > 0 表示向下滚动（缩小），< 0 表示向上滚动（放大）
            if (event.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.$emit("ImgOpenS", false);
        },
        onImageLoad() {
            const img = this.$refs.imageElement;
            console.log(img,'123')
            
            // 获取图片原始尺寸
            this.naturalWidth = img.naturalWidth
            this.naturalHeight = img.naturalHeight
            
            // 获取图片显示尺寸
            this.displayWidth = img.offsetWidth
            this.displayHeight = img.offsetHeight
            
            console.log('原始尺寸:', this.naturalWidth, this.naturalHeight)
            console.log('显示尺寸:', this.displayWidth, this.displayHeight)
            if(this.obj.faceLocations){
                this.bjk();
            }
        },
        bjk(){
            for(var i in this.obj.faceLocations){
                this.bjkList.push({
                    width: this.obj.faceLocations[i].w/this.naturalWidth*this.displayWidth+'px',
                    height: this.obj.faceLocations[i].h/this.naturalHeight*this.displayHeight+'px',
                    top: this.obj.faceLocations[i].y/this.naturalWidth*this.displayWidth+'px',
                    left: this.obj.faceLocations[i].x/this.naturalHeight*this.displayHeight+'px',
                })
            }
        },
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.imgBox{
    // width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden; /* 防止图片放大后超出容器 */
}
.k{
    display: inline-block;
    position: absolute;
    border: 2px solid red;
    // width: 100px;
    // height: 80px;
    // top: 100px;
    // left: 50px;
}

/* 关键：让图片缩放以中心为原点，并添加过渡效果 */
img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例 */
  transform-origin: center center; /* 设置缩放中心点 */
  transition: transform .2s ease-in-out; /* 添加平滑的过渡效果 */
}
</style>
<style scoped>
    /deep/.el-dialog{
        /* width: 70vw!important;; */
        max-height: 70vh!important;
    }
    /deep/ .el-dialog__body {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px!important;
        /* width: auto !important; */
    }
</style>
