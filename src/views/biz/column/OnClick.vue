<template>
    <div class="app-container" id="OnClick">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="点击事件"
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
                    <el-collapse @change="handleChange" v-model="activeNames"  style="margin: 0 30px;" >
                        <el-collapse-item title="是否启用模拟点击事件" name="onClick">
                            <div class="div" style="marginTop:10px">
                                <el-switch v-model="form.task.onClick" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                            </div>
                        </el-collapse-item>
                        <!-- 点击事件规则 -->
                        <el-collapse-item title="点击事件规则" name="onClickMap">
                            <div class="div">
                                <div v-for="(item,index) in onClickListDate" :key="index" style="width:90%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入点击事件规则" v-model="item.key" clearable style="width:60%"></el-input>
                                    <el-select v-model="item.value" clearable placeholder="请选择" style="marginLeft:10px">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <i class="el-icon-remove-outline removeBtn" v-show="onClickListDate.length!=1" @click="removeOnClickList(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == onClickListDate.length - 1" @click="addOnClickList(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
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
        getOnClick: Boolean,
        getOnClickIdStr: String,
        getOnClickDate: Object
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getOnClick(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['onClick','onClickMap'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    onClick: false,
                    onClickMap: {}
                },
                customRuleType: 3
            },
            // 底部集合数组
            onClickListDate: [ { value:'', key: '' } ],
            arr: [ { value:'123', key: 'ID' },{ value:'456', key: 'NAME' }, ],
            obj: [{'123':'ID'},{'456':'NAME'}],

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
        this.activeNames = ['onClick','onClickMap'];
        console.log(this.getOnClickDate,'this.getOnClickDate')
        this.open = this.getOnClick;
        this.form.id = this.getOnClickIdStr;
        this.form.task = this.getOnClickDate;
        // console.log(this.form.task,'this.form.task')
        // 点击事件规则
        this.onClickListDate = [];
        // if(this.form.task.onClickMap.length == 0){
        //     this.onClickListDate = [ { value:'', key: '' } ];
        // }else{
        //     for(var i in this.form.task.onClickMap){
        //         this.onClickListDate.push({value:this.form.task.onClickMap[i]})
        //     }
        // }
        if(Object.keys(this.form.task.onClickMap) == 0){
            this.onClickListDate = [ { value:'', key: '' } ];
        }else{
            for(var i in this.form.task.onClickMap){
                this.onClickListDate.push({
                    key: i,
                    value: this.form.task.onClickMap[i],
                })
            }
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
                task: {
                    onClick: false,
                    onClickMap: {}
                },
                customRuleType: 3
            };
        },
        /**点击事件规则 */
        //添加参数
        addOnClickList () {
            this.onClickListDate.push({'value': ''});
        },
        //删除参数
        removeOnClickList (index) {
            this.onClickListDate.splice(index, 1);
        },

        /** 提交按钮 */
        submitForm() {
            // 点击事件规则
            this.form.task.onClickMap = {};
            let homeArr = [];
            // for(var i in this.onClickListDate){
            //     // if(this.onClickListDate[i].value){
            //         // this.form.task.onClickList.push(this.onClickListDate[i].value)
            //     // }
                
            // }
            for(var i in this.onClickListDate){
                homeArr.push({key:this.onClickListDate[i].key,value:this.onClickListDate[i].value})
            }
            this.form.task.onClickMap = homeArr.reduce((accumulator, currentItem) => {
                accumulator[currentItem.key] = currentItem.value;
                return accumulator;
            }, {});

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
    top: -3px;
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
    top: -3px;
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
</style>