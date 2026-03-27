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
            <el-form-item label="外链规则ID" prop="ruleId">
                <el-input
                    v-model="queryParams.ruleId"
                    placeholder="请输入外链规则ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="规则链接" prop="ruleHash">
                <el-input
                    v-model="queryParams.ruleHash"
                    placeholder="请输入规则链接"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="规则名称" prop="ruleName">
                <el-input
                    v-model="queryParams.ruleName"
                    placeholder="请输入规则名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="操作类型" prop="operate">
                <el-select v-model="queryParams.operate" clearable placeholder="请选择任务类型" style="width:310px">
                    <el-option
                        v-for="item in operateList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="操作人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入操作人"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
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
        >
            <el-table-column type="index" label="序号" min-width="80" align="center" fixed></el-table-column>
            <el-table-column prop="ruleId" label="外链规则ID" min-width="160" fixed></el-table-column>
            <el-table-column prop="rule" label="规则链接" min-width="100" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.url)" v-if="scope.row.urlType == 2">{{ scope.row.url}}</span>
                    <span v-if="scope.row.urlType == 1">{{ scope.row.url}}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="" prop="" min-width="60">
                <template slot-scope="scope">
                    <el-tooltip  class="item" effect="dark" content="点此复制链接" placement="top">
                        <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                    </el-tooltip> 
                </template>
            </el-table-column> 
            <el-table-column prop="ruleName" label="规则名称" min-width="160" show-overflow-tooltip></el-table-column> 
            <el-table-column prop="operate" label="操作类型" align="center" min-width="100" ></el-table-column> 
            <el-table-column prop="createBy" label="操作人" align="center" min-width="100" ></el-table-column>
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
    externalLinksLog
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
                pgNum: 1,
                pgSize: 10,
                ruleId: null, // id 
                ruleHash:null, // 规则连接
                ruleName: null, // 规则名称
                operate: null, // 操作类型 
                createBy:null, // 操作人  
                // selectAll: null,
                // name: null,
                // batchUpdateSource: null,
            },
            // 操作类型
            operateList: [
                { label: '新增', val: '新增' },
                { label: '编辑', val: '编辑' }
            ]
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
            this.$modal.loading("正在查询，请稍候..."); 
            externalLinksLog(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
            }).finally(()=>{
            this.$modal.closeLoading();
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
        // 复制
        copyChange(val){
            console.log(val,'val')
            if(val.rule){
                this.textToCopy = val.rule;
                const textArea = document.createElement('textarea');
                textArea.value = this.textToCopy;
                textArea.style.position = 'fixed'; // 防止页面滚动时出现
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        this.$modal.msgSuccess("已复制链接");
                    } else {
                        this.$modal.msgError("复制失败");
                    }
                } catch (err) {
                    console.error('无法复制文本: ', err);
                }
                document.body.removeChild(textArea);
            }
        },

        typeChange(){
            if(this.queryParams.type == 1){
                this.operateList = [
                    { label: '信任', val: 1 },
                    { label: '可疑', val: 2 }
                ]
            }else{
                this.operateList = [
                    { label: '白名单', val: 1 },
                    { label: '黑名单', val: 2 }
                ]
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
