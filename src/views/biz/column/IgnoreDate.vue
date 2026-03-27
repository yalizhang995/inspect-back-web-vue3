<template>
    <div class="app-container" id="information">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="日期过滤正则"
            :visible.sync="open"
            width="800px"
            class="dialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="cancel"
        >
            <div class="box">
                <div class="collapse">
                    <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 20}" placeholder="请输入内容" v-model="form.task.ignoreDate"></el-input>
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
        getIgnoreDate: Boolean,
        getIgnoreDateDateIdStr: String,
        getIgnoreDateDate: String,
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getIgnoreDateDate(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['political'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    ignoreDate: ''
                },
                customRuleType: 100
            },
            politicalDate: null,

        };
    },
    created() {
        this.activeNames = ['political'];
        console.log(this.getIgnoreDateDate,'this.getIgnoreDateDate')
        this.open = this.getIgnoreDate;
        this.form.id = this.getIgnoreDateDateIdStr;
        this.form.task.ignoreDate = this.getIgnoreDateDate;
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
                    ignoreDate: null
                },
                customRuleType: 100
            };
        },

        /** 提交按钮 */
        submitForm() {
            console.log(this.form,'this.form')
            editCustomRules(this.form).then(response => {
                this.$modal.msgSuccess("编辑成功");
                this.open = false;
                this.$emit("openS", false);
                this.reset();
            });
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
    padding: 0 30px;
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