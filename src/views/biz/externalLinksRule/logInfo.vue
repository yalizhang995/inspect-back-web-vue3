<template>
    <div class="app-container">
        <!-- <el-form
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
        </el-form> -->
        

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
            <el-table-column label="编辑前" align="center">
                <el-table-column label="规则名称" prop="oldRule.ruleName" min-width="140" show-overflow-tooltip />
                <el-table-column label="外链链接" prop="oldRule.rule" min-width="140" show-overflow-tooltip />
                <el-table-column label="规则分类" align="center" prop="oldRule.ruleTypesTxt" min-width="80" />
                <el-table-column label="外链类型" align="center" prop="oldRule.errorTypesTxt" min-width="100" />
                <el-table-column label="信任状态" align="center" prop="oldRule.trustStateTxt" min-width="80" />
                <el-table-column label="应用范围" align="" prop="oldRuleScopeStr" min-width="200" />
                <el-table-column label="排除范围" align="" prop="oldRuleExcludeScopeStr" min-width="200" />
                <el-table-column label="是否开启" align="center" prop="oldRule.enableTxt" min-width="80" />
            </el-table-column>
            <el-table-column label="编辑后" align="center">
                <el-table-column label="规则名称" prop="newRule.ruleName" min-width="140" show-overflow-tooltip />
                <el-table-column label="外链链接" prop="newRule.rule" min-width="140" show-overflow-tooltip />
                <el-table-column label="规则分类" align="center" prop="newRule.ruleTypesTxt" min-width="80" />
                <el-table-column label="外链类型" align="center" prop="newRule.errorTypesTxt" min-width="100" />
                <el-table-column label="信任状态" align="center" prop="newRule.trustStateTxt" min-width="80" />
                <el-table-column label="应用范围" align="" prop="newRuleScopeStr" min-width="200" />
                <el-table-column label="排除范围" align="" prop="newRuleExcludeScopeStr" min-width="200" />
                <el-table-column label="是否开启" align="center" prop="newRule.enableTxt" min-width="80" />
            </el-table-column>
            <el-table-column label="操作人"  prop="updateBy" min-width="100"></el-table-column>
            <el-table-column label="操作时间"  prop="createTime"  min-width="180"/>
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
    logList,
    getLogDetails
} from "@/api/biz/externalLinksRule";
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

            logInfoObj :{},
            logInfoId: null,
            // 外链类型
            errorTypesList: [
                { label: '广告', val: 1 },
                { label: '赌博', val: 200 },
                { label: '色情', val: 300 },
                { label: '仿冒网站', val: 400 },
                { label: '商业', val: 500 },
                { label: '知名媒体', val: 600 },
                { label: '知名平台', val: 700 },
                { label: '域名注销', val: 800 },
                { label: '游戏', val: 900 },
                { label: '影视资源', val: 1000 },
                { label: '报送已关停', val: 1100 },
                { label: '无法确定', val: 1200 },
                { label: '数据异常', val: 1300 },
                { label: '错链', val: 1400 },
                { label: '正常', val: 1500 },
            ],
        };
    },
     beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('ruleLogInfoId')
        next();

    },
    created() {
        if(sessionStorage.getItem('ruleLogInfoId')){
            this.logInfoId = sessionStorage.getItem('ruleLogInfoId');
            this.getList();
            // console.log(this.tableList,'转换后的表格数据')
        }
    },
    methods: {
        /** 查询站点和新媒体账号关联列表 */
        getList() {
            getLogDetails({idStr:this.logInfoId}).then(response => {
                this.tableList.push(response.data);
                /**编辑前 */
                for(var j in this.errorTypesList){
                    if(this.tableList[0].oldRule.errorTypes == this.errorTypesList[j].val){
                        this.tableList[0].oldRule.errorTypesTxt = this.errorTypesList[j].label;
                    }
                }
                // 信任状态
                if(this.tableList[0].oldRule.trustState == 0){
                    this.tableList[0].oldRule.trustStateTxt = '过滤';
                }else if(this.tableList[0].oldRule.trustState == 1){
                    this.tableList[0].oldRule.trustStateTxt = '白名单';
                }else if(this.tableList[0].oldRule.trustState == 2){
                    this.tableList[0].oldRule.trustStateTxt = '黑名单';
                }
                // 规则分类
                if(this.tableList[0].oldRule.ruleTypes == 0){
                    this.tableList[0].oldRule.ruleTypesTxt = '域名';
                }else if(this.tableList[0].oldRule.ruleTypes == 1){
                    this.tableList[0].oldRule.ruleTypesTxt = 'URL';
                }
                // 应用范围
                if(this.tableList[0].oldRuleScope && this.tableList[0].oldRuleScope.length > 0){
                    this.tableList[0].oldRuleScopeStr = this.tableList[0].oldRuleScope.map(item => item.siteCode).join(',');
                    if(this.tableList[0].oldRuleScopeStr == '0'){
                        this.tableList[0].oldRuleScopeStr = '全局';
                    }
                }
                // 排除范围
                if(this.tableList[0].oldRuleExcludeScope && this.tableList[0].oldRuleExcludeScope.length > 0){
                    this.tableList[0].oldRuleExcludeScopeStr = this.tableList[0].oldRuleExcludeScope.map(item => item.siteCode).join(',');
                    if(this.tableList[0].oldRuleExcludeScopeStr == '0'){
                        this.tableList[0].oldRuleExcludeScopeStr = '全局';
                    }
                }else{
                    this.tableList[0].oldRuleExcludeScopeStr = '无';
                }
                // 是否开启
                if(this.tableList[0].oldRule.enable == true){
                    this.tableList[0].oldRule.enableTxt = '开启';
                }else if(this.tableList[0].oldRule.enable == false){
                    this.tableList[0].oldRule.enableTxt = '关闭';
                }

                /**编辑后 */
                for(var j in this.errorTypesList){
                    if(this.tableList[0].newRule.errorTypes == this.errorTypesList[j].val){
                        this.tableList[0].newRule.errorTypesTxt = this.errorTypesList[j].label;
                    }
                }
                // 信任状态
                if(this.tableList[0].newRule.trustState == 0){
                    this.tableList[0].newRule.trustStateTxt = '过滤';
                }else if(this.tableList[0].newRule.trustState == 1){
                    this.tableList[0].newRule.trustStateTxt = '白名单';
                }else if(this.tableList[0].newRule.trustState == 2){
                    this.tableList[0].newRule.trustStateTxt = '黑名单';
                }
                // 规则分类
                if(this.tableList[0].newRule.ruleTypes == 0){
                    this.tableList[0].newRule.ruleTypesTxt = '域名';
                }else if(this.tableList[0].newRule.ruleTypes == 1){
                    this.tableList[0].newRule.ruleTypesTxt = 'URL';
                }
                // 应用范围
                if(this.tableList[0].newRuleScope && this.tableList[0].newRuleScope.length > 0){
                    this.tableList[0].newRuleScopeStr = this.tableList[0].newRuleScope.map(item => item.siteCode).join(',');
                    if(this.tableList[0].newRuleScopeStr == '0'){
                        this.tableList[0].newRuleScopeStr = '全局';
                    }
                }
                // 排除范围
                if(this.tableList[0].newRuleExcludeScope && this.tableList[0].newRuleExcludeScope.length > 0){
                    this.tableList[0].newRuleExcludeScopeStr = this.tableList[0].newRuleExcludeScope.map(item => item.siteCode).join(',');
                    if(this.tableList[0].newRuleExcludeScopeStr == '0'){
                        this.tableList[0].newRuleExcludeScopeStr = '全局';
                    }
                }else{
                    this.tableList[0].newRuleExcludeScopeStr = '无';
                }
                // 是否开启
                if(this.tableList[0].newRule.enable == true){
                    this.tableList[0].newRule.enableTxt = '开启';
                }else if(this.tableList[0].newRule.enable == false){
                    this.tableList[0].newRule.enableTxt = '关闭';
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
                this.$router.go(-1);    
            })
        },
    }
};
</script>
<style scoped>
    /deep/.el-upload-list{
        width: 86%!important;
    }
</style>
