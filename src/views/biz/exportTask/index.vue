<template>
    <div class="app-container errorsPage" >
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="80px"
        >              
            <!-- <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item> -->
            <el-form-item label="下载状态" prop="downloadState">
                <el-select v-model="queryParams.downloadState" clearable placeholder="请选择下载状态">
                    <el-option
                        v-for="item in downloadStateList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生成状态" prop="state">
                <el-select v-model="queryParams.state" clearable placeholder="请选择生成状态">
                    <el-option
                        v-for="item in stateList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数据来源" prop="appName">
                <el-select v-model="queryParams.appName" clearable placeholder="请选择数据来源">
                    <el-option
                        v-for="item in appNameList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
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
            <el-form-item label="文件名" prop="fileName">
                <el-input
                    v-model="queryParams.fileName"
                    placeholder="请输入文件名"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear='queryParams.fileName = null'
                    style="width:455px"
                />
            </el-form-item>

            <el-form-item style="marginLeft:20px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                >批量删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteInfoList"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
            <el-table-column prop="menuTypeTxt" label="来源" min-width="260" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fileName" label="文件名" min-width="300" show-overflow-tooltip></el-table-column>
            <el-table-column prop="stateTxt" align="center" label="生成状态" width="100"></el-table-column>
            <el-table-column prop="runDuration" align="center" label="生成时长(ms)" width="120"></el-table-column>
            <el-table-column prop="dataCount" align="center" label="数据量" width="100"></el-table-column>
            <el-table-column prop="downloadStateTxt" align="center" label="下载状态" width="100"></el-table-column>
            <el-table-column prop="createBy" label="创建人" width="120"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="startTime" label="生成开始时间" width="170"></el-table-column>
            <el-table-column prop="endTime" label="生成结束时间" width="170"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="下载" placement="top">
                        <i class="el-icon-download" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="downChange(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="置顶" placement="top">
                        <i class="el-icon-upload2" style="marginLeft:10px;cursor: pointer;font-size:15px" v-hasPermi="['biz:exportTask:sort']" @click="sortTopChange(scope.row.id)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" v-hasPermi="['biz:exportTask:remove']" @click="handleDelete(scope.row)"></i>
                    </el-tooltip>
                    
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
    list,
    removeTask,
    editTask
} from "@/api/biz/export";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
    },
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
            // 站点信息表格数据
            inspSiteInfoList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,

            activeName: '1',
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                downloadState: 0,
                batchType: 2,
                state: null,
                appName: null,
                orderTypes: [
                    // { code: 1, name: "sort" },
                    // { code: 1, name: "update_time" },
                    { code: 1, name: "create_time" },
                ],
                createBy: null,
                id: null,
                fileName: null, // 文件名
            },

            /**下拉菜单数据 */
            // 下载状态
            downloadStateList: [ 
                { label: '未下载', val: 0 },
                { label: '已下载', val: 1 },
            ],
            // 生成状态
            stateList: [
                { label: '未生成', val: 0 },
                { label: '生成中', val: 1 },
                { label: '已生成', val: 2 },
                { label: '异常', val: 3 },
            ],
            // 数据来源
            appNameList: [
                { label: '监管系统', val: 'inspect-view' },
                { label: '业务后台', val: 'inspect-back' },
            ],
            menuTypeList: [
                // 网站
                { label: '网站-错误内容-日常', val: 0 },
                { label: '网站-错误内容-定期', val: 1 },

                { label: '网站-敏感信息-日常', val: 10 },
                { label: '网站-敏感信息-定期', val: 11 },

                { label: '网站-隐私泄露-日常', val: 20 },
                { label: '网站-隐私泄露-定期', val: 21 },

                { label: '网站-图片监测-日常', val: 30 },
                { label: '网站-图片监测-定期', val: 31 },

                { label: '网站-视频监测-日常', val: 40 },
                { label: '网站-视频监测-定期', val: 41 },

                { label: '网站-音频监测-日常', val: 50 },
                { label: '网站-音频监测-定期', val: 51 },

                { label: '网站-附件监测-日常', val: 60 },
                { label: '网站-附件监测-定期', val: 61 },

                { label: '网站-首页更新-日常', val: 70 },

                { label: '网站-栏目更新-日常', val: 80 },

                { label: '网站-首页稿件-详情', val: 90 },
                { label: '网站-首页稿件', val: 102 },

                { label: '网站-栏目稿件-详情', val: 100 },
                { label: '网站-栏目稿件', val: 101 },

                { label: '网站-首页连通', val: 110 },
                { label: '网站-首页连通-汇总', val: 111 },

                { label: '网站-栏目连通', val: 113 },
                { label: '网站-栏目连通-汇总', val: 112 },

                { label: '网站-错链信息-日常', val: 120 },
                { label: '网站-错链信息-定期', val: 121 },

                { label: '网站-外链信息-日常', val: 130 },
                { label: '网站-外链信息-定期', val: 131 },

                { label: '网站-规范检查', val: 140 },

                // 新媒体
                { label: '新媒体-账号更新', val: 150 },

                { label: '新媒体-断更统计', val: 182 },

                { label: '新媒体-错误内容-日常', val: 160 },
                { label: '新媒体-错误内容-定期', val: 161 },

                { label: '新媒体-敏感信息-日常', val: 170 },
                { label: '新媒体-敏感信息-定期', val: 171 },

                { label: '新媒体-隐私泄露-日常', val: 180 },
                { label: '新媒体-隐私泄露-定期', val: 181 },

                { label: '新媒体-断更统计', val: 182 },

                { label: '新媒体-外链信息', val: 230 },

                { label: '新媒体-图片监测-日常', val: 190 },
                { label: '新媒体-图片监测-定期', val: 191 },

                { label: '新媒体-视频监测-日常', val: 200 },
                { label: '新媒体-视频监测-定期', val: 201 },

                { label: '新媒体-音频监测-日常', val: 210 },
                { label: '新媒体-音频监测-定期', val: 211 },

                { label: '新媒体-附件监测-日常', val: 220 },
                { label: '新媒体-附件监测-定期', val: 221 },

                { label: '新媒体-运营榜单', val: 600 },
                { label: '新媒体-运营榜单-微信', val: 610 },
                { label: '新媒体-运营榜单-微博', val: 620 },
                { label: '新媒体-运营榜单-抖音', val: 630 },
                { label: '新媒体-运营榜单-头条', val: 640 },
                { label: '新媒体-运营榜单-快手', val: 650 },

                { label: '全局检索', val: 700 },

                

                // 网站安全
                // 后台
                { label: '网站安全-HTTP监测', val: 290 },
                { label: '网站安全-DNS监测', val: 300 },
                { label: '网站安全-错链信息', val: 310 },
                { label: '网站安全-暗链外链', val: 320 },
                { label: '网站安全-挖矿', val: 330 },
                { label: '网站安全-网页木马', val: 340 },
                { label: '网站安全-弱密码', val: 350 },
                { label: '网站安全-网页篡改', val: 360 },
                { label: '网站安全-网站漏洞', val: 370 },
                { label: '网站安全-PING监测', val: 380 },
                { label: '网站安全-端口变动', val: 390 },
                { label: '网站安全-子域名变动', val: 400 },
                { label: '网站安全-SSL证书信息', val: 410 },
                // 前台
                { label: '网站安全-HTTP监测', val: 420 },
                { label: '网站安全-DNS监测', val: 430 },
                { label: '网站安全-错链信息', val: 440 },
                { label: '网站安全-暗链外链', val: 450 },
                { label: '网站安全-挖矿', val: 460 },
                { label: '网站安全-网页木马', val: 470 },
                { label: '网站安全-弱密码', val: 480 },
                { label: '网站安全-网页篡改', val: 490 },
                { label: '网站安全-网站漏洞', val: 500 },
                { label: '网站安全-PING监测', val: 510 },
                { label: '网站安全-端口变动', val: 520 },
                { label: '网站安全-子域名变动', val: 530 },
                { label: '网站安全-SSL证书信息', val: 540 },
            ],

            wtlxList: [
                // 网站 1-140
                { label: '错误内容-日常', val: 1 },
                { label: '错误内容-定期', val: 10 },

                { label: '敏感信息-日常', val: 2 },
                { label: '敏感信息-定期', val: 20 },

                { label: '隐私泄露-日常', val: 3 },
                { label: '隐私泄露-定期', val: 30 },

                { label: '首页更新', val: 4 },

                { label: '栏目更新', val: 5 },

                { label: '首页连通性', val: 6 },

                { label: '错链信息-日常', val: 7 },
                { label: '错链信息-定期', val: 70 },

                { label: '外链信息-日常', val: 8 },
                { label: '外链信息-定期', val: 80 },

                { label: '规范检查', val: 9 },

                { label: '图片监测-日常', val: 11 },
                { label: '图片监测-定期', val: 110 },

                { label: '视频监测-日常', val: 12 },
                { label: '视频监测-定期', val: 120 },

                { label: '音频监测-日常', val: 13 },
                { label: '音频监测-定期', val: 130 },
                
                { label: '附件监测-日常', val: 14 },
                { label: '附件监测-定期', val: 140 },

                // 新媒体 200-300
                { label: '账号更新', val: 200 },

                { label: '错误内容-日常', val: 210 },
                { label: '错误内容-定期', val: 211 },
                
                { label: '敏感信息-日常', val: 220 },
                { label: '敏感信息-定期', val: 221 },
                
                { label: '隐私泄露-日常', val: 230 },
                { label: '隐私泄露-定期', val: 231 },

                { label: '图片监测-日常', val: 240 },
                { label: '图片监测-定期', val: 241 },

                { label: '视频监测-日常', val: 250 },
                { label: '视频监测-定期', val: 251 },

                { label: '音频监测-日常', val: 260 },
                { label: '音频监测-定期', val: 261 },

                { label: '附件监测-日常', val: 270 },
                { label: '附件监测-定期', val: 271 },

                { label: '外链信息', val: 280 },

                // { label: '文章稿件', val: 290 },

                // { label: '账号信息', val: 300 },

                // 网站安全

                { label: '其他', val: 10000 },
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
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            list(this.queryParams).then((res)=>{
                this.inspSiteInfoList = res.rows;
                this.total = res.total;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 来源
                    for(var j in this.menuTypeList){
                        if(this.inspSiteInfoList[i].menuType == this.menuTypeList[j].val){
                            if(this.inspSiteInfoList[i].appName == 'inspect-view'){
                                this.inspSiteInfoList[i].menuTypeTxt = '监管系统：'+this.menuTypeList[j].label;
                            }else if(this.inspSiteInfoList[i].appName == 'inspect-back'){
                                this.inspSiteInfoList[i].menuTypeTxt = '业务后台：'+this.menuTypeList[j].label;                                
                            }
                        }
                    }
                    // 下载状态
                    if(this.inspSiteInfoList[i].downloadState == 0){
                        this.inspSiteInfoList[i].downloadStateTxt = '未下载';
                    }else if(this.inspSiteInfoList[i].downloadState == 1){
                        this.inspSiteInfoList[i].downloadStateTxt = '已下载';                        
                    }

                    // 生成状态
                    if(this.inspSiteInfoList[i].state == 0){
                        this.inspSiteInfoList[i].stateTxt = '未生成';
                    }else if(this.inspSiteInfoList[i].state == 1){
                        this.inspSiteInfoList[i].stateTxt = '生成中';                        
                    }else if(this.inspSiteInfoList[i].state == 2){
                        this.inspSiteInfoList[i].stateTxt = '已生成';                        
                    }else if(this.inspSiteInfoList[i].state == 3){
                        this.inspSiteInfoList[i].stateTxt = '异常';                        
                    }

                    if(!this.inspSiteInfoList[i].dataCount && this.inspSiteInfoList[i].dataCount != 0){
                        this.inspSiteInfoList[i].dataCount = '--';
                    }
                    if(!this.inspSiteInfoList[i].startTime){
                        this.inspSiteInfoList[i].startTime = '--';
                    }
                    if(!this.inspSiteInfoList[i].endTime){
                        this.inspSiteInfoList[i].endTime = '--';
                    }
                    if(!this.inspSiteInfoList[i].runDuration){
                        this.inspSiteInfoList[i].runDuration = '--';
                    }

                    // 文件名
                    if(!this.inspSiteInfoList[i].fileName || this.inspSiteInfoList[i].fileName == null || this.inspSiteInfoList[i].fileName == ''){
                        this.inspSiteInfoList[i].fileName = '--';
                    }
                }
                    
                this.loading = false;
            })
        },
        /** 删除按钮操作 */
        handleDelete(row,delIndex) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除该条数据？')
                    .then(function() {
                        return removeTask({ids:[ids]});
                    })
                    .then(() => {
                        this.$modal.msgSuccess("删除成功");
                        this.getList();
                    })
                    .catch(() => {});
            }else{
                const ids = this.ids
                this.$modal
                    .confirm('是否确认删除已选中的数据项？')
                    .then(function() {
                        return removeTask({ids:ids});
                    })
                    .then(() => {
                        this.$modal.msgSuccess("删除成功");
                        this.getList();
                    })
                    .catch(() => {});
            }
            
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
        // 置顶
        sortTopChange(val){
            // sort
            let subDate = {
                id: val,
                sort: 1,
            }
            editTask(subDate).then((res)=>{
                this.$modal.msgSuccess("置顶成功");
                this.getList(); // 列表数据
            })
        },
        // 下载
        downChange(item){
            if(item.filePath){
                let subDate = {
                    id: item.id,
                    downloadState: 1,
                }
                editTask(subDate).then((res)=>{
                    
                })
                window.open(item.filePath);
            }
        },
        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            let newName = '';
            if(prop == 'createTime'){ // 未更新天数
                newName = 'create_time';
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
    .box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    .marginClass{
        margin-left: 1%;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .sxw{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .wtjb{
        display: block;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .yd{
        display: inline-block;
        width: 7px;
        height: 7px;
        background: red;
        border-radius: 100%;
        margin-right: 10px;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 30vh !important;
    }
</style>