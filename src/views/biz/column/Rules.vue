<template>
    <div class="app-container" id="Rules">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="自定义抽取"
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
                        <!-- 首页自定义采集规则 -->
                        <el-collapse-item title="首页自定义采集规则" name="home">
                            <div class="div">
                                <div v-for="(item,index) in homeDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:35%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <div class="divSp" style="width:35%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div>
                                    <i class="el-icon-remove-outline removeBtn" v-show="homeDate.length!=1" @click="removeHome(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == homeDate.length - 1" @click="addHome(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 栏目页自定义采集规则 -->
                        <el-collapse-item title="栏目页自定义采集规则" name="catalog">
                            <div class="div">
                                <div v-for="(item,index) in catalogDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:35%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <div class="divSp" style="width:35%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div>
                                    <i class="el-icon-remove-outline removeBtn" v-show="catalogDate.length!=1" @click="removeCatalog(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == catalogDate.length - 1" @click="addCatalog(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 内容页自定义采集规则 -->
                        <el-collapse-item title="内容页自定义采集规则" name="content">
                            <div class="div">
                                <div v-for="(item,index) in contentDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:35%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <div class="divSp" style="width:35%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div>
                                    <i class="el-icon-remove-outline removeBtn" v-show="contentDate.length!=1" @click="removeContent(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == contentDate.length - 1" @click="addContent(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 栏目页列表链接抽取规则 -->
                        <el-collapse-item title="栏目页列表链接抽取规则" name="column">
                            <div class="div">
                                <div v-for="(item,index) in columnDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:35%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <!-- <div class="divSp" style="width:35%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div> -->
                                    <div class="divSp" style="width:74%">
                                        <span style="width:60px">value：</span>
                                        <!-- <el-input placeholder="请输入value" v-model="item.value" clearable ></el-input> -->
                                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" v-model="item.value"></el-input>
                                    </div>
                                    
                                    <i class="el-icon-remove-outline removeBtn" style="left:96%" v-show="columnDate.length!=1" @click="removeColumn(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" style="left:101%" v-show="index == columnDate.length - 1" @click="addColumn(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 首页外链接更新抽取规则 -->
                        <el-collapse-item title="首页外链接更新抽取规则" name="homeUpdate">
                            <div class="div">
                                <div v-for="(item,index) in homeUpdateDate" :key="index" class="divbox">
                                    <div class="divSp" style="width:35%"><span style="width:45px">key：</span><el-input placeholder="请输入key" v-model="item.key" clearable ></el-input></div>
                                    <!-- <div class="divSp" style="width:35%"><span style="width:60px">value：</span><el-input placeholder="请输入value" v-model="item.value" clearable ></el-input></div> -->
                                    <div class="divSp" style="width:74%">
                                        <span style="width:60px">value：</span>
                                        <!-- <el-input placeholder="请输入value" v-model="item.value" clearable ></el-input> -->
                                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" v-model="item.value"></el-input>
                                    </div>
                                    
                                    <i class="el-icon-remove-outline removeBtn" style="left:96%" v-show="homeUpdateDate.length!=1" @click="removeHomeUpdate(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" style="left:101%" v-show="index == homeUpdateDate.length - 1" @click="addHomeUpdate(index)"></i>
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
        getRules: Boolean,
        getRulesIdStr: String,
        getRulesDate: Object
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getRules(val){
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
                    rules: {
                        home: {},
                        catalog: {},
                        content: {},
                        column: {},
                        homeUpdate: {},
                    }
                },
                customRuleType: 5
            },
            // 底部集合数组
            homeDate: [ {  key: '',value: '' } ],
            catalogDate: [ {  key: '',value: '' } ],
            contentDate: [ {  key: '',value: '' } ],
            columnDate: [ {  key: '',value: '' } ],
            homeUpdateDate: [ {  key: '',value: '' } ],
        };
    },
    created() {
        this.activeNames = [];
        console.log(this.getRulesDate,'this.getRulesDate')
        this.open = this.getRules;
        this.form.id = this.getRulesIdStr;
        this.form.task.rules = this.getRulesDate;
        // 首页自定义采集规则
        this.homeDate = [];
        if(!this.form.task.rules.home || Object.keys(this.form.task.rules.home).length === 0){
            this.homeDate = [ { key: '',value: '' } ];
        }else{
            for(var i in this.form.task.rules.home){
                this.homeDate.push({
                    key: i,
                    value: this.form.task.rules.home[i],
                })
            }
            this.activeNames.push('home')
        }
        // 栏目页自定义采集规则
        this.catalogDate = [];
        // if(!this.form.task.rules.catalog){
        if(!this.form.task.rules.catalog || Object.keys(this.form.task.rules.catalog).length === 0){
            this.catalogDate = [ { key: '',value: '' } ];
        }else{
            for(var i in this.form.task.rules.catalog){
                this.catalogDate.push({
                    key: i,
                    value: this.form.task.rules.catalog[i],
                })
            }
            this.activeNames.push('catalog')
        }
        // 内容页自定义采集规则
        this.contentDate = [];
        // if(!this.form.task.rules.content){
        if(!this.form.task.rules.content || Object.keys(this.form.task.rules.content).length === 0){
            this.contentDate = [ { key: '',value: '' } ];
        }else{
            for(var i in this.form.task.rules.content){
                this.contentDate.push({
                    key: i,
                    value: this.form.task.rules.content[i],
                })
            }
            this.activeNames.push('content')
        }
        // 栏目页列表链接抽取规则
        this.columnDate = [];
        // if(!this.form.task.rules.column){
        if(!this.form.task.rules.column || Object.keys(this.form.task.rules.column).length === 0){
            this.columnDate = [ { key: '',value: '' } ];
        }else{
            for(var i in this.form.task.rules.column){
                this.columnDate.push({
                    key: i,
                    value: this.form.task.rules.column[i],
                })
            }
            this.activeNames.push('column')
        }
        // 首页外链接更新抽取规则
        this.homeUpdateDate = [];
        // if(!this.form.task.rules.homeUpdate){
        if(!this.form.task.rules.homeUpdate || Object.keys(this.form.task.rules.homeUpdate).length === 0){
            this.homeUpdateDate = [ { key: '',value: '' } ];
        }else{
            for(var i in this.form.task.rules.homeUpdate){
                this.homeUpdateDate.push({
                    key: i,
                    value: this.form.task.rules.homeUpdate[i],
                })
            }
            this.activeNames.push('homeUpdate')
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
                    rules: {
                        home: {},
                        catalog: {},
                        content: {},
                        column: {},
                        homeUpdate: {}
                    }
                },
                customRuleType: 5
            };
        },
        /**首页自定义采集规则 */
        //添加参数
        addHome () {
            this.homeDate.push({'value': ''});
        },
        //删除参数
        removeHome (index) {
            this.homeDate.splice(index, 1);
        },

        /**栏目页自定义采集规则 */
        //添加参数
        addCatalog () {
            this.catalogDate.push({'value': ''});
        },
        //删除参数
        removeCatalog (index) {
            this.catalogDate.splice(index, 1);
        },

        /**内容页自定义采集规则 */
        //添加参数
        addContent () {
            this.contentDate.push({'value': ''});
        },
        //删除参数
        removeContent (index) {
            this.contentDate.splice(index, 1);
        },

        /**栏目页列表链接抽取规则 */
        //添加参数
        addColumn () {
            this.columnDate.push({'value': ''});
        },
        //删除参数
        removeColumn (index) {
            this.columnDate.splice(index, 1);
        },

        /**首页外链接抽取规则 */
        //添加参数
        addHomeUpdate () {
            this.homeUpdateDate.push({'value': ''});
        },
        //删除参数
        removeHomeUpdate (index) {
            this.homeUpdateDate.splice(index, 1);
        },
        /** 提交按钮 */
        submitForm() {
            // 首页自定义采集规则
            this.form.task.rules.home = {};
            let homeArr = [];
            for(var i in this.homeDate){
                if(this.homeDate[i].key != '' && this.homeDate[i].value != ''){
                    homeArr.push({key:this.homeDate[i].key,value:this.homeDate[i].value})
                }
            }
            if(homeArr.length > 0){
                this.form.task.rules.home = homeArr.reduce((accumulator, currentItem) => {
                    accumulator[currentItem.key] = currentItem.value;
                    return accumulator;
                }, {});
            }
            // 栏目页自定义采集规则
            this.form.task.rules.catalog = {};
            let catalogArr = [];
            for(var i in this.catalogDate){
                if(this.catalogDate[i].key != '' && this.catalogDate[i].value != ''){
                    catalogArr.push({key:this.catalogDate[i].key,value:this.catalogDate[i].value})
                }
            }
            if(catalogArr.length > 0){
                this.form.task.rules.catalog = catalogArr.reduce((accumulator, currentItem) => {
                    accumulator[currentItem.key] = currentItem.value;
                    return accumulator;
                }, {});
            }
            // 内容页自定义采集规则
            this.form.task.rules.content = {};
            let contentArr = [];
            for(var i in this.contentDate){
                if(this.contentDate[i].key != '' && this.contentDate[i].value != ''){
                    contentArr.push({key:this.contentDate[i].key,value:this.contentDate[i].value})
                }
            }
            if(contentArr.length > 0){
                this.form.task.rules.content = contentArr.reduce((accumulator, currentItem) => {
                    accumulator[currentItem.key] = currentItem.value;
                    return accumulator;
                }, {});
            }
            // 栏目页列表链接抽取规则
            this.form.task.rules.column = {};
            let columnArr = [];
            for(var i in this.columnDate){
                if(this.columnDate[i].key != '' && this.columnDate[i].value != ''){
                    columnArr.push({key:this.columnDate[i].key,value:this.columnDate[i].value})
                }
            }
            if(columnArr.length > 0){
                this.form.task.rules.column = columnArr.reduce((accumulator, currentItem) => {
                    accumulator[currentItem.key] = currentItem.value;
                    return accumulator;
                }, {});
            }
            // 首页外链接抽取规则
            this.form.task.rules.homeUpdate = {};
            let homeUpdateArr = [];
            for(var i in this.homeUpdateDate){
                if(this.homeUpdateDate[i].key != '' && this.homeUpdateDate[i].value != ''){
                    homeUpdateArr.push({key:this.homeUpdateDate[i].key,value:this.homeUpdateDate[i].value})
                }
            }
            if(homeUpdateArr.length > 0){
                this.form.task.rules.homeUpdate = homeUpdateArr.reduce((accumulator, currentItem) => {
                    accumulator[currentItem.key] = currentItem.value;
                    return accumulator;
                }, {});
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
    left: 74%;
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
    left: 79%;
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