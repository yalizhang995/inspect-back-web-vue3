<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="90px"
        >               
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @clear='queryParams.siteCode=null'
                    style="width: 300px"
                />
            </el-form-item>
            <el-form-item label="网站名称" prop="siteNameLike">
                <el-input
                    v-model="queryParams.siteNameLike"
                    placeholder="请输入网站名称"
                    clearable
                    style="width: 300px"
                />
            </el-form-item>
            
            <el-form-item label="URL地址"prop="url">
                <el-input
                    v-model="queryParams.url"
                    placeholder="请输入URL地址"
                    clearable
                    style="width:300px"
                    @clear='queryParams.url=null'
                />
            </el-form-item>
            <el-form-item label="父URL地址"prop="fromUrlEncry">
                <el-input
                    v-model="queryParams.fromUrlEncry"
                    placeholder="请输入父URL地址"
                    clearable
                    style="width:300px"
                    @clear='queryParams.fromUrlEncry=null'
                />
            </el-form-item>

            <el-form-item label="爬虫任务" prop="columnId">
                <el-input
                    v-model="queryParams.columnId"
                    placeholder="请输入爬虫任务ID"
                    clearable
                    style="width: 300px"
                />
            </el-form-item>
            
            <!-- <el-form-item label="是否开启" prop="taskEnabled">
                <el-select v-model="queryParams.taskEnabled" clearable placeholder="爬虫任务是否开启"  >
                    <el-option
                    v-for="item in pcrwList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="异常状态" prop="queueStatus">
                <el-select v-model="queryParams.queueStatus" clearable placeholder="全站采集异常状态" style="width: 300px" >
                    <el-option
                    v-for="item in yxztList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="返回码" prop="httpCode">
                <el-input
                    v-model="queryParams.httpCode"
                    placeholder="请输入返回码"
                    clearable
                    style="width: 300px"
                />
            </el-form-item>
            <el-form-item label="发布时间" prop="searchDateKey">
                <el-date-picker
                    v-model="DateArr"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="sjrqChange"
                    style="width:300px"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="URL类型" prop="contentType">
                <el-select v-model="queryParams.contentType" clearable placeholder="全站采集URL类型" style="width: 300px" >
                    <el-option
                    v-for="item in contentTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资源类型" prop="pageType">
                <el-select v-model="queryParams.pageType" clearable placeholder="全站采集资源类型" style="width: 300px" >
                    <el-option
                    v-for="item in pageTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item style="marginLeft:8px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-thumb"
                    size="mini"
                    :disabled="multiple"
                    @click="TaskInit(2)"
                >批量重采</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteInfoList"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="index" label="序号" width="80" align="center" fixed></el-table-column>
            <!-- <el-table-column prop="siteName" label="网站名称" width="220" fixed show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="siteCode" label="网站标识码" width="120" fixed></el-table-column>
            <el-table-column prop="pid" label="栏目ID" width="220"  ></el-table-column>
            <el-table-column prop="url" label="站点首页URL" width="320" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="页面标题" width="300" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.fromUrl)">{{scope.row.title}}</span>
                </template> -->
            </el-table-column>
            <el-table-column prop="title" label="父页面URL" width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.fromUrl)">{{scope.row.fromUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="快照" width="80" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="httpCode" label="返回码" width="100" align="center" ></el-table-column>
            <el-table-column prop="queueStatusTxt" label="采集异常状态" width="120" align="center" ></el-table-column>
            <el-table-column prop="linkLocationTxt" label="链接位置" width="100" align="center" ></el-table-column>
            <el-table-column prop="contentTypeTxt" label="URL类型" width="100" align="center" ></el-table-column>
            <el-table-column prop="pageTypeTxt" label="资源类型" width="100" align="center" ></el-table-column>
            <el-table-column label="发布时间" align="" prop="pubDate" width="120" />
            <el-table-column label="创建时间" align="" prop="createTime" width="160" />
            <el-table-column label="修改时间" align="" prop="updateTime" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="TaskInit(1,scope.row)">重新采集</el-button>
                    <el-button size="mini" type="text" icon="el-icon-c-scale-to-original" @click="goInfo(scope.row)">采集排查</el-button>
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
</template>

<script>
import {
    pagesIndexList,
    pagesIndexAgain
} from "@/api/biz/pagesIndex";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

export default {
    name: "PagesIndex",
    components: {
        Treeselect
    },
    data() {
        return {
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
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null, // 网站标识码
                siteNameLike: null, // 网站名称
                orderTypes: [], // 表格排序
                columnId: null, // 爬虫任务ID
                taskEnabled: null, // 爬虫任务是否开启
                taskAllStatus: null, // 全站采集运行状态
                queueStatus: null, //采集异常状态
                url: null,
                fromUrlEncry: null,
                httpCode: null,
                searchDateKey: 'pti',
                startDate: null,
                endDate: null,
                pageType: null,
                contentType: null
            },
            DateArr: [],
            // 任务开启
            pcrwList: [
                { label: '开启', value: true },
                { label: '未开启', value: false },
            ],
            // 异常状态
            yxztList: [
                { label: 'HTML为空', value: -6 },
                { label: '正文为空', value: -5 },
                { label: 'URL域内跳转', value: -4 }, 
                { label: '域名跳转', value: -3 },
                { label: '采集失败', value: -2 },
                { label: '待入队', value: 0 },
                { label: '待采集', value: 1 },
                { label: '采集完成', value: 2 },
                { label: '纠错入队', value: 3 },
                { label: '完成', value: 4 },
                { label: '正文乱码', value: 40 },
            ],
            // 资源类型
            contentTypeList: [
                { label: '图片', value: 1 },
                { label: '网页', value: 2 },
                { label: '附件', value: 3 },
                { label: 'JS', value: 4 },
                { label: 'CSS', value: 5 },
                { label: '视频', value: 6 },
                { label: '音频', value: 7 },
                { label: '位置地址', value: 8 },
            ],
            // URL类型
            pageTypeList: [
                
                { label: '未知', value: 0 },
                { label: '首页', value: 1 },
                { label: '栏目', value: 2 },
                { label: '内容页', value: 3 },
                { label: '其他', value: 4 },
            ],


            
        };
    },
    created() {
        // this.getList();
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
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
            }
        },
        // 父级标识码
        selectParentSite(node){
            console.log(node,'nodenodenode')
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            pagesIndexList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 采集异常状态
                    if(this.inspSiteInfoList[i].queueStatus == -6){
                        this.inspSiteInfoList[i].queueStatusTxt = 'HTML为空';
                    }else if(this.inspSiteInfoList[i].queueStatus == -5){
                        this.inspSiteInfoList[i].queueStatusTxt = '正文为空';
                    }else if(this.inspSiteInfoList[i].queueStatus == -4){
                        this.inspSiteInfoList[i].queueStatusTxt = 'URL域内跳转';
                    }else if(this.inspSiteInfoList[i].queueStatus == -3){
                        this.inspSiteInfoList[i].queueStatusTxt = '域名跳转';
                    }else if(this.inspSiteInfoList[i].queueStatus == -2){
                        this.inspSiteInfoList[i].queueStatusTxt = '采集失败';
                    }else if(this.inspSiteInfoList[i].queueStatus == 0){
                        this.inspSiteInfoList[i].queueStatusTxt = '待入队';
                    }else if(this.inspSiteInfoList[i].queueStatus == 1){
                        this.inspSiteInfoList[i].queueStatusTxt = '待采集';
                    }else if(this.inspSiteInfoList[i].queueStatus == 2){
                        this.inspSiteInfoList[i].queueStatusTxt = '采集完成';
                    }else if(this.inspSiteInfoList[i].queueStatus == 3){
                        this.inspSiteInfoList[i].queueStatusTxt = '纠错入队';
                    }else if(this.inspSiteInfoList[i].queueStatus == 4){
                        this.inspSiteInfoList[i].queueStatusTxt = '完成';
                    }else if(this.inspSiteInfoList[i].queueStatus == 40){
                        this.inspSiteInfoList[i].queueStatusTxt = '正文乱码';
                    }
                    // 链接位置
                    if(this.inspSiteInfoList[i].linkLocation == 1){
                        this.inspSiteInfoList[i].linkLocationTxt = '首页';
                    }else if(this.inspSiteInfoList[i].linkLocation == 2){
                        this.inspSiteInfoList[i].linkLocationTxt = '其他页';
                    }
                    // 资源类型
                    if(this.inspSiteInfoList[i].pageType == 0){
                        this.inspSiteInfoList[i].pageTypeTxt = '未知';
                    }else if(this.inspSiteInfoList[i].pageType == 1){
                        this.inspSiteInfoList[i].pageTypeTxt = '首页';
                    }else if(this.inspSiteInfoList[i].pageType == 2){
                        this.inspSiteInfoList[i].pageTypeTxt = '栏目';
                    }else if(this.inspSiteInfoList[i].pageType == 3){
                        this.inspSiteInfoList[i].pageTypeTxt = '内容页';
                    }else if(this.inspSiteInfoList[i].pageType == 4){
                        this.inspSiteInfoList[i].pageTypeTxt = '其他';
                    }else{
                        this.inspSiteInfoList[i].pageTypeTxt = '--';
                    }
                    // url类型
                    if(this.inspSiteInfoList[i].contentType == 1){
                        this.inspSiteInfoList[i].contentTypeTxt = '图片';
                    }else if(this.inspSiteInfoList[i].contentType == 2){
                        this.inspSiteInfoList[i].contentTypeTxt = '网页';
                    }else if(this.inspSiteInfoList[i].contentType == 3){
                        this.inspSiteInfoList[i].contentTypeTxt = '附件';
                    }else if(this.inspSiteInfoList[i].contentType == 4){
                        this.inspSiteInfoList[i].contentTypeTxt = 'JS';
                    }else if(this.inspSiteInfoList[i].contentType == 5){
                        this.inspSiteInfoList[i].contentTypeTxt = 'CSS';
                    }else if(this.inspSiteInfoList[i].contentType == 6){
                        this.inspSiteInfoList[i].contentTypeTxt = '视频';
                    }else if(this.inspSiteInfoList[i].contentType == 7){
                        this.inspSiteInfoList[i].contentTypeTxt = '音频';
                    }else if(this.inspSiteInfoList[i].contentType == 8){
                        this.inspSiteInfoList[i].contentTypeTxt = '位置地址';
                    }else{
                        this.inspSiteInfoList[i].contentTypeTxt = '--';
                    }
                    // 页面标题
                    if(!this.inspSiteInfoList[i].title){
                        this.inspSiteInfoList[i].title = '--';
                    }
                    // 发布时间
                    if(!this.inspSiteInfoList[i].pubDate){
                        this.inspSiteInfoList[i].pubDate = '--';
                    }
                    // 返回码
                    if(!this.inspSiteInfoList[i].httpCode){
                        this.inspSiteInfoList[i].httpCode = '--';
                    }
                    
                    
                }
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                siteCode: null,
                word: null,
                suggest: null,
                severity: null,
                showState: null,
                explanation: null,
            };
            this.editObj = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.DateArr){
                this.queryParams.startDate = this.DateArr[0];
                this.queryParams.endDate = this.DateArr[1];
                if(this.queryParams.startDate){
                    this.queryParams.startDate = this.formatDate(this.queryParams.startDate) + ' 00:00:00';
                }
                if(this.queryParams.endDate){
                    this.queryParams.endDate = this.formatDate(this.queryParams.endDate) + ' 23:59:59';
                }
            }
            if(this.queryParams.url != null){
                if(this.queryParams.siteCode != null && this.queryParams.siteCode != ''){
                    this.getList();                    
                }else{
                    this.$modal.msgWarning("网站标识码、URL同时输入才可查询");
                }
            }else{
                if(this.queryParams.siteCode != null && this.queryParams.siteCode != ''){
                    this.getList();                    
                }else{
                    this.$modal.msgWarning("请至少输入网站标识码查询");
                }
            }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.resetForm("queryForm");
            // this.handleQuery();
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

        /**重新采集 */
        TaskInit(type,row){
            let data = {};
            if(type == 1){ // 单个
                data = {
                    ids: [row.idStr]
                }
            }else if(type == 2){
                data = {
                    ids: this.ids
                }
            }
            pagesIndexAgain(data).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
        },

        // 采集排查
        goInfo(row){
            sessionStorage.setItem('pageSIndexId', row.idStr);
            this.$router.push({path:'/collect/pagesIndexInfo'})
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
    .divdiv{
        flex: 1;
        display: flex;
        justify-content: space-between;
        .dvdv{
            display: flex;
            align-items: center;
        }
    }

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
    .demo-drawer__footer{
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
    
</style>
<style lang="scss">
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    .el-drawer__header{
        margin-bottom: 0!important;
        color: #000000;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10px;
    }
</style>