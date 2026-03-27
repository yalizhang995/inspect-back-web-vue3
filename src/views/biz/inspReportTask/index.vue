<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
            style="marginLeft:-15px"
        >
            <el-form-item label="报告名称" prop="reportName" >
                <el-input
                    v-model="queryParams.reportName"
                    placeholder="请输入报告名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="queryParams.orderType" clearable placeholder="请选择订单类型" style="width:300px">
                    <el-option
                        v-for="item in orderTypeDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采集状态" prop="status">
                <el-select v-model="queryParams.status" clearable placeholder="请选择采集状态" style="width:300px">
                    <el-option
                        v-for="item in statusDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="全站开始时间" prop="statusTime">
                <el-date-picker v-model="queryParams.statusTime" type="date" placeholder="选择日期" style="width:300px"></el-date-picker>
            </el-form-item>
            <el-form-item label="全站结束时间" prop="statusEndTime">
                <el-date-picker v-model="queryParams.statusEndTime" type="date" placeholder="选择日期" style="width:300px"></el-date-picker>
            </el-form-item> -->
            
            <el-form-item label="采集开始时间" prop="">
                <el-date-picker v-model="startDateArr" @change="sjrqChange(1,startDateArr)" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:300px"></el-date-picker>
            </el-form-item>
            <el-form-item label="采集结束时间" prop="">
                <el-date-picker v-model="endDateArr" @change="sjrqChange(2,endDateArr)" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:300px"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="订单ID" prop="orderInfoId">
                <el-input
                    v-model="orderInfoId"
                    placeholder="请输入订单ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="订单" prop="orderInfoId">
                <el-select v-model="queryParams.orderInfoId" filterable remote placeholder="请选择订单"  @change="ddChange" :remote-method="remoteMethod" clearable style="width:300px">
                    <el-option
                    v-for="item in orderInfoList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="订单信息" prop="orderInfoId">
                <el-select v-model="queryParams.orderInfoId" filterable clearable placeholder="请输入订单名称/ID/网站标识码查询并选择" style="width:710px" @change="searchOrderInfoIdChange"  remote :remote-method="searchRemoteMethod" >
                    <el-option
                        v-for="item in searchOrderInfoDate"
                        :key="item.id"
                        :label="item.orderName+' - '+item.id+' / '+item.startDate+' - '+item.endDate+' / '+item.orderStateTxt"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="批次ID" prop="orderBatchId">
                <el-input
                    v-model="orderBatchId"
                    placeholder="请输入批次ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                />
            </el-form-item>
            <el-form-item label="订单批次" prop="orderBatchId">
                <el-select v-model="queryParams.orderBatchId" filterable remote placeholder="请选择订单批次" :remote-method="remoteMethod2" clearable style="width:300px">
                    <el-option
                    v-for="item in orderBatchList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="订单批次" prop="orderBatchId">
                <el-select v-model="queryParams.orderBatchId" filterable clearable placeholder="请输入订单批次/ID/网站标识码查询并选择" style="width:710px" @change="searchOrderBarchIdInfoIdChange"  remote :remote-method="searchRemoteMethod2" >
                    <el-option
                        v-for="item in orderBatchList"
                        :key="item.id"
                        :label="item.orderName+' - '+item.orderInfoId+' / '+item.batchName+' - '+item.id+' / '+item.startDate+' - '+item.endDate+' / '+item.batchStateTxt"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否加急" prop="vip">
                <el-select v-model=" queryParams.vip" clearable placeholder="请选择是否加急" >
                    <el-option
                        v-for="item in vipDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            
            
            <el-form-item style="marginLeft:18px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['biz:inspReportTask:add']"
                >新增</el-button>
            </el-col>
             <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspReportTask:remove']"
                >批量删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" size="mini" :disabled="multiple" @click="handleReport">报告生成</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspReportTaskList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" fixed />
            <el-table-column label="网站标识码" prop="siteCode" width="120" fixed />
            <el-table-column label="网站名称"  prop="siteName" show-overflow-tooltip width="200" fixed />
            <el-table-column label="订单ID - 名称"  prop="orderName" show-overflow-tooltip width="270">
                <template slot-scope="scope">
                    <span>{{scope.row.orderInfoId}} - </span>
                    <span>{{scope.row.orderName}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="订单批次"  prop="batchName" /> -->
            <el-table-column label="批次ID - 名称"  prop="batchName" show-overflow-tooltip width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.orderBatchId}} - </span>
                    <span>{{scope.row.batchName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单类型" align="" prop="orderTypeTxt" width="140" />
            
            <!-- <el-table-column label="结束时间" align="center" prop="endDate">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="提前截止时间" align="center" prop="cutOffDate">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.cutOffDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="采集状态" align="center" prop="statusTxt" width="80">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.statusColor}">{{scope.row.statusTxt}}</span>
                </template>
            </el-table-column>
            <el-table-column label="采集开始时间" align="" prop="statusTime" width="160" />
            <el-table-column label="采集结束时间" align="" prop="statusEndTime" width="160" />
            <el-table-column label="任务类型" align="center" prop="taskTypeTxt" width="80" />
            <el-table-column label="任务状态" align="center" prop="reportStateTxt" width="80" />
            <el-table-column label="是否加急" align="center" prop="vipTxt" width="100">
                <!-- <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.vipSwitch"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="vipSwitchChange(scope.row)"
                        >
                    </el-switch>
                </template> -->
            </el-table-column>
            <el-table-column label="开始时间" align="" prop="startDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="" prop="endDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.cutOffDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="生成状态" align="center" prop="createReportStateTxt" width="80">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.createReportStateColor}">{{scope.row.createReportStateTxt}}</span>
                </template>
            </el-table-column>
            
            <!-- <el-table-column label="归档状态" align="center" prop="archiveStateTxt" width="80" /> -->
            <el-table-column label="创建时间" align="" prop="createTime" width="160" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="480">
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220"> -->
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="vipSwitchChange(scope.row)" v-hasPermi="['biz:inspReportTask:columnVip']" >{{scope.row.vipCZTxt}}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="TaskInit(scope.row)" v-hasPermi="['biz:inspOrderBatch:TaskInit']" v-if="scope.row.orderType == 1" >重新采集</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-thumb" @click="addVipChange(scope.row)" v-if="scope.row.orderType == 1" >采集加急</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="handleSee(scope.row)" v-if="scope.row.orderType == 1" >人工录入</el-button>
                    <el-button size="mini" type="text" icon="el-icon-magic-stick" @click="handleReport(scope.row)" v-hasPermi="['biz:inspReportTask:info']" v-if="scope.row.orderType == 1" >立即生成</el-button>
                    <el-button size="mini" type="text" icon="el-icon-download" @click="handleDownLoad(scope.row)" :disabled="scope.row.reportPath == null || scope.row.reportPath == ''" >下载</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:inspReportTask:edit']" >修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:inspReportTask:remove']" >删除</el-button>
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

        <!-- 添加或修改报告任务对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <div class="box">
                    <el-form-item label="选择订单" prop="orderInfoId" style="width:98%">
                        <el-select v-model="form.orderInfoId" clearable filterable remote :remote-method="remoteMethod" placeholder="请输入订单名称/ID/网站标识码查询并选择" style="width:93.4%" @change="orderInfoIdChange" :disabled="editS">
                            <el-option
                                v-for="item in orderInfoDate"
                                :key="item.value"
                                :label="item.orderName+' - '+item.id+' / '+item.startDate+' - '+item.endDate+' / '+item.orderStateTxt"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择批次" prop="orderBatchId" style="width:48%">
                        <el-select v-model="form.orderBatchId" clearable filterable  placeholder="请选择批次" style="width:90%" @change="orderBatchIdChange" :disabled="editS">
                            <el-option
                                v-for="item in orderBatchIdDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <el-input v-model="form.siteCode" :disabled="editS" placeholder="请输入网站标识码" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="任务类型" prop="taskType" style="width:48%">
                        <el-select v-model="form.taskType" clearable placeholder="请选择任务类型" style="width:90%" disabled>
                            <el-option
                                v-for="item in taskTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始时间"
                            style="width:90%"
                            :disabled="editS"
                            @change="pickerOptionsStart"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束时间"
                            style="width:90%"
                            :disabled="editS"
                            @change="pickerOptionsEnd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="提前截止时间" prop="cutOffDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form.cutOffDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择提前截止时间"
                            style="width:90%"
                            @change="pickerOptionsCutOff"
                        ></el-date-picker>
                    </el-form-item>
                    
                    <el-form-item label="备注" prop="remark" style="width:92.6%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 添加或修改报告任务对话框 -->
        <el-dialog title="报告生成" :visible.sync="open2" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="110px">
                <el-form-item label="报告生成时间" prop="cutOffDate" style="width:90%">
                    <el-date-picker
                        clearable
                        v-model="form2.cutOffDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择报告生成时间"
                        :disabled="editS"
                        style="width:100%"
                        :picker-options="expireTimeOPtion"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspReportTask,
    getInspReportTask,
    delInspReportTask,
    addInspReportTask,
    updateInspReportTask,
    getOrderBatchSelectList,
    updateCreateReportState,
    spiderTaskInit,
    addVip
} from "@/api/biz/inspReportTask";
import {
    listInspOrderInfo,
    inspOrderInfoQueryList
} from "@/api/biz/inspOrderInfo";
import {
    listInspOrderBatch,
    inspOrderBatchQueryList,
} from "@/api/biz/inspOrderBatch";
import {
    siteInfoExist
} from "@/api/biz/inspChannel";
export default {
    name: "InspReportTask",
    data() {
        return {
            expireTimeOPtion: {
                disabledDate(time) {
                    // const startDate = new Date('2024-06-10');
                    // const startDate = new Date(this.newStartDate);
                    // console.log(startDate)
                    // const endDate = new Date();
                    // return time < startDate || time > endDate;
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
            newStartDate: null,
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
            // 报告任务表格数据
            inspReportTaskList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                orderInfoId: null,
                orderBatchId: null,
                reportName: null,
                reportPath: null,
                reportState: null,
                startDate: null,
                endDate: null,
                cutOffDate: null,
                taskType: null,
                archiveState: null,
                status: null,
                statusTime: null,
                statusEndTime: null,
                statusTimeStartDate: null,
                statusTimeEndDate: null,
                statusEndTimeStartDate: null,
                statusEndTimeEndDate: null,
                vip: null,
            },
            orderInfoId: null,
            orderBatchId: null,
            searchOrderInfoDate: [],

            startDateArr: [], // 采集开始时间
            endDateArr: [], // 采集结束时间
            orderInfoList: [], // 订单
            orderBatchList: [], // 批次
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                orderInfoId: [{ required: true, message: '请输入订单名称/ID/网站标识码查询并选择', trigger: 'change' }],
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur' },
                    { validator: this.validateSiteCode, trigger: 'blur' }
                ],
                orderBatchId: [{ required: true, message: '请选择批次', trigger: 'change' }],
                taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
                startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
                cutOffDate: [{ required: true, message: '请选择提前截止时间', trigger: 'change' }],

            },
            /**下拉菜单数据 */
            taskTypeDate: [ // 任务类型
                { label: '全站', value: 1 },
                { label: '抽查', value: 2 }
            ],
            orderInfoDate: [], // 订单
            orderBatchIdDate: [], // 订单批次
            editS: false,
            siteCodeType: false, // 网站标识码校验是否存在

            // 订单类型
            orderTypeDate: [
                {label: '网站监测订单', value: 1},
                {label: '新媒体订单', value: 20},
                {label: '网站安全监测订单', value: 30},
                // {label: '网站安全防护订单', value: 40},
            ],
            statusDate: [ // 采集状态
                { label: '初始化', value: 0 },
                { label: '待采集', value: 1 },
                { label: '采集中', value: 2 },
                { label: '采集完成', value: 3 },
                { label: '异常终止', value: 4 },
                { label: '启动失败', value: 5 },
                { label: '等待数据', value: 6 },
            ],
            vipDate: [ // 是否加急
                { label: '加急', value: 1 },
                { label: '不加急', value: 0 },
            ],


             /**
             * 批次赋值：开始、结束时间
             * 控制开始、结束选择范围变量
             */
            startDate: null,  
            endDate: null,


            orderName: null,
            batchName: null,

            /**报告生成 */
            open2: false,
            form2: {},
            rules2: {
                cutOffDate: [{ required: true, message: '请选择报告生成时间', trigger: 'change' }],
            },

            infoOrderInfoId: null,

            
        };
    },
    created() {
        this.getList();
        // this.getorderInfoDateList(); // 查询订单下拉数据
        // this.getorderBatchIdDateList(); // 查询批次下拉数据
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
        /** 查询订单列表 */
        // 搜索条件
        getorderInfoDateList(orderName,type) {
            this.loading = true;
            let date = {
                searchKeyLike: orderName,
                orderType: 1,
            }
            inspOrderInfoQueryList(date).then(response => {
                for(var i in response.data){
                    response.data[i].label = response.data[i].orderName;
                    response.data[i].value = response.data[i].id;
                    if(response.data[i].orderState == 1){
                        response.data[i].orderStateTxt = '未生效';
                    }else if(response.data[i].orderState == 2){
                        response.data[i].orderStateTxt = '生效中';
                    }else if(response.data[i].orderState == 3){
                        response.data[i].orderStateTxt = '已到期';
                    }
                }
                if(type == 1){ // 搜索
                    this.searchOrderInfoDate = response.data; // 订单-搜索
                }else if(type == 2){ // 新增，编辑
                    this.orderInfoDate = response.data; // 订单-搜索
                }

                this.loading = false;
            });
        },
        /**查询批次列表 */
        // 搜索条件/新增，编辑
        getorderBatchIdDateList(batchName,orderInfoId,type) {
            this.loading = true;
            let date = {
                searchKeyLike: batchName,
                orderInfoId: orderInfoId,
            }
            inspOrderBatchQueryList(date).then(response => {
                for(var i in response.data){
                    response.data[i].label = response.data[i].batchName;
                    response.data[i].value = response.data[i].id;
                    // 批次状态
                    if(response.data[i].batchState == 1){
                        response.data[i].batchStateTxt = '未启动';
                    }else if(response.data[i].batchState == 2){
                        response.data[i].batchStateTxt = '启动中';
                    }else if(response.data[i].batchState == 3){
                        response.data[i].batchStateTxt = '已结束';                        
                    }
                }
                if(type == 1){ // 搜索
                    this.orderBatchList = response.data;  // 订单-搜索
                    console.log(this.orderBatchList,'this.orderBatchList')
                }else if(type== 2){ // 新增，编辑
                    this.orderBatchIdDate = response.data;  // 订单-新增编辑
                }
                this.loading = false;
            });
        },
        // 订单事件
        searchOrderInfoIdChange(val){
            console.log(val,'val')
           
        },
        // 订单模糊搜（搜索）
        searchRemoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderInfoDateList(query,1); // 查询订单下拉数据
                },1000)
            }
        },
        // 订单模糊搜（新增编辑）
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderInfoDateList(query,2); // 新增编辑订单下拉数据
                },1000)
            }
        },
        // 订单批次模糊搜（搜索）
        searchOrderBarchIdInfoIdChange(query) {
            console.log(query,'queryqueryquery')
        },
        // 订单批次模糊搜（新增编辑）
        searchRemoteMethod2(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderBatchIdDateList(query,this.queryParams.orderInfoId,1); // 新增编辑订单下拉数据
                },1000)
            }
        },


        /** 查询报告任务列表 */
        getList() {
            this.loading = true;
            if(this.orderInfoId != null && this.orderInfoId != ''){
                this.queryParams.orderInfoId = this.orderInfoId;
            }
            if(this.orderBatchId != null && this.orderBatchId != ''){
                this.queryParams.orderBatchId = this.orderBatchId;
            }
            listInspReportTask(this.queryParams).then(response => {
                this.inspReportTaskList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspReportTaskList){
                    // 任务类型
                    if(this.inspReportTaskList[i].taskType == 1){
                        this.inspReportTaskList[i].taskTypeTxt = '全站';
                    }else if(this.inspReportTaskList[i].taskType == 2){
                        this.inspReportTaskList[i].taskTypeTxt = '抽查';
                    }
                    // 报告任务状态
                    if(this.inspReportTaskList[i].reportState == 1){
                        this.inspReportTaskList[i].reportStateTxt = '未生效';
                    }else if(this.inspReportTaskList[i].reportState == 2){
                        this.inspReportTaskList[i].reportStateTxt = '生效中';
                    }else if(this.inspReportTaskList[i].reportState == 3){
                        this.inspReportTaskList[i].reportStateTxt = '已到期';
                    }
                    // 报告生成状态
                    if(this.inspReportTaskList[i].createReportState == 1){
                        this.inspReportTaskList[i].createReportStateTxt = '未生成';
                        this.inspReportTaskList[i].createReportStateColor = '#606266';
                    }else if(this.inspReportTaskList[i].createReportState == 2){
                        this.inspReportTaskList[i].createReportStateTxt = '排队中';
                        this.inspReportTaskList[i].createReportStateColor = '#606266';
                    }else if(this.inspReportTaskList[i].createReportState == 3){
                        this.inspReportTaskList[i].createReportStateTxt = '生成中';
                        this.inspReportTaskList[i].createReportStateColor = '#606266';
                    }else if(this.inspReportTaskList[i].createReportState == 4){
                        this.inspReportTaskList[i].createReportStateTxt = '已生成';
                        this.inspReportTaskList[i].createReportStateColor = '#6cc65e';
                    }else if(this.inspReportTaskList[i].createReportState == 5){
                        this.inspReportTaskList[i].createReportStateTxt = '异常';
                        this.inspReportTaskList[i].createReportStateColor = '#F56C6C';
                    }else{
                        this.inspReportTaskList[i].createReportStateTxt = '--';
                    }
                    // 归档状态
                    if(this.inspReportTaskList[i].archiveState == 1){
                        this.inspReportTaskList[i].archiveStateTxt = '未存档';
                    }else if(this.inspReportTaskList[i].archiveState == 2){
                        this.inspReportTaskList[i].archiveStateTxt = '存档中';
                    }else if(this.inspReportTaskList[i].archiveState == 3){
                        this.inspReportTaskList[i].archiveStateTxt = '已存档';
                    }
                    // 订单类型
                    if(this.inspReportTaskList[i].orderType == 1){
                        this.inspReportTaskList[i].orderTypeTxt = '网站监测订单';
                    }else if(this.inspReportTaskList[i].orderType == 20){
                        this.inspReportTaskList[i].orderTypeTxt = '新媒体订单';
                    }
                    else if(this.inspReportTaskList[i].orderType == 30){
                        this.inspReportTaskList[i].orderTypeTxt = '网站安全监测订单';                        
                    }
                    // 采集类型
                    // for(var j in this.statusDate){
                    //     console.log(this.inspReportTaskList[i].status,'this.inspReportTaskList[i].status')
                    //     if(this.inspReportTaskList[i].status == this.statusDate[j].value){
                    //         console.log('ok')
                    //         this.inspReportTaskList[i].statusTxt = this.statusDate[j].label;
                    //     }else{
                    //         this.inspReportTaskList[i].statusTxt = '--'
                    //     }
                    // }
                    if(this.inspReportTaskList[i].status == 0){
                        this.inspReportTaskList[i].statusTxt = '初始化';
                        this.inspReportTaskList[i].statusColor = '#606266';
                    }else if(this.inspReportTaskList[i].status == 1){
                        this.inspReportTaskList[i].statusTxt = '待采集'
                        this.inspReportTaskList[i].statusColor = '#606266';
                    }else if(this.inspReportTaskList[i].status == 2){
                        this.inspReportTaskList[i].statusTxt = '采集中'
                        this.inspReportTaskList[i].statusColor = '#FAAD14'; // 黄
                    }else if(this.inspReportTaskList[i].status == 3){
                        this.inspReportTaskList[i].statusTxt = '采集完成'
                        this.inspReportTaskList[i].statusColor = '#30BF78'; // 绿
                    }else if(this.inspReportTaskList[i].status == 4){
                        this.inspReportTaskList[i].statusTxt = '异常终止'
                        this.inspReportTaskList[i].statusColor = '#F4664A'; // 红
                    }else if(this.inspReportTaskList[i].status == 5){
                        this.inspReportTaskList[i].statusTxt = '启动失败'
                        this.inspReportTaskList[i].statusColor = '#F4664A'; // 红
                    }else if(this.inspReportTaskList[i].status == 6){
                        this.inspReportTaskList[i].statusTxt = '等待数据'
                        this.inspReportTaskList[i].statusColor = '#FAAD14';
                    }
                    if(!this.inspReportTaskList[i].statusTime){
                        this.inspReportTaskList[i].statusTime = '--'
                    }
                    if(!this.inspReportTaskList[i].statusEndTime){
                        this.inspReportTaskList[i].statusEndTime = '--'
                    }
                    // 是否加急
                    if(this.inspReportTaskList[i].vip == 0){
                        this.inspReportTaskList[i].vipTxt = '不加急';
                        this.inspReportTaskList[i].vipSwitch = false;
                        this.inspReportTaskList[i].vipCZTxt = '加急';
                    }else if(this.inspReportTaskList[i].vip == 1){
                        this.inspReportTaskList[i].vipTxt = '加急';
                        this.inspReportTaskList[i].vipSwitch = true;
                        this.inspReportTaskList[i].vipCZTxt = '取消加急';
                    }
                    
                }
                if(this.orderInfoId != null && this.orderInfoId != ''){
                    this.queryParams.orderInfoId = null;
                }
                if(this.orderBatchId != null && this.orderBatchId != ''){
                    this.queryParams.orderBatchId = null;
                }
            });
        },

        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                siteCode: null,
                orderInfoId: null,
                orderBatchId: null,
                reportName: null,
                reportPath: null,
                reportState: null,
                startDate: null,
                endDate: null,
                cutOffDate: null,
                taskType: null,
                archiveState: 1,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
            };
            this.resetForm("form");
            this.editS = false;
            this.infoOrderInfoId = null;

        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.startDateArr.length > 0){
                this.queryParams.statusTimeStartDate = this.startDateArr[0];
                this.queryParams.statusTimeEndDate = this.startDateArr[1];
                if(this.queryParams.statusTimeStartDate){
                    this.queryParams.statusTimeStartDate = this.formatDate(this.queryParams.statusTimeStartDate);
                }
                if(this.queryParams.statusTimeEndDate){
                    this.queryParams.statusTimeEndDate = this.formatDate(this.queryParams.statusTimeEndDate);
                }
            }
            if(this.endDateArr.length > 0){
                this.queryParams.statusEndTimeStartDate = this.endDateArr[0];
                this.queryParams.statusEndTimeEndDate = this.endDateArr[1];
                if(this.queryParams.statusEndTimeStartDate){
                    this.queryParams.statusEndTimeStartDate = this.formatDate(this.queryParams.statusEndTimeStartDate);
                }
                if(this.queryParams.statusEndTimeEndDate){
                    this.queryParams.statusEndTimeEndDate = this.formatDate(this.queryParams.statusEndTimeEndDate);
                }
            }
            if(this.orderInfoId != null && this.orderInfoId != ''){
                this.queryParams.orderInfoId = this.orderInfoId;
            }
            if(this.orderBatchId != null && this.orderBatchId != ''){
                this.queryParams.orderBatchId = this.orderBatchId;
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.batchInfo = null;
            this.queryParams.batchInfo = null;
            this.orderBatchList = [];
            this.orderInfoList = [];
            this.startDateArr = [];
            this.queryParams.statusTimeStartDate = null;
            this.queryParams.statusTimeEndDate = null;
            this.endDateArr = [];
            this.queryParams.statusEndTimeStartDate = null;
            this.queryParams.statusEndTimeEndDate = null;

            this.searchOrderInfoDate = [];

            this.orderInfoId = null;
            this.orderBatchId = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            // this.getorderInfoDateList2(); // 查询订单下拉数据
            // this.getorderBatchIdDateList2(); // 查询批次下拉数据
            this.open = true;
            this.title = "添加报告任务";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.editS = true;
            // this.getorderInfoDateList2(); // 查询订单下拉数据
            // this.getorderBatchIdDateList2(); // 查询批次下拉数据
            const id = row.id || this.ids;
            getInspReportTask({id:id}).then(response => {
                this.form = response.data;
                this.infoOrderInfoId = response.data.orderInfoId;
                this.form.orderInfoId = response.data.orderName;
                this.open = true;
                this.title = "修改报告任务";
            });
            // this.siteCodeType = true;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        this.form.orderInfoId = this.infoOrderInfoId;
                        updateInspReportTask(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspReportTask(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除网站名称为"' + row.orderName + '"的数据项？')
                    .then(function() {
                        return delInspReportTask({ids:[ids]});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }else{
                const ids = this.ids
                this.$modal
                    .confirm('是否确认删除已选中的数据项？')
                    .then(function() {
                        return delInspReportTask({ids:ids});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }
            
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "biz/inspReportTask/export",
                {
                    ...this.queryParams
                },
                `inspReportTask_${new Date().getTime()}.xlsx`
            );
        },
        /**重新采集 */
        TaskInit(row){
            console.log(row,'row')
            let data = {
                id: row.orderBatchId,
                siteCode: row.siteCode,
            }
            spiderTaskInit(data).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
        },
        // 采集加急
        addVipChange(row){
            let subDate = {
                siteCode: null,
                batchID: row.orderBatchId,
            }
            this.$modal
                .confirm('是否确认采集加急订单批次"' + row.orderBatchId + '"的数据项？')
                .then(function() {
                    return addVip(subDate);
                })
                .then((res) => {
                    if(res.data == 0){
                        this.$modal.msgWarning("该批次下暂无任务"); 
                    }else{
                        this.$modal.msgSuccess("加急成功 "+res.data+" 个任务");
                    }
                    // this.getList();
                })
                .catch(() => {});
        },


        /**下拉菜单事件 */
        // 订单
        orderInfoIdChange(val){
            console.log(val)
            if(this.form.orderInfoId){
                this.getorderBatchIdDateList(null,this.form.orderInfoId,2)
            }else{
                this.form.orderBatchId = null;
                this.orderBatchIdDate = [];
                this.orderInfoDate = [];
            }
        },
        // 批次
        orderBatchIdChange(val){
            console.log(val)
            if(val){
                for(var i in this.orderBatchIdDate){
                    if(val == this.orderBatchIdDate[i].id){
                        this.form.taskType = this.orderBatchIdDate[i].taskType;
                        this.form.startDate = this.orderBatchIdDate[i].startDate;
                        this.form.endDate = this.orderBatchIdDate[i].endDate;
                        this.form.cutOffDate = this.orderBatchIdDate[i].endDate;
                        this.startDate = this.orderBatchIdDate[i].startDate;  
                        this.endDate = this.orderBatchIdDate[i].endDate;

                    }
                }
            }else{
                this.form.taskType = null;
                this.form.startDate = null;
                this.form.endDate = null;
                this.form.cutOffDate = null;
                this.startDate = null;  
                this.endDate = null;
            }
        },
        // 批次
        pcChange(val){
            console.log(val,'valvalval')
            this.queryParams.batchInfo = null;
            this.queryParams.batchInfo = {
                batchId: val.slice(-1)[0]
            }
            console.log(this.queryParams,'this.queryParams')
        },
        // 开始时间不能大于结束时间
        pickerOptionsStart(){
            if(Date.parse(this.form.startDate) > Date.parse(this.form.endDate) ) {
                this.form.startDate = '';
                this.$modal.msgWarning("开始时间不能大于结束时间");
            }
            if(Date.parse(this.form.startDate) < Date.parse(this.startDate)) {
                this.form.startDate = this.startDate;
                this.$modal.msgWarning("开始时间不能小于批次开始时间");
            }
        },
        // 结束时间不能小于开始时间
        pickerOptionsEnd(){
            if(Date.parse(this.form.endDate)<= Date.parse(this.form.startDate) ) {
                this.form.endDate = '';
                this.$modal.msgWarning("结束时间不能小于开始时间");
            }
            if(Date.parse(this.form.endDate) > Date.parse(this.endDate) ) {
                this.form.endDate = this.endDate;
                this.$modal.msgWarning("结束时间不能大于批次结束时间");
            }
        },
        // 提前截止时间不能小于开始时间且不能大于结束时间
        pickerOptionsCutOff(){
            if(Date.parse(this.form.cutOffDate) <= Date.parse(this.form.startDate)) {
                this.form.cutOffDate = this.form.endDate;
                this.$modal.msgWarning("提前截止时间不能小于开始时间");
            }else if(Date.parse(this.form.cutOffDate) > Date.parse(this.form.endDate)){
                this.form.cutOffDate = this.form.endDate;
                this.$modal.msgWarning("提前截止时间不能大于结束时间");
            }
            
        },
        // 网站标识码校验
        validateSiteCode(rule, value, callback){
            let date = {
                siteCode: value,
                siteType: null,
            }
            siteInfoExist(date).then((res)=>{
                this.siteCodeType = res.data.exist;
                console.log(this.siteCodeType,'this.siteCodeType')
                if(this.siteCodeType == false){
                    callback(new Error('网站标识不存在，请重新输入'));
                }else{
                    callback();
                }
            })
        },

        // 人工录入
        handleSee(row){
            // sessionStorage.setItem('siteCode', row.siteCode);
            sessionStorage.setItem('inspHandId', row.id);
            this.$router.push({name:'inspHand'})
        },

        // 报告生成
        handleReport(row){
            // let ids = [];
            // if(row.id){
            //     ids.push(row.id)
            // }else{
            //     ids = this.ids;
            // }
            // console.log(ids.length)
            // updateCreateReportState({ids: ids}).then((res)=>{
            //     this.getList();
            // })
            this.newStartDate = row.createTime.slice(0,10);
            // console.log(this.newStartDate.slice(0,10),'asdasdsa')
            this.open2 = true;
            this.reset2();
            if(row.id){
                this.form2.ids.push(row.id)
            }else{
                this.form2.ids = this.ids;
            }
            console.log(this.form2,'this.form2')
        },
        reset2(){
            this.form2 = {
                ids: [],
                cutOffDate: this.formatDate(new Date()),
            }
        },
        cancel2(){
            this.open2 = false;
            this.resetForm("form2");
        },
        submitForm2(){
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    console.log(this.form2,'this.form2')
                    if(Date.parse(this.form2.cutOffDate) <= Date.parse(this.newStartDate)) {
                        this.form2.cutOffDate = this.newStartDate;
                        this.$modal.msgWarning("提前截止时间不能小于开始时间");
                    }else{
                        updateCreateReportState(this.form2).then((res)=>{
                            this.$modal.msgSuccess("操作成功");
                            this.open2 = false;
                            this.getList();
                        })
                    }
                }
            });
        },
        // 下载
        handleDownLoad(row){
            // console.log(row)
            // row.reportPath = 'https://test-zhhy-snapshot.obs.cn-north-4.myhuaweicloud.com/report/8697397f0544603328388a8c.zip'
            // let response = fetch(row.reportPath)
            // console.log(response,'red-btn')
            // // 内容转变成blob地址
            // let blob = response.blob()
            // // 创建隐藏的可下载链接
            // let objectUrl = window.URL.createObjectURL(blob)
            let a = document.createElement('a');
            a.style.display = "none";
            //地址
            // a.href = objectUrl
            // a.href = 'https://test-zhhy-snapshot.obs.cn-north-4.myhuaweicloud.com/report/8697397f0544603328388a8c.zip'
            a.href = row.reportPath;
            // //修改文件名
            a.download = row.orderName;
            // // 触发点击
            document.body.appendChild(a);
            a.click();
            // //移除
            URL.revokeObjectURL(a.href);
        },


        // 日期
        sjrqChange(type,val){
            console.log(val)
            if(val == null){
                if(type == 1){
                    this.startDateArr = [];
                    this.queryParams.statusTimeStartDate = null;
                    this.queryParams.statusTimeEndDate = null;
                }else{
                    this.endDateArr = [];
                    this.queryParams.statusEndTimeStartDate = null;
                    this.queryParams.statusEndTimeEndDate = null;
                }
            }
        },

        // 采集加急开关事件
        vipSwitchChange(row){
            console.log(row,'加急开关')
            let vip = null;
            if(row.vip == 0){ // 不加急
                vip = 1;
            }else if(row.vip == 1){ // 加急
                vip = 0;
            }
            let subDate = {
                id: row.id,
                vip: vip
            };
            console.log(subDate,'subDate')
            addVip(subDate).then(()=>{
                this.getList();
                this.$modal.msgSuccess("修改成功");
            })
        },

        
    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 15vh !important;
    }
</style>
