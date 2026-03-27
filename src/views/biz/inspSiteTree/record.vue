<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
        >
            <el-form-item label="记录状态" prop="status">
                <el-select v-model="queryParams.status" filterable clearable placeholder="请选择记录状态" @clear='queryParams.status = null'>
                    <el-option
                        v-for="item in statusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作类型" prop="actionType">
                <el-select v-model="queryParams.actionType" filterable clearable placeholder="请选择操作类型" @clear='queryParams.actionType = null'>
                    <el-option
                        v-for="item in actionTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
            <el-form-item>
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
            <el-table-column label="操作类型"  prop="actionTypeTxt" min-width="120" align="center" />
            <el-table-column label="记录状态"  prop="statusTxt" min-width="120" align="center">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" :class="scope.row.statusTxt == '失败' ? 'tableClass' : ''">{{ scope.row.statusTxt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述"  prop="desc" min-width="260" />
            <el-table-column label="父级标识码"  prop="parentSite" min-width="120" />
            <el-table-column label="原父级标识码"  prop="fromSite" min-width="120" />
            <el-table-column label="填报单位标识码"  prop="siteCode" min-width="120" />
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
import {
    listInspImportdataTask,
    getInspImportdataTask,
    delInspImportdataTask,
    addInspImportdataTask,
    updateInspImportdataTask
} from "@/api/biz/inspImportdataTask";

import {
    siteTreeImportRecord
} from "@/api/biz/inspSiteTree";

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
                parentSite: null,
                siteCode: null,
                actionType: null,
                
            },
            // 记录状态
            statusList: [
                { label: '正常', value: 0 },
                { label: '失败', value: 1 },
                { label: '异常', value: 2 }
            ],
            // 操作类型
            actionTypeList: [
                { label: '新增', value: 0 },
                { label: '迁移', value: 1 },
                { label: '删除', value: 2 }
            ],
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('recordId')
        next();

    },
    created() {
        if(sessionStorage.getItem('recordId')){
            this.queryParams.taskId = sessionStorage.getItem('recordId')
        }
        this.getList();
    },
    methods: {
        
        /** 查询审核数据回导任务列表 */
        getList() {
            this.loading = true;
            siteTreeImportRecord(this.queryParams).then(response => {
                this.inspImportdataTaskList = response.rows;
                for(var i in this.inspImportdataTaskList){
                    this.inspImportdataTaskList[i].index = parseInt(i)+1;
                    // 记录状态
                    for(var j in this.statusList){
                        if(this.inspImportdataTaskList[i].status == this.statusList[j].value){
                            this.inspImportdataTaskList[i].statusTxt = this.statusList[j].label;
                        }
                    }
                    // 操作类型
                    for(var j in this.actionTypeList){
                        if(this.inspImportdataTaskList[i].actionType == this.actionTypeList[j].value){
                            this.inspImportdataTaskList[i].actionTypeTxt = this.actionTypeList[j].label;
                        }
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
                this.$router.push({ path: '/basic/taskInfo' })
                sessionStorage.removeItem('recordId')
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
    .tableClass{
        color: red;
    }
</style>
