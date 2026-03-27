<template>
    <div class="app-container">
        <div class="div">
            <div class="divBox" :style="{width: widthClass, paddingRight: paddingClass}">
                <div class="divLeft" v-if="jtShowS" :style="{height: treeHeight}" >
                    <!-- <el-input placeholder="输入网站标识码" v-model="filterText" size="mini" style="marginBottom: 10px"></el-input> -->
                    <div class="treeSearch">
                        <el-input placeholder="组织单位标识码/网站名称" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                        </el-input>
                    </div>
                    <div class="treeDiv">
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
                            <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                <span class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >{{ node.label }}</span>
                            </el-tooltip>
                        </el-tree>
                    </div>
                    <!-- <span class="jt"><i :class='jtIco' @click="jtChange" ></i></span> -->
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
                    label-width="100px"
                >
                    <el-form-item label="网站标识码" prop="siteCode" style="marginLeft:-5px">
                        <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="父级标识码" prop="">
                        <el-input
                            v-model="parentSite"
                            placeholder="请输入父级标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <!-- <el-form-item label="网站标识码" prop="siteCode" style="marginLeft:-5px">
                        <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="父级标识码" prop="parentSite">
                        <el-input
                            v-model="queryParams.parentSite"
                            placeholder="请输入父级标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    
                    <el-form-item label="网站类型" prop="siteType">
                        <el-select v-model="queryParams.siteType" clearable placeholder="请选择网站类型">
                            <el-option
                                v-for="item in siteTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="填报单位类型" prop="">
                        <el-select v-model="codeType" clearable placeholder="请选择填报单位类型">
                            <el-option
                                v-for="item in codeTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否部委" prop="bmFlag">
                        <el-select v-model="queryParams.bmFlag" clearable placeholder="请选择是否部委">
                            <el-option
                                v-for="item in bmFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="marginLeft:12px">
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
                            v-hasPermi="['biz:inspSiteTree:add']"
                        >新增</el-button>
                    </el-col>
                    <el-button type="success" plain icon="el-icon-top" size="mini" @click="handleFile" >站点关系导入</el-button>
                    <el-button type="primary" plain  size="mini" @click="goInfo" >任务详情</el-button>
                    
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="info"
                            plain
                            icon="el-icon-sort"
                            size="mini"
                            @click="toggleExpandAll"
                        >展开/折叠</el-button>
                    </el-col>-->
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>

                <el-table
                    height="63.3vh"
                    :data="tableList"
                    row-key="siteCode"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    fit=""
                >
                    <el-table-column label="序号" prop="index" min-width="80" align="center" />
                    <el-table-column label="网站标识码" prop="siteCode" min-width="120" />
                    <el-table-column label="父级标识码" prop="parentSiteTxt" min-width="120" />
                    <el-table-column label="祖级列表" align="" prop="ancestors" min-width="180" />
                    <el-table-column label="祖级列表ID" align="" prop="ancestorsId" min-width="120" />
                    <el-table-column label="网站名称" align="" prop="unitName" min-width="200" show-overflow-tooltip />
                    <el-table-column label="网站类型" align="center" prop="siteTypeTxt" min-width="120" />
                    <el-table-column label="填报单位类型" align="center" prop="codeTypeTxt" min-width="120" />

                    <el-table-column label="ID" prop="id" min-width="80" align="center" />
                    <el-table-column label="类型" align="center" prop="layerTypeTxt" min-width="120" />
                    <!-- <el-table-column label="主从挂接关系" align="center" prop="dependTypeTxt" min-width="120" /> -->
                    <el-table-column label="是否部委" align="center" prop="bmFlagTxt" min-width="120" />
                    <!-- <el-table-column label="级别" align="center" prop="level" min-width="120" /> -->
                    <!-- <el-table-column label="显示顺序" align="center" prop="orderNum" min-width="120" /> -->
                    <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
                    <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" min-width="160">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['biz:inspSiteTree:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-plus"
                                @click="handleAdd(scope.row)"
                                v-hasPermi="['biz:inspSiteTree:add']"
                                v-if="scope.row.siteType == 1"
                            >新增</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:inspSiteTree:remove']"
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

        <!-- 添加或修改站点关系对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <div class="box">
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <el-tooltip class="item" effect="dark" content="失去焦点会重新校验网站标识码是否存在" placement="top-start">
                            <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width:90%" clearable :disabled="siteCodeS" @clear="getGoodsList" />
                        </el-tooltip>

                    </el-form-item>
                    <el-form-item label="父级标识码" prop="parentSite" style="width:48%" v-if="!parentIdS">
                        <!-- <treeselect 
                            v-model="form.parentSite" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            :disabled="parentIdS"
                            :load-options="loadOptions"
                            @open="handleOpen"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                                v-model="form.parentSite"
                                :fetch-suggestions="querySearchAsync2"
                                placeholder="请输入父级标识码"
                                clearable
                                @select="handleSelectCompany2"
                                @clear="queryParams.parentSite = null"
                                style="width:90%"
                            ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="网站名称" prop="unitName" style="width:48%">
                        <el-input v-model="form.unitName" placeholder="请输入网站名称" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="级别" prop="level" style="width:48%">
                        <el-input v-model="form.level"  placeholder="请输入级别" style="width:90%" disabled />
                        <!-- <el-select v-model="form.level" clearable placeholder="请选择级别" style="width:90%" >
                            <el-option
                                v-for="item in levelDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value" 
                            ></el-option>
                        </el-select> -->
                    </el-form-item>
                    <el-form-item label="类型" prop="layerType" style="width:48%" v-if="layerTypeS">
                        <!-- <el-input v-model="form.bmFlag" placeholder="请输入类型" style="width:90%" /> -->
                        <el-select v-model="form.layerType" clearable placeholder="请选择类型" style="width:90%" >
                            <el-option
                                v-for="item in layerTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主从挂接关系" prop="dependType" style="width:48%">
                        <!-- <el-input v-model="form.bmFlag" placeholder="请输入主从挂接关系" style="width:90%" /> -->
                        <el-select v-model="form.dependType" clearable placeholder="请选择主从挂接关系" style="width:90%" >
                            <el-option
                                v-for="item in dependTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否部委" prop="bmFlag" style="width:48%">
                        <!-- <el-input v-model="form.bmFlag" placeholder="请输入是否部委" style="width:90%" /> -->
                        <el-select v-model="form.bmFlag" clearable placeholder="请选择是否部委" style="width:90%">
                            <el-option
                                v-for="item in bmFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="填报单位类型" prop="codeType" style="width:48%" v-if="layerTypeS">
                        <el-select v-model="form.codeType" clearable placeholder="请选择填报单位类型" style="width:90%">
                            <el-option
                                v-for="item in codeTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="显示顺序" prop="orderNum" style="width:48%">
                        <!-- <el-input v-model="form.orderNum" placeholder="请输入显示顺序" style="width:90%" /> -->
                        <el-input-number v-model="form.orderNum" controls-position="right" :min="0" :max="10000" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" style="width:93%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 模板上传 -->
        <el-dialog :title="title6" :visible.sync="open6" width="520px" append-to-body @close="cancel6">
            <el-form ref="form6" :model="form6"  label-width="60px">
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
                    <el-button type="primary" plain icon="el-icon-bottom" size="mini" @click="handleDown" >模板下载</el-button>
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
    listInspSiteTree,
    getInspSiteTree,
    delInspSiteTree,
    addInspSiteTree,
    updateInspSiteTree,
    siteTreeImportRecord,
    listTable
} from "@/api/biz/inspSiteTree";
import {
    listInspSiteInfo,
} from "@/api/biz/inspSiteInfo";
import {
    siteInfoExist
} from "@/api/biz/inspChannel";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { inspImportdataTask, } from "@/api/biz/wrongWords";


export default {
    name: "InspSiteTree",
    components: {
        Treeselect
    },
    data() {
        return {
            options: [ {
      id: 'success',
      label: 'With children',
      // Declare an unloaded branch node.
      children: null,
    }, {
      id: 'no-children',
      label: 'With no children',
      children: null,
    }, {
      id: 'failure',
      label: 'Demonstrates error handling',
      children: null,
    } ],
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 站点关系表格数据
            tableList: [],
            // 站点关系树选项
            inspSiteTreeOptions: [

            ],
            total: 0,
            props: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf'
            },
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部展开
            isExpandAll: true,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            parentSite: null,
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                // parentSite: 0,
                ancestors: null,
                unitName: null,
                level: null,
                orderNum: null,
                layerType: null,
                dependType: null,
                bmFlag: null,
                codeTypeIn: null,
                siteCodeOrState: 1,
                siteType: null,
            },
            codeType: null,
            // 表单参数
            form: {
                parentId: 0,
                // parentSite: 0,
            },
            // 表单校验
            rules: {
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur' },
                    { validator: this.validateSiteCode, trigger: 'blur' }
                ],
                parentSite: [{ required: false, message: '请输入父级标识码', trigger: 'blur' }],
                unitName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
                level: [{ required: true, message: '请选择级别', trigger: 'change' }],
                layerType: [{ required: true, message: '请选择类型', trigger: 'change' }],
                dependType: [{ required: true, message: '请选择主从挂接关系', trigger: 'change' }],
                bmFlag: [{ required: true, message: '请选择是否部委', trigger: 'change' }],
                codeType: [{ required: true, message: '请选择填报单位类型', trigger: 'change' }],
            },
            /**下拉菜单数据 */
            levelDate: [
                // 级别
                { label: "0级", value: 0 },
                { label: "1级", value: 1 },
                { label: "2级", value: 2 },
                { label: "3级", value: 3 }
            ],
            bmFlagDate: [
                // 是否部委
                { label: "是", value: 1 },
                { label: "否", value: 0 },
            ],
            layerTypeDate: [
                // 类型
                { label: "无", value: 0 },
                { label: "本级门户", value: 1 },
                { label: "本级部门", value: 2 },
                { label: "下属单位", value: 3 },
                { label: "其他", value: 9 },
            ],
            dependTypeDate: [ // 主从挂接关系
                { label: "主", value: 1 },
                { label: "从", value: 2 },
                { label: "无", value: -1 },
            ],
            codeTypeDate: [ // 填报单位类型
                { label: '网站', value: 1 },
                { label: '新媒体', value: 2 },
            ],
            // 网站类型
            siteTypeDate: [
                { label: '组织单位', value: 1 },
                { label: '填报单位', value: 2 },
            ],
            restaurants: [],
            restaurants2: [],
            siteCodeS: false,
            layerTypeS: false,
            siteCodeType: false,
            maps: new Map(),
            
            parentIdS: false,

            restaurants: [],


            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '站点关系导入',



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

            leftTreeHeight: 0,
            treeHeight: '0',
            highlightBd: true,

        };
    },
    created() {
        this.getList();
        this.getListzd(0);
        this.getScreenHeight();
    },
    
    mounted(){
    },
    methods: {
        getScreenHeight(){
            this.leftTreeHeight = window.innerHeight;
            this.treeHeight = this.leftTreeHeight - 125 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
        },
        /** 查询站点关系列表 */
        getList() {
            this.loading = true;
            this.queryParams.parentSite = this.parentSite;
            listTable(this.queryParams).then(response => {
                console.log(response);
                this.total = response.total;
                // this.tableList = this.handleTree(
                //     response.data,
                //     "siteCode",
                //     "parentSite",
                // );
                this.tableList = response.rows;
                // this.tableList[0].hasChildren = true;
                this.loading = false;
                for (var i in this.tableList) {
                    this.tableList[i].index = parseInt(i)+1;
                    // 类型
                    if (this.tableList[i].layerType == 0) {
                        this.tableList[i].layerTypeTxt = "无";
                    } else if (this.tableList[i].layerType == 1) {
                        this.tableList[i].layerTypeTxt = "本级门户";
                    } else if (this.tableList[i].layerType == 2) {
                        this.tableList[i].layerTypeTxt = "本级部门";
                    } else if (this.tableList[i].layerType == 3) {
                        this.tableList[i].layerTypeTxt = "下属单位";
                    } else if (this.tableList[i].layerType == 9) {
                        this.tableList[i].layerTypeTxt = "其他";
                    }
                    // 主从挂联关系
                    if (this.tableList[i].dependType == 1) {
                        this.tableList[i].dependTypeTxt = "主";
                    } else if (this.tableList[i].dependType == 2) {
                        this.tableList[i].dependTypeTxt = "从";
                    } else if (this.tableList[i].dependType == -1) {
                        this.tableList[i].dependTypeTxt = "无";
                    }
                    // 是否部委
                    if (this.tableList[i].bmFlag == 1) {
                        this.tableList[i].bmFlagTxt = "是";
                    } else if (this.tableList[i].bmFlag == 0) {
                        this.tableList[i].bmFlagTxt = "否";
                    }
                    // 父级标识码
                    if (this.tableList[i].parentSite == 0) {
                        this.tableList[i].parentSiteTxt = "--";
                    } else {
                        this.tableList[i].parentSiteTxt = this.tableList[i].parentSite;
                    }
                    // 网站类型
                    if (this.tableList[i].siteType == 1) {
                        this.tableList[i].siteTypeTxt = "组织单位";
                    } else if (this.tableList[i].siteType == 2) {
                        this.tableList[i].siteTypeTxt = "填报单位";
                    } else {
                        this.tableList[i].siteTypeTxt = "--";
                    }
                    // 填报单位类型
                    if (this.tableList[i].codeType == 1) {
                        this.tableList[i].codeTypeTxt = "网站";
                    } else if (this.tableList[i].codeType == 2) {
                        this.tableList[i].codeTypeTxt = "新媒体";
                    } else {
                        this.tableList[i].codeTypeTxt = "--";
                    }
                    
                }
            });
        },
        load(tree, treeNode, resolve) {
            console.log(tree,'tree');
            console.log(treeNode,'treeNode');
            setTimeout(() => {
                // this.queryParams.parentSite = tree.siteCode;
                let date = {parentSite: tree.siteCode}
                // let date = {parentId: tree.id}
                
                listInspSiteTree(date).then(response => {
                    let data = response.data;
                    console.log(data,'data')
                    for (var i in data) {
                        // 类型
                        if (data[i].layerType == 0) {
                            data[i].layerTypeTxt = "无";
                        } else if (data[i].layerType == 1) {
                            data[i].layerTypeTxt = "本级门户";
                        } else if (data[i].layerType == 2) {
                            data[i].layerTypeTxt = "本级部门";
                        } else if (data[i].layerType == 3) {
                            data[i].layerTypeTxt = "下属单位";
                        } else if (data[i].layerType == 9) {
                            data[i].layerTypeTxt = "其他";
                        }
                        // 主从挂联关系
                        if (data[i].dependType == 1) {
                            data[i].dependTypeTxt = "主";
                        } else if (data[i].dependType == 2) {
                            data[i].dependTypeTxt = "从";
                        } else if (data[i].dependType == -1) {
                            data[i].dependTypeTxt = "无";
                        }
                        // 是否部委
                        if (data[i].bmFlag == 1) {
                            data[i].bmFlagTxt = "是";
                        } else if (data[i].bmFlag == 0) {
                            data[i].bmFlagTxt = "否";
                        }
                        // 父级标识码
                        if (data[i].parentSite == 0) {
                            data[i].parentSiteTxt = "--";
                        } else {
                            data[i].parentSiteTxt = data[i].parentSite;
                        }
                    }
                    resolve(data);
                    this.loading = false;
                    // 记录treeNode节点
                    this.maps.set(tree.id, { tree, treeNode, resolve })
                    console.log(this.maps,'this.maps')
                });
            }, 1000);
        },
        refresh(parentId) {
            // 根据父级id取出对应节点数据
            if (this.maps.get(parentId)) {
                const { tree, treeNode, resolve } = this.maps.get(parentId)
                if (tree) {
                    this.load(tree, treeNode, resolve)
                }
            }
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
        /** 查询站点关系下拉树结构 */
        getTreeselect(siteCode) {
            // listInspSiteTree({siteType: 1}).then(response => {
            listInspSiteTree({parentSite:siteCode}).then(response => {
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
                console.log(this.inspSiteTreeOptions,'inspSiteTreeOptions')

            });
        },
        loadOptions({ action, parentNode, callback }){
            console.log(action,'action')
            console.log(parentNode,'parentNode')
            console.log(callback,'callback')
            if(action === 'LOAD_ROOT_OPTIONS') {
                listInspSiteTree({parentSite:0}).then(response => {
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
                        // parentNode.children = this.handleTree(
                        //     params,
                        //     "siteCode",
                        //     "parentSite",
                        // );
                        parentNode.children = params;
                    })
                    console.log(parentNode,'parentNode')
                    console.log(this.inspSiteTreeOptions,'inspSiteTreeOptions')
                // }else{
                    // this.listQuery.ptContListNo = '0'
                    // getGclHtqdList(this.listQuery).then(response => {
                    //     const params = response.data
                    //     params.forEach(item => {
                    //     item.children = null
                    //     })
                        
                    //     parentNode.children = params
                    // })
                // }

                callback();
            }
        },
        handleOpen(){
            // this.getTreeselect(0);            
        },
        loadNode(node, resolve) {
            console.log(node,'nodenode')
            if (node.level === 0) {
                // return resolve([{ name: 'region' }]);
                listInspSiteTree({parentSite:0}).then(response => {
                    this.inspSiteTreeOptions = [];
                    this.inspSiteTreeOptions = response.data;
                    for(var i in this.inspSiteTreeOptions){
                        this.inspSiteTreeOptions[i].label =  this.inspSiteTreeOptions[i].unitName + '（'+ this.inspSiteTreeOptions[i].siteCode + '）';
                    }
                });
                return resolve(this.inspSiteTreeOptions );
            }
            // if (node.level > 1) {

                setTimeout(() => {
                    // let data = [];
                    listInspSiteTree({parentSite:node.data.siteCode}).then(response => {
                        let data = [];
                        data = response.data;
                        for(var i in data){
                            data[i].label =  data[i].unitName + '（'+ data[i].siteCode + '）';
                            data[i].leaf = !data[i].hasChildren;
                        }
                        resolve(data);
                    });
                    // console.log(data)
                }, 1000);
            // };

            
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
                siteType: null,
                siteCode: null,
                parentSite: null,
                parentId: 0,
                ancestors: null,
                unitName: null,
                level: 0,
                orderNum: null,
                layerType: null,
                dependType: null,
                bmFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                codeTypeIn: null,
                codeType: null,
            };
            this.resetForm("form");
            this.siteCodeS = false;
            this.siteCodeType = false;
            this.rules.parentSite[0].required = false;
            this.parentIdS = false;
            this.parentSite = null;
            this.codeType = null;
            this.restaurants = [];
        },
        /** 搜索按钮操作 */
        handleQuery() {
            if(this.queryParams.siteCode){
                this.queryParams.parentSite = null;
            }else{
                // if(this.parentSite){
                //     this.queryParams.parentSite = this.parentSite;
                // }else{
                //     this.queryParams.parentSite = 0;
                // }
            }
            if(this.codeType){
                if(this.codeType == 1){
                    this.queryParams.codeTypeIn = [0,1]
                }else if(this.codeType == 2){
                    this.queryParams.codeTypeIn = [0,2]
                }
            }else{
                this.queryParams.codeType = null;
            }
            
            // this.queryParams.parentSite = null;
            setTimeout(()=>{
                this.getList();
            },200)
        },
        /** 重置按钮操作 */
        resetQuery() {
            // this.queryParams.parentSite = 0;
            this.parentSite = null;
            this.queryParams.parentSite = null;
            this.queryParams.codeTypeIn = null;
            this.codeType = null;
            this.queryParams.ancestorsFind = null; // 左侧树条件
            this.resetForm("queryForm");
            // this.handleQuery();
            this.getList();

        },
        /** 新增按钮操作 */
        handleAdd(row) {
            console.log(row,'rowrow')
            this.reset();
            // this.inspSiteTreeOptions = this.inspSiteTreeList;
            // this.getTreeselect(0);
            if (row != null && row.siteCode) {
                this.form.parentSite = row.siteCode;
                // this.form.parentSite = null;
                this.form.level = row.level+1;
                this.form.parentId = row.id;


                let data = {};
                if(row.level == 1 || row.level == 0){
                    data.parentSite = 0;
                }else{
                    data = {
                        siteCode: row.parentSite
                    }
                }
                listInspSiteTree(data).then(response => {
                    this.inspSiteTreeOptions = [];
                    this.inspSiteTreeOptions = response.data;
                    for(var i in this.inspSiteTreeOptions){
                        this.inspSiteTreeOptions[i].label =  this.inspSiteTreeOptions[i].unitName + '（'+ this.inspSiteTreeOptions[i].siteCode + '）';
                    }
                    // this.form.parentSite = this.inspSiteTreeOptions[0].siteCode;
                });
            } else {
                this.form.parentSite = null;
                let data = {parentSite:0};
                listInspSiteTree(data).then(response => {
                    this.inspSiteTreeOptions = [];
                    this.inspSiteTreeOptions = response.data;
                    for(var i in this.inspSiteTreeOptions){
                        this.inspSiteTreeOptions[i].label =  this.inspSiteTreeOptions[i].unitName + '（'+ this.inspSiteTreeOptions[i].siteCode + '）';
                    }
                    // this.form.parentSite = this.inspSiteTreeOptions[0].siteCode;
                });
            }
            this.open = true;
            this.title = "添加站点关系";
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row,'修改row')
            this.reset();
            this.rules.parentSite[0].required = true;
            const id = row.id || this.ids;
            if (row != null) {
                this.form.parentSite = row.parentSite;
            }
            getInspSiteTree({id:id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改站点关系";
                if(this.form.siteType == 1){
                    this.layerTypeS = false;
                    this.rules.codeType[0].required = false;
                }else if(this.form.siteType == 2){
                    this.layerTypeS = true;
                    this.rules.codeType[0].required = true;
                }
                // 根据parentId判断是否为第一级，第一级父级标识码不可修改
                if(this.form.parentId == 0 || this.form.parentId == undefined || this.form.parentId == null){
                    this.parentIdS = true;
                    this.rules.parentSite[0].required = false;
                    this.form.parentSite = null;
                }else{
                    this.parentIdS = false;
                    this.rules.parentSite[0].required = true;
                    this.form.parentSite = this.form.parentSite;
                }
                console.log(this.form.parentId,'123213123')
                // this.getTreeselect(this.form.parentSite );
                // listInspSiteTree({siteCode:this.form.parentSite}).then(response => {
                //     this.inspSiteTreeOptions = [];
                //     this.inspSiteTreeOptions = response.data;
                //     for(var i in this.inspSiteTreeOptions){
                //         this.inspSiteTreeOptions[i].label =  this.inspSiteTreeOptions[i].unitName + '（'+ this.inspSiteTreeOptions[i].siteCode + '）';
                //     }
                // });

            });
            this.siteCodeS = true;
        },
        /** 提交按钮 */
        submitForm() {
            // 调接口查询是否存在
            // if(this.form.siteCode == 'A00001'){
            //     alert('1')
            //     this.form.siteCode = '';
            //     this.rules.siteCode[0].message = 'aaa'
            // }
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // 父级标识码
                    if(this.form.parentSite == '' || this.form.parentSite == null){
                        this.form.parentSite = 0;
                        this.form.parentId = 0;
                        this.form.level = 0;
                    }
                    // 网站标识码
                    if(this.form.siteCode == '' || this.form.siteCode == null){
                        this.form.siteType = null;
                    }
                    console.log(this.form,'this.form')
                    if (this.form.id != null) {
                        updateInspSiteTree(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                            this.refresh(this.form.parentId)
                        });
                    } else {
                        addInspSiteTree(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                            this.refresh(this.form.parentId)
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            const ids = row.id || this.ids;
            const _this = this;
            this.$confirm('是否确认删除网站标识码为"' + row.siteCode + '"的数据项？')
                .then(function() {
                    delInspSiteTree({id:ids}).then(()=>{
                        console.log(_this,'this')
                        _this.$modal.msgSuccess("删除成功");
                        _this.refresh(row.parentId)
                        _this.getList();
                        

                    });                    
                }).catch(() => {});
        },

        /**输入框、下拉框事件 */
        // 父级标识码
        selectParentSite(node){
            // if(node.parentId == null){
                // this.form.parentId = 0;
                // this.form.level = 0;
            // }else{
                this.form.parentId = node.id;
                this.form.level = node.level+1;
            // }
            console.log(this.form.level,'this.form.level')
            console.log(this.form.parentId,'this.form.parentId')
        },
        // 网站标识码校验
        validateSiteCode(rule, value, callback){
            let date = {
                siteCode: value,
                siteType: null,
            }
            siteInfoExist(date).then((res)=>{
                this.siteCodeType = res.data.exist;
                // console.log(this.siteCodeType,'this.siteCodeType')
                if(this.siteCodeType == false){
                    callback(new Error('网站标识不存在，请重新输入'));
                }else{
                    callback();
                    // 类型是否显示
                    if(res.data.info.siteType == 1){
                        this.layerTypeS = false;
                        this.form.layerType = null;
                        // this.form.codeType = '';
                        // this.rules.codeType[0].required = false;
                    }else{
                        this.layerTypeS = true;
                        // this.form.codeType = '';
                        // this.rules.codeType[0].required = true;
                    }
                    this.form.siteType = res.data.info.siteType;
                    this.form.unitName = res.data.info.siteName;
                    this.form.codeType = res.data.info.codeType;
                    
                }
                // console.log(this.layerTypeS,'this.layerTypeS')
                // console.log(this.form.layerType,'this.form.layerType')
                
            })
        },
        // 网站标识码清空
        getGoodsList(val){
            this.form.siteType = null;
            this.form.unitName = null;
        },


        // 父级标识码
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.form.level = val.level+1;
            this.form.parentId = val.parentId;
            this.form.parentSite = val.siteCode;
            console.log(this.form.parentId,'this.form.parentId')
        },
        // 主管单位
         querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.form.parentSite === '' || this.form.parentSite == null) {
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
                            parentId: response.data[i].id,
                            level: response.data[i].level,
                        })
                    }
                    
                });
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                callBack(this.restaurants);
            }, 3000 * Math.random());
        },


         // 导入
        // 模板上传
        handleFile(){
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
                    formData.append("file", f.raw);
                    formData.append("taskType", 1202);
                });
                inspImportdataTask(formData).then((res)=>{
                    if(res.code == 200){
                        this.open6 = false;
                        this.subFileList = [];
                        this.$modal.msgSuccess("模板上传成功");
                        this.getList();
                    }
                })
                
            }else{
                this.$modal.msgWarning("请先上传文件");
            }
            
        },
        // 模板下载
        handleDown(){
            let fileName = '站点关系-导入模板';  
            this.download2(
                "common/download/downloadExcelTpl?type=1202",'',
                `${fileName}.xlsx`
            ).then((res)=>{});
        },
        // 

        // 任务详情
        goInfo(){
            this.$router.push({ path: '/basic/taskInfo' })
        },



        // 站点范围选择
        getListzd(parentSite) {
            // this.loading = true;
            let date = {parentSite: parentSite}
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = [];
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
                let date = {parentSite: node.data.siteCode, siteType: 1}
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
            // this.queryParams.parentSite = data.siteCode;
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
                date = { likeSiteOrName: this.filterText,siteType: 1 }
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
        
        

    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
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
        .divRight{
            // flex: 1;
            width: 84%;
        }
        .jt{
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
    }
    // 树 文本省略号
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
<style scoped>
    /deep/.el-dialog{
        margin-top: 14vh!important;
    }
</style>
