<template>
    <div class="app-container">
        <div class="div">
            <div class="divBox" :style="{width: widthClass, paddingRight: paddingClass}">
                <div class="divLeft" v-if="jtShowS" :style="{height: treeHeight}" >
                    <!-- <el-input placeholder="输入网站标识码" v-model="filterText" size="mini" style="marginBottom: 10px"></el-input> -->
                    <div class="treeSearch">
                        <el-input placeholder="组织单位标识码/网站名称" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
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
                            show-checkbox
                            @check-change="handleCheckChange"
                            v-if="inspSiteTreeList.length"
                            :highlight-current="highlightBd"
                            :check-strictly="true"
                        >
                            <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                <span class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >{{ node.label }}</span>
                            </el-tooltip>
                        </el-tree>
                    </div>
                    <!-- <span class="jt"><i :class='jtIco' @click="jtChange" ></i></span> -->
                </div>
                <div class="jt" :style="{top: topClass}"><span class="spspspsp"><i :class='jtIco' @click="jtChange" ></i></span></div>
            </div>
            <div class="divRight" :style="{width: widthClassR}">
                <!-- 搜索条件 -->
                <el-form
                    :model="queryFrom"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                >
                    <div>
                        <dl class="dl3" style="border: none;" v-for="(item,index) in homeDate" :key="index">
                            <dt>
                                <el-select v-model="item.conjunction" slot="prepend" placeholder="请选择" class="selClass" v-show="item.showS">
                                    <el-option label="且" value="and"></el-option>
                                    <el-option label="或" value="or"></el-option>
                                    <el-option label="排除" value="not"></el-option>
                                </el-select>
                            </dt>
                            <dd style="flex:1;display:flex">
                                <el-input placeholder="请输入援索关键词，多个词用英文”逗号“隔开，多个词之间为”或“的关系" v-model="item.queryContent" clearable @clear="item.queryContent=null" class="input-with-select" >
                                    <el-select v-model="item.query" slot="prepend" placeholder="请选择" class="selClass">
                                        <el-option label="全文" value="content"></el-option>
                                        <el-option label="标题" value="title"></el-option>
                                        <!-- <el-option label="多媒体账号名" value="3"></el-option> -->
                                        <!-- <el-option label="附件" value="4"></el-option>
                                        <el-option label="多媒体" value="5"></el-option> -->
                                    </el-select>
                                </el-input>
                                <div class="iconDiv">
                                    <i class="el-icon-remove-outline" v-show="homeDate.length!=1" @click="removeHome(index)"></i>
                                    <i class="el-icon-circle-plus-outline" v-show="index == homeDate.length - 1" @click="addHome(index)"></i>
                                </div>
                            </dd>
                        </dl>
                        <dl class="dl1" style="position: relative;" v-if="searchS">
                            <dt>来源：</dt>
                            <dd>
                                <span class="spsp" @click="lxAll" :class="lyIndex == -1 ? 'active' : ''">全部</span>
                                <!-- <span class="spsp" v-for="(item,index) in dzflList" :key="index" @click="lxChange(item,index)" :class="lyIndex == index ? 'active' : ''">{{item.label}}</span> -->
                                <span class="spsp" v-for="(item,index) in dzflList" :key="index" @click="lxChange(item,index)" :class="item.type == true ? 'active' : ''">{{item.label}}</span>
                            </dd>
                            <!-- <div class="zkzd" @click="searchType"><i :class="iconType"></i>展开/折叠</div> -->
                        </dl>
                        <dl class="dl1" v-if="searchS">
                            <dt>资源类别：</dt>
                            <dd>
                                <span class="spsp" @click="zylbAll" :class="zylbIndex == -1 ? 'active' : ''">全部</span>
                                <!-- <span class="spsp" v-for="(item,index) in dzflList" :key="index" @click="lxChange(item,index)" :class="lyIndex == index ? 'active' : ''">{{item.label}}</span> -->
                                <span class="spsp" v-for="(item,index) in zylbList" :key="index" @click="zylbChange(item,index)" :class="item.type == true ? 'active' : ''">{{item.label}}</span>
                            </dd>
                        </dl>
                        <dl class="dl2" v-if="searchS">
                            <dt>发布时间：</dt>
                            <dd>
                                <el-date-picker
                                    v-model="releaseTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    @change="sjrqChange">
                                </el-date-picker>
                            </dd>
                        </dl>
                        <dl class="dl2" v-if="searchS">
                            <dt>监测时间：</dt>
                            <dd>
                                <el-date-picker
                                    v-model="releaseTime2"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    @change="sjrqChange2">
                                </el-date-picker>
                            </dd>
                        </dl>
                        <dl class="dl2" style="marginTop:0" v-if="searchS">
                            <dt>新媒体账号名称：</dt>
                            <dd>
                                <el-select
                                    v-model="searchObj.siteCodeMedia"
                                    multiple
                                    filterable
                                    collapse-tags
                                    remote
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    :loading="loading"
                                    class="selectClass"
                                    >
                                        <el-option
                                            v-for="(item,index) in options"
                                            :key="item.siteCodeMedia"
                                            :label="item.newLabel"
                                            :value="item.siteCodeMedia">
                                        </el-option>
                                </el-select>
                            </dd>
                            
                            <!-- <div style="display: flex;flex: 1;justify-content: right;">
                                <div class="zkzd" @click="searchType"><i :class="iconType"></i>展开/折叠</div>
                                <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
                                <el-button size="mini" icon="el-icon-search" type="primary" class="searchBtn" @click="search">搜索</el-button>
                            </div> -->
                        </dl>
                        <div style="display: flex;flex: 1;justify-content: center;" class="zdBox">
                            <!-- <div class="zkzd" @click="searchType"><i :class="iconType"></i>展开/折叠</div> -->
                            <el-button size="mini" type="info" :icon="iconType" @click="searchType">{{zdText}}</el-button>
                            <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
                            <!-- <el-button size="mini" icon="el-icon-search" type="primary" class="searchBtn" @click="search" :disabled="homeDate[0].queryContent == null">搜索</el-button> -->
                            <el-button size="mini" icon="el-icon-search" type="primary" class="searchBtn" @click="search(1)" >搜索</el-button>
                        </div>
                    </div>
                </el-form>
                <!-- 数据条数+时间排序 -->
                <div style="display: flex;justify-content: space-between;">
                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    <div>
                        <el-button type="warning" icon="el-icon-download" size="mini" plain @click="handleExport" class="downBtn" :disabled="tabDate.length == 0">导出</el-button>
                        <el-select v-model="queryFrom.dateAsc" slot="prepend" placeholder="请选择" class="timeSelect selClass" size="small" >
                            <el-option label="按时间正序" value="asc"></el-option>
                            <el-option label="按时间倒序" value="desc"></el-option>
                        </el-select>
                    </div>
                </div>
                <!-- 数据内容 -->
                <ul class="tableUl" v-loading="tabDateLoading" :style="{maxHeight: dataBox}">
                    <div v-if="total > 0">
                        <li v-for="(item,index) in tabDate" :key="index" @click="dzChange(item.url)">
                            <div class="d1">
                                <span v-if="item.codeType == '网站'"><span class="icoSp"><img :src="item.ico" alt=""></span>{{item.siteName}}</span>
                                <span v-if="item.codeType == '新媒体'"><span class="icoSp"><img :src="item.ico" alt=""></span>{{item.accountName}}</span>
                                <span class="sps" v-if="item.codeType == '网站'"></span>
                                <span v-if="item.codeType == '网站' && item.columnName">{{item.columnName}}</span>
                                <span class="sps" v-if="item.codeType == '网站' && item.columnName"></span>
                                <span class="sps" v-if="item.codeType == '新媒体'"></span>
                                <span>发布时间：{{item.ptiStr}}</span></span>
                                <span class="sps" v-if="item.ct != '' || item.ct != null"></span>
                                <span v-if="item.ct != '' || item.ct != null">监测时间：<span>{{item.ct}}</span></span>
                            </div>
                            <div class="d2" v-html="item.titleHighlight" v-if="item.titleHighlight"></div>
                            <div class="d2" v-else>{{item.title}}</div>
                            <div class="d3" v-html="item.contentHighlight" v-if="item.contentHighlight"></div>
                            <div class="d3" v-else>{{item.content}}</div>
                        </li>
                    </div>
                    <el-empty description="暂无数据" v-if="total == 0"></el-empty>
                </ul>
                <!-- 分页 -->
                <pagination
                    v-show="total>0"
                    :page.sync="searchObj.pgNum"
                    :limit.sync="searchObj.pgSize"
                    @pagination="getList"
                    :page-sizes="[20, 50, 100, 200]"
                    layout="sizes, prev, pager, next"
                    :total="total > 10000 ? 10000 : total"
                />
            </div>
        </div>
        <!-- 导出 -->
        <el-dialog title="导出数据" :visible.sync="open3" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            导出前是否验证链接可访问情况，导出速度可能受一定影响
            <div slot="footer" class="dialog-footer">
                <el-button @click="exportChange">导 出</el-button>
                <el-button type="primary" @click="yzExportChange">验证后导出</el-button>
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
    columnListInfo,
    selectMaxNum,
    queryList,
    redirectInspectView
} from "@/api/biz/inspSiteInfo";
import { searchTreeListQuery, searchList, getInspMediaInfo } from "@/api/search/index";
import global_ from '@/utils/Global';
import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";

import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";

export default {
    name: "InspSiteInfo",
    data() {
        return {
            // 遮罩层
            loading: false,
            tabDateLoading: false,
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
            tabDate: [],
            searchObj: {
                pgNum: 1,
                pgSize: 20,
                appType: null,
                contentType: null,
                siteCode: [],
                siteCodeMedia: null,
                province: null,
                city: null,
                county: null,
                startDate: null,
                endDate: null,
                dateAsc: 'desc',
                queryVos: null,
                scanStartDate: null,
                scanEndDate: null,
                
            },
            // 查询参数
            queryFrom: {
                pgNum: 1,
                pgSize: 20,
                appType: null,
                contentType: null,
                siteCode: [],
                siteCodeMedia: null,
                province: null,
                city: null,
                county: null,
                startDate: null,
                endDate: null,
                dateAsc: 'desc',
                queryVos: null,
                scanStartDate: null,
                scanEndDate: null,
            },
            homeDate: [ { query: 'content' ,queryContent: null, conjunction: null, showS: false } ],
            searchS: true,
            iconType: 'el-icon-arrow-up',
            zdText: '折叠',
            // 来源
            dzflList: [
                { label: '网站', val: 0, type: false },
                { label: '微信', val: 1, type: false },
                { label: '微博', val: 2, type: false },
                { label: '抖音', val: 3, type: false },
                { label: '头条', val: 4, type: false },
                { label: '快手', val: 5, type: false },
            ],
            lyIndex: -1, // 来源

            // 资源类型
            zylbList: [
                { label: '页面', val: 2, type: false },
                { label: '图片', val: 1, type: false },
                { label: '附件', val: 3, type: false },
                { label: '视频', val: 6, type: false },
                { label: '音频', val: 7, type: false },
            ],
            zylbIndex: -1, // 资源类型
            releaseTime: [],
            releaseTime2: [],
            options: [],

            // 导出
            open3: false,





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
            topClass: '50%',
            dataBox: '48vh',

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
        // this.getList();
        this.getListzd(0);
        this.getScreenHeight();
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
        getScreenHeight(){
            this.leftTreeHeight = window.innerHeight;
            this.treeHeight = this.leftTreeHeight - 120 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
        },
        searchType(){
            this.searchS = !this.searchS;
            if(this.searchS == true){
                this.iconType = 'el-icon-arrow-up';
                this.zdText = '折叠';
                this.dataBox = '48vh';
            }else{
                this.iconType = 'el-icon-arrow-down';
                this.zdText = '展开';
                this.dataBox = '70vh';
            }
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                let subDate = {
                    likeSiteOrName: query
                }
                getInspMediaInfo(subDate).then((res)=>{
                    this.list = res.data;
                    
                    console.log(this.list,'this.list')
                    setTimeout(() => {
                        this.loading = false;
                        this.options = this.list.filter(item => {
                            return item.accountName.indexOf(query) > -1;
                        });
                        console.log(this.options,'搜索匹配数据')
                        for(var i in this.options){
                            this.options[i].newLabel = this.options[i].accountName + '（' + this.options[i].appTypeName + '）'
                        }
                    }, 200);
                })
                
            } else {
                this.options = [];
            }
        },
        // 重置
        reset(){
            
            this.searchObj = {
                pgNum: 1,
                pgSize: 20,
                appType: null,
                contentType: null,
                siteCode: [],
                siteCodeMedia: null,
                province: null,
                city: null,
                county: null,
                startDate: null,
                endDate: null,
                dateAsc: 'desc',
                queryVos: null,
                scanStartDate: null,
                scanEndDate: null,
            }
            this.lyIndex = -1;
            this.zylbIndex = -1;
            this.releaseTime = [];
            this.releaseTime2 = [];
            for(var i in this.dzflList){
                this.dzflList[i].type = false;
            }
            for(var j in this.zylbList){
                this.zylbList[j].type = false;
            }
            this.totalShow = false;
            this.homeDate = [ { query: 'content' ,queryContent: null, conjunction: null, showS: false } ];
            this.getListzd(0); // 站点关系树
            this.search();
            console.log(this.searchObj,'重置查询条件')
        },
        
        // 搜索
        search(type){
            this.queryFrom = {};
            this.queryFrom = this.searchObj;
            // 日期
            if(this.releaseTime){
                this.queryFrom.startDate = this.releaseTime[0];
                this.queryFrom.endDate = this.releaseTime[1];
                if(this.queryFrom.startDate){
                    this.queryFrom.startDate = this.formatDate(this.queryFrom.startDate);
                }
                if(this.queryFrom.endDate){
                    this.queryFrom.endDate = this.formatDate(this.queryFrom.endDate);
                }
            }else{
                this.queryFrom.startDate = null;
                this.queryFrom.endDate = null;
            }
            // 日期
            if(this.releaseTime2){
                this.queryFrom.scanStartDate = this.releaseTime2[0];
                this.queryFrom.scanEndDate = this.releaseTime2[1];
                if(this.queryFrom.scanStartDate){
                    this.queryFrom.scanStartDate = this.formatDate(this.queryFrom.scanStartDate);
                }
                if(this.queryFrom.scanEndDate){
                    this.queryFrom.scanEndDate = this.formatDate(this.queryFrom.scanEndDate);
                }
            }else{
                this.queryFrom.scanStartDate = null;
                this.queryFrom.scanEndDate = null;
            }
            console.log(this.homeDate,'this.homeDate')
            this.queryFrom.queryVos = [];
            for(var i in this.homeDate){
                // this.homeDate[i].queryContent = this.homeDate[i].queryContent.split("，");
                if(i == 0){
                    if(this.homeDate[i].queryContent != null || this.homeDate[i].conjunction != null){
                        this.queryFrom.queryVos.push({
                            query: this.homeDate[i].query,
                            queryContent: this.homeDate[i].queryContent.split(","),
                            conjunction: this.homeDate[i].conjunction,
                        })
                    }
                }else{
                    if(this.homeDate[i].queryContent != null && this.homeDate[i].conjunction != null && this.homeDate[i].queryContent != ''){
                        this.queryFrom.queryVos.push({
                            query: this.homeDate[i].query,
                            queryContent: this.homeDate[i].queryContent.split(","),
                            conjunction: this.homeDate[i].conjunction,
                        })
                    }
                }
                
            }
            if(this.queryFrom.queryVos.length == 0){
                this.queryFrom.queryVos = null;
            }else if(this.queryFrom.queryVos.length == 1){
                this.queryFrom.queryVos[0].conjunction = null;   
            }
            console.log(this.queryFrom,'查询条件')

            if(type){
                if(!this.queryFrom.queryVos || this.queryFrom.queryVos[0].queryContent == null || this.queryFrom.queryVos[0].queryContent == ''){
                    // this.$modal.msgWarning("请输入第一条搜索关键词内容");
                    this.$modal.msgWarning("第一条搜索关键词内容为必填");
                }else{
                    setTimeout(()=>{
                        this.getList();
                    },500)
                }
            }else{
                setTimeout(()=>{
                    this.getList();
                },500)
            }
            
        },
        /** 查询站点信息列表 */
        getList() {
            this.tabDateLoading = true;
            searchList(this.queryFrom).then(res => {
                this.tabDate = res.rows;
                this.total = res.total;
                for(var i in this.tabDate){
                    if(this.tabDate[i].codeType == '新媒体'){
                        if(this.tabDate[i].appType == '微信'){
                            this.tabDate[i].ico = require('../../assets/images/wx.jpeg');
                        }else if(this.tabDate[i].appType == '微博'){
                            this.tabDate[i].ico = require('../../assets/images/wb.jpeg');
                        }else if(this.tabDate[i].appType == '抖音'){
                            this.tabDate[i].ico = require('../../assets/images/dy.jpeg');
                        }else if(this.tabDate[i].appType == '头条'){
                            this.tabDate[i].ico = require('../../assets/images/tt.jpeg');
                        }else if(this.tabDate[i].appType == '快手'){
                            this.tabDate[i].ico = require('../../assets/images/ks.jpeg');
                        }
                    }else{
                        this.tabDate[i].ico = require('../../assets/images/wzIco.png');
                    }
                }
                setTimeout(()=>{
                    this.tabDateLoading = false;
                },500)
            })
        },
        //添加参数
        addHome () {
            if(this.homeDate.length < 5){
                this.homeDate.push({ query: 'title',queryContent: null, conjunction: 'and', showS: true });
            }
        },
        //删除参数
        removeHome (index) {
            this.homeDate.splice(index, 1);
            this.homeDate[0].showS = false;
        },

        // 日期-发现时间
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.releaseTime = [];
                this.searchObj.startDate = null;
                this.searchObj.endDate = null;
            }
        },
        // 日期-监测时间
        sjrqChange2(val){
            console.log(val)
            if(val == null){
                this.releaseTime2 = [];
                this.searchObj.scanStartDate = null;
                this.searchObj.scanEndDate = null;
            }
        },
        
        // 来源点击
        lxChange(item,index){
            console.log(item,index)
            // 单选
            this.lyIndex = index;
            // this.queryFrom.appType = item.val;
            // 多选
            this.dzflList[index].type = !this.dzflList[index].type;
            // 来源
            this.searchObj.appType = [];
            for(var i in this.dzflList){
                if(this.dzflList[i].type == true){
                    this.searchObj.appType.push(this.dzflList[i].val)
                }
            }
            if(this.searchObj.appType.length == 0){
                this.searchObj.appType = null;
                this.lyIndex = -1;
            }else if(this.searchObj.appType.length == 6){
                this.searchObj.appType = null;
                this.lyIndex = -1;
                for(var j in this.dzflList){
                    this.dzflList[j].type = false;
                }
            }
            console.log(this.searchObj.appType,'来源集合')
        },
        // 来源全部
        lxAll(){
            this.lyIndex = -1;
            this.searchObj.appType = null;
            for(var j in this.dzflList){
                this.dzflList[j].type = false;
            }
        },
        // 资源类型点击
        zylbChange(item,index){
            console.log(item,index)
            // 单选
            this.zylbIndex = index;
            // this.queryFrom.appType = item.val;
            // 多选
            this.zylbList[index].type = !this.zylbList[index].type;
            // 来源
            this.searchObj.contentType = [];
            for(var i in this.zylbList){
                if(this.zylbList[i].type == true){
                    this.searchObj.contentType.push(this.zylbList[i].val)
                }
            }
            if(this.searchObj.contentType.length == 0){
                this.searchObj.contentType = null;
                this.zylbIndex = -1;
            }else if(this.searchObj.contentType.length == 5){
                this.searchObj.contentType = null;
                this.zylbIndex = -1;
                for(var j in this.zylbList){
                    this.zylbList[j].type = false;
                }
            }
            console.log(this.searchObj.contentType,'资源类别集合')
        },
        // 资源类型全部
        zylbAll(){
            this.zylbIndex = -1;
            this.searchObj.contentType = null;
            for(var j in this.zylbList){
                this.zylbList[j].type = false;
            }
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "biz/inspSiteInfo/export",
                {
                    ...this.queryFrom
                },
                `inspSiteInfo_${new Date().getTime()}.xlsx`
            );
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
                this.inspSiteTreeList = [];
                setTimeout(()=>{
                    this.inspSiteTreeList = response.data;
                    // this.loading = false;
                    for (var i in this.inspSiteTreeList) {
                        this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName+'-'+this.inspSiteTreeList[i].siteCode;
                    }
                    this.treeLoading = false;
                },100)
            });
        },
        loadNode(node, resolve) {
            console.log(node,'node')
            console.log(resolve,'resolve')
            if (node.level === 0) {
                return resolve(this.inspSiteTreeList)
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               setTimeout(() => {
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
        handleNodeClick(data, node) {
            console.log(data,'data')   
            this.queryFrom.pgNum = 1;
            // this.queryFrom.ancestorsFind = data.siteCode;
            this.queryFrom.ancestorsFind = data.ancestors+data.siteCode+',';
            this.getList();
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
            if(checked == true){
                this.searchObj.siteCode.push(data.siteCode)
            }else{
                this.searchObj.siteCode = this.searchObj.siteCode.filter(item => item !== data.siteCode);
            }
            console.log(this.searchObj.siteCode,'this.searchObj.siteCode')
        },
        // 清空树搜索条件
        clearSearch(){
            this.getListzd(0);
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
                this.topClass = '50%';
            }else if(this.jtShowS == false){
                this.jtIco = 'el-icon-d-arrow-right';
                this.widthClass = '1%';
                this.paddingClass = '0';
                this.widthClassR = '100%';
                this.topClass = '104%';
            }
        },

        // 左侧树搜索
        siteCodeSearch(){
            console.log('ok')
            let date = {};
            if(this.filterText == '' || this.filterText == null){
                date = { parentSite: 0 }
            }else{
                date = { likeSiteOrName: this.filterText, pgNum: 1, pgSize: 20 }
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

         /** 导出按钮操作 */
        handleExport() {
            this.open3 = true;
            this.reset4();
        },
         // 表单重置
        reset4() {
            this.form4 = {
                menuType: 700,
                startHttp: null,
            };
            this.resetForm("form4");
        },
        // 直接导出
        exportChange(){
            let fileName = '全局检索-' + this.queryFrom.queryVos[0].queryContent + '-' + this.formatDate(new Date());
            console.log(fileName,'导出名称')
            if(this.total > 2000){
                let subData = this.queryFrom;
                subData.menuType = 700;
                subData.startHttp = 0;
                console.log(subData,'提交数据')
                insertInspExcelTaskMaxBatch(subData).then((res)=>{
                    this.$modal.msgSuccess("导出任务创建成功");
                    this.open3 = false;
                })
            }else{
                this.download(
                    "biz/search/export",this.queryFrom,
                    `${fileName}.xlsx`
                ).then((res)=>{
                    this.open3 = false;
                });
            }
            
        },
        // 验证导出
        yzExportChange(){
            let subData = this.queryFrom;
            subData.menuType = 700;
            subData.startHttp = 1;
            console.log(subData,'提交数据')
            insertInspExcelTaskMaxBatch(subData).then((res)=>{
                this.$modal.msgSuccess("导出任务创建成功");
                this.open3 = false;
            })
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
        justify-content: space-between;
        width: 100%;
        height: 100%;
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
            display: flex;
            flex-direction: column;
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
    .downBtn{
        margin-right: 10px;
    }
    .selClass{
        width: 120px;
    }


    .dl1,.dl2,.dl3{
        display: flex;
        align-items: center;
        font-size: 14px;
        // padding: 10px 0;
        padding-left: 10px;
        dt{
            color: #898989;
            margin-right: 30px;
            width: 120px;
        }
        dd{
            margin-left: 0;
            padding-left: 0;
        }
    }
    .dl1{
        // margin-top: 20px;
        margin-bottom: 0;
        border-bottom: 1px dashed #dedede;
        margin-top: 10px;
        padding-bottom: 10px;
        .zkzd{
            cursor: pointer;
            position: absolute;
            right: 0;
            i{
                margin-right: 3px;
            }
        }
        .spsp{
            display: inline-block;
            margin-right: 10px;
            padding: 6px 12px;   
            color: #000000;                   
        }
        .spsp:hover{
            cursor: pointer;
        }
    }
    .dl2{
        border-bottom: 1px solid #dedede;
        padding-bottom: 10px!important;
    }
    .dl3{
        padding: 0;
        margin: 0;
        margin-top: 10px;
    }
    .iconDiv{
    width: 80px;
    display: flex;
    align-items: center;
    // justify-content: center;
    i{
        font-size: 24px;
        margin-left: 10px;
        cursor: pointer;
    }
}
.zdBox{
    margin-top: 10px;
}
.totalAndTime{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .total{
        font-size: 14px;
    }
}
.tableUl{
    flex: 1;
    margin: 0;
    padding: 0;
    // max-height: 70vh;
    overflow: auto;
    padding-left: 0;
    margin-top: 20px;
    li{
        list-style: none;
        // margin-bottom: 30px;
        cursor: pointer;
        padding: 15px 0;
        .d1,.d3{
            font-size: 14px;
            display: flex;
            align-items: center;
            color: #898989;
            .sps{
                display: block;
                width: 1px;
                height: 12px;
                background: #898989;
                margin: 0 10px;
            }
        }
        .d1{
            .icoSp{
                display: inline-block;
                width: 18px;
                img{
                    width: 15px;
                    height: 15px;
                    position: relative;
                    top: 2.3px;
                    border-radius: 100%;
                }
            }
        }
        .d2{
            font-size: 18px;
            margin: 5px 0;
            font-weight: 500;
        }
        .d3{
            display: -webkit-box; /* 设置为WebKit内核的弹性盒子模型 */
            -webkit-box-orient: vertical; /* 垂直排列 */
            -webkit-line-clamp: 2; /* 限制显示两行 */
            overflow: hidden; /* 隐藏超出范围的内容 */
            text-overflow: ellipsis; /* 使用省略号 */
        }
    }
    li:hover{
        background: rgb(218, 211, 211,.2);
    }
}
.downBtn{
    margin-right: 10px;
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
.selClass{
    width: 115px;
}
.selectClass{
    width: 350px;
}
.marginClass{
    margin-left: 40px!important;
}
.active{
    color: #1890ff!important;
    background: #e8f4ff!important;
    border-color: #a3d3ff!important;
    border-radius: 5px;
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
        margin-top: 20vh!important;
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
</style>