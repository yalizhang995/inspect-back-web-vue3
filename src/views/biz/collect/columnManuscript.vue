<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="110px"
        >
            <el-form-item label="主管单位" prop="" >
                <el-autocomplete
                    v-model="queryParams.treeInfo.psCode"
                    :fetch-suggestions="querySearchAsync2"
                    placeholder="请输入内容"
                    clearable
                    style="width:310px"
                    @select="handleSelectCompany2"
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
            <el-form-item label="首页/栏目地址" prop="url" >
                <el-input
                    v-model="queryParams.url"
                    placeholder="请输入首页/栏目地址"
                    clearable
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="栏目名称" prop="nameLike" >
                <el-input
                    v-model="queryParams.nameLike"
                    placeholder="请输入栏目名称"
                    clearable
                    style="width:310px"
                />
            </el-form-item>
            <el-form-item label="栏目分类" prop="">
                <el-cascader
                    v-model="channelTypeArr"
                    :options="channelTypeDate"
                    :props="{ checkStrictly: true }"
                    style="width:310px"
                    clearable></el-cascader>
            </el-form-item>
            
            <el-form-item label="栏目来源" prop="source">
                <el-select v-model="queryParams.source" placeholder="请选择栏目来源" clearable style="width:310px">
                    <el-option
                        v-for="dict in sourceList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="链接位置" prop="linkLocation">
                <el-select v-model="queryParams.linkLocation" placeholder="请选择链接位置" clearable style="width:310px">
                    <el-option
                        v-for="dict in linkLocationList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="更新数" prop="countNum" >
                <el-input
                    v-model="queryParams.countNum"
                    placeholder="请输入更新数"
                    clearable
                    style="width:310px"
                    @clear="queryParams.countNum=null"
                />
            </el-form-item>
            <el-form-item label="处理情况" prop="processState">
                <el-select v-model="queryParams.processState" placeholder="请选择处理情况" clearable style="width:310px">
                    <el-option
                        v-for="dict in processStateList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            
            <el-form-item label="是否收费" prop="charge">
                <el-select v-model="queryParams.charge" placeholder="请选择是否收费" clearable style="width:310px">
                    <el-option
                        v-for="dict in chargeList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="逾期不更新状态" prop="overdueState">
                <el-select v-model="queryParams.overdueState" placeholder="请选择逾期不更新状态" clearable style="width:310px">
                    <el-option
                        v-for="dict in overdueStateList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="特殊情况" prop="specialTag">
                <el-select v-model="queryParams.specialTag" placeholder="请选择特殊情况" clearable style="width:310px">
                    <el-option
                        v-for="dict in specialTagList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="全站稿件量">
                <div class="range-input-group" style="width: 310px;position: relative;">
                    <!-- <el-input
                        v-model="queryParams.articlesNumGte"
                        placeholder="最小值"
                        type="number"
                        :min="0"
                        :max="queryParams.articlesNumLte - 1"
                    >
                        <template slot="prepend">
                        <span>≥</span>
                        </template>
                    </el-input>
                    <span class="range-separator">~</span>
                    <el-input
                        v-model="queryParams.articlesNumLte"
                        placeholder="最大值"
                        type="number"
                        :min="queryParams.articlesNumGte + 1"
                    >
                        <template slot="prepend">
                        <span>≤</span>
                        </template>
                    </el-input> -->
                    <el-input-number v-model="queryParams.articlesNumGte" :min="0" :max="parseInt(queryParams.articlesNumLte)-1" style="width: 140px"></el-input-number>
                    <el-input placeholder="" @focus="handleFocus(1)" style="position: absolute;width: 78px;left: 31px;" v-if="!articlesNumGteShow" ></el-input>
                    <span class="range-separator" style="margin: 0 10px;">~</span>
                    <el-input-number v-model="queryParams.articlesNumLte" :min="queryParams.articlesNumGte" :max="1000000" style="width: 140px"></el-input-number>
                    <el-input placeholder="" @focus="handleFocus(2)" style="position: absolute;width: 79px;right: 33px;" v-if="!articlesNumLteShow"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="问题类型" prop="questionType">
                <el-select v-model="queryParams.questionType" placeholder="请选择问题类型" clearable style="width:310px">
                    <el-option
                        v-for="(item,index) in questionTypeList"
                        :key="index"
                        :label="item.dictLabel"
                        :value="item.dictValueInt"
                    />
                </el-select>
                <!-- <el-select v-model="queryParams.questionType" placeholder="请选择问题类型" clearable style="width:310px">
                    <el-option-group
                        v-for="group in oldQuestionTypeList"
                        :key="group.label"
                        :label="group.label">
                        <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-option-group>
                </el-select> -->
            </el-form-item>
            <el-form-item label="数据ID" prop="idStr" >
                <el-input
                    v-model="queryParams.idStr"
                    placeholder="请输入数据ID"
                    clearable
                    style="width:310px"
                />
            </el-form-item>
            

            <el-form-item style="marginLeft:27px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-thumb"
                    size="mini"
                    :disabled="multiple"
                    v-hasPermi="['biz:pageUpdate:column']"
                    @click="handleUpdate3(2)"
                >批量重采</el-button>
            </el-col>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table :data="inspSiteInfoList" stripe style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading" fit>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="siteName" label="网站名称" min-width="160"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)" v-if="scope.row.siteName!='--'">{{ scope.row.siteName}}</span>
                    <span v-if="scope.row.siteName=='--'">{{ scope.row.siteName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="siteCode" label="网站标识码"  min-width="120" ></el-table-column>
            <el-table-column prop="linkLocationTxt" label="链接位置" min-width="100" align="center"></el-table-column>
            <el-table-column prop="name" label="首页/栏目名称" min-width="240" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.url)" v-if="scope.row.name!='--'">{{ scope.row.name}}</span>
                    <span v-if="scope.row.name=='--'">{{ scope.row.name}}</span>
                </template> -->
            </el-table-column>
            <el-table-column prop="url" label="首页/栏目地址" min-width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.url)" v-if="scope.row.url!='--'">{{ scope.row.url}}</span>
                    <span v-if="scope.row.url=='--'">{{ scope.row.url}}</span>
                </template>
            </el-table-column>
            <el-table-column label="" prop="channelName" width="60">
                <template slot-scope="scope">
                    <el-tooltip  class="item" effect="dark" content="点此复制首页/栏目地址" placement="top-start">
                        <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                    </el-tooltip> 
                </template>
            </el-table-column>
            <el-table-column prop="channelTypeText" label="栏目分类" min-width="200"  show-overflow-tooltip></el-table-column>
            
            <el-table-column prop="overdueStateTxt" label="逾期不更新状态" min-width="120" align="center"></el-table-column>
            <el-table-column prop="noUpdateDay" label="未更新天数" min-width="100" align="center"></el-table-column>
            <el-table-column prop="updateTitle" label="最后更新标题" min-width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.updateUrl)" v-if="scope.row.updateTitleTxt!='--'">{{ scope.row.updateTitleTxt}}</span>
                    <span v-if="scope.row.updateTitleTxt=='--'">{{ scope.row.updateTitleTxt}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="updateUrl" label="最后更新链接" min-width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.updateUrl)" v-if="scope.row.updateUrl!='--'">{{ scope.row.updateUrl}}</span>
                    <span v-if="scope.row.updateUrl=='--'">{{ scope.row.updateUrl}}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="renewTime" label="最后更新日期" min-width="120" ></el-table-column>
            <el-table-column prop="title" label="快照" width="80" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="processStateTxt" label="处理情况" min-width="100" align="center"></el-table-column>
            <el-table-column prop="questionTypeTxt" label="问题类型" min-width="180" align="" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="备注" min-width="220" align="" show-overflow-tooltip></el-table-column>

            <el-table-column prop="chargeTxt" label="是否收费" min-width="100" align="center"></el-table-column>
            <el-table-column prop="articlesNum" label="全站稿件量" min-width="100" align="center"></el-table-column>
            <el-table-column prop="specialTagTxt" label="特殊情况" min-width="120" align="center"></el-table-column>
            
            <el-table-column prop="sourceTxt" label="栏目来源" min-width="100" align="center"></el-table-column>
            <el-table-column prop="countNum" label="总更新数" min-width="120" align="center" sortable="custom"></el-table-column>
            <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
            <el-table-column prop="scanDate" label="监测时间" width="120"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-thumb" @click="handleUpdate3(1,scope.row)" v-hasPermi="['biz:pageUpdate:column']">重新采集</el-button>
                    <el-button size="mini" type="text" icon="el-icon-paperclip" @click="goColumn(scope.row)" >跳转</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)" >编辑</el-button>
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

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="处理情况" prop="processState" style="width:95%">
                    <el-radio-group v-model="form.processState" @change="processStateChange">
                        <el-radio :label="2">已处理</el-radio>
                        <el-radio :label="3">交付待处理</el-radio>
                        <el-radio :label="4">技术待处理</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="问题类型" prop="questionType" style="width:95%">
                    <el-select v-model="form.questionType" placeholder="" clearable style="width:100%" @change="questionTypeChange">
                        <el-option
                            v-for="(item,index) in upQuestionTypeList"
                            :key="index"
                            :label="item.dictLabel"
                            :value="item.dictValueInt"
                        />
                    </el-select>
                    <!-- <div>{{questionTypeInfo}}</div> -->
                    <el-input type="textarea" :rows="4" v-model="questionTypeInfo" style="marginTop:10px"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width:95%">
                    <el-input type="textarea" :rows="5" v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getList,
    getInfo,
    getInfoList,
    delInspSiteInfo,
    getDicts,
    articleQuestionType
} from "@/api/biz/HomeManuscript";
import { getChannelArticlesSummary,editChannelArticlesSummary,getInfoChannelArticlesSummary,batchReSampling } from "@/api/biz/collect"
import { listInspChannelType } from "@/api/biz/pageUpdate";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "ColumnManuscript",
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
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                // scanDate: this.formatDate(new Date()), // 监测时间
                orderTypes: [], // 表格排序
                source: null,
                nameLike: null,
                countNum: null,
                linkLocation: null,
                processState: 1,
                url: null,
                charge: null,
                overdueState: null,
                specialTag: null,
                articlesNumGte: null,
                articlesNumLte: null,
                idStr: null,
                questionType: null, // 问题类型

            },
            articlesNumGteShow: false,
            articlesNumLteShow: false,
            // 栏目来源
            sourceList: [
                { label: '人工添加', value: 1 },
                { label: '栏目发现', value: 2 },  
            ],
            // 链接位置
            linkLocationList: [
                { label: '首页', value: 1 },
                { label: '栏目', value: 2 },
            ],
            // 处理情况
            processStateList: [
                { label: '未处理', value: 1 },
                { label: '已处理', value: 2 },
                // { label: '暂不处理', value: 3 },
                { label: '交付待处理', value: 3 },
                { label: '技术待处理', value: 4 },
            ],
            // 是否收费
            chargeList: [
                { label: '收费站点', value: true },
                { label: '免费站点', value: false },
            ],
            // 逾期不更新状态
            overdueStateList: [
                { label: '严重逾期', value: 1 },
                { label: '即将逾期', value: 2 },
                { label: '正常', value: 3 },
                { label: '不监测逾期', value: 4 },
            ],
            // 特殊情况
            specialTagList: [
                { label: '正常', value: 0 },
                { label: '疑似栏目撤稿', value: 1 },
            ],

            /**下拉菜单数据 */
            // 站点关系树选项
            inspSiteTreeOptions: [],
            channelTypeDate: [], // 栏目
            channelTypeArr: null,
            

            restaurants: [],
            timeout:  null,


            // 编辑
            open: false, 
            form: {
                showState: null
            },
            rules: {
                processState: [{ required: true, message: '请选择处理情况', trigger: 'change' }],
            },
            oldQuestionTypeList: [],
            questionTypeList: [],
            article_already: [], // 已处理
            article_manual: [], // 交付待处理
            article_program: [], // 技术待处理
            upQuestionTypeList: [],

            questionTypeInfo: null,


            
        };
    },
    
    created() {
        this.getList();
        this.getTreeselect();
        this.getChannelTypeDate();
        this.getArticleQuestionType();
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
        // 查询下拉栏目分类id数据
        getChannelTypeDate(){
            listInspChannelType({}).then(response => {
                console.log(response,'response')
                this.channelTypeDate = this.handleTree(
                    response.data,
                    "id",
                    "pid"
                );
                for(var i in this.channelTypeDate){
                    this.channelTypeDate[i].label = this.channelTypeDate[i].channelTypeName;
                    this.channelTypeDate[i].value = this.channelTypeDate[i].id;
                    for(var j in this.channelTypeDate[i].children){
                        this.channelTypeDate[i].children[j].label = this.channelTypeDate[i].children[j].channelTypeName;
                        this.channelTypeDate[i].children[j].value = this.channelTypeDate[i].children[j].id;
                    }
                }
                console.log(this.channelTypeDate)
                this.loading = false;
            });
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
                listInspSiteTree({parentSite:0, siteType:1}).then(response => {
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
                        siteType:1
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
            if(!this.articlesNumGteShow){
                this.queryParams.articlesNumGte = null;
            }
            if(!this.articlesNumLteShow){
                this.queryParams.articlesNumLte = null;
            }
            getChannelArticlesSummary(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    if(this.inspSiteInfoList[i].source == 1){
                        this.inspSiteInfoList[i].sourceTxt = '人工添加';
                    }else if(this.inspSiteInfoList[i].source == 2){
                        this.inspSiteInfoList[i].sourceTxt = '栏目发现';
                    }
                    if(this.inspSiteInfoList[i].linkLocation == 1){
                        this.inspSiteInfoList[i].linkLocationTxt = '首页';
                    }else if(this.inspSiteInfoList[i].linkLocation == 2){
                        this.inspSiteInfoList[i].linkLocationTxt = '栏目';
                    }

                    // 栏目分类
                    if(!this.inspSiteInfoList[i].channelTypeText){
                        this.inspSiteInfoList[i].channelTypeText = '--';
                    }
                    // 处理情况
                    if(this.inspSiteInfoList[i].processState == 1){
                        this.inspSiteInfoList[i].processStateTxt = '未处理';
                    }else if(this.inspSiteInfoList[i].processState == 2){
                        this.inspSiteInfoList[i].processStateTxt = '已处理';
                    }else if(this.inspSiteInfoList[i].processState == 3){
                        this.inspSiteInfoList[i].processStateTxt = '交付待处理';
                    }else if(this.inspSiteInfoList[i].processState == 4){
                        this.inspSiteInfoList[i].processStateTxt = '技术待处理';
                    }else{
                        this.inspSiteInfoList[i].processStateTxt = '--';
                    }


                    // 备注
                    if(!this.inspSiteInfoList[i].remark){
                        this.inspSiteInfoList[i].remark = '--';
                    }
                    
                    // 是否收费
                    if(this.inspSiteInfoList[i].charge == true){
                        this.inspSiteInfoList[i].chargeTxt = '收费站点';
                    }else if(this.inspSiteInfoList[i].charge == false){
                        this.inspSiteInfoList[i].chargeTxt = '免费站点';
                    }else{
                        this.inspSiteInfoList[i].chargeTxt = '--';
                    }
                    // 逾期不更新状态
                    if(this.inspSiteInfoList[i].overdueState == 1){
                        this.inspSiteInfoList[i].overdueStateTxt = '严重逾期';
                    }else if(this.inspSiteInfoList[i].overdueState == 2){
                        this.inspSiteInfoList[i].overdueStateTxt = '即将逾期';
                    }else if(this.inspSiteInfoList[i].overdueState == 3){
                        this.inspSiteInfoList[i].overdueStateTxt = '正常';
                    }else if(this.inspSiteInfoList[i].overdueState == 4){
                        this.inspSiteInfoList[i].overdueStateTxt = '不监测逾期';
                    }else{
                        this.inspSiteInfoList[i].overdueStateTxt = '--';
                    }
                    // 特殊情况
                    if(this.inspSiteInfoList[i].specialTag == 0){
                        this.inspSiteInfoList[i].specialTagTxt = '正常';
                    }else if(this.inspSiteInfoList[i].specialTag == 1){
                        this.inspSiteInfoList[i].specialTagTxt = '疑似栏目撤稿';
                    }else{
                        this.inspSiteInfoList[i].specialTagTxt = '--';
                    }
                    // 全站稿件量
                    if(this.inspSiteInfoList[i].articlesNum == null){
                        this.inspSiteInfoList[i].articlesNum = '--';
                    }
                    // 最后更新日期
                    if(!this.inspSiteInfoList[i].renewTime){
                        this.inspSiteInfoList[i].renewTime = '--';
                    }
                    // 未更新天数
                    if(this.inspSiteInfoList[i].noUpdateDay == null){
                        this.inspSiteInfoList[i].noUpdateDay = '--';
                    }
                    // // 最后更新标题
                    // if(!this.inspSiteInfoList[i].updateTitle){
                    //     this.inspSiteInfoList[i].updateTitle = '--';
                    // }
                    // // 最后更新链接
                    // if(!this.inspSiteInfoList[i].updateUrl){
                    //     this.inspSiteInfoList[i].updateUrl = '--';
                    // }

                    if(!this.inspSiteInfoList[i].updateTitle && !this.inspSiteInfoList[i].inspSiteInfoList){
                        this.inspSiteInfoList[i].updateTitleTxt = '--';
                    }else if(!this.inspSiteInfoList[i].updateTitle){
                        this.inspSiteInfoList[i].updateTitleTxt = this.inspSiteInfoList[i].inspSiteInfoList;
                    }else{
                        this.inspSiteInfoList[i].updateTitleTxt = this.inspSiteInfoList[i].updateTitle;
                    }
                    // 问题类型
                    this.inspSiteInfoList[i].questionTypeTxt = this.questionTypeList.find(item =>  parseInt(this.inspSiteInfoList[i].questionType) == item.dictValueInt)?.dictLabel;
                    if(!this.inspSiteInfoList[i].questionTypeTxt){
                        this.inspSiteInfoList[i].questionTypeTxt = '--';
                    }
                    
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            // this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate);
            this.getList();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.typeArr = null;
            this.channelTypeArr = null;
            this.queryParams.treeInfo.psCode = null;
            this.queryParams.channelTypePid = null;
            this.queryParams.channelTypeId = null;    
            this.queryParams.searchDateKey = 'ct';   
            
            this.queryParams.articlesNumGte = null;
            this.queryParams.articlesNumLte = null;
            this.articlesNumGteShow = false;
            this.articlesNumLteShow = false;
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
        /** 提交按钮 */
        submitForm4() {
            this.$refs["form4"].validate(valid => {
                if (valid) {
                    console.log(this.form4)
                    let subData = this.queryParams;
                    subData.menuType = 100;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '栏目稿件数据'
                        this.download(
                            "biz/articles/export",this.queryParams,
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
            let newName = null;
            if(prop == 'countNum'){
                newName = 'cn'
            }else{
                newName = prop;
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
        },


        // 编辑
        handleUpdate(row){
            console.log(row,'数据')
            this.questionTypeInfo = null;  
            this.upQuestionTypeList = [];
            // this.form.idStr = row.idStr;
            // this.form.processState = row.processState;
            // this.form.remark = row.remark;
            getInfoChannelArticlesSummary({id: row.idStr}).then((res)=>{
                this.$set(this.form,'idStr', res.data.idStr)
                this.$set(this.form,'processState', res.data.processState)
                this.$set(this.form,'remark', res.data.remark)
                if(res.data.questionType){
                    this.$set(this.form,'questionType', parseInt(res.data.questionType))      
                }else{
                    this.$set(this.form,'questionType', null)   
                }
                console.log(res.data.processState,'res.data.processState')
                if(res.data.processState == 2){ // 已处理
                    this.upQuestionTypeList = this.article_already;
                    this.questionTypeInfo = this.upQuestionTypeList.find(item => item.dictValue == this.form.questionType)?.remark;
                }else if(res.data.processState == 3){ // 交付待处理
                    this.upQuestionTypeList = this.article_manual;
                    this.questionTypeInfo = this.upQuestionTypeList.find(item => item.dictValue == this.form.questionType)?.remark;
                }else if(res.data.processState == 4){ // 技术待处理
                    this.upQuestionTypeList = this.article_program;
                    this.questionTypeInfo = this.upQuestionTypeList.find(item => item.dictValue == this.form.questionType)?.remark;
                }else{
                    this.upQuestionTypeList = this.questionTypeList;
                }
                this.open = true;
            })
            
        },
        // 跳转
        goColumn(row){
            sessionStorage.setItem('columnObj',JSON.stringify(row));
            this.$router.push({ path: '/collect/column' })
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.form = {}
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    let data = {
                        idStr: this.form.idStr,
                        processState: this.form.processState,
                        remark: this.form.remark, 
                        questionType: this.form.questionType
                    }
                    editChannelArticlesSummary(data).then((res)=>{
                        this.$modal.msgSuccess("操作成功");  
                        this.open = false;
                        this.getList();

                    })
                    
                }
            });
        },

        handleFocus(type) {
            // 当用户点击“空”输入框时，自动切换到计数器并聚焦
            if(type == 1){
                // this.queryParams.articlesNumGte = this.$options.data().value; // 或者一个默认值，如 1
                this.articlesNumGteShow = true;
            }else if(type == 2){
                // this.queryParams.articlesNumLte = this.$options.data().value; // 或者一个默认值，如 1
                this.articlesNumLteShow = true;
            }
            this.$nextTick(() => {
                // 使用 ref 来获取焦点
                // this.$refs.inputNumber.focus(); // 需要给 el-input-number 加上 ref="inputNumber"
            });
        },

        // 重新采集
        handleUpdate3(type,row){
            let data = null;
            if(type == 1){ // 单个
                data = {
                    ids: [row.idStr]
                }
            }else if(type == 2){ // 批量
                data = {
                    ids: this.ids
                }
            }
            batchReSampling(data).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
        },
        // 编辑
        // 获取问题类型
        getArticleQuestionType(){
            articleQuestionType().then((res)=>{
                this.questionTypeList = [...res.data.questionTypeList,...res.data.pubTypeList];
                // const groupedMap = new Map();
                // for (const item of res.data) {
                //     let dictType = null;
                //     if(item.dictType == 'article_already'){
                //         dictType = '已处理'
                //     }else if(item.dictType == 'article_manual'){
                //         dictType = '交付待处理'
                //     }else if(item.dictType == 'article_program'){
                //         dictType = '技术待处理'
                //     }
                    
                //     if (!groupedMap.has(dictType)) {
                //         groupedMap.set(dictType, {
                //             label: dictType,
                //             options: []
                //         });
                //     }
                    
                //     groupedMap.get(dictType).options.push({
                //         value: item.dictValue,
                //         label: item.dictLabel
                //     });
                // }

                // this.oldQuestionTypeList = Array.from(groupedMap.values());
                console.log(this.questionTypeList,'this.questionTypeList')

                // console.log(this.oldQuestionTypeList,'this.oldQuestionTypeList');
                for(var i in this.questionTypeList){
                    if(this.questionTypeList[i].dictType == 'article_already'){
                        this.article_already.push(this.questionTypeList[i])
                    }else if(this.questionTypeList[i].dictType == 'article_manual'){
                        this.article_manual.push(this.questionTypeList[i])
                    }else if(this.questionTypeList[i].dictType == 'article_program'){
                        this.article_program.push(this.questionTypeList[i])
                    }
                }
                this.article_already = [...this.article_already,...res.data.pubTypeList]
                this.article_manual = [...this.article_manual,...res.data.pubTypeList]
                this.article_program = [...this.article_program,...res.data.pubTypeList]
            })
        },
        // 处理情况点击
        processStateChange(){
            this.form.questionType = null;
            this.questionTypeInfo = null;
            this.upQuestionTypeList = [];
            if(this.form.processState == 2){ // 已处理
                this.upQuestionTypeList = this.article_already;
            }else if(this.form.processState == 3){ // 交付待处理
                this.upQuestionTypeList = this.article_manual;
            }else if(this.form.processState == 4){ // 技术待处理
                this.upQuestionTypeList = this.article_program;
            }
        },
        questionTypeChange(){
            if(this.form.questionType){
               this.questionTypeInfo = this.upQuestionTypeList.find(item => item.dictValue == this.form.questionType)?.remark;
            }
        },

        // 复制栏目地址加网站标识码
        copyChange(val){
            console.log(val,'val')
            if(val.url){
                this.queryParams.url = val.url;
                navigator.clipboard.writeText(this.queryParams.url);
            }
        },

    }
};
</script>
<style scoped lang="scss">
    // .app-container{
    //     width: 100%;
    //     height: 100%!important;
    // }
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