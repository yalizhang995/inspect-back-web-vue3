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
                <!-- <el-form-item label="主管单位" prop="">
                    <el-autocomplete
                        v-model="queryParams.treeInfo.psCode"
                        :fetch-suggestions="querySearchAsync2"
                        placeholder="请输入内容"
                        clearable
                        style="width:310px"
                        @select="handleSelectCompany2"
                    ></el-autocomplete>
                </el-form-item>                 -->
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
                <el-form-item label="网站名称" prop="scName">
                    <el-input
                        v-model="queryParams.scName"
                        placeholder="请输入网站名称"
                        clearable
                        @keyup.enter.native="handleQuery"
                        style="width:310px"
                    />
                </el-form-item>
                <el-form-item label="任务状态" prop="status">
                    <el-select v-model="queryParams.status" clearable placeholder="请选择任务状态" style="width:310px">
                        <el-option
                            v-for="item in statusList"
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
                <el-form-item label="结束时间" prop="">
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
                <el-form-item label="发起人" prop="createBy">
                    <el-input
                        v-model="queryParams.createBy"
                        placeholder="请输入发起人"
                        clearable
                        @keyup.enter.native="handleQuery"
                        style="width:310px"
                    />
                </el-form-item>
                <el-form-item style="marginLeft:8px">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" @click="addReview">新增复核任务</el-button>
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
                <!-- <el-table-column type="selection" width="50" align="center" /> -->
                <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="siteTypeTxt" label="单位类型" min-width="120"></el-table-column>
                <el-table-column prop="scName" label="网站名称" min-width="220" show-overflow-tooltip/>
                <el-table-column prop="unitTypeTxt" label="发生单位" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="statusTxt" label="任务状态" min-width="100" align="center"></el-table-column>
                <el-table-column prop="typeTxt" label="任务类型" min-width="100" align="center"></el-table-column>
                <el-table-column prop="taskErrorTxt" label="是否异常" min-width="100" align="center"></el-table-column>
                <!-- <el-table-column prop="enabledTxt" label="是否启用" min-width="100" align="center">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabledType" @change="enabledChange(scope.row)"></el-switch>
                    </template>
                    
                </el-table-column> -->
                <el-table-column label="错误内容" align="center">
                    <el-table-column prop="wordWait" label="待复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '30' , 1)">{{scope.row.wordWait}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="wordOver" label="已复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '30', 3)">{{scope.row.wordOver}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="wordError" label="复核异常数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '30', 4)">{{scope.row.wordError}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="wordTotal" label="总数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '30', null)">{{scope.row.wordTotal}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="敏感信息" align="center">
                    <el-table-column prop="senWait" label="待复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '40', 1)">{{scope.row.senWait}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="senOver" label="已复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '40', 3)">{{scope.row.senOver}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="senError" label="复核异常数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '40', 4)">{{scope.row.senError}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="senTotal" label="总数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '40', null)">{{scope.row.senTotal}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="隐私泄露" align="center">
                    <el-table-column prop="priWait" label="待复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '50', 1)">{{scope.row.priWait}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="priOver" label="已复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '50', 3)">{{scope.row.priOver}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="priError" label="复核异常数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '50', 4)">{{scope.row.priError}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="priTotal" label="总数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '50', null)">{{scope.row.priTotal}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- <el-table-column label="错链信息" align="center">
                    <el-table-column prop="errWait" label="待复核数" width="100" align="center"></el-table-column>
                    <el-table-column prop="errOver" label="已复核数" width="100" align="center"></el-table-column>
                    <el-table-column prop="errError" label="复核异常数" width="100" align="center"></el-table-column>
                    <el-table-column prop="errTotal" label="总数" width="100" align="center"></el-table-column>
                </el-table-column> -->
                <el-table-column label="外链信息" align="center">
                    <el-table-column prop="extWait" label="待复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '70', 1)">{{scope.row.extWait}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="extOver" label="已复核数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '70', 3)">{{scope.row.extOver}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="extError" label="复核异常数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '70', 4)">{{scope.row.extError}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="extTotal" label="总数" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="hoverClass" style="width: 100%;height: 100%;display: block;" @click="handleInfo(scope.row, '70', null)">{{scope.row.extTotal}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <!-- <el-table-column label="规范检查" align="center">
                    <el-table-column prop="reqWait" label="待复核数" width="100" align="center"></el-table-column>
                    <el-table-column prop="reqOver" label="已复核数" width="100" align="center"></el-table-column>
                    <el-table-column prop="reqError" label="复核异常数" width="100" align="center"></el-table-column>
                    <el-table-column prop="reqTotal" label="总数" width="100" align="center"></el-table-column>
                </el-table-column> -->
                <el-table-column prop="idStr" label="主任务ID" min-width="220" ></el-table-column>
                <el-table-column prop="createBy" label="创建人" min-width="120"/>
                <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" min-width="160"></el-table-column>            
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="180" fixed="right">
                    <template slot-scope="scope" >
                        <el-button size="mini" type="text" icon="el-icon-document-copy" @click="handleChildren(scope.row)">子任务</el-button>
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleInfo(scope.row, '30', null)">详情</el-button>
                        <el-button size="mini" type="text" icon="el-icon-coordinate" @click="handleEnd(scope.row)" :disabled="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4">结束</el-button>
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
        <!-- 任务 -->
        <reviewDialog :type="typeVal" :obj="editObj" :openType="openTypeVal" v-if="typeVal" @openS= "TypeValOpenS"></reviewDialog>
    </div>
</template>

<script>
import {
    getReviewTaskList,
    reviewTaskEnd
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
import reviewDialog from './reviewDialog.vue'

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "InspSiteInfo",
    components: {
        Treeselect,
        reviewDialog
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
                pid: 0,
                siteCode: null, // 网站标识码
                scName: null, // 网站名称
                status: null, // 任务状态
                createBy: null, // 发起人
                createTimeStart: null, // 创建-开始时间
                createTimeEnd: null, // 创建-结束时间
                endTimeStart: null, // 结束-开始时间
                endTimeEnd: null, // 结束-结束时间
            },

            DateArr: [],
            DateArr2: [],

            /**下拉菜单数据 */
            // 任务状态
            statusList: [ 
                { label: '待开始', val: 0 },
                { label: '运行中', val: 1 },
                { label: '自动结束', val: 2 },
                { label: '异常', val: 3 },
                { label: '手动结束', val: 4 },

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
            
        };
    },
    created() {
        this.getList();
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
            getReviewTaskList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    
                    // 单位类型
                    if(this.inspSiteInfoList[i].siteType == 1){
                        this.inspSiteInfoList[i].siteTypeTxt = '组织单位';
                    }else if(this.inspSiteInfoList[i].siteType == 2){
                        this.inspSiteInfoList[i].siteTypeTxt = '填报单位';
                    }
                    // 发生单位
                    if(this.inspSiteInfoList[i].unitType == 1){
                        this.inspSiteInfoList[i].unitTypeTxt = '本级填报单位';
                    }else if(this.inspSiteInfoList[i].unitType == 2){
                        this.inspSiteInfoList[i].unitTypeTxt = '自定义单位';
                    }else if(this.inspSiteInfoList[i].unitType == 3){
                        this.inspSiteInfoList[i].unitTypeTxt = '全部单位';
                    }
                    // 任务状态
                    if(this.inspSiteInfoList[i].status == 0){
                        this.inspSiteInfoList[i].statusTxt = '待开始';
                    }else if(this.inspSiteInfoList[i].status == 1){
                        this.inspSiteInfoList[i].statusTxt = '运行中';
                    }else if(this.inspSiteInfoList[i].status == 2){
                        this.inspSiteInfoList[i].statusTxt = '自动结束';
                    }else if(this.inspSiteInfoList[i].status == 3){
                        this.inspSiteInfoList[i].statusTxt = '异常';
                    }else if(this.inspSiteInfoList[i].status == 4){
                        this.inspSiteInfoList[i].statusTxt = '手动结束';
                    }
                    // 任务类型
                    if(this.inspSiteInfoList[i].type == 0){
                        this.inspSiteInfoList[i].typeTxt = '系统默认';
                    }else if(this.inspSiteInfoList[i].type == 1){
                        this.inspSiteInfoList[i].typeTxt = '运营';
                    }else if(this.inspSiteInfoList[i].type == 2){
                        this.inspSiteInfoList[i].typeTxt = '用户';
                    }
                    // 是否异常
                    if(this.inspSiteInfoList[i].taskError == 0){
                        this.inspSiteInfoList[i].taskErrorTxt = '否';
                    }else if(this.inspSiteInfoList[i].taskError == 1){
                        this.inspSiteInfoList[i].taskErrorTxt = '是';
                    }else{
                        this.inspSiteInfoList[i].taskErrorTxt = '--';
                    }
                    // 结束时间
                    if(!this.inspSiteInfoList[i].endTime){
                        this.inspSiteInfoList[i].endTime = '--';
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
                this.queryParams.createTimeStart = this.DateArr[0];
                this.queryParams.createTimeEnd = this.DateArr[1];
                if(this.queryParams.createTimeStart){
                    this.queryParams.createTimeStart = this.formatDate(this.queryParams.createTimeStart) + ' 00:00:00';
                }
                if(this.queryParams.createTimeEnd){
                    this.queryParams.createTimeEnd = this.formatDate(this.queryParams.createTimeEnd) + ' 23:59:59';
                }
            }
            if(this.DateArr2){
                this.queryParams.endTimeStart = this.DateArr2[0];
                this.queryParams.endTimeEnd = this.DateArr2[1];
                if(this.queryParams.endTimeStart){
                    this.queryParams.endTimeStart = this.formatDate(this.queryParams.endTimeStart) + ' 00:00:00';
                }
                if(this.queryParams.endTimeEnd){
                    this.queryParams.endTimeEnd = this.formatDate(this.queryParams.endTimeEnd) + ' 23:59:59';
                }
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.createTimeStart = null; // 开始时间
            this.queryParams.createTimeEnd = null; // 结束时间
            this.DateArr2 = [];
            this.queryParams.endTimeStart = null; // 开始时间
            this.queryParams.endTimeEnd = null; // 结束时间
            this.resetForm("queryForm");
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

        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.createTimeStart = null;
                this.queryParams.createTimeEnd = null;
            }
        },
        sjrqChange2(val){
            console.log(val)
            if(val == null){
                this.DateArr2 = [];
                this.queryParams.endTimeStart = null;
                this.queryParams.endTimeEnd = null;
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
        addReview(){
            this.typeVal = true;
            this.openTypeVal = 1;
        },
        // 子->父
        TypeValOpenS(val){
            this.typeVal = val;
            this.getList();
        },

        // /**查看日志 */
        handleSeeLog(row){
            sessionStorage.setItem('warnLogId', row.id);
            // window.location.href = '/basic/inspSiteDirector';
            this.$router.push({name:'warnSendLog'})
        },


        // 结束任务
        handleEnd(row){
            this.$modal
                .confirm('是否确认结束该任务？')
                .then(function() {
                    return reviewTaskEnd({idStr:row.idStr});
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("操作成功");
                })
                .catch(() => {});
        },
        // 子任务
        handleChildren(row){
            // this.$router.push()
            sessionStorage.setItem('childreId', row.idStr);
            this.$router.push({path:'/review/indexChildren'}) 
        },
        
        // 详情
        handleInfo(row, typeVal, reviewStateVal){
            // this.$router.push()
            sessionStorage.setItem('taskObj', JSON.stringify(row)) // 对象
            sessionStorage.setItem('numType', typeVal); // 详情tab
            sessionStorage.setItem('goInfoType', 1); // 主子任务区分
            sessionStorage.setItem('reviewStateVal', reviewStateVal); // 任务状态
            this.$router.push({path:'/review/reviewTaskInfo'})
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

    .hoverClass:hover{
        cursor: pointer;
        color: #1890ff;
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