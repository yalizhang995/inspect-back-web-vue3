<template>
    <div class="app-container errorsPage" >
        <!-- 添加或修改站点关系对话框 -->
        <el-dialog :title="titleTxt" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" class="addCl" @close="cancel" >
            <el-form ref="form" :model="form" :rules="rules" label-width="0" v-loading="diaLoading">
                <div style="display: flex;justify-content: space-between;marginTop: -5px;">
                     <!-- 客户类型 -->
                    <div style="width: 49%">
                        <span class="spClass"><span class="x">*</span>客户类型</span>
                        <el-form-item label="" prop="siteType">
                            <el-select v-model="form.siteType" clearable placeholder="请选择" style="width: 100%" size="small" @change="siteTypeChange" :disabled="openType == 2" @clear="unitTypeType = true">
                                <el-option v-for="item in siteTypeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 选择客户 -->
                    <div style="width: 49%" v-if="form.siteType">
                        <span class="spClass"><span class="x">*</span>选择客户</span>
                        <el-form-item label="" prop="siteCode">
                            <el-autocomplete
                                v-model="form.siteCode"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入网站名称/标识码"
                                clearable
                                style="width:100%"
                                @select="handleSelectCompany"
                                @clear="form.siteCode = null"
                                size="small"
                                :disabled="openType == 2"
                            ></el-autocomplete>
                        </el-form-item>
                    </div>
                    
                </div>
                <!-- 发生单位 -->
                <div style="marginTop: -5px;">
                    <span class="spClass"><span class="x">*</span>发生单位</span>
                    <el-form-item label="" prop="unitType">
                        <div>
                            <el-button :type="btnIndex == index ? 'primary' : ''" size="mini" v-for="(item,index) in btnList" :key="index" @click="fsdwChange(item,index)" :disabled="unitTypeType">{{item.label}}</el-button>
                            <!-- <el-button size="mini">自定义单位</el-button>
                            <el-button size="mini">全部单位</el-button> -->
                        </div>
                        <div v-if="btnIndex == 1">
                            <el-button icon="el-icon-s-operation" size="mini" @click="zdyChange">选择</el-button>
                            <el-button size="mini" :disabled="yxxNum == 0" @click="zdyChange">已选{{yxxNum}}项</el-button>
                        </div>
                        <!-- 业务类型 -->
                        <el-form-item label="" prop="reviewItems" style="marginTop: 20px" class="yjxBox">
                            <el-checkbox :indeterminate="ywlxIsIndeterminate" v-model="ywlxCheckAll" @change="ywlxHandleCheckAllChange">全选</el-checkbox>
                            <div style="display:flex;">
                                <el-checkbox-group v-model="form.reviewItems">
                                    <el-checkbox v-for="(item,index) in confirmedDetailsList" :key="item.value" :label="item.value" style="flex:1"  @change="confirmedDetailsChange($event,index)">
                                        {{ item.label }}
                                        <span style="margin: 0 15px 0 80px;">发现时间</span>
                                        <el-date-picker
                                            size="mini"
                                            v-model="item.DateArr"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            style="width:300px"
                                            @change="sjChange(item,index)"
                                            :disabled="!item.type"
                                            :clearable="false"
                                            >
                                        </el-date-picker>
                                    </el-checkbox>
                                </el-checkbox-group>
                                <el-checkbox-group v-model="confirmSendDays" style="width:150px">
                                    <!-- <el-checkbox label="全天接收" :disabled="openType == 1 && confirmedDetailsList[0].type"></el-checkbox> -->
                                    <el-checkbox v-for="(item2,index2) in confirmSendDay" :key="item2.value" :label="item2.value" :disabled="!item2.type" @change="qlChange($event,index2)">{{ item2.label }}</el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>
                    </el-form-item>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>

            <!-- 自定义单位 -->
            <el-dialog width="1000px" title="自定义单位" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel2" class="zdyBox">
                <div class="divBox">
                    <div class="divLeft" >
                        <div class="treeSearch">
                            <!-- <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                                <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                            </el-input> -->
                            <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" style="marginBottom: 10px" clearable></el-input>
                        </div>
                        <div class="treeDiv" v-loading="treeLoading">
                            <el-tree
                                ref="tree" 
                                node-key="siteCode"
                                :data="inspSiteTreeList"
                                :props="inspSiteTreeList"
                                show-checkbox
                                @check-change="handleCheckChange"
                                :default-expanded-keys="treeSiteCode"
                                :default-checked-keys="form.organizationSiteCodeList"
                                v-if="inspSiteTreeList.length"
                                :highlight-current="highlightBd"
                                :check-strictly="true"
                                :filter-node-method="filterNode"
                            >
                                <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                    <div class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >
                                        <div class="label">{{ node.label }}</div>
                                        <!-- <el-checkbox @click.native.stop="treeChange(node, data)">全选</el-checkbox> -->
                                        <el-checkbox 
                                            v-model="data.checked"
                                            @change="(val) => handleCheckboxChange(val, node, data)"
                                            @click.native.stop
                                            v-if="data.children.length > 0"
                                        >全选</el-checkbox>
                                    </div>
                                </el-tooltip>
                            </el-tree>
                        </div>
                        <!-- <span class="jt"><i :class='jtIco' @click="jtChange" ></i></span> -->
                    </div>
                    <!-- 筛选 -->
                    <div class="divCen">
                        <div>
                            <el-input placeholder="填报单位名称/标识码" v-model="tbSiteCode" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                                <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                            </el-input>
                        </div>
                        <div class="divCenCT"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
                        <div class="divCenC">
                            <el-checkbox-group v-model="form.siteInfoVos" @change="handleCheckedCitiesChange" size="mini" v-if="cities.length > 0">
                                <el-checkbox v-for="(item,index) in cities" :label="item.siteCode" :key="index" border style="width:100%">
                                    <div class="dxBox">
                                        <span class="spsp1">{{item.siteName}}</span>
                                        <span>{{item.siteCode}}</span>
                                    </div>
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-empty :image-size="100" v-if="cities.length == 0"></el-empty>
                        </div>
                    </div>
                    <!-- 结果 -->
                    <div class="divRight">
                        <div class="divRightT">
                            <div>已选<span style="color:red;margin:0 2px;">{{siteNames.length}}</span>项</div>
                            <el-button type="text" size="mini" @click="clearSiteNames">全部清空</el-button>
                        </div>
                        <div class="divRightTC">
                            <div class="jgLi" v-for="(item,index) in this.siteNames" v-if="siteNames.length > 0">
                                <span class="jgLiL">{{item.siteName}}</span>
                                <span @click="delSiteNames(item,index)"><i class="el-icon-close" style="color:#409EFF;cursor: pointer;"></i></span>
                            </div>
                            <el-empty :image-size="100" v-if="siteNames.length == 0"></el-empty>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm2">确 定</el-button>
                    <el-button @click="cancel2">取 消</el-button>
                </div>
            </el-dialog>

        </el-dialog>
    </div>
</template>

<script>
import {
    warnStrategyInfoAdd,
    getInspSiteTreeList,
    warnStrategyInfoEdif,
    getOrganizationUnit,
    getUnit,
    getMediaList
} from "@/api/warn/index";
import {
    reviewTaskAdd,
} from "@/api/reviewTask/index";
import {
    inspImportdataTask,
    downloadExcelTpl
} from "@/api/biz/wrongWords";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { listInspOrderBatch } from "@/api/biz/inspOrderBatch";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
    },
    props: {
        type: Boolean,
        obj: Object,
        openType: Number
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
        return {
            loading: false,
            treeLoading: false,
            diaLoading: false,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 非单个禁用
            single2: true,
            // 非多个禁用
            multiple2: true,
            // 弹出层标题
            open: false, 
            titleTxt: '新增复核任务',

            unitTypeType: true,

            /**下拉菜单数据 */
            // 客户类型
            siteTypeList: [
                { label: '组织单位', val: 1 },
                { label: '填报单位', val: 2 },
            ],
            // 单位消息接收人
            btnIndex: 2,
            btnList: [
                { label: '本级填报单位', type: '', val: 1 },
                { label: '自定义单位', type: '', val: 2 },
                { label: '全部单位', type: '', val: 3 },
            ],
            // 触发条件
            confirmedDetailsList: [
                { value: 30, label: '错误内容', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                { value: 40, label: '敏感信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                { value: 50, label: '隐私泄露', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                // { value: 20, label: '错链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                { value: 70, label: '外链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                // { value: 60, label: '规范检查', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
            ],
            // 是否全量
            confirmSendDay: [
                { value: 30, label: '全量', type: false },
                { value: 40, label: '全量', type: false },
                { value: 50, label: '全量', type: false },
                // { value: 20, label: '全量', type: false },
                { value: 70, label: '全量', type: false },
                // { value: 60, label: '全量', type: false },
            ],

            // 提交表单
            rules: {
                siteType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
                siteCode: [
                    { required: true, message: '请选择客户', trigger: 'change' },
                ],
                unitType: [{ required: true, message: '请选择发生单位', trigger: 'change' }],
                reviewItems: [{ required: true, message: '请选择业务类型', trigger: 'change' }],

            },
            sc_msg: null,

            // 复核任务
            form: {
                type: 1,
                scType: 1, // 产品类型
                siteType: null, // 客户类型
                siteCode: null, // 站点标识码
                unitType: 3, // 发生单位
                siteInfoVos: [], // 监测的站点 数组
                reviewItems: [], // 已选复核项
            },
            confirmSendDays: [],


            siteCode: null,
            scName: null,

            editObj: {},
            timeout:  null,

            /**自定义站点 */
            innerVisible: false, // 嵌套对话框

            inspSiteTreeList: [], // 站点范围选择
            selectedKey: null,
            filterText: null,
            showTitle: true,
            tooltipTitle: "",
            highlightBd: true,

            // 全选
            treeCheckAll: false,

            yxxNum: 0,

            
            // 筛选
            checkAll: false,
            checkedCities: [], // 已选择项
            cities: [], // 数据源
            isIndeterminate: false,

            siteCodes: [], // 左侧组织单位集合
            siteCodesAll: [],

            // 右侧选中结果
            siteNames: [],

            defaultCheckedKeys: [], // 需要回显的选中节点key数组

            switchS: false,

            tbSiteCode: null,

            treeSiteCode: [],


            mediaSiteNames:[],
            // 非单个禁用
            single3: true,
            // 非多个禁用
            multiple3: true,
            pcTotal: 0,
            excludeSiteCodes: [],

            currentPageData: [],
            
            oldList: [],

            delArr: [],


            ywlxCheckAll: false,
            ywlxIsIndeterminate: false,
            ywlxCheckedCities: [],


            
        };
    },
    watch: {
        siteCode(newVal, oldVal) {
            if(oldVal && newVal !== oldVal){
                // 自定义
                this.cities = []; // 中间筛选
                this.siteNames = []; // 右侧结果
                this.form.siteInfoVos = []; // 提交数据集合
                this.siteNames = [];
                this.checkAll = false;
                this.isIndeterminate = false;
                this.yxxNum = 0;
                this.siteCodesAll = [];
            }
        },
    },
    created() {
        this.open = this.type;
        this.reset();
        
    },
    methods: {
        formatDate: function(timestamp) {
            var date = new Date(timestamp);
            var year = date.getFullYear();
            // var month = date.getMonth() + 1;
            // var day = date.getDate();
            var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
            return year + '-' + month + '-' + day;
        },
        /**任务 */
        // 添加复核任务
        // 发生单位tab
        fsdwChange(item,index){
            this.btnIndex = index;
            this.form.unitType = item.val;
            if(this.openType == 1){
                if(index != 1){
                    this.form.siteInfoVos = [];
                    this.yxxNum = 0;
                }
            }
        },
        zdyChange(){
            this.innerVisible = true;
            console.log(this.form.siteInfoVos,'this.form.siteInfoVos')
            if(this.openType == 2){
                this.getListzd(this.siteCode);
            }else{
                if(!this.form.siteInfoVos || this.form.siteInfoVos.length == 0){
                    this.getListzd(this.siteCode);
                }
            }
        },

        // 表单重置
        reset() {
            this.form = {
                type: 1,
                scType: 1, // 产品类型
                siteType: null, // 客户类型
                siteCode: null, // 站点标识码
                unitType: 3, // 发生单位
                siteInfoVos: [], // 监测的站点 数组
                reviewItems: [], // 业务类型

            };
        },
        // 取消按钮
        cancel() {
            this.reset()
            this.$emit("openS", false);
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm() {
            
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // this.form.siteCode = this.siteCode;
                    this.form.siteCode = this.form.siteCode.split('-').pop();
                    this.form.scName = this.scName;
                    console.log(this.siteNames,'this.confirmedDetailsList')
                    this.form.reviewItems = [];
                    for(var i in this.confirmedDetailsList){
                        if(this.confirmedDetailsList[i].type == true){
                            this.form.reviewItems.push({
                                bizType: this.confirmedDetailsList[i].value,
                                startTime: this.confirmedDetailsList[i].startTime,
                                endTime: this.confirmedDetailsList[i].endTime,
                                allData: this.confirmedDetailsList[i].allData,
                            })
                        }
                    }
                    this.form.siteInfoVos = this.siteNames;
                    console.log(this.form,'表单提交数据')
                    // for(var j in this.form.reviewItems){
                    //     if(this.form.reviewItems[j].allData == 0 && !this.form.reviewItems[j].startTime){
                    //         if(this.form.reviewItems[j].bizType == 30){
                    //             this.$modal.msgWarning("错误内容发现时间和全量必须选择一项");
                    //             return;
                    //         }else if(this.form.reviewItems[j].bizType == 40){
                    //             this.$modal.msgWarning("敏感信息发现时间和全量必须选择一项");
                    //             return;
                    //         }else if(this.form.reviewItems[j].bizType == 50){
                    //             this.$modal.msgWarning("隐私泄露发现时间和全量必须选择一项");
                    //             return;
                    //         }else if(this.form.reviewItems[j].bizType == 20){
                    //             this.$modal.msgWarning("错链信息发现时间和全量必须选择一项");
                    //             return;
                    //         }else if(this.form.reviewItems[j].bizType == 70){
                    //             this.$modal.msgWarning("外链信息发现时间和全量必须选择一项");
                    //             return;
                    //         }else if(this.form.reviewItems[j].bizType == 60){
                    //             this.$modal.msgWarning("规范检查发现时间和全量必须选择一项");
                    //             return;
                    //         }

                    //     }
                    // }
                    console.log(this.form,'表单提交数据')

                    if(this.openType == 1){ // 新增
                        reviewTaskAdd(this.form).then(response => {
                            if(response.data == true){
                                this.diaLoading = true;
                                this.$modal.msgSuccess("添加成功");
                                this.open = false;
                                this.diaLoading = false;
                            }else if(response.data == false){
                                this.$modal.msgWarning(response.msg);  
                                // 触发条件
                                this.confirmedDetailsList = [
                                    { value: 30, label: '错误内容', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 40, label: '敏感信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 50, label: '隐私泄露', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    // { value: 20, label: '错链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 70, label: '外链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    // { value: 60, label: '规范检查', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                ];
                                this.confirmSendDay = [
                                    { value: 30, label: '全量', type: false },
                                    { value: 40, label: '全量', type: false },
                                    { value: 50, label: '全量', type: false },
                                    // { value: 20, label: '全量', type: false },
                                    { value: 70, label: '全量', type: false },
                                    // { value: 60, label: '全量', type: false },
                                ]
                                this.confirmSendDays = [];
                                this.form.reviewItems = [];
                            }
                            
                        });
                    }else if(this.openType == 2){ // 编辑
                        // 判断自定义站点选项是否相同
                        let isSubset = false;
                        if(this.editObj.siteInfoVos && this.editObj.siteInfoVos.length > 0){
                            if(this.form.siteInfoVos.length == this.editObj.siteInfoVos.length){
                                isSubset = this.form.siteInfoVos.every(item => this.editObj.siteInfoVos.includes(item));
                            }else{
                                isSubset = false;
                            }
                            
                        }
                  
                        // 发生单位是否有变化
                        if(this.form.unitType !== this.editObj.unitType || isSubset == true || haveSameNumbers == false){ // 有变化
                            this.form.updateSiteCode = 0;
                        }else{ // 无变化
                            this.form.updateSiteCode = 1;
                        }
                        console.log(this.form.updateSiteCode,'this.form.updateSiteCode')
                        
                        this.form.id = this.editObj.id;
                        console.log(this.form,'表单提交数据-编辑')
                        warnStrategyInfoEdif(this.form).then(response => {
                            if(response.data == true){
                                this.diaLoading = true;
                                this.$modal.msgSuccess("添加成功");
                                this.open = false;
                                this.diaLoading = false;
                            }else if(response.data == false){
                                this.$modal.msgWarning(response.msg);  
                                // 触发条件
                                this.confirmedDetailsList = [
                                    { value: 30, label: '错误内容', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 40, label: '敏感信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 50, label: '隐私泄露', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    // { value: 20, label: '错链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    { value: 70, label: '外链信息', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                    // { value: 60, label: '规范检查', startTime: null, endTime: null, DateArr: [], allData: 0, type: false },
                                ];
                                this.confirmSendDay = [
                                    { value: 30, label: '全量', type: false },
                                    { value: 40, label: '全量', type: false },
                                    { value: 50, label: '全量', type: false },
                                    // { value: 20, label: '全量', type: false },
                                    { value: 70, label: '全量', type: false },
                                    // { value: 60, label: '全量', type: false },
                                ]
                                this.confirmSendDays = [];
                                this.form.reviewItems = [];

                            }
                        });
                    }
                    
                }
            });
        },
        
        // 业务类型
        confirmedDetailsChange(event,index){
            console.log(event,'event')
            this.confirmSendDay[index].type = event;
            this.confirmedDetailsList[index].type = event;

            const checkedCount = this.confirmedDetailsList.filter(item => item.type === true).length;
            this.ywlxCheckAll = checkedCount === this.confirmedDetailsList.length;
            this.ywlxIsIndeterminate = checkedCount > 0 && checkedCount < this.confirmedDetailsList.length;
            
        },
        // 全选
        ywlxHandleCheckAllChange(val) {
            console.log(val,'val')
            this.form.reviewItems = val ? this.confirmSendDay.map(item => item.value) : [];
            this.ywlxIsIndeterminate = false;
            // this.confirmSendDay = this.confirmSendDay.filter(item=>{item.type = !val})
            this.confirmedDetailsList.forEach(item => { item.type = val })
            this.confirmSendDay.forEach(item => { item.type = val })
        },
        // 是否全量
        qlChange(event,index){
            if(event == true){
                this.confirmedDetailsList[index].allData = 1;
            }else{
                this.confirmedDetailsList[index].allData = 0;
            }
        },
        // 发生时间
        sjChange(item,index){
            if(item.DateArr){
                this.confirmedDetailsList[index].startTime = this.formatDate(this.confirmedDetailsList[index].DateArr[0]) + ' 00:00:00';
                this.confirmedDetailsList[index].endTime = this.formatDate(this.confirmedDetailsList[index].DateArr[1]) + ' 23:59:59';
            }else{
                this.confirmedDetailsList[index].startTime = null;
                this.confirmedDetailsList[index].endTime = null;
            }
            console.log(this.confirmedDetailsList,'confirmedDetailsList')
        },
        // 客户类型点击
        siteTypeChange(){
            this.form.siteCode = null;
            if(this.form.siteType && this.form.siteType == 2){  // 填报单位
                this.form.unitType = 1;
                this.btnIndex = 0;
                this.unitTypeType = true;
            }else if(this.form.siteCode){  // 组织单位
                this.unitTypeType = false;
            }
        },
        querySearchAsync(queryString, callBack) {
            if(queryString){
                let data = {
                    pgNum: 1,
                    pgSize: 5,
                    likeSiteOrName: queryString,
                    siteType: this.form.siteType
                }
                getInspSiteTreeList(data).then((res)=>{
                    this.treeInfoDate = [];
                    for(var i in res.data){
                        this.treeInfoDate.push({
                            value: res.data[i].unitName + '-' + res.data[i].siteCode,
                            siteCode: res.data[i].siteCode,
                            label: res.data[i].unitName,
                        })
                    }
                    console.log(this.treeInfoDate,'treeInfoDatetreeInfoDatetreeInfoDate')
                })
                clearTimeout(this.timeout3);
                this.timeout3 = setTimeout(() => {
                    callBack(this.treeInfoDate);
                }, 3000 * Math.random());
            }
        },
        // 父级标识码
        handleSelectCompany(val){
            console.log(val,'valval')
            // this.form.siteCode = val.siteCode;
            this.siteCode = val.siteCode;
            this.scName = val.label;
            if(this.form.siteType == 1){
                this.unitTypeType = false;
            }else if(this.form.siteType == 2){
                this.unitTypeType = true;
            }

        },



        /**自定义站点 */
        // 站点范围选择
        getListzd(parentSite) {
            this.treeLoading = true;
            // this.loading = true;
            let date = {siteCode: parentSite}
            getOrganizationUnit(date).then(response => {
                this.inspSiteTreeList = [];
                setTimeout(()=>{
                    this.inspSiteTreeList = response.data;
                    for(var i in this.inspSiteTreeList){
                        this.inspSiteTreeList[i].treeCheck = false;
                    }
                    this.treeLoading = false;
                },100)
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleNodeClick(data, node) {
            this.queryFrom.pgNum = 1;
            // this.queryFrom.ancestorsFind = data.siteCode;
            this.queryFrom.ancestorsFind = data.ancestors+data.siteCode+',';
            this.getList();
        },
        // 自定义单位-树点击复选框
        handleCheckChange(data, checked, indeterminate) {
            if(checked == true){
                this.siteCodesAll.push(data.siteCode)
            }else{
                this.siteCodesAll = this.siteCodesAll.filter(item => item !== data.siteCode);
                // this.form.siteInfoVos = [];
            }
            this.siteCodesAll = [...new Set(this.siteCodesAll)];
            if(this.siteCodesAll.length == 0){
                this.siteNames = [];
                this.form.siteInfoVos = [];
            }
            if(this.switchS == false){
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.scType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    // this.form.siteInfoVos = [];
                    // this.siteNames = [];
                })
            }
        },
        // 全选
        treeChange(node, data){
            // 自定义逻辑
            data.treeCheck = !data.treeCheck;
        },
        handleCheckboxChange(checked, node, data) {
            this.$refs.tree.setChecked(data.siteCode, checked);
            this.switchS = true;    
            let arr = [];   
            if(checked == true){

                arr = this.collectVals(data.children);
                for(var i in arr){
                    this.siteCodesAll.push(arr[i])
                }
                this.siteCodesAll.unshift(data.siteCode)
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                this.updateChildrenChecked(data, checked);
                this.syncTreeCheckedState(1);
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteInfoVos = [];
                }
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.scType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    this.switchS = false;
                })
                
            }else{
                arr = this.collectVals(data.children);
                if(arr.length == 0){
                    arr.push(data.siteCode)
                }
                this.siteCodesAll = this.siteCodesAll.filter(item => !arr.includes(item));
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                // this.switchS = false;
                // this.siteCodesAll = [];
                if(data.siteCode == this.form.siteCode){
                    this.$nextTick(() => {
                        this.updateChildrenChecked(data, checked);
                        this.syncTreeCheckedState(2);
                        this.siteCodesAll = [];
                    });
                }
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteInfoVos = [];
                }
                this.$nextTick(() => {
                    this.updateChildrenChecked(data, checked);
                    this.syncTreeCheckedState(2);
                    getUnit({siteCodes: this.siteCodesAll,codeType: this.form.scType}).then((res)=>{
                        this.cities = [];
                        this.cities = res.data;
                        this.checkAll = false;
                        this.switchS = false;
                    })
                });

            }
        },
        // 递归更新子节点的checked状态
        updateChildrenChecked(node, checked) {
            if (node.children && node.children.length) {
                node.children.forEach(child => {
                    // child.checked = checked;
                    this.$set(child, 'checked', checked);
                    this.updateChildrenChecked(child);
                });
                this.$forceUpdate();  // 强制当前组件重新渲染

            }
        },
        // 同步到树组件的选中状态
        syncTreeCheckedState(type) {
            const checkedNodes = this.getCheckedNodes(this.inspSiteTreeList);
            const checkedKeys = checkedNodes.map(node => node.siteCode);
            this.$refs.tree.setCheckedKeys(checkedKeys);
        },
        // 获取所有checked为true的节点
        getCheckedNodes(nodes) {
            let result = [];
            nodes.forEach(node => {
                if (node.checked) {
                    result.push(node);
                }
                if (node.children && node.children.length) {
                    result = result.concat(this.getCheckedNodes(node.children));
                }
            });
            return result;
        },
        collectVals(arr, result = []) {
            arr.forEach(item => {
                result.push(item.siteCode);
                if (item.children && item.children.length > 0) {
                    this.collectVals(item.children, result);
                }
            });
            return result;
        },
        
        // 划过获取字数 用于是否显示黑框提示
        onShowNameTipsMouseenter(e) {
            // console.log(e,'e')
            var target = e.target;
            let textLength = target.clientWidth;
            let containerLength = target.scrollWidth;
            if (textLength < containerLength) {
                this.tooltipTitle = e.target.innerText;
                this.showTitle = false;
            } else {
                this.showTitle = true;
            }
        },
        // 左侧树搜索
        siteCodeSearch(){
            console.log('ok')
            // tbSiteCode
            getUnit({siteCodes: this.siteCodesAll,name: this.tbSiteCode,codeType: this.form.scType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
            
        },
        // 清空树搜索条件
        clearSearch(){
            getUnit({siteCodes: this.siteCodesAll,name: null,codeType: this.form.scType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
        },
        // 确定
        submitForm2(){
            this.innerVisible = false;
            this.yxxNum = this.form.siteInfoVos.length;
        },
        // 取消
        cancel2(){
            this.innerVisible = false;
            this.yxxNum = this.form.siteInfoVos.length;
            
            if(this.yxxNum == 0){
                this.form.siteInfoVos = [];
            }
        },

        
        /**自定义站点 */
        // 筛选
        handleCheckAllChange(val) {
            // this.form.siteInfoVos = val ? this.cities : [];
            this.form.siteInfoVos = this.checkAll ? this.cities.map(item => item.siteCode) : [];
            this.isIndeterminate = false;

            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteInfoVos){
                    if(this.form.siteInfoVos[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        // 单个点击
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteInfoVos){
                    if(this.form.siteInfoVos[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        /**右侧 */
        // 单个删除
        delSiteNames(item,index){
            this.siteNames.splice(index,1);
            let arr = [];
            for(var i in this.cities){
                if(item.siteCode == this.form.siteInfoVos[i]){
                    this.form.siteInfoVos.splice(i,1)
                }
            }
            this.isIndeterminate = this.form.siteInfoVos.length > 0 && this.form.siteInfoVos.length < this.cities.length;
        },
        // 全部删除
        clearSiteNames(){
            this.form.siteInfoVos = [];
            this.siteNames = [];
            this.isIndeterminate = this.form.siteInfoVos.length > 0 && this.form.siteInfoVos.length < this.cities.length;
            this.checkAll = false;
        },

        
    }
};
</script>
<style scoped lang="scss">
    .box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    .marginClass{
        margin-left: 1%;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .sxw{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .wtjb{
        display: block;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .yd{
        display: inline-block;
        width: 7px;
        height: 7px;
        background: red;
        border-radius: 100%;
        margin-right: 10px;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }

    .spClass,.spClass2{
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        // margin-top: 10px;
    }
    .spClass2{
        font-weight: normal;
    }
    .dxDiv{
        position: absolute;
        top: 25px;
        left: 24px;
        font-size: 13px;
        
    }
    .dxDivBox,.dxDivBox2,.dxDivBox3,.dxDivBox4,.dxDivBox5,.dxDivBox6,.dxDivBox7,.dxDivBox8,.dxDivBox10,.dxDivBox11,.dxDivBox12,.dxDivBox13,.dxDivBox14{
        display: flex;
        align-items: center;
        position: absolute;
        top: 52px;
        left: 25px;
        font-size: 13px;
    }
    .dxDivBox2{
        top: 112px;
    }
    .dxDivBox3{
        top: 174px;
    }
    
    .dxDivBox4{
        top: 237px;
    }
    .dxDivBox5{
        top: 300px;
    }
    .dxDivBox6{
        top: 350px;
    }
    .dxDivBox7{
        top: 400px;
    }
    .dxDivBox8{
        top: 450px;
    }
    // 新媒体
    .dxDivBox11{
        top: 114px;
    }
    .dxDivBox12{
        top: 164px;
    }
    .dxDivBox13{
        top: 217px;
    }
    .dxDivBox14{
        top: 267px;
    }
    .khxx{
        color: #1890ff;
        background: rgba(24,144,255,.2);
        padding: 2px;
        border-radius: 3px;
        font-size: 12px;
        padding-left: 6px;
        span{
            display: block;
        }
    }
    .x{
        color: red;
        margin-right: 5px;
        position: relative;
        top: 2px;
    }
    .sjdBox{
        display: flex;
        justify-content: space-between;
        .zhi{
            position: relative;
            top: 8px;
        }
    }
    .marginClass{
        margin-top: 35px;
    }

    // 自定义站点
    .divLeft{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .treeDiv{
            flex: 1;
            overflow: auto;
             -ms-overflow-style: none;  /* IE 和 Edge */
            scrollbar-width: none;     /* Firefox */
        }
    }
    .tit{
        color: red;
        font-size: 11px;
        margin-left: -5px;
    }
    .divBox,.pcBox{
        width: 100%;
        height: 61vh;
        display: flex;
        // justify-content: space-between;
    }
    .divLeft{
        width: 300px;
        padding-right: 10px;
        border-right: 1px solid #C0C4CC;
    }
    .divCen{
        border-right: 1px solid #C0C4CC;
        width: 350px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .pcCen{
        width: 470px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-right: 1px solid #C0C4CC;
        padding: 0 10px;

    }
    .pcRight{
        width: 450px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .pcTable{
        flex: 1;
        overflow: auto;
        margin-bottom: 8px;
    }
    .divRight{
        width: 350px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .divRightT{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }
    .divRightTC{
        flex: 1;
        overflow: auto;
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;     /* Firefox */
        .jgLi{
            line-height: 32px;
            border-bottom: 1px solid #C0C4CC;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .jgLiL{
                width: 90%;
                white-space: nowrap;      /* 禁止换行 */
                overflow: hidden;         /* 隐藏溢出内容 */
                text-overflow: ellipsis;  /* 显示省略号 */
                display: flex;
                align-items: center;
                img{
                    width: 20px;
                    margin-right: 5px;
                    border-radius: 100%;
                }
            }
        }
    }
    .dxBox{
        display: flex;
        justify-content: space-between;
        .spsp1{
            flex: 1;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
            margin-right: 10px;
        }
    }
    .divCenC{
        flex: 1;
        overflow: auto;
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;     /* Firefox */
        margin: 10px 0;
        overflow-x: hidden;
    }
    .divCenCT{
        display: flex;
        justify-content: right;
    }
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        // margin-right: 20px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label{
            flex: 1;
            margin-right: 10px;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
        }
    }
    .qxBox{
        display: flex;
        align-items: center;
        .qxBoxK{
            font-size: 14px;
            color: #606266;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        span{
            display: inline-block;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            background-color: #FFFFFF;
            z-index: 1;
            position: relative;
            top: 0;
            left: -5px;
            font-size: 12px;
        }
    }
    .dxxzClass{
        color: #ffffff;
        background-color: #1890ff;
        border-color: #1890ff;
    }

    /* 排除站点*/
    .zhxx{
        display: flex;
        align-items: center;
    }
    .icoSp{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        overflow: hidden;
        background: #ffffff;
        margin-right: 5px;
    }
    .ico{
        width: 100%;
        border-radius: 100%;
    }
</style>
<style scoped>
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 10vh !important;
        max-height: 75vh!important;
    }
    /deep/ .el-dialog__body{
        /* padding-top: 10px;
        padding-bottom: 10px; */
        padding: 10px 45px;
    }
    /deep/.el-form-item__content{
        /* z-index: 20; */
    }
    /deep/.el-form-item__error{
        top: 100%!important;
    }
    /deep/.cftjClass .el-form-item__error{
        top: 103%!important;
    }
    /deep/.dwxxjsBox .el-form-item__error{
        top: 72%!important;
    }


    /* 自定义站点 */
    /deep/.zdyBox .el-dialog__body{
        overflow: hidden!important;
    }
    /deep/.divCenC .el-checkbox{
        margin-left: 0!important;
        margin-top: 5px!important;
    }
    /deep/.divCenC .el-checkbox__label{
        width: 95%!important;
    }
    /deep/.el-tree-node {
        overflow: hidden!important;
    }


    /deep/.divCenC .el-empty{
        margin-top: 35%!important;
       
    }
    /deep/.divRightTC .el-empty{
        margin-top: 45.9%!important;
    }

    /deep/.pagination-container{
        padding: 0!important;
    }
    /deep/.el-pagination{
        display: flex;
        justify-content: right;
    }
</style>