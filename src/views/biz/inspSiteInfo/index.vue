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

                    <el-form-item label="网站标识码" prop="siteCode">
                        <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="网站名称" prop="siteName">
                        <el-input
                            v-model="queryParams.siteName"
                            placeholder="请输入网站名称"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="站点类型" prop="siteType">
                        <el-select v-model="queryParams.siteType" clearable placeholder="请选择站点类型">
                            <el-option
                                v-for="item in siteTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="站点状态" prop="siteState">
                        <el-select v-model="queryParams.siteState" clearable placeholder="请选择站点状态">
                            <el-option
                                v-for="item in siteStateDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="是否收费" prop="vipFlag">
                        <el-select v-model="queryParams.vipFlag" clearable placeholder="请选择是否收费">
                            <el-option
                                v-for="item in vipFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="是否渲染" prop="renderFlag">
                        <el-select v-model="queryParams.renderFlag" clearable placeholder="请选择是否渲染">
                            <el-option
                                v-for="item in renderFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否登录" prop="loginFlag">
                        <el-select v-model="queryParams.loginFlag" clearable placeholder="请选择是否登录">
                            <el-option
                                v-for="item in loginFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="填报单位类型" prop="codeType">
                        <el-select v-model="queryParams.codeType" clearable placeholder="请选择填报单位类型">
                            <el-option
                                v-for="item in codeTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="省" prop="province">
                        <el-input
                            v-model="queryParams.province"
                            placeholder="请输入省"
                            clearable
                            @keyup.enter.native="handleQuery"
                            
                        />
                    </el-form-item>
                    <el-form-item label="市" prop="city">
                        <el-input
                            v-model="queryParams.city"
                            placeholder="请输入市"
                            clearable
                            @keyup.enter.native="handleQuery"
                            
                        />
                    </el-form-item>
                    <el-form-item label="县" prop="county">
                        <el-input
                            v-model="queryParams.county"
                            placeholder="请输入县"
                            clearable
                            @keyup.enter.native="handleQuery"
                            
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
                            v-hasPermi="['biz:inspSiteInfo:add']"
                        >新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >联系人导入</el-button>
                        <el-button type="info" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >站点信息新增导入</el-button>
                        <el-button type="warning" plain icon="el-icon-top" size="mini" @click="handleFile(3)" >站点信息修改导入</el-button>
                        <el-button type="primary" plain  size="mini" @click="goInfo" >任务详情</el-button>
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="success"
                            plain
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="single"
                            @click="handleUpdate"
                            v-hasPermi="['biz:inspSiteInfo:edit']"
                        >修改</el-button>
                    </el-col> -->
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['biz:inspSiteInfo:remove']"
                        >删除</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['biz:inspSiteInfo:export']">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    height="52.7vh"
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="网站标识码" prop="siteCode" width="120">
                        <template slot-scope="scope">
                            <span class="dz" @click="goWeb(scope.row)">{{scope.row.siteCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="网站名称" prop="siteName" width="240" show-overflow-tooltip />
                    <el-table-column label="站点类型" prop="siteTypeTxt" width="120" />
                    <!-- <el-table-column label="填报单位类型" prop="codeTypeTxt" width="120" /> -->
                    <!-- <el-table-column label="站点url地址" prop="siteUrl" />
                    <el-table-column label="跳转url" prop="jumpUrl" /> -->
                    <el-table-column label="站点地址" prop="siteUrl" show-overflow-tooltip min-width="300">
                        <template slot-scope="scope">
                            <!-- <el-tooltip  placement="top">
                                <div slot="content">
                                    {{scope.row.siteUrl}}<br/>
                                    {{scope.row.jumpUrl}}
                                </div>
                                <span class="sxw" v-if="scope.row.siteUrl!=null" @click="dzChange(scope.row.siteUrl)"><span style="color:#000000">站点地址：</span >{{scope.row.siteUrl}}</span><br/>
                                <span class="sxw" v-if="scope.row.jumpUrl!=null" @click="dzChange(scope.row.jumpUrl)"><span style="color:#000000">跳转地址：</span>{{scope.row.jumpUrl}}</span>
                                <span v-if="scope.row.siteUrl==null && scope.row.jumpUrl==null">--</span>
                            </el-tooltip> -->
                            <span class="dz" v-if="scope.row.siteUrl!=null && scope.row.siteUrl!=''" @click="dzChange(scope.row.siteUrl)"><span style="color:#606266">站点地址：</span >{{scope.row.siteUrl}}</span><br v-if="scope.row.siteUrl!=null && scope.row.siteUrl!=''"/>
                            <span class="dz" v-if="scope.row.jumpUrl!=null && scope.row.jumpUrl!=''" @click="dzChange(scope.row.jumpUrl)"><span style="color:#606266">跳转地址：</span>{{scope.row.jumpUrl}}</span>
                            <span v-if="(scope.row.siteUrl==null || scope.row.siteUrl=='') && (scope.row.jumpUrl==null || scope.row.jumpUrl=='')">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="站点状态" align="center" prop="siteStateTxt"  width="100"/>
                    <!-- <el-table-column label="是否收费" align="center" prop="vipFlagTxt" width="100" /> -->
                    <el-table-column label="是否渲染" align="center" prop="renderFlagTxt" width="140" />
                    <el-table-column label="是否登录" align="center" prop="loginFlagTxt" width="100" />
                    <el-table-column label="地区" align="" prop="area" width="200" show-overflow-tooltip />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="240">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['biz:inspSiteInfo:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-user"
                                @click="handleSee(scope.row)"
                                v-hasPermi="['biz:inspSiteInfo:see']"
                            >联系人</el-button>
                            <!-- <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:inspSiteInfo:remove']"
                                :disabled="(scope.row.customFlag && scope.row.siteType== 2) == true ? false : true"
                            >删除</el-button> -->
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:inspSiteInfo:remove']"
                                :disabled="(scope.row.siteType == 1 && !scope.row.customFlag) ? true : false"
                            >删除</el-button>
                            <el-popover placement="top" width="150" trigger="hover" style="marginLeft:10px">
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="Information(scope.row,'information')"
                                        >底部标识信息</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="RuleUrlPatterns(scope.row,'RuleUrlPatterns')"
                                        >采集范围</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="OnClick(scope.row,'OnClick')"
                                        >点击事件</el-button
                                    >
                                </div>
                                <!-- <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="goWeb(scope.row,'goWeb')"
                                        >快捷登录</el-button
                                    >
                                </div> -->
                                <el-button
                                    class="gaoji gjButton"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-guide"
                                    slot="reference"
                                    v-hasPermi="['biz:site:edit']"
                                    >高级</el-button
                                >
                            </el-popover>
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

        <!-- 添加或修改站点信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <div class="box">
                    <el-form-item label="自定义站点" prop="customFlag" style="width:50%">
                        <!-- <el-select v-model="form.customFlag" placeholder="请选择自定义站点" style="width:90%" @change="customFlagChange">
                            <el-option
                                v-for="item in customFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select> -->
                        <el-radio-group v-model="form.customFlag" :disabled="title=='修改站点信息'" @change="customFlagChange">
                            <el-radio :label="1">自定义</el-radio>
                            <el-radio :label="0">报送</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="站点类型" prop="siteType" style="width:50%">
                        <el-select v-model="form.siteType" placeholder="请选择站点类型" style="width:90%" @change="siteTypeChange" :disabled="title=='修改站点信息'">
                            <el-option
                                v-for="item in siteTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="填报单位类型" prop="codeType" style="width:50%" v-if="form.siteType == 2">
                        <el-select v-model="form.codeType" clearable placeholder="请选择填报单位类型" style="width:90%" :disabled="title=='修改站点信息'" @change="codeTypeChange">
                            <el-option
                                v-for="item in codeTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="组织单位标识码" prop="parentSite" style="width:50%" v-if="title=='添加站点信息' && form.codeType == 2"> -->
                    <!-- <el-form-item label="组织单位标识码" prop="parentSite" style="width:50%" v-if="title=='添加站点信息' && form.codeType != null && form.codeType != ''"> -->
                    <el-form-item label="父级单位标识码" prop="parentSite" style="width:50%" v-if="title=='添加站点信息'">
                        <!-- <el-input v-model="form.parentSite" placeholder="请输入组织单位标识码" style="width:90%" clearable  /> -->
                        <el-select v-model="form.parentSite" filterable clearable placeholder="请输入并选择标识码" style="width:90%" :disabled="title=='修改站点信息'" @change="parentSiteChange"  remote :remote-method="remoteMethod" >
                            <el-option
                                v-for="item in parentSiteDate"
                                :key="item.siteCode"
                                :label="item.siteCode"
                                :value="item.siteCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:50%">
                        <!-- <el-input v-model="form.siteCode" :disabled="form.codeType == 2"  placeholder="请输入网站标识码" style="width:90%" clearable /> -->
                        <div style="width:90%;display:flex;justify-content: space-between;">
                            <el-input v-model.trim="form.siteCode" :disabled="!CustomSiteCodeS"  placeholder="请输入网站标识码" style="width:75%" clearable v-if="title=='添加站点信息'" />
                            <el-input v-model.trim="form.siteCode" disabled  placeholder="请输入网站标识码" style="width:75%" clearable v-else/>
                            
                            <el-button type="primary" size="small" @click="getCustomSiteCodeFn" :disabled="CustomSiteCodeS">刷新</el-button>
                        </div>
                        <!-- <el-input v-model="form.siteCode"  placeholder="请输入网站标识码" style="width:90%" clearable /> -->
                    </el-form-item>
                    <el-form-item label="网站名称" prop="siteName" style="width:50%">
                        <el-input v-model.trim="form.siteName" placeholder="请输入网站名称" style="width:90%" clearable />
                    </el-form-item>
                    <el-form-item label="网站校验码" prop="vcode" style="width:50%">
                        <el-input v-model.trim="form.vcode" placeholder="请输入网站校验码" style="width:90%" clearable />
                    </el-form-item>
                    <!-- <el-form-item label="级别" prop="level" style="width:50%">
                        <el-select v-model="form.level" clearable placeholder="请选择级别" style="width:90%">
                            <el-option
                                v-for="item in levelDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="站点地址" prop="siteUrl" style="width:96.6%" v-if="form.siteType != 1 && form.codeType == 1">
                        <el-input v-model.trim="form.siteUrl" placeholder="请输入站点地址" style="width:100%" clearable />
                    </el-form-item>
                    <el-form-item label="跳转地址" prop="jumpUrl" style="width:96.6%" v-if="form.siteType != 1 && form.codeType == 1">
                        <el-input v-model.trim="form.jumpUrl" placeholder="请输入跳转地址" style="width:100%" clearable />
                    </el-form-item>
                    <el-form-item label="根域名" prop="domain" style="width:50%" v-if="form.siteType != 1 && form.codeType == 1">
                        <el-input v-model.trim="form.domain" placeholder="请输入根域名" style="width:90%" clearable />
                    </el-form-item>
                    <el-form-item label="网站主办单位" prop="director" style="width:50%" v-if="form.siteType != 1">
                        <el-input v-model.trim="form.director" placeholder="请输入网站主办单位" style="width:90%" clearable />
                    </el-form-item>
                    <el-form-item label="办公地址" prop="address" style="width:50%" v-if="form.siteType != 1">
                        <el-input v-model.trim="form.address" placeholder="请输入办公地址" style="width:90%" clearable />
                    </el-form-item>
                    <el-form-item label="是否门户网站" prop="portalSite" style="width:50%" v-if="form.siteType != 1">
                        <el-select v-model="form.portalSite" clearable placeholder="请选择是否门户网站" style="width:90%">
                            <el-option
                                v-for="item in portalSiteDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="站点状态" prop="siteState" style="width:50%">
                        <el-select v-model="form.siteState" clearable placeholder="请选择站点状态" style="width:90%">
                            <el-option
                                v-for="item in siteStateDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="是否收费" prop="vipFlag" style="width:50%">
                        <el-select v-model="form.vipFlag" clearable placeholder="请选择是否收费" style="width:90%" disabled>
                            <el-option
                                v-for="item in vipFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="是否删除" prop="delFlag" style="width:50%">
                        <el-select v-model="form.delFlag" clearable placeholder="请选择是否删除" style="width:90%">
                            <el-option
                                v-for="item in delFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="是否渲染" prop="renderFlag" style="width:50%" v-if="form.siteType != 1">
                        <el-select v-model="form.renderFlag" clearable placeholder="请选择是否渲染" style="width:90%">
                            <el-option
                                v-for="item in renderFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否登录" prop="loginFlag" style="width:50%">
                        <el-select v-model="form.loginFlag" clearable placeholder="请选择是否登录" style="width:90%">
                            <el-option
                                v-for="item in loginFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="是否部委" prop="bmFlag" style="width:50%">
                        <el-select v-model="form.bmFlag" clearable placeholder="请选择是否部委" style="width:90%">
                            <el-option
                                v-for="item in bmFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连通性频率" prop="connectInterval" style="width:50%" v-if="form.codeType == 1">
                        <!-- <el-input v-model="form.connectInterval" placeholder="请输入连通性频率单位:分，默认60分" /> -->
                        <el-input-number v-model="form.connectInterval" controls-position="right" :min="5" :max="1440" style="width:77%"></el-input-number>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="采集频率" prop="updateInterval" style="width:50%" v-if="form.codeType == 1">
                        <!-- <el-input v-model="form.updateInterval" placeholder="请输入采集频率单位:分，默认60分" /> -->
                        <el-input-number v-model="form.updateInterval" controls-position="right" :min="5" :max="1440" style="width:77%"></el-input-number>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="省" prop="province" style="width:50%">
                        <el-input v-model.trim="form.province" clearable placeholder="请输入省" style="width:90%" />
                    </el-form-item>
                     <el-form-item label="市" prop="city" style="width:50%">
                        <el-input v-model.trim="form.city" clearable placeholder="请输入市" style="width:90%"  />
                    </el-form-item>
                     <el-form-item label="县" prop="county" style="width:50%">
                        <el-input v-model.trim="form.county" clearable placeholder="请输入县" style="width:90%"  />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" style="width:96.6%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" clearable />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 操作-高级 -->
        <!-- 底部标识信息 -->
        <WebsiteCode :getInformation="InformationS" :getInformationIdStr="InformationIdStr" :getInformationDate="InformationDate" :getWebsite="Website"  @openS= "InformationOpenS" v-if="InformationS"/>
        <!-- 采集范围 -->
        <RuleUrlPatterns :getRuleUrlPatterns="RuleUrlPatternsS" :getRuleUrlPatternsIdStr="RuleUrlPatternsIdStr" :getRuleUrlPatternsDate="RuleUrlPatternsDate" @openS= "RuleUrlPatternsOpenS" v-if="RuleUrlPatternsS" />
        <!-- 模拟点击事件 -->
        <OnClick :getOnClick="OnClickS" :getOnClickIdStr="OnClickIdStr" :getOnClickDate="OnClickDate" @openS= "OnClickOpenS" v-if="OnClickS" />

        <!-- 模板上传 -->
        <el-dialog :title="title6" :visible.sync="open6" width="680px" append-to-body @close="cancel6">
            <el-form ref="form6" :model="form6" :rules="rules6" label-width="140px">
                <!-- <el-form-item label="父级标识码" prop="parentSite" v-if="uploadType == 2">
                    <el-autocomplete
                        v-model="form6.parentSite"
                        :fetch-suggestions="querySearchAsync2"
                        placeholder="请输入父级标识码"
                        clearable
                        @select="handleSelectCompany2"
                        @clear="queryParams.parentSite = null"
                        style="width:72%"
                    ></el-autocomplete>
                </el-form-item> -->
                <el-form-item label="自定义填报单位" prop="customFlag" style="width:95%" v-if="uploadType == 2">
                    <el-radio-group v-model="form6.customFlag">
                        <el-radio :label="true">自定义</el-radio>
                        <el-radio :label="false">报送</el-radio>
                    </el-radio-group>
                </el-form-item>
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
    listInspSiteInfo,
    getInspSiteInfo,
    delInspSiteInfo,
    addInspSiteInfo,
    updateInspSiteInfo,
    columnListInfo,
    selectMaxNum,
    queryList,
    redirectInspectView,
    getCustomSiteCode
} from "@/api/biz/inspSiteInfo";
import global_ from '@/utils/Global';

import WebsiteCode from '../column/WebsiteCode'
import RuleUrlPatterns from '../column/RuleUrlPatterns'
import OnClick from '../column/OnClick'
import { inspImportdataTask, } from "@/api/biz/wrongWords";



import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";

export default {
    name: "InspSiteInfo",
    components: {
        WebsiteCode,
        RuleUrlPatterns,
        OnClick,
    },
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
                province: null, // 省
                city: null, // 市 
                county: null // 县
            },
            // 表单参数
            form: {
                portalSite: 0,
                siteState: 1,
                vipFlag: 0,
                delFlag: 0,
                renderFlag: 0,
                loginFlag: 1,
                customFlag: null,
            },
            // 表单校验
            rules: {
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur',  },
                    { min: 6, max: 6, message: '网站标识码长度在6个字符', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母或数字', trigger: 'blur' },
                ],
                parentSite: [
                    { required: true, message: '请输入组织单位标识码', trigger: 'blur',  },
                    { min: 6, max: 6, message: '组织单位标识码长度在6个字符', trigger: 'blur' },
                    { pattern: /^[A-Za-z0-9]+$/, message: '只能输入字母或数字', trigger: 'blur' },
                    // { validator: this.validateSiteCode, trigger: 'blur' }
                    
                ],
                siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
                vcode: [
                    { required: true, message: '请输入网站校验码', trigger: 'blur' },
                    { min: 6, message: '网站校验码长度在6个字符', trigger: 'blur' },
                ],
                siteType: [{ required: true, message: '请选择站点类型', trigger: 'change' }],
                siteUrl: [
                    { required: true, message: '请输入站点url地址', trigger: 'blur' },
                    // { pattern: global_.strRegex, message: global_.strRegex_msg, trigger: 'blur' },
                ],
                domain: [
                    { required: true, message: '请输入根域名', trigger: 'blur' },
                    { pattern: global_.domainRegex, message: global_.domainRegex_msg, trigger: 'blur' },
                ],
                portalSite: [{ required: true, message: '请选择是否门户网站', trigger: 'change' }],
                siteState: [{ required: true, message: '请选择站点状态', trigger: 'change' }],
                vipFlag: [{ required: true, message: '请选择是否收费', trigger: 'change' }],
                delFlag: [{ required: true, message: '请选择是否删除', trigger: 'change' }],
                renderFlag: [{ required: true, message: '请选择是否渲染', trigger: 'change' }],
                loginFlag: [{ required: true, message: '请选择是否登录', trigger: 'change' }],
                customFlag: [{ required: true, message: '请选择自定义站点', trigger: 'change' }],
                bmFlag: [{ required: true, message: '请选择是否部委', trigger: 'change' }],
                connectInterval: [{ required: true, message: '请输入连通性频率', trigger: 'blur' }],
                updateInterval: [{ required: true, message: '请输入采集频率', trigger: 'blur' }],
                codeType: [{ required: false, message: '请选择填报单位类型', trigger: 'change' }],
                
            },

            /**下拉菜单数据 */
            siteTypeDate: [ // 站点类型
                { label: '组织单位', value: 1 },
                { label: '填报单位', value: 2 },
            ],
            siteStateDate: [ // 站点状态
                { label: '正常', value: 1 },
                { label: '例外', value: 2 },
                { label: '关停', value: 3 },
            ],
            vipFlagDate: [ // 是否收费
                { label: '收费', value: 1 },
                { label: '免费', value: 0 },
            ],
            renderFlagDate: [ // 是否渲染
                { label: '不渲染', value: 0 },
                { label: '首页+栏目渲染', value: 1 },
                { label: '全站渲染', value: 2 },
                { label: '首页渲染', value: 3 },
                { label: '栏目渲染', value: 4 },
                // { label: '全站采集渲染翻页', value: 5 },
            ],
            loginFlagDate: [ // 是否登录
                { label: '是', value: 1 },
                { label: '否', value: 0 },
            ],
            levelDate: [ // 级别
                { label: '0级', value: 0 },
                { label: '1级', value: 1 },
                { label: '2级', value: 2 },
                { label: '3级', value: 3 },
            ],
            portalSiteDate: [ // 是否门户网站
                { label: '非门户', value: 0 },
                { label: '门户', value: 1 },
            ],
            delFlagDate: [ // 是否删除
                { label: '删除', value: 1 },
                { label: '不删除', value: 0 },
            ],
            customFlagDate: [ // 自定义站点
                { label: '是', value: 1 },
                { label: '否', value: 0 },
            ],
            bmFlagDate: [ // 是否部委
                { label: '是', value: 1 },
                { label: '否', value: 0 },
            ],
            codeTypeDate: [ // 填报单位类型
                { label: '网站', value: 1 },
                { label: '新媒体', value: 2 },
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


            // 操作-高级
            // 底部标识信息
            InformationS: false,
            InformationIdStr: null,
            InformationDate: {},
            Website: null,
            // 采集范围
            RuleUrlPatternsS: false,
            RuleUrlPatternsIdStr: null,
            RuleUrlPatternsDate: {},
            // 点击事件
            OnClickS: false,
            OnClickIdStr: null,
            OnClickDate: {},



            highlightBd: true,

            codeTypeS: false,

            parentSiteDate: [],


            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            rules6: {
                customFlag: [{ required: true, message: '请选择是否为自定义填报单位', trigger: 'change' }],
                parentSite: [{ required: true, message: '请输入父级标识码', trigger: 'blur' }],
            },
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '站点联系人导入',
            uploadType: null,
            
            restaurants: [],

            CustomSiteCodeS: false,


            
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
            this.treeHeight = this.leftTreeHeight - 125 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            listInspSiteInfo(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    // 站点类型
                    if(this.inspSiteInfoList[i].siteType == 1){
                        this.inspSiteInfoList[i].siteTypeTxt = '组织单位';
                    }else if(this.inspSiteInfoList[i].siteType == 2){
                        this.inspSiteInfoList[i].siteTypeTxt = '填报单位';
                    }
                    // 站点状态
                    if(this.inspSiteInfoList[i].siteState == 1){
                        this.inspSiteInfoList[i].siteStateTxt = '正常';
                    }else if(this.inspSiteInfoList[i].siteState == 2){
                        this.inspSiteInfoList[i].siteStateTxt = '例外';
                    }else if(this.inspSiteInfoList[i].siteState == 3){
                        this.inspSiteInfoList[i].siteStateTxt = '关停';
                    }
                    // 是否收费
                    if(this.inspSiteInfoList[i].vipFlag == true){
                        this.inspSiteInfoList[i].vipFlagTxt = '收费';
                    }else if(this.inspSiteInfoList[i].vipFlag == false){
                        this.inspSiteInfoList[i].vipFlagTxt = '免费';
                    }
                    // 是否渲染
                    // if(this.inspSiteInfoList[i].renderFlag == true){
                    //     this.inspSiteInfoList[i].renderFlagTxt = '是';
                    // }else if(this.inspSiteInfoList[i].renderFlag == false){
                    //     this.inspSiteInfoList[i].renderFlagTxt = '否';
                    // }
                    if(this.inspSiteInfoList[i].renderFlag == 0){
                        this.inspSiteInfoList[i].renderFlagTxt = '不渲染';
                    }else if(this.inspSiteInfoList[i].renderFlag == 1){
                        this.inspSiteInfoList[i].renderFlagTxt = '首页+栏目渲染';
                    }else if(this.inspSiteInfoList[i].renderFlag == 2){
                        this.inspSiteInfoList[i].renderFlagTxt = '全站渲染';
                    }else if(this.inspSiteInfoList[i].renderFlag == 3){
                        this.inspSiteInfoList[i].renderFlagTxt = '首页渲染';
                    }else if(this.inspSiteInfoList[i].renderFlag == 4){
                        this.inspSiteInfoList[i].renderFlagTxt = '栏目渲染';
                    }
                    // else if(this.inspSiteInfoList[i].renderFlag == 5){
                    //     this.inspSiteInfoList[i].renderFlagTxt = '全站采集渲染翻页';
                    // }
                    // 是否登录
                    if(this.inspSiteInfoList[i].loginFlag == true){
                        this.inspSiteInfoList[i].loginFlagTxt = '是';
                    }else if(this.inspSiteInfoList[i].loginFlag == false){
                        this.inspSiteInfoList[i].loginFlagTxt = '否';
                    }
                    // 填报单位类型
                    if(this.inspSiteInfoList[i].codeType){
                        if(this.inspSiteInfoList[i].codeType == 1){
                            this.inspSiteInfoList[i].codeTypeTxt = '网站';
                        }else if(this.inspSiteInfoList[i].codeType == 2){
                            this.inspSiteInfoList[i].codeTypeTxt = '新媒体';
                        }
                    }else{
                        this.inspSiteInfoList[i].codeTypeTxt = '--';
                    }
                    

                    // 检查每个变量是否有值，并且拼接有值的变量
                    this.inspSiteInfoList[i].area = '';
                    if (this.inspSiteInfoList[i].province) this.inspSiteInfoList[i].area += this.inspSiteInfoList[i].province + '/';
                    if (this.inspSiteInfoList[i].city) this.inspSiteInfoList[i].area += this.inspSiteInfoList[i].city + '/';
                    if (this.inspSiteInfoList[i].county) this.inspSiteInfoList[i].area += this.inspSiteInfoList[i].county + '/';
                    this.inspSiteInfoList[i].area = this.inspSiteInfoList[i].area.slice(0, -1);

                    // 根据结果输出
                    if (!this.inspSiteInfoList[i].area) {
                        this.inspSiteInfoList[i].area = '--';
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
                siteCode: null,
                siteName: null,
                vcode: null,
                province: null,
                city: null,
                county: null,
                siteType: 1,
                level: null,
                siteUrl: null,
                jumpUrl: null,
                hashUrl: null,
                domain: null,
                director: null,
                address: null,
                portalSite: 0,
                siteState: 1,
                vipFlag: 0,
                delFlag: 0,
                renderFlag: 0,
                loginFlag: 1,
                customFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                bmFlag: null,
                connectInterval: 60,
                updateInterval: 180,
                codeType: 0,
                parentSite: null,
                mediaNum: null,
                province: null, // 省
                city: null, // 市
                county: null, // 县
                
            };
            this.parentSiteDate = [];

            this.rules.siteCode[1].min = 6;
            this.rules.siteCode[1].max = 6;
            this.rules.siteCode[1].message = '网站标识码长度在6个字符';
            this.codeTypeS = false;
            this.rules.codeType[0].required = false;
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.selectedKey = null;
            this.queryParams.siteCode = null;
            this.queryParams.ancestorsFind = null; // 左侧树条件
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 随机生成校验码
        generateRandomString(length) {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var result = '';
            var charactersLength = chars.length;
            for (var i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加站点信息";
            this.form.vcode = this.generateRandomString(6); 
            
        },
        // 是否自定义
        customFlagChange(){
            if(this.title == '修改站点信息'){
                this.CustomSiteCodeS = true;
            }else{
                this.form.parentSite = null;
                this.form.siteCode = null;
                if(this.form.customFlag == 0){
                    this.CustomSiteCodeS = true;
                }else{
                    this.CustomSiteCodeS = false;                 
                }
            }
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row)
            this.reset();
            const id = row.id || this.ids;
            getInspSiteInfo({id:id}).then(response => {
                this.form = response.data;
                console.log(this.form.siteType,'this.form-header')
                if(this.form.siteType == 1){
                    this.rules.siteCode[1].min = 6;
                    this.rules.siteCode[1].max = 6;
                    this.rules.siteCode[1].message = '网站标识码长度在6个字符';
                    this.codeTypeS = false;
                    this.rules.codeType[0].required = false;
                }else if(this.form.siteType == 2){
                    this.rules.siteCode[1].min = 10;
                    this.rules.siteCode[1].max = 10;
                    this.rules.siteCode[1].message = '网站标识码长度在10个字符';
                    this.codeTypeS = true;
                    this.rules.codeType[0].required = true;
                }
                this.open = true;
                this.title = "修改站点信息";
                // delFlagDate
                // 是否删除
                if(response.data.delFlag == true){
                    this.form.delFlag = 1;
                }else if(response.data.delFlag == false){
                    this.form.delFlag = 0;
                }
                // 是否收费
                if(response.data.vipFlag == true){
                    this.form.vipFlag = 1;
                }else if(response.data.vipFlag == false){
                    this.form.vipFlag = 0;
                }
                // 是否渲染
                // if(response.data.renderFlag == true){
                //     this.form.renderFlag = 1;
                // }else if(response.data.renderFlag == false){
                //     this.form.renderFlag = 0;
                // }
                // 是否登录
                if(response.data.loginFlag == true){
                    this.form.loginFlag = 1;
                }else if(response.data.loginFlag == false){
                    this.form.loginFlag = 0;
                }
                // 自定义站点
                if(response.data.customFlag == true){
                    this.form.customFlag = 1;
                }else if(response.data.customFlag == false){
                    this.form.customFlag = 0;
                }

                this.CustomSiteCodeS = true;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单提交数据')
                    if (this.form.id != null) {
                        updateInspSiteInfo(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspSiteInfo(this.form).then(response => {
                            if(response.data == true){ // 成功
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            }else{ // 失败
                                this.$modal.msgError(response.msg);
                            }
                            
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
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
            let fileName = '站点信息数据'
            this.download(
                "biz/inspSiteInfo/export",this.queryParams,
                `${fileName}.xlsx`
            ).then((res)=>{});
        },
        // 查看关系-联系人
        handleSee(row){
            sessionStorage.setItem('siteCode', row.siteCode);
            // window.location.href = '/basic/inspSiteDirector';
            this.$router.replace({path:'/basic/inspSiteDirector'})
            
        },
        
        /**下拉选择事件 */
        // 站点类型
        siteTypeChange(val){
            console.log(val,'val')
            this.form.parentSite = null;
            this.form.siteCode = null;
            // this.$refs.form.clearValidate(['siteCode']) // 清空表单验证（网站标识码）
            if(val == 1){ // 组织单位
                this.rules.siteCode[1].min = 6;
                this.rules.siteCode[1].max = 6;
                this.rules.siteCode[1].message = '网站标识码长度在6个字符';
                // 清空填报单位所展示字段
                this.form.siteUrl = null;
                this.form.jumpUrl = null;
                this.form.domain = null;
                this.form.director = null;
                this.form.address = null;
                this.form.portalSite = 0;
                this.form.renderFlag = 0;
                // 填报单位类型
                this.codeTypeS = false;
                this.form.codeType = 0;
                this.rules.codeType[0].required = false;
                this.form.codeType = 0; // 填报单位类型 默认：0
            }else if(val == 2){ // 填报单位
                this.rules.siteCode[1].min = 10;
                this.rules.siteCode[1].max = 10;
                this.rules.siteCode[1].message = '网站标识码长度在10个字符';
                // 填报单位类型
                this.codeTypeS = true;
                this.form.codeType = null;
                this.rules.codeType[0].required = true;
            }
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

        /**底部标识信息 */
        // 点击
        Information(row,val){
            console.log(row,'row')
            columnListInfo({id:row.columnId}).then((res)=>{
                console.log(res,'dadasda')
                this.InformationIdStr = res.data.idStr;
                this.Website = res.data.task.website;
                if(res.data.task != null && res.data.task.websiteCode !=null){
                    this.InformationDate = res.data.task.websiteCode;
                }else{
                    // this.InformationDate = {
                    //     political: [],
                    //     siteCode: [],
                    //     filings: [],
                    //     police: [],
                    //     siteUnit: [],
                    //     ontact: [],
                    //     mistake: [],
                    //     aging: [],
                    //     siteMap: []
                    // };
                    this.InformationDate = {
                        political: null,
                        siteCode: null,
                        filings: null,
                        police: null,
                        siteUnit: null,
                        ontact: null,
                        mistake: null,
                        aging: null,
                        siteMap: null
                    };
                }
                this.InformationS = true;
                console.log(this.InformationDate,'this.InformationDate')
                console.log(this.Website,'website')
            })
            
        },
        // 子->父
        InformationOpenS(val){
            this.InformationS = val;
            this.InformationIdStr = null;
            this.InformationDate = {};
            this.website = null;
            this.getList();
        },
        /**采集范围 */
        // 点击
        RuleUrlPatterns(row,val){
            columnListInfo({id:row.columnId}).then((res)=>{
                if(res.data){
                    this.RuleUrlPatternsIdStr = res.data.idStr;
                    if(res.data.task != null){
                        if(res.data.task.ruleExcludes != null && res.data.task.ruleUrlPatterns != null){
                            this.RuleUrlPatternsDate = {
                                ruleExcludes: res.data.task.ruleExcludes,
                                ruleUrlPatterns: res.data.task.ruleUrlPatterns,
                            };
                        }else if(res.data.task.ruleExcludes != null && res.data.task.ruleExcludes == null){
                            this.RuleUrlPatternsDate = {
                                ruleExcludes: res.data.task.ruleExcludes,
                                ruleUrlPatterns: [],
                            };
                        }else if(res.data.task.ruleExcludes == null && res.data.task.ruleExcludes != null){
                            this.RuleUrlPatternsDate = {
                                ruleExcludes: [],
                                ruleUrlPatterns: ow.task.ruleUrlPatterns,
                            };
                        }else{
                            this.RuleUrlPatternsDate = {
                                ruleExcludes: [],
                                ruleUrlPatterns: [],
                            };
                        }
                        // this.RuleUrlPatternsDate = {
                        //     ruleExcludes: row.task.ruleExcludes,
                        //     ruleUrlPatterns: row.task.ruleUrlPatterns,
                        // };
                    }else{
                        this.RuleUrlPatternsDate = {
                            ruleExcludes: [],
                            ruleUrlPatterns: [],
                        };
                    }
                    this.RuleUrlPatternsS = true;
                }
            })
            
        },
        // 子->父
        RuleUrlPatternsOpenS(val){
            this.RuleUrlPatternsS = val;
            this.RuleUrlPatternsIdStr = null;
            this.RuleUrlPatternsDate = {};
            this.getList();
        },

        /**点击事件 */
        // 点击
        OnClick(row,val){
            columnListInfo({id:row.columnId}).then((res)=>{
                if(res.data){
                    this.OnClickIdStr = res.data.idStr;
                    if(res.data.task != null && res.data.task.onClickMap != null){
                        this.OnClickDate = {
                            onClick: res.data.task.onClick,
                            onClickMap: res.data.task.onClickMap,
                        };
                    }else{
                        this.OnClickDate = {
                            onClick: false,
                            onClickMap: {},
                        };
                    }
                    this.OnClickS = true;
                }
                
            })
            
        },
        // 子->父
        OnClickOpenS(val){
            this.OnClickS = val;
            this.OnClickIdStr = null;
            this.OnClickDate = {};
            this.getList();
        },
        

        // 填报单位类型
        codeTypeChange(){
            this.form.siteCode = null;
            this.form.parentSite = null;
            this.form.mediaNum = null;
            if(!this.form.customFlag || this.form.customFlag == 0){ // 是否自定 1.是 2.否
                this.CustomSiteCodeS = true;
            }else if(this.form.customFlag == 1){
                this.CustomSiteCodeS = false;
            }
        },
        // 填报单位表示码模糊搜
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    let data = {
                        likeSiteOrName: query,
                        siteType: 1,
                        pgNum: 1,
                        pgSize: 5
                    }
                    queryList(data).then((res)=>{
                        this.parentSiteDate = res.data;
                    })
                },1000)
            }
        },
        // 填报单位类型下拉
        parentSiteChange(val){
            console.log(val,'父级单位标识码')
            if(val){
                if(this.form.customFlag == 1){ // 是否自定义 1.是 2.否
                    this.CustomSiteCodeS = false;
                    this.getCustomSiteCodeFn();
                }else if(this.form.customFlag == 0 || !this.form.customFlag){ // 非自定义
                    this.CustomSiteCodeS = true;
                }
                
            }else{
                this.form.siteCode = null;
                this.form.mediaNum = null;
            }
        },

        // 跳转前台（监管系统）
        goWeb(item,val){
            console.log(item)
            redirectInspectView(item).then((res)=>{
                console.log(res.data.url)
                window.open(res.data.url);
                
            })
        },

        // 导入
        // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.uploadType = type;
            if(type == 1){ // 联系人导入
                this.title6 = '联系人导入'
            }else if(type == 2){ // 新增导入
                this.title6 = '站点信息新增导入'
            }else if(type == 3){ // 修改导入
                this.title6 = '站点信息修改导入'
            }
            this.open6 = true;
        },
        // 取消
        cancel6(){
            this.fileList = [];
            this.subFileList = [];
            this.open6 = false;
            this.form6 = {};
            this.resetForm("form6");
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
            this.$refs["form6"].validate(valid => {
                if (valid) {
                    if(this.subFileList.length > 0){
                        const formData = new FormData();
                        if(this.uploadType == 1){ // 联系人
                            this.subFileList.forEach(f => {
                                formData.append("file", f.raw);
                                formData.append("taskType", 1100);
                            });
                            console.log(formData,'formData')
                        }else if(this.uploadType == 2){ // 新增导入
                            this.subFileList.forEach(f => {
                                formData.append("file", f.raw);
                                formData.append("taskType", 1200);
                                formData.append("customFlag", this.form6.customFlag);
                                // formData.append("parentSite", this.form6.parentSite);
                            });
                            console.log(formData,'formData')
                        }else if(this.uploadType == 3){ // 修改导入
                            this.subFileList.forEach(f => {
                                formData.append("file", f.raw);
                                formData.append("taskType", 1201);
                            });
                            console.log(formData,'formData')
                        }
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
                    
                }
            });
            
        },
        // 模板下载
        handleDown(){
            if(this.uploadType == 1){ // 联系人
                let fileName = '站点信息-联系人导入模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1100",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }else if(this.uploadType == 2 ){ // 新增导入
                let fileName = '站点信息-新增导入模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1200",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }else if(this.uploadType == 3){ // 修改导入
                let fileName = '站点信息-修改导入模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1201",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }
            
            
        },

        // 父级标识码
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.form6.parentSite = val.siteCode;
        },
        querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.form6.parentSite === '' || this.form6.parentSite == null) {
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

        // 网站标识码-刷新
        getCustomSiteCodeFn(){
            let data = {
                codeType: this.form.codeType,
                siteType: this.form.siteType,
                parentSite: this.form.parentSite,
            }
            getCustomSiteCode(data).then((res)=>{
                this.form.siteCode = res.data;
            })
        },

        // 任务详情
        goInfo(){
            this.$router.push({ path: '/basic/infoTaskInfo' })
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
</style>