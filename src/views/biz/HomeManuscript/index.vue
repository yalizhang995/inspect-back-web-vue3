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
            <el-form-item label="主管单位" prop="">
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
            <el-form-item label="稿件地址" prop="url">
                <el-input
                    v-model="queryParams.url"
                    placeholder="请输入稿件地址"
                    clearable
                    style="width:310px;"
                />
            </el-form-item>
            <el-form-item label="父URL地址" prop="fromUrl">
                <el-input
                    v-model="queryParams.fromUrl"
                    placeholder="请输入父URL地址"
                    clearable
                    style="width:310px;"
                />
            </el-form-item>
            <el-form-item label="" prop="">
                 <el-select v-model="queryParams.searchDateKey" clearable placeholder="请选择" style="width:100px;margin:0 10px 0 0px" @change="sjChange" >
                    <el-option
                    v-for="item in shsjList"
                    :key="item.val"
                    :label="item.label"
                    :value="item.val">
                    </el-option>
                </el-select>
                <!-- <el-date-picker 
                v-model="scanDate" 
                type="date" 
                placeholder="选择日期"
                :picker-options="expireTimeOPtion"
                style="width:290px"
                ></el-date-picker> -->
                <el-date-picker
                    v-model="scanDate"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="sjrqChange"
                    style="width:300px"
                    :picker-options="expireTimeOPtion"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="检查撤稿时间" prop="checkDate">
                <el-date-picker
                    v-model="queryParams.checkDate"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    style="width:310px">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="marginLeft:10px">
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
                    type="warning"
                    plain
                    icon="el-icon-thumb"
                    size="mini"
                    :disabled="multiple"
                    @click="handleUpdate3(2)"
                >批量重采</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-thumb"
                    size="mini"
                    @click="handleUpdate10"
                >首页稿件重采</el-button>
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
            <el-table-column prop="index" label="序号" width="80" align="center" fixed></el-table-column>
            <el-table-column prop="siteName" label="网站名称" width="260" fixed show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.siteUrl)" v-if="scope.row.siteName!='--'">{{ scope.row.siteName}}</span>
                    <span v-if="scope.row.siteName=='--'">{{ scope.row.siteName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="siteCode" label="网站标识码"   sortable="custom" width="140"></el-table-column>
            <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                <template slot-scope="scope">
                    <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="countNum" label="更新数"   align="center" sortable="custom" width="100"></el-table-column> -->

            <!-- <el-table-column prop="title" label="稿件标题" width="300"  >
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top">
                        <span class="sxw">{{ scope.row.title}}</span>
                    </el-tooltip>
                    
                </template>
            </el-table-column>
            <el-table-column prop="url" label="稿件地址"  width="300" >
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top">
                        <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                    </el-tooltip>
                    
                </template>
            </el-table-column> -->
            <el-table-column prop="title" label="稿件标题"  width="" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top"> -->
                        <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                    <!-- </el-tooltip> -->
                    
                </template>
            </el-table-column>
            <el-table-column label="" prop="channelName" width="60">
                <template slot-scope="scope">
                    <el-tooltip  class="item" effect="dark" content="点此复制URL地址" placement="top-start">
                        <i class="el-icon-connection dz"  @click="copyChange2(scope.row)"></i>
                    </el-tooltip> 
                </template>
            </el-table-column>
            <el-table-column prop="fromUrl" label="父URL地址" width="240" show-overflow-tooltip>
                <template slot-scope="scope">
                    <!-- <el-tooltip class="item" effect="dark" :content="scope.row.fromUrl" placement="top"> -->
                        <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromUrl}}</span>
                    <!-- </el-tooltip> -->
                    
                </template>
            </el-table-column>
            <el-table-column label="" prop="channelName" width="60">
                <template slot-scope="scope">
                    <el-tooltip  class="item" effect="dark" content="点此复制父URL地址" placement="top-start">
                        <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                    </el-tooltip> 
                </template>
            </el-table-column>
            <el-table-column prop="specialTagTxt" align="center" label="特殊情况" width="140"></el-table-column>
            <!-- <el-table-column prop="scanDate" label="监测时间" width="180"></el-table-column> -->
            <el-table-column prop="pubTime" label="发布时间" width="160" sortable="custom"></el-table-column>
            <el-table-column prop="scanTime" label="发现时间" width="160" sortable="custom"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="重新采集" placement="top">
                        <i class="el-icon-thumb" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate3(1,scope.row)"></i>
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

        <!-- 稿件重采 -->
        <el-dialog title="稿件重采" :visible.sync="open10" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel10">
            <el-form ref="form10" :model="form10" :rules="rules10" label-width="120px">
                <el-form-item label="网站标识码" prop="siteCode">
                    <el-input v-model="form10.siteCode" placeholder="请输入网站标识码" clearable style="width:90%" />
                </el-form-item>
                <el-form-item label="首页地址" prop="fromUrl">
                    <el-input v-model="form10.fromUrl" placeholder="请输入首页地址" clearable style="width:90%" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm10">确 定</el-button>
                <el-button @click="cancel10">取 消</el-button>
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
    recollect,
    recollectChannel
} from "@/api/biz/HomeManuscript";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "HomeManuscript",
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
                orderTypes: [{code: 1, name: "pti"}], // 表格排序
                linkLocation: 1, 
                searchDateKey: 'sct',
                startDate: this.formatDate(new Date())+' 00:00:00',
                endDate: this.formatDate(new Date())+' 23:59:59',
                fromUrl: null,
                url: null,
                checkDate: null, // 检查撤稿时间

            },
            // scanDate: this.formatDate(new Date()),
            scanDate: [new Date(),new Date()],

            shsjList: [ 
                { label: '发现时间', val: 'sct' },
                { label: '发布时间', val: 'pti' },
            ],

            /**下拉菜单数据 */
            // 站点关系树选项
            inspSiteTreeOptions: [],

            // 导出
            open4: false, 
            form4: {
                menuType: 90
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            restaurants: [],
            timeout:  null,

            // 稿件重采
            open10: false, 
            form10: {
                siteCode: null,
                fromUrl: null
            },
            rules10: {
                siteCode: [{ required: true, message: '请输入网站标识码', trigger: 'blue' }],
                fromUrl: [{ required: true, message: '请输入地址', trigger: 'blue' }],
            },
            
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('homeManuscriptObj')
        sessionStorage.removeItem('homeManuscriptColumnObj')
        next();

    },
    created() {
        
        // this.getList();
        
    },
    activated(){
        // 首页更新跳转
        if(sessionStorage.getItem('homeManuscriptObj')){
            let homeManuscriptObj = JSON.parse(sessionStorage.getItem('homeManuscriptObj'));
            this.$set(this.queryParams,'siteCode', homeManuscriptObj.siteCode)
            this.$set(this.queryParams,'fromUrl', homeManuscriptObj.url)
            if(homeManuscriptObj.specialTag == 1){
                this.$set(this.queryParams,'checkDate', homeManuscriptObj.renewTime)
            }
            this.scanDate = [];
            this.queryParams.startDate = null;
            this.queryParams.endDate = null;
        }
        // 爬虫任务跳转
        if(sessionStorage.getItem('homeManuscriptColumnObj')){
            let homeManuscriptObj = JSON.parse(sessionStorage.getItem('homeManuscriptColumnObj'));
            this.$set(this.queryParams,'siteCode', homeManuscriptObj.siteCode)
            this.$set(this.queryParams,'fromUrl', homeManuscriptObj.url)
            this.scanDate = [];
            this.queryParams.startDate = null;
            this.queryParams.endDate = null;
        }
        this.handleQuery();
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
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.scanDate = [];
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
            }
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
            
            getInfoList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 特殊情况
                    if(this.inspSiteInfoList[i].specialTag == 0){ 
                        this.inspSiteInfoList[i].specialTagTxt = '正常';
                    }else if(this.inspSiteInfoList[i].specialTag == 1){ 
                        this.inspSiteInfoList[i].specialTagTxt = '疑似栏目撤稿';
                    }
                    
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            // if(this.scanDate){
            //     this.queryParams.startDate = this.formatDate(this.scanDate) + ' 00:00:00';
            //     this.queryParams.endDate = this.formatDate(this.scanDate) + ' 23:59:59';
            // }else{
            //     this.queryParams.startDate = null;
            //     this.queryParams.endDate = null;
            // }
            console.log(this.scanDate)
            if(this.scanDate){
                this.queryParams.startDate = this.scanDate[0];
                this.queryParams.endDate = this.scanDate[1];
                if(this.queryParams.startDate){
                    this.queryParams.startDate = this.formatDate(this.queryParams.startDate) + ' 00:00:00';
                }
                if(this.queryParams.endDate){
                    this.queryParams.endDate = this.formatDate(this.queryParams.endDate) + ' 23:59:59';
                }
            }
            if(this.queryParams.checkDate){
                this.queryParams.checkDate = this.formatDate(this.queryParams.checkDate);
            }else{
                this.queryParams.checkDate = null;
            }

            if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null){
                this.getList();                
            }else{
                this.$modal.msgWarning("主管单位/网站标识码请至少输入其中一项");
                this.inspSiteInfoList = [];
                this.total = 0;
            }
            // this.queryParams.scanDate = this.formatDate(this.queryParams.scanDate);
            // this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            // this.queryParams.scanDate = this.formatDate(new Date());
            // this.scanDate = null;
            this.scanDate = [new Date(),new Date()];
            // this.queryParams.startDate = this.formatDate(this.scanDate) + ' 00:00:00';
            // this.queryParams.endDate = this.formatDate(this.scanDate) + ' 23:59:59';
            this.queryParams.startDate = this.formatDate(this.queryParams.startDate) + ' 00:00:00';
            this.queryParams.endDate = this.formatDate(this.queryParams.endDate) + ' 23:59:59';
            this.typeArr = null;
            this.queryParams.treeInfo.psCode = null;
            this.queryParams.searchDateKey = 'sct';  
            this.resetForm("queryForm");

            this.$set(this.queryParams,'siteCode', null)
            this.$set(this.queryParams,'fromUrl',null)
            this.$set(this.queryParams,'checkDate', null)
            sessionStorage.removeItem('homeManuscriptObj')
            sessionStorage.removeItem('homeManuscriptColumnObj')

            
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
                menuType: 90,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 90,
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
                    subData.menuType = 90;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '首页稿件数据'
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
            let newName = null;
            if(prop == 'pubTime'){
                newName = 'pti'
            }else if(prop == 'scanTime'){
                newName = 'sct'
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

        sjChange(){
            // this.scanDate = null;
        },

        // 复制栏目地址加网站标识码
        copyChange(val){
            console.log(val,'val')
            if(val.fromUrl){
                this.queryParams.fromUrl = val.fromUrl;
                navigator.clipboard.writeText(this.queryParams.fromUrl);
            }
        },
        copyChange2(val){
            console.log(val,'val')
            if(val.url){
                this.queryParams.url = val.url;
                navigator.clipboard.writeText(this.queryParams.url);
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
                    idIn: [row.idStr]
                }
            }else if(type == 2){ // 批量
                data = {
                    idIn: this.ids
                }
            }
            console.log(data,'data')
            recollect(data).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
        },
        // 稿件重采
        handleUpdate10(){
            this.open10 = true;
            this.reset10();
        },
        reset10(){
            this.form10 = {
                siteCode: null,
                fromUrl: null,
            }
            this.resetForm("form10");
        },
        // 取消按钮
        cancel10() {
            this.open10 = false;
            this.reset10();            
        },
        /** 提交按钮 */
        submitForm10() {
            this.$refs["form10"].validate(valid => {
                if (valid) {
                    console.log(this.form10,'this.form10')
                    recollectChannel(this.form10).then((res)=>{
                        this.$modal.msgSuccess("稿件已开始重新采集");
                        this.open10 = false;
                        this.getList();
                    })
                    
                }
            });
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