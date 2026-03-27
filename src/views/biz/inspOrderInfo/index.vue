<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="96px"
        >
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="订单ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入订单ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="订单名称" prop="orderName">
                <el-input
                    v-model="queryParams.orderName"
                    placeholder="请输入订单名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
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
            <el-form-item label="订单状态" prop="orderState" style="marginLeft: -5px">
                <el-select v-model="queryParams.orderState" clearable placeholder="请选择订单状态">
                    <el-option
                        v-for="item in orderStateDate"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否正式订单" prop="formalState">
                <el-select v-model="queryParams.formalState" clearable placeholder="请选择">
                    <el-option
                        v-for="item in formalStateDate"
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
                    v-hasPermi="['biz:inspOrderInfo:add']"
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
                    v-hasPermi="['biz:inspChannel:remove']"
                >批量删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['biz:inspOrderInfo:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspOrderInfoList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="网站标识码" prop="siteCode" width="120" />
            <el-table-column label="网站名称" prop="siteName" show-overflow-tooltip width="200" />
            <el-table-column label="订单名称" prop="orderName" show-overflow-tooltip width="200" />
            <el-table-column label="订单ID" prop="id" align="center" show-overflow-tooltip width="100" />
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
            <el-table-column label="报告总次数" align="center" prop="serviceTotalNum" width="100" />
            <el-table-column label="报告已使用次数" align="center" prop="serviceUseNum" width="120" />
            <el-table-column label="订单类型" align="" prop="orderTypeTxt" width="140" />
            <el-table-column label="订单状态" align="center" prop="orderStateTxt" width="100" />
            <el-table-column label="是否正式订单" align="center" prop="formalStateTxt" width="100" />
            <el-table-column label="创建时间" align="" prop="createTime" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="260">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="addOrderBatch(scope.row)"
                        :disabled="scope.row.orderState == 3"
                        v-if="scope.row.orderType != 30"
                    >添加批次</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-view"
                        @click="orderInfo(scope.row)"
                        :disabled="scope.row.orderState == 3"
                    >站点范围</el-button>
                    <!-- orderInfo -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspOrderInfo:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspOrderInfo:remove']"
                    >删除</el-button>
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

        <!-- 添加或修改订单信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <div class="box">
                    <el-form-item label="订单类型" prop="orderType" style="width:48%">
                        <el-select v-model="form.orderType" clearable placeholder="请选择订单类型" @change="orderChange" style="width:100%" :disabled="orderTypeS" >
                            <el-option
                                v-for="item in orderTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <!-- <el-input v-model="form.siteCode" placeholder="请输入网站标识码" :disabled="siteCodeS" clearable/> -->
                        <el-tooltip class="item" effect="dark" content="失去焦点会重新校验网站标识码是否存在" placement="top-start" style="width:100%">
                            <el-input v-model="form.siteCode" placeholder="请输入标识码" style="width:90%" clearable :disabled="siteCodeS"/>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="订单名称" prop="orderName" style="width:48%">
                        <el-input v-model="form.orderName" placeholder="请输入订单名称" clearable :disabled="!siteCodeType" />
                    </el-form-item>
                     <el-form-item label="报告次数" prop="serviceTotalNum" style="width:48%">
                        <!-- <el-input v-model="form.serviceTotalNum" placeholder="请输入报告次数" /> -->
                        <el-input-number v-model="form.serviceTotalNum" controls-position="right" :min="1" :max="1000" style="width:80%" :disabled="!siteCodeType"></el-input-number>
                        <span>（次）</span>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始时间"
                            style="width:100%"
                            :disabled="!dateS"
                            @change="pickerOptionsStart"
                            clearable
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束时间"
                            style="width:100%"
                            :disabled="!dateS"
                            @change="pickerOptionsEnd"
                            clearable
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否正式订单" prop="formalState" style="width:48%">
                        <!-- <el-radio-group v-model="form.formalState">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group> -->
                        <el-select v-model="form.formalState" clearable placeholder="请选择" :disabled="title=='修改订单信息'" style="width:100%">
                            <el-option
                                v-for="item in formalStateDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="销售人员" prop="ownerName" style="width:48%">
                        <el-input v-model="form.ownerName" placeholder="请输入销售人员" clearable />
                    </el-form-item>
                    <!-- <el-form-item label="服务类型" prop="orderServeArry" style="width:100%" v-if="form.orderType != 30"> -->
                    <el-form-item label="服务类型" prop="orderServeArry" style="width:100%">
                        <el-checkbox-group v-model="form.orderServeArry" @change="handleCheckedCitiesChange" >
                            <el-checkbox v-for="(item,index) in downloadTypeDate" :label="item.value" :key="item.value" :disabled='item.value == 2 || item.value == 4 || item.value == 5' >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="站点范围" prop="rangeType" style="width:100%;marginTop:-10px" v-if="form.siteCode && dateS">
                        <el-radio-group v-model="form.rangeType" @change="rangeTypeChange" :disabled="disabledS">
                            <el-radio v-for="item in rangeTypeDate" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="站点范围选择" prop="siteCodes" style="width:100%;marginTop:-10px" v-if="form.siteCode && getListzdS"  :disabled="disabledS">
                        <!-- <el-tree
                        ref="tree" 
                        node-key="id"
                        :props="inspSiteTreeList"
                        :load="loadNode"
                        lazy
                        show-checkbox
                        :default-checked-keys='form.siteCodes'
                        :default-expanded-keys=[1]>
                        </el-tree> -->
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
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" style="width:96%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" clearable />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

         <!-- 添加或修改订单批次对话框 -->
        <el-dialog :title="title2" :visible.sync="open2" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="110px">
                <div class="box">
                    <el-form-item label="订单" prop="orderInfoId" style="width:48%">
                        {{orderBatchInfo.orderName}}
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%;marginLeft:1%">
                        {{form2.siteCode}}
                    </el-form-item>
                    <!-- <el-form-item label="订单ID" prop="orderInfoId" style="width:48%;marginLeft:1%">
                        <el-input v-model="form.orderInfoId" placeholder="请输入订单ID" />
                    </el-form-item> -->
                    <el-form-item label="批次名称" prop="batchName" style="width:48%">
                        <el-input v-model="form2.batchName" placeholder="请输入批次名称" style="width:90%"  />
                    </el-form-item>
                    <el-form-item label="批次号" prop="batchNum" style="width:48%;marginLeft:1%">
                        <!-- <el-input v-model="form.batchNum" placeholder="请输入批次号" /> -->
                        <el-input-number v-model="form2.batchNum" controls-position="right" :min="1" :max="10000" style="width:90%" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="startDate" style="width:48%">
                        <el-date-picker
                            clearable
                            v-model="form2.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择开始时间"
                            style="width:90%"
                            :disabled="disabledS || !form2.orderInfoId"
                            @change="pickerOptionsStart2"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="endDate" style="width:48%;marginLeft:1%">
                        <el-date-picker
                            clearable
                            v-model="form2.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择结束时间"
                            style="width:90%"
                            :disabled="disabledS || !form2.orderInfoId"
                            @change="pickerOptionsEnd2"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="采集深度" prop="depthNum" style="width:48%" v-if="pcObj.orderType == 1">
                        <!-- <el-input v-model="form.depthNum" placeholder="请输入全站采集深度，默认int最大值" /> -->
                        <el-input-number v-model="form2.depthNum" controls-position="right" :min="0" :max="10000" style="width:90%" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="taskType" style="width:48%;marginLeft:1%" v-if="pcObj.orderType == 1">
                        <el-select v-model="form2.taskType" clearable placeholder="请选择任务类型" style="width:90%" >
                            <el-option
                                v-for="item in taskTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站采集类型" prop="allSpiderType" style="width:48%">
                        <el-select v-model="form2.allSpiderType" clearable placeholder="请选择全站采集类型" style="width:90%">
                            <el-option
                                v-for="item in allSpiderTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="附件类型" prop="downloadType" style="width:100%">
                        <el-checkbox-group v-model="form2.downloadType" @change="handleCheckedCitiesChange" >
                            <el-checkbox v-for="(item,index) in downloadTypeDate" :label="item.value" :key="item.value" :disabled='item.value == 2' >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item> -->
                    <el-form-item label="站点范围" prop="rangeType" style="width:100%;marginTop:-10px">
                        <el-radio-group v-model="form2.rangeType" @change="rangeTypeChange2" >
                            <el-radio v-for="item in rangeTypeDate" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="站点范围选择" prop="siteCodes" style="width:100%;marginTop:-10px" v-if="getListzdS2" >
                        <div style="width:90%;textAlign:center" v-if="inspSiteTreeList2.length==0">暂无数据</div>
                        <el-tree
                        ref="tree2" 
                        node-key="siteCode"
                        :props="inspSiteTreeList2"
                        :load="loadNode2"
                        lazy
                        show-checkbox
                        v-if="inspSiteTreeList2.length>0"
                        >
                        </el-tree>
                    </el-form-item> -->
                     
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 自定义单位 -->
        <el-dialog width="1000px" title="自定义单位" :visible.sync="open3" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel3" class="zdyBox">
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
                        <el-checkbox-group v-model="form2.siteCodes" @change="handleCheckedCitiesChange" size="mini" v-if="cities.length > 0">
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
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="cancel3">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspOrderInfo,
    getInspOrderInfo,
    delInspOrderInfo,
    addInspOrderInfo,
    updateInspOrderInfo
} from "@/api/biz/inspOrderInfo";
import { addInspOrderBatch,selectInspSiteTreeOrderSiteList } from "@/api/biz/inspOrderBatch";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import {
    siteInfoExist
} from "@/api/biz/inspChannel";
import {
    getOrganizationUnit,
    getUnit,
} from "@/api/warn/index";
export default {
    name: "InspOrderInfo",
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
            // 订单信息表格数据
            inspOrderInfoList: [],
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
                orderName: null,
                startDate: null,
                endDate: null,
                serviceTotalNum: null,
                serviceUseNum: null,
                moneyVal: null,
                orderState: null,
                ownerName: null,
                formalState: null
            },
            // 表单参数
            form: {
                orderServeArry: [2]
            },
            // 表单校验
            rules: {
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur' },
                    { validator: this.validateSiteCode, trigger: 'blur' }
                ],
                orderName: [{ required: true, message: '请输入订单名称', trigger: 'blur' }],
                startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
                serviceTotalNum: [{ required: true, message: '请输入报告次数', trigger: 'blur' }],
                rangeType: [{ required: true, message: '请选择站点范围', trigger: 'change' }],
                orderType: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
                orderServeArry: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
                formalState: [{ required: true, message: '请选择是否正式订单', trigger: 'change' }],


            },
            /**下拉数据 */
            orderStateDate: [ // 订单状态
                // 1未生效 2生效中 3已到期
                { label: '未生效', value: 1 },
                { label: '生效中', value: 2 },
                { label: '已到期', value: 3 },
            ],
            siteCodeS: true, // 网站标识码是否允许修改
            dateS: false,

            siteCodeType: false, // 网站标识码是否存在

            orderTypeS: false,


            

            /**批次 */
             // 表单参数
            form2: {
                // downloadType: [2],
            },
            // 表单校验
            rules2: {
                orderInfoId: [
                    { required: true, message: '请选择订单', trigger: 'change' },
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
                allSpiderType: [{ required: true, message: '请选择采集类型', trigger: 'change' }],
                // siteCodes: [{ required: true, message: '请选择自定义站点范围', trigger: 'change' }],
                

            },
            open2: null,
            title2: '添加订单批次',
            /**下拉框数据 */
            taskTypeDate: [ // 任务类型
                {label: '全站', value: 1},
                {label: '抽查', value: 2},
            ],
            allSpiderTypeDate: [ // 全站采集类型
                { label: '本地采集', value: 0 },
                // { label: '接口采集', value: 1 },
            ],
            downloadTypeDate: [ // 下载附件类型
                {label: '图片', value: 1},
                {label: '页面(必选)', value: 2},
                {label: '附件', value: 3},
                {label: 'JS', value: 4},
                {label: 'CSS', value: 5},
                {label: '视频', value: 6},
                {label: '音频', value: 7},
                // {label: '未知地址', value: 8},
            ],
            rangeTypeDate: [ // 站点范围
                {label: '全部子级', value: 1},
                {label: '本级填报单位', value: 2},
                {label: '自定义选择', value: 3},
            ],
            orderInfoDate: [], // 订单
            inspSiteTreeList: [], // 站点范围选择
            inspSiteTreeList2: [], // 站点范围选择
            pcObj: {},

            getListzdS: false,
            getListzdS2: false,
            
            disabledS: false, // 批次状态
            orderStateS: false, // 订单状态 

            /**
             * 订单赋值：开始、结束时间
             * 控制开始、结束选择范围变量
             */
            startDate2: null,  
            endDate2: null,

            orderBatchInfo: {},

            rangeTypeDate: [ // 站点范围
                {label: '全部子级', value: 1},
                {label: '本级填报单位', value: 2},
                {label: '自定义选择', value: 3},
            ],
            // 订单类型
            orderTypeDate: [
                {label: '网站监测订单', value: 1},
                {label: '新媒体订单', value: 20},
                {label: '网站安全监测订单', value: 30},
                // {label: '网站安全防护订单', value: 40},
            ],

            // 订单类型
            formalStateDate: [
                { label: '正式', value: 1 },
                { label: '试用', value: 0 },
                { label: '免费', value: 3 },
            ],
            

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

            codeType: null,
            open3: false,


        };
    },
    watch: {
        'form2.siteCode'(newVal, oldVal) {
            if(oldVal && newVal !== oldVal){
                // 自定义
                this.cities = []; // 中间筛选
                this.siteNames = []; // 右侧结果
                this.form2.siteCodes = []; // 提交数据集合
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
        /** 查询订单信息列表 */
        getList() {
            this.loading = true;
            if(this.queryParams.id){
                this.queryParams.id = parseInt(this.queryParams.id);
            }
            listInspOrderInfo(this.queryParams).then(response => {
                this.inspOrderInfoList = response.rows;
                for(var i in this.inspOrderInfoList){
                    if(this.inspOrderInfoList[i].orderState == 1){
                        this.inspOrderInfoList[i].orderStateTxt = '未生效';
                    }else if(this.inspOrderInfoList[i].orderState == 2){
                        this.inspOrderInfoList[i].orderStateTxt = '生效中';
                    }else if(this.inspOrderInfoList[i].orderState == 3){
                        this.inspOrderInfoList[i].orderStateTxt = '已到期';
                    }
                    // 订单类型
                    if(this.inspOrderInfoList[i].orderType == 1){
                        this.inspOrderInfoList[i].orderTypeTxt = '网站监测订单';
                    }else if(this.inspOrderInfoList[i].orderType == 20){
                        this.inspOrderInfoList[i].orderTypeTxt = '新媒体订单';
                    }
                    else if(this.inspOrderInfoList[i].orderType == 30){
                        this.inspOrderInfoList[i].orderTypeTxt = '网站安全监测订单';                        
                    }
                    // else if(this.inspOrderInfoList[i].orderType == 40){
                    //     this.inspOrderInfoList[i].orderTypeTxt = '网站安全防护订单';                        
                    // }
                    // 是否正式订单
                    if(this.inspOrderInfoList[i].formalState == 1){
                        this.inspOrderInfoList[i].formalStateTxt = '正式';
                    }else if(this.inspOrderInfoList[i].formalState == 0){
                        this.inspOrderInfoList[i].formalStateTxt = '试用';
                    }else if(this.inspOrderInfoList[i].formalState == 3){
                        this.inspOrderInfoList[i].formalStateTxt = '免费';
                    }else{
                        this.inspOrderInfoList[i].formalStateTxt = '--';
                    }
                }
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                siteCode: null,
                orderName: null,
                startDate: null,
                endDate: null,
                serviceTotalNum: 1,
                serviceUseNum: null,
                moneyVal: null,
                orderState: null,
                ownerName: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                orderType: null,
                siteCodes: null,
                orderServeArry: [2,4,5],
                formalState: 1
            };
            this.resetForm("form");
            this.siteCodeS = true;
            this.dateS = false;
            this.siteCodeType = false;

            this.orderTypeS = false;

            this.getListzdS = false;
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
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加订单信息";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.siteCodeS = true;
            this.orderTypeS = true;
            const id = row.id || this.ids;
            getInspOrderInfo({id: id}).then(response => {
                this.form = response.data;
                this.form.orderServeArry = [];
                for(var i in this.form.inspOrderServes){
                    this.form.orderServeArry.push(this.form.inspOrderServes[i].serveVal)
                }
                // this.form.orderServeArry = this.form.inspOrderServes;
                // this.form.orderServeArry = this.form.inspOrderServes.split(',');
                // this.form.orderServeArry = this.form.orderServeArry.map(item => parseInt(item, 10));
                this.open = true;
                this.title = "修改订单信息";
                if(this.form.orderState == 1){
                    this.dateS = true;
                }else{
                    this.dateS = false;
                }
            });
            this.siteCodeType = true; // 修改时其他字段可操作
            // this.dateS = false;

        },
        /** 提交按钮 */
        submitForm() {
            if(this.siteCodeType == false){
                this.orderName = null;
                this.startDate = null;
                this.endDate = null;
                this.serviceTotalNum = 1;
            }else{
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        // this.form.orderServeArry = this.form.orderServeArry.join(',');
                        if(this.form.rangeType == 3 && this.getListzdS == true){
                            this.form.siteCodes = this.$refs.tree.getCheckedKeys()
                        }
                        // 订单类型为网站安全监测
                        // if(this.form.orderType == 3){
                        //     this.form.orderServeArry = [];
                        // }
                        // console.log(this.form)
                        if (this.form.id != null) {
                            updateInspOrderInfo(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addInspOrderInfo(this.form).then(response => {
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            });
                        }
                    }
                });
            }
            
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除订单名称为"' + row.orderName + '"的数据项？')
                    .then(function() {
                        return delInspOrderInfo({ids:[ids]});
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
                        return delInspOrderInfo({ids:ids});
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
            let fileName = '订单信息数据'
            this.download(
                "biz/inspOrderInfo/export",this.queryParams,
                `${fileName}.xlsx`
            ).then((res)=>{
                
            });
        },
        // 开始时间不能大于结束时间
        pickerOptionsStart(){
            if(Date.parse(this.form.startDate) > Date.parse(this.form.endDate) ) {
                this.form.startDate = '';
                this.$modal.msgWarning("开始时间不能大于结束时间");
            }
        },
        // 结束时间不能小于开始时间
        pickerOptionsEnd(){
            if(Date.parse(this.form.endDate)<= Date.parse(this.form.startDate) ) {
                this.form.endDate = '';
                this.$modal.msgWarning("结束时间不能小于开始时间");
            }
        },
        // 网站标识码校验
        validateSiteCode(rule, value, callback){
            console.log(this.form.orderType)
            let codeTypeIn = null;
            if(this.form.orderType == 1){
                codeTypeIn = [0,1]
            }else if(this.form.orderType == 20){
                codeTypeIn = null
            }
            let date = {
                siteCode: value,
                siteType: null,
                codeTypeIn: codeTypeIn,
            }
            siteInfoExist(date).then((res)=>{
                this.siteCodeType = res.data.exist;
                console.log(this.siteCodeType,'this.siteCodeType')
                if(this.siteCodeType == false){
                    callback(new Error('网站标识不存在，请重新输入'));
                }else{
                    this.dateS = true;
                    if(this.form.orderType == 1){ // 网站监测
                        this.form.orderName = res.data.info.siteName + '网站监测订单';
                    }else if(this.form.orderType == 20){ // 新媒体
                        this.form.orderName = res.data.info.siteName + '新媒体订单';
                    }else if(this.form.orderType == 30){ // 网站安全监测
                        this.form.orderName = res.data.info.siteName + '网站安全监测订单';
                    }
                    callback();
                }
            })
        },


        /**添加批次 */
        /**下拉、单选、多选事件 */
        // 站点范围
        rangeTypeChange(val){
            console.log(val)
            if(val == 3){
                this.getListzdS = true;
                this.getListzd(this.form.siteCode); // 站点范围
            }else{
                this.getListzdS = false;
                this.inspSiteTreeList = [];
            }
        },
        loadNode(node, resolve) {
            console.log(node,'node')
            console.log(resolve,'resolve')
            if (node.level === 0) {
                return resolve(this.inspSiteTreeList)
            }

            setTimeout(() => {
                let data = [];
                console.log(node.data.siteCode,'node.data.sitCode')
                let date = {parentSite: node.data.siteCode}
                listInspSiteTree(date).then(response => {
                    let data = [];
                    data = response.data;
                    for (var i in data) {
                        data[i].label = data[i].unitName+'-'+data[i].siteCode;
                    }
                    resolve(data);
                    
                });
                
            }, 1000);
        },
        // 订单二次校验
        validateOrderInfoId(rule, value, callback){
            if(this.orderStateS == true){
                 callback(new Error('该订单已过期，请重新选择'));
            }else{
                 callback();
            }
        },
        // 站点范围选择
        getListzd(parentSite) {
            // this.loading = true;
            let codeTypeIn = null;
            if(this.form.orderType == 1){
                codeTypeIn = [0,1]
            }else if(this.form.orderType == 20){
                codeTypeIn = null
            }
            let date = {
                parentSite: parentSite,
                codeTypeIn: codeTypeIn
            }
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = response.data;
                // this.loading = false;
                for (var i in this.inspSiteTreeList) {
                    this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName+'-'+this.inspSiteTreeList[i].siteCode;
                }
            });
        },
        // 开始时间不能大于结束时间
        pickerOptionsStart2(){
            // 结束时间=开始时间延后30天
            if(this.form2.startDate){
                this.form2.endDate = this.addDate(this.form2.startDate,30)
            }else{
                this.form2.endDate = null;
            }
            if(Date.parse(this.form2.startDate) > Date.parse(this.form2.endDate)) {
                this.form2.startDate = '';
                this.$modal.msgWarning("开始时间不能大于结束时间");
            }
            if(Date.parse(this.form2.startDate) < Date.parse(this.startDate2)) {
                this.form2.startDate = this.startDate2;
                this.$modal.msgWarning("开始时间不能小于订单开始时间");
            }
        },
        // 结束时间不能小于开始时间
        pickerOptionsEnd2(){
            if(Date.parse(this.form2.endDate)<= Date.parse(this.form2.startDate)) {
                // this.form2.endDate = '';
                this.form2.endDate = this.addDate(this.form2.startDate,30)
                this.$modal.msgWarning("结束时间不能小于开始时间");
            }
            if(Date.parse(this.form2.endDate) > Date.parse(this.endDate2)) {
                this.form2.endDate = this.endDate2;
                this.$modal.msgWarning("结束时间不能大于订单结束时间");
            }
        },
        /** 提交按钮 */
        submitForm2() {
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    // this.form2.downloadType = this.form2.downloadType.join(',');
                    if(this.form2.siteCodes.length == 0){
                        this.form2.siteCodes = null;
                    }
                    console.log(this.form2,'addDate')
                    if (this.form2.id != null) {
                        updateInspOrderBatch(this.form2).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open2 = false;
                            this.getList();        
                        });
                    } else {
                        addInspOrderBatch(this.form2).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open2 = false;
                            this.getList();          
                        });
                    }
                }
            });
        },
        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.reset2();
            this.getList();
        },
        // 表单重置
        reset2() {
            // if(this.form.rangeType == 3 && this.form2.siteCodes != null){
            //     this.$refs.tree.setCheckedKeys([]);                
            // }
            this.form2 = {
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
            this.resetForm("form2");
            this.getListzdS2 = false;
            this.disabledS = false;
            this.orderStateS = false;
            this.orderInfoDate = [];

            this.cities = [];
            this.siteNames = [];  
            this.checkAll = false;

            
            // this.$refs.tree.setCheckedKeys([]);
        },
        // 添加批次
        addOrderBatch(row){
            console.log(row,'row')
            this.reset2();
            this.open2 = true;
            this.orderBatchInfo.orderName = row.orderName;
            this.form2.orderInfoId = row.id;
            this.form2.siteCode = row.siteCode;
            if(row.orderType == 1){
                this.codeType = 1;
            }else if(row.orderType == 20){
                this.codeType = 2;  
            }
            let datacodeTypeIn = [];
            this.pcObj = row;
            // let data = {
            //     parentSite: this.form2.siteCode,
            //     codeType: row.siteType,
            //     orderInfoId: row.id
            // }
            // this.getListzd2(data)
            
        },
        // 站点范围
        rangeTypeChange2(val){
            console.log(val)
            if(val == 3){
                this.open3 = true;
                this.getListzd2(this.form2.siteCode); // 站点范围
            }else{
                this.open3 = false;
                this.inspSiteTreeList2 = [];
            }
        },
        loadNode2(node, resolve) {
            console.log(node,'node')
            console.log(resolve,'resolve')
            if (node.level === 0) {
                return resolve(this.inspSiteTreeList2)
            }

            setTimeout(() => {
                let data = [];
                console.log(node.data.siteCode,'node.data.sitCode')
                let date = {
                    parentSite: node.data.siteCode,
                    // codeType: this.pcObj.siteType,
                    orderInfoId: this.pcObj.id
                }
                selectInspSiteTreeOrderSiteList(date).then(response => {
                    let data = [];
                    data = response.data;
                    for (var i in data) {
                        data[i].label = data[i].unitName+'-'+data[i].siteCode;
                    }
                    resolve(data);
                    
                });
                
            }, 1000);
        },
        // 订单类型事件
        orderChange(){
            this.form.orderName = null;
            if(this.form.orderType == null || this.form.orderType == '' || this.form.orderType == undefined){
                this.siteCodeS = true;
                
            }else{
                this.siteCodeS = false;
                // if(this.form.siteCode != null){
                //     if(this.form.orderType == 1){ // 网站监测
                //         this.form.orderName = res.data.info.siteName + '网站监测订单';
                //     }else if(this.form.orderType == 20){ // 新媒体
                //         this.form.orderName = res.data.info.siteName + '新媒体订单';
                //     }else if(this.form.orderType == 30){ // 网站安全监测
                //         this.form.orderName = res.data.info.siteName + '网站安全监测订单';
                //     }
                // }
            }
        },
        // 站点范围
        orderInfo(row){
            sessionStorage.setItem('orderInfo', row.id);
            this.$router.push({ name: 'orderInfo' })
        },



        /**自定义站点 */
        // 站点范围选择
        getListzd2(parentSite) {
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
                // this.form2.siteCodes = [];
            }
            this.siteCodesAll = [...new Set(this.siteCodesAll)];
            if(this.siteCodesAll.length == 0){
                this.siteNames = [];
                this.form2.siteCodes = [];
            }
            if(this.switchS == false){
                getUnit({siteCodes: this.siteCodesAll,codeType: this.codeType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    console.log(this.cities,'asd')
                    // this.form2.siteCodes = [];
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
                    this.form2.siteCodes = [];
                }
                getUnit({siteCodes: this.siteCodesAll,codeType: this.codeType}).then((res)=>{
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
                    this.form2.siteCodes = [];
                }
                this.$nextTick(() => {
                    this.updateChildrenChecked(data, checked);
                    this.syncTreeCheckedState(2);
                    getUnit({siteCodes: this.siteCodesAll,codeType: this.codeType}).then((res)=>{
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
            this.form2.siteCodes = val ? this.cities : [];
            this.form2.siteCodes = this.checkAll ? this.cities.map(item => item.siteCode) : [];
            this.isIndeterminate = false;

            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form2.siteCodes){
                    if(this.form2.siteCodes[j] == this.cities[i].siteCode){
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
                for(var j in this.form2.siteCodes){
                    if(this.form2.siteCodes[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        // 确定
        submitForm3(){
            this.open3 = false;
            console.log(this.form2.siteCodes,'this.form2.siteCodes')
            // this.yxxNum = this.form2.siteCodes.length;
        },
        // 取消
        cancel3(){
            this.open3 = false;
            // this.yxxNum = this.form2.siteCodes.length;
            
            // if(this.form2.siteCodes.length == 0){
            //     this.form2.siteCodes = [];
            // }
        },
        // 清空树搜索条件
        clearSearch(){
            getUnit({siteCodes: this.siteCodesAll,name: null,codeType: this.codeType}).then((res)=>{
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
            getUnit({siteCodes: this.siteCodesAll,name: this.tbSiteCode,codeType: this.codeType}).then((res)=>{
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
                if(item.siteCode == this.form2.siteCodes[i]){
                    this.form2.siteCodes.splice(i,1)
                }
            }
            this.isIndeterminate = this.form2.siteCodes.length > 0 && this.form2.siteCodes.length < this.cities.length;
        },
        // 全部删除
        clearSiteNames(){
            this.form2.siteCodes = [];
            this.siteNames = [];
            this.isIndeterminate = this.form2.siteCodes.length > 0 && this.form2.siteCodes.length < this.cities.length;
            this.checkAll = false;
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
