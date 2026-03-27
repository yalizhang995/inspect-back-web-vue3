<template>
    <div class="app-container">
        <!-- <span class="back">
            <el-button
            type="primary"
            plain
            icon=""
            size="mini"
            @click="goBack"
            v-hasPermi="['biz:inspSiteDirector:add']"
            >返回上级</el-button>
        </span> -->
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
        >
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="网站名称" prop="siteName">
                <el-input
                    v-model="queryParams.siteName"
                    placeholder="请输入网站名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            
            <el-form-item style="marginLeft:30px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspHand:remove']"
                >批量删除</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['biz:inspHand:edit']"
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
                    v-hasPermi="['biz:inspHand:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspHand:export']"
                >导出</el-button>
            </el-col> -->
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            <el-col :span="1.5" style="float:right">
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
            :data="tableDate"
            @selection-change="handleSelectionChange"
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <!-- <el-table-column label="订单批次" prop="id"  /> -->
            <el-table-column label="网站标识码" prop="siteCode" width="120" />
            <el-table-column label="网站名称"  prop="siteName" show-overflow-tooltip />
            <el-table-column label="订单名称"  prop="orderName" show-overflow-tooltip />
            <!-- <el-table-column label="订单批次"  prop="batchName" /> -->
            <el-table-column label="批次名称"  prop="batchName" show-overflow-tooltip />
            <el-table-column label="订单类型" align="" prop="orderTypeTxt" width="140" />
            <el-table-column label="任务类型" align="center" prop="taskTypeTxt" width="80" />
            <el-table-column label="开始时间" align="center" prop="startDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" prop="endDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.cutOffDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="结束时间" align="center" prop="endDate">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="提前截止时间" align="center" prop="cutOffDate">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.cutOffDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            
            <el-table-column label="任务状态" align="center" prop="reportStateTxt" width="80" />
            <el-table-column label="生成状态" align="center" prop="createReportStateTxt" width="80">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.createReportStateColor}">{{scope.row.createReportStateTxt}}</span>
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
    listInspHand,
    getInspHand,
    delInspHand,
    addInspHand,
    updateInspHand,
    listInspNorm
} from "@/api/biz/inspHand";
import {
    listInspReportTask,
    getInspReportTask,
    delInspReportTask,
    addInspReportTask,
    updateInspReportTask,
    getOrderBatchSelectList,
    updateCreateReportState,
    spiderTaskInit
} from "@/api/biz/inspReportTask";
import { uploadAvatars } from "@/api/system/user";
import { inspOrderSiteInfo } from "@/api/biz/inspOrderBatch";


export default {
    name: "InspHand",
    data() {
        return {
            imgShow: false,
            imgShowList: [],
            expireTimeOPtion: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
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
            tableDate: [],
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteName: null,
                siteCode: null,
                orderInfoId: null,
                orderBatchId: null,
                reportName: null,
                reportPath: null,
                reportState: null,
                startDate: null,
                endDate: null,
                cutOffDate: null,
                taskType: null,
                archiveState: null,
            },


        };
    },
    created() {
        if(sessionStorage.getItem('orderBatchInfo')){
            this.queryParams.orderBatchId = parseInt(sessionStorage.getItem('orderBatchInfo'))
            this.getList();
        }
        
    },
    methods: {
        /** 查询人工录入问题列表 */
        getList() {
            this.loading = true;
            listInspReportTask(this.queryParams).then(response => {
                this.tableDate = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.tableDate){
                    // 任务类型
                    if(this.tableDate[i].taskType == 1){
                        this.tableDate[i].taskTypeTxt = '全站';
                    }else if(this.tableDate[i].taskType == 2){
                        this.tableDate[i].taskTypeTxt = '抽查';
                    }
                    // 报告任务状态
                    if(this.tableDate[i].reportState == 1){
                        this.tableDate[i].reportStateTxt = '未生成';
                    }else if(this.tableDate[i].reportState == 2){
                        this.tableDate[i].reportStateTxt = '生效中';
                    }else if(this.tableDate[i].reportState == 3){
                        this.tableDate[i].reportStateTxt = '已到期';
                    }
                    // 报告生成状态
                    if(this.tableDate[i].createReportState == 1){
                        this.tableDate[i].createReportStateTxt = '未生成';
                        this.tableDate[i].createReportStateColor = '#606266';
                    }else if(this.tableDate[i].createReportState == 2){
                        this.tableDate[i].createReportStateTxt = '排队中';
                        this.tableDate[i].createReportStateColor = '#606266';
                    }else if(this.tableDate[i].createReportState == 3){
                        this.tableDate[i].createReportStateTxt = '生成中';
                        this.tableDate[i].createReportStateColor = '#606266';
                    }else if(this.tableDate[i].createReportState == 4){
                        this.tableDate[i].createReportStateTxt = '已生成';
                        this.tableDate[i].createReportStateColor = '#6cc65e';
                    }else if(this.tableDate[i].createReportState == 5){
                        this.tableDate[i].createReportStateTxt = '异常';
                        this.tableDate[i].createReportStateColor = '#F56C6C';
                    }else{
                        this.tableDate[i].createReportStateTxt = '--';
                    }
                    // 归档状态
                    if(this.tableDate[i].archiveState == 1){
                        this.tableDate[i].archiveStateTxt = '未存档';
                    }else if(this.tableDate[i].archiveState == 2){
                        this.tableDate[i].archiveStateTxt = '存档中';
                    }else if(this.tableDate[i].archiveState == 3){
                        this.tableDate[i].archiveStateTxt = '已存档';
                    }
                    // 订单类型
                    if(this.tableDate[i].orderType == 1){
                        this.tableDate[i].orderTypeTxt = '网站监测订单';
                    }else if(this.tableDate[i].orderType == 20){
                        this.tableDate[i].orderTypeTxt = '新媒体订单';
                    }
                    else if(this.tableDate[i].orderType == 30){
                        this.tableDate[i].orderTypeTxt = '网站安全监测订单';                        
                    }
                    
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        
        // /** 删除按钮操作 */
        // handleDelete(row) {
        //     const ids = row.id || this.ids;
        //     this.$modal
        //         .confirm(
        //             '是否确认删除人工录入问题编号为"' + ids + '"的数据项？'
        //         )
        //         .then(function() {
        //             return delInspHand({ids: [ids]});
        //         })
        //         .then(() => {
        //             this.getList();
        //             this.$modal.msgSuccess("删除成功");
        //         })
        //         .catch(() => {});
        // },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除人工录入问题编号为"' + ids + '"的数据项？')
                    .then(function() {
                        return delInspHand({ids:[ids]});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }else{
                const ids = this.ids
                this.$modal
                    .confirm('是否确认删除已选中的数据项？')
                    .then(function() {
                        return delInspHand({ids:ids});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }
            
        },
        /** 导出按钮操作 */
        handleExport() {
            let fileName = '人工数据'
            this.download(
                "biz/inspHand/export",
                {
                    ...this.queryParams
                },
                `${fileName}.xlsx`
            );
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
                sessionStorage.removeItem('orderBatchInfo')
                this.$router.go(-1);    
            })
        },
    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .back{
        display: flex;
        // justify-content: right;
        // float: right;
        margin-bottom: 20px;
    }
    .sp{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>
    /* /deep/.el-form-item__content{
        width: 192px!important;
    }
    /deep/.a .el-input__inner{
        width: 192px!important;
    } */
    /deep/.el-upload--picture-card{
        width: 92px;
        height: 92px;
        line-height: 92px;
    }
    /deep/.el-upload-list--picture-card .el-upload-list__item{
        width: 92px;
        height: 92px;
    }
    /deep/.el-upload-list__item{
        margin-bottom: -14px!important;
    }
    /deep/.el-dialog__body{
        padding: 20px!important
    }
    /deep/.el-dialog:not(.is-fullscreen) {
        margin-top: 3vh !important;
    }
    /deep/.el-dialog__body{
        max-height: 850px!important;
        overflow: auto;
    }
</style>
