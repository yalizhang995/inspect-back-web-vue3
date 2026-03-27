<template>
    <div class="app-container" id="OnClick">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="API接口请求参数列表"
            :visible.sync="open"
            width="800px"
            class="dialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="cancel"
        >
            <div class="box">
                <!-- 是否启用模拟点击事件
                <el-switch v-model="form.task.onClick" active-color="#13ce66" inactive-color="#ff4949" style="marginLeft:30px"> </el-switch> -->
                <div class="collapse">
                    <div class="div">
                        <div v-for="(item,index) in ApiInfoListListDate" :key="index" style="width:100%;position: relative;margin:15px 60px 0 0;">
                            <el-input placeholder="请输入API名称" v-model="item.apiName" clearable style="width:95%"></el-input>
                            <el-input placeholder="请输入API地址" v-model="item.apiUrl" clearable style="width:95%;marginTop:15px"></el-input>
                            <el-input placeholder="请输入拼装地址前缀" v-model="item.apiSplicing" clearable style="width:95%;marginTop:15px"></el-input>
                            <ul class="pfBox">
                                <li><span style="min-width:44px;marginLeft:0">当前页</span><el-input-number v-model="item.pageCurrent" @change="handleChange" :min="0" :max="1000" label="描述文字" style="width:80%"></el-input-number></li>
                                <li><span style="min-width:60px">每页数量</span><el-input-number v-model="item.pageSize" @change="handleChange" :min="1" :max="1000" label="描述文字" style="width:80%"></el-input-number></li>
                                <li><span style="min-width:44px">总页数</span><el-input-number v-model="item.pageTotal" @change="handleChange" :min="1" :max="1000" label="描述文字" style="width:80%"></el-input-number></li>
                            </ul>
                            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入请求脚本" v-model="item.groovy" style="width:95%;marginTop:5px">></el-input>
                            <i class="el-icon-remove-outline removeBtn" v-show="ApiInfoListListDate.length!=1" @click="removeApiInfoListList(index)"></i>
                            <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == ApiInfoListListDate.length - 1" @click="addApiInfoListList(index)"></i>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    editCustomRules
} from "@/api/biz/column";
import { siteInfoExist } from "@/api/biz/inspChannel";
import global_ from "@/utils/Global";

export default {
    name: "Column",
    props: {
        getApiInfoList: Boolean,
        getApiInfoListIdStr: String,
        getApiInfoListDate: Array
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getApiInfoList(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['ApiInfoList'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                // task: {
                //     apiInfoList: []
                // },
                apiInfoList: [],
                customRuleType: 105
            },
            // 底部集合数组
            ApiInfoListListDate: [ { apiName:'', apiUrl: '', apiSplicing: '', pageCurrent: 1, pageSize: 5, pageTotal: 1, groovy: '' } ],

            options: [
                { label: 'ID', value: 'ID' },
                { label: 'CLASS_NAME', value: 'CLASS_NAME' },
                { label: 'NAME', value: 'NAME' },
                { label: 'TAG_NAME', value: 'TAG_NAME' },
                { label: 'LINK_TEXT', value: 'LINK_TEXT' },
                { label: 'PARTIAL_LINK_TEXT', value: 'PARTIAL_LINK_TEXT' },
                { label: 'CSS_SELECTOR', value: 'CSS_SELECTOR' },
                { label: 'XPATH', value: 'XPATH' },
            ]

        };
    },
    created() {
        this.activeNames = ['ApiInfoList'];
        console.log(this.getApiInfoListDate,'this.getApiInfoListDate')
        this.open = this.getApiInfoList;
        this.form.id = this.getApiInfoListIdStr;
        this.form.apiInfoList = this.getApiInfoListDate;
        // console.log(this.form.task,'this.form.task')
        // 点击事件规则
        this.ApiInfoListListDate = [];
        if(this.form.apiInfoList.length == 0){
            this.ApiInfoListListDate = [ { apiName:'', apiUrl: '', apiSplicing: '', pageCurrent: 1, pageSize: 5, pageTotal: 1, groovy: '' } ];
        }else{
            this.ApiInfoListListDate = this.form.apiInfoList.map(obj => ({
                ...obj,
                pageCurrent: Number(obj.pageCurrent), // 或 +obj.a
                pageSize: Number(obj.pageSize),  // 或 +obj.b
                pageTotal: Number(obj.pageTotal)  // 或 +obj.b
            }));
            // this.ApiInfoListListDate = this.form.apiInfoList;
            // this.activeNames.push('catalog')
        }
    },
    methods: {
        handleChange(val) {
            console.log(val);
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.$emit("openS", false);
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                ApiInfoList: [],
                customRuleType: 105
            };
        },
        /**点击事件规则 */
        //添加参数
        addApiInfoListList () {
            this.ApiInfoListListDate.push({ apiName:'', apiUrl: '', apiSplicing: '', pageCurrent: 1, pageSize: 5, pageTotal: 1, groovy: '' });
        },
        //删除参数
        removeApiInfoListList (index) {
            this.ApiInfoListListDate.splice(index, 1);
        },

        /** 提交按钮 */
        submitForm() {
            // 点击事件规则
            this.form.apiInfoList = [];
            let homeArr = [];
            this.form.apiInfoList = this.ApiInfoListListDate.map(obj => ({
                ...obj,
                pageCurrent: obj.pageCurrent.toString(),
                pageSize: obj.pageSize.toString(),
                pageTotal: obj.pageTotal.toString()
            }));
            console.log(this.ApiInfoListListDate,'ApiInfoListListDate')
            // for(var i in this.ApiInfoListListDate){
            //     homeArr.push({key:this.ApiInfoListListDate[i].key,value:this.ApiInfoListListDate[i].value})
            // }
            // this.form.task.apiInfoList = homeArr.reduce((accumulator, currentItem) => {
            //     accumulator[currentItem.key] = currentItem.value;
            //     return accumulator;
            // }, {});

            editCustomRules(this.form).then(response => {
                this.$modal.msgSuccess("编辑成功");
                this.open = false;
                this.$emit("openS", false);
                this.reset();
            });
            console.log(this.form,'this.form')
        }
    }
};
</script>
<style lang="scss">
    .el-collapse {
        border: none;
    }
 
    .el-collapse-item__header {
        border: none;
    }
 
// .el-collapse-item__wrap {
//   border: none;
// }
</style>
<style scoped lang="scss">
// .box {
//     width: 100%;
//     display: flex;
//     flex-wrap: wrap;
// }
.marginClass {
    margin-left: 1%;
}
.removeBtn{
    // position: absolute;
    // right: 55px;
    // bottom: 5px;
    color: #f44336;
    font-size: 24px;
    margin-left: 10px;
    margin-top: 10px;
    position: absolute;
    bottom: 0;
}
.removeBtn2{
    // position: absolute;
    // right: 55px;
    // bottom: 5px;
    color: #f44336;
    font-size: 24px;
    margin-left: 40px;
    margin-top: 10px;
    position: absolute;
    bottom: 0;
}
.dialog{
    height: 700px;
    // max-height: 800px;
    // display: flex;
}
.box{
    height: 520px;
    display: flex;
    flex-direction: column;
    // overflow: hidden;
    margin-top: -10px;

}
.collapse{
    flex: 1;
    overflow: auto;
}
.collapse::-webkit-scrollbar {
  width: 0;
}
.dialog-footer{
    height: 50px;
    margin-top: 30px;
    text-align: right;
}
.div{
    display: flex;
    flex-wrap: wrap;
    margin-top: -10px;
    margin-left: 20px;
}
.pfBox{
    width: 95%;
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-left: 0;
    padding-left: 0;
    li{
        display: flex;
        align-items: center;
        margin-left: 0;
        list-style: none;
        // margin-right: 15px;
        // width: 33%;
        span{
            display: block;
            margin-right: 5px;
            margin-left: 20px;
            // width: 70px;
        }
    }
}
</style>