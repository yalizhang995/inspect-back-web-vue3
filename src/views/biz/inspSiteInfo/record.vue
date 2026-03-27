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
            <el-form-item label="记录类型" prop="type">
                <el-select v-model="queryParams.type" filterable clearable placeholder="请选择记录类型" @clear='queryParams.type = null' style="width:260px">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="记录状态" prop="status">
                <el-select v-model="queryParams.status" filterable clearable placeholder="请选择记录状态" @clear='queryParams.status = null' style="width:260px">
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="填报单位类型" prop="codeTypeInteger">
                <el-select v-model="queryParams.codeTypeInteger" filterable clearable placeholder="请选择填报单位类型" @clear='queryParams.codeTypeInteger = null' style="width:260px">
                    <el-option
                        v-for="item in codeTypeIntegerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="父级标识码" prop="parentSite" >
                <el-input
                    v-model="queryParams.parentSite"
                    placeholder="请输入父级标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.parentSite = null'
                    style="width:260px"
                />
            </el-form-item>
            <el-form-item label="填报单位标识码" prop="siteCode" >
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入填报单位标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.siteCode = null'
                    style="width:260px"
                />
            </el-form-item>
            <el-form-item label="填报单位名称" prop="siteNameString" >
                <el-input
                    v-model="queryParams.siteNameString"
                    placeholder="请输入填报单位名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.siteNameString = null'
                    style="width:260px"
                />
            </el-form-item>
            <!-- <el-form-item label="文件名" prop="fileName" >
                <el-input
                    v-model="queryParams.fileName"
                    placeholder="请输入文件名"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:360px"
                    @clear='queryParams.fileName = null'
                />
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.createBy = null'
                />
            </el-form-item>
            <el-form-item label="ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.id = null'
                />
            </el-form-item> -->
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
            <el-table-column label="任务ID" prop="taskId" min-width="80" align="center" />
            <el-table-column label="记录类型"  prop="typeTxt" min-width="100" align="center" />
            <el-table-column label="记录状态"  prop="statusTxt" min-width="100" align="center">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" :class="scope.row.statusTxt == '失败' ? 'tableClass' : ''">{{ scope.row.statusTxt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述"  prop="desc" min-width="260" />
            <el-table-column label="父级标识码"  prop="parentSite" min-width="100" />
            <el-table-column label="填报单位类型"  prop="codeTypeString" min-width="120" align="center" />
            <el-table-column label="填报单位名称"  prop="siteNameString" min-width="160" show-overflow-tooltip />
            <el-table-column label="填报单位标识码"  prop="siteCode" min-width="120" />
            <el-table-column label="站点地址"  prop="siteUrlString" min-width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" v-if="scope.row.siteUrlString!=null && scope.row.siteUrlString!=''" @click="dzChange(scope.row.siteUrlString)"><span style="color:#606266">站点地址：</span >{{scope.row.siteUrlString}}</span><br v-if="scope.row.siteUrlString!=null && scope.row.siteUrlString!=''"/>
                    <span class="dz" v-if="scope.row.jumpUrl!=null && scope.row.jumpUrl!=''" @click="dzChange(scope.row.jumpUrl)"><span style="color:#606266">跳转地址：</span>{{scope.row.jumpUrl}}</span>
                    <span v-if="(scope.row.siteUrlString==null || scope.row.siteUrlString=='') && (scope.row.jumpUrl==null || scope.row.jumpUrl=='')">--</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="跳转地址"  prop="jumpUrl" min-width="160" show-overflow-tooltip /> -->
            <el-table-column label="站点状态"  prop="siteState" min-width="100" align="center" />
            <el-table-column label="是否渲染"  prop="renderFlag" min-width="120" align="center" />
            <el-table-column label="地区"  prop="area" min-width="160" show-overflow-tooltip />
            <el-table-column label="网站主办单位名称"  prop="director" min-width="140" show-overflow-tooltip />
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
                type: null,
                status: null,
                parentSite: null,
                siteCode: null,
                customFlag: null,
                siteNameString: null,
                codeTypeInteger: null,
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
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('infoRecordId')
        next();

    },
    created() {
        if(sessionStorage.getItem('infoRecordId')){
            this.queryParams.taskId = sessionStorage.getItem('infoRecordId')
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
                    // 检查每个变量是否有值，并且拼接有值的变量
                    this.inspImportdataTaskList[i].area = '';
                    if (this.inspImportdataTaskList[i].province) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].province + '/';
                    if (this.inspImportdataTaskList[i].city) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].city + '/';
                    if (this.inspImportdataTaskList[i].county) this.inspImportdataTaskList[i].area += this.inspImportdataTaskList[i].county + '/';
                    this.inspImportdataTaskList[i].area = this.inspImportdataTaskList[i].area.slice(0, -1);

                    // 根据结果输出
                    if (!this.inspImportdataTaskList[i].area) {
                        this.inspImportdataTaskList[i].area = '--';
                    }

                    if (!this.inspImportdataTaskList[i].siteNameString) {
                        this.inspImportdataTaskList[i].siteNameString = '--';
                    }
                    if (!this.inspImportdataTaskList[i].siteCode) {
                        this.inspImportdataTaskList[i].siteCode = '--';
                    }

                    if (!this.inspImportdataTaskList[i].renderFlag) {
                        this.inspImportdataTaskList[i].renderFlag = '--';
                    }
                    if (!this.inspImportdataTaskList[i].director) {
                        this.inspImportdataTaskList[i].director = '--';
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
                this.$router.push({ path: '/basic/infoTaskInfo' })
                sessionStorage.removeItem('infoRecordId')
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
