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
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                    @clear="queryParams.siteCode=null"
                />
            </el-form-item>
            <el-form-item label="订单ID" prop="orderId">
                <el-input
                    v-model="queryParams.orderId"
                    placeholder="请输入订单ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                    @clear="queryParams.orderId=null"
                />
            </el-form-item>
            <el-form-item label="批次ID" prop="batchId">
                <el-input
                    v-model="queryParams.batchId"
                    placeholder="请输入批次ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                    @clear="queryParams.batchId=null"
                />
            </el-form-item>
            <el-form-item label="爬虫任务ID" prop="columnId">
                <el-input
                    v-model="queryParams.columnId"
                    placeholder="请输入爬虫任务ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                    @clear="queryParams.columnId=null"
                />
            </el-form-item>
            <el-form-item label="是否加急" prop="vip">
                <el-select v-model="queryParams.vip" clearable placeholder="请选择是否加急" style="width:310px" @clear="queryParams.vip=null">
                    <el-option
                        v-for="item in vipList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="来源类型" prop="sourceType">
                <el-select v-model="queryParams.sourceType" clearable placeholder="请选择来源类型" style="width:310px" @clear="queryParams.sourceType=null">
                    <el-option
                        v-for="item in sourceTypeList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                    @clear="queryParams.createBy=null"
                />
            </el-form-item>
            <el-form-item label="操作时间" prop="">
                <el-date-picker
                    v-model="findTimetArr"
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
            

            <el-form-item style="marginLeft:17px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="tableList"
            fit
        >
            <el-table-column prop="index" label="序号" width="80" align="center" fixed></el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" min-width="120" fixed></el-table-column>
            <el-table-column prop="orderId" label="订单ID" align="" min-width="100"></el-table-column>
            <el-table-column prop="batchId" label="批次ID" min-width="100"></el-table-column>
            <el-table-column prop="columnId" label="爬虫任务ID" align="" min-width="220"></el-table-column>
            <el-table-column prop="orderName" label="订单名称" align="" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="batchName" label="批次名称" align="" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="是否加急" align="center" prop="vipTxt" width="100">
                <template slot-scope="scope">
                    <!-- <el-switch
                        v-model="scope.row.vipSwitch"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        >
                    </el-switch> -->
                    <span :style="{color:scope.row.color}">{{scope.row.vipTxt}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sourceTypeTxt" label="来源类型" align="" min-width="100" ></el-table-column>
            <el-table-column prop="taskNum" label="影响任务数"align="center" min-width="100" ></el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="160"></el-table-column>
            <el-table-column prop="createBy" label="操作人" min-width="120" ></el-table-column>
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
    columnLog
} from "@/api/biz/column";
export default {
    name: "InspSiteXmt",
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
            // 站点和新媒体账号关联表格数据
            tableList: [],
            queryParams:{
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                orderId: null,
                batchId: null,
                columnId: null,
                vip: null,
                sourceType: null,
                createBy: null,
                startDate: null,
                endDate: null,
            },
            findTimetArr: [],
            // 来源类型
            sourceTypeList: [
                { label: '订单批次', val: 0 },
                { label: '报告任务', val: 1 },
                { label: '爬虫任务', val: 2 },
            ],
            // 是否加急
            vipList: [ 
                { label: '加急', value: 1 },
                { label: '不加急', value: 0 },
            ],
        };
    },
    created() {
        this.getList();
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
        /** 查询站点和新媒体账号关联列表 */
        getList() {
            columnLog(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    // 是否加急
                    if(this.tableList[i].vip == 0){
                        this.tableList[i].vipTxt = '不加急';
                        this.tableList[i].vipSwitch = false;
                        this.tableList[i].color = '';
                    }else if(this.tableList[i].vip == 1){
                        this.tableList[i].vipTxt = '加急';
                        this.tableList[i].vipSwitch = true;
                        this.tableList[i].color = 'red';
                    }
                    // 来源类型
                    if(this.tableList[i].sourceType == 0){
                        this.tableList[i].sourceTypeTxt = '订单批次';
                    }else if(this.tableList[i].sourceType == 1){
                        this.tableList[i].sourceTypeTxt = '报告任务';
                    }else if(this.tableList[i].sourceType == 2){
                        this.tableList[i].sourceTypeTxt = '爬虫任务';
                    }
                    if(!this.tableList[i].columnId){
                        this.tableList[i].columnId = '--';
                    }
                    if(!this.tableList[i].orderName){
                        this.tableList[i].orderName = '--';
                    }
                    if(!this.tableList[i].batchName){
                        this.tableList[i].batchName = '--';
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.findTimetArr && this.findTimetArr.length > 0){
                this.queryParams.startDate = this.formatDate(this.findTimetArr[0]) + ' 00:00:00';
                this.queryParams.endDate = this.formatDate(this.findTimetArr[1]) + ' 23:59:59';
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.findTimetArr = [];
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
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.findTimetArr = [];
                this.queryParams.findTimeStart = null;
                this.queryParams.findTimeEnd = null;
            }
        },
    }
};
</script>
<style scoped lang="scss">
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>

</style>
