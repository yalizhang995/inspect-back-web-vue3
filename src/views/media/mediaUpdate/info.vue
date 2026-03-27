<template>
    <div class="app-container">
        <div class="infoBox">
            <div class="infoBoxL"><img :src="dateObj.ico" alt=""></div>
            <div class="infoBoxR">
                <span class="sp1">
                    <span style="marginRight:5px">账号名称：</span>
                    <span class="dz" @click="dzChange(dateObj.homeUrl)">{{dateObj.accountName}}</span>
                </span>
                <span>
                    <span class="sp2"><span style="marginRight:5px">新媒体标识码：</span>{{dateObj.siteCodeMedia}}</span>
                    <span class="sp3"><span style="marginRight:5px">监测状态：</span>{{dateObj.enabledTxt}}</span>
                    <span class="sp3"><span style="marginRight:5px">不更新状态：</span><span :style="{color:dateObj.overdueStateBgColor}">{{dateObj.overdueStateTxt}}</span></span>
                </span>
                <p class="ppp">
                    <span class="sp2"><span style="marginRight:5px">填报单位名称：</span>{{dateObj.siteName}}</span>
                    <span class="sp3"><span style="marginRight:5px">填报单位标识码：</span>{{dateObj.siteCode}}</span>
                </p>
            </div>
        </div>
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="80px"
        >
            <el-form-item label="发布时间" prop="siteCode">
                <el-date-picker
                    v-model="DateArr"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="sjrqChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['biz:inspOrderSite:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['biz:inspOrderSite:edit']"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspOrderSite:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspOrderSite:export']"
                >导出</el-button>
            </el-col> -->
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            <el-col :span="1.5" style="float:right;display: inline-block;" >
                <el-button
                    type="primary"
                    plain
                    icon=""
                    size="mini"
                    @click="goBack"
                    v-hasPermi="['biz:inspSiteDirector:add']"
                >返回上级</el-button>
            </el-col>
        </el-row>
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspOrderSiteList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column prop="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="updateTitle" label="更新标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.web_url)">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <!-- 微信 -->
            <el-table-column prop="visit_count" label="阅读数" width="100" align="center" v-if="dateObj.mediaType == 1"></el-table-column > 
            <el-table-column prop="like_count" label="点赞数" width="100" align="center" v-if="dateObj.mediaType == 1"></el-table-column >
            <!-- 微博、抖音、头条、快手 -->
            <el-table-column prop="reply_count" label="评论数" width="100" align="center"  v-if="dateObj.mediaType != 1"></el-table-column> 
            <el-table-column prop="repost_count" label="转发数" width="100" align="center"  v-if="dateObj.mediaType != 1"></el-table-column>
            <el-table-column prop="like_count" label="点赞数" width="100" align="center"  v-if="dateObj.mediaType != 1"></el-table-column>
            <el-table-column prop="visit_count" label="查看数" width="100" align="center"  v-if="dateObj.mediaType != 1"></el-table-column>
            <el-table-column prop="pubTime" label="发布时间" width="180" align="center"></el-table-column>
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
    getImediaArticleInfo
} from "@/api/media/mediaUpdate";

export default {
    name: "InspOrderSite",
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
            // 订单站点关联表格数据
            inspOrderSiteList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                searchDateKey: 'pti',
                searchVal: null,
                treeInfo: null,
                siteCodeIn: [], // 标识码-主办
                linkLocation: null, // 链接位置

                contentType: null, // 资源类别
                startDate: null,
                endDate: null,
                orderTypes: [], // 表格排序
            },

            DateArr: [],

            dateObj: {},
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('mediaUpdateInfoObj')
        this.queryParams = {
            pgNum: 1,
            pgSize: 10,
            searchDateKey: 'pti',
            searchVal: null,
            treeInfo: null,
            siteCodeIn: [], // 标识码-主办
            linkLocation: null, // 链接位置

            contentType: null, // 资源类别
            startDate: null,
            endDate: null,
            orderTypes: [], // 表格排序
            siteCodeMedia: null,
            mediaType: null
        }
        next();

    },
    created() {
        if(sessionStorage.getItem('mediaUpdateInfoObj')){
            this.dateObj = JSON.parse(sessionStorage.getItem('mediaUpdateInfoObj'))
            this.queryParams.siteCodeMedia = this.dateObj.siteCodeMedia;
            this.queryParams.mediaType = this.dateObj.mediaType;
            this.getList();
            console.log(this.dateObj,'this.dateObj')
        }
    },
    mounted(){
        this.$EventBus.$on("mediaUpdateInfo", data => {
            this.dateObj = JSON.parse(sessionStorage.getItem('mediaUpdateInfoObj'))
            this.queryParams.siteCodeMedia = this.dateObj.siteCodeMedia;
            this.queryParams.mediaType = this.dateObj.mediaType;             
            this.getList();
        })
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
        /** 查询订单站点关联列表 */
        getList() {
            this.loading = true;
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
            getImediaArticleInfo(this.queryParams).then(response => {
                this.inspOrderSiteList = response.rows;
                for(var i in this.inspOrderSiteList){
                    this.inspOrderSiteList[i].index = parseInt(i)+1;
                    if(this.inspOrderSiteList[i].title == null || this.inspOrderSiteList[i].title == ''){
                        this.inspOrderSiteList[i].title = this.inspOrderSiteList[i].web_url;
                    }
                }
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
            this.DateArr = [];
            this.queryParams.startDate = null;
            this.queryParams.endDate = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 返回上级
        goBack(){
            // this.$router.go(-1);
            let veiwArr = this.$store.state.tagsView.visitedViews;
            let path = this.$route.path;
            let view;
            for(let i = 0,len=veiwArr.length;i<len;i++){
                if(veiwArr[i].path == path){
                    view = veiwArr[i];
                }	
            }
            this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
                const latestView = visitedViews.slice(-1)[0];
                // this.$router.replace({ path: '/clu/configure'});
                sessionStorage.removeItem('orderInfo')
                this.$router.go(-1);    
            })
        },

        // 地址超链接
        dzChange(url){
            console.log(url)
            const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
            if(url != null && url != '' && url != '--'){
                if(reg.test(url) == false){
                    window.open('http://'+url)
                }else{
                    window.open(url)
                }
            }
            
        },
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryFrom.findTimeStart = null;
                this.queryFrom.findTimeEnd = null;
            }
        },
    }
};
</script>
<style lang="scss">
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .infoBox{
            background: #ffffff;
            border-radius: 10px;
            display: flex;
            padding: 20px;
            margin-top: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 4px 6px rgba(0, 0, 0, .04);
            margin-bottom: 20px;
            .infoBoxL{
                width: 50px;
                height: 50px;
                overflow: hidden;
                img{
                    width: 50px;
                    height: 50px;
                    border-radius: 100%;
                }
            }
            .infoBoxR{
                flex: 1;
                margin-left: 20px;
                .sp1{
                    display: block;
                    margin-bottom: 10px;
                    font-size: 18px;
                    color: #666666;
                }
                .sp2{
                    display: inline-block;
                    font-size: 14px;
                    // font-weight: bolder;
                }
                .sp3{
                    display: inline-block;
                    font-size: 14px;
                    // font-weight: bolder;
                    margin-left: 30px;
                }
                .ppp{
                    margin-left: 0;
                    border-top: 1px solid #f3f3f3;
                    padding-top: 20px;
                }
            }
            
        }
</style>
