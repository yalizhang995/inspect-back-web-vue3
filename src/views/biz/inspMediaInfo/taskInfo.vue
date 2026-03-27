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
            <!-- <el-form-item label="任务类型" prop="taskType">
                <el-select v-model="queryParams.taskType" filterable clearable placeholder="请选择任务类型" @clear='queryParams.taskType = null'>
                    <el-option
                        v-for="item in taskTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务状态" prop="taskState">
                <el-select v-model="queryParams.taskState" filterable clearable placeholder="请选择任务状态" @clear='queryParams.taskType = null'>
                    <el-option
                        v-for="item in taskStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文件名" prop="fileName" >
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
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item> -->
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
            @row-click="handleRowClick"
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="ID" width="100" align="center" prop="id" />
            <el-table-column label="任务类型" align="" prop="taskTypeTxt" width="200" />
            <el-table-column label="文件名" align="" prop="fileName" width="200" show-overflow-tooltip />
            <el-table-column label="文件路径" align="" prop="filePath" show-overflow-tooltip />
            <el-table-column label="任务状态" align="center" prop="taskStateTxt" width="100">
                <template slot-scope="scope">
                    <span style="cursor: pointer;" :class="scope.row.taskStateTxt == '异常' ? 'tableClass' : ''">{{ scope.row.taskStateTxt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数据量" align="center" prop="dataCount" width="80" />
            <el-table-column label="执行时长(毫秒)" align="center" prop="runDuration" width="140" />
            <el-table-column label="创建人" align="" prop="createBy" show-overflow-tooltip width="100"/>
            <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="startTime" label="开始时间" width="170"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="170"></el-table-column>
            <!-- <el-table-column label="开始时间" align="" prop="startTime" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="" prop="endTime" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="执行结果" align="center" prop="runResult" /> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-download"
                        :disabled="!scope.row.obsFilePath"
                        @click="handleDown(scope.row)"
                    >文件下载</el-button>
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
import { getInspImportdataTaskList } from "@/api/biz/inspSiteInfo";

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
                taskTypeIn: [1203,1204],
                filePath: null,
                taskState: null,
                dataCount: null,
                startTime: null,
                endTime: null,
                runDuration: null,
                runResult: null,
                sort: null,
                createUserId: null,
                createBy: null,
                taskState: null,
                orderTypes: [
                    // { code: 1, name: "sort" },
                    // { code: 1, name: "update_time" },
                    { code: 1, name: "create_time" },
                ],
                id: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},

            // 任务类型
            taskTypeList: [
                // 网站
                { label: '网站错误内容-审核导入', value: 1 },
                { label: '网站错误内容-整改导入', value: 2 },

                { label: '网站敏感信息-审核导入', value: 4 },
                { label: '网站敏感信息-整改导入', value: 5 },

                { label: '网站隐私泄露-审核导入', value: 7 },
                { label: '网站隐私泄露-整改导入', value: 8 },

                { label: '网站错链-整改导入', value: 20 },

                { label: '网站外链-审核导入', value: 37 },
                { label: '网站外链-整改导入', value: 36 },
                { label: '网站外链-白名单-信任导入', value: 30 },

                { label: '外链规则-黑白名单-导入', value: 40 },

                { label: '网站字词配置-批量导入', value: 200 },
                { label: '词库导入', value: 201 },

                { label: '栏目信息-栏目导入', value: 1000 },
                { label: '站点信息-联系人导入', value: 1100 },
                
                { label: '站点信息-新增导入', value: 1200 },
                { label: '站点信息-修改导入', value: 1201 },
                { label: '站点关系-导入', value: 1202 },


                // 新媒体
                { label: '新媒体错误内容-审核导入', value: 100 },
                { label: '新媒体错误内容-整改导入', value: 101 },

                { label: '新媒体敏感信息-审核导入', value: 104 },
                { label: '新媒体敏感信息-整改导入', value: 105 },

                { label: '新媒体隐私泄露-审核导入', value: 107 },
                { label: '新媒体隐私泄露-整改导入', value: 108 },

                { label: '新媒体外链-审核导入', value: 150 },                
                { label: '新媒体外链-整改导入', value: 156 },
                { label: '新媒体外链-白名单-信任导入', value: 157 },

                { label: '新媒体站点信息-新增导入', value: 1203 },
                { label: '新媒体站点信息-修改导入', value: 1204 },
                { label: '新媒体站点关系-导入', value: 1205 },
            ],
            // 任务状态
            taskStateList: [
                { label: '未导入', value: 0 },
                { label: '导入中', value: 1 },
                { label: '导入完成', value: 2 },
                { label: '异常', value: 3 },
            ],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        
        /** 查询审核数据回导任务列表 */
        getList() {
            this.loading = true;
            getInspImportdataTaskList(this.queryParams).then(response => {
                this.inspImportdataTaskList = response.rows;
                for(var i in this.inspImportdataTaskList){
                    this.inspImportdataTaskList[i].index = parseInt(i)+1;
                    // 任务类型
                    for(var j in this.taskTypeList){
                        if(this.inspImportdataTaskList[i].taskType == this.taskTypeList[j].value){
                            this.inspImportdataTaskList[i].taskTypeTxt = this.taskTypeList[j].label;
                        }
                    }
                    // 任务状态
                    for(var j in this.taskStateList){
                        if(this.inspImportdataTaskList[i].taskState == this.taskStateList[j].value){
                            this.inspImportdataTaskList[i].taskStateTxt = this.taskStateList[j].label;
                        }
                    }
                }
                this.total = response.total;
                this.loading = false;
            });
        },
        // 文件下载
        handleDown(row){
            window.open(row.obsFilePath)
        },
        // 跳转记录详情
        handleRowClick(row, column, event) {
            sessionStorage.setItem('mediaInfoRecordId',row.id)
            this.$router.push({ path: '/media/infoRecord' })
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
                this.$router.push({ path: '/media/inspMediaInfo' })

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
