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
            <el-form-item label="网站标识码" prop="siteCodeLike">
                <el-input
                    v-model="queryParams.siteCodeLike"
                    placeholder="请输入网站标识码"
                    clearable
                />
            </el-form-item>
            <el-form-item label="网站名称" prop="siteNameLike">
                <el-input
                    v-model="queryParams.siteNameLike"
                    placeholder="请输入网站名称"
                    clearable
                />
            </el-form-item>
            <el-form-item label="爬虫任务" prop="columnId">
                <el-input
                    v-model="queryParams.columnId"
                    placeholder="请输入爬虫任务ID"
                    clearable
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="是否开启" prop="taskEnabled">
                <el-select v-model="queryParams.taskEnabled" clearable placeholder="爬虫任务是否开启"  >
                    <el-option
                    v-for="item in pcrwList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="异常状态" prop="taskQueueStatus">
                <el-select v-model="queryParams.taskQueueStatus" clearable placeholder="全站采集异常状态"  >
                    <el-option
                    v-for="item in yxztList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item style="marginLeft:10px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
            <!-- <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                >批量删除</el-button>
            </el-col>
            <el-col :span="1.5">
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
        >
            <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
            <el-table-column prop="siteName" label="网站名称" width="220" fixed show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" width="120"></el-table-column>
            <el-table-column prop="idStr" label="ID字符串" width="220"  ></el-table-column>
            <el-table-column prop="siteUrl" label="站点首页URL" width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="columnId" label="爬虫任务ID" width="220"  ></el-table-column>
            <el-table-column prop="connectCount" label="连通总数" width="100" align="center" ></el-table-column>
            <el-table-column prop="connectConfirmSum" label="确认不连通" width="110" align="center" ></el-table-column>
            <el-table-column prop="connectSuspectedSum" label="疑似不连通" width="110" align="center" ></el-table-column>
            <el-table-column label="首页连通返回码" align="center">
                <el-table-column prop="connectCode1" label="第一次" align="center" width="100"></el-table-column>
                <el-table-column prop="connectCode2" label="第二次" align="center" width="100"></el-table-column>
                <el-table-column prop="connectCode3" label="第三次" align="center" width="100"></el-table-column>
            </el-table-column>
            <el-table-column prop="pagesPageNum" label="采集页面" width="100" align="center" ></el-table-column>
            <el-table-column prop="pagesNum" label="采集链接" width="100" align="center" ></el-table-column>
            <el-table-column prop="articlesHomeNum" label="单站点首页稿件" width="140" align="center" ></el-table-column>
            <el-table-column prop="articlesNum" label="单站点全部稿件" width="140" align="center" ></el-table-column>
            <el-table-column prop="errorLinksPageNum" label="错误总数" width="100" align="center" ></el-table-column>
            <el-table-column prop="errorLinksPage403Num" label="错误403" width="100" align="center" ></el-table-column>
            <el-table-column prop="errorLinksPage999Num" label="错误999" width="100" align="center" ></el-table-column>
            <el-table-column prop="taskHttpCode" label="爬虫任务返回码" width="140" align="center" ></el-table-column>
            <el-table-column prop="taskEnabledTxt" label="爬虫任务开启" width="140" align="center" ></el-table-column>
            <el-table-column prop="taskAllStatusTxt" label="采集运行状态" width="100" align="center" ></el-table-column>
            <el-table-column prop="taskQueueStatusTxt" label="采集异常状态" width="140" align="center" ></el-table-column>
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看" placement="top">
                        <i class="el-icon-view" style="cursor: pointer;font-size:15px"></i>
                    </el-tooltip>
                </template>
            </el-table-column> -->
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
    spiderSiteAnalysisList
} from "@/api/biz/spiderSiteAnalysis";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCodeLike: null, // 网站标识码
                siteNameLike: null, // 网站名称
                orderTypes: [], // 表格排序
                columnId: null, // 爬虫任务ID
                taskEnabled: null, // 爬虫任务是否开启
                taskAllStatus: null, // 全站采集运行状态
                taskQueueStatus: null, //采集异常状态
            },
            // 任务开启
            pcrwList: [
                { label: '开启', value: true },
                { label: '未开启', value: false },
            ],
            // 运行状态
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
            ]


            
        };
    },
    created() {
        this.getList();
        this.getTreeselect();
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
        /** 查询站点关系下拉树结构 */
        getTreeselect() {
            listInspSiteTree({parentSite: 0}).then(response => {
                this.inspSiteTreeOptions = [];
                this.inspSiteTreeOptions = response.data;
                // this.inspSiteTreeOptions = this.handleTree(
                //     response.data,
                //     "siteCode",
                //     "parentSite",
                // );
                for(var i in this.inspSiteTreeOptions){
                    if(this.inspSiteTreeOptions[i].children.length == 0){
                        this.inspSiteTreeOptions[i].children = null;
                        this.inspSiteTreeOptions[i].leaf = true;
                    }
                }
            });
        },
        /** 转换站点关系数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.siteCode,
                label: node.siteCode+'（'+node.unitName+'）',                
                children: node.children,
                parentId: node.parentId,
                level: node.level,
                parentSite: node.parentSite
            };
        },
        // 父级标识码
        selectParentSite(node){
            console.log(node,'nodenodenode')
        },
        loadOptions({ action, parentNode, callback }){
            console.log(action,'action')
            console.log(parentNode,'parentNode')
            console.log(callback,'callback')
            if(action === 'LOAD_ROOT_OPTIONS') {
                listInspSiteTree({parentSite:0}).then(response => {
                    this.inspSiteTreeOptions = [];
                    this.inspSiteTreeOptions = response.data;
                    this.inspSiteTreeOptions = this.handleTree(
                        response.data,
                        "siteCode",
                        "parentSite",
                    );
                    for(var i in this.inspSiteTreeOptions){
                        if(this.inspSiteTreeOptions[i].children.length == 0){
                            this.inspSiteTreeOptions[i].children = null;
                        }
                    }
                    console.log(this.inspSiteTreeOptions,'inspSiteTreeOptions')

                });
                callback()
            }
            // 这里加载二级数据了，根据自己需求判断调接口
            if (action == 'LOAD_CHILDREN_OPTIONS') {
                //加载点击节点的 子节点
                // if(parentNode.parentId !== '0') {
                    const query = {
                        parentSite: parentNode.siteCode,
                    }
                    listInspSiteTree(query).then(response => {
                        const params = response.data;
                        for(var i in params){
                            if(params[i].children.length == 0){
                                params[i].children = null;
                            }
                        }
                        parentNode.children = params;
                    })
                callback();
            }
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            spiderSiteAnalysisList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 采集异常状态
                    if(this.inspSiteInfoList[i].taskQueueStatus == -6){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = 'HTML为空';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == -5){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '正文为空';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == -4){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = 'URL域内跳转';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == -3){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '域名跳转';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == -2){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '采集失败';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == 0){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '待入队';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == 1){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '待采集';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == 2){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '采集完成';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == 3){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '纠错入队';
                    }else if(this.inspSiteInfoList[i].taskQueueStatus == 4){
                        this.inspSiteInfoList[i].taskQueueStatusTxt = '完成';
                    }
                    // 运行状态
                    // 采集异常状态
                    if(this.inspSiteInfoList[i].taskAllStatus == 0){
                        this.inspSiteInfoList[i].taskAllStatusTxt = '未启动';
                    }else if(this.inspSiteInfoList[i].taskAllStatus == 1){
                        this.inspSiteInfoList[i].taskAllStatusTxt = '待启动';
                    }else if(this.inspSiteInfoList[i].taskAllStatus == 2){
                        this.inspSiteInfoList[i].taskAllStatusTxt = '采集中';
                    }else if(this.inspSiteInfoList[i].taskAllStatus == 3){
                        this.inspSiteInfoList[i].taskAllStatusTxt = '完成';
                    }else if(this.inspSiteInfoList[i].taskAllStatus == 4){
                        this.inspSiteInfoList[i].taskAllStatusTxt = '异常';
                    }
                    

                    // 任务开启
                    if(this.inspSiteInfoList[i].taskEnabled == false){
                        this.inspSiteInfoList[i].taskEnabledTxt = '未开启';
                    }else if(this.inspSiteInfoList[i].taskEnabled == true){
                        this.inspSiteInfoList[i].taskEnabledTxt = '开启';
                    }
                    
                }
            });
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
            if(this.queryParams.scanDate){
                this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate);
            }else{
                this.queryParams.scanDate = null;
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
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