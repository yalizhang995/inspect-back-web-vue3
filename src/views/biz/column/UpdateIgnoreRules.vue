<template>
    <div class="app-container" id="information">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="首页/栏目页更新忽略规则"
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
                    <div style="color:red;margin: 0 0 10px 20px">注：以地址url规则进行忽略</div>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="politicalOpen" :disabled="politicalDate != null" style="marginLeft:20px"></el-button>
                    <!-- <el-button type="primary" icon="el-icon-minus" size="mini" @click="politicalClone"></el-button> -->
                    <div class="div">
                        <div v-for="(item,index) in politicalDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                            <!-- <el-input placeholder="请输入党政机关网站标识" v-model="item.value" clearable></el-input> -->
                            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" v-model="item.value"></el-input>
                            <!-- <i class="el-icon-remove-outline removeBtn" v-show="politicalDate.length!=1" @click="removePolitical(index)"></i> -->
                            <i class="el-icon-remove-outline removeBtn" @click="removePolitical(index)"></i>
                            <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == politicalDate.length - 1" @click="addPolitical(index)"></i>
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
        getUpdateIgnoreRules: Boolean,
        getUpdateIgnoreRulesDateIdStr: String,
        getUpdateIgnoreRulesDate: Array,
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getColumnUrlRulesDate(val){
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
                    updateIgnoreRules: []
                },
                customRuleType: 103
            },
            politicalDate: null,

        };
    },
    created() {
        this.activeNames = ['political'];
        console.log(this.getUpdateIgnoreRulesDate,'this.getUpdateIgnoreRulesDate')
        this.open = this.getUpdateIgnoreRules;
        this.form.id = this.getUpdateIgnoreRulesDateIdStr;
        this.form.task.updateIgnoreRules = this.getUpdateIgnoreRulesDate;
        // 党政机关网站标识
        this.politicalDate = null;
        if(this.form.task.updateIgnoreRules.length == 0){

        }else{
            this.politicalDate = [];
            for(var i in this.form.task.updateIgnoreRules){
                this.politicalDate.push({value:this.form.task.updateIgnoreRules[i]})
            }
        }
        // }
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
                    updateIgnoreRules: []
                },
                customRuleType: 103
            };
        },
        /**党政机关网站标识 */
        //添加参数
        addPolitical () {
            this.politicalDate.push({'value': ''});
        },
        //删除参数
        removePolitical (index) {
            this.politicalDate.splice(index, 1);
            if(this.politicalDate.length == 0){
                this.politicalDate = null;
            }
        },
        politicalOpen(){
            this.politicalDate = [{value: ''}]
        },
        politicalClone(){
            this.politicalDate = null;
        },

        /** 提交按钮 */
        submitForm() {
            console.log(this.politicalDate,'this.politicalDate')
            // 党政机关网站标识码
            if(this.politicalDate != null){
                this.form.task.updateIgnoreRules = [];
                for(var i in this.politicalDate){
                    // if(this.politicalDate[i].value){
                        this.form.task.updateIgnoreRules.push(this.politicalDate[i].value)
                    // }
                }
            }else{
                this.form.task.updateIgnoreRules = null;
            }
            
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
    padding-left: 30px;
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