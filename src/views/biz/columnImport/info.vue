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
                    @clear="queryParams.siteCode=null"
                />
            </el-form-item>
            <el-form-item label="采集状态" prop="queueStatus">
                <el-select v-model="queryParams.queueStatus" clearable placeholder="请选择采集状态"  @clear="queryParams.queueStatus=null">
                    <el-option
                        v-for="item in queueStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="错误页" prop="wrongUrl">
                <el-input
                    v-model="queryParams.wrongUrl"
                    placeholder="请输入网站地址"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:400px"
                    @clear="queryParams.wrongUrl=null"
                />
            </el-form-item>
            <el-form-item label="引用页" prop="quoteUrl">
                <el-input
                    v-model="queryParams.quoteUrl"
                    placeholder="请输入网站地址"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:400px"
                    @clear="queryParams.quoteUrl=null"
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
            fit
        >
            <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="region" label="所属地区" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="institute" label="所属单位" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wrongWord" label="错敏字" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="suggest" label="建议修改" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wordType" label="错误类型" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sentence" label="所在片段" min-width="300">
                <template slot-scope="scope">
                    <div>
                        <span v-if="scope.row.sentence">
                            <span>{{scope.row.wordLeft}}</span>
                            <span style="color:red;borderBottom:1px solid red">{{scope.row.wrongWord}}</span>
                            <span>{{scope.row.wordRight}}</span>
                        </span>
                        <span v-if="!scope.row.sentence">--</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="wrongUrl" label="错误页" align="" min-width="260" show-overflow-tooltip>
                <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.wrongUrl)">{{ scope.row.wrongUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="quoteUrl" label="引用页" align="" min-width="260" show-overflow-tooltip>
                <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.quoteUrl)">{{ scope.row.quoteUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="queueStatusTxt" label="采集状态" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="wordFileName" label="文件名" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="releaseTime" label="发布时间" align="" min-width="120" ></el-table-column>
            <el-table-column prop="scanTime" label="监测时间" align="" min-width="120" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="" min-width="160" ></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="handleUpdate(scope.row)" >采集</el-button>
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
    infoList,
    again
} from "@/api/biz/columnImport";
export default {
    name: "Info",
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
                queueStatus: null,
                wrongUrl: null,
                quoteUrl: null,
            },
            DateArr: [],

            // 错误类型
            wordTypeList: [
                { label: '错别字', val: 1 },
                { label: '敏感词', val: 2 },
                { label: '隐私泄露', val: 3 },                
            ],

            // 采集状态
            queueStatusList: [
                { label: 'HTML为空', value: -6 },
                { label: '正文为空', value: -5 },
                { label: 'URL域内跳转', value: -4 },
                { label: '域名跳转', value: -3 },
                { label: '采集失败', value: -2 },
                { label: '待入队', value: 0 },
                { label: '待采集', value: 1 },
                { label: '采集完成', value: 2 },
                { label: '纠错入队', value: 3 },
                { label: '完成', value: 4 },            
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
            infoList(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    // 错误类型
                    if(this.tableList[i].wordType == 1){
                        this.tableList[i].wordTypeTxt = '错别字';
                    }else if(this.tableList[i].wordType == 2){
                        this.tableList[i].wordTypeTxt = '敏感词';
                    }else if(this.tableList[i].wordType == 3){
                        this.tableList[i].wordTypeTxt = '隐私泄露';
                    }
                    // 采集异常状态
                    if(this.tableList[i].queueStatus == -6){
                        this.tableList[i].queueStatusTxt = 'HTML为空';
                    }else if(this.tableList[i].queueStatus == -5){
                        this.tableList[i].queueStatusTxt = '正文为空';
                    }else if(this.tableList[i].queueStatus == -4){
                        this.tableList[i].queueStatusTxt = 'URL域内跳转';
                    }else if(this.tableList[i].queueStatus == -3){
                        this.tableList[i].queueStatusTxt = '域名跳转';
                    }else if(this.tableList[i].queueStatus == -2){
                        this.tableList[i].queueStatusTxt = '采集失败';
                    }else if(this.tableList[i].queueStatus == 0){
                        this.tableList[i].queueStatusTxt = '待入队';
                    }else if(this.tableList[i].queueStatus == 1){
                        this.tableList[i].queueStatusTxt = '待采集';
                    }else if(this.tableList[i].queueStatus == 2){
                        this.tableList[i].queueStatusTxt = '采集完成';
                    }else if(this.tableList[i].queueStatus == 3){
                        this.tableList[i].queueStatusTxt = '纠错入队';
                    }else if(this.tableList[i].queueStatus == 4){
                        this.tableList[i].queueStatusTxt = '完成';
                    }
                    // 所在片段
                    if(this.tableList[i].wrongWord && this.tableList[i].sentence){
                        response.rows[i].wordLeft = response.rows[i].sentence.split(response.rows[i].wrongWord)[0];
                        response.rows[i].wordRight = response.rows[i].sentence.split(response.rows[i].wrongWord)[1];
                    }
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
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },

        // 重采
        handleUpdate(row){
            again({ ids: [row.id] }).then((res)=>{
                if(res.code == 200){
                    this.$modal.msgSuccess("操作成功");
                    this.getList();
                }
            })
        }


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
