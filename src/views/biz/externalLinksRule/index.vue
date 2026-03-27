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
                    <el-form-item label="规则名称" prop="ruleName">
                        <el-input v-model="queryParams.ruleName" placeholder="请输入规则名称" clearable @keyup.enter.native="handleQuery" style="width:310px" />
                    </el-form-item>
                    <el-form-item label="外链链接" prop="rule">
                        <el-input v-model="queryParams.rule" placeholder="请输入外链链接" clearable @keyup.enter.native="handleQuery" style="width:310px" />
                    </el-form-item>
                    <el-form-item label="外链类型" prop="errorTypes">
                        <el-select v-model="queryParams.errorTypes" clearable placeholder="请选择外链类型" style="width:310px">
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规则分类" prop="ruleTypes">
                        <el-select v-model="queryParams.ruleTypes" clearable placeholder="请选择规则分类" style="width:310px">
                            <el-option
                                v-for="item in ruleTypesDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信任状态" prop="trustState">
                        <el-select v-model="queryParams.trustState" clearable placeholder="请选择信任状态" style="width:310px">
                            <el-option
                                v-for="item in trustStateDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作时间" prop="">
                        <el-date-picker v-model="findTimetArr" @change="sjrqChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:310px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="规则ID" prop="idStr">
                        <el-input v-model="queryParams.idStr" placeholder="请输入规则ID" clearable @keyup.enter.native="handleQuery" style="width:310px" />
                    </el-form-item>
                    <el-form-item label="是否全局" prop="rangeType">
                        <el-select v-model="queryParams.rangeType" clearable placeholder="请选择是否全局" style="width:310px">
                            <el-option
                                v-for="item in rangeTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否开启" prop="enable">
                        <el-select v-model="queryParams.enable" clearable placeholder="请选择是否开启" style="width:310px">
                            <el-option
                                v-for="item in enableList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="匹配类型" prop="effectTypes">
                       <el-select v-model="queryParams.effectTypes" clearable placeholder="请选择匹配类型" style="width:310px">
                            <el-option
                                v-for="item in effectTypesLis"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item style="marginLeft:16px">
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
                            v-hasPermi="['biz:inspSiteInfo:add']"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile" >导入</el-button>
                    </el-col>
                    
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
                    <el-table-column label="规则ID" align="" prop="idStr" min-width="220" show-overflow-tooltip/>
                    <el-table-column label="规则名称" prop="ruleName" min-width="200" show-overflow-tooltip />
                    <el-table-column label="外链链接" prop="rule" min-width="240" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.rule)">{{ scope.row.rule}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="复制" prop="" align="center" width="60">
                        <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column label="规则分类" align="center" prop="ruleTypesTxt" min-width="100"></el-table-column>
                    <el-table-column label="外链类型" align="center" prop="errorTypesTxt"  min-width="100"/>
                    <el-table-column label="信任状态" align="center" prop="trustStateTxt" min-width="100" />
                    <el-table-column label="匹配类型" align="center" prop="effectTypesTxt" min-width="100" />
                    <el-table-column label="应用范围" align="center">
                        <el-table-column label="组织单位个数" align="center" prop="siteOrgCount" min-width="100" />
                        <el-table-column label="填报单位个数" align="center" prop="siteCount" min-width="100" />
                    </el-table-column>
                    <el-table-column label="排除范围" align="center">
                        <el-table-column label="组织单位个数" align="center" prop="siteOrgExcludeCount" min-width="100" />
                        <el-table-column label="填报单位个数" align="center" prop="siteExcludeCount" min-width="100" />
                    </el-table-column>
                    <el-table-column label="是否开启" align="center" prop="updateTime" min-width="100">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.enable" @change="enabledChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime" min-width="160" />
                    <el-table-column label="最新操作时间" align="center" prop="updateTime" min-width="160" />
                    <el-table-column label="创建人" align="center" prop="createBy" min-width="120" />
                    <el-table-column label="操作人" align="center" prop="updateBy" min-width="120" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" >编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-user" @click="handleSeeLog(scope.row)">日志</el-button>
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

        <!-- 添加或修改外链对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <div class="box">
                    <el-form-item label="规则名称" prop="ruleName" style="width:96%">
                        <el-input v-model="form.ruleName" placeholder="请输入规则名称" style="width:80%" clearable />
                    </el-form-item>
                    <el-form-item :label="gjShows ? '外链链接' : '域名规则'" prop="rule" style="width:96%" >
                        <!-- 普通模式 -->
                        <el-input v-model="form.rule" placeholder="请输入外链链接" style="width:80%" clearable @blur="handleInputChange(1)" @clear="form.rule=null"  v-if="gjShows" />
                        <!-- 高级模式 -->
                        <el-input type="textarea" :rows="5" placeholder="请输入域名规则" style="width:80%;" v-model="form.rule" @blur="handleInputChange(2)" v-if="!gjShows" ></el-input>
                        <!-- 高级按钮 -->
                        <el-button type="primary"  @click="gjChange" style="marginLeft:1%" v-hasPermi="['biz:externalLinksRule:senior']">{{gjTxt}}</el-button><br/>
                        <span style="display: inline-block;width:81%" v-if="gjShows">示例：域名为xxx.com，链接为http://</span>
                        <span style="display: inline-block;width:81%" v-if="!gjShows">前匹配示例：域名A：aaa.domain.com.cn，域名B：bbb.domain.com.cn<br/><span style="marginLeft:84px">正则：.*\.domain\.com\.cn$</span></span>
                        <span style="color:red" v-if="verify">已有记录！</span>
                    </el-form-item>
                    <el-form-item label="校验域名" prop="" style="width:96%" v-if="!gjShows">
                        <el-input v-model="domain" placeholder="请输入校验域名" style="width:80%" clearable  @clear="domain=null"/>
                        <el-button type="primary" @click="jyChange" style="marginLeft:1%" :disabled="!domain">校验</el-button><br/>
                    </el-form-item>
                    <el-form-item label="规则分类" prop="ruleTypes" style="width:80%">
                        <el-radio v-model="form.ruleTypes" :label="0" :disabled="!gjShows">域名</el-radio>
                        <el-radio v-model="form.ruleTypes" :label="1" :disabled="!gjShows">URL</el-radio>
                    </el-form-item>
                         
                    <el-form-item label="外链类型" prop="errorTypes" style="width:96%">
                        <el-select v-model="form.errorTypes" clearable placeholder="请选择外链类型" style="width:80%" >
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="匹配类型" prop="effectTypes" style="width:48%">
                        <el-radio v-model="form.effectTypes" :label="0" :disabled='true'>精确匹配</el-radio>
                        <el-radio v-model="form.effectTypes" :label="1" :disabled='true'>模糊匹配</el-radio>
                    </el-form-item> 
                    <el-form-item label="信任状态" prop="trustState" style="width:50%">
                        <el-radio v-model="form.trustState" :label="0">过滤</el-radio>
                        <el-radio v-model="form.trustState" :label="1">白名单</el-radio>
                        <el-radio v-model="form.trustState" :label="2">黑名单</el-radio>
                    </el-form-item>
                    
                    <el-form-item label="是否内置" prop="builtEnable" style="width:48%">
                        <el-radio-group v-model="form.builtEnable">
                            <el-radio
                                v-for="dict in builtEnableList"
                                :key="dict.value"
                                :label="dict.value"
                                :disabled="disabled"
                            >{{dict.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="是否开启" prop="enable" style="width:50%">
                        <el-radio v-model="form.enable" :label="true">开启</el-radio>
                        <el-radio v-model="form.enable" :label="false">关闭</el-radio>
                    </el-form-item>  -->
                    
                    <!-- <el-form-item label="规则判断" prop="ruleTypes" style="width:48%">
                        <el-radio v-model="form.ruleTypes" :label="2">黑名单</el-radio>
                        <el-radio v-model="form.ruleTypes" :label="1">白名单</el-radio>
                        <el-radio v-model="form.ruleTypes" :label="0">过滤</el-radio>
                    </el-form-item>  -->
                    
                    <el-form-item label="范围类型" prop="rangeType" style="width:90%">
                        <div>
                            <el-button :type="btnIndex == index ? 'primary' : ''" size="mini" v-for="(item,index) in btnList" :key="index" @click="fsdwChange(item,index)">{{item.label}}</el-button>
                            <el-button type="info" icon="el-icon-plus" size="mini" @click="pcChange">添加排除</el-button>
                        </div>
                        <div>
                            <div v-if="form.chooseSite.length > 0 || form.chooseSiteUnit.length > 0">选择：<span style="color:red;">{{form.chooseSite.length}}</span>个组织单位  <span style="color:red;marginLeft:15px">{{form.chooseSiteUnit.length}}</span>个填报单位<br/></div>
                            <div v-if="form.excludeSite.length > 0 || form.excludeSiteUnit.length > 0">排除：<span style="color:red;">{{form.excludeSite.length}}</span>个组织单位  <span style="color:red;marginLeft:15px">{{form.excludeSiteUnit.length}}</span>个填报单位</div>
                        </div>
                    </el-form-item> 
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 自定义 -->
        <!-- 添加或修改外链对话框 -->
        <el-dialog title="自定义" :visible.sync="open2" width="1000px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" class="zdyBox" @close="cancel3">
            <div class="pcBox">
                <!-- 筛选 -->
                <div class="pcCen">
                    <div class="pcCenT">
                        <el-input v-model="zdyQueryParams.siteCode" placeholder="请输入网站标识码" size="mini" clearable style="width:44%" @clear="searchSite" />
                        <el-input v-model="zdyQueryParams.siteName" placeholder="请输入网站名称" size="mini" clearable style="width:44%" @clear="searchSite" />
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSite"></el-button>
                        <!-- <el-input placeholder="账号名称/新媒体标识码" v-model="zdyQueryParams.keyWord" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch2">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch2"></el-button>
                        </el-input> -->
                    </div>
                    <el-table
                        v-loading="pcLoading"
                        :data="inspInfoList"
                        @select="handleSelectionChange3"
                        @select-all="handleSelectAll"
                        fit
                        class="pcTable"
                        ref="pcTable"
                    >
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column label="网站名称" align="" prop="siteName" width="220" show-overflow-tooltip></el-table-column>         
                        <el-table-column label="网站标识码" align="" prop="siteCode" width="160"/>
                    </el-table>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="zdyQueryParams.pgSize"
                        :total="zdyTotal"
                        v-show="zdyTotal>0"
                        :current-page="zdyQueryParams.pgNum"
                        @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </div> 
                <!-- 结果 -->
                <div class="pcRight">
                    <div class="divRightT">
                        <div>已选<span style="color:red;margin:0 2px;">{{mediaSiteNames.length}}</span>项</div>
                        <el-button type="text" size="mini" @click="clearMediaSiteNames">全部清空</el-button>
                    </div>
                    <div class="divRightTC">
                        <div class="jgLi" v-for="(item,index) in this.mediaSiteNames" v-if="mediaSiteNames.length > 0">
                            <span class="jgLiL">{{item.siteName}}（{{item.siteCode}}）</span>
                            <span @click="delMediaSiteNames(item,index)"><i class="el-icon-close" style="color:#409EFF;cursor: pointer;"></i></span>
                        </div>
                        <el-empty :image-size="100" v-if="mediaSiteNames.length == 0"></el-empty>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="cancel3">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改排除站点 -->
        <el-dialog title="添加排除" :visible.sync="open3" width="1000px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" class="zdyBox" @close="cancel4">
            <div class="pcBox">
                <!-- 筛选 -->
                <div class="pcCen">
                    <div class="pcCenT">
                        <el-input v-model="zdyPcQueryParams.siteCode" placeholder="请输入网站标识码" size="mini" clearable style="width:44%" @clear="searchSite2" />
                        <el-input v-model="zdyPcQueryParams.siteName" placeholder="请输入网站名称" size="mini" clearable style="width:44%" @clear="searchSite2" />
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSite2"></el-button>
                        <!-- <el-input placeholder="账号名称/新媒体标识码" v-model="zdyPcQueryParams.keyWord" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch2">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch2"></el-button>
                        </el-input> -->
                    </div>
                    <el-table
                        v-loading="pcLoading"
                        :data="pcInspInfoList"
                        @select="handleSelectionChange4"
                        @select-all="handleSelectAll4"
                        fit
                        class="pcTable"
                        ref="pcTable2"
                    >
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column label="网站名称" align="" prop="siteName" width="220" show-overflow-tooltip></el-table-column>         
                        <el-table-column label="网站标识码" align="" prop="siteCode" width="160"/>
                    </el-table>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-size="zdyPcQueryParams.pgSize"
                        :total="zdyPcTotal"
                        v-show="zdyPcTotal>0"
                        :current-page="zdyPcQueryParams.pgNum"
                        @current-change="handleCurrentChange2"
                    >
                    </el-pagination>
                </div> 
                <!-- 结果 -->
                <div class="pcRight">
                    <div class="divRightT">
                        <div>已选<span style="color:red;margin:0 2px;">{{pcMediaSiteNames.length}}</span>项</div>
                        <el-button type="text" size="mini" @click="clearPcMediaSiteNames">全部清空</el-button>
                    </div>
                    <div class="divRightTC">
                        <div class="jgLi" v-for="(item,index) in this.pcMediaSiteNames" v-if="pcMediaSiteNames.length > 0">
                            <span class="jgLiL">{{item.siteName}}（{{item.siteCode}}）</span>
                            <span @click="delpcMediaSiteNames(item,index)"><i class="el-icon-close" style="color:#409EFF;cursor: pointer;"></i></span>
                        </div>
                        <el-empty :image-size="100" v-if="pcMediaSiteNames.length == 0"></el-empty>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm4">确 定</el-button>
                <el-button @click="cancel4">取 消</el-button>
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
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-bottom"
                        size="mini"
                        @click="handleDown"
                        
                    >模板下载</el-button>
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
    listInspSiteInfo,
    getInspSiteInfo,
    delInspSiteInfo,
    addInspSiteInfo,
    updateInspSiteInfo,
    columnListInfo,
    selectMaxNum,
    queryList,
    redirectInspectView,
} from "@/api/biz/inspSiteInfo";
import {
    listInspSite,
    getInfo,
    verify,
    addInfo,
    editInfo,
    upEnabled,
    expressionVerify
} from "@/api/biz/externalLinksRule";
import {
    inspImportdataTask,
    downloadExcelTpl
} from "@/api/biz/wrongWords";
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
                ruleName: null,
                rule: null,
                errorTypes: null,
                ruleTypes: null,
                trustState: null,
                ancestorsFind: null, // 左侧树条件
                enable: null,
                rangeType: null,
                effectTypes: null
            },
            findTimetArr: [], // 操作时间

            // 表单参数
            form: {
                id: null,
                ruleName: null, // 规则名称
                rule: null, // 外链连接
                ruleTypes: null, // 规则分类
                errorTypes: null, // 标签分类
                effectTypes: 0, // 匹配类型
                builtEnable: false, // 是否内置
                trustState: null, // 信任状态 （规则判断）
                rangeType: null, // 范围类型
                chooseSite: [], // 选择的组织单位集合数组
                chooseSiteUnit: [], // 选择的填报单位集合数组
                excludeSite: [], // 排除的组织单位集合数组
                excludeSiteUnit: [], // 排除的填报单位集合数组
                enable: true, // 是否开启
            },
            verify: false,
            gjShows: true,
            gjTxt: '高级模式',
            domain: null,
            domainState: false,
            // 表单校验
            rules: {
                ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
                rule: [{ required: true, message: '请输入外链链接', trigger: 'blur' }],
                ruleTypes: [{ required: true, message: '请选择规则分类', trigger: 'change' }],
                errorTypes: [{ required: true, message: '请选择外链类型', trigger: 'change' }],
                effectTypes: [{ required: true, message: '请选择匹配类型', trigger: 'change' }],
                trustState: [{ required: true, message: '请选择信任状态', trigger: 'change' }],
                rangeType: [{ required: true, message: '请选择范围类型', trigger: 'change' }],
                
            },

            /**下拉菜单数据 */
            // 规则分类
            ruleTypesDate: [
                { label: '域名', value: 0 },
                { label: 'URL', value: 1 },
            ],
            // 信任状态
            trustStateDate: [
                { label: '过滤', value: 0 },
                { label: '白名单', value: 1 },
                { label: '黑名单', value: 2 },
            ],
            // 匹配类型
            effectTypesLis: [
                { label: '精准匹配', value: 0 },
                { label: '模糊匹配', value: 1 },
            ],
            // 广告=1  赌博=200  色情=300  仿冒网站=400 商业=500  知名媒体=600  知名平台=700  域名注销=800  游戏=900  影视资源=1000    报送已关停=1100    无法确定=1200    数据异常=1300     错链=1400   正常=1500 
            // 外链类型
            errorTypesList: [
                { label: '广告', val: 1 },
                { label: '赌博', val: 200 },
                { label: '色情', val: 300 },
                { label: '仿冒网站', val: 400 },
                { label: '商业', val: 500 },
                { label: '知名媒体', val: 600 },
                { label: '知名平台', val: 700 },
                { label: '域名注销', val: 800 },
                { label: '游戏', val: 900 },
                { label: '影视资源', val: 1000 },
                { label: '报送已关停', val: 1100 },
                { label: '无法确定', val: 1200 },
                { label: '数据异常', val: 1300 },
                { label: '错链', val: 1400 },
                { label: '正常', val: 1500 },
            ],
            // 是否内置
            builtEnableList: [
                { label: '内置', value: true },
                { label: '不内置', value: false },
            ],
            // 是否全局
            rangeTypeList: [
                { label: '非全局', value: 1 },
                { label: '全局', value: 2 },
            ],
            // 是否开启
            enableList: [
                { label: '开启', value: true },
                { label: '禁用', value: false },
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


            /**新增编辑 */
            btnList: [
                { label: '全局', type: '', val: 2 },
                { label: '自定义', type: '', val: 1 },
            ],
            btnIndex: -1,

            /**自定义 */
            open2: false,

            pcLoading: false,
            inspInfoList: [],
            zdyTotal: 0,
            // 查询参数
            zdyQueryParams: {
                pgNum: 1,
                pgSize: 20,
                siteCode: null,
                siteName: null,
                siteType: null,
                siteState: null,
                vipFlag: null,
                renderFlag: null,
                loginFlag: null,
                orderTypes: [{ code: 1, name: 'update_time' }], // 表格排序
                ancestorsFind: null, // 左侧树条件
                codeType: null,
                siteCodeOrState: 1,
            },
            inspMediaInfoList: [],
            mediaSiteNames: [],
            delArr: [],
            excludeSiteCodes: [],


            // 排除
            open3: false,
            pcInspInfoList: [],
            pcMediaSiteNames: [],
            zdyPcTotal: 0,
            pcDelArr: [],
            zdyPcQueryParams: {
                pgNum: 1,
                pgSize: 20,
                siteCode: null,
                siteName: null,
                siteType: null,
                siteState: null,
                vipFlag: null,
                renderFlag: null,
                loginFlag: null,
                orderTypes: [{ code: 1, name: 'update_time' }], // 表格排序
                ancestorsFind: null, // 左侧树条件
                codeType: null,
                siteCodeOrState: 1,
            },
            pcExcludeSiteCodes: [],

            editObj: {},
            oldBtnIndex: -1,

            loginInfoObj: {},
            disabled: false,

            // 回导
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: null,
            
        };
    },
    // watch: {
    //     filterText(val) {
    //         this.$refs.tree.filter(val);
    //     }
    // },
    watch: {
        'form.rule'(newVal, oldVal) {
            if(this.gjShows == false){ // 高级模式
                console.log(newVal,'新数据')
                console.log(oldVal,'旧数据')
                if((newVal && oldVal) && newVal !== oldVal){
                    this.domainState = true;
                }
            }
        }
    },
    created() {
        this.getList();
        this.getListzd(0);
        this.getScreenHeight();
        this.loginInfoObj = JSON.parse(sessionStorage.getItem('loginInfoObj'));

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
            listInspSite(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    // 规则分类
                    if(this.inspSiteInfoList[i].ruleTypes == 0){
                        this.inspSiteInfoList[i].ruleTypesTxt = '域名';
                    }else if(this.inspSiteInfoList[i].ruleTypes == 1){
                        this.inspSiteInfoList[i].ruleTypesTxt = 'URL';
                    }
                    // 信任状态
                    if(this.inspSiteInfoList[i].trustState == 0){
                        this.inspSiteInfoList[i].trustStateTxt = '过滤';
                    }else if(this.inspSiteInfoList[i].trustState == 1){
                        this.inspSiteInfoList[i].trustStateTxt = '白名单';
                    }else if(this.inspSiteInfoList[i].trustState == 2){
                        this.inspSiteInfoList[i].trustStateTxt = '黑名单';
                    }
                    for(var j in this.errorTypesList){
                        if(this.inspSiteInfoList[i].errorTypes == this.errorTypesList[j].val){
                            this.inspSiteInfoList[i].errorTypesTxt = this.errorTypesList[j].label;
                        }
                    }
                    // 匹配类型
                    if(this.inspSiteInfoList[i].effectTypes == 0){
                        this.inspSiteInfoList[i].effectTypesTxt = '精准匹配';
                    }else if(this.inspSiteInfoList[i].effectTypes == 1){
                        this.inspSiteInfoList[i].effectTypesTxt = '模糊匹配';
                    }
                    // 应用范围
                    if(this.inspSiteInfoList[i].rangeType == 2){
                        this.inspSiteInfoList[i].siteOrgCount = '全局';
                        this.inspSiteInfoList[i].siteCount = '全局';
                    }
                }
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
                ruleName: null, // 规则名称
                rule: null, // 外链连接
                ruleTypes: null, // 规则分类
                errorTypes: null, // 标签分类
                effectTypes: 0, // 匹配类型
                builtEnable: false, // 是否内置
                trustState: null, // 信任状态
                rangeType: null, // 范围类型
                chooseSite: [], // 选择的组织单位集合数组
                chooseSiteUnit: [], // 选择的填报单位集合数组
                excludeSite: [], // 排除的组织单位集合数组
                excludeSiteUnit: [], // 排除的填报单位集合数组
                enable: true,
            };
            this.btnIndex = -1;
            this.editObj = {};
            this.parentSiteDate = [];
            this.verify = false;
            this.gjShows = true;
            this.gjTxt = '高级模式';
            this.rules.rule[0].message = '请输入外链链接';
            this.domain = null;
            this.domainState = false;
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.findTimetArr.length > 0){
                this.queryParams.findTimeStart = this.formatDate(this.findTimetArr[0]) + ' 00:00:00';
                this.queryParams.findTimeEnd = this.formatDate(this.findTimetArr[1]) + ' 23:59:59';
                // if(this.queryParams.statusTimeStartDate){
                //     this.queryParams.statusTimeStartDate = this.formatDate(this.queryParams.statusTimeStartDate);
                // }
                // if(this.queryParams.statusTimeEndDate){
                //     this.queryParams.statusTimeEndDate = this.formatDate(this.queryParams.statusTimeEndDate);
                // }
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.selectedKey = null;
            this.queryParams.siteCode = null;
            this.queryParams.ancestorsFind = null; // 左侧树条件

            this.findTimetArr = [];
            this.queryParams.findTimeStart = null;
            this.queryParams.findTimeEnd = null;
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
            this.title = "新增外链";
            this.mediaSiteNames = [];
            this.pcMediaSiteNames = [];
            this.excludeSiteCodes = [];
            this.inspInfoList = [];
            this.pcExcludeSiteCodes = [];
            this.pcInspInfoList = [];
            this.openType = 1;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row)
            this.reset();
            const id = row.idStr || this.ids;
            this.openType = 2;
            getInfo({id:id}).then(response => {
                // this.form = response.data;
                this.editObj = response.data;
                this.form = {...this.editObj};
                this.open = true;
                this.title = "编辑外链";
                this.excludeSiteCodes = [...response.data.chooseSite,...response.data.chooseSiteUnit];
                this.pcExcludeSiteCodes = [...response.data.excludeSite,...response.data.excludeSiteUnit];
                this.mediaSiteNames = response.data.siteInfos;
                this.pcMediaSiteNames = response.data.excludeSiteInfos;
                // 返回右侧选中集合（标识码，名称）
                // this.mediaSiteNames = [];
                // this.pcMediaSiteNames = [];
                console.log(this.pcMediaSiteNames,'saddass')
                if(response.data.rangeType == 2){
                    this.btnIndex = 0;
                    this.oldBtnIndex = 0;
                }else if(response.data.rangeType == 1){
                    this.btnIndex = 1;
                    this.oldBtnIndex = 1;
                }
                console.log(this.loginInfoObj.userName,'登录用户')
                console.log(this.form.builtEnable,'是否内置')
                if(this.loginInfoObj.userName != 'admin' && this.form.builtEnable == true){
                    this.disabled = true;
                }else{
                    this.disabled = false;
                }
                if(this.form.effectTypes == 1){
                    this.gjShows = false;
                    this.gjTxt = '普通模式';
                    this.rules.rule[0].message = '请输入域名规则';
                }else{
                    this.gjShows = true;
                    this.gjTxt = '高级模式';
                    this.rules.rule[0].message = '请输入外链链接';
                }
                // this.btnIndex = response.data.rangeType - 1;
            });
        },
        // 输入框输入完成失去焦点
        handleInputChange(type) {
            if(this.form.rule){
                // 域名正则表达式
                // const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$|^localhost$/;
                // URL正则表达式
                // const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                if(type == 1){ // 普通
                    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
                    if(urlRegex.test(this.form.rule)){ // 链接
                        this.form.ruleTypes = 1;                    
                    }else{ // 域名
                        this.form.ruleTypes = 0;
                        this.form.rule = this.form.rule.toLowerCase(); // 大写转为小写
                    }
                    verify({rule: this.form.rule}).then((res)=>{
                        if(res.data == false){ // 有记录
                            this.verify = true;
                        }else{
                            this.verify = false;
                        }
                    })
                }else if(type == 2){ // 高级
                    this.form.rule = this.form.rule.toLowerCase(); // 大写转为小写
                }
                
            }
            
        },
        // 校验
        jyChange(){
            let subDate = {
                rule: this.form.rule,
                domain: this.domain,
            }
            console.log(subDate,'subDate')
            expressionVerify(subDate).then((res)=>{
                if(res.data == true){ // 成功
                    this.$modal.msgSuccess(res.msg);    
                    this.domainState = false;                
                }else if(res.data == false){ // 失败
                    this.$modal.msgError(res.msg);           
                }
            })
        },
        // 高级模式
        gjChange(){
            this.gjShows = !this.gjShows;
            this.domain = null;
            if(this.title == '新增外链'){
                this.form.rule = null;
            }
            if(this.gjShows == true){ // 普通
                this.gjTxt = '高级模式';
                this.rules.rule[0].message = '请输入外链链接';
                this.form.effectTypes = 0;
            }else{ // 高级
                this.gjTxt = '普通模式';
                this.rules.rule[0].message = '请输入域名规则';
                this.form.effectTypes = 1;
                this.form.ruleTypes = 0;
            }
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单提交数据')
                    if(this.verify == true){
                        this.$modal.msgWarning("外链链接已有记录，请重新输入");  
                    }else if(this.domainState == true){
                        this.$modal.msgWarning("外链链接已发生改变，请重新校验");  
                    }else if(this.gjShows == false && !this.domain && this.domainState == true){
                        this.$modal.msgWarning("请输入校验域名");  
                    }else{
                        if (this.openType == 2) { // 编辑
                            // 判断组织单位集合选项是否相同  true相同；false不相同
                            let zzIsSubset = false;
                            let tbIsSubset = false;
                            let zzPcIsSubset = false;
                            let tbPcIsSubset = false;

                            let zzIsSubset2 = false;
                            let tbIsSubset2 = false;
                            let zzPcIsSubset2 = false;
                            let tbPcIsSubset2 = false;
                            console.log(this.editObj.chooseSiteUnit,'原始值')
                            console.log(this.form.chooseSiteUnit,'新增值')
                            if(this.editObj.chooseSite || this.editObj.chooseSite.length > 0){
                                if(this.form.chooseSite.length == this.editObj.chooseSite.length){
                                    zzIsSubset2 = this.form.chooseSite.every(item => this.editObj.chooseSite.includes(item));
                                    if(zzIsSubset2){ // 相同
                                        zzIsSubset = false;
                                    }else{
                                        zzIsSubset = true;
                                    }
                                }else{
                                    zzIsSubset = true;
                                }  
                            }
                            if(this.editObj.chooseSiteUnit || this.editObj.chooseSiteUnit.length > 0){
                                if(this.form.chooseSiteUnit.length == this.editObj.chooseSiteUnit.length){
                                    tbIsSubset2 = this.form.chooseSiteUnit.every(item => this.editObj.chooseSiteUnit.includes(item));
                                    if(tbIsSubset2){ // 相同
                                        tbIsSubset = false;
                                    }else{
                                        tbIsSubset = true;
                                    }
                                }else{    
                                    tbIsSubset = true;
                                }
                                
                            }
                            if(this.editObj.excludeSite && this.editObj.excludeSite.length > 0){
                                if(this.form.excludeSite.length == this.editObj.excludeSite.length){
                                    zzPcIsSubset2 = this.form.excludeSite.every(item => this.editObj.excludeSite.includes(item));
                                    if(zzPcIsSubset2){ // 相同
                                        zzPcIsSubset = false;
                                    }else{
                                        zzPcIsSubset = true;
                                    }
                                }else{
                                    zzPcIsSubset = true;
                                }
                                
                            }
                            if(this.editObj.excludeSiteUnit && this.editObj.excludeSiteUnit.length > 0){
                                if(this.form.excludeSiteUnit.length == this.editObj.excludeSiteUnit.length){
                                    tbPcIsSubset = this.form.excludeSiteUnit.every(item => this.editObj.excludeSiteUnit.includes(item));
                                    if(tbPcIsSubset2){ // 相同
                                        tbPcIsSubset = false;
                                    }else{
                                        tbPcIsSubset = true;
                                    }
                                }else{
                                    tbPcIsSubset = true;
                                }
                                
                            }
                            console.log(zzIsSubset)
                            console.log(tbIsSubset)
                            console.log(zzPcIsSubset)
                            console.log(tbPcIsSubset)

                            console.log(zzIsSubset2)
                            console.log(tbIsSubset2)
                            console.log(zzPcIsSubset2)
                            console.log(tbPcIsSubset2)
                            console.log(this.btnIndex,'new')
                            console.log(this.oldBtnIndex,'old')
                            // 发送单位是否有变化
                            if(this.btnIndex != this.oldBtnIndex){ // 有变化
                                if(zzIsSubset == true || tbIsSubset == true || zzPcIsSubset == true || tbPcIsSubset == true){
                                    this.form.updateSiteCode = 0;
                                }else{
                                    this.form.updateSiteCode = 1;
                                }
                            }else{ // 无变化
                                if(zzIsSubset == true || tbIsSubset == true || zzPcIsSubset == true || tbPcIsSubset == true){
                                    this.form.updateSiteCode = 0;
                                }else{
                                    this.form.updateSiteCode = 1;
                                    
                                }
                                
                            }
                            console.log(this.form.updateSiteCode,'0=修改了；1=没修改')
                            console.log(this.form,'newFormDate')
                            editInfo(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else if(this.openType == 1) { // 新增
                            addInfo(this.form).then(response => {
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                                
                            });
                        }
                    }
                    
                }
            });
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
        // 查看关系-联系人
        handleSeeLog(row){
            sessionStorage.setItem('ruleId', row.idStr);
            this.$router.push({path:'/externalLinks/externalLinksRuleLog'})
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
                this.queryParams.findTimeStart = null;
                this.queryParams.findTimeEnd = null;
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

        /**新增编辑 */
        // 范围类型
        fsdwChange(item,index){
            this.btnIndex = index;
            this.form.rangeType = item.val;
            console.log(this.form.rangeType)
            if(item.val == 1){
                this.open2 = true;
                this.$set(this.zdyQueryParams,'pgNum',1)
                this.getSiteInfoList(1);
                
            }else{
                this.form.chooseSite = [];  // 选择的组织单位集合数组    
                this.form.chooseSiteUnit = []; // 选择的填报单位集合数组
            }
        },
        setSelectedRows2(selectedIds,table,type) {
            this.$nextTick(() => {
                if(selectedIds){
                    selectedIds.forEach((siteCode) => {
                        console.log(siteCode,'siteCode')
                        const row = table.find((item) => item.siteCode === siteCode);
                        console.log(row,'row')
                        if (row) {
                            if(type == 1){
                                this.$refs.pcTable.toggleRowSelection(row, true);
                            }else if(type == 2){
                                this.$refs.pcTable2.toggleRowSelection(row, true);
                            }else{
                                this.$refs.pcTable2.toggleRowSelection(row, false);
                            }
                        }
                    });
                }
                
            });
        },
        /** 查询站点信息列表 */
        getSiteInfoList(type) {
            this.pcLoading = true;
            let searchObj = {};
            if(type == 1){
                searchObj = this.zdyQueryParams;
            }else{
                searchObj = this.zdyPcQueryParams;
            }
            listInspSiteInfo(searchObj).then(response => {
                if(type == 1){
                    this.inspInfoList = response.rows;
                    this.zdyTotal = response.total;
                }else{
                    this.pcInspInfoList = response.rows;
                    this.zdyPcTotal = response.total;
                }
                
                this.pcLoading = false;
                setTimeout(()=>{
                    if(type == 1){
                        console.log(this.excludeSiteCodes,'this.excludeSiteCodes')
                        console.log(this.inspInfoList,'this.inspInfoList')
                        this.setSelectedRows2(this.excludeSiteCodes,this.inspInfoList,1);
                    }else if(type == 2){
                        console.log(this.pcExcludeSiteCodes,'this.pcExcludeSiteCodes')
                        console.log(this.pcInspInfoList,'this.pcInspInfoList')
                        this.setSelectedRows2(this.pcExcludeSiteCodes,this.pcInspInfoList,2);
                    }else{
                        this.excludeSiteCodes = [];
                        this.inspInfoList = [];
                        this.pcExcludeSiteCodes = [];
                        this.pcInspInfoList = [];
                    }
                },100)
            });
        },
        // 搜索
        searchSite(){
            this.zdyQueryParams.pgNum = 1;
            this.getSiteInfoList(1);
        },
         // 多选框选中数据-联系人
        handleSelectionChange3(selection,row) {
            console.log(row,'row')
            if(selection.includes(row) == true){
                // 检查arr中是否已存在具有相同val的对象
                const exists = this.mediaSiteNames.some(item => item.siteCode === row.siteCode);
                if (!exists) {
                    this.mediaSiteNames.push(row)
                }
            }else{
                this.mediaSiteNames = this.mediaSiteNames.filter(item => item.siteCode !== row.siteCode);
            }
            console.log(this.mediaSiteNames,'this.mediaSiteNames')
        },
        // 监听全选事件
        handleSelectAll(selection,row) {
            console.log(row,'rpw')
            const isAllSelected = selection.length > 0 && selection.length === this.inspInfoList.length;
            console.log("全选状态：", isAllSelected ? "已全选" : "已取消全选");
            console.log("当前选中的所有行：", selection);
            if(isAllSelected){
                // this.mediaSiteNames = [...this.mediaSiteNames,...this.inspInfoList];
                const newItems = this.inspInfoList.filter(item2 => 
                    !this.mediaSiteNames.some(item1 => item1.siteCode === item2.siteCode)
                );
                this.mediaSiteNames = this.mediaSiteNames.concat(newItems);
            }else{
                console.log(this.inspInfoList)
                // 提取 inspInfoList 中的所有 siteCode 值
                const valsToRemove = this.inspInfoList.map(item => item.siteCode);
                // 过滤掉 arr 中 siteCode 存在于 valsToRemove 的对象
                this.mediaSiteNames = this.mediaSiteNames.filter(item => !valsToRemove.includes(item.siteCode));
                // this.mediaSiteNames = [];
            }
            console.log(this.mediaSiteNames,'this.mediaSiteNames')
        },
        // 单个删除
        delMediaSiteNames(item,index){
            this.mediaSiteNames.splice(index,1);
            const table = this.$refs.pcTable;
            const row = this.inspInfoList.find(i => i.siteCode === item.siteCode); // 找到对应行
            if (row) {
                table.toggleRowSelection(row, false); // false 表示取消选中
            }
            this.delArr.push(item)

        },
        // 全部删除
        clearMediaSiteNames(){
            this.excludeSiteCodes = [];
            this.mediaSiteNames = [];
            const table = this.$refs.pcTable;
            table.clearSelection(); // 全部清空
        },
        // 分页
        handleCurrentChange(val) {
            this.zdyQueryParams.pgNum = val;
            this.getSiteInfoList(1);
        },

        cancel3(){
            this.mediaSiteNames = [...this.mediaSiteNames,...this.delArr];
            this.zdyQueryParams.siteCode = null;
            this.zdyQueryParams.siteName = null;
            this.open2 = false;
        },
        submitForm3(){
            this.excludeSiteCodes = this.mediaSiteNames.map(item => item.siteCode);
            console.log(this.excludeSiteCodes,'jihe')
            // chooseSite: null, // 选择的组织单位集合数组     
            // chooseSiteUnit: null, // 选择的填报单位集合数组    
            // excludeSite: null, // 排除的组织单位集合数组 
            // excludeSiteUnit: null, // 排除的填报单位集合数组 
            // this.form.excludeSiteCodes = this.excludeSiteCodes;
            // 使用 filter 拆分
            this.form.chooseSite = this.excludeSiteCodes.filter(item => item.length <= 6); // 长度 ≤6
            this.form.chooseSiteUnit = this.excludeSiteCodes.filter(item => item.length > 6);  // 长度 >6
            console.log(this.form.chooseSite,'组织单位')
            console.log(this.form.chooseSiteUnit,'填报单位')
            this.zdyQueryParams.siteCode = null;
            this.zdyQueryParams.siteName = null;
            this.open2 = false;
        },

        /**排除 */
        pcChange(){
            this.open3 = true;
            this.$set(this.zdyPcQueryParams,'pgNum',1)
            this.getSiteInfoList(2);
        },
        // 搜索
        searchSite2(){
            this.zdyPcQueryParams.pgNum = 1;
            this.getSiteInfoList(2);
        },
         // 多选框选中数据-联系人
        handleSelectionChange4(selection,row) {
            console.log(row,'row')
            if(selection.includes(row) == true){
                // 检查arr中是否已存在具有相同val的对象
                const exists = this.pcMediaSiteNames.some(item => item.siteCode === row.siteCode);
                if (!exists) {
                    this.pcMediaSiteNames.push(row)
                }
            }else{
                this.pcMediaSiteNames = this.pcMediaSiteNames.filter(item => item.siteCode !== row.siteCode);
            }
            console.log(this.pcMediaSiteNames,'this.pcMediaSiteNames')
        },
        // 监听全选事件
        handleSelectAll4(selection,row) {
            console.log(row,'rpw')
            const isAllSelected = selection.length > 0 && selection.length === this.pcInspInfoList.length;
            console.log("全选状态：", isAllSelected ? "已全选" : "已取消全选");
            console.log("当前选中的所有行：", selection);
            if(isAllSelected){
                // this.pcMediaSiteNames = [...this.pcMediaSiteNames,...this.inspInfoList];
                const newItems = this.pcInspInfoList.filter(item2 => 
                    !this.pcMediaSiteNames.some(item1 => item1.siteCode === item2.siteCode)
                );
                this.pcMediaSiteNames = this.pcMediaSiteNames.concat(newItems);
            }else{
                console.log(this.pcInspInfoList)
                // 提取 pcInspInfoList 中的所有 siteCode 值
                const valsToRemove = this.pcInspInfoList.map(item => item.siteCode);
                // 过滤掉 arr 中 siteCode 存在于 valsToRemove 的对象
                this.pcMediaSiteNames = this.pcMediaSiteNames.filter(item => !valsToRemove.includes(item.siteCode));
                // this.pcMediaSiteNames = [];
            }
            console.log(this.pcMediaSiteNames,'this.pcMediaSiteNames')
        },
        // 单个删除
        delpcMediaSiteNames(item,index){
            this.pcMediaSiteNames.splice(index,1);
            const table = this.$refs.pcTable2;
            const row = this.pcInspInfoList.find(i => i.siteCode === item.siteCode); // 找到对应行
            if (row) {
                table.toggleRowSelection(row, false); // false 表示取消选中
            }
            this.pcDelArr.push(item)

        },
        // 全部删除
        clearPcMediaSiteNames(){
            this.pcExcludeSiteCodes = [];
            this.pcMediaSiteNames = [];
            const table = this.$refs.pcTable2;
            table.clearSelection(); // 全部清空
        },
        // 分页
        handleCurrentChange2(val) {
            this.zdyPcQueryParams.pgNum = val;
            this.getSiteInfoList(2);
        },
        cancel4(){
            this.pcMediaSiteNames = [...this.pcMediaSiteNames,...this.pcDelArr];
            this.zdyPcQueryParams.siteCode = null;
            this.zdyPcQueryParams.siteName = null;
            this.open3 = false;
        },
        submitForm4(){
            this.pcExcludeSiteCodes = this.pcMediaSiteNames.map(item => item.siteCode);
            console.log(this.pcExcludeSiteCodes,'jihe')
            // chooseSite: null, // 选择的组织单位集合数组     
            // chooseSiteUnit: null, // 选择的填报单位集合数组    
            // excludeSite: null, // 排除的组织单位集合数组 
            // excludeSiteUnit: null, // 排除的填报单位集合数组 
            // this.form.pcExcludeSiteCodes = this.pcExcludeSiteCodes;
            // 使用 filter 拆分
            this.form.excludeSite = this.pcExcludeSiteCodes.filter(item => item.length <= 6); // 长度 ≤6
            this.form.excludeSiteUnit = this.pcExcludeSiteCodes.filter(item => item.length > 6);  // 长度 >6
            console.log(this.form.excludeSite,'组织单位')
            console.log(this.form.excludeSiteUnit,'填报单位')
            this.zdyPcQueryParams.siteCode = null;
            this.zdyPcQueryParams.siteName = null;
            this.open3 = false;
        },

        // 启用，禁用
        enabledChange(item){
            console.log(item)
            // item.enable = !item.enable;
            console.log(item.enable)
            let enabledTit = null;
            if(item.enable == false){
                enabledTit = '禁用成功'
            }else{
                enabledTit = '启用成功'
            }
            let subDate = {
                idStr: item.idStr,
                enable: item.enable
            }
            console.log(subDate,'subDate')
            upEnabled(subDate).then((res)=>{
                if(res.code == 200){
                    this.$modal.msgSuccess(enabledTit);
                    this.getList();
                }
            })
        },

         // 复制
        copyChange(val){
            console.log(val,'val')
            if(val.rule){
                this.textToCopy = val.rule;
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


         // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.open6 = true;
            this.fileType = type;
            this.title6 = '导入';
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
                    formData.append("taskType", 40);
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
        handleDown(){
            let fileName = '黑白名单回导数据模板';  
            this.download2(
                "common/download/downloadExcelTpl?type=40",'',
                `${fileName}.xlsx`
            ).then((res)=>{});
            
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
    /deep/.el-textarea__inner{
        border-color :#1890ff!important;
    }
</style>