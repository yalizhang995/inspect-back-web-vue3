<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
        >
            <el-form-item label="站点信息" prop="">
                <el-autocomplete
                    v-model="queryParams.treeInfo.psCode"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入组织填报单位名称或标识码"
                    clearable
                    style="width:300px"
                    @select="handleSelectCompany"
                ></el-autocomplete>
            </el-form-item> 
            <el-form-item label="新媒体标识码" prop="siteCodeMedia">
                <el-autocomplete
                    v-model="queryParams.siteCodeMedia"
                    :fetch-suggestions="querySearchAsync2"
                    placeholder="请输入内容"
                    clearable
                    style="width:300px"
                    @select="handleSelectCompany2"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="账号信息" prop="accountNameLike">
                <el-input
                    v-model="queryParams.accountNameLike"
                    placeholder="请输入账号信息"
                    clearable
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="账号类型" prop="mediaType">
                <el-select v-model="queryParams.mediaType" clearable placeholder="请选择账号类型" style="width:300px">
                    <el-option
                        v-for="item in zhlxList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="不更新状态" prop="overdueStateIn">
                <el-select multiple collapse-tags v-model="queryParams.overdueStateIn" clearable placeholder="请选择账号类型" style="width:300px" @clear="queryParams.overdueStateIn = []">
                    <el-option
                        v-for="item in overdueStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="监测时间" prop="scaDate">
                <el-date-picker 
                    v-model="queryParams.scanDate" 
                    type="date" 
                    placeholder="选择日期"
                    :picker-options="expireTimeOPtion"
                    :clearable="false"
                    style="width:300px"
                ></el-date-picker>
            </el-form-item>
            
            
            <el-form-item style="marginLeft:18px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteInfoList"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
            row-key="idStr"
            height="500"
        >
            <el-table-column prop="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="accountName" label="账号信息" width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="zhxx">
                        <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                        <span style="cursor: pointer;" @click="goInfo(scope.row)">{{scope.row.accountName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="overdueStateTxt" label="不更新状态" align="center" width="120">
                <template slot-scope="scope">
                    <span class="wtjb"><span class="yd" :style="{background: scope.row.overdueStateBgColor}"></span>{{ scope.row.overdueStateTxt}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="noUpdateDay" label="未更新天数" width="120" align="center" sortable="custom">
                <template slot-scope="scope">
                    <span>{{ scope.row.noUpdateDay}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTitle" label="更新标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.updateUrl)">{{scope.row.updateTitle}}</span>

                </template>
            </el-table-column>
            <el-table-column prop="updateTitle" label="主页地址" show-overflow-tooltip width="100" align="center">
                <template slot-scope="scope">
                    <i class="el-icon-link dz" @click="dzChange(scope.row.homeUrl)"></i>
                </template>
            </el-table-column>
            <el-table-column prop="renewTime" label="最后更新时间" width="160" sortable="custom"></el-table-column>
            <el-table-column prop="scanDate" label="监测时间" width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="修正" placement="top">
                        <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="详情" placement="top">
                        <i class="el-icon-document-copy" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="goInfo(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page-sizes="[100, 200, 500, 1000]"
            :page-size="100"
            :page.sync="queryParams.pgNum"
            :limit.sync="queryParams.pgSize"
            @pagination="getList"
        />
        <!-- 导出 -->
        <el-dialog title="导出数据" :visible.sync="open4" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form4" :model="form4" :rules="rules4" label-width="120px">
                    <el-form-item label="导出方式" prop="type">
                        <el-radio-group v-model="form4.type">
                            <el-radio :label="1">小批量（最多3000条）</el-radio>
                            <el-radio :label="2">大批量</el-radio>
                        </el-radio-group>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm4">确 定</el-button>
                <el-button @click="cancel4">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 修正 -->
        <el-drawer
            title="修正"
            :before-close="cancelForm"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            :wrapperClosable='false'
            >
            <div class="drawerCon">
                <div class="concon">
                    <div class="conTop">
                        <ul class="ul">
                            <li style="font-weight: bold;font-size:18px;marginLeft:0;">{{editObj.accountName}}：<span>{{editObj.siteCodeMedia}}</span></li>
                            <div style="display:flex">
                                <li style="marginRight:15px">监测时间：<span>{{editObj.scanDate}}</span></li>
                                <li style="marginRight:15px">不更新状态：<span :style="{color: upOverdueStateColor}">{{upOverdueStateTxt}}</span></li>
                                <li>未更新天数：<span>{{form.noUpdateDay}}天</span></li>
                            </div>
                            <!-- <li>逾期不更新状态：<span>待审核</span></li> -->
                        </ul>
                    </div>
                    <el-form ref="formform" :model="form" :rules="rules" label-width="120px" style="marginTop:20px">
                        <el-form-item label="更新标题" prop="">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 3, maxRows: 10 }"
                                v-model="form.updateTitle"
                                placeholder="请输入更新标题"
                                clearable
                                style="width:90%"
                            />
                        </el-form-item>
                        <el-form-item label="更新地址" prop="updateUrl">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 5, maxRows: 20 }"
                                v-model="form.updateUrl"
                                placeholder="请输入更新地址"
                                clearable
                                style="width:90%"
                            />
                        </el-form-item>

                        <!-- yqbgxztList -->
                        <el-form-item label="最后更新时间" prop="renewTime">
                            <el-date-picker 
                                v-model="form.renewTime" 
                                type="datetime" 
                                :picker-options="pickerOptions"
                                placeholder="选择最后更新时间" 
                                style="width:90%"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="sjChange"></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="demo-drawer__footer" style="text-align:right">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <!-- <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button> -->
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {
    listInspSiteInfo,
    getInfo,
    queryNoUpdateDay,
    updateInspSiteInfo
} from "@/api/media/mediaUpdate";
import { listInspSiteTree,SearchMediaInfo } from "@/api/biz/inspSiteTree";
import { inspOrderInfoQueryList } from "@/api/biz/inspOrderInfo";
import { inspOrderBatchQueryList } from "@/api/biz/inspOrderBatch";
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
    
    data() {
        return {
            expireTimeOPtion: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
            expireTimeOPtion2: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
            selectedDateTime: '', // 绑定的日期时间
            pickerOptions: {
                // 限制日期不能超过今天
                 disabledDate(date) {
                    return date > new Date();
                },
                // 限制时间不能超过当前时间（如果选择的日期是今天）
                // 限制时间不能超过当前时间（如果选择的日期是今天）
                disabledTime(date) {
                    alert(date)
                    if (date && date.getDate() === new Date().getDate()) {
                        const now = new Date();
                        return {
                        disabledHours: () => this.range(0, 24).filter((h) => h > now.getHours()),
                        disabledMinutes: (hour) => {
                            if (hour === now.getHours()) {
                            return this.range(0, 60).filter((m) => m > now.getMinutes());
                            }
                            return [];
                        },
                        disabledSeconds: (hour, minute) => {
                            if (hour === now.getHours() && minute === now.getMinutes()) {
                            return this.range(0, 60).filter((s) => s > now.getSeconds());
                            }
                            return [];
                        },
                        };
                    }
                    return {};
                },
            },
            // 遮罩层
            loading: false,
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,

            activeName: '1',
            // 查询参数
            queryParams: {
                type: 1,
                pgNum: 1,
                pgSize: 100,
                // siteCodeOrg: '', // 标识码-主管
                treeInfo: {'psCode': ''},
                siteCodeIn: [], // 标识码-主办
                // searchKey: 'sc',
                // searchDateKey: 'ct',
                overdueState: null,
                siteCodeMediaLike: null,
                scanDate: this.formatDate(new Date(),1),
                orderTypes: [], // 表格排序
                mediaType: null,
                accountNameLike: null,
                overdueStateIn: [],
            },
            wtlxTxt: null,
            orderId: null,
            batchId: null,

            overdueStateList: [ // 不更新状态
                { label: '严重逾期', value: 1, color: '#ff6563' },
                { label: '即将逾期', value: 2, color: '#ea9940' },
                { label: '正常', value: 3, color: '#48b93f' },
            ],
            
            // 导出
            open4: false, 
            form4: {
                menuType: 150
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            zhlxList: [
                { label: '微信公众号', value: 1 },
                { label: '新浪微博', value: 2 },
                { label: '抖音短视频', value: 3 },
                { label: '今日头条', value: 4 },
                { label: '快手短视频', value: 5 },
                { label: '移动客户端', value: 111 },
                { label: '人民号', value: 112 },
                { label: '百家号', value: 113 },
                { label: '腾讯微视', value: 117 },
                { label: '企鹅号', value: 118 },
                { label: '南方号', value: 119 },
                { label: '一点号', value: 120 },
                { label: '网易', value: 121 },
                { label: '小程序', value: 122 },
                { label: '大鱼号', value: 123 },
                { label: '搜狐号', value: 124 },
                { label: '澎湃号', value: 125 },
                { label: '其他', value: 114 },
            ],

            restaurants: [],
            timeout:  null,


            // 修正
            dialog: false,
            form: {},
            rules: {
                // updateTitle: [{ required: true, message: '请输入更新标题', trigger: 'blur' }],
                updateUrl: [{ required: true, message: '请输入更新地址', trigger: 'blur' }],
                renewTime: [{ required: true, message: '请选择最后更新时间', trigger: 'change' }],
            },

            editObj: {},
            upOverdueStateTxt: null,
            upOverdueStateColor: null


            
        };
    },
    created() {
        this.getList();
    },
    methods: {

        // 生成一个范围数组
        range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
                result.push(i);
            }
            return result;
        },
        formatDate: function(timestamp,type) {
            var date = new Date(timestamp);
            var year = date.getFullYear();
            // var month = date.getMonth() + 1;
            // var day = date.getDate();
            var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
            var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            if(type == 1){
                return year + '-' + month + '-' + day;
            }else{
                return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
            }
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate,1)
            listInspSiteInfo(this.queryParams).then(response => {
                // let arrDate = response.data;
                for(var i in response.rows){
                    response.rows[i].index = parseInt(i)+1;
                    if(!response.rows[i].siteName){
                        response.rows[i].siteName = '--';
                    }
                    if(!response.rows[i].siteCode){
                        response.rows[i].siteCode = '--';
                    }
                    if(!response.rows[i].noUpdateDay && response.rows[i].noUpdateDay != 0){
                        response.rows[i].noUpdateDay = '--';
                    }
                    if(!response.rows[i].updateUrl){
                        response.rows[i].updateUrl = '--';
                    }
                    // if(!response.rows[i].updateTitle){
                    //     response.rows[i].updateTitle = '--';
                    // }
                    if(response.rows[i].updateTitle == null || response.rows[i].updateTitle == ''){
                        response.rows[i].updateTitle = response.rows[i].updateUrl;
                    }
                    if(!response.rows[i].renewTime){
                        response.rows[i].renewTime = '--';
                    }
                    // 监测状态
                    if(response.rows[i].enabled == true){
                        response.rows[i].enabledTxt = '监测中';
                    }else if(response.rows[i].enabled == false){
                        response.rows[i].enabledTxt = '未监测';
                    }else{
                        response.rows[i].enabledTxt = '--';
                    }
                    // 问题级别状态颜色
                    if(response.rows[i].overdueState == 1){ // 严重
                        response.rows[i].overdueStateTxt = '严重逾期';
                        response.rows[i].overdueStateBgColor = '#ff6563';
                    }else if(response.rows[i].overdueState == 2){ // 一般
                        response.rows[i].overdueStateTxt = '即将逾期';
                        response.rows[i].overdueStateBgColor = '#ea9940';
                    }else if(response.rows[i].overdueState == 3){ // 轻微
                        response.rows[i].overdueStateTxt = '正常';
                        response.rows[i].overdueStateBgColor = '#48b93f';
                    }
                    // response.rows[i].mediaType = 4;
                    if(response.rows[i].mediaType == 1){
                        response.rows[i].ico = require('../../../assets/images/wx.jpeg')
                    }else if(response.rows[i].mediaType == 2){
                        response.rows[i].ico = require('../../../assets/images/wb.jpeg')
                    }else if(response.rows[i].mediaType == 3){
                        response.rows[i].ico = require('../../../assets/images/dy.jpeg')
                    }else if(response.rows[i].mediaType == 4){
                        response.rows[i].ico = require('../../../assets/images/tt.jpeg')
                    }else if(response.rows[i].mediaType == 5){
                        response.rows[i].ico = require('../../../assets/images/ks.jpeg')
                    }else if(response.rows[i].mediaType == 111){
                        response.rows[i].ico = require('../../../assets/images/yd.png')
                    }else if(response.rows[i].mediaType == 112){
                        response.rows[i].ico = require('../../../assets/images/rm.png')
                    }else if(response.rows[i].mediaType == 113){
                        response.rows[i].ico = require('../../../assets/images/bj.png')
                    }else if(response.rows[i].mediaType == 117){
                        response.rows[i].ico = require('../../../assets/images/tx.png')
                    }else if(response.rows[i].mediaType == 118){
                        response.rows[i].ico = require('../../../assets/images/qe.png')
                    }else if(response.rows[i].mediaType == 119){
                        response.rows[i].ico = require('../../../assets/images/nf.png')
                    }else if(response.rows[i].mediaType == 120){
                        response.rows[i].ico = require('../../../assets/images/ydh.png')
                    }else if(response.rows[i].mediaType == 121){
                        response.rows[i].ico = require('../../../assets/images/wy.png')
                    }else if(response.rows[i].mediaType == 122){
                        response.rows[i].ico = require('../../../assets/images/xcx.png')
                    }else if(response.rows[i].mediaType == 123){
                        response.rows[i].ico = require('../../../assets/images/dy.png')
                    }else if(response.rows[i].mediaType == 124){
                        response.rows[i].ico = require('../../../assets/images/sh.png')
                    }else if(response.rows[i].mediaType == 125){
                        response.rows[i].ico = require('../../../assets/images/pp.png')
                    }else {
                        response.rows[i].ico = require('../../../assets/images/qt.png')
                    }
                }
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 表单重置
        reset4() {
            this.form4 = {
                menuType: 150,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 150,
                type: 1,
            }
            this.resetForm("form3");
        },
        /** 导出按钮操作 */
        handleExport() {
            // let fileName = '敏感信息数据'
            // this.download(
            //     "biz/wrongWords/export",this.queryParams,
            //     `${fileName}.xlsx`
            // ).then((res)=>{});
            this.open4 = true;
            this.reset4();
        },
        /** 提交按钮 */
        submitForm4() {
            this.$refs["form4"].validate(valid => {
                if (valid) {
                    console.log(this.form4)
                    let subData = this.queryParams;
                    subData.menuType = 150;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '账号更新数据'
                        this.download(
                            "biz/mediaUpdate/export",this.queryParams,
                            `${fileName}.xlsx`
                        ).then((res)=>{
                            this.open4 = false;
                        });
                    }
                    
                }
            });
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
            let newName = '';
            if(prop == 'noUpdateDay'){ // 未更新天数
                newName = 'nud';
            }else if(prop == 'siteCode'){ // 网站标识码
                newName = 'sc';
            }else if(prop == 'renewTime'){ // 最后更新时间
                newName = 'rt';
            }
            if(order == 'descending'){ // 下
                this.queryParams.orderTypes = [{ code: 1, name: newName }];
                this.getList()
            }else if(order == 'ascending'){ // 上
                this.queryParams.orderTypes = [{ code: 0, name: newName }];
                this.getList()
            }else{ // 取消
                this.queryParams.orderTypes = [];
                this.getList()
            }
        },

        /**搜索条件 */
        // 网站标识码
        querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.siteCodeMedia === '' || this.queryParams.siteCodeMedia == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
                    keyWord: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                SearchMediaInfo(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.rows){
                        this.restaurants.push({
                            value: response.rows[i].siteName + '-' + response.rows[i].siteCodeMedia,
                            siteCode: response.rows[i].siteCodeMedia,
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
            this.queryParams.siteCodeMedia = val.siteCode;
        },
         // 站点信息
         querySearchAsync(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.treeInfo.psCode === '' || this.queryParams.treeInfo.psCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
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
            this.queryParams.treeInfo.psCode = val.siteCode;
        },

        // 监测详情
        goInfo(val){
            console.log(val,'val')
            this.$router.push({path: '/mediaDate/mediaUpdateInfo'})
            sessionStorage.setItem('mediaUpdateInfoObj',JSON.stringify(val))
            // sessionStorage.setItem('queryFrom',JSON.stringify(this.queryFrom))            
            this.$EventBus.$emit('mediaUpdateInfo', val)
        },

        /** 取消按钮 */        
        cancelForm() {
            this.dialog = false;
            this.resetForm("formform");            
        },
         // 时间
        sjChange(val){
            console.log(val,'val')
            console.log(this.form.renewTime,'val')
            if(val){
                if(Date.parse(val) > Date.parse(new Date())) {
                    this.form.renewTime = this.formatDate(new Date(),2);
                    this.$modal.msgWarning("最后更新时间不能大于当前时间");
                }
                let data = {
                    id: this.form.id,
                    renewTime: this.form.renewTime
                }
                queryNoUpdateDay(data).then((res)=>{
                    this.$set(this.form, "noUpdateDay", res.data.noUpdateDay);  
                    this.$set(this.form, "overdueState", res.data.overdueState);
                    for(var i in this.overdueStateList){
                        if(this.overdueStateList[i].value == res.data.overdueState){
                            this.upOverdueStateTxt = this.overdueStateList[i].label;
                            this.upOverdueStateColor = this.overdueStateList[i].color;
                        }
                    }
                })
                
            }
        },
        /** 修改按钮操作 */
        handleUpdate2(row,index) {
            const id = row.idStr || this.ids;
            getInfo({id:id}).then(response => {
                this.editObj = response.data;
                this.form.id = response.data.idStr;
                this.$set(this.form, "updateTitle", response.data.updateTitle);
                this.$set(this.form, "updateUrl", response.data.updateUrl);
                this.$set(this.form, "renewTime", response.data.renewTime);
                // overdueState
                console.log(this.editObj,'this.form-header')
                let data = {
                    id: this.form.id,
                    renewTime: this.form.renewTime
                }
                queryNoUpdateDay(data).then((res)=>{
                    // this.$set(this.form, "noUpdateDay", res.data.noUpdateDay);  
                    // this.$set(this.form, "overdueState", res.data.overdueState);
                    this.form.noUpdateDay = res.data.noUpdateDay;
                    this.form.overdueState = res.data.overdueState;
                    for(var i in this.overdueStateList){
                        if(this.overdueStateList[i].value == this.form.overdueState){
                            this.upOverdueStateTxt = this.overdueStateList[i].label;
                            this.upOverdueStateColor = this.overdueStateList[i].color;
                        }
                    }
                    this.dialog = true;
                })
                console.log(this.form,'form')
                
            });
            
        },
        /** 提交按钮 */
        submitForm() {
            
            this.$refs["formform"].validate(valid => {
                if (valid) {
                    
                    console.log(this.form)
                    // this.form.renewTime = this.formatDate(this.form.renewTime);
                    if (this.form.id != null) {
                        updateInspSiteInfo(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.dialog = false;
                            this.getList();
                        });
                    }
                }
            });
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    .zhxx{
        display: flex;
        align-items: center;
    }
    .icoSp{
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        overflow: hidden;
        background: #ffffff;
        margin-right: 5px;
    }
    .ico{
        width: 100%;
        border-radius: 100%;
    }
    .divdiv{
        flex: 1;
        display: flex;
        justify-content: space-between;
        .dvdv{
            display: flex;
            align-items: center;
        }
    }
    
    .zgClass2:hover{
        cursor: pointer;
    }
    // 修正
    .drawerCon{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .concon{
            flex: 1;
            overflow: auto;
            .conTop{
                padding: 0 15px 10px 15px;
                border-bottom: 1px solid #f0f0f0;
                .ul{
                    margin: 0;
                    padding: 0;
                    li{
                        font-size: 14px;
                        list-style: none;
                        margin-bottom: 10px;
                        margin-left: 15px;
                    }
                }
            }
        }
    }
    
</style>
<style scoped>
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 12vh !important;
    }
    /deep/ .pagination-container{
        margin-bottom: 20px!important;
    }
    /deep/.el-drawer__header{
        margin-bottom: 0!important;
        color: #000000;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10px;
    }
</style>