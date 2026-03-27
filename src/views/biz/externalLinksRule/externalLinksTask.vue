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
            <el-form-item label="依据ID" prop="sourceId">
                <el-input
                    v-model="queryParams.sourceId"
                    placeholder="请输入依据ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="链接" prop="url">
                <el-input
                    v-model="queryParams.url"
                    placeholder="请输入链接"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="链接类型" prop="urlType">
                <el-select v-model="queryParams.urlType" clearable placeholder="请选择链接类型" style="width:310px">
                    <el-option
                        v-for="item in urlTypeList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务名称" prop="elTaskName">
                <el-input
                    v-model="queryParams.elTaskName"
                    placeholder="请输入任务名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="任务类型" prop="trustFlag">
                <el-select v-model="queryParams.trustFlag" clearable placeholder="请选择任务类型" style="width:310px">
                    <el-option
                        v-for="item in trustFlagList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="外链类型" prop="errorTypes">
                <el-select v-model="queryParams.errorTypes" clearable placeholder="请选择外链类型" style="width:310px">
                    <el-option
                        v-for="item in errorTypesList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务状态" prop="status">
                <el-select v-model="queryParams.status" clearable placeholder="请选择任务状态" style="width:310px">
                    <el-option
                        v-for="item in statusList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务来源" prop="type">
                <el-select v-model="queryParams.type" clearable placeholder="请选择任务来源" style="width:310px" @change="typeChange">
                    <el-option
                        v-for="item in typeList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建开始时间" prop="startDate">
                <el-date-picker
                    v-model="queryParams.startDate"
                    type="date"
                    placeholder="选择日期"
                    @clear="queryParams.startDate=null"
                    style="width:310px"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="创建结束时间" prop="endDate">
                <el-date-picker
                    v-model="queryParams.endDate"
                    type="date"
                    placeholder="选择日期"
                    @clear="queryParams.endDate=null"
                    style="width:310px"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="处理数据量" prop="selectAll">
                <el-select v-model="queryParams.selectAll" clearable placeholder="请选择处理数据量" style="width:310px">
                    <el-option
                        v-for="item in selectAllList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="批量修改来源" prop="batchUpdateSource">
                <el-select v-model="queryParams.batchUpdateSource" clearable placeholder="请选择批量修改来源" style="width:310px">
                    <el-option
                        v-for="item in batchUpdateSourceList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
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
            <el-table-column prop="index" label="序号" width="80" align="center" fixed></el-table-column>
            <el-table-column prop="sourceId" label="依据ID" width="220" fixed></el-table-column>
            <el-table-column prop="url" label="链接" width="200" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.url)" v-if="scope.row.urlType == 2">{{ scope.row.url}}</span>
                    <span v-if="scope.row.urlType == 1">{{ scope.row.url}}</span>
                </template> -->
            </el-table-column>
            <el-table-column label="" prop="" width="60">
                <template slot-scope="scope">
                    <el-tooltip  class="item" effect="dark" content="点此复制链接" placement="top">
                        <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                    </el-tooltip> 
                </template>
            </el-table-column>
            <el-table-column prop="urlTypeTxt" label="链接类型" align="center" width="100"></el-table-column>
            <el-table-column prop="elTaskName" label="任务名称" width="260" show-overflow-tooltip></el-table-column>
            <el-table-column prop="trustFlagTxt" label="任务类型" align="center" width="100"></el-table-column>
            <el-table-column prop="errorTypesTxt" label="外链类型" align="center" width="100" ></el-table-column>
            <el-table-column prop="showStateTxt" label="显示状态" align="center" width="100" ></el-table-column>
            <el-table-column prop="againWarnTxt" label="再次预警" align="center" width="100" ></el-table-column>
            <el-table-column prop="statusTxt" label="任务状态" align="center" width="100" ></el-table-column>
            <el-table-column prop="typeTxt" label="任务来源"align="center" width="100" ></el-table-column>
            <el-table-column prop="batchUpdateSourceTxt" label="批量修改任务来源"align="center" width="160" ></el-table-column>
            <el-table-column prop="dataCount" label="网站回导数据量" width="140" align="center"></el-table-column>
            <el-table-column prop="mediaDataCount" label="新媒体回导数据量" width="140" align="center"></el-table-column>
            <el-table-column prop="runDuration" label="执行时长（ms）" width="120" align="center"></el-table-column>
            <el-table-column prop="startTime" label="回导开始时间" width="160" ></el-table-column>
            <el-table-column prop="endTime" label="回导结束时间" width="160" ></el-table-column>
            <el-table-column prop="createBy" label="创建人" width="120" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160" ></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="160" ></el-table-column>
            <!-- <el-table-column prop="siteCodesStr" label="应用站点" width="300" show-overflow-tooltip></el-table-column>
            <el-table-column prop="excludeSiteCodesStr" label="排除站点" width="300" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="siteCodesStr" label="应用站点" width="300">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.siteNamesStr" placement="top" v-if="scope.row.tooltip">
                       <span>{{scope.row.siteCodesStr}}</span>
                       <!-- <el-tag
                            v-for="item in scope.row.siteCodes"
                            :key="item">
                            {{item}}
                        </el-tag> -->
                    </el-tooltip>
                    <span v-if="!scope.row.tooltip">{{scope.row.siteCodesStr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="excludeSiteCodesStr" label="排除站点" width="300">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.excludeSiteNamesStr" placement="top" v-if="scope.row.tooltipPc">
                       <span>{{scope.row.excludeSiteCodesStr}}</span>
                    </el-tooltip>
                    <span v-if="!scope.row.tooltipPc">{{scope.row.excludeSiteCodesStr}}</span>
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
    externalLinksTask
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
                sourceId: null, // id
                url: null, // 链接
                urlType: null, // 链接类型
                elTaskName: null, // 任务名称
                trustFlag: null, // 任务类型
                errorTypes: null, // 外链类型
                status: null, // 任务状态
                type: null, // 任务来源
                startDate: null, // 创建开始时间
                endDate: null, // 创建结束时间
                selectAll: null,
                name: null,
                batchUpdateSource: null,
            },
            // 链接类型
            urlTypeList: [
                { label: '域名', val: 1 },
                { label: '链接', val: 2 }
            ],
            // 任务类型
            trustFlagList: [
                { label: '白名单', val: 1 },
                { label: '黑名单', val: 2 }
            ],
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
            // 任务状态
            statusList: [
                { label: '待开始', val: 0 },
                { label: '进行中', val: 1 },
                { label: '已完成', val: 2 },
                { label: '异常', val: 3 },
                { label: '作废', val: 4 },
                { label: '已分发', val: 9 },
            ],
            // 任务来源
            typeList: [
                { label: '批量修改', val: 1 },
                { label: '外链规则', val: 2 },
            ],
            // 处理数据量
            selectAllList: [
                { label: '全部', val: true },
                { label: '大于0', val: false },
            ],
            batchUpdateSourceList: [
                { label: '网站批量', val: 1 },
                { label: '新媒体批量', val: 2 },
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
            externalLinksTask(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    // 链接类型
                    if(this.tableList[i].urlType == 1){ // 域名
                        this.tableList[i].urlTypeTxt = '域名';
                    }else if(this.tableList[i].urlType == 2){ // 链接
                        this.tableList[i].urlTypeTxt = '链接';                        
                    }
                    
                    // 外链类型
                    for(var j in this.errorTypesList){
                        if(this.tableList[i].errorTypes == this.errorTypesList[j].val){
                            this.tableList[i].errorTypesTxt = this.errorTypesList[j].label;
                        }
                    }
                    // 显示状态
                    if(this.tableList[i].showState == 2){ // 显示
                        this.tableList[i].showStateTxt = '显示';
                    }else if(this.tableList[i].showState == 3){ // 显示并预警
                        this.tableList[i].showStateTxt = '显示并预警';                        
                    }
                    // 再次预警
                    if(this.tableList[i].againWarn == true){ // 是
                        this.tableList[i].againWarnTxt = '是';
                    }else if(this.tableList[i].againWarn == false){ // 否
                        this.tableList[i].againWarnTxt = '否';                        
                    }else{
                        this.tableList[i].againWarnTxt = '--';   
                    }
                    // 任务状态
                    if(this.tableList[i].status == 0){ // 待开始
                        this.tableList[i].statusTxt = '待开始';
                    }else if(this.tableList[i].status == 1){ // 进行中
                        this.tableList[i].statusTxt = '进行中';                        
                    }else if(this.tableList[i].status == 2){ // 已完成
                        this.tableList[i].statusTxt = '已完成';                        
                    }else if(this.tableList[i].status == 3){ // 异常
                        this.tableList[i].statusTxt = '异常';                        
                    }else if(this.tableList[i].status == 4){ // 异常
                        this.tableList[i].statusTxt = '作废';                        
                    }else if(this.tableList[i].status == 9){ // 已分发
                        this.tableList[i].statusTxt = '已分发';                        
                    }
                    // 任务来源
                    if(this.tableList[i].type == 1){ // 批量修改
                        this.tableList[i].typeTxt = '批量修改';
                        // 任务类型
                        if(this.tableList[i].trustFlag == 1){ // 白名单
                            this.tableList[i].trustFlagTxt = '信任';
                        }else if(this.tableList[i].trustFlag == 2){ // 黑名单
                            this.tableList[i].trustFlagTxt = '可疑';                        
                        }  
                    }else if(this.tableList[i].type == 2){ // 外链规则
                        this.tableList[i].typeTxt = '外链规则';    
                        // 任务类型
                        if(this.tableList[i].trustFlag == 1){ // 白名单
                            this.tableList[i].trustFlagTxt = '白名单';
                        }else if(this.tableList[i].trustFlag == 2){ // 黑名单
                            this.tableList[i].trustFlagTxt = '黑名单';                        
                        }                
                    }
                    // 批量修改任务-数据来源
                    if(this.tableList[i].batchUpdateSource == 1){
                        this.tableList[i].batchUpdateSourceTxt = '网站批量';
                    }else if(this.tableList[i].batchUpdateSource == 2){
                        this.tableList[i].batchUpdateSourceTxt = '新媒体批量';
                    }else{
                        this.tableList[i].batchUpdateSourceTxt = '--';
                    }
                    
                    // 执行时长
                    if(!this.tableList[i].runDuration){
                        this.tableList[i].runDuration = '--';
                    }
                    // 回导量
                    if(this.tableList[i].dataCount == null){
                        this.tableList[i].dataCount = '--';
                    }
                    // 回导开始时间
                    if(!this.tableList[i].startTime){
                        this.tableList[i].startTime = '--';
                    }
                    // 回导结束时间
                    if(!this.tableList[i].endTime){
                        this.tableList[i].endTime = '--';
                    }
                    // 应用站点
                    if(!this.tableList[i].siteCodes){
                        this.tableList[i].siteCodesStr = '全局';
                        this.tableList[i].tooltip = false;
                    }else{
                        this.tableList[i].siteCodesStr = this.tableList[i].siteCodes.join(' , ');
                        this.tableList[i].siteNamesStr = this.tableList[i].siteNames.join(' , ');
                        this.tableList[i].tooltip = true;
                    }
                    // 排除站点
                    if(!this.tableList[i].excludeSiteCodes){
                        this.tableList[i].excludeSiteCodesStr = '无';
                        this.tableList[i].tooltipPc = false;
                    }else{
                        this.tableList[i].excludeSiteCodesStr = this.tableList[i].excludeSiteCodes.join(' , ');
                        this.tableList[i].excludeSiteNamesStr = this.tableList[i].excludeSiteNames.join(' , ');
                        this.tableList[i].tooltipPc = true;
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.queryParams.startDate){
                this.queryParams.startDate = this.formatDate(this.queryParams.startDate) + ' 00:00:00';
            }
            if(this.queryParams.endDate){
                this.queryParams.endDate = this.formatDate(this.queryParams.endDate) + ' 23:59:59';
            }
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
        // 复制
        copyChange(val){
            console.log(val,'val')
            if(val.url){
                this.textToCopy = val.url;
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
                this.trustFlagList = [
                    { label: '信任', val: 1 },
                    { label: '可疑', val: 2 }
                ]
            }else{
                this.trustFlagList = [
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
