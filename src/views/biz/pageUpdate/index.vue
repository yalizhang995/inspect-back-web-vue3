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
                    @select="handleSelectCompany2"
                    style="width:300px"
                ></el-autocomplete>
            </el-form-item>                
            <el-form-item label="网站标识码" prop="siteCode" >
                <el-autocomplete
                    v-model="queryParams.siteCode"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    clearable
                    style="width:300px"
                    @select="handleSelectCompany"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="监测时间" prop="" >
                <el-date-picker 
                v-model="queryParams.scanDate" 
                type="date" 
                placeholder="选择日期"
                :picker-options="expireTimeOPtion"
                style="width:300px"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="逾期不更新状态" prop="overdueState">
                <el-select v-model="queryParams.overdueState" clearable placeholder="请选择逾期不更新状态" style="width:300px">
                    <el-option
                        v-for="item in yqbgxztList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="特殊情况" prop="specialTag" >
                <el-select v-model="queryParams.specialTag" clearable placeholder="请选择特殊情况" style="width:300px">
                    <el-option
                        v-for="item in specialTagList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="marginLeft:26px">
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
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
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
            <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
            <el-table-column prop="siteName" label="网站名称" width="240" fixed show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="title" label="快照" width="80" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="overdueStateTxt" label="逾期不更新状态" align="center" width="120">
                <template slot-scope="scope">
                    <span class="wtjb"><span class="yd" :style="{background: scope.row.overdueStateBgColor}"></span>{{ scope.row.overdueStateTxt}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="noUpdateDay" label="未更新天数" width="120" align="center" sortable="custom"></el-table-column>
            <!-- <el-table-column prop="updateTitle" label="更新标题" width="280">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.updateTitle" placement="top" v-if="scope.row.updateTitle!='--'">
                        <span class="sxw">{{scope.row.updateTitle}}</span>
                    </el-tooltip>
                    <span class="sxw" v-if="scope.row.updateTitle=='--'">{{scope.row.updateTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateUrl" label="更新文章" width="280">
                <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.updateUrl" placement="top" v-if="scope.row.updateUrl!='--'">
                        <span class="dz" @click="dzChange(scope.row.updateUrl)">{{scope.row.updateUrl}}</span>
                    </el-tooltip>
                    <span v-if="scope.row.updateUrl=='--'">{{scope.row.updateUrl}}</span>
                </template>
            </el-table-column> -->
             <el-table-column prop="updateTitle" label="更新标题" show-overflow-tooltip>
                <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" :content="scope.row.updateTitle" placement="top" v-if="scope.row.updateTitle!='--'">
                        <span class="dz" @click="dzChange(scope.row.updateUrl)">{{scope.row.updateTitle}}</span>
                    </el-tooltip>
                    <span v-if="scope.row.updateTitle=='--'">{{scope.row.updateTitle}}</span> -->
                    <span class="dz" v-if="scope.row.updateTitle!='--'" @click="dzChange(scope.row.updateUrl)" >{{scope.row.updateTitle}}</span>
                    <span v-if="scope.row.updateTitle=='--'">{{scope.row.updateTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="specialTagTxt" align="center" label="特殊情况" width="140"></el-table-column>
            <el-table-column prop="renewTime" label="最后更新时间" width="160"  sortable="custom"></el-table-column>
            <el-table-column prop="scanDate" label="监测时间" width="120"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看稿件" placement="top">
                        <i class="el-icon-mobile" style="cursor: pointer;font-size:15px;marginRight:10px;" @click="goManuscript(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="重新采集" placement="top">
                        <i class="el-icon-thumb" style="cursor: pointer;font-size:15px;marginRight:10px;" v-hasPermi="['biz:pageUpdate:column']"  @click="handleUpdate3(1,scope.row)"></i>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" content="修正" placement="top">
                        <i class="el-icon-edit" style="cursor: pointer;font-size:15px;marginRight:10px;" @click="handleUpdate2(scope.row)"></i>
                    </el-tooltip> -->
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-delete" style="cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
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

        <!-- 修正 -->
        <el-drawer
            title="修正"
            :before-close="cancelForm"
            :visible.sync="dialog"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer"
            :wrapperClosable='false'
            >
            <div class="drawerCon">
                <div class="concon">
                    <div class="conTop">
                        <ul class="ul">
                            <li style="font-weight: bold;font-size:18px;marginLeft:0;">{{editObj.siteName}}：<span>{{editObj.siteCode}}</span></li>
                            <li>监测时间：<span>{{editObj.scanDate}}</span></li>
                            <!-- <li>逾期不更新状态：<span>待审核</span></li> -->
                        </ul>
                    </div>
                    <el-form ref="formform" :model="form" :rules="rules" label-width="120px" style="marginTop:20px">
                        <el-form-item label="最后更新时间" prop="renewTime">
                            <el-date-picker 
                                v-model="form.renewTime" 
                                type="date" 
                                :picker-options="expireTimeOPtion2" 
                                placeholder="选择最后更新时间" 
                                style="width:97%"
                                @change="sjChange"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="逾期不更新状态" prop="overdueState">
                            <el-select v-model="form.overdueState" placeholder="请选择逾期不更新状态" disabled style="width:97%">
                                <el-option
                                    v-for="item in yqbgxztList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <!-- yqbgxztList -->
                        <el-form-item label="未更新天数" prop="noUpdateDay">
                            <el-input v-model="form.noUpdateDay" disabled style="width:97%"></el-input>
                        </el-form-item>
                        <el-form-item label="更新标题" prop="updateTitle">
                            <!-- <el-input v-model="form.updateTitle"  style="width:97%"></el-input> -->
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="form.updateTitle" style="width:97%"> </el-input>
                        </el-form-item>
                        <el-form-item label="更新URL" prop="updateUrl">
                            <!-- <el-input v-model="form.updateUrl"  style="width:97%"></el-input> -->
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入内容" v-model="form.updateUrl" style="width:97%"> </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="demo-drawer__footer" style="text-align:right">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                    <!-- <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button> -->
                </div>
            </div>
        </el-drawer>
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
    batchReSampling
} from "@/api/biz/pageUpdate";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "PageUpdate",
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
                type: 1,
                pgNum: 1,
                pgSize: 10,
                // siteCodeOrg: null, // 标识码-主管
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                scanDate: this.formatDate(new Date()),
                orderTypes: [], // 表格排序
                // reviewResult: null, // 整改状态
                overdueState: null,
                specialTag: null, // 特殊情况

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
                { label: '忽略', val: 3 },
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
            // 特殊情况
            specialTagList: [
                { label: '正常', val: 0 },
                { label: '疑似栏目撤稿', val: 1 },
            ],


            // 整改
            form: {},
            rules: {
                renewTime: [{ required: true, message: '请选择最后更新时间', trigger: 'change' }],
                noUpdateDay: [{ required: true, message: '请输入未更新天数', trigger: 'blur' }],
                overdueState: [{ required: true, message: '请选择逾期不更新状态', trigger: 'change' }],
            },

            editObj: {},

            // 站点关系树选项
            inspSiteTreeOptions: [],

            domain: null, // 域名删除

            timer: null,
            dialog: false,

            // 逾期不更新状态
            yqbgxztList: [
                { label: '严重逾期', val: 1 },
                { label: '即将逾期', val: 2 },
                { label: '正常', val: 3 },
            ],

            // 导出
            open4: false, 
            form4: {
                menuType: 70
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            restaurants: [],
            timeout:  null
            
        };
    },
    created() {
        this.getList();
        this.getTreeselect();
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
            listInspSiteInfo(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    if(!this.inspSiteInfoList[i].suggest){
                        this.inspSiteInfoList[i].suggest = '--';
                    }
                    // 问题级别状态颜色
                    if(this.inspSiteInfoList[i].overdueState == 1){ // 严重
                        this.inspSiteInfoList[i].overdueStateTxt = '严重逾期';
                        this.inspSiteInfoList[i].overdueStateBgColor = '#ff6563';
                    }else if(this.inspSiteInfoList[i].overdueState == 2){ // 一般
                        this.inspSiteInfoList[i].overdueStateTxt = '即将逾期';
                        this.inspSiteInfoList[i].overdueStateBgColor = '#ea9940';
                    }else if(this.inspSiteInfoList[i].overdueState == 3){ // 轻微
                        this.inspSiteInfoList[i].overdueStateTxt = '正常';
                        this.inspSiteInfoList[i].overdueStateBgColor = '#48b93f';
                    }
                    if(!this.inspSiteInfoList[i].siteName){
                        this.inspSiteInfoList[i].siteName = '--';
                    }
                    if(!this.inspSiteInfoList[i].siteCode){
                        this.inspSiteInfoList[i].siteCode = '--';
                    }
                    // if(!this.inspSiteInfoList[i].noUpdateDay){
                    //     this.inspSiteInfoList[i].noUpdateDay = '--';
                    // }
                    if(!this.inspSiteInfoList[i].noUpdateDay && this.inspSiteInfoList[i].noUpdateDay != 0){
                        this.inspSiteInfoList[i].noUpdateDay = '--';
                    }


                    if(!this.inspSiteInfoList[i].updateUrl){
                        this.inspSiteInfoList[i].updateUrl = '--';
                    }
                    if(!this.inspSiteInfoList[i].updateTitle){
                        this.inspSiteInfoList[i].updateTitle = '--';
                    }
                    if(!this.inspSiteInfoList[i].renewTime){
                        this.inspSiteInfoList[i].renewTime = '--';
                    }
                    if(!this.inspSiteInfoList[i].reviewResult){
                        this.inspSiteInfoList[i].reviewResultTxt = '--';
                    }
                    // 整改状态
                    if(this.inspSiteInfoList[i].reviewResult == 1){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '待整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 2){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '已整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 3){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '忽略';
                    }
                    // 特殊情况
                    if(this.inspSiteInfoList[i].specialTag == 0){ 
                        this.inspSiteInfoList[i].specialTagTxt = '正常';
                    }else if(this.inspSiteInfoList[i].specialTag == 1){ 
                        this.inspSiteInfoList[i].specialTagTxt = '疑似栏目撤稿';
                    }
                    
                }
            });
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                siteCode: null,
                word: null,
                suggest: null,
                severity: null,
                showState: null,
                explanation: null,
            };
            this.editObj = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.queryParams.scanDate){
                this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate);
            }else{
                this.queryParams.scanDate = null;
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.scanDate = this.formatDate(new Date());
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加站点信息";
        },
        /** 取消按钮 */        
        cancelForm() {
            this.dialog = false;
            this.resetForm("formform");            
        },
        /** 修改按钮操作 */
        handleUpdate2(row,index) {
            // this.form2 = {
            //     idStr: null,
            //     reviewResult: null,
            // }
            // this.resetForm("form2");
            const id = row.idStr || this.ids;
            getInspSiteInfo({id:id}).then(response => {
                this.editObj = response.data;
                this.form.id = response.data.idStr;
                this.$set(this.form, "renewTime", response.data.renewTime);
                this.$set(this.form, "noUpdateDay", response.data.noUpdateDay);
                this.$set(this.form, "overdueState", response.data.overdueState);
                this.$set(this.form, "updateTitle", response.data.updateTitle);
                this.$set(this.form, "updateUrl", response.data.updateUrl);
                // overdueState
                console.log(this.editObj,'this.form-header')
                this.dialog = true;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["formform"].validate(valid => {
                if (valid) {
                    console.log(this.form)
                    this.form.renewTime = this.formatDate(this.form.renewTime);
                    if (this.form.id != null) {
                        updateInspSiteInfo(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.dialog = false;
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
                menuType: 70,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 70,
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
                    subData.menuType = 70;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '首页更新数据'
                        this.download(
                            "biz/pageUpdate/export",this.queryParams,
                            `${fileName}.xlsx`
                        ).then((res)=>{
                            this.open4 = false;
                        });
                    }
                    
                }
            });
        },

        // 时间
        sjChange(val){
            console.log(val,val)
            if(val){
                let data = {
                    id: this.form.id,
                    renewTime: this.formatDate(this.form.renewTime)
                }
                queryNoUpdateDay(data).then((res)=>{
                    this.$set(this.form, "noUpdateDay", res.data.noUpdateDay);  
                    this.$set(this.form, "overdueState", res.data.overdueState);       
                })
            }
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
            // if(order == 'descending'){ // 下
            //     this.queryParams.orderTypes = [{ code: 1, name: prop }];
            //     this.getList(); // 列表数据
            // }else if(order == 'ascending'){ // 上
            //     this.queryParams.orderTypes = [{ code: 0, name: prop }];
            //     this.getList(); // 列表数据
            // }else{ // 取消
            //     this.queryParams.orderTypes = [];
            //     this.getList(); // 列表数据
            // }
            let newName = '';
            if(prop == 'noUpdateDay'){ // 未更新天数
                newName = 'nud';
            }else if(prop == 'siteCode'){ // 网站标识码
                newName = 'sc';
            }else if(prop == 'renewTime'){ // 最后更新时间
                newName = 'rt';
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

        // 跳转稿件页面
        goManuscript(item){
            sessionStorage.setItem('homeManuscriptObj',JSON.stringify(item))
            this.$router.push({path: '/machine/HomeManuscript'})
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