<template>
    <div class="app-container">
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
                />
            </el-form-item>
            <el-form-item label="批次ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入批次ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="批次名称" prop="batchName">
                <el-input
                    v-model="queryParams.batchName"
                    placeholder="请输入批次名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="批次状态" prop="batchState">
                <el-select v-model="queryParams.batchState" clearable placeholder="请选择批次状态">
                    <el-option
                        v-for="item in batchStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="采集类型" prop="allSpiderType">
                <el-select v-model="queryParams.allSpiderType" clearable placeholder="请选择采集类型">
                    <el-option
                        v-for="item in allSpiderTypeDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="queryParams.orderType" clearable placeholder="请选择订单类型">
                    <el-option
                        v-for="item in orderTypeDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单名称" prop="orderInfoId">
                <!-- <el-input
                    v-model="queryParams.searchKeyLike"
                    placeholder="请输入订单名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:468px"
                /> -->
                <el-select v-model="queryParams.orderInfoId" filterable clearable placeholder="请输入订单名称/ID/网站标识码查询并选择" style="width:466px" @change="searchOrderInfoIdChange"  remote :remote-method="searchRemoteMethod" >
                    <el-option
                        v-for="item in searchOrderInfoDate"
                        :key="item.id"
                        :label="item.orderName+' - '+item.id+' / '+item.startDate+' - '+item.endDate+' / '+item.orderStateTxt"
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
            <el-form-item style="marginLeft:20px">
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
                    v-hasPermi="['biz:inspOrderBatch:add']"
                >添加批次</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspChannel:remove']"
                >批量删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspOrderBatchList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="网站标识码"  prop="siteCode"  width="120"  />
            <el-table-column label="网站名称"  prop="siteName" show-overflow-tooltip width="200" />
            <!-- <el-table-column label="订单名称"  prop="orderName" show-overflow-tooltip width="200" />
            <el-table-column label="订单ID"  prop="orderInfoId" align="center" show-overflow-tooltip width="100" />
            <el-table-column label="批次名称"  prop="batchName" show-overflow-tooltip  width="200"/>
            <el-table-column label="批次ID" prop="id" align="center" show-overflow-tooltip width="100" /> -->
            <el-table-column label="订单ID - 名称"  prop="orderName" show-overflow-tooltip width="270">
                <template slot-scope="scope">
                    <span>{{scope.row.orderInfoId}} - </span>
                    <span>{{scope.row.orderName}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="订单批次"  prop="batchName" /> -->
            <el-table-column label="批次ID - 名称"  prop="batchName" show-overflow-tooltip width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.id}} - </span>
                    <span>{{scope.row.batchName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="批次号" align="center" prop="batchNum" width="100" />
            <el-table-column label="批次状态" align="center" prop="batchStateTxt" width="100" />
            <el-table-column label="订单类型" align="" prop="orderTypeTxt" width="140" />
            <el-table-column label="任务类型" align="center" prop="taskTypeTxt" width="100"  />
            <el-table-column label="是否加急" align="center" prop="vipTxt" width="100">
                <!-- <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.vipSwitch"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="vipSwitchChange(scope.row)"
                        v-hasPermi="['biz:externalLinksRule:senior']"
                        >
                    </el-switch>
                </template> -->
            </el-table-column>
            <el-table-column label="采集类型" align="center" prop="allSpiderTypeTxt" width="100"  />
            <el-table-column label="开始时间" align="" prop="startDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="" prop="endDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="" prop="createTime" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="300" >
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="vipSwitchChange(scope.row)" v-hasPermi="['biz:inspOrderBatch:columnVip']" >{{scope.row.vipCZTxt}}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="TaskInit(scope.row)" v-hasPermi="['biz:inspOrderBatch:TaskInit']" v-if="scope.row.orderType == 1" >重新采集</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-thumb" @click="addVipChange(scope.row)" v-if="scope.row.orderType == 1" >采集加急</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleSee(scope.row)" v-if="scope.row.orderType == 1" >查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['biz:inspOrderBatch:edit']" >修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['biz:inspOrderBatch:remove']" >删除</el-button>
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

        <!-- 添加或修改订单批次对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <div class="box">
                    <el-form-item label="订单信息" prop="orderInfoId" style="width:98%">
                        <el-select v-model="form.orderInfoId" filterable clearable placeholder="请输入订单名称/ID/网站标识码查询并选择" style="width:95%" @change="orderInfoIdChange" :disabled="disabledS" remote :remote-method="remoteMethod" >
                            <el-option
                                v-for="item in orderInfoDate"
                                :key="item.id"
                                :label="item.orderName+' - '+item.id+' / '+item.startDate+' - '+item.endDate+' / '+item.orderStateTxt"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%;">
                        <el-input v-model="form.siteCode" disabled placeholder="请输入网站标识码" style="width:90%" />
                    </el-form-item>
                    <!-- <el-form-item label="订单ID" prop="orderInfoId" style="width:48%;marginLeft:1%">
                        <el-input v-model="form.orderInfoId" placeholder="请输入订单ID" />
                    </el-form-item> -->
                    <el-form-item label="批次名称" prop="batchName" style="width:48%;marginLeft:1%">
                        <el-input v-model="form.batchName" placeholder="请输入批次名称" style="width:90%" :disabled="disabledS" />
                    </el-form-item>
                    <el-form-item label="批次号" prop="batchNum" style="width:48%;">
                        <!-- <el-input v-model="form.batchNum" placeholder="请输入批次号" /> -->
                        <el-input-number v-model="form.batchNum" controls-position="right" :min="1" :max="10000" style="width:90%" :disabled="disabledS"></el-input-number>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startDate" style="width:48%;marginLeft:1%">
                        <el-date-picker
                            clearable
                            v-model="form.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始时间"
                            style="width:90%"
                            :disabled="disabledS || !form.orderInfoId"
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
                            :disabled="disabledS || !form.orderInfoId"
                            @change="pickerOptionsEnd"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="采集深度" prop="depthNum" style="width:48%;marginLeft:1%">
                        <!-- <el-input v-model="form.depthNum" placeholder="请输入全站采集深度，默认int最大值" /> -->
                        <el-input-number v-model="form.depthNum" controls-position="right" :min="0" :max="10000" style="width:90%" :disabled="disabledS"></el-input-number>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="taskType" style="width:48%">
                        <el-select v-model="form.taskType" clearable placeholder="请选择任务类型" style="width:90%" :disabled="disabledS">
                            <el-option
                                v-for="item in taskTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站采集类型" prop="allSpiderType" style="width:48%;marginLeft:1%">
                        <el-select v-model="form.allSpiderType" clearable placeholder="请选择全站采集类型" style="width:90%" :disabled="disabledS">
                            <el-option
                                v-for="item in allSpiderTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="附件类型" prop="downloadType" style="width:100%">
                        <el-checkbox-group v-model="form.downloadType" @change="handleCheckedCitiesChange" :disabled="disabledS">
                            <el-checkbox v-for="(item,index) in downloadTypeDate" :label="item.value" :key="item.value" :disabled='item.value == 2' >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item> -->
                    <el-form-item label="站点范围" prop="rangeType" style="width:100%" v-if="form.siteCode">
                        <el-radio-group v-model="form.rangeType" @change="rangeTypeChange" :disabled="disabledS">
                            <el-radio v-for="item in rangeTypeDate" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="站点范围选择" prop="siteCodes" style="width:100%;marginTop:-10px" v-if="form.siteCode && innerVisible"  :disabled="disabledS">
                        <div style="width:90%;textAlign:center" v-if="inspSiteTreeList.length==0">暂无数据</div>
                        <el-tree
                            ref="tree" 
                            node-key="siteCode"
                            :props="inspSiteTreeList"
                            :load="loadNode"
                            lazy
                            show-checkbox
                            v-if="inspSiteTreeList.length>0"
                            >
                        </el-tree>
                    </el-form-item> -->
                     
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm" :disabled="disabledS">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 自定义单位 -->
        <el-dialog width="1000px" title="自定义单位" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel2" class="zdyBox">
            <div class="divBox">
                <div class="divLeft" >
                    <div class="treeSearch">
                        <!-- <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                        </el-input> -->
                        <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" style="marginBottom: 10px" clearable></el-input>
                    </div>
                    <div class="treeDiv" v-loading="treeLoading">
                        <el-tree
                            ref="tree" 
                            node-key="siteCode"
                            :data="inspSiteTreeList"
                            :props="inspSiteTreeList"
                            show-checkbox
                            @check-change="handleCheckChange"
                            :default-expanded-keys="treeSiteCode"
                            :default-checked-keys="form.organizationSiteCodeList"
                            v-if="inspSiteTreeList.length"
                            :highlight-current="highlightBd"
                            :check-strictly="true"
                            :filter-node-method="filterNode"
                        >
                            <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                <div class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >
                                    <div class="label">{{ node.label }}</div>
                                    <!-- <el-checkbox @click.native.stop="treeChange(node, data)">全选</el-checkbox> -->
                                    <el-checkbox 
                                        v-model="data.checked"
                                        @change="(val) => handleCheckboxChange(val, node, data)"
                                        @click.native.stop
                                        v-if="data.children.length > 0"
                                    >全选</el-checkbox>
                                </div>
                            </el-tooltip>
                        </el-tree>
                    </div>
                    <!-- <span class="jt"><i :class='jtIco' @click="jtChange" ></i></span> -->
                </div>
                <!-- 筛选 -->
                <div class="divCen">
                    <div>
                        <el-input placeholder="填报单位名称/标识码" v-model="tbSiteCode" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                        </el-input>
                    </div>
                    <div class="divCenCT"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
                    <div class="divCenC">
                        <el-checkbox-group v-model="form.siteCodes" @change="handleCheckedCitiesChange" size="mini" v-if="cities.length > 0">
                            <el-checkbox v-for="(item,index) in cities" :label="item.siteCode" :key="index" border style="width:100%">
                                <div class="dxBox">
                                    <span class="spsp1">{{item.siteName}}</span>
                                    <span>{{item.siteCode}}</span>
                                </div>
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-empty :image-size="100" v-if="cities.length == 0"></el-empty>
                    </div>
                </div>
                <!-- 结果 -->
                <div class="divRight">
                    <div class="divRightT">
                        <div>已选<span style="color:red;margin:0 2px;">{{siteNames.length}}</span>项</div>
                        <el-button type="text" size="mini" @click="clearSiteNames">全部清空</el-button>
                    </div>
                    <div class="divRightTC">
                        <div class="jgLi" v-for="(item,index) in this.siteNames" v-if="siteNames.length > 0">
                            <span class="jgLiL">{{item.siteName}}</span>
                            <span @click="delSiteNames(item,index)"><i class="el-icon-close" style="color:#409EFF;cursor: pointer;"></i></span>
                        </div>
                        <el-empty :image-size="100" v-if="siteNames.length == 0"></el-empty>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>

        
        


    </div>
</template>

<script>
import {
    listInspOrderBatch,
    getInspOrderBatch,
    delInspOrderBatch,
    addInspOrderBatch,
    updateInspOrderBatch,
    spiderTaskInit,
    selectInspSiteTreeOrderSiteList,
    addVip
} from "@/api/biz/inspOrderBatch";
import {
    listInspOrderInfo,
} from "@/api/biz/inspOrderInfo";
import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";
import {
    getOrganizationUnit,
    getUnit,
} from "@/api/warn/index";
export default {
    name: "InspOrderBatch",
    data() {
        return {
            // minDate: null, // 动态最小日期
            // maxDate: null, // 动态最大日期
            // pickerOptions: {
            //     disabledDate: this.disabledDate
            // },
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
            // 订单批次表格数据
            inspOrderBatchList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                id: null,
                orderInfoId: null,
                batchName: null,
                batchNum: null,
                startDate: null,
                endDate: null,
                taskType: null,
                downloadType: null,
                depthNum: null,
                orderType: null,
                allSpiderType: null,
                searchKeyLike: null,
                vip: null,
            },
            searchOrderInfoDate: [],
            // 表单参数
            form: {
                // downloadType: [2],
            },
            // 表单校验
            rules: {
                orderInfoId: [
                    { required: true, message: '请输入订单名称/ID/网站标识码查询并选择', trigger: 'change' },
                    { validator: this.validateOrderInfoId, trigger: 'change' }
                ],
                siteCode: [{ required: true, message: '请输入网站标识码', trigger: 'blur' }],
                batchName: [{ required: true, message: '请输入批次名称', trigger: 'blur' }],
                batchNum: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
                startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
                depthNum: [{ required: true, message: '请输入采集深度', trigger: 'blur' }],
                taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
                downloadType: [{ required: true, message: '请选择下载附件类型', trigger: 'change' }],
                rangeType: [{ required: true, message: '请选择站点范围', trigger: 'change' }],
                allSpiderType: [{ required: true, message: '请选择全站采集类型', trigger: 'change' }],
                // siteCodes: [{ required: true, message: '请选择自定义站点范围', trigger: 'change' }],
                

            },
            /**下拉框数据 */
            taskTypeDate: [ // 任务类型
                {label: '全站', value: 1},
                {label: '抽查', value: 2},
            ],
            downloadTypeDate: [ // 下载附件类型
                {label: '图片', value: 1},
                {label: '页面(必选)', value: 2},
                {label: '附件', value: 3},
                {label: 'JS', value: 4},
                {label: 'CSS', value: 5},
                {label: '音视频', value: 6},
                {label: '未知地址', value: 7},
            ],
            rangeTypeDate: [ // 站点范围
                {label: '全部子级', value: 1},
                {label: '本级填报单位', value: 2},
                {label: '自定义选择', value: 3},
            ],
            orderInfoDate: [], // 订单
            inspSiteTreeList: [], // 站点范围选择
            innerVisible: false,
            
            disabledS: false, // 批次状态
            orderStateS: false, // 订单状态 

            // 订单类型
            orderTypeDate: [
                {label: '网站监测订单', value: 1},
                {label: '新媒体订单', value: 20},
                {label: '网站安全监测订单', value: 30},
                // {label: '网站安全防护订单', value: 40},
            ],
            // 批次状态
            batchStateList: [
                {label: '未启动', value: 1},
                {label: '启动中', value: 2},
                {label: '已结束', value: 3},
            ],
            allSpiderTypeDate: [ // 全站采集类型
                { label: '本地采集', value: 0 },
                // { label: '接口采集', value: 1 },
            ],
            vipDate: [ // 是否加急
                { label: '加急', value: 1 },
                { label: '不加急', value: 0 },
            ],

            /**
             * 订单赋值：开始、结束时间
             * 控制开始、结束选择范围变量
             */
            startDate: null,  
            endDate: null,

            infoObj: {},

            infoOrderInfoId: null,



            innerVisible: false,
            filterText: null,
            treeLoading: false,
            tbSiteCode: null,
            
            // 筛选
            checkAll: false,
            checkedCities: [], // 已选择项
            cities: [], // 数据源
            isIndeterminate: false,

            siteCodes: [], // 左侧组织单位集合
            siteCodesAll: [],

            // 右侧选中结果
            siteNames: [],

            defaultCheckedKeys: [], // 需要回显的选中节点key数组

            switchS: false,

            tbSiteCode: null,

            treeSiteCode: [],

            /**自定义站点 */
            innerVisible: false, // 嵌套对话框

            inspSiteTreeList: [], // 站点范围选择
            selectedKey: null,
            filterText: null,
            showTitle: true,
            tooltipTitle: "",
            highlightBd: true,

            // 全选
            treeCheckAll: false,



            
        };
    },
    watch: {
        'form.siteCode'(newVal, oldVal) {
            if(oldVal && newVal !== oldVal){
                // 自定义
                this.cities = []; // 中间筛选
                this.siteNames = []; // 右侧结果
                this.form.siteCodes = []; // 提交数据集合
                this.siteNames = [];
                this.checkAll = false;
                this.isIndeterminate = false;
                this.siteCodesAll = [];
            }
        }
    },
    created() {
        this.getList();
    },
    methods: {
        disabledDate(time) {
            return time.getTime() < this.minDate.getTime() || time.getTime() > this.maxDate.getTime();
        },
        formatDate: function(timestamp) {
            var date = new Date(timestamp);
            var year = date.getFullYear();
            // var month = date.getMonth() + 1;
            // var day = date.getDate();
            var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
            return year + '-' + month + '-' + day;
        },
        // date为相加前的时间， days 为 需要相加的天数
        addDate(date, days) {
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var mm = "'" + month + "'";
            var dd = "'" + day + "'";
            if(mm.length == 3) {
                month = "0" + month;
            }
            if(dd.length == 3) {
                day = "0" + day;
            }
            var time = year + "-" + month + "-" + day
            return time;
        },
        /** 查询订单批次列表 */
        getorderInfoDateList(orderName,type) {
            // this.loading = true;
            let date = {
                pgNum: 1,
                pgSize: 10,
                searchKeyLike: orderName
            }
            listInspOrderInfo(date).then(response => {
                for(var i in response.rows){
                    if(response.rows[i].orderState == 1){
                        response.rows[i].orderStateTxt = '未生效';
                    }else if(response.rows[i].orderState == 2){
                        response.rows[i].orderStateTxt = '生效中';
                    }else if(response.rows[i].orderState == 3){
                        response.rows[i].orderStateTxt = '已到期';
                    }
                }
                if(type == 1){ // 搜索
                    this.searchOrderInfoDate = response.rows;
                }else if(type == 2){ // 新增，编辑
                    this.orderInfoDate = response.rows;
                }
                // this.total = response.total;
                // this.loading = false;
            });
        },
         /** 查询订单信息列表 */
        getList() {
            // this.loading = true;
            listInspOrderBatch(this.queryParams).then(response => {
                this.inspOrderBatchList = response.rows;
                this.total = response.total;
                // this.loading = false;
                for(var i in this.inspOrderBatchList){
                    if(this.inspOrderBatchList[i].taskType == 1){
                        this.inspOrderBatchList[i].taskTypeTxt = '全站';
                    }else if(this.inspOrderBatchList[i].taskType == 2){
                        this.inspOrderBatchList[i].taskTypeTxt = '抽查';
                    }
                    // 订单类型
                    if(this.inspOrderBatchList[i].orderType == 1){
                        this.inspOrderBatchList[i].orderTypeTxt = '网站监测订单';
                    }else if(this.inspOrderBatchList[i].orderType == 20){
                        this.inspOrderBatchList[i].orderTypeTxt = '新媒体订单';
                    }
                    else if(this.inspOrderBatchList[i].orderType == 30){
                        this.inspOrderBatchList[i].orderTypeTxt = '网站安全监测订单';                        
                    }
                    // 批次状态
                    if(this.inspOrderBatchList[i].batchState == 1){
                        this.inspOrderBatchList[i].batchStateTxt = '未启动';
                    }else if(this.inspOrderBatchList[i].batchState == 2){
                        this.inspOrderBatchList[i].batchStateTxt = '启动中';
                    }else if(this.inspOrderBatchList[i].batchState == 3){
                        this.inspOrderBatchList[i].batchStateTxt = '已结束';                        
                    }
                    // 采集类型
                    if(this.inspOrderBatchList[i].allSpiderType == 0){
                        this.inspOrderBatchList[i].allSpiderTypeTxt = '本地采集';
                    }else if(this.inspOrderBatchList[i].allSpiderType == 1){
                        this.inspOrderBatchList[i].allSpiderTypeTxt = '接口采集';
                    }else{
                        this.inspOrderBatchList[i].allSpiderTypeTxt = '--';
                    }
                    // 是否加急
                    if(this.inspOrderBatchList[i].vip == 0){
                        this.inspOrderBatchList[i].vipTxt = '不加急';
                        this.inspOrderBatchList[i].vipSwitch = false;
                        this.inspOrderBatchList[i].vipCZTxt = '加急';
                    }else if(this.inspOrderBatchList[i].vip == 1){
                        this.inspOrderBatchList[i].vipTxt = '加急';
                        this.inspOrderBatchList[i].vipSwitch = true;
                        this.inspOrderBatchList[i].vipCZTxt = '取消加急';
                    }
                }
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
            this.getList();
        },
        // 表单重置
        reset() {
            // if(this.form.rangeType == 3 && this.form.siteCodes != null){
            //     this.$refs.tree.setCheckedKeys([]);                
            // }
            this.form = {
                id: null,
                siteCode: null,
                orderInfoId: null,
                batchName: null,
                batchNum: 1,
                startDate: this.formatDate(new Date()),
                endDate: this.addDate(new Date(),30),
                taskType: 1,
                // downloadType: [2],
                rangeType: 1,
                depthNum: 10000,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                siteCodes: [],
                siteType: null,
                allSpiderType: 0,
            };
            this.resetForm("form");
            // this.innerVisible = false;
            this.disabledS = false;
            this.orderStateS = false;
            this.orderInfoDate = [];
            this.infoObj = {};

            this.infoOrderInfoId = null;

            this.siteNames = [];
            this.cities = [];
            this.checkAll = false;

            
            // this.$refs.tree.setCheckedKeys([]);
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.searchOrderInfoDate = [];
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
            // this.getorderInfoDateList(); // 订单列表
            this.open = true;
            this.title = "添加订单批次";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            // this.getorderInfoDateList(); // 订单列表
            const id = row.id || this.ids;
            getInspOrderBatch({id: id}).then(response => {
                this.form = response.data;
                this.infoOrderInfoId = response.data.orderInfoId;
                this.form.orderInfoId = response.data.orderName;
                // this.form.downloadType = this.form.downloadType.split(',');
                // this.form.downloadType = this.form.downloadType.map(item => parseInt(item, 10));
                // console.log(this.form.downloadType,'this.form')
                // 自定义站点范围开关
                // if(this.form.rangeType == 3){
                //     this.innerVisible = true;
                // }else{
                //     this.innerVisible = false;
                // }
                // this.innerVisible = false;
                console.log(this.form.batchState,'this.form.batchState ')
                // 批次状态 1、未启动 2、启动中 3、已结束
                if(this.form.batchState == 1){ 
                    this.disabledS = false;
                }else{
                    this.disabledS = true;
                }
                this.open = true;
                this.title = "修改订单批次";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if(this.form.siteCodes.length == 0){
                        this.form.siteCodes = null;
                    }
                    console.log(this.form,'addDate')
                    if (this.form.id != null) {
                        this.form.orderInfoId = this.infoOrderInfoId;
                        updateInspOrderBatch(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();          
                        });
                    } else {
                        addInspOrderBatch(this.form).then(response => {
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
                    .confirm('是否确认删除批次名称为"' + row.batchName + '"的数据项？')
                    .then(function() {
                        return delInspOrderBatch({ids:[ids]});
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
                        return delInspOrderBatch({ids:ids});
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
                "biz/inspOrderBatch/export",
                {
                    ...this.queryParams
                },
                `inspOrderBatch_${new Date().getTime()}.xlsx`
            );
        },
        /**重新采集 */
        TaskInit(row){
            spiderTaskInit({id: row.id}).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
        },
        // 采集加急
        addVipChange(row){
            let subDate = {
                siteCode: null,
                batchID: row.id,
            }
            this.$modal
                .confirm('是否确认采集加急订单批次"' + row.id + '"的数据项？')
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
        // spiderTaskInit
        
        /**下拉、单选、多选事件 */
        // 订单下拉事件
        orderInfoIdChange(val){
            console.log(val,'val')
            if(val){
                for(var i in this.orderInfoDate){
                    if(val == this.orderInfoDate[i].id){
                        this.infoObj = this.orderInfoDate[i];
                        console.log(this.orderInfoDate[i],'this.orderInfoDate[i]')
                        this.form.siteCode = this.orderInfoDate[i].siteCode;
                        this.form.siteType = this.orderInfoDate[i].siteType;
                        // this.minDate = new Date(this.startDate); // 动态最小日期
                        // this.maxDate = new Date(this.endDate); // 动态最小日期
                        // 订单状态
                        if(this.orderInfoDate[i].orderState == 3){ // 不可新增编辑
                            this.orderStateS = true;
                            // 开始时间、结束时间
                            this.form.startDate = null;
                            this.form.endDate = null;
                            // 控制组件选择范围变量
                            this.startDate = null;  
                            this.endDate = null;
                        }else{ // 可新增编辑
                            this.orderStateS = false;
                            // 开始时间、结束时间
                            // this.form.startDate = this.orderInfoDate[i].startDate;
                            // this.form.endDate = this.orderInfoDate[i].endDate;
                            this.startDate = this.orderInfoDate[i].startDate;  
                            this.endDate = this.orderInfoDate[i].endDate;
                        }
                    }
                }
            }else{
                this.form.siteCode = null;
                this.form.siteType = null;
                this.orderStateS = false;
                // this.form.startDate = null;
                // this.form.endDate = null;
                this.startDate = null;
                this.endDate = null;
            }
        },
        searchOrderInfoIdChange(val){
            console.log(val,'val')
            if(val){
                console.log(this.searchOrderInfoDate,'下拉数组')
                for(var i in this.searchOrderInfoDate){
                    if(val == this.searchOrderInfoDate[i].id){
                        
                    }
                }
            }else{
                this.queryParams.searchKeyLike = null;
            }
        },
        // 站点范围
        rangeTypeChange(val){
            console.log(val)
            if(val == 3){
                this.innerVisible = true;
                this.getListzd(this.form.siteCode); // 站点范围
            }else{
                this.innerVisible = false;
                this.inspSiteTreeList = [];
            }
        },
        // 订单二次校验
        validateOrderInfoId(rule, value, callback){
            if(this.orderStateS == true){
                 callback(new Error('该订单已过期，请重新选择'));
            }else{
                 callback();
            }
        },
        // 开始时间不能大于结束时间
        pickerOptionsStart(){
            // 结束时间=开始时间延后30天
            if(this.form.startDate){
                this.form.endDate = this.addDate(this.form.startDate,30)
            }else{
                this.form.endDate = null;
            }
            if(Date.parse(this.form.startDate) > Date.parse(this.form.endDate)) {
                this.form.startDate = '';
                this.$modal.msgWarning("开始时间不能大于结束时间");
            }
            if(Date.parse(this.form.startDate) < Date.parse(this.startDate)) {
                this.form.startDate = this.startDate;
                this.$modal.msgWarning("开始时间不能小于订单开始时间");
            }
        },
        // 结束时间不能小于开始时间
        pickerOptionsEnd(){
            if(Date.parse(this.form.endDate)<= Date.parse(this.form.startDate)) {
                // this.form.endDate = '';
                this.form.endDate = this.addDate(this.form.startDate,30)
                this.$modal.msgWarning("结束时间不能小于开始时间");
            }
            if(Date.parse(this.form.endDate) > Date.parse(this.endDate)) {
                this.form.endDate = this.endDate;
                this.$modal.msgWarning("结束时间不能大于订单结束时间");
            }
        },

        // 订单模糊搜
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderInfoDateList(query,2); // 查询订单下拉数据
                },1000)
            }
        },
        searchRemoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderInfoDateList(query,1); // 查询订单下拉数据
                },1000)
            }
        },

        // 查看
        handleSee(row){
            sessionStorage.setItem('orderBatchInfo', row.id);
            this.$router.push({ name: 'orderBatchInfo' })
        },


        /**自定义站点 */
        // 站点范围选择
        getListzd(parentSite) {
            this.treeLoading = true;
            // this.loading = true;
            let date = {siteCode: parentSite}
            getOrganizationUnit(date).then(response => {
                this.inspSiteTreeList = [];
                setTimeout(()=>{
                    this.inspSiteTreeList = response.data;
                    for(var i in this.inspSiteTreeList){
                        this.inspSiteTreeList[i].treeCheck = false;
                    }
                    this.treeLoading = false;
                },100)
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 自定义单位-树点击复选框
        handleCheckChange(data, checked, indeterminate) {
            // let that = this;
            if(checked == true){
                this.siteCodesAll.push(data.siteCode)
            }else{
                this.siteCodesAll = this.siteCodesAll.filter(item => item !== data.siteCode);
                // this.form.siteCodes = [];
            }
            this.siteCodesAll = [...new Set(this.siteCodesAll)];
            if(this.siteCodesAll.length == 0){
                this.siteNames = [];
                this.form.siteCodes = [];
            }
            if(this.switchS == false){
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.siteType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    console.log(this.cities,'asd')
                    // this.form.siteCodes = [];
                    // this.siteNames = [];
                })
            }
        },
        handleCheckboxChange(checked, node, data) {
            this.$refs.tree.setChecked(data.siteCode, checked);
            this.switchS = true;    
            let arr = [];   
            if(checked == true){

                arr = this.collectVals(data.children);
                for(var i in arr){
                    this.siteCodesAll.push(arr[i])
                }
                this.siteCodesAll.unshift(data.siteCode)
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                this.updateChildrenChecked(data, checked);
                this.syncTreeCheckedState(1);
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteCodes = [];
                }
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.siteType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    this.switchS = false;
                })
                
            }else{
                arr = this.collectVals(data.children);
                if(arr.length == 0){
                    arr.push(data.siteCode)
                }
                this.siteCodesAll = this.siteCodesAll.filter(item => !arr.includes(item));
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                // this.switchS = false;
                // this.siteCodesAll = [];
                if(data.siteCode == this.form.siteCode){
                    this.$nextTick(() => {
                        this.updateChildrenChecked(data, checked);
                        this.syncTreeCheckedState(2);
                        this.siteCodesAll = [];
                    });
                }
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteCodes = [];
                }
                this.$nextTick(() => {
                    this.updateChildrenChecked(data, checked);
                    this.syncTreeCheckedState(2);
                    getUnit({siteCodes: this.siteCodesAll,codeType: this.form.siteType}).then((res)=>{
                        this.cities = [];
                        this.cities = res.data;
                        this.checkAll = false;
                        this.switchS = false;
                    })
                });

            }
        },
        // 递归更新子节点的checked状态
        updateChildrenChecked(node, checked) {
            if (node.children && node.children.length) {
                node.children.forEach(child => {
                    // child.checked = checked;
                    this.$set(child, 'checked', checked);
                    this.updateChildrenChecked(child);
                });
                this.$forceUpdate();  // 强制当前组件重新渲染

            }
        },
        // 同步到树组件的选中状态
        syncTreeCheckedState(type) {
            const checkedNodes = this.getCheckedNodes(this.inspSiteTreeList);
            const checkedKeys = checkedNodes.map(node => node.siteCode);
            this.$refs.tree.setCheckedKeys(checkedKeys);
        },
        // 获取所有checked为true的节点
        getCheckedNodes(nodes) {
            let result = [];
            nodes.forEach(node => {
                if (node.checked) {
                    result.push(node);
                }
                if (node.children && node.children.length) {
                    result = result.concat(this.getCheckedNodes(node.children));
                }
            });
            return result;
        },
        collectVals(arr, result = []) {
            arr.forEach(item => {
                result.push(item.siteCode);
                if (item.children && item.children.length > 0) {
                    this.collectVals(item.children, result);
                }
            });
            return result;
        },
        
        // 划过获取字数 用于是否显示黑框提示
        onShowNameTipsMouseenter(e) {
            // console.log(e,'e')
            var target = e.target;
            let textLength = target.clientWidth;
            let containerLength = target.scrollWidth;
            if (textLength < containerLength) {
                this.tooltipTitle = e.target.innerText;
                this.showTitle = false;
            } else {
                this.showTitle = true;
            }
        },
        /**自定义站点 */
        // 筛选
        handleCheckAllChange(val) {
            this.form.siteCodes = val ? this.cities : [];
            this.form.siteCodes = this.checkAll ? this.cities.map(item => item.siteCode) : [];
            this.isIndeterminate = false;

            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteCodes){
                    if(this.form.siteCodes[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        // 单个点击
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteCodes){
                    if(this.form.siteCodes[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        // 确定
        submitForm2(){
            this.innerVisible = false;
            console.log(this.form.siteCodes,'this.form.siteCodes')
            // this.yxxNum = this.form.siteCodes.length;
        },
        // 取消
        cancel2(){
            this.innerVisible = false;
            // this.yxxNum = this.form.siteCodes.length;
            
            // if(this.form.siteCodes.length == 0){
            //     this.form.siteCodes = [];
            // }
        },
        // 清空树搜索条件
        clearSearch(){
            getUnit({siteCodes: this.siteCodesAll,name: null,codeType: this.form.siteType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
        },
        // 左侧树搜索
        siteCodeSearch(){
            console.log('ok')
            // tbSiteCode
            getUnit({siteCodes: this.siteCodesAll,name: this.tbSiteCode,codeType: this.form.siteType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
            
        },
        /**右侧 */
        // 单个删除
        delSiteNames(item,index){
            this.siteNames.splice(index,1);
            let arr = [];
            for(var i in this.cities){
                if(item.siteCode == this.form.siteCodes[i]){
                    this.form.siteCodes.splice(i,1)
                }
            }
            this.isIndeterminate = this.form.siteCodes.length > 0 && this.form.siteCodes.length < this.cities.length;
        },
        // 全部删除
        clearSiteNames(){
            this.form.siteCodes = [];
            this.siteNames = [];
            this.isIndeterminate = this.form.siteCodes.length > 0 && this.form.siteCodes.length < this.cities.length;
            this.checkAll = false;
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

    // 自定义站点
    .divLeft{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .treeDiv{
            flex: 1;
            overflow: auto;
             -ms-overflow-style: none;  /* IE 和 Edge */
            scrollbar-width: none;     /* Firefox */
        }
    }
    .tit{
        color: red;
        font-size: 11px;
        margin-left: -5px;
    }
    .divBox,.pcBox{
        width: 100%;
        height: 61vh;
        display: flex;
        // justify-content: space-between;
    }
    .divLeft{
        width: 300px;
        padding-right: 10px;
        border-right: 1px solid #C0C4CC;
    }
    .divCen{
        border-right: 1px solid #C0C4CC;
        width: 350px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .pcCen{
        width: 470px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-right: 1px solid #C0C4CC;
        padding: 0 10px;

    }
    .pcRight{
        width: 450px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .pcTable{
        flex: 1;
        overflow: auto;
        margin-bottom: 8px;
    }
    .divRight{
        width: 350px;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .divRightT{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }
    .divRightTC{
        flex: 1;
        overflow: auto;
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;     /* Firefox */
        .jgLi{
            line-height: 32px;
            border-bottom: 1px solid #C0C4CC;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .jgLiL{
                width: 90%;
                white-space: nowrap;      /* 禁止换行 */
                overflow: hidden;         /* 隐藏溢出内容 */
                text-overflow: ellipsis;  /* 显示省略号 */
                display: flex;
                align-items: center;
                img{
                    width: 20px;
                    margin-right: 5px;
                    border-radius: 100%;
                }
            }
        }
    }
    .dxBox{
        display: flex;
        justify-content: space-between;
        .spsp1{
            flex: 1;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
            margin-right: 10px;
        }
    }
    .divCenC{
        flex: 1;
        overflow: auto;
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;     /* Firefox */
        margin: 10px 0;
        overflow-x: hidden;
    }
    .divCenCT{
        display: flex;
        justify-content: right;
    }
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        // margin-right: 20px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label{
            flex: 1;
            margin-right: 10px;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
        }
    }
    .qxBox{
        display: flex;
        align-items: center;
        .qxBoxK{
            font-size: 14px;
            color: #606266;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        span{
            display: inline-block;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            background-color: #FFFFFF;
            z-index: 1;
            position: relative;
            top: 0;
            left: -5px;
            font-size: 12px;
        }
    }
    .dxxzClass{
        color: #ffffff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
</style>
<style scoped>
    /deep/.el-dialog{
        max-height: 90%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    /deep/.el-dialog__body{
        flex: 1;
        overflow: auto;
    }
    /* 自定义站点 */
    /deep/.zdyBox .el-dialog__body{
        overflow: hidden!important;
    }
    /deep/.divCenC .el-checkbox{
        margin-left: 0!important;
        margin-top: 5px!important;
    }
    /deep/.divCenC .el-checkbox__label{
        width: 95%!important;
    }
    /deep/.el-tree-node {
        overflow: hidden!important;
    }


    /deep/.divCenC .el-empty{
        margin-top: 35%!important;
       
    }
    /deep/.divRightTC .el-empty{
        margin-top: 45.9%!important;
    }

    /deep/.pagination-container{
        padding: 0!important;
    }
    /deep/.el-pagination{
        display: flex;
        justify-content: right;
    }
</style>
