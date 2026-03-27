<template>
    <div class="app-container">
        <!-- 日常统计 -->
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="90px"
        >
            <el-form-item label="统计对象" prop="collectionName">
                <el-input
                    v-model="queryParams.collectionName"
                    placeholder="请输入统计对象"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.collectionName=null"
                />
            </el-form-item>
            <el-form-item label="统计类型" prop="type">
                <el-select v-model="queryParams.type" clearable placeholder="请选择统计类型" style="width:300px" @clear="queryParams.type=null">
                    <el-option
                        v-for="item in typeList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采集时间" prop="batchId">
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

            <el-form-item style="marginLeft:17px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="tableList"
            @sort-change="sortChange"
            fit
        >
            <el-table-column prop="index" label="序号" min-width="80" align="center"></el-table-column>
            <el-table-column prop="collectionName" label="统计对象" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="statDate" label="统计日期" align="center" min-width="180" ></el-table-column>
            <el-table-column prop="todayCount" label="当天数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="yesterdayCount" label="昨天数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="todayIncrement" label="日增量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="typeTxt" label="统计类型" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc403" label="403数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc412" label="412数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc504" label="504数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc777" label="777数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc888" label="888数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc999" label="999数据量" align="center" min-width="100" sortable="custom"></el-table-column>
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
    collectionStats
} from "@/api/biz/collect";
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
                collectionName: null,
                statDateStart: null,
                statDateEnd: null,
                orderTypes: [],
            },
            DateArr: [],

            // 统计类型
            typeList: [
                { label: '库表统计', val: 0 },
                { label: '日常统计', val: 1 },
                { label: '全站统计', val: 2 },
                { label: '站点统计', val: 5 },
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
            collectionStats(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    if(this.tableList[i].hc403 == null){
                        this.tableList[i].hc403 = '--';
                    }
                    if(this.tableList[i].hc412 == null){
                        this.tableList[i].hc412 = '--';
                    }
                    if(this.tableList[i].hc504 == null){
                        this.tableList[i].hc504 = '--';
                    }
                    if(this.tableList[i].hc777 == null){
                        this.tableList[i].hc777 = '--';
                    }
                    if(this.tableList[i].hc888 == null){
                        this.tableList[i].hc888 = '--';
                    }
                    if(this.tableList[i].hc999 == null){
                        this.tableList[i].hc999 = '--';
                    }
                    // 统计类型
                    if(this.tableList[i].type == 0){
                        this.tableList[i].typeTxt = '库表统计';
                    }else if(this.tableList[i].type == 1){
                        this.tableList[i].typeTxt = '日常统计';
                    }else if(this.tableList[i].type == 2){
                        this.tableList[i].typeTxt = '全站统计';
                    }else if(this.tableList[i].type == 5){
                        this.tableList[i].typeTxt = '站点统计';
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.DateArr.length > 0){
                this.queryParams.statDateStart = this.formatDate(this.DateArr[0]);
                this.queryParams.statDateEnd = this.formatDate(this.DateArr[1]);
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.statDateStart = null; // 开始时间
            this.queryParams.statDateEnd = null; // 结束时间
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.statDateStart = null;
                this.queryParams.statDateEnd = null;
            }
        },

        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            let newName = '';
            if(prop == 'todayCount'){ // 当天数据量
                newName = 'tc';
            }else if(prop == 'yesterdayCount'){
                newName = 'yc';
            }else if(prop == 'todayIncrement'){
                newName = 'tic';
            }else{
                newName = prop;
            }
            if(order == 'descending'){ // 下
                this.queryParams.orderTypes = [{ code: 1, name: newName }];
                this.getList(); // 列表数据
            }else if(order == 'ascending'){ // 上
                this.queryParams.orderTypes = [{ code: 0, name: newName }];
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
