<template>
    <div class="app-container">
        <!-- 表格全屏 -->
        <div class="bigWrapBox" v-if="upHeightType">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini"  @click="handleExport" >导出</el-button>
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <div class="tabBox">
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    :height="upTableHeight"
                >
                     <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="url" label="问题地址" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top"> -->
                                <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeTxt" label="规则分类"  align="center"  width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="requireTypeTxt" label="规则类型"  align="center" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="rules" label="扫描规则"  width="200" >
                        <template slot-scope="scope">
                            <div v-if="scope.row.rules.length > 0">
                                <el-tooltip placement="top-start">
                                    <div slot="content" v-for="(item,index) in scope.row.rules" :key="index">{{item}}</div>
                                    <span style="display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.rulesTxt}}</span>
                                </el-tooltip>
                            </div>
                            <div v-if="scope.row.rules.length == 0">
                                <span style="display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">--</span>
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="120" align="center" ></el-table-column>
                    <el-table-column prop="ruleRemark" label="问题描述"  width="260"></el-table-column>
                    <el-table-column prop="linkLocationTxt" label="链接位置" width="120" align="center"></el-table-column>
                    <el-table-column prop="fromTitle" label="父地址标题"  width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="fromUrl" label="父地址"  width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.fromUrl" placement="top"> -->
                                <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromUrl}}</span>
                            <!-- </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="anchor" label="父页面入口标题"  width="180" show-overflow-tooltip></el-table-column>             -->
                    <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                    <!-- <el-table-column prop="typeTxt" label="规则分类"  align="center"  width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="requireTypeTxt" label="规则类型"  align="center" width="180" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="createTime" label="发现时间"  width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间"  width="180"></el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="整改" placement="top">
                                <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column>
                </el-table>

                <!-- <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                /> -->
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[10,50,100, 200, 500]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </div>
        </div>
        <!-- 正常展示 -->
        <div v-if="!upHeightType">
            <el-form
                :model="queryParams"
                ref="queryForm"
                size="small"
                :inline="true"
                v-show="showSearch"
                label-width="90px"
            >
                <el-form-item label="主管单位" prop="">
                    <el-autocomplete
                        v-model="queryParams.treeInfo.psCode"
                        :fetch-suggestions="querySearchAsync2"
                        placeholder="请输入内容"
                        clearable
                        @select="handleSelectCompany2"
                        style="width:310px"
                    ></el-autocomplete>
                </el-form-item>                
                <el-form-item label="网站标识码" prop="siteCode">
                    <el-autocomplete
                        v-model="queryParams.siteCode"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入内容"
                        clearable
                        style="width:310px"
                        @select="handleSelectCompany"
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item label="链接位置" prop="linkLocation">
                    <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                        <el-option
                            v-for="item in ljwzList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则分类" prop="">
                <el-cascader
                    v-model="typeArr"
                    :options="requireTypeDate"
                    :props="{ checkStrictly: true }"
                    style="width:310px"
                    clearable></el-cascader>
                </el-form-item>
                <el-form-item label="整改状态" prop="reviewResult">
                    <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                        <el-option
                            v-for="item in zgztList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据范围" prop="dataRangeType">
                    <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                        <el-option
                            v-for="item in dataRangeTypeList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单批次" prop="">
                    <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:720px" :disabled="queryParams.dataRangeType == 1">
                        <el-option
                        v-for="item in pcList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="监测时间" prop="">
                    <el-date-picker 
                    v-model="queryParams.scanDate" 
                    type="date" 
                    placeholder="选择日期"
                    :picker-options="expireTimeOPtion"
                    ></el-date-picker>
                </el-form-item> -->
                <el-form-item style="marginLeft:8px">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8" >
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
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="multiple"
                        @click="handleUpdateAll"
                    >批量整改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="warning"
                        plain
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                    >导出</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
            </el-row>

            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="inspSiteInfoList"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
                height="580"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="问题地址" width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top"> -->
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        <!-- </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column prop="typeTxt" label="规则分类"  align="center"  width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="requireTypeTxt" label="规则类型"  align="center" width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="rules" label="扫描规则"  width="200" >
                    <template slot-scope="scope">
                        <div v-if="scope.row.rules.length > 0">
                            <el-tooltip placement="top-start">
                                <div slot="content" v-for="(item,index) in scope.row.rules" :key="index">{{item}}</div>
                                <span style="display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{scope.row.rulesTxt}}</span>
                            </el-tooltip>
                        </div>
                        <div v-if="scope.row.rules.length == 0">
                            <span style="display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">--</span>
                        </div>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="reviewResultTxt" label="整改状态" width="120" align="center" ></el-table-column>
                <el-table-column prop="ruleRemark" label="问题描述"  width="260"></el-table-column>
                <el-table-column prop="linkLocationTxt" label="链接位置" width="120" align="center"></el-table-column>
                <el-table-column prop="fromTitle" label="父地址标题"  width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fromUrl" label="父地址"  width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" :content="scope.row.fromUrl" placement="top"> -->
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromUrl}}</span>
                        <!-- </el-tooltip> -->
                        
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="anchor" label="父页面入口标题"  width="180" show-overflow-tooltip></el-table-column>             -->
                <el-table-column prop="title" label="快照" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                <!-- <el-table-column prop="typeTxt" label="规则分类"  align="center"  width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="requireTypeTxt" label="规则类型"  align="center" width="180" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="createTime" label="发现时间"  width="180"></el-table-column>
                <el-table-column prop="scanTime" label="监测时间"  width="180"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="整改" placement="top">
                            <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
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
        <!-- 添加或修改站点关系对话框 -->
        <el-dialog title="整改状态" :visible.sync="open2" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="120px">
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-radio-group v-model="form2.reviewResult">
                            <el-radio :label="1">待整改</el-radio>
                            <el-radio :label="2">已整改</el-radio>
                            <el-radio :label="3">无需整改</el-radio>
                        </el-radio-group>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 导出 -->
        <el-dialog title="导出数据" :visible.sync="open4" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form4" :model="form4" :rules="rules4" label-width="120px">
                    <el-form-item label="导出方式" prop="type">
                        <el-radio-group v-model="form4.type">
                            <el-radio :label="1">小批量（最多3000条）</el-radio>
                            <el-radio :label="2">大批量</el-radio>
                        </el-radio-group>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm4">确 定</el-button>
                <el-button @click="cancel4">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspSiteInfo,
    getInspSiteInfo,
    delInspSiteInfo,
    addInspSiteInfo,
    updateInspSiteInfo,
    getOrderBatchSelectList,
    editReviewResult,
    queryNoUpdateDay,
    getSpecsMapEnum,
    editReviewResultBatch
} from "@/api/biz/linksSummary";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { listInspOrderBatch } from "@/api/biz/inspOrderBatch";

import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
    },
    data() {
        return {
            expireTimeOPtion: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
            expireTimeOPtion2: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
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
                // type: 1,
                pgNum: 1,
                pgSize: 10,
                // siteCodeOrg: null, // 标识码-主管
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                scanDate: this.formatDate(new Date()),
                orderTypes: [], // 表格排序
                linkLocation: null, // 链接位置
                type: null, // 规则分类
                requireType: null, // 规则类型
                reviewResult: null, // 整改状态
                batchId: null,
                dataRangeType: 0,

            },

            /**下拉菜单数据 */
            // 链接类型
            ljlxList: [ 
                { label: '站外', val: 1 },
                { label: '站内', val: 2 },
            ],
            // 链接位置
            ljwzList: [ 
                { label: '首页', val: 1 },
                { label: '其他页', val: 2 }
            ],
            // 资源类别
            zylbList: [
                { label: '图片', val: 1 },
                { label: '页面', val: 2 },
                { label: '附件', val: 3} ,
                { label: 'JS', val: 4 },
                { label: 'CSS', val: 5 },
                { label: '音视频', val: 6 },
                { label: '未知地址', val: 7 },
            ],
            // 整改状态
            zgztList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '无需整改', val: 3 },
            ],
            // 时间类型
            DateArr: [],
            shsjList: [ 
                { label: '监测时间', val: 'ct' },
                { label: '审核时间', val: 'ate' },
            ],
            // 操作类型
            czList: [ 
                { label: '显示', val: 2 },
                // { label: '显示并预警', val: 3 },
                { label: '误报', val:  4 },
            ],


            // 站点关系树选项
            inspSiteTreeOptions: [],


            // 逾期不更新状态
            yqbgxztList: [
                { label: '严重逾期', val: 1 },
                { label: '即将逾期', val: 2 },
                { label: '正常', val: 3 },
            ],

            typeArr: null,
            requireTypeDate: [], // 分类
            typeDate: [], // 类型
            typeDateOld: [],

            // 整改
            open2: false, 
            form2: {
                idStr: null,
                reviewResult: null
            },
            rules2: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },
            zgType: null,

            // 导出
            open4: false, 
            form4: {
                menuType: 140
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },
            
            restaurants: [],
            timeout:  null,

            upHeightType: false,
            showUpHeight: true,
            upTableHeight: '86vh',
            fdsx: true,

            pcList: [],
            // 数据范围
            dataRangeTypeList: [
                { label: '全部数据', val: 0 },
                { label: '仅日常数据', val: 1 }

            ],
        };
    },
    created() {
        this.getList();
        this.getTreeselect();
        this.getChannelTypeDate();
    },
    methods: {
        upHeightChange(val){
            if(this.inspSiteInfoList.length > 0){
                this.upHeightType = val;                
            }
        },
        upHeightOldChange(){
            this.upHeightType = false;
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
        /** 查询站点关系下拉树结构 */
        getTreeselect() {
            listInspSiteTree({parentSite: 0, siteType: 1}).then(response => {
                this.inspSiteTreeOptions = [];
                this.inspSiteTreeOptions = response.data;
                // this.inspSiteTreeOptions = this.handleTree(
                //     response.data,
                //     "siteCode",
                //     "parentSite",
                // );
                for(var i in this.inspSiteTreeOptions){
                    if(this.inspSiteTreeOptions[i].children.length == 0){
                        this.inspSiteTreeOptions[i].children = null;
                        this.inspSiteTreeOptions[i].leaf = true;
                    }
                }
            });
        },
        /** 转换站点关系数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.siteCode,
                label: node.siteCode+'（'+node.unitName+'）',                
                children: node.children,
                parentId: node.parentId,
                level: node.level,
                parentSite: node.parentSite
            };
        },
        // 父级标识码
        selectParentSite(node){
            console.log(node,'nodenodenode')
        },
        loadOptions({ action, parentNode, callback }){
            console.log(action,'action')
            console.log(parentNode,'parentNode')
            console.log(callback,'callback')
            if(action === 'LOAD_ROOT_OPTIONS') {
                listInspSiteTree({parentSite:0, siteType: 1}).then(response => {
                    this.inspSiteTreeOptions = [];
                    this.inspSiteTreeOptions = response.data;
                    this.inspSiteTreeOptions = this.handleTree(
                        response.data,
                        "siteCode",
                        "parentSite",
                    );
                    for(var i in this.inspSiteTreeOptions){
                        if(this.inspSiteTreeOptions[i].children.length == 0){
                            this.inspSiteTreeOptions[i].children = null;
                        }
                    }
                    console.log(this.inspSiteTreeOptions,'inspSiteTreeOptions')

                });
                callback()
            }
            // 这里加载二级数据了，根据自己需求判断调接口
            if (action == 'LOAD_CHILDREN_OPTIONS') {
                //加载点击节点的 子节点
                // if(parentNode.parentId !== '0') {
                    const query = {
                        parentSite: parentNode.siteCode,
                        siteType: 1
                    }
                    listInspSiteTree(query).then(response => {
                        const params = response.data;
                        for(var i in params){
                            if(params[i].children.length == 0){
                                params[i].children = null;
                            }
                        }
                        parentNode.children = params;
                    })
                callback();
            }
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            if(this.typeArr){
                if(this.typeArr.length == 1){
                    this.queryParams.type = this.typeArr[0];
                    this.queryParams.requireType = null;                    
                }else{
                    this.queryParams.type = this.typeArr[0];
                    this.queryParams.requireType = this.typeArr.slice(-1)[0];
                }
            }else{
                this.queryParams.type = null;
                this.queryParams.requireType = null;  
            }
            listInspSiteInfo(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 链接位置
                    if(this.inspSiteInfoList[i].linkLocation == 1){
                        this.inspSiteInfoList[i].linkLocationTxt = '首页';
                    }else if(this.inspSiteInfoList[i].linkLocation == 2){
                        this.inspSiteInfoList[i].linkLocationTxt = '其他页';
                    }
                    if(!this.inspSiteInfoList[i].type){
                        this.inspSiteInfoList[i].typeTxt = '--';
                    }
                    if(!this.inspSiteInfoList[i].requireType){
                        this.inspSiteInfoList[i].requireTypeTxt = '--';
                    }
                    if(!this.inspSiteInfoList[i].fromTitle){
                        this.inspSiteInfoList[i].fromTitle = '--';
                    }
                    if(!this.inspSiteInfoList[i].anchor){
                        this.inspSiteInfoList[i].anchor = '--';
                    }
                    // 规则分类                   
                    for(var z in this.requireTypeDate){
                        if(this.inspSiteInfoList[i].type == this.requireTypeDate[z].value){
                            this.inspSiteInfoList[i].typeTxt = this.requireTypeDate[z].label;
                        }
                    }
                    // 规则类型
                    for(var j in this.typeDateOld){
                        if(this.inspSiteInfoList[i].requireType == this.typeDateOld[j].value){
                            this.inspSiteInfoList[i].requireTypeTxt = this.typeDateOld[j].label;
                        }
                    }
                    // 问题描述
                    if(!this.inspSiteInfoList[i].ruleRemark){
                        this.inspSiteInfoList[i].ruleRemark = '--';
                    }
                    if(!this.inspSiteInfoList[i].rules){
                        this.inspSiteInfoList[i].rules = [];
                    }else{
                        this.inspSiteInfoList[i].rulesTxt = this.inspSiteInfoList[i].rules.join(',');
                    }

                    // 整改状态
                    if(this.inspSiteInfoList[i].reviewResult == 1){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '待整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 2){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '已整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 3){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '无需整改';
                    }
                    
                }
            });
        },
        // 订单批次模糊搜
        remoteMethod2(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    listInspOrderBatch({searchKeyLike: query}).then((res)=>{
                        if(res.rows.length > 0){
                            this.pcList = [];
                            for(var i in res.rows){
                                this.pcList.push({
                                    label: res.rows[i].orderName + '（' + res.rows[i].orderStartDate + '）' + '/ ' + res.rows[i].batchName + '（' + res.rows[i].startDate + '）',
                                    value: res.rows[i].id
                                })
                            }
                        }
                    })
                },1000)
            }
        },
        // 数据范围事件
        dataRangeTypeChange(){
            if(this.queryParams.dataRangeType == 1){
                this.queryParams.batchId = null;
            }
        },
        // 规则下拉数据
        getChannelTypeDate(){
            getSpecsMapEnum({}).then(response => {
                console.log(response,'response')
                for(var i in response.data.specsTypeMap){
                    this.requireTypeDate.push({ label: response.data.specsTypeMap[i].name, value: response.data.specsTypeMap[i].code, children: []})
                }
                for(var j in response.data.specsMap){
                    this.typeDateOld.push({ label: response.data.specsMap[j].name, value: response.data.specsMap[j].code, type: response.data.specsMap[j].type})
                }
                for(var a in this.requireTypeDate){
                    for(var b in this.typeDateOld){
                        if(this.requireTypeDate[a].value == this.typeDateOld[b].type){
                            this.requireTypeDate[a].children.push(this.typeDateOld[b])
                        }
                    }
                }
                console.log(this.requireTypeDate,'this.requireTypeDate2222222')
                
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate);
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.scanDate = this.formatDate(new Date());
            this.typeArr = null;
            this.queryParams.treeInfo.psCode = null;
            this.queryParams.batchId = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.idStr
                this.$modal
                    .confirm('是否确认删除该条数据？')
                    .then(function() {
                        return delInspSiteInfo({ids:[ids]});
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
                        return delInspSiteInfo({ids:ids});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }
            
        },
        // 表单重置
        reset4() {
            this.form4 = {
                menuType: 140,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 140,
                type: 1,
            }
            this.resetForm("form3");
        },
        /** 导出按钮操作 */
        handleExport() {
            // let fileName = '敏感信息数据'
            // this.download(
            //     "biz/wrongWords/export",this.queryParams,
            //     `${fileName}.xlsx`
            // ).then((res)=>{});
            this.open4 = true;
            this.reset4();
        },
        /** 提交按钮 */
        submitForm4() {
            this.$refs["form4"].validate(valid => {
                if (valid) {
                    console.log(this.form4)
                    let subData = this.queryParams;
                    subData.menuType = 140;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '规范检查数据'
                        this.download(
                            "biz/requires/export",this.queryParams,
                            `${fileName}.xlsx`
                        ).then((res)=>{
                            this.open4 = false;
                        });
                    }
                    
                }
            });
        },

        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },
        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            if(order == 'descending'){ // 下
                this.queryParams.orderTypes = [{ code: 1, name: prop }];
                this.getList(); // 列表数据
            }else if(order == 'ascending'){ // 上
                this.queryParams.orderTypes = [{ code: 0, name: prop }];
                this.getList(); // 列表数据
            }else{ // 取消
                this.queryParams.orderTypes = [];
                this.getList(); // 列表数据
            }
        },


        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
        },
        /** 修改按钮操作 */
        handleUpdate2(row,index) {
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            const id = row.idStr || this.ids;
            getInspSiteInfo({id:id}).then(response => {
                this.form2.idStr = response.data.idStr;
                this.form2.reviewResult = response.data.reviewResult;
                console.log(this.form2,'this.form-header')
                this.open2 = true;
                this.zgType = 1; // 1、单个 2、批量
            });
        },
        // 批量整改
        handleUpdateAll(){
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            this.zgType = 2; // 1、单个 2、批量
            this.open2 = true;
        },
        /** 提交按钮 */
        submitForm2() {
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    console.log(this.form2)
                    // if (this.form2.idStr != null) {
                        if(this.zgType == 1){
                            editReviewResult(this.form2).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                this.getList();
                            });
                        }else{
                            let data = {
                                ids: this.ids,
                                reviewResult: this.form2.reviewResult
                            }
                            console.log(data,'data')
                            editReviewResultBatch(data).then(()=>{
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                this.getList();
                            })
                        }
                    // }
                }
            });
        },

        /**搜索条件 */
        // 网站标识码
        querySearchAsync(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.siteCode === '' || this.queryParams.siteCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
                    codeType: 1,
                    likeSiteOrName: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                listInspSiteTree(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.data){
                        this.restaurants.push({
                            value: response.data[i].unitName + '-' + response.data[i].siteCode,
                            siteCode: response.data[i].siteCode,
                        })
                    }
                    
                });
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callBack(this.restaurants);
            }, 3000 * Math.random());
        },
         /**输入框、下拉框事件 */
        // 父级标识码
        handleSelectCompany(val){
            console.log(val,'valval')
            this.queryParams.siteCode = val.siteCode;
        },
        // 主管单位
         querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.treeInfo.psCode === '' || this.queryParams.treeInfo.psCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
                    siteType: 1,
                    likeSiteOrName: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                listInspSiteTree(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.data){
                        this.restaurants.push({
                            value: response.data[i].unitName + '-' + response.data[i].siteCode,
                            siteCode: response.data[i].siteCode,
                        })
                    }
                    
                });
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callBack(this.restaurants);
            }, 3000 * Math.random());
        },
        /**输入框、下拉框事件 */
        // 父级标识码
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.queryParams.treeInfo.psCode = val.siteCode;
        }

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
    .divdiv{
        flex: 1;
        display: flex;
        justify-content: space-between;
        .dvdv{
            display: flex;
            align-items: center;
        }
    }

    .drawerCon{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .concon{
            flex: 1;
            overflow: auto;
            .conTop{
                padding: 0 15px 10px 15px;
                border-bottom: 1px solid #f0f0f0;
                .ul{
                    margin: 0;
                    padding: 0;
                    li{
                        font-size: 14px;
                        list-style: none;
                        margin-bottom: 10px;
                        margin-left: 15px;
                    }
                }
            }
        }
    }
    .demo-drawer__footer{
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }

    .bigWrapBox{
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 2000;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 15px 20px;
        .tabBox{
            flex: 1;
            overflow: auto;
        }
    }
    
</style>
<style lang="scss">
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    .el-drawer__header{
        margin-bottom: 0!important;
        color: #000000;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10px;
    }
</style>