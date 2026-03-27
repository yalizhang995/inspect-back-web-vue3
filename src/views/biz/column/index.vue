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
                            <el-tooltip
                                :disabled="showTitle" 
                                effect="dark"
                                :content="tooltipTitle"  
                                placement="right"
                                slot-scope="{ node, data }"
                            >
                                <span class="span-ellipsis" @mouseover="onShowNameTipsMouseenter">{{ node.label }}</span>
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
                    <el-form-item label="链接类型" prop="homePage">
                        <el-select v-model="queryParams.homePage" clearable placeholder="请选择链接类型">
                            <el-option
                                v-for="item in homePageDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="重点关注" prop="keynote">
                        <el-select v-model="queryParams.keynote" clearable placeholder="请选择重点关注">
                            <el-option
                                v-for="item in keynoteDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="启用状态" prop="enabled">
                        <el-select v-model="queryParams.enabled" clearable placeholder="请选择启用状态">
                            <el-option
                                v-for="item in enabledDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采集异常" prop="queueStatus">
                        <el-select v-model="queryParams.queueStatus" clearable placeholder="请选择采集异常">
                            <el-option
                                v-for="item in queueStatusDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站状态" prop="task">
                        <el-select v-model="taskStatus" clearable placeholder="请选择全站状态" @change="taskStatusChange">
                            <el-option
                                v-for="item in taskStatusDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否渲染" prop="task">
                        <el-select v-model="renderFlag" clearable placeholder="请选择是否渲染" @change="renderFlagChange">
                            <el-option
                                v-for="item in renderFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="返回码" prop="httpCode">
                        <el-input
                            v-model="queryParams.httpCode"
                            placeholder="请输入返回码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="采集类型" prop="taskType">
                        <el-select v-model=" queryParams.taskType" clearable placeholder="请选择采集类型" >
                            <el-option
                                v-for="item in taskTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item label="日常采集类型" prop="dailyType">
                        <el-select v-model=" queryParams.dailyType" clearable placeholder="请选择日常采集类型" >
                            <el-option
                                v-for="item in dailyTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站采集类型" prop="type">
                        <el-select v-model="queryParams.type" clearable placeholder="请选择全站采集类型">
                            <el-option
                                v-for="item in typeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务名称" prop="name">
                        <el-input
                            v-model="queryParams.name"
                            placeholder="请输入任务名称"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="批次ID" prop="batchId">
                        <el-input
                            v-model="queryParams.batchId"
                            placeholder="请输入批次ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="网站地址" prop="url">
                        <el-input
                            v-model="queryParams.url"
                            placeholder="请输入网站地址"
                            clearable
                            style="width:476px;"
                        />
                    </el-form-item>
                    <el-form-item label="任务ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="是否加急" prop="vip">
                        <el-select v-model=" queryParams.vip" clearable placeholder="请选择是否加急" >
                            <el-option
                                v-for="item in vipDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item style="marginLeft:30px">
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
                            v-hasPermi="['biz:Column:add']"
                        >新增</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="multiple"
                            @click="handleDelete"
                            v-hasPermi="['biz:inspReportTask:remove']"
                        >批量删除</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="ColumnList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="任务名称"  prop="name" width="220" show-overflow-tooltip fixed />
                    <el-table-column label="网站标识码"  prop="siteCode" width="140" fixed />
                    <el-table-column label="网站地址"  prop="url" width="400" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{scope.row.url}}</span>
                        </template>
                    </el-table-column>  
                    <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" content="点此复制网站地址" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label=""  prop="url" width="60" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>复制</span>
                        </template>
                    </el-table-column>  -->
                    <el-table-column label="采集类型" align="center" prop="taskTypeTxt" width="100" />
                    <el-table-column label="任务类型" align="center" prop="homePageTxt" width="100" />
                    <el-table-column label="重点关注" align="center" prop="keynoteTxt" width="100" />
                    <el-table-column label="启用状态" align="center" prop="enabledTxt" width="100" />

                    <el-table-column label="采集异常" align="center" prop="queueStatusTxt" width="100" />
                    <el-table-column label="采集方式" align="" prop="task.spiderTypeTxt" width="120" />
                    <el-table-column label="是否渲染" align="" prop="task.renderFlagTxt" width="140" />
                    <el-table-column label="返回码" align="center" prop="httpCode" width="100" />
                    <el-table-column label="下次采集" align="" prop="nextTime" width="160" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.nextTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="是否加急" align="center" prop="vipTxt" width="100">
                        <!-- <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.vipSwitch"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="vipSwitchChange(scope.row)"
                                >
                            </el-switch>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="代理采集" align="center" prop="task.proxyEnabledTxt" width="100" />
                    <el-table-column label="全站状态" align="center" prop="taskStatusTxt" width="100" />
                    <el-table-column label="订单ID" align="center" prop="orderId" width="100" />
                    <el-table-column label="批次ID" align="center" prop="batchId" width="100" />
                    
                    <el-table-column label="全站开启" align="" prop="task.statusTime" width="160" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.task.statusTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="全站结束" align="" prop="task.statusEndTime" width="160" sortable="custom" />
                    <!-- <el-table-column label="全站结束" align="center" prop="task.statusEndTime" width="160" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.task.statusEndTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="任务ID" align="" prop="idStr" width="220" show-overflow-tooltip />
                    <!-- <el-table-column label="周期ID" align="center" prop="batchId" width="100" show-overflow-tooltip /> -->
                    <el-table-column label="日常采集ID" align="" prop="scanId" width="180" show-overflow-tooltip />
                    <el-table-column label="全站采集ID" align="" prop="checkId" width="280" show-overflow-tooltip />
                    <el-table-column label="日常采集时间戳" align="" prop="scanTimestamp" width="160" show-overflow-tooltip />
                    <el-table-column label="全站采集时间戳" align="" prop="checkTimestamp" width="160" show-overflow-tooltip />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="380" fixed='right'>
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-mouse"
                                @click="goManuscript(scope.row)"
                            >跳转</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-thumb"
                                @click="vipSwitchChange(scope.row)"
                                v-hasPermi="['biz:column:columnVip']"
                            >{{scope.row.vipCZTxt}}</el-button>
                            <el-button
                                v-if="scope.row.homePage == true && scope.row.taskType == 2"
                                size="mini"
                                type="text"
                                icon="el-icon-thumb"
                                @click="TaskInit(scope.row)"
                                v-hasPermi="['biz:inspOrderBatch:TaskInit']"
                            >重新采集</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['biz:Column:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:Column:remove']"
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
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="Cookies(scope.row,'Cookies')"
                                        >Cookie信息</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="Rules(scope.row,'Rules')"
                                        >自定义抽取</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="IgnoreDate(scope.row,'IgnoreDate')"
                                        >日期过滤正则</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="ColumnUrlRules(scope.row,'ColumnUrlRules')"
                                        >栏目页链接正则</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="ContentUrlRules(scope.row,'ContentUrlRules')"
                                        >稿件页链接正则</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="UpdateIgnoreRules(scope.row,'UpdateIgnoreRules')"
                                        >首页/栏目页更新忽略</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="IgnoreExtract(scope.row,'IgnoreExtract')"
                                        >正文抽取过滤正则</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="ApiInfoList(scope.row,'ApiInfoList')"
                                        >API接口请求参数列表</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="RenderPrefix(scope.row,'RenderPrefix')"
                                        >链接渲染前缀</el-button
                                    >
                                </div>
                                <div class="paddL35">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-notebook-2"
                                        @click="IgnoreUpdateRules(scope.row,'IgnoreUpdateRules')"
                                        >站点忽略更新规则</el-button
                                    >
                                </div>
                                <el-button
                                    class="gaoji gjButton"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-guide"
                                    slot="reference"
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
        

        

        <!-- 添加或修改任务信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="860px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="145px">
                <div class="box">
                    <el-form-item label="链接类型" prop="homePage" style="width:48%">
                        <el-select v-model="form.homePage" clearable placeholder="请选择链接类型" style="width:90%">
                            <el-option
                                v-for="item in homePageDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <!-- <el-input v-model="form.siteCode"  placeholder="请输入网站标识码" style="width:90%" clearable /> -->
                        <el-tooltip class="item" effect="dark" content="失去焦点会重新校验网站标识码是否存在" placement="top-start">
                            <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width:90%" clearable />
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="网站名称" prop="name" style="width:93%">
                        <el-input v-model="form.name"  placeholder="请输入网站名称" clearable :disabled="!siteCodeType"/>
                    </el-form-item>
                    <el-form-item label="网站地址" prop="url" style="width:93%">
                        <el-input v-model="form.url"  placeholder="请输入网站地址" clearable :disabled="!siteCodeType" />
                    </el-form-item>
                    <el-form-item label="域名" prop="domain" style="width:93%" v-if="form.homePage == true">
                        <el-input v-model="form.domain"  placeholder="请输入域名" clearable :disabled="!siteCodeType"/>
                    </el-form-item>
                    <el-form-item label="请求头" prop="task.userAgent" style="width:93%" v-if="form.homePage == true">
                        <el-input v-model="form.task.userAgent"  placeholder="请输入浏览器请求头" clearable :disabled="!siteCodeType" />
                    </el-form-item>
                    <el-form-item label="编码格式" prop="task.charset" style="width:48%" v-if="form.homePage == true">
                        <el-select v-model="form.task.charset" clearable placeholder="请选择编码格式" style="width:90%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in charsetDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站采集深度" prop="task.statusDepth" style="width:48%" v-if="form.homePage == true">
                        <el-input-number v-model="form.task.statusDepth" controls-position="right" :min="0"  style="width:90%" :disabled="!siteCodeType"></el-input-number>
                    </el-form-item>
                    <el-form-item label="采集间隔" prop="task.spiderInterval" style="width:48%">
                        <el-input-number v-model="form.task.spiderInterval" controls-position="right" :min="0"  style="width:75%" :disabled="!siteCodeType"></el-input-number>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="连通性频率" prop="task.linkInterval" style="width:48%" >
                        <el-input-number v-model="form.task.linkInterval" controls-position="right" :min="0"  style="width:75%" :disabled="!siteCodeType"></el-input-number>
                        <span>（分）</span>
                    </el-form-item>
                    <el-form-item label="休眠时间" prop="task.sleepTime" style="width:48%" v-if="form.homePage == true">
                        <el-input-number v-model="form.task.sleepTime" controls-position="right" :min="0"  style="width:75%" :disabled="!siteCodeType"></el-input-number>
                        <span>（毫秒）</span>
                    </el-form-item>
                    <el-form-item label="重试次数" prop="task.retryTimes" style="width:48%" v-if="form.homePage == true">
                        <el-input-number v-model="form.task.retryTimes" controls-position="right" :min="0"  style="width:90%" :disabled="!siteCodeType"></el-input-number>
                    </el-form-item>
                    <el-form-item label="超时时间" prop="task.timeOut" style="width:48%" v-if="form.homePage == true">
                        <el-input-number v-model="form.task.timeOut" controls-position="right" :min="0"  style="width:75%" :disabled="!siteCodeType"></el-input-number>
                        <span>（毫秒）</span>
                    </el-form-item>
                    <el-form-item label="采集并发" prop="task.concurrency" style="width:48%">
                        <el-input-number v-model="form.task.concurrency" controls-position="right" :min="1"  style="width:90%" :disabled="!siteCodeType"></el-input-number>
                        <!-- <span>（毫秒）</span> -->
                    </el-form-item>
                    <el-form-item label="采集异常" prop="queueStatus" style="width:48%" v-if="form.homePage == true">
                        <el-select v-model="form.queueStatus" clearable placeholder="请选择编码格式" style="width:90%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in queueStatusDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="全站状态" prop="task.status" style="width:48%" v-if="form.homePage == true">
                        <el-select v-model="form.task.status" clearable placeholder="请选择编码格式" style="width:90%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in taskStatusDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采集方式" prop="task.spiderType" style="width:48%">
                        <el-select v-model="form.task.spiderType" clearable placeholder="请选择采集方式" style="width:90%">
                            <el-option
                                v-for="item in spiderTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否渲染" prop="task.renderFlag" style="width:48%">
                        <el-select v-model="form.task.renderFlag" clearable placeholder="请选择是否渲染" style="width:90%">
                            <el-option
                                v-for="item in renderFlagDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下次采集时间" prop="nextTime" style="width:48%">
                       <el-date-picker
                            v-model="form.nextTime"
                            type="datetime"
                            placeholder="选择下次采集时间"
                            style="width:90%"
                            @change="handleDateTimeChange"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item label="日常采集类型" prop="dailyType" style="width:48%">
                        <el-select v-model="form.dailyType" clearable placeholder="请选择日常采集类型" style="width:90%">
                            <el-option
                                v-for="item in dailyTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="全站采集类型" prop="type" style="width:48%">
                        <el-select v-model="form.type" clearable placeholder="请选择全站采集类型" style="width:90%">
                            <el-option
                                v-for="item in typeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="扫描类型" prop="task.scanType" style="width:48%">
                        <el-select v-model="form.task.scanType" clearable placeholder="请选择扫描类型" style="width:90%">
                            <el-option
                                v-for="item in scanTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否加急" prop="vip" style="width:48%">
                        <!-- <el-select v-model="form.vip" clearable placeholder="请选择编码格式" style="width:90%" :disabled="!siteCodeType"> -->
                        <el-select v-model="form.vip" clearable placeholder="请选择编码格式" style="width:90%" :disabled="isUpdate">
                            <el-option
                                v-for="item in vipDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否收费" prop="charge" style="width:48%">
                        <el-select v-model="form.charge" clearable placeholder="请选择编码格式" style="width:90%" :disabled="!siteCodeType">
                            <el-option
                                v-for="item in chargeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务类型" prop="taskType" style="width:48%">
                        <el-select v-model="form.taskType" clearable placeholder="请选择任务类型" style="width:90%" :disabled="isUpdate">
                            <el-option
                                v-for="item in taskTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="代理采集" prop="task.proxyEnabled" style="width:48%">
                        <!-- <el-switch v-model="form.task.proxyEnabled" active-color="#13ce66" inactive-color="#ff4949" :disabled="!siteCodeType"> </el-switch> -->
                        <el-select v-model="form.task.proxyEnabled" clearable placeholder="请选择代理采集" style="width:90%" >
                            <el-option
                                v-for="item in proxyEnabledDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="启用状态" prop="enabled" style="width:48%">
                        <el-switch v-model="form.enabled" active-color="#13ce66" inactive-color="#ff4949" :disabled="!siteCodeType"> </el-switch>
                    </el-form-item>
                    
                    
                    <el-form-item label="下载附件类型" prop="task.attachmentTyps" style="width:100%" v-if="form.homePage == true">
                        <el-checkbox-group v-model="form.task.attachmentTyps" @change="handleCheckedCitiesChange" :disabled="!siteCodeType">
                            <el-checkbox v-for="(item,index) in downloadTypeDate" :label="item.value" :key="item.value" :disabled='item.value == 2' >{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 底部标识信息 -->
        <WebsiteCode :getInformation="InformationS" :getInformationIdStr="InformationIdStr" :getInformationDate="InformationDate" :getWebsite="Website"  @openS= "InformationOpenS" v-if="InformationS"/>
        <!-- 采集范围 -->
        <RuleUrlPatterns :getRuleUrlPatterns="RuleUrlPatternsS" :getRuleUrlPatternsIdStr="RuleUrlPatternsIdStr" :getRuleUrlPatternsDate="RuleUrlPatternsDate" @openS= "RuleUrlPatternsOpenS" v-if="RuleUrlPatternsS" />
        <!-- 模拟点击事件 -->
        <OnClick :getOnClick="OnClickS" :getOnClickIdStr="OnClickIdStr" :getOnClickDate="OnClickDate" @openS= "OnClickOpenS" v-if="OnClickS" />
        <!-- cookies -->
        <Cookies :getCookies="CookiesS" :getCookiesIdStr="CookiesIdStr" :getCookiesDate="CookiesDate" @openS= "CookiesOpenS" v-if="CookiesS" />
        <!-- 自定义抽取 -->
        <Rules :getRules="RulesS" :getRulesIdStr="RulesIdStr" :getRulesDate="RulesDate" @openS= "RulesOpenS" v-if="RulesS" />

        <!-- 日期过滤正则 -->
        <IgnoreDate :getIgnoreDate="IgnoreDateS" :getIgnoreDateDateIdStr="IgnoreDateIdStr" :getIgnoreDateDate="IgnoreDateDate" @openS= "IgnoreDateOpenS" v-if="IgnoreDateS" />
        <!-- 栏目页链接正则匹配规则 -->
        <ColumnUrlRules :getColumnUrlRules="ColumnUrlRulesS" :getColumnUrlRulesDateIdStr="ColumnUrlRulesIdStr" :getColumnUrlRulesDate="ColumnUrlRulesDate" @openS= "ColumnUrlRulesOpenS" v-if="ColumnUrlRulesS" />
        <!-- 稿件页链接正则匹配规则 -->
        <ContentUrlRules :getContentUrlRules="ContentUrlRulesS" :getContentUrlRulesDateIdStr="ContentUrlRulesIdStr" :getContentUrlRulesDate="ContentUrlRulesDate" @openS= "ContentUrlRulesOpenS" v-if="ContentUrlRulesS" />
        <!-- 首页/栏目页更新忽略规则 -->
        <UpdateIgnoreRules :getUpdateIgnoreRules="UpdateIgnoreRulesS" :getUpdateIgnoreRulesDateIdStr="UpdateIgnoreRulesIdStr" :getUpdateIgnoreRulesDate="UpdateIgnoreRulesDate" @openS= "UpdateIgnoreRulesOpenS" v-if="UpdateIgnoreRulesS" />
        <!-- 正文抽取过滤正则 -->
        <IgnoreExtract :getIgnoreExtract="IgnoreExtractS" :getIgnoreExtractIdStr="IgnoreExtractIdStr" :getIgnoreExtractDate="IgnoreExtractDate" @openS= "IgnoreExtractOpenS" v-if="IgnoreExtractS" />
        <!-- API接口请求参数列表 -->
        <ApiInfoList :getApiInfoList="ApiInfoListS" :getApiInfoListIdStr="ApiInfoListIdStr" :getApiInfoListDate="ApiInfoListDate" @openS= "ApiInfoListOpenS" v-if="ApiInfoListS" />
        <!-- 链接渲染前缀 -->
        <RenderPrefix :getRenderPrefixs="RenderPrefixS" :getRenderPrefixDateIdStr="RenderPrefixIdStr" :getRenderPrefixDate="RenderPrefixDate" @openS= "RenderPrefixOpenS" v-if="RenderPrefixS" />

        <!-- 站点忽略更新规则 -->
        <IgnoreUpdateRules :getIgnoreUpdateRuless="IgnoreUpdateRulesS" :getIgnoreUpdateRulesDateIdStr="IgnoreUpdateRulesIdStr" :getIgnoreUpdateRulesDate="IgnoreUpdateRulesDate" @openS= "IgnoreUpdateRulesOpenS" v-if="IgnoreUpdateRulesS" />
        
        
        <!-- <component
            :is="item.id"
            v-for="(item,index) in conArrS"
            :key="index"
            :data="item.id"
            v-if="item.showS"
            :getInformation="InformationS" 
            :getInformationIdStr="InformationIdStr" 
            @openS= "InformationOpenS"
        ></component> -->
    </div>
</template>

<script>
import {
    listColumn,
    getColumn,
    delColumn,
    addColumn,
    updateColumn,
    spiderTaskInit,
    addVip
} from "@/api/biz/column";
import {
    siteInfoExist
} from "@/api/biz/inspChannel";
import global_ from '@/utils/Global';

import {
    listInspSiteTree,
} from "@/api/biz/inspSiteTree";

import WebsiteCode from './WebsiteCode'
import RuleUrlPatterns from './RuleUrlPatterns'
import OnClick from './OnClick'
import Cookies from './Cookies'
import Rules from './Rules'

import IgnoreDate from './IgnoreDate'
import ColumnUrlRules from './ColumnUrlRules'
import ContentUrlRules from './ContentUrlRules'
import UpdateIgnoreRules from './UpdateIgnoreRules'
import IgnoreExtract from './IgnoreExtract'
import ApiInfoList from './ApiInfoList'
import RenderPrefix from './renderPrefix'

import IgnoreUpdateRules from './IgnoreUpdateRules'



export default {
    name: "Column",
    components: {
        WebsiteCode,
        RuleUrlPatterns,
        OnClick,
        Cookies,
        Rules,
        ColumnUrlRules,
        ContentUrlRules,
        UpdateIgnoreRules,
        IgnoreDate,
        IgnoreExtract,
        ApiInfoList,
        RenderPrefix,
        IgnoreUpdateRules
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
            // 任务信息表格数据
            ColumnList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                id: null,
                siteCode: null,
                name: null,
                homePage: null,
                enabled: true,
                keynote: null,
                queueStatus: null,
                task: {},
                orderTypes: [{ code: 0, name: 'nt' }], // 表格排序
                // ancestorsFind: null,
                treeInfo: { psCode: null },
                url: null,
                renderFlag: null,
                dailyType: null,
                type: null,
                taskType: null,
                proxyEnabled: null,
                idStr: null,
                vip: null

            },
            taskStatus: null,
            renderFlag: null,
            // 表单参数
            form: {
                id: null,
                homePage: null,
                siteCode: null,
                name: null,
                url: null,
                domain: null,
                enabled: true,
                task: {
                    userAgent: null,
                    charset: 'UTF-8',
                    statusDepth: 0,
                    spiderInterval: 60,
                    linkInterval: 60,
                    sleepTime: 3000,
                    retryTimes: 0,
                    timeOut: 15000,
                    concurrency: 10,
                    attachmentTyps: [2],
                    status: true,
                    spiderType: 0,
                    renderFlag: 0,
                    scanType: null,
                    proxyEnabled: null
                },
                queueStatus: 0,
                tasktype: 1,
                nextTime: null,
                dailyType: 0,
                type: 0,
                vip: false,
                charge: false,
                name: null,
                batchId: null,
            },
            // 表单校验
            rules: {
                homePage: [{ required: true, message: '请选择链接类型', trigger: 'change' }],
                siteCode: [
                    { required: true, message: '请输入网站标识码', trigger: 'blur',  },
                    { validator: this.validateSiteCode, trigger: 'blur' }
                ],
                name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
                url: [
                    { required: true, message: '请输入网站地址', trigger: 'blur' },
                    // { pattern: global_.strRegex, message: global_.strRegex_msg, trigger: 'blur' },
                ],
                domain: [
                    { required: true, message: '请输入域名', trigger: 'blur' },
                    // { pattern: global_.strRegex, message: '请输入正确的域名', trigger: 'blur' },
                ],
                // domain: [{ required: true, message: '请输入根域名', trigger: 'blur' }],
                enabled: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
                'task.proxyEnabled': [{ required: true, message: '请选择是否开启代理采集', trigger: 'change' }],
                
                // task
                'task.userAgent': [{ required: false, message: '请输入浏览器请求头', trigger: 'blur' }],
                'task.charset': [{ required: true, message: '请选择编码格式', trigger: 'change' }],
                'task.statusDepth': [{ required: true, message: '请输入全站采集深度', trigger: 'blur' }],
                'task.spiderInterval': [{ required: true, message: '请输入采集间隔', trigger: 'blur' }],
                'task.linkInterval': [{ required: true, message: '请输入通联系检查频率', trigger: 'blur' }],
                'task.sleepTime': [{ required: true, message: '请输入休眠时间', trigger: 'blur' }],
                'task.retryTimes': [{ required: true, message: '请输入重试次数', trigger: 'blur' }],
                'task.timeOut': [{ required: true, message: '请输入超时时间', trigger: 'blur' }],
                'task.concurrency': [{ required: true, message: '请输入采集并发', trigger: 'blur' }],
                'task.attachmentTyps': [{ required: true, message: '请选择下载附件类型', trigger: 'change' }],
                queueStatus: [{ required: true, message: '请选择采集异常', trigger: 'change' }],
                'task.status': [{ required: true, message: '请选择全站状态', trigger: 'change' }],
                'task.spiderType': [{ required: true, message: '请选择采集方式', trigger: 'change' }],
                'task.renderFlag': [{ required: true, message: '请选择是否渲染', trigger: 'change' }],
                'task.scanType': [{ required: true, message: '请选择扫描类型', trigger: 'change' }],
                dailyType: [{ required: true, message: '请选择日常采集类型', trigger: 'change' }],
                type: [{ required: true, message: '请选择全站采集类型', trigger: 'change' }],
                vip: [{ required: true, message: '请选择是否加急', trigger: 'change' }],
                charge: [{ required: true, message: '请选择是否收费', trigger: 'change' }],
                
                
            },

            /**下拉菜单数据 */
            enabledDate: [ // 启用状态
                { label: '启用', value: true },
                { label: '未启用', value: false },
            ],
            proxyEnabledDate: [ // 是否开启代理采集
                { label: '开启', value: 1 },
                { label: '关闭', value: 0 },
            ],
            homePageDate: [ // 链接类型
                { label: '首页', value: true },
                { label: '栏目', value: false },
            ],
            keynoteDate: [ // 重点关注
                { label: '是', value: true },
                { label: '否', value: false },
            ],
            downloadTypeDate: [ // 下载附件类型
                { label: '图片', value: 1 },
                { label: '页面(必选)', value: 2 },
                { label: '附件', value: 3} ,
                { label: 'JS', value: 4 },
                { label: 'CSS', value: 5 },
                { label: '视频', value: 6 },
                { label: '音频', value: 7 },
            ],
            charsetDate: [ // 编码格式
                { label: 'UTF-8', value: 'UTF-8' },
                { label: 'ISO-8859-1', value: 'ISO-8859-1' },
                { label: 'GBK', value: 'GBK' },
                { label: 'gb2312', value: 'gb2312' },
            ],
            queueStatusDate: [ // 采集异常
                { label: '封锁', value: -1 },
                { label: '异常错误', value: -2 },
                { label: '域名跳转', value: -3 },
                { label: '协议跳转', value: -4 },
                { label: '纠错正文为空', value: -5 },
                { label: '采集为空', value: -6 },
                { label: '页面超限', value: -7 },
                { label: '正常', value: 0 },
            ],
            taskStatusDate: [ // 全站状态
                { label: '初始化', value: 0 },
                { label: '待采集', value: 1 },
                { label: '采集中', value: 2 },
                { label: '采集完成', value: 3 },
                { label: '异常终止', value: 4 },
                { label: '启动失败', value: 5 },
                { label: '等待数据', value: 6 },
            ],
            spiderTypeDate: [ // 采集方式
                { label: '浏览器模式', value: 0 },
                { label: '无头浏览器模式', value: 1 },
            ],
            renderFlagDate: [ // 是否渲染
                { label: '不渲染', value: 0 },
                { label: '首页+栏目渲染', value: 1 },
                { label: '全站渲染', value: 2 },
                { label: '首页渲染', value: 3 },
                { label: '栏目渲染', value: 4 },
                // { label: '全站采集渲染翻页', value: 5 },
            ],
            typeDate: [ // 全站采集类型
                { label: '本地采集', value: 0 },
                { label: '接口采集', value: 1 },
            ],
            dailyTypeDate: [ // 日常采集类型
                { label: '本地采集', value: 0 },
                { label: '接口采集', value: 1 },
                { label: '进行中', value: 2 },
                { label: '下发任务异常', value: 4 },
            ],
            scanTypeDate: [ // 扫描类型
                { label: '正常', value: 'normal' },
                { label: 'JS', value: 'js' },
                { label: 'API', value: 'api' },
            ],
            vipDate: [ // 是否加急
                // { label: '加急', value: true },
                // { label: '不加急', value: false },
                { label: '加急', value: 1 },
                { label: '不加急', value: 0 },
            ],
            chargeDate: [ // 是否收费
                { label: '收费', value: true },
                { label: '免费', value: false },
            ],
            taskTypeDate: [ // 任务状态
                { label: '日常', value: 1 },
                { label: '全站', value: 2 },
            ],
            taskTypeDate: [ // 采集类型
                { label: '日常', value: 1 },
                { label: '全站', value: 2 }
            ],
            
            
            siteCodeType: false, // 网站标识码是否存在开关

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
            // cookie
            CookiesS: false,
            CookiesIdStr: null,
            CookiesDate: {},
            // 自定义抽取
            RulesS: false,
            RulesIdStr: null,
            RulesDate: {},

            // 栏目页链接正则
            IgnoreDateS: false,
            IgnoreDateIdStr: null,
            IgnoreDateDate: [],

            // 栏目页链接正则
            ColumnUrlRulesS: false,
            ColumnUrlRulesIdStr: null,
            ColumnUrlRulesDate: [],
            
            // 稿件页链接正则
            ContentUrlRulesS: false,
            ContentUrlRulesIdStr: null,
            ContentUrlRulesDate: [],

            // 首页/栏目更新忽略正则
            UpdateIgnoreRulesS: false,
            UpdateIgnoreRulesIdStr: null,
            UpdateIgnoreRulesDate: [],

            // 正文抽取过滤正则
            IgnoreExtractS: false,
            IgnoreExtractIdStr: null,
            IgnoreExtractDate: {},

            // api接口请求参数列表
            ApiInfoListS: false,
            ApiInfoListIdStr: null,
            ApiInfoListDate: [],

            // 链接渲染前缀
            RenderPrefixS: false,
            RenderPrefixIdStr: null,
            RenderPrefixDate: [],

            // 站点忽略更新规则
            IgnoreUpdateRulesS: false,
            IgnoreUpdateRulesIdStr: null,
            IgnoreUpdateRulesDate: [],
            

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

            isUpdate: false,
            

            
        };
    },
    // beforeRouteLeave(to, from, next) {
    //     // 在这里处理页面离开逻辑
    //     console.log('离开页面了！');
    //     // 确保调用next()以便路由继续跳转
    //     sessionStorage.removeItem('columnObj')
    //     next();

    // },
    created() {
        if(!sessionStorage.getItem('columnObj')){
            this.getList();
        }
        this.getListzd(0);
        this.getScreenHeight();
    },
    activated(){
        if(sessionStorage.getItem('columnObj')){
            let obj = JSON.parse(sessionStorage.getItem('columnObj'));
            this.queryParams.siteCode = obj.siteCode;
            this.queryParams.url = obj.url;
            this.getList();
            // this.queryParams.url = obj.siteCode;
        }
    },
    methods: {
        getScreenHeight(){
            this.leftTreeHeight = window.innerHeight;
            this.treeHeight = this.leftTreeHeight - 120 + 'px';
            console.log(this.leftTreeHeight,'this.leftTreeHeight')
        },
        /** 查询任务信息列表 */
        getList() {
            this.loading = true;
            listColumn(this.queryParams).then(response => {
                this.ColumnList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.ColumnList){
                    // 采集类型
                    if(this.ColumnList[i].taskType == 1){
                        this.ColumnList[i].taskTypeTxt = '日常';
                    }else if(this.ColumnList[i].taskType == 2){
                        this.ColumnList[i].taskTypeTxt = '全站';
                    }
                    // 任务类型
                    if(this.ColumnList[i].homePage == true){
                        this.ColumnList[i].homePageTxt = '首页';
                    }else if(this.ColumnList[i].homePage == false){
                        this.ColumnList[i].homePageTxt = '栏目';
                    }
                    // 重点关注
                    if(this.ColumnList[i].keynote == true){
                        this.ColumnList[i].keynoteTxt = '是';
                    }else if(this.ColumnList[i].keynote == false){
                        this.ColumnList[i].keynoteTxt = '否';
                    } 
                    // 启用状态
                    if(this.ColumnList[i].enabled == true){
                        this.ColumnList[i].enabledTxt = '启用';
                    }else if(this.ColumnList[i].enabled == false){
                        this.ColumnList[i].enabledTxt = '未启用';
                    }
                    // 是否加急
                    if(this.ColumnList[i].vip == 0){
                        this.ColumnList[i].vipTxt = '不加急';
                        this.ColumnList[i].vipSwitch = false;
                        this.ColumnList[i].vipCZTxt = '加急';
                    }else if(this.ColumnList[i].vip == 1){
                        this.ColumnList[i].vipTxt = '加急';
                        this.ColumnList[i].vipSwitch = true;
                        this.ColumnList[i].vipCZTxt = '取消加急';
                    }
                    // 是否开启代理采集
                    if(this.ColumnList[i].task.proxyEnabled == 1){
                        this.ColumnList[i].task.proxyEnabledTxt = '开启';
                    }else if(this.ColumnList[i].task.proxyEnabled == 0){
                        this.ColumnList[i].task.proxyEnabledTxt = '关闭';
                    }else{
                        this.ColumnList[i].task.proxyEnabledTxt = '--';
                    }
                    // 采集异常
                    if(this.ColumnList[i].queueStatus == -1){
                        this.ColumnList[i].queueStatusTxt = '封锁';
                    }else if(this.ColumnList[i].queueStatus == -2){
                        this.ColumnList[i].queueStatusTxt = '异常错误';
                    }else if(this.ColumnList[i].queueStatus == -3){
                        this.ColumnList[i].queueStatusTxt = '域名跳转';
                    }else if(this.ColumnList[i].queueStatus == -4){
                        this.ColumnList[i].queueStatusTxt = '协议跳转';
                    }else if(this.ColumnList[i].queueStatus == -6){
                        this.ColumnList[i].queueStatusTxt = '采集为空';
                    }else if(this.ColumnList[i].queueStatus == 0){
                        this.ColumnList[i].queueStatusTxt = '正常';
                    }else{
                        this.ColumnList[i].queueStatusTxt = '--';
                    }
                    // 全站状态
                    if(this.ColumnList[i].task.status == 0){
                        this.ColumnList[i].taskStatusTxt = '初始化';
                    }else if(this.ColumnList[i].task.status == 1){
                        this.ColumnList[i].taskStatusTxt = '待采集';
                    }else if(this.ColumnList[i].task.status == 2){
                        this.ColumnList[i].taskStatusTxt = '采集中';
                    }else if(this.ColumnList[i].task.status == 3){
                        this.ColumnList[i].taskStatusTxt = '采集完成';
                    }else if(this.ColumnList[i].task.status == 4){
                        this.ColumnList[i].taskStatusTxt = '异常终止';
                    }else if(this.ColumnList[i].task.status == 5){
                        this.ColumnList[i].taskStatusTxt = '启动失败';
                    }else if(this.ColumnList[i].task.status == 6){
                        this.ColumnList[i].taskStatusTxt = '等待数据';
                    }else{
                        this.ColumnList[i].taskStatusTxt = '--';
                    }
                    // 返回码
                    if(!this.ColumnList[i].httpCode){
                       this.ColumnList[i].httpCode = '--'; 
                    }
                    // 全站结束时间  
                    if(!this.ColumnList[i].task.statusEndTime){
                       this.ColumnList[i].task.statusEndTime = '--'; 
                    }
                    // 是否渲染
                    if(this.ColumnList[i].task.renderFlag == 0){
                        this.ColumnList[i].task.renderFlagTxt = '不渲染';
                    }else if(this.ColumnList[i].task.renderFlag == 1){
                        this.ColumnList[i].task.renderFlagTxt = '首页+栏目渲染';
                    }else if(this.ColumnList[i].task.renderFlag == 2){
                        this.ColumnList[i].task.renderFlagTxt = '全站渲染';
                    }else if(this.ColumnList[i].task.renderFlag == 3){
                        this.ColumnList[i].task.renderFlagTxt = '首页渲染';
                    }else if(this.ColumnList[i].task.renderFlag == 4){
                        this.ColumnList[i].task.renderFlagTxt = '栏目渲染';
                    }
                    // else if(this.ColumnList[i].task.renderFlag == 5){
                    //     this.ColumnList[i].task.renderFlagTxt = '全站采集渲染翻页';
                    // }

                    // 采集方式
                    if(this.ColumnList[i].task.spiderType == 0){
                        this.ColumnList[i].task.spiderTypeTxt = '浏览器模式';
                    }else if(this.ColumnList[i].task.spiderType == 1){
                        this.ColumnList[i].task.spiderTypeTxt = '无头浏览器模式';
                    }
                    // 类型
                    if(this.ColumnList[i].taskType == 1){
                        this.ColumnList[i].taskTypeTxt = '日常';
                    }else if(this.ColumnList[i].taskType == 2){
                        this.ColumnList[i].taskTypeTxt = '全站';
                    }
                    // 订单ID
                    if(!this.ColumnList[i].orderId){
                       this.ColumnList[i].orderId = '--'; 
                    }
                    // 批次ID
                    if(!this.ColumnList[i].batchId){
                       this.ColumnList[i].batchId = '--'; 
                    }
                    if(!this.ColumnList[i].scanId){
                       this.ColumnList[i].scanId = '--'; 
                    }
                    if(!this.ColumnList[i].checkId){
                       this.ColumnList[i].checkId = '--'; 
                    }
                    if(!this.ColumnList[i].scanTimestamp){
                       this.ColumnList[i].scanTimestamp = '--'; 
                    }
                    if(!this.ColumnList[i].checkTimestamp){
                       this.ColumnList[i].checkTimestamp = '--'; 
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
                homePage: null,
                siteCode: null,
                name: null,
                url: null,
                domain: null,
                enabled: true,
                task: {
                    userAgent: null,
                    charset: 'UTF-8',
                    statusDepth: 0,
                    spiderInterval: 60,
                    linkInterval: 60,
                    sleepTime: 3000,
                    retryTimes: 0,
                    timeOut: 15000,
                    concurrency: 10,
                    attachmentTyps: [2],
                    status: true,
                    spiderType: 0,
                    renderFlag: 0,
                    scanType: null,
                    proxyEnabled: null
                },
                queueStatus: 0,
                taskType: 1,
                nextTime: null,
                dailyType: 0,
                type: 0,
                vip: false,
                charge: false,
                name: null,
                batchId: null,
            };
            this.resetForm("form");
            this.siteCodeType = false;
            this.isUpdate = false; // 是否为修改
            
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            // this.queryParams.ancestorsFind = null;
            this.queryParams.treeInfo = {psCode: null};
            this.resetForm("queryForm");
            this.taskStatus = null;
            this.renderFlag = null;
            this.queryParams.task = {};
            sessionStorage.removeItem('columnObj')
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
            this.title = "添加任务信息";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row)
            this.reset();
            this.isUpdate = true;
            const id = row.idStr || this.ids;
            getColumn({id:id}).then(response => {
                this.form = response.data;
                if(this.form.dailyType == null){
                    this.form.dailyType = 0;
                }
                if(this.form.type == null){
                    this.form.type = 0;
                }
                if(this.form.vip == null){
                    this.form.vip = false;
                }
                if(this.form.charge == null){
                    this.form.charge = false;
                }
                this.open = true;
                this.title = "修改任务信息";
                console.log(this.form)
                // 栏目task为null
                if(this.form.task == null){
                    this.form.task = {
                        userAgent: null,
                        charset: 'UTF-8',
                        statusDepth: 0,
                        spiderInterval: 60,
                        linkInterval: 60,
                        sleepTime: 3000,
                        retryTimes: 0,
                        timeOut: 15000,
                        concurrency: 10,
                        attachmentTyps: [2],
                        queueStatus: 0,
                        status: true,
                        spiderType: 0,
                        renderFlag: 0,
                        scanType: null,
                    }
                }else{
                    if(this.form.task.concurrency == null){
                        this.form.task.concurrency = 10;
                    }
                }
                

            });
            this.siteCodeType = true;
        },
        /** 提交按钮 */
        submitForm() {
            console.log(this.form,'this.form')
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'this.form')
                    this.form.task.attachmentTypsStr = this.form.task.attachmentTyps.join(",")
                    if(this.form.homePageDate == true){ // 首页
                        // if(this.form.task.status == true){
                        //     this.form.taskType = 2;
                        // }else if(this.form.task.status == false){
                        //     this.form.taskType = 2;                        
                        // }
                    }
                    if (this.form.id != null) {
                        console.log('edit')
                        updateColumn(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        console.log('add')
                        addColumn(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
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
                    .confirm('是否确认删除任务名称为"' + row.name + '"的数据项？')
                    .then(function() {
                        return delColumn({ids:[ids]});
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
                        return delColumn({ids:ids});
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("删除成功");
                    })
                    .catch(() => {});
            }
            
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "biz/Column/export",
                {
                    ...this.queryParams
                },
                `Column_${new Date().getTime()}.xlsx`
            );
        },
        // 查看关系-联系人
        handleSee(row){
            sessionStorage.setItem('siteCode', row.siteCode);
            // window.location.href = '/basic/inspSiteDirector';
            this.$router.push({name:'inspSiteDirector'})
        },
        
        // 下载附件类型
        handleCheckedCitiesChange(value) {
            this.form.downloadType  = value;
            console.log(this.form.downloadType)
        },
        // 网站标识码校验
        validateSiteCode(rule, value, callback){
            let date = {
                siteCode: value,
                siteType: null,
            }
            siteInfoExist(date).then((res)=>{
                this.siteCodeType = res.data.exist;
                if(this.siteCodeType == false){
                    callback(new Error('网站标识不存在，请重新输入'));
                }else{
                    callback();
                    this.siteCodeType = true;
                }
            })
        },

        // 搜索条件-全站状态
        taskStatusChange(){
            console.log(this.taskStatus,'taskStatus')
            if(this.taskStatus != null){
                console.log('ok')
                // this.queryParams.task = { status: this.taskStatus }
                this.$set(this.queryParams.task, 'status', this.taskStatus)
            }else if(this.taskStatus == '' || this.taskStatus == null || this.taskStatus == undefined){
                console.log('no')
                // this.queryParams.task = null;
                this.$delete(this.queryParams.task, 'status')
            }
        },
        // 搜索条件-是否渲染
        renderFlagChange(){
            console.log(this.renderFlag,'renderFlag')
            if(this.renderFlag != null){
                console.log('ok')
                // this.queryParams.task = { renderFlag: this.renderFlag }
                this.$set(this.queryParams.task, 'renderFlag', this.renderFlag)
            }else if(this.renderFlag == '' || this.renderFlag == null || this.renderFlag == undefined){
                console.log('no')
                // this.queryParams.task = null;
                this.$delete(this.queryParams.task, 'renderFlag')
            }
        },

        /**重新采集 */
        TaskInit(row){
            spiderTaskInit({idStr: row.idStr}).then((res)=>{
                this.$modal.msgSuccess("已开始重新采集");
                this.getList();
            })
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
            this.queryParams.treeInfo.psCode = data.siteCode;
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




        /**
         * 操作-高级
         * 1.底部标识信息
         * 2.采集范围
         * 3.点击事件
         * 4.Cookie信息
         * 5.事件抽取
         */

        /**底部标识信息 */
        // 点击
        Information(row,val){
            console.log(row,'row')
            this.InformationIdStr = row.idStr;
            if(row.task.website == null){
                this.Website = true;
            }else{
                this.Website = row.task.website;
            }
            if(row.task != null && row.task.websiteCode !=null){
                this.InformationDate = row.task.websiteCode;
            }else{
                this.InformationDate = {
                    political: null,
                    siteCode: null,
                    filings: null,
                    police: null,
                    siteUnit: null,
                    ontact: null,
                    mistake: null,
                    aging: null,
                    siteMap: null,
                };
            }
            this.InformationS = true;
            console.log(this.InformationDate,'this.InformationDate')
            console.log(this.Website,'website')
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
            this.RuleUrlPatternsIdStr = row.idStr;
            if(row.task != null){
                if(row.task.ruleExcludes != null && row.task.ruleUrlPatterns != null){
                    this.RuleUrlPatternsDate = {
                        ruleExcludes: row.task.ruleExcludes,
                        ruleUrlPatterns: row.task.ruleUrlPatterns,
                    };
                }else if(row.task.ruleExcludes != null && row.task.ruleExcludes == null){
                    this.RuleUrlPatternsDate = {
                        ruleExcludes: row.task.ruleExcludes,
                        ruleUrlPatterns: [],
                    };
                }else if(row.task.ruleExcludes == null && row.task.ruleExcludes != null){
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
            this.OnClickIdStr = row.idStr;
            if(row.task != null && row.task.onClickMap != null){
                this.OnClickDate = {
                    onClick: row.task.onClick,
                    onClickMap: row.task.onClickMap,
                };
            }else{
                this.OnClickDate = {
                    onClick: false,
                    onClickMap: {},
                };
            }
            this.OnClickS = true;
        },
        // 子->父
        OnClickOpenS(val){
            this.OnClickS = val;
            this.OnClickIdStr = null;
            this.OnClickDate = {};
            this.getList();
        },

        /**cookie */
        // 点击
        Cookies(row,val){
            this.CookiesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.cookies != null){
                    this.CookiesDate = {
                        disableCookieManagement: row.task.disableCookieManagement,
                        cookies: row.task.cookies
                    };
                }else{
                    this.CookiesDate = {
                        disableCookieManagement: row.task.disableCookieManagement,
                        cookies: {}
                    };
                }
                
            }else{
                this.CookiesDate = {
                    disableCookieManagement: false,
                    cookies: {}
                };
            }
            this.CookiesS = true;
        },
        // 子->父
        CookiesOpenS(val){
            this.CookiesS = val;
            this.CookiesIdStr = null;
            this.CookiesDate = {};
            this.getList();
        },

        /**自定义抽取 */
        // 点击
        Rules(row,val){

            this.RulesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.rules != null){
                    this.RulesDate = row.task.rules;
                }else{
                    this.RulesDate = {
                        home: {},
                        catalog: {},
                        content: {},
                        column: {},
                        homeUpdate: {},
                    }
                }
                
            }else{
                this.RulesDate = {
                    home: {},
                    catalog: {},
                    content: {},
                    column: {},
                    homeUpdate: {}
                }
            }
            this.RulesS = true;
        },
        // 子->父
        RulesOpenS(val){
            this.RulesS = val;
            this.RulesIdStr = null;
            this.RulesDate = {};
            this.getList();
        },

        /**日期过滤正则 */
        // 点击
        IgnoreDate(row,val){
            console.log(row,'row')
            this.IgnoreDateIdStr = row.idStr;
            if(row.task != null){
                if(row.task.ignoreDate){
                    this.IgnoreDateDate = row.task.ignoreDate;
                }else{
                    this.IgnoreDateDate = null;
                }
                
            }else{
                this.IgnoreDateDate = null;
            }
            console.log(this.IgnoreDateDate,'IgnoreDateDate')
            this.IgnoreDateS = true;
        },
        // 子->父
        IgnoreDateOpenS(val){
            this.IgnoreDateS = val;
            this.IgnoreDateIdStr = null;
            this.IgnoreDateDate = [];
            this.getList();
        },

         /**栏目页链接正在匹配规则 */
        // 点击
        ColumnUrlRules(row,val){
            console.log(row,'row')
            this.ColumnUrlRulesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.columnUrlRules && row.task.columnUrlRules.length > 0){
                    this.ColumnUrlRulesDate = row.task.columnUrlRules;
                }else{
                    this.ColumnUrlRulesDate = []
                }
                
            }else{
                this.ColumnUrlRulesDate = []
            }
            console.log(this.ColumnUrlRulesDate,'ColumnUrlRulesDate')
            this.ColumnUrlRulesS = true;
        },
        // 子->父
        ColumnUrlRulesOpenS(val){
            this.ColumnUrlRulesS = val;
            this.ColumnUrlRulesIdStr = null;
            this.ColumnUrlRulesDate = [];
            this.getList();
        },

        /**稿件页链接正在匹配规则 */
        // 点击
        ContentUrlRules(row,val){
            console.log(row,'row')
            this.ContentUrlRulesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.contentUrlRules && row.task.contentUrlRules.length > 0){
                    this.ContentUrlRulesDate = row.task.contentUrlRules;
                }else{
                    this.ContentUrlRulesDate = []
                }
                
            }else{
                this.ContentUrlRulesDate = []
            }
            console.log(this.ContentUrlRulesDate,'ContentUrlRulesDate')
            this.ContentUrlRulesS = true;
        },
        // 子->父
        ContentUrlRulesOpenS(val){
            this.ContentUrlRulesS = val;
            this.ContentUrlRulesIdStr = null;
            this.ContentUrlRulesDate = [];
            this.getList();
        },

        /**首页/栏目更新忽略规则 */
        // 点击
        UpdateIgnoreRules(row,val){
            console.log(row,'row')
            this.UpdateIgnoreRulesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.updateIgnoreRules && row.task.updateIgnoreRules.length > 0){
                    this.UpdateIgnoreRulesDate = row.task.updateIgnoreRules;
                }else{
                    this.UpdateIgnoreRulesDate = []
                }
                
            }else{
                this.UpdateIgnoreRulesDate = []
            }
            console.log(this.UpdateIgnoreRulesDate,'UpdateIgnoreRulesDate')
            this.UpdateIgnoreRulesS = true;
        },
        // 子->父
        UpdateIgnoreRulesOpenS(val){
            this.UpdateIgnoreRulesS = val;
            this.UpdateIgnoreRulesIdStr = null;
            this.UpdateIgnoreRulesDate = [];
            this.getList();
        },

        /**正文抽取过滤正则 */
        // 点击
        IgnoreExtract(row,val){
            console.log(row,'row')
            this.IgnoreExtractIdStr = row.idStr;
            if(row.task != null && row.task.ignoreExtract != null){
                this.IgnoreExtractDate = row.task.ignoreExtract;
            }else{
                this.IgnoreExtractDate = row.task.ignoreExtract;
            }
            this.IgnoreExtractS = true;
        },
        // 子->父
        IgnoreExtractOpenS(val){
            this.IgnoreExtractS = val;
            this.IgnoreExtractIdStr = null;
            this.IgnoreExtractDate = {};
            this.getList();
        },

        /**API接口请求参数列表 */
        // 点击
        ApiInfoList(row,val){
            console.log(row,'row')
            this.ApiInfoListIdStr = row.idStr;
            if(row.task != null && row.apiInfoList != null){
                this.ApiInfoListDate = row.apiInfoList;
            }else{
                this.ApiInfoListDate = [];
            }
            this.ApiInfoListS = true;
            console.log(this.ApiInfoListDate,'父-子this.ApiInfoListDate')
        },
        // 子->父
        ApiInfoListOpenS(val){
            this.ApiInfoListS = val;
            this.ApiInfoListIdStr = null;
            this.ApiInfoListDate = [];
            this.getList();
        },

        /**链接渲染前缀 */
        // 点击
        RenderPrefix(row,val){
            console.log(row,'row')
            this.RenderPrefixIdStr = row.idStr;
            if(row.task != null){
                if(row.task.renderPrefixList && row.task.renderPrefixList.length > 0){
                    this.RenderPrefixDate = row.task.renderPrefixList;
                }else{
                    this.RenderPrefixDate = []
                }
                
            }else{
                this.RenderPrefixDate = []
            }
            console.log(this.RenderPrefixDate,'RenderPrefixDate')
            this.RenderPrefixS = true;
        },
        // 子->父
        RenderPrefixOpenS(val){
            this.RenderPrefixS = val;
            this.RenderPrefixIdStr = null;
            this.RenderPrefixDate = [];
            this.getList();
        },

        /**站点忽略更新规则 */
        // 点击
        IgnoreUpdateRules(row,val){
            console.log(row,'row')
            this.IgnoreUpdateRulesIdStr = row.idStr;
            if(row.task != null){
                if(row.task.ignoreUpdateRules && row.task.ignoreUpdateRules.length > 0){
                    this.IgnoreUpdateRulesDate = row.task.ignoreUpdateRules;
                }else{
                    this.IgnoreUpdateRulesDate = []
                }
                
            }else{
                this.IgnoreUpdateRulesDate = []
            }
            console.log(this.IgnoreUpdateRulesDate,'IgnoreUpdateRulesDate')
            this.IgnoreUpdateRulesS = true;
        },
        // 子->父
        IgnoreUpdateRulesOpenS(val){
            this.IgnoreUpdateRulesS = val;
            this.IgnoreUpdateRulesIdStr = null;
            this.IgnoreUpdateRulesDate = [];
            this.getList();
        },





        // 地址超链接
        dzChange(url){
            console.log(url)
            const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
            if(reg.test(url) == false){
                window.open('http://'+url)
            }else{
                window.open(url)
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
        // 下次采集时间
        handleDateTimeChange(value) {
            console.log(value)
            if (value) {
                // 将日期时间转换为时间戳
                this.form.nextTime = new Date(value).getTime();
                console.log('时间戳:', this.form.nextTime);
            }
        },


        // 采集加急开关事件
        vipSwitchChange(row){
            console.log(row,'加急开关')
            let vip = null;
            if(row.vip == 0){ // 不加急
                vip = 1;
            }else if(row.vip == 1){ // 加急
                vip = 0;
            }
            let subDate = {
                idStr: row.idStr,
                vip: vip
            };
            console.log(subDate,'subDate')
            addVip(subDate).then(()=>{
                this.getList();
                this.$modal.msgSuccess("修改成功");
            })
        },

        // 跳转首页、栏目稿件
        goManuscript(row){
            if(row.homePage == true){ // 首页
                sessionStorage.setItem('homeManuscriptColumnObj', JSON.stringify(row));
                this.$router.push({ path: '/machine/HomeManuscript' });
            }else if(row.homePage == false){ // 栏目
                sessionStorage.setItem('columnManuscriptColumnObj', JSON.stringify(row));
                this.$router.push({ path: '/machine/ColumnManuscript' });
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
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
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
