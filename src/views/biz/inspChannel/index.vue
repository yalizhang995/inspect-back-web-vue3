<template>
    <div class="app-container">
        <div class="div">
             <div class="divBox" :style="{width: widthClass, paddingRight: paddingClass}">
                 <div class="divLeft" v-if="jtShowS" :style="{height: treeHeight}">
                    <!-- <el-input placeholder="输入网站标识码" v-model="filterText" size="mini" style="marginBottom: 10px"></el-input> -->
                    <div class="treeSearch">
                        <el-input placeholder="组织单位标识码/网站名称" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                        </el-input>
                    </div>
                    <div class="treeDiv">
                        <!-- <el-tree
                            ref="tree" 
                            node-key="id"
                            :props="inspSiteTreeList"
                            :load="loadNode"
                            lazy
                            show-checkbox
                            :check-strictly="true"
                            @check-change="handleNodeClick"
                            v-if="inspSiteTreeList.length"
                            :render-content="renderContent"
                            > -->
                            <el-tree
                                ref="tree" 
                                node-key="id"
                                :props="inspSiteTreeList"
                                :load="loadNode"
                                lazy
                                :expand-on-click-node="false"
                                @node-click="handleNodeClick"
                                v-if="inspSiteTreeList.length"
                                :highlight-current="highlightBd"
                            >
                                <el-tooltip :disabled="showTitle"  effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                    <span class="span-ellipsis"  @mouseover="onShowNameTipsMouseenter">{{ node.label }}</span>
                                </el-tooltip>
                            </el-tree>
                    </div>
                </div>
                <div class="jt"><span class="spspspsp"><i :class='jtIco' @click="jtChange" ></i></span></div>
            </div>
            <div class="divRight" :style="{width: widthClassR}">
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
                    <el-form-item label="网站名称" prop="siteNameLike">
                        <el-input
                            v-model="queryParams.siteNameLike"
                            placeholder="请输入网站名称"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="栏目名称" prop="channelName">
                        <el-input
                            v-model="queryParams.channelName"
                            placeholder="请输入栏目名称"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <!-- <el-form-item label="栏目分类" prop="channelTypePid">
                        <el-select v-model="queryParams.channelTypePid" @change="channelTypeFn" filterable clearable placeholder="请选择父级栏目分类">
                            <el-option
                            v-for="item in channelTypeDate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="channelTypeId">
                        <el-select v-model="queryParams.channelTypeId" filterable clearable placeholder="请选择子级栏目分类">
                            <el-option
                            v-for="item in channelTypeChildrenDate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="栏目分类" prop="">
                        <el-cascader
                            v-model="channelTypeArr"
                            :options="channelTypeDate"
                            :props="{ checkStrictly: true }"
                            clearable></el-cascader>
                    </el-form-item>
                    <el-form-item label="是否开启" prop="enabled">
                        <el-select v-model="queryParams.enabled" filterable clearable placeholder="请选择是否开启">
                            <el-option
                            v-for="item in enabledList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否渲染" prop="renderFlag">
                        <el-select v-model="queryParams.renderFlag" filterable clearable placeholder="请选择是否渲染">
                            <el-option
                            v-for="item in renderFlagList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否监测" prop="scanUpdateState">
                        <el-select v-model="queryParams.scanUpdateState" filterable clearable placeholder="请选择是否监测">
                            <el-option
                            v-for="item in scanUpdateStateList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="栏目Hash" prop="channelUrlHash">
                        <el-input
                            v-model="queryParams.channelUrlHash"
                            placeholder="请输入栏目Hash"
                            clearable
                            style="width:466px;"
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
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['biz:inspChannel:add']"
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
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile" >栏目导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                    </el-col>
                    
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    height="58vh"
                    v-loading="loading"
                    :data="inspChannelList"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <!-- <el-table-column label="主键ID" align="center" prop="id" /> -->
                    <el-table-column label="网站标识码" prop="siteCode" width="120" fixed />
                    <el-table-column label="网站名称" prop="siteName" show-overflow-tooltip width="200" fixed />
                    <el-table-column label="栏目名称" prop="channelName"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.channelNewUrl)">{{scope.row.channelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="栏目地址" prop="channelUrl" show-overflow-tooltip width="400">
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.channelUrl)"><span style="color:#606266">栏目地址：</span >{{scope.row.channelUrl}}</span><br/>
                            <span class="dz" @click="dzChange(scope.row.channelJumpUrl)" v-if="scope.row.channelJumpUrl"><span style="color:#606266">跳转地址：</span >{{scope.row.channelJumpUrl}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" content="点此复制栏目Hash" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column label="栏目分类" prop="channelTypeIdTxt" width="160" show-overflow-tooltip />
                     
                    
                    <!-- <el-table-column label="栏目地址" prop="channelUrl">
                        <template slot-scope="scope">
                            <el-tooltip  placement="top">
                                <div slot="content">
                                    {{scope.row.channelUrl}}
                                </div>
                                <span class="sxw"  @click="dzChange(scope.row.channelUrl)">{{scope.row.channelUrl}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>    -->
                    <el-table-column label="任务ID" prop="columnId" width="210" show-overflow-tooltip />
                    <el-table-column label="自定义天数" align="center" prop="customWarnDay" width="100" />
                    <el-table-column label="连通频率" align="center" prop="connectInterval" width="80" />
                    <el-table-column label="采集频率" align="center" prop="updateInterval" width="80" />
                    <el-table-column label="是否渲染" align="center" prop="renderFlagTxt" width="140" />
                    <el-table-column label="创建时间" align="" prop="createTime" width="160" />
                    <el-table-column label="创建人" align="" prop="createBy" width="140" show-overflow-tooltip/>
                    <el-table-column label="修改时间" align="" prop="updateTime" width="160" />
                    <el-table-column label="修改人" align="" prop="updateBy" width="140" show-overflow-tooltip/>
                    <el-table-column label="是否开启" align="center" prop="enabled" width="80" fixed='right'>
                        <template slot-scope="scope">
                            <el-switch
                            v-model="scope.row.enabled"
                            active-color="#13ce66"
                            @change="enabledChange(scope.row)"
                            inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed='right'>
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['biz:inspChannel:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:inspChannel:remove']"
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
            </div>
        </div>

        <!-- 添加或修改栏目信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <div class="box">
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <el-tooltip class="item" effect="dark" content="失去焦点会重新校验网站标识码是否存在" placement="top-start">
                            <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width:90%" clearable :disabled="siteCodeS" />
                        </el-tooltip>
                        <!-- <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width:90%" clearable :disabled="siteCodeS" /> -->
                    </el-form-item>
                    <el-form-item label="栏目名称" prop="channelName" style="width:93.6%">
                        <el-input v-model="form.channelName" placeholder="请输入栏目名称"  clearable :disabled="!siteCodeType"  />
                    </el-form-item>
                    <el-form-item label="栏目地址" prop="channelUrl" style="width:93.6%;position:relative;">
                        <!-- <el-input v-model="form.channelUrl" placeholder="请输入栏目地址" clearable :disabled="siteCodeS"  /> -->
                        <el-input v-model.trim="form.channelUrl" placeholder="请输入栏目地址" clearable  style="width:90%;" @clear="clearType(1)" :disabled="title == '修改栏目信息'" />
                        <span style="display:block;position:absolute;top:30px;left:1px;fontSize:12px;" v-if="channelUrlTxt">连通情况：<span :style="{color: channelUrlTxtColor}">{{channelUrlTxt}}</span></span>
                        <el-button type="primary" size="small" style="marginLeft: 3px;" :disabled="!form.channelUrl || title == '修改栏目信息'" @click="channelUrlBlur(1)">检测</el-button>
                    </el-form-item>
                    <el-form-item label="栏目跳转地址" prop="channelJumpUrl" style="width:93.6%">
                        <!-- <el-input v-model="form.channelJumpUrl" placeholder="请输入栏目跳转地址" clearable :disabled="siteCodeS"  /> -->
                        <el-input v-model.trim="form.channelJumpUrl" placeholder="请输入栏目跳转地址" clearable  style="width:90%;" @clear="clearType(2)" :disabled="title == '修改栏目信息'"/>
                        <span style="display:block;position:absolute;top:30px;left:1px;fontSize:12px;" v-if="channelJumpUrlTxt">连通情况：<span :style="{color: channelJumpUrlTxtColor}">{{channelJumpUrlTxt}}</span></span>
                        <el-button type="primary" size="small" style="marginLeft: 3px;" :disabled="!form.channelJumpUrl || title == '修改栏目信息'" @click="channelUrlBlur(2)">检测</el-button>
                    </el-form-item>
                    <el-form-item label="栏目分类" prop="channelTypeId" style="width:93.6%">
                        <!-- <el-input v-model="form.channelTypeId" placeholder="请输入栏目分类" /> -->
                         <el-cascader
                            v-model="form.channelTypeId"
                            placeholder="请选择栏目分类"
                            :options="channelTypeDate"
                            @change="channelTypeChange"
                            clearable
                            :disabled="!siteCodeType"
                            filterable clearable style="width:100%"
                            :props="{ expandTrigger: 'hover' }"
                            >
                            
                        </el-cascader>
                    </el-form-item>
                    
                    <el-form-item label="连通性频率" prop="connectInterval" style="width:48%">
                        <!-- <el-input v-model="form.connectInterval" placeholder="请输入连通性频率单位:分，默认60分" /> -->
                        <!-- <el-input-number v-model="form.connectInterval" controls-position="right" :min="5" :max="1440" style="width:77%" :disabled="!siteCodeType"></el-input-number> -->
                        <el-select v-model="form.connectInterval" clearable placeholder="请选择连通性频率" style="width: 77%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in connectIntervalList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="采集频率" prop="updateInterval" style="width:48%;marginLeft:1%">
                        <!-- <el-input v-model="form.updateInterval" placeholder="请输入采集频率单位:分，默认60分" /> -->
                        <!-- <el-input-number v-model="form.updateInterval" controls-position="right" :min="5" :max="1440" style="width:77%" :disabled="!siteCodeType"></el-input-number> -->
                        <el-select v-model="form.updateInterval" clearable placeholder="请选择采集频率" style="width: 77%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in updateIntervalList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="自定义天数" prop="customWarnDay" style="width:48%" >
                        <!-- <el-input v-model="form.customWarnDay" placeholder="请输入自定义天数" style="width:90%"  /> -->
                        <el-input-number v-model="form.customWarnDay" controls-position="right" :min="0" :max="customWarnDayMax" style="width:77%" :disabled="customWarnDayMaxS"></el-input-number>
                        <span>（天）</span>
                    </el-form-item>
                    <el-form-item label="是否渲染" prop="renderFlag" style="width:48%;marginLeft:1%" >
                        <el-select v-model="form.renderFlag" clearable placeholder="请选择是否渲染" style="width: 90%">
                            <el-option
                                v-for="item in renderFlagList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否开启" prop="enabled" style="width:48%">
                        <el-switch
                        v-model="form.enabled"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        >
                        </el-switch>
                    </el-form-item>
                    
                    
                    <el-form-item label="备注" prop="remark" style="width:97%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" style="width:96%" clearable  />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 模板上传 -->
        <el-dialog :title="title6" :visible.sync="open6" width="520px" append-to-body>
            <el-form ref="form6" :model="form6" label-width="60px">
                <el-form-item label="" prop="">
                    <el-upload
                        class="upload-demo"
                        drag
                        :action="upurl"
                        :limit="1"
                        :auto-upload="false"
                        :show-file-list="true"
                        :on-remove="handleRemove"
                        :on-change="imgchange"
                        :file-list="fileList"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>
                <el-form-item label="" prop="">
                    <el-button type="primary" plain icon="el-icon-bottom" size="mini" @click="handleDown('wps')" >模板(wps版)</el-button>
                    <el-button type="primary" plain icon="el-icon-bottom" size="mini" @click="handleDown('office')" >模板(office版)</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm6">确 定</el-button>
                <el-button @click="cancel6">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspChannel,
    getInspChannel,
    delInspChannel,
    addInspChannel,
    updateInspChannel,
    siteInfoExist,
    editEnabled,
    getCode
} from "@/api/biz/inspChannel";
import { listInspChannelType, } from "@/api/biz/inspChannelType";
import { inspImportdataTask, } from "@/api/biz/wrongWords";
import global_ from '@/utils/Global';



import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";

export default {
    name: "InspChannel",
    
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
            // 栏目信息表格数据
            inspChannelList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                channelName: null,
                channelUrl: null,
                channelUrlHash: null,
                channelTypeId: null,
                channelTypePid: null,
                customWarnDay: null,
                enabled: null,          
                orderTypes: [{ code: 1, name: 'create_time' }], // 表格排序
                ancestorsFind: null,
                siteNameLike: null,
                channelUrlHash: null,
                renderFlag: null,
                // connectInterval: 60,
                // updateInterval: 60
            },
            channelTypeArr: null,
            queryParams2: {
                pid: null,
                channelTypeName: null,
                warnRule: null,
                warnDay: null,
                orderNum: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur' },
                    { min: 10, max: 10, message: '请填写正确的10位填报单位网站标识码', trigger: 'blur' },
                    { validator: this.validateSiteCode, trigger: 'blur' }
                ],
                channelName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
                channelUrl: [
                    { required: true, message: '请输入栏目地址', trigger: 'blur' },
                    // { pattern: global_.strRegex, message: '请输入正确栏目url地址', trigger: 'blur' },
                    { validator: this.validateChannelUrl, trigger: 'blur' }
                ],
                channelJumpUrl: [
                    { required: false, message: '请输入栏目跳转地址', trigger: 'blur' },
                    // { pattern: global_.strRegex, message: '请输入正确栏目url跳转地址', trigger: 'blur' },
                    { validator: this.validateChannelUrl2, trigger: 'blur' }
                ],
                
                channelTypeId: [{ required: true, message: '请选择栏目分类', trigger: 'change' }],
                customWarnDay: [{ required: true, message: '请输入自定义天数', trigger: 'blur' }],
                connectInterval: [{ required: true, message: '请输入连通性频率', trigger: 'blur' }],
                updateInterval: [{ required: true, message: '请输入采集频率', trigger: 'blur' }],
                enabled: [{ required: true, message: '请选择是否开启监测', trigger: 'change' }],
                renderFlag: [{ required: true, message: '请选择是否渲染', trigger: 'change' }],
                
                
            },
            channelTypeDate: [], // 栏目分类-父级
            channelTypeChildrenDate: [], // 栏目分类-子级
            customWarnDayMax: 0,
            customWarnDayMaxS: true,

            siteCodeS: false, // 网站标识码是否允许修改
            siteCodeType: false, // 网站标识码校验是否存在

            enabledList: [
                { label: '已开启', value: 1 },
                { label: '未开启', value: 0 },
            ],
            renderFlagList: [
                { label: '不渲染', value: 0 },
                { label: '首页+栏目渲染', value: 1 },
                { label: '全站渲染', value: 2 },
                { label: '首页渲染', value: 3 },
                { label: '栏目渲染', value: 4 },
                // { label: '全站采集渲染翻页', value: 5 },
            ],
            scanUpdateStateList: [
                { label: '监测逾期', value: 1 },
                { label: '不监测逾期', value: 2 },
            ],

            // 采集频率
            updateIntervalList: [
                { label: '30', value: 30 },
                { label: '60', value: 60 },
                { label: '180', value: 180 },
                { label: '360', value: 360 },
                { label: '720', value: 720 },
            ],
            // 连通频率
            connectIntervalList: [
                { label: '30', value: 30 },
                { label: '60', value: 60 },
                { label: '180', value: 180 },
                { label: '360', value: 360 },
                { label: '720', value: 720 },
                { label: '1440', value: 1440 },
            ],

            JumpUrl: null,


            inspSiteTreeList: [], // 站点范围选择
            selectedKey: null,
            filterText: null,

            tooltipTitle: "",
            showTitle: true,
            jtShowS: true,
            jtIco: 'el-icon-d-arrow-left',
            widthClass: '15%',
            paddingClass: '10px',
            widthClassR: '84%',

            defaultProps: {
                children: "children",
                label: "label"
            },


            leftTreeHeight: 0,
            treeHeight: '0',
            highlightBd: true,

            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '导入',

            channelUrlTxt: null,
            channelUrlTxtColor: null,
            channelJumpUrlTxt: null,
            channelJumpUrlTxtColor: null,

            formObj: null,
            
        };
    },
    watch: {
        selectedKey(val){
            if(val){
                console.log(val,'ok-val')                
            }else{
                console.log('no-val')                
            }
        },

        // "form.channelUrl"(newVal,oldVal){
        //     console.log(newVal)
        //     console.log(oldVal)
        //     if(this.title == "修改栏目信息"){
        //         if(newVal != oldVal){
        //             alert('ok')
        //         }else{
        //             alert('no')
        //         }
        //     }
        // },
    },
    created() {
        this.getList();
        this.getChannelTypeDate();
        this.getListzd(0);
        this.getScreenHeight();
    },
    methods: {
        getScreenHeight(){
            this.leftTreeHeight = window.innerHeight;
            this.treeHeight = this.leftTreeHeight - 125 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
        },
        /** 查询栏目信息列表 */
        async getList() {
            this.loading = true;
            if(this.channelTypeArr){
                console.log(this.channelTypeArr)
                if(this.channelTypeArr.length == 1){
                    this.queryParams.channelTypePid = this.channelTypeArr[0];
                    this.queryParams.channelTypeId = null;                    
                }else{
                    this.queryParams.channelTypePid = this.channelTypeArr[0];
                    this.queryParams.channelTypeId = this.channelTypeArr.slice(-1)[0];
                }
                console.log(this.queryParams.channelTypePid)
                console.log(this.queryParams.channelTypeId)
            }
           await listInspChannel(this.queryParams).then(response => {
                this.inspChannelList = response.rows;
                for(var i in this.inspChannelList){
                    if(this.inspChannelList[i].inspChannelType == null){
                        this.inspChannelList[i].channelTypeIdTxt = '--';
                    }else{
                        if(this.inspChannelList[i].inspChannelType.parentTypeName == null){
                            this.inspChannelList[i].channelTypeIdTxt = '--';
                        }else{
                            this.inspChannelList[i].channelTypeIdTxt = this.inspChannelList[i].inspChannelType.parentTypeName+'/'+this.inspChannelList[i].inspChannelType.channelTypeName;
                        }
                    }
                    if(!this.inspChannelList[i].siteName){
                        this.inspChannelList[i].siteName = '--';
                    }
                    if(!this.inspChannelList[i].remark){
                        this.inspChannelList[i].remark = '--';
                    }
                    // if(this.inspChannelList[i].renderFlag == false){
                    //     this.inspChannelList[i].renderFlagTxt = '否';
                    // }else if(this.inspChannelList[i].renderFlag == true){
                    //     this.inspChannelList[i].renderFlagTxt = '是'; 
                    // }
                    if(this.inspChannelList[i].renderFlag == 0){
                        this.inspChannelList[i].renderFlagTxt = '不渲染';
                    }else if(this.inspChannelList[i].renderFlag == 1){
                        this.inspChannelList[i].renderFlagTxt = '首页+栏目渲染';
                    }else if(this.inspChannelList[i].renderFlag == 2){
                        this.inspChannelList[i].renderFlagTxt = '全站渲染';
                    }else if(this.inspChannelList[i].renderFlag == 3){
                        this.inspChannelList[i].renderFlagTxt = '首页渲染';
                    }else if(this.inspChannelList[i].renderFlag == 4){
                        this.inspChannelList[i].renderFlagTxt = '栏目渲染';
                    }
                    // else if(this.inspChannelList[i].renderFlag == 5){
                    //     this.inspChannelList[i].renderFlagTxt = '全站采集渲染翻页';
                    // }
                    // 栏目跳转地址是否存在  存在：栏目跳转地址 不存在：栏目地址
                    if(this.inspChannelList[i].channelJumpUrl == '' || this.inspChannelList[i].channelJumpUrl == null){
                        this.inspChannelList[i].channelNewUrl = this.inspChannelList[i].channelUrl;
                    }else{
                        this.inspChannelList[i].channelNewUrl = this.inspChannelList[i].channelJumpUrl;
                    }
                    // this.inspChannelList[i].connectInterval = this.inspChannelList[i].connectInterval+'min';
                    // this.inspChannelList[i].updateInterval = this.inspChannelList[i].updateInterval+'min';

                    if(this.inspChannelList[i].customWarnDay == null || this.inspChannelList[i].customWarnDay == ''){
                       this.inspChannelList[i].customWarnDay = '--' 
                    }

                    if(!this.inspChannelList[i].createTime){
                        this.inspChannelList[i].createTime = '--';
                    }
                    if(!this.inspChannelList[i].createBy){
                        this.inspChannelList[i].createBy = '--';
                    }
                    if(!this.inspChannelList[i].updateTime){
                        this.inspChannelList[i].updateTime = '--';
                    }
                    if(!this.inspChannelList[i].updateBy){
                        this.inspChannelList[i].updateBy = '--';
                    }
                }
                this.total = response.total;
                this.loading = false;
            });
        },
        // 查询下拉栏目分类id数据
        getChannelTypeDate(){
            // this.loading = true;
            listInspChannelType(this.queryParams2).then(response => {
                this.channelTypeDate = this.handleTree(
                    response.data,
                    "id",
                    "pid"
                );
                for(var i in this.channelTypeDate){
                    this.channelTypeDate[i].label = this.channelTypeDate[i].channelTypeName;
                    this.channelTypeDate[i].value = this.channelTypeDate[i].id;
                    for(var j in this.channelTypeDate[i].children){
                        this.channelTypeDate[i].children[j].label = this.channelTypeDate[i].children[j].channelTypeName + '   （' + this.channelTypeDate[i].children[j].warnDay + '天）';
                        this.channelTypeDate[i].children[j].value = this.channelTypeDate[i].children[j].id;
                    }
                }
                console.log(this.channelTypeDate)
                // this.loading = false;
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
                channelName: null,
                channelUrl: null,
                channelUrlHash: null,
                channelTypeId: null,
                channelTypePid: null,
                customWarnDay: 0,
                connectInterval: 720,
                updateInterval: 180,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                siteType: null,
                enabled: true,
                renderFlag: 0,
                channelJumpUrl: null,
            };
            this.resetForm("form");
            this.customWarnDayMax = 0;
            this.siteCodeType = false;
            this.siteCodeS = false;
            this.JumpUrl = null;

            this.channelUrlTxt = null;
            this.channelUrlTxtColor = null;
            this.channelJumpUrlTxt = null;
            this.channelJumpUrlTxtColor = null;
            this.formObj = null;
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.channelTypeArr = null;
            this.queryParams.channelTypePid = null;
            this.queryParams.channelTypeId = null;
            this.selectedKey = null;
            this.queryParams.siteCode = null;
            this.queryParams.ancestorsFind = null;
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
            this.customWarnDayMaxS = true;
            this.open = true;
            this.title = "添加栏目信息";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.customWarnDayMaxS = false;
            const id = row.id || this.ids;
            getInspChannel({id:id}).then(response => {
                this.formObj = {...response.data};
                this.form = response.data;
                this.customWarnDayMax = this.form.inspChannelType.warnDay;
                this.open = true;
                this.title = "修改栏目信息";
                this.siteCodeS = true;
                if(this.form.inspChannelType == null){
                    this.form.channelTypeId = [];
                }else{
                    if(this.form.inspChannelType.pid == null){
                        this.form.channelTypeId = [];
                    }else{
                        this.form.channelTypeId = [this.form.inspChannelType.pid,this.form.inspChannelType.id]
                    }
                }
                // 是否渲染
                // if(response.data.renderFlag == true){
                //     this.form.renderFlag = 1;
                // }else if(response.data.renderFlag == false){
                //     this.form.renderFlag = 0;
                // }

            });
            this.siteCodeType = true; // 修改时其他字段可操作
        },
        clearType(type){
            if(type == 1){ // 栏目地址
                this.form.channelUrl = null;
                this.channelUrlTxt = null;
                this.channelUrlTxtColor = null;
            }else if(type == 2){ // 栏目跳转地址
                this.form.channelJumpUrl = null;
                this.channelJumpUrlTxt = null;
                this.channelJumpUrlTxtColor = null;
            }
        },
        channelUrlBlur(type){
            console.log(this.form.channelUrl,'栏目地址')
            if(type== 1){ // 栏目地址
                if(this.form.channelUrl){
                    getCode({url: this.form.channelUrl}).then((res)=>{
                        this.channelUrlTxt = res.data.code +' '+ res.data.msg;
                        if(res.data.code == 200){
                            this.channelUrlTxtColor = '#67C23A';
                        }else{
                            this.channelUrlTxtColor = 'red';
                        }
                    })
                }
            }else if(type == 2){ // 栏目跳转地址
                if(this.form.channelJumpUrl){
                    getCode({url: this.form.channelJumpUrl}).then((res)=>{
                        this.channelJumpUrlTxt = res.data.code +' '+ res.data.msg;
                        if(res.data.code == 200){
                            this.channelJumpUrlTxtColor = '#67C23A'
                        }else{
                            this.channelJumpUrlTxtColor = 'red';
                        }
                    })
                }
            }
            
            
        },
        /** 提交按钮 */
        submitForm() {
            console.log(this.form.enabled,'enabled')
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单提交数据')
                    if(this.jumpUrl){
                        if(this.form.channelJumpUrl == this.jumpUrl){
                            this.$modal.msgWarning("栏目跳转地址不可与首页地址相同，请重新输入");
                            this.form.channelJumpUrl = null;
                        }else{
                            if (this.form.id != null) {
                                if(this.form.channelTypeId.length == 2){
                                    this.form.channelTypeId = this.form.channelTypeId.slice(-1)[0];
                                }
                                if(this.form.enabled == true){
                                    this.form.enabled = 1;
                                }else if(this.form.enabled == false){
                                    this.form.enabled = 0;
                                }
                                updateInspChannel(this.form).then(response => {
                                    this.$modal.msgSuccess("修改成功");
                                    this.open = false;
                                    this.getList();
                                });
                                
                            } else {
                                console.log(this.form,'aaa')
                                
                                if(this.channelUrlTxt == null){
                                    this.$modal.msgWarning("请先检测栏目地址");
                                    console.log(this.form,'表单提交数据2')
                                }else if(this.form.channelJumpUrl != null && this.channelJumpUrlTxt == null){
                                    this.$modal.msgWarning("请先检测栏目跳转地址");
                                }else{
                                    this.form.channelTypeId = this.form.channelTypeId.slice(-1)[0];
                                    if(this.form.enabled == true){
                                        this.form.enabled = 1;
                                    }else if(this.form.enabled == false){
                                        this.form.enabled = 0;
                                    }
                                    addInspChannel(this.form).then(response => {
                                        this.$modal.msgSuccess("新增成功");
                                        this.open = false;
                                        this.getList();
                                    });
                                }
                                
                            }
                        }
                    }else{
                        if (this.form.id != null) {
                            if(this.form.channelTypeId.length == 2){
                                this.form.channelTypeId = this.form.channelTypeId.slice(-1)[0];
                            }
                            if(this.form.enabled == true){
                                this.form.enabled = 1;
                            }else if(this.form.enabled == false){
                                this.form.enabled = 0;
                            }
                            updateInspChannel(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            console.log(this.form,'aaa')
                            if(this.channelUrlTxt == null){
                                this.$modal.msgWarning("请先检测栏目地址");
                                console.log(this.form,'表单提交数据2')
                            }else if(this.form.channelJumpUrl != null && this.channelJumpUrlTxt == null){
                                this.$modal.msgWarning("请先检测栏目跳转地址");
                            }else{
                                this.form.channelTypeId = this.form.channelTypeId.slice(-1)[0];
                                if(this.form.enabled == true){
                                    this.form.enabled = 1;
                                }else if(this.form.enabled == false){
                                    this.form.enabled = 0;
                                }
                                addInspChannel(this.form).then(response => {
                                    this.$modal.msgSuccess("新增成功");
                                    this.open = false;
                                    this.getList();
                                });
                            }
                        }
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
                    .confirm('是否确认删除栏目名称为"' + row.channelName + '"的数据项？')
                    .then(function() {
                        return delInspChannel({ids:[ids]});
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
                        return delInspChannel({ids:ids});
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
                "biz/inspChannel/export",
                {
                    ...this.queryParams
                },
                `inspChannel_${new Date().getTime()}.xlsx`
            );
        },
        /**新增、编辑 */
        // 栏目分类事件
        channelTypeChange(val){
            console.log(val)
            let one = val[0]-1;
            let two = val.slice(-1)[0]
            if(two){
                this.customWarnDayMaxS = false;
                for(var i in this.channelTypeDate[one].children){
                    if(two == this.channelTypeDate[one].children[i].id){
                        this.form.customWarnDay = this.channelTypeDate[one].children[i].warnDay;
                        this.customWarnDayMax = this.channelTypeDate[one].children[i].warnDay;
                    }
                }
            }else{
                this.customWarnDayMaxS = true;
                this.form.customWarnDay = 0;
                this.customWarnDayMax = 0;
            }
        },
        /**查询 */
        // 栏目分类-父级
        channelTypeFn(val){
            console.log(val,'val')
            if(!val){
                this.channelTypeChildrenDate = [];
            }else{
                
            }
            this.queryParams.channelTypeId = null;
            for(var i in this.channelTypeDate){
                if(val == this.channelTypeDate[i].id){
                    this.channelTypeChildrenDate = this.channelTypeDate[i].children;
                }
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
                    // this.form.channelName = null;
                    // this.form.channelUrl = null;
                    // this.form.channelTypeId = null;
                    // this.form.customWarnDay = 0;
                    // this.form.connectInterval = 720;
                    // this.form.updateInterval = 180;
                    // this.customWarnDayMaxS = true;
                    // this.channelJumpUrl = null;
                    // if(res.data.info.siteType == 2){
                    //     this.form.siteType = 2;
                    // }else{
                    //     this.form.siteType = null;
                    // }
                    console.log(res.data.info.jumpUrl,'res.data.jumpUrl')
                    this.JumpUrl = res.data.info.jumpUrl;
                    console.log(this.JumpUrl,'JumpUrl')
                    callback();
                    

                }
            })
        },
        // 栏目地址校验
        validateChannelUrl(rule, value, callback){
            if(this.JumpUrl == value){
                callback(new Error('栏目地址不可与首页地址相同，请重新输入'));
            }else{
                callback();
            }
        },
        // 栏目跳转地址校验
        validateChannelUrl2(rule, value, callback){
            console.log(this.JumpUrl,'this.JumpUrl')
            console.log(value,'value')
            if(value && this.JumpUrl!='' && this.JumpUrl !=null && this.JumpUrl){
                if(this.JumpUrl === value){
                    callback(new Error('栏目跳转地址不可与首页地址相同，请重新输入'));
                }else{
                    callback();
                }
            }else{
                callback();
            }
            
        },
        // channelJumpUrl

        // 列表-是否开启监测状态事件
        enabledChange(val){
            console.log(val,'val')
            let data = {
                id: val.id,
                enabled: val.enabled
            }
            editEnabled(data).then(()=>{
                this.$modal.msgSuccess("修改成功");
            })
        },
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },


        // 站点范围选择
        getListzd(parentSite) {
            // this.loading = true;
            let date = {parentSite: parentSite}
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = response.data;
                console.log(this.inspSiteTreeList,'this.inspSiteTreeList')
                // this.loading = false;
                for (var i in this.inspSiteTreeList) {
                    this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName+'-'+this.inspSiteTreeList[i].siteCode;
                }
            });
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
                let date = {parentSite: node.data.siteCode,siteType: 1}
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
        handleNodeClick(data, node) {
            console.log(data,'data')   
            this.queryParams.pgNum = 1;
            // this.queryParams.ancestorsFind = data.siteCode;
            this.queryParams.ancestorsFind = data.ancestors+data.siteCode+',';
            this.getList();
        },
        
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 划过获取字数 用于是否显示黑框提示
        onShowNameTipsMouseenter(e) {
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

        jtChange(){
            this.jtShowS = !this.jtShowS;
            if(this.jtShowS == true){
                this.jtIco = 'el-icon-d-arrow-left';
                this.widthClass = '15%';
                this.paddingClass = '10px';
                this.widthClassR = '84%';
            }else if(this.jtShowS == false){
                this.jtIco = 'el-icon-d-arrow-right';
                this.widthClass = '1%';
                this.paddingClass = '0';
                this.widthClassR = '100%';
            }
        },

        // 左侧树搜索
        siteCodeSearch(){
            console.log('ok')
            let date = {};
            if(this.filterText == '' || this.filterText == null){
                date = { parentSite: 0 }
            }else{
                date = { likeSiteOrName: this.filterText, siteType: 1 }
            }
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = [];
                console.log(this.inspSiteTreeList,'this.inspSiteTreeList')
                setTimeout(()=>{
                    this.inspSiteTreeList = response.data;
                    for (var i in this.inspSiteTreeList) {
                        this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName+'-'+this.inspSiteTreeList[i].siteCode;
                    }
                },500)
                console.log(this.inspSiteTreeList,'重新渲染')
                // this.loading = false;
                
            });
            
        },

        // 复制栏目地址加网站标识码
        copyChange(val){
            console.log(val,'val')
            if(val.channelUrl){
                this.queryParams.channelUrlHash = val.channelUrl;
                navigator.clipboard.writeText(this.queryParams.channelUrlHash);
            }
        },


        // 导入
        // 模板上传
        handleFile(){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.open6 = true;
        },
        // 取消
        cancel6(){
            this.fileList = [];
            this.subFileList = [];
            this.open6 = false;
        },
        /**图片上传 */
        // 上传
        imgchange(file, fileList) {
            // this.subFileList.push(file);
            this.subFileList = fileList;   
        },
        // 删除
        handleRemove(file, fileList) {
            this.fileList = fileList;
            console.log(this.fileList,'删除后的数组')
            
        },
        // 确定
        submitForm6(){
            if(this.subFileList.length > 0){
                const formData = new FormData();
                this.subFileList.forEach(f => {
                    console.log(f,'f')
                    formData.append("file", f.raw);
                    formData.append("taskType", 1000);
                });
                console.log(formData,'formData')
                inspImportdataTask(formData).then((res)=>{
                    if(res.code == 200){
                        this.open6 = false;
                        this.subFileList = [];
                        this.$modal.msgSuccess("模板上传成功");
                    }
                })
            }else{
                this.$modal.msgWarning("请先上传文件");
            }
        },
        // 模板下载
        handleDown(type){
            let fileName = '栏目导入模板-'+type+'版';  
            this.download2(
                "common/download/downloadExcelTpl?type=1000&version="+type,'',
                `${fileName}.xlsx`
            ).then((res)=>{});
            
        },

        /** 导出按钮操作 */
        handleExport() {
            let fileName = '栏目信息数据'
            this.download(
                "biz/inspChannel/export",this.queryParams,
                `${fileName}.xlsx`
            ).then((res)=>{});
        },

    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .sxw{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #1890ff;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .sxw:hover {
        cursor: pointer;
        // color: #1890ff;
    }

    .div{
        display: flex;
        .divBox{
            position: relative;
        }
        .divLeft{
            width: 100%;
            // height: 100%;
            overflow: hidden;
            border-right: 1px solid #f0f0f0;
            // margin-right: 20px;
            padding-right: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            .treeDiv{
                flex: 1;
                overflow: auto;
            }
            .jt{
                position: absolute;
                right: 0;
                top: 50%;
                z-index: 10000;
            }
            .jt:hover{
                cursor: pointer;
            }
        }
        .jt{
            // display: block;
            // position: relative;
            // display: flex;
            // align-items: center;
            // margin: 0 10px;
            // margin-left: -10px;
            // .spspspsp{
            //     background: #ffffff;
            //     padding: 10px 0;
            // }
            display: inline-block;;
            position: absolute;
            top: 50%;
            right: 5px;
            .spspspsp{
                background: #ffffff;
                padding: 10px 0;
            }
        }
        .jt:hover{
            cursor: pointer;
        }
        .divRight{
            flex: 1;
        }
    }
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 20px;
        font-size: 14px;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>

<style scoped lang='scss'>
    /* 改变被点击节点背景颜色，字体颜色 */
    ::v-deep .el-tree-node:focus > .el-tree-node__content {
        background-color: #409eff !important;
        color: #fff !important;
        border-radius: 5px!important;
    }
    /*节点失焦时的背景颜色*/
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background-color: #409eff !important;
        color: #fff !important;
        border-radius: 5px!important;
    }
</style>
