<template>
    <div class="app-container errorsPage" >
        <!-- 正常展示 -->
        <div>
            <el-form
                :model="queryParams"
                ref="queryForm"
                size="small"
                :inline="true"
                v-show="showSearch"
                label-width="90px"
            >
                <el-form-item label="主管单位" prop="">
                    <el-autocomplete
                        v-model="queryParams.treeInfo.psCode"
                        :fetch-suggestions="querySearchAsync2"
                        placeholder="请输入内容"
                        clearable
                        style="width:310px"
                        @select="handleSelectCompany2"
                    ></el-autocomplete>
                </el-form-item>                
                <el-form-item label="网站标识码" prop="siteCode">
                    <el-autocomplete
                        v-model="queryParams.siteCode"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        clearable
                        style="width:310px"
                        @select="handleSelectCompany"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="产品类型" prop="productType">
                    <el-select v-model="queryParams.productType" clearable placeholder="请选择产品类型" style="width:310px">
                        <el-option
                            v-for="item in productTypeList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户名称" prop="customerInformation">
                    <el-input
                        v-model="queryParams.customerInformation"
                        placeholder="请输入客户名称"
                        clearable
                        @keyup.enter.native="handleQuery"
                        style="width:310px"
                    />
                </el-form-item>
                <el-form-item label="是否启用" prop="enabled">
                    <el-select v-model="queryParams.enabled" clearable placeholder="请选择是否启用" style="width:310px">
                        <el-option
                            v-for="item in enabledList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间" prop="">
                    <el-date-picker
                        v-model="DateArr"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="sjrqChange"
                        style="width:310px"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="修改时间" prop="">
                    <el-date-picker
                        v-model="DateArr2"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="sjrqChange2"
                        style="width:310px"
                        >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="marginLeft:8px">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button size="mini" @click="addWran">添加产品预警监控策略</el-button>
                </el-col>
                <el-col :span="1.5">
                     <el-button type="primary" size="mini" @click="addDaily">添加系统报告策略</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange"></right-toolbar>
            </el-row>

            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="inspSiteInfoList"
                @sort-change="sortChange"
                @selection-change="handleSelectionChange"
                fit
            >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="id" label="策略ID" width="80" align="center"></el-table-column>
                <el-table-column prop="productTypeTxt" label="产品类型" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="messageTypeTxt" label="消息类型" min-width="120"></el-table-column>
                <el-table-column prop="customerInformation" label="客户信息" min-width="200" align="" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div class="khxx">
                            <span>{{scope.row.customerInformationL}}</span>
                            <span>{{scope.row.customerInformationR}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="strategyName" label="策略名称" min-width="280" show-overflow-tooltip/>
                <el-table-column prop="occurrenceUnitTxt" label="发生单位" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fromTitleTxt" label="已选/预警项" min-width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz">{{ scope.row.confirmedCount}}/{{scope.row.totalWarning}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sendChannelTxt" label="发送渠道" min-width="100" align="center"></el-table-column>
                <el-table-column prop="enabledTxt" label="是否启用" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabledType" @change="enabledChange(scope.row)"></el-switch>
                    </template>
                    
                </el-table-column>
                <el-table-column prop="updateBy" label="最后操作人" min-width="120"/>
                <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" min-width="160"></el-table-column>            
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="120" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="查看日志" placement="top">
                            <i class="el-icon-view" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                        </el-tooltip> -->
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleSeeLog(scope.row)">查看日志</el-button>
                        
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            />
        </div>
        <!-- 添加或修改站点关系对话框 -->
        <!-- 预警 -->
        <warnDialog :type="typeVal" :obj="editObj" :openType="openTypeVal" v-if="typeVal" @openS= "TypeValOpenS"></warnDialog>
        <!-- 日报 -->
        <dailyPaper :type="typeVal_rb" :obj="editObj" :openType="openTypeVal_rb" v-if="typeVal_rb" @openS= "TypeValOpenS_rb"></dailyPaper>
    </div>
</template>

<script>
import {
    getWarnStrategyInfoList,
    warnStrategyInfoAdd,
    getInspSiteTreeList,
    getInspSiteDirector,
    getInfoList,
    warnStrategyInfoEnabled,
    warnStrategyInfoRemove
} from "@/api/warn/index";
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
import warnDialog from './warnDialog'
import dailyPaper from './dailyPaper'

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "InspSiteInfo",
    components: {
        Treeselect,
        warnDialog,
        dailyPaper
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 站点信息表格数据
            inspSiteInfoList: [],

            activeName: '1',
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                productType: null, // 产品类型
                customerInformation: null, // 客户名称
                enabled: null, // 是否启用
                createTimeStartDate: null, // 创建时间-开始时间
                createTimeEndDate: null, // 创建时间-结束时间
                updateTimeStartDate: null, // 修改时间-开始时间
                updateEndTimeEndDate: null, // 修改时间-结束时间
                messageType: null, // 消息类型
                siteType: null, // 客户类型
            },

            DateArr: [],
            DateArr2: [],

            /**下拉菜单数据 */
            // 产品类型
            productTypeList: [ 
                { label: '网站监测', val: 1 },
                { label: '新媒体监测', val: 2 },
            ],
            // 是否启用
            enabledList: [ 
                { label: '启用', val: 0 },
                { label: '未启用', val: 1 },
            ],
            editObj: {},


            restaurants: [],
            timeout:  null,

            // 添加策略
            typeVal: false,
            openTypeVal: null, // 1.添加 2.修改

            // 添加策略
            typeVal_rb: false,
            openTypeVal_rb: null, // 1.添加 2.修改
            
        };
    },
    created() {
        this.getList();
        if(sessionStorage.getItem('warnId')){
            getInfoList({id:parseInt(sessionStorage.getItem('warnId'))}).then(response => {
                this.editObj = response.data;
                this.typeVal = true;
                this.openTypeVal = 2;
            });
        }else if(sessionStorage.getItem('dailyId')){
            getInfoList({id:parseInt(sessionStorage.getItem('dailyId'))}).then(response => {
                this.editObj = response.data;
                this.typeVal_rb = true;
                this.openTypeVal_rb = 2;
            });
        }
    },
     beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        this.typeVal = false;
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('warnId')
        sessionStorage.removeItem('dailyId')
        next();

    },
    methods: {
        upHeightChange(val){
            if(this.inspSiteInfoList.length > 0){
                this.upHeightType = val;                
            }
        },
        upHeightOldChange(){
            this.upHeightType = false;
        },
        formatDate: function(timestamp) {
            var date = new Date(timestamp);
            var year = date.getFullYear();
            // var month = date.getMonth() + 1;
            // var day = date.getDate();
            var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
            return year + '-' + month + '-' + day;
        },
        // 启用，禁用
        enabledChange(item){
            // item.enabled = !item.enabled;
            let onlEnabled = item.enabled;
            let enabled = null;
            let enabledTit = null;
            if(onlEnabled == false){
                enabled = 1;
                enabledTit = '禁用成功'
            }else{
                enabled = 0;
                enabledTit = '启用成功'
            }
            let subDate = {
                id: item.id,
                enabled: enabled
            }
            console.log(subDate,'subDate')
            warnStrategyInfoEnabled(subDate).then((res)=>{
                if(res.code == 200){
                    this.$modal.msgSuccess(enabledTit);
                    this.getList();
                }
            })
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            getWarnStrategyInfoList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    
                    // 产品类型
                    if(this.inspSiteInfoList[i].productType == 1){
                        this.inspSiteInfoList[i].productTypeTxt = '网站监测';
                    }else if(this.inspSiteInfoList[i].productType == 2){
                        this.inspSiteInfoList[i].productTypeTxt = '新媒体监测';
                    }
                    // 消息类型
                    if(this.inspSiteInfoList[i].messageType == 1){
                        this.inspSiteInfoList[i].messageTypeTxt = '产品预警';
                    }else if(this.inspSiteInfoList[i].messageType == 2){
                        this.inspSiteInfoList[i].messageTypeTxt = '系统报告';
                    }
                    // 发送渠道
                    if(this.inspSiteInfoList[i].sendChannel == 1){
                        this.inspSiteInfoList[i].sendChannelTxt = '短信';
                    }else if(this.inspSiteInfoList[i].sendChannel == 2){
                        this.inspSiteInfoList[i].sendChannelTxt = '微信公众号';
                    }else if(this.inspSiteInfoList[i].sendChannel == 3){
                        this.inspSiteInfoList[i].sendChannelTxt = '邮箱';
                    }
                    // 是否启用
                    if(this.inspSiteInfoList[i].enabled == 0){
                        this.inspSiteInfoList[i].enabledTxt = '启用';
                        this.inspSiteInfoList[i].enabledType = true;
                    }else if(this.inspSiteInfoList[i].enabled == 1){
                        this.inspSiteInfoList[i].enabledTxt = '未启用';
                        this.inspSiteInfoList[i].enabledType = false;
                    }
                    // 客户信息
                    this.inspSiteInfoList[i].customerInformationL = this.inspSiteInfoList[i].customerInformation.split(',')[0];
                    this.inspSiteInfoList[i].customerInformationR = this.inspSiteInfoList[i].customerInformation.split(',')[1];
                    // 修改时间
                    if(!this.inspSiteInfoList[i].updateTime){
                        this.inspSiteInfoList[i].updateTime = '--';
                    }
                    // 最后操作人
                    if(!this.inspSiteInfoList[i].updateBy){
                        this.inspSiteInfoList[i].updateBy = '--';
                    }
                    // 发生单位
                    if(this.inspSiteInfoList[i].occurrenceUnit == 1){
                        this.inspSiteInfoList[i].occurrenceUnitTxt = '本级填报单位'
                    }else if(this.inspSiteInfoList[i].occurrenceUnit == 2){
                        this.inspSiteInfoList[i].occurrenceUnitTxt = '自定义单位'
                    }else if(this.inspSiteInfoList[i].occurrenceUnit == 3){
                        this.inspSiteInfoList[i].occurrenceUnitTxt = '全部单位'
                    }
                    
                }
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /**策略 */
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.DateArr){
                this.queryParams.createTimeStartDate = this.DateArr[0];
                this.queryParams.createTimeEndDate = this.DateArr[1];
                if(this.queryParams.createTimeStartDate){
                    this.queryParams.createTimeStartDate = this.formatDate(this.queryParams.createTimeStartDate) + ' 00:00:00';
                }
                if(this.queryParams.createTimeEndDate){
                    this.queryParams.createTimeEndDate = this.formatDate(this.queryParams.createTimeEndDate) + ' 23:59:59';
                }
            }
            if(this.DateArr2){
                this.queryParams.updateTimeStartDate = this.DateArr[0];
                this.queryParams.updateEndTimeEndDate = this.DateArr[1];
                if(this.queryParams.updateTimeStartDate){
                    this.queryParams.updateTimeStartDate = this.formatDate(this.queryParams.updateTimeStartDate) + ' 00:00:00';
                }
                if(this.queryParams.updateEndTimeEndDate){
                    this.queryParams.updateEndTimeEndDate = this.formatDate(this.queryParams.updateEndTimeEndDate) + ' 23:59:59';
                }
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.batchInfo = null;
            this.queryParams.batchInfo = null;
            this.DateArr = [];
            this.queryParams.createTimeStartDate = null; // 开始时间
            this.queryParams.createTimeEndDate = null; // 结束时间
            this.DateArr2 = [];
            this.queryParams.updateTimeStartDate = null; // 开始时间
            this.queryParams.updateEndTimeEndDate = null; // 结束时间
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            this.queryParams.batchId = null;
            this.handleQuery();
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.id;
            getInfoList({id:id}).then(response => {
                this.editObj = response.data;
                if(row.confirmedDetails == '10' || row.confirmedDetails == '101'){
                    this.typeVal_rb = true;
                    this.openTypeVal_rb = 2;
                }else{
                    this.typeVal = true;
                    this.openTypeVal = 2;
                }
                
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                console.log(ids,'单个')
                this.$modal
                    .confirm('是否确认删除该条数据？')
                    .then(function() {
                        return warnStrategyInfoRemove({ids:[ids]});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }else{
                const ids = this.ids
                console.log(ids,'批量')
                this.$modal
                    .confirm('是否确认删除已选中的数据项？')
                    .then(function() {
                        return warnStrategyInfoRemove({ids:ids});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }
            
        },

        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.createTimeStartDate = null;
                this.queryParams.createTimeEndDate = null;
            }
        },
        sjrqChange2(val){
            console.log(val)
            if(val == null){
                this.DateArr2 = [];
                this.queryParams.updateTimeStartDate = null;
                this.queryParams.updateEndTimeEndDate = null;
            }
        },

        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },
        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            if(order == 'descending'){ // 下
                this.queryParams.orderTypes = [{ code: 1, name: prop }];
                this.getList(); // 列表数据
            }else if(order == 'ascending'){ // 上
                this.queryParams.orderTypes = [{ code: 0, name: prop }];
                this.getList(); // 列表数据
            }else{ // 取消
                this.queryParams.orderTypes = [];
                this.getList(); // 列表数据
            }
        },
        /**搜索条件 */
        // 网站标识码
        querySearchAsync(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.siteCode === '' || this.queryParams.siteCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
                    codeType: 1,
                    likeSiteOrName: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                listInspSiteTree(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.data){
                        this.restaurants.push({
                            value: response.data[i].unitName + '-' + response.data[i].siteCode,
                            siteCode: response.data[i].siteCode,
                        })
                    }
                    
                });
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callBack(this.restaurants);
            }, 3000 * Math.random());
        },
         /**输入框、下拉框事件 */
        // 父级标识码
        handleSelectCompany(val){
            console.log(val,'valval')
            this.queryParams.siteCode = val.siteCode;
        },
        // 主管单位
         querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.treeInfo.psCode === '' || this.queryParams.treeInfo.psCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
                    siteType: 1,
                    likeSiteOrName: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                listInspSiteTree(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.data){
                        this.restaurants.push({
                            value: response.data[i].unitName + '-' + response.data[i].siteCode,
                            siteCode: response.data[i].siteCode,
                        })
                    }
                    
                });
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callBack(this.restaurants);
            }, 3000 * Math.random());
        },
        /**输入框、下拉框事件 */
        // 父级标识码
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.queryParams.treeInfo.psCode = val.siteCode;
        },

        // 添加策略
        addWran(){
            this.typeVal = true;
            this.openTypeVal = 1;
        },
        // 子->父
        TypeValOpenS(val){
            this.typeVal = val;
            this.getList();
        },

        /**日报 */
        addDaily(){
            this.typeVal_rb = true;
            this.openTypeVal_rb = 1;
        },
        // 子->父
        TypeValOpenS_rb(val){
            this.typeVal_rb = val;
            this.getList();
        },


        // /**查看日志 */
        handleSeeLog(row){
            sessionStorage.setItem('warnLogId', row.id);
            // window.location.href = '/basic/inspSiteDirector';
            this.$router.push({name:'warnSendLog'})
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
        color: #9ACD32;
        border: 1px solid #9ACD32;
        padding: 1px 8px;
        border-radius: 10px;
        background: rgba(188, 238, 104, 0.2)
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

    .spClass{
        display: block;
        margin-bottom: 5px;
    }
    .dxDiv{
        position: absolute;
        top: 25px;
        left: 24px;
        font-size: 13px;
        
    }
    .dxDivBox,.dxDivBox2,.dxDivBox3,.dxDivBox4,.dxDivBox5,.dxDivBox6{
        display: flex;
        align-items: center;
        position: absolute;
        top: 60px;
        left: 25px;
        font-size: 13px;
    }
    .dxDivBox2{
        top: 120px;
    }
    .dxDivBox3{
        top: 182px;
    }
    .dxDivBox4{
        top: 245px;
    }
    .dxDivBox5{
        top: 305px;
    }
    .dxDivBox6{
        top: 365px;
    }
    .khxx{
        color: #1890ff;
        background: rgba(24,144,255,.2);
        padding: 2px;
        border-radius: 3px;
        font-size: 12px;
        padding-left: 6px;
        cursor: pointer;
        span{
            display: block;
            display: -webkit-box; /* 设置为WebKit内核的弹性盒子模型 */
            -webkit-box-orient: vertical; /* 垂直排列 */
            -webkit-line-clamp: 1; /* 限制显示两行 */
            overflow: hidden; /* 隐藏超出范围的内容 */
            text-overflow: ellipsis; /* 使用省略号 */
        }
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
        padding-top: 10px;
        padding-bottom: 10px;
    }
    /deep/.el-form-item__content{
        /* z-index: 20; */
    }
</style>