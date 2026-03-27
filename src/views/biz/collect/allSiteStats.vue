<template>
    <div class="app-container">
        <!-- 全站统计 -->
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
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.siteCode=null"
                />
            </el-form-item>
            <el-form-item label="批次ID" prop="batchId">
                <el-input
                    v-model="queryParams.batchId"
                    placeholder="请输入批次ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.batchId=null"
                />
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
            <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="batchId" label="批次ID" align="center" min-width="100" ></el-table-column>
            <el-table-column prop="siteCount" label="数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc403" label="403数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc412" label="412数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc504" label="504数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc777" label="777数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc888" label="888数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="hc999" label="999数据量" align="center" min-width="100" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" ></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" width="180" ></el-table-column>
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
    allSiteStats
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
                siteCode: null,
                // batchId: null,
                orderTypes: [],
            },
            DateArr: [],
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
            allSiteStats(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
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
        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            let newName = '';
            if(prop == 'siteCount'){ // 未更新天数
                newName = 'num';
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
