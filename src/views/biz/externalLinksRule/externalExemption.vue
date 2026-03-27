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
                    <el-form-item label="站点信息" prop="siteCode">
                        <el-autocomplete
                            v-model="queryParams.siteCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="queryParams.siteCode = null"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="外链链接" prop="links">
                        <el-input v-model="queryParams.links" placeholder="请输入外链链接" clearable @keyup.enter.native="handleQuery" style="width:730px" />
                    </el-form-item>
                    <el-form-item label="规则分类" prop="linksType">
                        <el-select v-model="queryParams.linksType" clearable placeholder="请选择规则分类" style="width:310px">
                            <el-option
                                v-for="item in linksTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作时间" prop="">
                        <!-- <el-date-picker v-model="findTimetArr" @change="sjrqChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:310px"></el-date-picker> -->
                        <el-date-picker
                            v-model="findTimetArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:310px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="操作人" prop="name">
                        <el-input v-model="queryParams.name" placeholder="请输入操作人" clearable @keyup.enter.native="handleQuery" style="width:310px" />
                    </el-form-item>
                    <el-form-item label="免检ID" prop="idStr">
                        <el-input v-model="queryParams.idStr" placeholder="请输入免检ID" clearable @keyup.enter.native="handleQuery" style="width:310px" />
                    </el-form-item>

                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-plus"
                            size="mini"
                            @click="handleAdd"
                            v-hasPermi="['biz:inspSiteInfo:add']"
                        >新增</el-button>
                    </el-col> -->
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    fit
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="免检ID" align="" prop="idStr" min-width="220" show-overflow-tooltip/>
                    <el-table-column label="外链链接" prop="links" min-width="180" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.links)">{{ scope.row.links}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="" prop="" width="60">
                        <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column label="规则分类" align="center" prop="linksTypeTxt" min-width="100"></el-table-column>
                    <el-table-column label="网站标识码" align="" prop="siteCode" min-width="120"/>
                    <el-table-column label="范围" align="" prop="siteName" min-width="220"/>
                    <el-table-column label="操作时间" align="" prop="createTime" min-width="160" />
                    <el-table-column label="操作人" align="" prop="createBy" min-width="120" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="goExternalLinks(scope.row,1)" >网站命中</el-button>
                            <el-button size="mini" type="text" @click="goExternalLinks(scope.row,2)" >新媒体命中</el-button>
                            <!-- <el-button size="mini" type="text" @click="handleSeeLog(scope.row)">日志</el-button> -->
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
    </div>
</template>

<script>
import {
    listInspSiteInfo,
    getInspSiteInfo,
    delInspSiteInfo,
    addInspSiteInfo,
    updateInspSiteInfo,
    columnListInfo,
    selectMaxNum,
    queryList,
    redirectInspectView
} from "@/api/biz/inspSiteInfo";
import {
    listInspSite,
    getInfo,
    verify,
    addInfo,
    editInfo,
    externalExemption
} from "@/api/biz/externalLinksRule";
import global_ from '@/utils/Global';

import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";

export default {
    name: "InspSiteInfo",
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
            // 站点信息表格数据
            inspSiteInfoList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                links: null, // 外链链接
                name: null, // 操作人
                startDate: null,
                endDate: null,
                linksType: null, // 规则分类
                ancestorsFind: null, // 左侧树条件
            },
            findTimetArr: [], // 操作时间


            /**下拉菜单数据 */
            // 规则分类
            linksTypeDate: [
                { label: '域名', value: 0 },
                { label: 'URL', value: 1 },
            ],

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

            codeTypeS: false,

            parentSiteDate: [],

            
        };
    },
    // watch: {
    //     filterText(val) {
    //         this.$refs.tree.filter(val);
    //     }
    // },
    created() {
        this.getList();
        this.getListzd(0);
        this.getScreenHeight();
    },
    methods: {
        getScreenHeight(){
            this.leftTreeHeight = window.innerHeight;
            this.treeHeight = this.leftTreeHeight - 120 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
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
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            externalExemption(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    // this.inspSiteInfoList[i].idIndex = parseInt(i)+1;
                    // 规则分类
                    if(this.inspSiteInfoList[i].linksType == 0){
                        this.inspSiteInfoList[i].linksTypeTxt = '域名';
                    }else if(this.inspSiteInfoList[i].linksType == 1){
                        this.inspSiteInfoList[i].linksTypeTxt = 'URL';
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.findTimetArr && this.findTimetArr.length > 0){
                this.queryParams.startDate = this.formatDate(this.findTimetArr[0]) + ' 00:00:00';
                this.queryParams.endDate = this.formatDate(this.findTimetArr[1]) + ' 23:59:59';
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.selectedKey = null;
            this.queryParams.siteCode = null;
            this.queryParams.ancestorsFind = null; // 左侧树条件

            this.findTimetArr = [];
            this.queryParams.startDate = null;
            this.queryParams.endDate = null;
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
            const ids = row.idStr || this.ids;
            this.$modal
                .confirm('是否确认删除站点信息编号为"' + ids + '"的数据项？')
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
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "biz/inspSiteInfo/export",
                {
                    ...this.queryParams
                },
                `inspSiteInfo_${new Date().getTime()}.xlsx`
            );
        },
        
        /**下拉选择事件 */

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
                this.inspSiteTreeList = [];
                this.inspSiteTreeList = response.data;
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

        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.findTimetArr = [];
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
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
            // this.queryParams.treeInfo.psCode = val.siteCode;
            this.queryParams.siteCode = val.siteCode;
        },


        // 网站、新媒体命中
        goExternalLinks(row,type){
            // if(type == 1){ // 网站
            //     sessionStorage.setItem('ExternalLinksObj', JSON.stringify(row));
            //     this.$router.push({path:'/machine/externalLinks'})
            // }else if(type == 2){ // 新媒体

            // }
            if(type == 1){ // 网站
                sessionStorage.setItem('ExternalLinksObj', JSON.stringify(row));
                this.$router.push({path:'/machine/externalLinks'})
            }else if(type == 2){ // 新媒体
                sessionStorage.setItem('ExternalLinksMediaObj', JSON.stringify(row));
                this.$router.push({path:'/mediaDate/externalLinks'})
            }
        },

        // 复制
        copyChange(val){
            console.log(val,'val')
            if(val.links){
                this.textToCopy = val.links;
                const textArea = document.createElement('textarea');
                textArea.value = this.textToCopy;
                textArea.style.position = 'fixed'; // 防止页面滚动时出现
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        this.$modal.msgSuccess("已复制链接");
                    } else {
                        this.$modal.msgError("复制失败");
                    }
                } catch (err) {
                    console.error('无法复制文本: ', err);
                }
                document.body.removeChild(textArea);
            }
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
    .sxw{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #1890ff;
    }
    .sxw:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
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
            right: 4px;
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

    /**自定义 */
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
    .pcCenT{
        display: flex;
        justify-content: space-between;
        // display: flex;
        // flex-wrap: wrap;
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
        margin-top: 10px;
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
<style scoped>
    /deep/.el-dialog{
        margin-top: 5vh!important;
    }
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