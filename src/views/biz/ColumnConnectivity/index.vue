<!-- 栏目连通性 -->
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
            <el-form-item label="主管单位" prop="" style="marginLeft:-20px">
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
            <el-form-item label="监测时间" prop="">
                <el-date-picker 
                v-model="queryParams.scanDate" 
                type="date" 
                placeholder="选择日期"
                :picker-options="expireTimeOPtion"
                style="width:310px"
                ></el-date-picker>
            </el-form-item>
            <el-form-item style="marginLeft:10px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
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
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 确定不连通 -->
            <el-tab-pane label="确定不连通" name="2">
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                >
                    <el-table-column prop="index" label="序号" width="78" align="center" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)" v-if="scope.row.siteName!='--'">{{ scope.row.siteName}}</span>
                            <span v-if="scope.row.siteName=='--'">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" sortable="custom" width="110" fixed></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间"  width="166" align="center"> </el-table-column>
                    <el-table-column prop="httpStateTxt" label="监测结果"  width="120" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.httpStateTxtBgColor}"></span>{{ scope.row.httpStateTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="第一次连通确认" align="center">
                        <el-table-column  prop="oneArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="oneIp" label="IP" width="140" align="center"> </el-table-column> -->
                        <el-table-column  prop="httpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="httpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第二次连通确认" align="center">
                        <el-table-column  prop="twoArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="twoIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="twoHttpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="twoHttpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第三次连通确认" align="center">
                        <el-table-column  prop="threeArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="threeIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="threeHttpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="threeHttpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <!-- 疑似不连通 -->
            <el-tab-pane label="疑似不连通" name="3">
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                >
                    <el-table-column prop="index" label="序号" width="78" align="center" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)" v-if="scope.row.siteName!='--'">{{ scope.row.siteName}}</span>
                            <span v-if="scope.row.siteName=='--'">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" sortable="custom" width="110" fixed></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间"  width="166" align="center"> </el-table-column>
                    <el-table-column prop="httpStateTxt" label="监测结果" align="center"  width="120">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.httpStateTxtBgColor}"></span>{{ scope.row.httpStateTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="第一次连通确认" align="center">
                        <el-table-column  prop="oneArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="oneIp" label="IP" width="140" align="center"> </el-table-column> -->
                        <el-table-column  prop="httpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="httpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第二次连通确认" align="center">
                        <el-table-column  prop="twoArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="twoIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="twoHttpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="twoHttpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第三次连通确认" align="center">
                        <el-table-column  prop="threeArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="threeIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="threeHttpCode" label="返回码" width="90" align="center"> </el-table-column>
                        <el-table-column  prop="threeHttpTime" label="耗时(ms)" width="90" align="center"> </el-table-column>
                    </el-table-column>
                    <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <!-- 成功连通 -->
            <el-tab-pane label="成功连通" name="1">
                <el-table
                    v-loading="loading"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                >
                    <el-table-column prop="index" label="序号" width="78" align="center" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)" v-if="scope.row.siteName!='--'">{{ scope.row.siteName}}</span>
                            <span v-if="scope.row.siteName=='--'">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" sortable="custom" width="110" fixed align="center"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间"  width="166" align="center"> </el-table-column>
                    <el-table-column prop="httpStateTxt" label="监测结果"  width="120" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.httpStateTxtBgColor}"></span>{{ scope.row.httpStateTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="第一次连通确认" align="center">
                        <el-table-column  prop="oneArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="oneIp" label="IP" width="140" align="center"> </el-table-column> -->
                        <el-table-column  prop="httpCode" label="返回码" width=90 align="center"> </el-table-column>
                        <el-table-column  prop="httpTime" label="耗时(ms)" width=90 align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第二次连通确认" align="center">
                        <el-table-column  prop="twoArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="twoIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="twoHttpCode" label="返回码" width=90 align="center"> </el-table-column>
                        <el-table-column  prop="twoHttpTime" label="耗时(ms)" width=90 align="center"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="第三次连通确认" align="center">
                        <el-table-column  prop="threeArea" label="监测点" width="155" align="center"> </el-table-column>
                        <!-- <el-table-column  prop="threeIp" label="IP" width="130" align="center"> </el-table-column> -->
                        <el-table-column  prop="threeHttpCode" label="返回码" width=90 align="center"> </el-table-column>
                        <el-table-column  prop="threeHttpTime" label="耗时(ms)" width=90 align="center"> </el-table-column>
                    </el-table-column>
                    <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
        </el-tabs>

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
    </div>
</template>

<script>
import {
    getInspSiteTreeList,
    getList,
    getSpecsMapEnum,
    getInfoList
} from "@/api/biz/ColumnConnectivity";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
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
            tableData: [],
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
                httpState: 2,

            },
            activeName: '2',

            /**下拉菜单数据 */
            // 站点关系树选项
            inspSiteTreeOptions: [],

            // 导出
            open4: false, 
            form4: {
                menuType: 112
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
        // tab
        handleClick(tab, event) {
            this.queryParams.httpState = parseInt(tab.name)
            this.getList();
            console.log(this.queryParams,'this.queryParams.')
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            getInfoList(this.queryParams).then((res)=>{
                this.tableData = res.rows;
                this.total = res.total;
                for(var i in this.tableData){
                    this.tableData[i].index = parseInt(i)+1;
                    //监测结果
                    if(this.tableData[i].httpState == 1){
                        this.tableData[i].httpStateTxt = '正常连通';
                        this.tableData[i].httpStateTxtBgColor = '#48b93f';
                    }else if(this.tableData[i].httpState == 2){
                        this.tableData[i].httpStateTxt = '确认不连通';
                        this.tableData[i].httpStateTxtBgColor = '#ff6563';
                    }else if(this.tableData[i].httpState == 3){
                        this.tableData[i].httpStateTxt = '疑似不连通';
                        this.tableData[i].httpStateTxtBgColor = '#ea9940';
                    }
                    // 第一次连通确认
                    if(!this.tableData[i].oneArea){
                        this.tableData[i].oneArea = '--';
                    }
                    if(!this.tableData[i].oneIp){
                        this.tableData[i].oneIp = '--';
                    }
                    if(!this.tableData[i].httpCode){
                        this.tableData[i].httpCode = '--';
                    }
                    if(!this.tableData[i].httpTime){
                        this.tableData[i].httpTime = '--';
                    }
                    // 第二次连通确认
                    if(!this.tableData[i].twoArea){
                        this.tableData[i].twoArea = '--';
                    }
                    if(!this.tableData[i].twoIp){
                        this.tableData[i].twoIp = '--';
                    }
                    if(!this.tableData[i].twoHttpCode){
                        this.tableData[i].twoHttpCode = '--';
                    }
                    if(!this.tableData[i].twoHttpTime){
                        this.tableData[i].twoHttpTime = '--';
                    }
                    // 第三次连通确认
                    if(!this.tableData[i].threeArea){
                        this.tableData[i].threeArea = '--';
                    }
                    if(!this.tableData[i].threeIp){
                        this.tableData[i].threeIp = '--';
                    }
                    if(!this.tableData[i].threeHttpCode){
                        this.tableData[i].threeHttpCode = '--';
                    }
                    if(!this.tableData[i].threeHttpTime){
                        this.tableData[i].threeHttpTime = '--';
                    }

                }
                this.loading = false;
            })
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
            this.typeArr = null;
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.idStr || this.ids;
            this.$modal
                // .confirm('是否确认删除站点信息编号为"' + ids + '"的数据项？')
                .confirm('是否确认删除该条数据？')
                .then(function() {
                    console.log(ids)
                    return delInspSiteInfo({ids:[ids]});
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {
                    this.$modal.msg("已取消删除");
                });
        },
        // 表单重置
        reset4() {
            this.form4 = {
                menuType: 112,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 112,
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
                    subData.menuType = 112;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '栏目连通数据'
                        this.download(
                            "biz/linksChannel/export",this.queryParams,
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
                            value: response.data[i].unitName + ' - ' + response.data[i].siteCode,
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
<style scoped>
    /deep/ .el-table__header {
        width: 100% !important;
    }
    /deep/ .el-table__body {
        width: 100% !important;
    }
    /deep/.el-table th.gutter {
        display: table-cell !important
    }
</style>