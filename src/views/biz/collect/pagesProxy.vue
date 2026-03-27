<template>
    <div class="app-container">
        <!-- 采集记录 -->
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
            <el-form-item label="订单批次ID" prop="batchId">
                <el-input
                    v-model="queryParams.batchId"
                    placeholder="请输入订单批次ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.batchId=null"
                />
            </el-form-item>
            <el-form-item label="采集节点IP" prop="ip">
                <el-input
                    v-model="queryParams.ip"
                    placeholder="请输入采集节点IP"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.ip=null"
                />
            </el-form-item>
            <el-form-item label="返回码" prop="statusCode">
                <el-input
                    v-model="queryParams.statusCode"
                    placeholder="请输入返回码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.statusCode=null"
                />
            </el-form-item>
            <el-form-item label="任务类型" prop="taskType">
                <el-select v-model="queryParams.taskType" clearable placeholder="请选择任务类型" style="width:300px" @clear="queryParams.taskType=null">
                    <el-option
                        v-for="item in taskTypeList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="代理采集" prop="spiderEnable">
                <el-select v-model="queryParams.spiderEnable" clearable placeholder="请选择代理采集" style="width:300px" @clear="queryParams.spiderEnable=null">
                    <el-option
                        v-for="item in spiderEnableList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="网页地址" prop="url">
                <el-input
                    v-model="queryParams.url"
                    placeholder="请输入网页地址"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:700px"
                    @clear="queryParams.url=null"
                />
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
            fit
        >
            <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="url" label="网页地址" align="" min-width="240" show-overflow-tooltip>
                <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="spiderDate" label="采集日期" align="" min-width="120"></el-table-column>
            <el-table-column prop="spiderCount" label="采集次数" align="center" min-width="100" ></el-table-column>
            <el-table-column prop="batchId" label="订单批次ID" align="center" min-width="120" ></el-table-column>
            <el-table-column prop="ip" label="采集节点IP" align="" min-width="120" ></el-table-column>
            <el-table-column prop="spiderEnableTxt" label="代理采集" align="center" min-width="120" ></el-table-column>
            <el-table-column prop="taskTypeTxt" label="任务类型" align="center" min-width="120" ></el-table-column>
            <el-table-column prop="statusCode" label=返回码 align="center" min-width="100" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="" min-width="160" ></el-table-column>
            <el-table-column prop="updateTime" label="修改时间" align="" min-width="160" ></el-table-column>
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
    pagesProxy
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
                spiderDateStart: null,
                spiderDateEnd: null,
                taskType: null,
                spiderEnable: null,
                batchId: null,
                ip: null,
                statusCode: null,
            },
            DateArr: [],

            // 任务类型
            taskTypeList: [
                { label: '日常', val: 1 },
                { label: '全站', val: 2 },
            ],
            // 代理采集
            spiderEnableList: [
                { label: '代理', val: true },
                { label: '非代理', val: false },
            ],
        };
    },
    watch: {
        // 'queryParams.url'(val){
        //     console.log(val,'url地址')
        //     if(val){
        //         console.log(this.queryParams.siteCode,'网站标识码')
        //     }
        // }
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
            pagesProxy(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    // 代理采集
                    if(this.tableList[i].spiderEnable == true){
                        this.tableList[i].spiderEnableTxt = '代理';
                    }else if(this.tableList[i].spiderEnable == false){
                        this.tableList[i].spiderEnableTxt = '非代理';
                    }
                    // 任务类型
                    if(this.tableList[i].taskType == 1){
                        this.tableList[i].taskTypeTxt = '日常';
                    }else if(this.tableList[i].taskType == 2){
                        this.tableList[i].taskTypeTxt = '全站';
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.DateArr.length > 0){
                this.queryParams.spiderDateStart = this.formatDate(this.DateArr[0]);
                this.queryParams.spiderDateEnd = this.formatDate(this.DateArr[1]);
            }
            if(this.queryParams.url && !this.queryParams.siteCode){
                this.$modal.msgWarning("请输入网站标识码");
            }else{
                this.getList();
            }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.spiderDateStart = null; // 开始时间
            this.queryParams.spiderDateEnd = null; // 结束时间
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
                this.queryParams.spiderDateStart = null;
                this.queryParams.spiderDateEnd = null;
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
