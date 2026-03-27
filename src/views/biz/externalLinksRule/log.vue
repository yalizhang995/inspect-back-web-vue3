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
            <el-form-item label="规则名称" prop="ruleName">
                <el-input
                    v-model="queryParams.ruleName"
                    placeholder="请输入规则名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="外链链接" prop="rule">
                <el-input
                    v-model="queryParams.rule"
                    placeholder="请输入外链链接"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="操作人" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入操作人"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="操作开始时间" prop="findTimeStart">
                <el-date-picker
                    v-model="queryParams.findTimeStart"
                    type="date"
                    placeholder="选择日期"
                    @clear="queryParams.findTimeStart=null"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="操作结束时间" prop="findTimeEnd">
                <el-date-picker
                    v-model="queryParams.findTimeEnd"
                    type="date"
                    placeholder="选择日期"
                    @clear="queryParams.findTimeEnd=null"
                    >
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        

        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

            <el-col :span="1.5">
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

        <el-table
            v-loading="loading"
            :data="tableList"
            @selection-change="handleSelectionChange"
            fit
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="规则名称" prop="ruleName" min-width="200" show-overflow-tooltip />
            <el-table-column label="外链链接" prop="rule" min-width="240" show-overflow-tooltip/>
            <el-table-column label="外链Hash"  prop="ruleHash" min-width="200"></el-table-column>
            <el-table-column label="操作人"  prop="updateBy" min-width="100"></el-table-column>
            <el-table-column label="操作类型"  prop="operate" min-width="100"></el-table-column>
            <el-table-column label="操作时间"  prop="createTime"  min-width="180"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-user" @click="handleSeeLog(scope.row)" v-if="scope.row.oldRule">详情</el-button>
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
    logList
} from "@/api/biz/externalLinksRule";
export default {
    name: "InspSiteXmt",
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
            // 站点和新媒体账号关联表格数据
            tableList: [],
            queryParams:{
                ruleId: null,
                pgNum: 1,
                pgSize: 10,
                ruleName: null, // 规则名称
                rule: null, // 外链链接
                ruleHash: null, // 外链hash
                name: null, // 操作人
                findTimeStart: null, // 操作开始时间
                findTimeEnd: null, // 操作结束时间
            },
            isGoInfo: false,
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转

        // 非进入详情 离开页面删除
        if(this.isGoInfo == false){
             sessionStorage.removeItem('ruleId')
        }
        next();

    },
    created() {
        if(sessionStorage.getItem('ruleId')){
            this.queryParams.ruleId = sessionStorage.getItem('ruleId');
            this.getList();
        }
    },
    methods: {
        /** 查询站点和新媒体账号关联列表 */
        getList() {
            this.loading = true;
            // 操作开始时间
            if(this.queryParams.findTimeStart){
                this.queryParams.findTimeStart = this.queryParams.findTimeStart + '00:00:00';
            }
            // 操作结束时间
            if(this.queryParams.findTimeEnd){
                this.queryParams.findTimeEnd = this.queryParams.findTimeEnd + '23:59:59';
            }
            logList(this.queryParams).then(response => {
                this.tableList = response.rows;
                for(var i in this.tableList){
                    if(!this.tableList[i].name){
                        this.tableList[i].name = '--';
                    }
                    if(!this.tableList[i].createTime){
                        this.tableList[i].createTime = '--';
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
            this.isGoInfo = false;
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
                this.$router.go(-1);    
            })
        },
        // 详情
        handleSeeLog(row){
            this.isGoInfo = true;
            // sessionStorage.setItem('ruleLogInfo', JSON.stringify(row));
            sessionStorage.setItem('ruleLogInfoId', row.idStr);
            this.$router.push({path:'/externalLinks/externalLinksRuleLogInfo'});
        },
    }
};
</script>
<style scoped>
    /deep/.el-upload-list{
        width: 86%!important;
    }
</style>
