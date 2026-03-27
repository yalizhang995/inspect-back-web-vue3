<template>
    <div class="app-container" id="information">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="是否开启规范性检查"
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
                        <el-collapse-item title="是否开启网站规范性检查" name="website">
                            <div class="div" style="marginTop:10px">
                                <el-switch v-model="form.task.website" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                            </div>
                        </el-collapse-item>
                        <!-- 党政机关网站标识 -->
                        <el-collapse-item title="党政机关网站标识" name="political">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="politicalOpen" :disabled="politicalDate != null" style="marginLeft:20px"></el-button>
                            <!-- <el-button type="primary" icon="el-icon-minus" size="mini" @click="politicalClone"></el-button> -->
                            <div class="div">
                                <div v-for="(item,index) in politicalDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入党政机关网站标识" v-model="item.value" clearable></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="politicalDate.length!=1" @click="removePolitical(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removePolitical(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == politicalDate.length - 1" @click="addPolitical(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 网站标识码 -->
                        <el-collapse-item title="网站标识码" name="siteCode">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="siteCodeOpen" :disabled="siteCodeDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in siteCodeDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入网站标识码" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="siteCodeDate.length!=1" @click="removeSiteCode(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn"  @click="removeSiteCode(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == siteCodeDate.length - 1" @click="addSiteCode(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- ICP备案编号 -->
                        <el-collapse-item title="ICP备案编号" name="filings">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="filingsOpen" :disabled="filingsDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in filingsDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入ICP备案编号" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="filingsDate.length!=1" @click="removeFilings(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeFilings(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == filingsDate.length - 1" @click="addFilings(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 公安机关备案标识 -->
                        <el-collapse-item title="公安机关备案标识" name="police">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="policeOpen" :disabled="policeDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in policeDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入公安机关备案标识" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="policeDate.length!=1" @click="removePolice(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removePolice(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == policeDate.length - 1" @click="addPolice(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 网站主办单位 -->
                        <el-collapse-item title="网站主办单位" name="siteUnit">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="siteUnitOpen" :disabled="siteUnitDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in siteUnitDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入网站主办单位" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="siteUnitDate.length!=1" @click="removeSiteUnit(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeSiteUnit(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == siteUnitDate.length - 1" @click="addSiteUnit(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 联系方式 -->
                        <el-collapse-item title="联系方式" name="ontact">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="ontactOpen" :disabled="ontactDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in ontactDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入联系方式" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="ontactDate.length!=1" @click="removeOntact(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeOntact(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == ontactDate.length - 1" @click="addOntact(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 我为政府网站找错 -->
                        <el-collapse-item title="我为政府网站找错" name="mistake">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="mistakeOpen" :disabled="mistakeDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in mistakeDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入我为政府网站找错" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="mistakeDate.length!=1" @click="removeMistake(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeMistake(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == mistakeDate.length - 1" @click="addMistake(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 适老化标识 -->
                        <el-collapse-item title="适老化标识" name="aging">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="agingOpen" :disabled="agingDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in agingDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入适老化标识" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="agingDate.length!=1" @click="removeAging(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeAging(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == agingDate.length - 1" @click="addAging(index)"></i>
                                </div>
                            </div>
                        </el-collapse-item>
                        <!-- 网站地图 -->
                        <el-collapse-item title="网站地图" name="siteMap">
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="siteMapOpen" :disabled="siteMapDate != null" style="marginLeft:20px"></el-button>
                            <div class="div">
                                <div v-for="(item,index) in siteMapDate" :key="index" style="width:80%;position: relative;margin:15px 60px 0 0;">
                                    <el-input placeholder="请输入网站标识码" v-model="item.value" clearable ></el-input>
                                    <!-- <i class="el-icon-remove-outline removeBtn" v-show="siteMapDate.length!=1" @click="removeSiteMap(index)"></i> -->
                                    <i class="el-icon-remove-outline removeBtn" @click="removeSiteMap(index)"></i>
                                    <i class="el-icon-circle-plus-outline removeBtn2" v-show="index == siteMapDate.length - 1" @click="addSiteMap(index)"></i>
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
        getInformation: Boolean,
        getInformationIdStr: String,
        getInformationDate: Object,
        getWebsite: Boolean,
        
    },
    watch:{
        // 这里监听dialogShow对象的变化
        getInformation(val){
            console.log(val,'val')
        }
    },
    data() {
        return {
            activeNames: ['website'],
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                id: null,
                task: {
                    websiteCode: {
                        political: null,
                        siteCode: null,
                        filings: null,
                        police: null,
                        siteUnit: null,
                        ontact: null,
                        mistake: null,
                        aging: null,
                        siteMap: null,
                    },
                    website: true,
                },
                customRuleType: 1
            },
            // 底部集合数组
            politicalDate: null,
            siteCodeDate: null,
            filingsDate: null,
            policeDate: null,
            siteUnitDate: null,
            ontactDate: null,
            mistakeDate: null,
            agingDate: null,
            siteMapDate: null,

        };
    },
    created() {
        this.activeNames = ['website'];
        console.log(this.getInformationDate,'this.getInformationDate')
        console.log(this.getWebsite,'this.getWebsite')
        this.open = this.getInformation;
        this.form.id = this.getInformationIdStr;
        this.form.task.websiteCode = this.getInformationDate;
        this.form.task.website = this.getWebsite;
        // 党政机关网站标识
        this.politicalDate = null;
        if(this.form.task.websiteCode.political == null){
            // this.politicalDate = [ { value:'' } ];
        }else{
            this.politicalDate = [];
            for(var i in this.form.task.websiteCode.political){
                this.politicalDate.push({value:this.form.task.websiteCode.political[i]})
            }
        }
        // 网站标识码
        this.siteCodeDate = null;
        if(this.form.task.websiteCode.siteCode == null){
            // this.siteCodeDate = [ { value:'' } ];
        }else{
            this.siteCodeDate = [];
            for(var i in this.form.task.websiteCode.siteCode){
                this.siteCodeDate.push({value:this.form.task.websiteCode.siteCode[i]})
            }
        }
        // ICP备案编号
        this.filingsDate = null;
        if(this.form.task.websiteCode.filings == null){
            // this.filingsDate = [ { value:'' } ];
        }else{
            this.filingsDate = [];
            for(var i in this.form.task.websiteCode.filings){
                this.filingsDate.push({value:this.form.task.websiteCode.filings[i]})
            }
        }
        // 公安机关备案标识
        this.policeDate = null;
        if(this.form.task.websiteCode.police == null){
            // this.policeDate = [ { value:'' } ];
        }else{
            this.policeDate = [];
            for(var i in this.form.task.websiteCode.police){
                this.policeDate.push({value:this.form.task.websiteCode.police[i]})
            } 
        }
        // 网站主办单位
        this.siteUnitDate = null;
        if(this.form.task.websiteCode.siteUnit == null){
            // this.siteUnitDate = [ { value:'' } ]; 
        }else{
            this.siteUnitDate = [];
            for(var i in this.form.task.websiteCode.siteUnit){
                this.siteUnitDate.push({value:this.form.task.websiteCode.siteUnit[i]})
            }
        }
        // 联系方式
        this.ontactDate = null;
        if(this.form.task.websiteCode.ontact == null){
            // this.ontactDate = [ { value:'' } ];
        }else{
            this.ontactDate = [];
            for(var i in this.form.task.websiteCode.ontact){
                this.ontactDate.push({value:this.form.task.websiteCode.ontact[i]})
            }
        }
        // 我为政府网站找错
        this.mistakeDate = null;
        if(this.form.task.websiteCode.mistake == null){
            // this.mistakeDate = [ { value:'' } ];
        }else{
            this.mistakeDate = [];
            for(var i in this.form.task.websiteCode.mistake){
                this.mistakeDate.push({value:this.form.task.websiteCode.mistake[i]})
            }
        }
        // 适老化标识
        this.agingDate = null;
        if(this.form.task.websiteCode.aging == null){
            // this.agingDate = [ { value:'' } ];
        }else{
            this.agingDate = [];
            for(var i in this.form.task.websiteCode.aging){
                this.agingDate.push({value:this.form.task.websiteCode.aging[i]})
            }
        }
        // 网站地图
        this.siteMapDate = null;
        if(this.form.task.websiteCode.siteMap == null){
            // this.siteMapDate = [ { value:'' } ]; 
        }else{
            this.siteMapDate = [];
            for(var i in this.form.task.websiteCode.siteMap){
                this.siteMapDate.push({value:this.form.task.websiteCode.siteMap[i]})
            }
        }
        // 手风琴回显
        for(let i in this.form.task.websiteCode){
            for(var j in this.form.task.websiteCode[i]){
                if(this.form.task.websiteCode[i][j]){
                    this.activeNames.push(i)
                }
            }
        }
        this.activeNames = [...new Set(this.activeNames)];
        // if(this.activeNames.length == 0){
        //     this.activeNames = ['political'];
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
                    websiteCode: {
                        political: null,
                        siteCode: null,
                        filings: null,
                        police: null,
                        siteUnit: null,
                        ontact: null,
                        mistake: null,
                        aging: null,
                        siteMap: null,
                    },
                    website: true,
                },
                customRuleType: 1,
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

        /**网站标识码 */
        //添加参数
        addSiteCode () {
            this.siteCodeDate.push({'value': ''});
        },
        //删除参数
        removeSiteCode (index) {
            this.siteCodeDate.splice(index, 1);
            if(this.siteCodeDate.length == 0){
                this.siteCodeDate = null;
            }
        },
        siteCodeOpen(){
            this.siteCodeDate = [{value: ''}]
        },
        siteCodeClone(){
            this.siteCodeDate = null;
        },

        /**ICP备案编号 */
        //添加参数
        addFilings () {
            this.filingsDate.push({'value': ''});
        },
        //删除参数
        removeFilings (index) {
            this.filingsDate.splice(index, 1);
            if(this.filingsDate.length == 0){
                this.filingsDate = null;
            }
        },
        filingsOpen(){
            this.filingsDate = [{value: ''}]
        },
        filingsClone(){
            this.filingsDate = null;
        },

        /**公安机关备案标识 */
        //添加参数
        addPolice () {
            this.policeDate.push({'value': ''});
        },
        //删除参数
        removePolice (index) {
            this.policeDate.splice(index, 1);
            if(this.policeDate.length == 0){
                this.policeDate = null;
            }
        },
        policeOpen(){
            this.policeDate = [{value: ''}]
        },
        policeClone(){
            this.policeDate = null;
        },

        /**网站主办单位 */
        //添加参数
        addSiteUnit () {
            this.siteUnitDate.push({'value': ''});
        },
        //删除参数
        removeSiteUnit (index) {
            this.siteUnitDate.splice(index, 1);
            if(this.siteUnitDate.length == 0){
                this.siteUnitDate = null;
            }
        },
        siteUnitOpen(){
            this.siteUnitDate = [{value: ''}]
        },
        siteUnitClone(){
            this.siteUnitDate = null;
        },

        /**联系方式 */
        //添加参数
        addOntact () {
            this.ontactDate.push({'value': ''});
        },
        //删除参数
        removeOntact (index) {
            this.ontactDate.splice(index, 1);
            if(this.ontactDate.length == 0){
                this.ontactDate = null;
            }
        },
        ontactOpen(){
            this.ontactDate = [{value: ''}]
        },
        ontactClone(){
            this.ontactDate = null;
        },

        /**我为政府网站找错 */
        //添加参数
        addMistake () {
            this.mistakeDate.push({'value': ''});
        },
        //删除参数
        removeMistake (index) {
            this.mistakeDate.splice(index, 1);
            if(this.mistakeDate.length == 0){
                this.mistakeDate = null;
            }
        },
        mistakeOpen(){
            this.mistakeDate = [{value: ''}]
        },
        mistakeClone(){
            this.mistakeDate = null;
        },

        /**适老化标识 */
        //添加参数
        addAging () {
            this.agingDate.push({'value': ''});
        },
        //删除参数
        removeAging (index) {
            this.agingDate.splice(index, 1);
            if(this.agingDate.length == 0){
                this.agingDate = null;
            }
        },
        agingOpen(){
            this.agingDate = [{value: ''}]
        },
        agingClone(){
            this.agingDate = null;
        },

        /**网站地图 */
        //添加参数
        addSiteMap () {
            this.siteMapDate.push({'value': ''});
        },
        //删除参数
        removeSiteMap (index) {
            this.siteMapDate.splice(index, 1);
            if(this.siteMapDate.length == 0){
                this.siteMapDate = null;
            }
        },
        siteMapOpen(){
            this.siteMapDate = [{value: ''}]
        },
        siteMapClone(){
            this.siteMapDate = null;
        },

        /** 提交按钮 */
        submitForm() {
            console.log(this.politicalDate,'this.politicalDate')
            // 党政机关网站标识码
            if(this.politicalDate != null){
                this.form.task.websiteCode.political = [];
                for(var i in this.politicalDate){
                    // if(this.politicalDate[i].value){
                        this.form.task.websiteCode.political.push(this.politicalDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.political = null;
            }
            
            // 网站标识码
            if(this.siteCodeDate != null){
                this.form.task.websiteCode.siteCode = [];
                for(var i in this.siteCodeDate){
                    // if(this.siteCodeDate[i].value){
                        this.form.task.websiteCode.siteCode.push(this.siteCodeDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.siteCode = null;
            }
            
            // ICP备案编号
            if(this.filingsDate != null){
                this.form.task.websiteCode.filings = [];
                for(var i in this.filingsDate){
                    // if(this.filingsDate[i].value){
                        this.form.task.websiteCode.filings.push(this.filingsDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.filings = null;
            }
            
            // 公安机关备案标识
            if(this.policeDate != null){
                this.form.task.websiteCode.police = [];
                for(var i in this.policeDate){
                    // if(this.policeDate[i].value){
                        this.form.task.websiteCode.police.push(this.policeDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.police = null;
            }
            
            // 网站主办单位
            if(this.siteUnitDate != null){
                this.form.task.websiteCode.siteUnit = [];
                for(var i in this.siteUnitDate){
                    // if(this.siteUnitDate[i].value){
                        this.form.task.websiteCode.siteUnit.push(this.siteUnitDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.siteUnit = null;
            }
            
            // 联系方式
            if(this.ontactDate != null){
                this.form.task.websiteCode.ontact = [];
                for(var i in this.ontactDate){
                    // if(this.ontactDate[i].value){
                        this.form.task.websiteCode.ontact.push(this.ontactDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.ontact = null;
            }
            
            // 我为政府网站找错
            if(this.mistakeDate != null){
                this.form.task.websiteCode.mistake = [];
                for(var i in this.mistakeDate){
                    // if(this.mistakeDate[i].valu){
                        this.form.task.websiteCode.mistake.push(this.mistakeDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.mistake = null;
            }
            
            // 适老化标识
            if(this.agingDate != null){
                this.form.task.websiteCode.aging = [];
                for(var i in this.agingDate){
                    // if(this.agingDate[i].value){
                        this.form.task.websiteCode.aging.push(this.agingDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.aging = null;
            }
            
            // 网站地图
            if(this.siteMapDate != null){
                this.form.task.websiteCode.siteMap = [];
                for(var i in this.siteMapDate){
                    // if(this.siteMapDate[i].value){
                        this.form.task.websiteCode.siteMap.push(this.siteMapDate[i].value)
                    // }
                }
            }else{
                this.form.task.websiteCode.siteMap = null;
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