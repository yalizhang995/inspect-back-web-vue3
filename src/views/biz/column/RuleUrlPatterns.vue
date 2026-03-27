<template>
    <div class="app-container" id="RuleUrlPatterns">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="采集范围"
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
                    <el-collapse @change="handleChange" v-model="activeNames"  style="margin: 0 30px;" >
                        <!-- 采集范围 -->
                        <el-collapse-item title="采集范围" name="ruleUrlPatterns">
                            <div class="div">
                                <div v-for="(item,index) in ruleUrlPatternsDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入采集范围" v-model="item.value" clearable></el-input>
                                    <i class="el-icon-remove-outline removeBtn" v-show="ruleUrlPatternsDate.length!=1" @click="removeRuleUrlPatterns(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == ruleUrlPatternsDate.length - 1" @click="addRuleUrlPatterns(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 不采集范围 -->
                        <el-collapse-item title="不采集范围" name="ruleExcludes">
                            <div class="div">
                                <div v-for="(item,index) in ruleExcludesDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入不采集范围" v-model="item.value" clearable ></el-input>
                                    <i class="el-icon-remove-outline removeBtn" v-show="ruleExcludesDate.length!=1" @click="removeRuleExcludes(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == ruleExcludesDate.length - 1"  @click="addRuleExcludes(index)"></i>
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
        getRuleUrlPatterns: Boolean,
        getRuleUrlPatternsIdStr: String,
        getRuleUrlPatternsDate: Object
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getRuleUrlPatterns(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: [],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    ruleUrlPatterns: [],
                    ruleExcludes: []
                },
                customRuleType: 2
            },
            // 底部集合数组
            ruleUrlPatternsDate: [ { value:'' } ],
            ruleExcludesDate: [ { value:'' } ],

        };
    },
    created() {
        this.activeNames = [];
        console.log(this.getRuleUrlPatternsDate,'this.getRuleUrlPatternsDate')
        this.open = this.getRuleUrlPatterns;
        this.form.id = this.getRuleUrlPatternsIdStr;
        this.form.task = this.getRuleUrlPatternsDate;
        console.log(this.form.task,'this.form.task')
        // 采集范围
        this.ruleUrlPatternsDate = [];
        if(this.form.task.ruleUrlPatterns.length == 0){
            this.ruleUrlPatternsDate = [ { value:'' } ];
        }else{
            for(var i in this.form.task.ruleUrlPatterns){
                this.ruleUrlPatternsDate.push({value:this.form.task.ruleUrlPatterns[i]})
            }
        }
        // 不采集范围
        this.ruleExcludesDate = [];
        if(this.form.task.ruleExcludes.length == 0){
            this.ruleExcludesDate = [ { value:'' } ];
        }else{
            for(var i in this.form.task.ruleExcludes){
                this.ruleExcludesDate.push({value:this.form.task.ruleExcludes[i]})
            }
        }
        // 手风琴回显
        for(let i in this.form.task){
            for(var j in this.form.task[i]){
                if(this.form.task[i][j]){
                    this.activeNames.push(i)
                }
            }
        }
        this.activeNames = [...new Set(this.activeNames)];
        // if(this.activeNames.length == 0){
        //     this.activeNames = ['ruleUrlPatterns'];
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
                    ruleUrlPatterns: [],
                    ruleExcludes: []
                },
                customRuleType: 2
            };
        },
        /**采集范围 */
        //添加参数
        addRuleUrlPatterns () {
            this.ruleUrlPatternsDate.push({'value': ''});
        },
        //删除参数
        removeRuleUrlPatterns (index) {
            this.ruleUrlPatternsDate.splice(index, 1);
        },

        /**不采集范围 */
        //添加参数
        addRuleExcludes () {
            this.ruleExcludesDate.push({'value': ''});
        },
        //删除参数
        removeRuleExcludes (index) {
            this.ruleExcludesDate.splice(index, 1);
        },

        /** 提交按钮 */
        submitForm() {
            // 采集范围码
            this.form.task.ruleUrlPatterns = [];
            for(var i in this.ruleUrlPatternsDate){
                // if(this.ruleUrlPatternsDate[i].value){
                    this.form.task.ruleUrlPatterns.push(this.ruleUrlPatternsDate[i].value)
                // }
            }
            // 不采集范围
            this.form.task.ruleExcludes = [];
            for(var i in this.ruleExcludesDate){
                // if(this.ruleExcludesDate[i].value){
                    this.form.task.ruleExcludes.push(this.ruleExcludesDate[i].value)
                // }
            }
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