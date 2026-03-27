<template>
    <div class="app-container" id="OnClick">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="正文抽取过滤正则"
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
                        <div v-for="(item,index) in ignoreExtractListDate" :key="index" style="width:90%;position: relative;margin:15px 60px 0 0;">
                            <el-input placeholder="请输入正文抽取过滤正则" v-model="item.value" clearable style="width:60%"></el-input>
                            <el-select v-model="item.key" clearable placeholder="请选择" style="marginLeft:10px">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <i class="el-icon-remove-outline removeBtn" v-show="ignoreExtractListDate.length!=1" @click="removeIgnoreExtractList(index)"></i>
                            <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == ignoreExtractListDate.length - 1" @click="addIgnoreExtractList(index)"></i>
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
        getIgnoreExtract: Boolean,
        getIgnoreExtractIdStr: String,
        getIgnoreExtractDate: Object
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getIgnoreExtract(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['ignoreExtract'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    ignoreExtract: {}
                },
                customRuleType: 104
            },
            // 底部集合数组
            ignoreExtractListDate: [ { value:'', key: '' } ],
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
        this.activeNames = ['ignoreExtract'];
        console.log(this.getIgnoreExtractDate,'this.getIgnoreExtractDate')
        this.open = this.getIgnoreExtract;
        this.form.id = this.getIgnoreExtractIdStr;
        this.form.task.ignoreExtract = this.getIgnoreExtractDate;
        // console.log(this.form.task,'this.form.task')
        // 点击事件规则
        this.ignoreExtractListDate = [];
        // if(this.form.task.ignoreExtract.length == 0){
        //     this.ignoreExtractListDate = [ { value:'', key: '' } ];
        // }else{
        //     for(var i in this.form.task.ignoreExtract){
        //         this.ignoreExtractListDate.push({value:this.form.task.ignoreExtract[i]})
        //     }
        // }
        if(!this.form.task.ignoreExtract){
            this.ignoreExtractListDate = [ { value:'', key: '' } ];
        }else{
            for(var i in this.form.task.ignoreExtract){
                this.ignoreExtractListDate.push({
                    key: i,
                    value: this.form.task.ignoreExtract[i],
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
                    ignoreExtract: {}
                },
                customRuleType: 104
            };
        },
        /**点击事件规则 */
        //添加参数
        addIgnoreExtractList () {
            this.ignoreExtractListDate.push({'value': ''});
        },
        //删除参数
        removeIgnoreExtractList (index) {
            this.ignoreExtractListDate.splice(index, 1);
        },

        /** 提交按钮 */
        submitForm() {
            // 点击事件规则
            this.form.task.ignoreExtract = {};
            let homeArr = [];
            for(var i in this.ignoreExtractListDate){
                homeArr.push({key:this.ignoreExtractListDate[i].key,value:this.ignoreExtractListDate[i].value})
            }
            this.form.task.ignoreExtract = homeArr.reduce((accumulator, currentItem) => {
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