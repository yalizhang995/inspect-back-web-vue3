<template>
    <div class="app-container" id="Cookies">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="Cookie信息"
            :visible.sync="open"
            width="1000px"
            class="dialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="cancel"
        >
            <div class="box">
                <div class="collapse">
                    <el-collapse @change="handleChange" v-model="activeNames"  style="margin: 0 30px;" >
                        <el-collapse-item title="cookies管理" name="disableCookieManagement">
                            <div class="div" style="marginTop:10px">
                                <el-switch v-model="form.task.disableCookieManagement" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                            </div>
                        </el-collapse-item>
                        <!-- cookies信息 -->
                        <el-collapse-item title="cookies信息" name="cookies">
                            <div class="div">
                                <div v-for="(item,index) in CookiesListDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:40%"><span style="width:45px">域名：</span><el-input placeholder="请输入域名" v-model="item.name" clearable ></el-input></div>
                                    <div class="divSp" style="width:25%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <div class="divSp" style="width:25%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div>
                                    <i class="el-icon-remove-outline removeBtn" v-show="CookiesListDate.length!=1" @click="removeCookiesList(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == CookiesListDate.length - 1" @click="addCookiesList(index)"></i>
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
        getCookies: Boolean,
        getCookiesIdStr: String,
        getCookiesDate: Object
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getCookies(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['disableCookieManagement','cookies'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    disableCookieManagement: false,
                    cookies: {}
                },
                customRuleType: 4
            },
            // 底部集合数组
            CookiesListDate: [ { name:'', key: '',value: '' } ],

        };
    },
    created() {
        this.activeNames = ['disableCookieManagement','cookies'];
        console.log(this.getCookiesDate,'this.getCookiesDate')
        this.open = this.getCookies;
        this.form.id = this.getCookiesIdStr;
        this.form.task = this.getCookiesDate;
        console.log(this.form.task,'this.form.task')
        // // 点击事件规则
        this.CookiesListDate = [];
        if(Object.keys(this.form.task.cookies) == 0){
            this.CookiesListDate = [ { name:'', key: '',value: '' } ];
        }else{
            for(var i in this.form.task.cookies){
                this.CookiesListDate.push({
                    name: i,
                    key: Object.keys(this.form.task.cookies[i]).join(''),
                    value: Object.values(this.form.task.cookies[i]).join(''),
                })
            }
        }
        console.log(this.CookiesListDate,'this.CookiesListDate')
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
                    disableCookieManagement: false,
                    cookies: {}
                },
                customRuleType: 4
            };
        },
        /**点击事件规则 */
        //添加参数
        addCookiesList () {
            this.CookiesListDate.push({'value': ''});
        },
        //删除参数
        removeCookiesList (index) {
            this.CookiesListDate.splice(index, 1);
        },

        /** 提交按钮 */
        submitForm() {
            // 点击事件规则
            this.form.task.cookies = {};
            for(var i in this.CookiesListDate){
                this.form.task.cookies[this.CookiesListDate[i].name] = {[this.CookiesListDate[i].key]: this.CookiesListDate[i].value}
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
    right: 0;
}
.removeBtn2{
    // position: absolute;
    // right: 55px;
    // bottom: 5px;
    color: #f44336;
    font-size: 24px;
    margin-left: 10px;
    margin-top: 10px;
    position: absolute;
    top: -3px;
    right: -30px;
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
.divbox{
    width:100%;
    position: relative;
    margin:15px 60px 0 0;
    display: flex;
    span{
        display: inline-block;
    }
}
.divSp{
    display: flex;
    align-items: center;
    margin-right: 20px;
}
</style>