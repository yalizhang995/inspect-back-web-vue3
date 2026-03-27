<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="110px"
        >
            <el-form-item label="记录状态" prop="status">
                <el-select v-model="queryParams.status" filterable clearable placeholder="请选择记录状态" @clear='queryParams.status = null' style="width:220px">
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="填报单位类型" prop="codeTypeInteger">
                <el-select v-model="queryParams.codeTypeInteger" filterable clearable placeholder="请选择填报单位类型" @clear='queryParams.codeTypeInteger = null' style="width:220px">
                    <el-option
                        v-for="item in codeTypeIntegerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="父级标识码" prop="parentSite" >
                <el-input
                    v-model="queryParams.parentSite"
                    placeholder="请输入父级标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.parentSite = null'
                    style="width:220px"
                />
            </el-form-item> -->
            <el-form-item label="填报单位标识码" prop="siteCode" >
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入填报单位标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.siteCode = null'
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="新媒体标识码" prop="siteCodeMedia" >
                <el-input
                    v-model="queryParams.siteCodeMedia"
                    placeholder="请输入新媒体标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.siteCodeMedia = null'
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="账号类型" prop="appType">
                <el-select v-model="queryParams.appType" filterable clearable placeholder="请选择账号类型" @clear='queryParams.appType = null' style="width:220px">
                    <el-option
                        v-for="item in appTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号名称" prop="accountName" >
                <el-input
                    v-model="queryParams.accountName"
                    placeholder="请输入账号名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.accountName = null'
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="微信号ID" prop="uid" >
                <el-input
                    v-model="queryParams.uid"
                    placeholder="请输入微信号ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.uid = null'
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="唯一标识" prop="uniqueCode" >
                <el-input
                    v-model="queryParams.uniqueCode"
                    placeholder="请输入唯一标识"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.uniqueCode = null'
                    style="width:220px"
                />
            </el-form-item>
            <el-form-item label="账号状态" prop="appUserState">
                <el-select v-model="queryParams.appUserState" filterable clearable placeholder="请选择账号状态" @clear='queryParams.appUserState = null' style="width:220px">
                    <el-option
                        v-for="item in appUserStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否开启监测" prop="enabled">
                <el-select v-model="queryParams.enabled" filterable clearable placeholder="请选择是否开启监测" @clear='queryParams.enabled = null' style="width:220px">
                    <el-option
                        v-for="item in enabledList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据ID" prop="idStr" >
                <el-input
                    v-model="queryParams.idStr"
                    placeholder="请输入数据ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.idStr = null'
                    style="width:220px"
                />
            </el-form-item>

            <el-form-item style="marginLeft: 26px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
           <el-button
                type="primary"
                plain
                icon=""
                size="mini"
                @click="goBack"
            >返回上级</el-button>
        </el-row>
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspImportdataTaskList"
            fit
        >
            <el-table-column label="序号" prop="index" min-width="80" align="center" />
            <el-table-column label="数据ID" prop="idStr" min-width="210" align="" />
            <el-table-column label="任务ID" prop="taskId" min-width="80" align="center" />
            <el-table-column label="记录类型"  prop="typeTxt" min-width="100" align="center" />
            <el-table-column label="记录状态"  prop="statusTxt" min-width="100" align="center">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" :class="scope.row.statusTxt == '失败' ? 'tableClass' : ''">{{ scope.row.statusTxt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述"  prop="desc" min-width="260" />
            
            <el-table-column label="填报单位标识码"  prop="siteCode" min-width="160" />
            <el-table-column label="账号类型" align="center" prop="appTypeTxt" width="120" />
            <el-table-column label="账号类型名称" align="" prop="appTypeName" width="220" show-overflow-tooltip />
            <el-table-column label="新媒体标识码" align="" prop="siteCodeMedia" width="160"/>
            
            <el-table-column label="微信号ID" align="" prop="uid" width="180" show-overflow-tooltip />
            <el-table-column label="唯一标识" align="" prop="uniqueCode" width="180" show-overflow-tooltip />
            <el-table-column label="账号状态" align="center" prop="appUserStateTxt" width="140" />

            <el-table-column label="主页地址" align="" prop="homeUrl" width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.homeUrl)">{{scope.row.homeUrl}}</span>
                </template>
            </el-table-column>
            
            <el-table-column label="账号名称" align="" prop="accountName" width="220" show-overflow-tooltip />
            <el-table-column label="账号主体" align="" prop="accountSubject" width="220" show-overflow-tooltip />
            <el-table-column label="是否开启监测" align="center" prop="enabledTxt" width="120" />
            <el-table-column label="地区" align="" prop="area" width="200" show-overflow-tooltip />
            <el-table-column label="创建人" prop="createBy"  min-width="120"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"  min-width="190"></el-table-column>
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

import { getImportRecordList } from "@/api/biz/inspSiteInfo";

export default {
    name: "record",
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
            // 审核数据回导任务表格数据
            inspImportdataTaskList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                taskId: null,
                status: null,
                codeTypeInteger: null,
                siteCode: null,
                siteCodeMedia: null,
                appType: null,
                accountName: null,
                uid: null,
                uniqueCode: null,
                appUserState: null,
                enabled: null,
                idStr: null
            },
            // 记录类型
            typeList: [
                { label: '新增', value: 0 },
                { label: '修改', value: 1 },
            ],
            // 记录状态
            statusList: [
                { label: '正常', value: 0 },
                { label: '失败', value: 1 },
                { label: '异常', value: 2 }
            ],
            // 是否自定义站点
            customFlagList: [
                { label: '是', value: true },
                { label: '否', value: false },
            ],
            // 站点类型
            codeTypeIntegerList: [
                { label: '网站', value: 1 },
                { label: '新媒体', value: 2 },
            ],
            // 账号类型
            appTypeList: [
                { label: '微信公众号', value: 1 },
                { label: '新浪微博', value: 2 },
                { label: '抖音短视频', value: 3 },
                { label: '今日头条', value: 4 },
                { label: '快手短视频', value: 5 },
                { label: '移动客户端', value: 111 },
                { label: '人民号', value: 112 },
                { label: '百家号', value: 113 },
                { label: '腾讯微视', value: 117 },
                { label: '企鹅号', value: 118 },
                { label: '南方号', value: 119 },
                { label: '一点号', value: 120 },
                { label: '网易', value: 121 },
                { label: '小程序', value: 122 },
                { label: '大鱼号', value: 123 },
                { label: '搜狐号', value: 124 },
                { label: '澎湃号', value: 125 },
                { label: '知乎', value: 126 },
                { label: '微信视频号', value: 127 },
                { label: '其他', value: 114 },
            ],
            // 新媒体账号状态
            appUserStateList: [
                { label: '正常', value: 1 },
                { label: '迁移', value: 2 },
                { label: '删除', value: 3 },
                { label: '注销', value: 0 },
                { label: '已发关停公告', value: 4 },
                { label: '冻结期', value: 5 },
            ],
            // 是否开启监测
            enabledList: [
                { label: '开启', value: true },
                { label: '关闭', value: false }
            ],
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('mediaInfoRecordId')
        next();

    },
    created() {
        if(sessionStorage.getItem('mediaInfoRecordId')){
            this.queryParams.taskId = sessionStorage.getItem('mediaInfoRecordId')
        }
        this.getList();
    },
    methods: {
        
        /** 查询审核数据回导任务列表 */
        getList() {
            this.loading = true;
            getImportRecordList(this.queryParams).then(response => {
                this.inspImportdataTaskList = response.rows;
                for(var i in this.inspImportdataTaskList){
                    this.inspImportdataTaskList[i].index = parseInt(i)+1;
                    // 记录状态
                    for(var j in this.statusList){
                        if(this.inspImportdataTaskList[i].status == this.statusList[j].value){
                            this.inspImportdataTaskList[i].statusTxt = this.statusList[j].label;
                        }
                    }
                    // 记录类型
                    for(var j in this.typeList){
                        if(this.inspImportdataTaskList[i].type == this.typeList[j].value){
                            this.inspImportdataTaskList[i].typeTxt = this.typeList[j].label;
                        }
                    }
                    // 账号类型
                    for(var j in this.appTypeList){
                        if(this.inspImportdataTaskList[i].appType == this.appTypeList[j].value){
                            this.inspImportdataTaskList[i].appTypeTxt = this.appTypeList[j].label;
                        }
                    }
                    if(!this.inspImportdataTaskList[i].siteCode){
                        this.inspImportdataTaskList[i].siteCode = '--'
                    }
                    if(this.inspImportdataTaskList[i].appType != 1){
                        this.inspImportdataTaskList[i].uid = '--';
                    }
                    // 账号状态
                    if(this.inspImportdataTaskList[i].appUserState == 1){
                        this.inspImportdataTaskList[i].appUserStateTxt = '正常';
                    }else if(this.inspImportdataTaskList[i].appUserState == 2){
                        this.inspImportdataTaskList[i].appUserStateTxt = '迁移';
                    }else if(this.inspImportdataTaskList[i].appUserState == 3){
                        this.inspImportdataTaskList[i].appUserStateTxt = '删除';
                    }else if(this.inspImportdataTaskList[i].appUserState == 0){
                        this.inspImportdataTaskList[i].appUserStateTxt = '注销';
                    }else if(this.inspImportdataTaskList[i].appUserState == 4){
                        this.inspImportdataTaskList[i].appUserStateTxt = '已发关停公告';
                    }else if(this.inspImportdataTaskList[i].appUserState == 5){
                        this.inspImportdataTaskList[i].appUserStateTxt = '冻结期';
                    }else{
                        this.inspImportdataTaskList[i].appUserStateTxt = '--';
                    }
                    // 是否开启监测
                    if(this.inspImportdataTaskList[i].enabled == true){
                        this.inspImportdataTaskList[i].enabledTxt = '开启';
                    }else if(this.inspImportdataTaskList[i].enabled == false){
                        this.inspImportdataTaskList[i].enabledTxt = '关闭';
                    }else{
                        this.inspImportdataTaskList[i].enabledTxt = '--';
                    }
                    
                    // 是否收费
                    if(this.inspImportdataTaskList[i].vipFlag == true){
                        this.inspImportdataTaskList[i].vipFlagTxt = '收费';
                    }else if(this.inspImportdataTaskList[i].vipFlag == false){
                        this.inspImportdataTaskList[i].vipFlagTxt = '免费';
                    }
                    // 检查每个变量是否有值，并且拼接有值的变量
                    this.inspImportdataTaskList[i].area = '';
                    if (this.inspImportdataTaskList[i].provinceString) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].provinceString + '/';
                    if (this.inspImportdataTaskList[i].cityString) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].cityString + '/';
                    if (this.inspImportdataTaskList[i].countyString) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].countyString + '/';
                    this.inspImportdataTaskList[i].area = this.inspImportdataTaskList[i].area.slice(0, -1);

                    // 根据结果输出
                    if (!this.inspImportdataTaskList[i].area) {
                        this.inspImportdataTaskList[i].area = '--';
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
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },
        // 返回上级
        goBack(){
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
                this.$router.push({ path: '/media/infoTaskInfo' })
                sessionStorage.removeItem('mediaInfoRecordId')
            })

        },

    }
};
</script>
<style lang="scss" scoped>
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
    } 
    .tableClass{
        color: red;
    }
</style>
