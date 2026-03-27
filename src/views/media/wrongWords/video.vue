<template>
    <div class="app-container">
        <!-- 表格全屏 -->
        <div class="bigWrapBox" v-if="upHeightType">
            <!-- 待审核 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini"  :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger"  plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button>
                </el-col>
                <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange"></right-toolbar> -->
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 已审核正确 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '2'">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button>
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 已审核错误 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '3'">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini"  @click="handleFile(2)" >整改导入</el-button>
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <div class="tabBox">
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    :height="upTableHeight"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <el-table-column prop="word" label="错敏词" width="200" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.word" placement="top"> -->
                                <span>{{scope.row.word}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="推荐词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.suggest" placement="top"> -->
                                <span>{{scope.row.suggest}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.wordLeft}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.wordRight}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="所在文章" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top"> -->
                                <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="position" label="文章位置" width="160" align="center"></el-table-column> -->
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column>
                    <el-table-column prop="siteName" label="父页面信息" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" style="marginLeft:0">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination
                v-show="total>0"
                :total="total"
                :page-sizes="[100, 200, 500, 1000]"
                :page-size="100"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            />
        </div>
        <!-- 正常展示 -->
         <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!upHeightType">
             <!-- 待审核 -->
             <!-- 66742d67e5d9fb4938e173c4 -->
            <el-tab-pane label="待审核" name="1">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                    v-if="activeName == '1'"
                >
                    <el-form-item label="站点信息" prop="">
                         <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入组织填报单位名称或标识码"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="新媒体标识码" prop="siteCodeMedia">
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <!-- <el-form-item label="网站标识码" prop="siteCodeMedia">
                        <el-input
                            v-model="queryParams.siteCodeMedia"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="错别字" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错别字"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>

                    
                   
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:300px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:300px">
                            <el-option
                                v-for="item in wtlxList[0]"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:300px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单" prop="">
                        <el-select v-model="orderId" filterable remote placeholder="请选择订单"  @change="ddChange" :remote-method="remoteMethod" clearable style="width:300px">
                            <el-option
                            v-for="item in orderInfoList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="batchId" filterable remote placeholder="请选择订单批次" :remote-method="remoteMethod2" clearable style="width:300px">
                            <el-option
                            v-for="item in orderBatchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="账号信息" prop="accountNameLike">
                        <el-input
                            v-model="queryParams.accountNameLike"
                            placeholder="请输入账号信息"
                            clearable
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="账号类型" prop="mediaType">
                        <el-select v-model="queryParams.mediaType" clearable placeholder="请选择账号类型" style="width:300px">
                            <el-option
                                v-for="item in zhlxList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="" prop="searchDateKey">
                        <el-select v-model="queryParams.searchDateKey" clearable placeholder="请选择" style="width:100px;margin:0 10px 0 0" @change="sjChange" >
                            <el-option
                            v-for="item in shsjList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:290px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item style="marginLeft:8px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
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
                            type="success"
                            plain
                            icon="el-icon-monitor"
                            size="mini"
                            :disabled="multiple"
                            @click="handUpdateAll(2)"
                        >批量显示</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-mouse"
                            size="mini"
                            :disabled="multiple"
                            @click="handUpdateAll(4)"
                        >批量误报</el-button>
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
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(1)"
                            
                        >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(2)"
                            
                        >整改导入</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    height="500"
                    v-if="activeName == '1'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                    <el-table-column prop="word" label="错敏词" width="200" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.word" placement="top"> -->
                                <span>{{scope.row.word}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="推荐词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.suggest" placement="top"> -->
                                <span>{{scope.row.suggest}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="所在上下文" width="240">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.wordLeft}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.wordRight}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="title" label="所在文章" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top"> -->
                                <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="position" label="文章位置" width="160" align="center"></el-table-column> -->
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="siteName" label="父页面信息" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" align="center" label="附件路径" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-link dz" @click="dzChange(scope.row.fileObsPath)"></i>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" sortable="custom"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" style="marginLeft:0">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
            <!-- 已审核正确 -->
            <el-tab-pane label="已审核正确" name="2">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                    v-if="activeName == '2'"
                >
                    <el-form-item label="站点信息" prop="">
                         <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="新媒体标识码" prop="siteCodeMedia">
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <!-- <el-form-item label="网站标识码" prop="siteCodeMedia">
                        <el-input
                            v-model="queryParams.siteCodeMedia"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:300px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="wtlxTxt" clearable placeholder="请选择问题类型" style="width:300px">
                            <el-option
                                v-for="item in wtlxList[0]"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:300px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单" prop="">
                        <el-select v-model="orderId" filterable remote placeholder="请选择订单"  @change="ddChange" :remote-method="remoteMethod" clearable style="width:300px">
                            <el-option
                            v-for="item in orderInfoList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="batchId" filterable remote placeholder="请选择订单批次" :remote-method="remoteMethod2" clearable style="width:300px">
                            <el-option
                            v-for="item in orderBatchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="账号信息" prop="accountNameLike">
                        <el-input
                            v-model="queryParams.accountNameLike"
                            placeholder="请输入账号信息"
                            clearable
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="账号类型" prop="mediaType">
                        <el-select v-model="queryParams.mediaType" clearable placeholder="请选择账号类型" style="width:300px">
                            <el-option
                                v-for="item in zhlxList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="searchDateKey">
                        <el-select v-model="queryParams.searchDateKey" clearable placeholder="请选择" style="width:100px;margin:0 10px 0 0" @change="sjChange" >
                            <el-option
                            v-for="item in shsjList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:290px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item style="marginLeft:8px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '2'">
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
                            type="primary"
                            plain
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="multiple"
                            @click="handleUpdateAll"
                        >批量整改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="danger"
                            plain
                            icon="el-icon-mouse"
                            size="mini"
                            :disabled="multiple"
                            @click="handUpdateAll(4)"
                        >批量误报</el-button>
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
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(1)"
                            
                        >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(2)"
                            
                        >整改导入</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    v-if="activeName == '2'"
                    height="500"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                    <el-table-column prop="word" label="错敏词" width="200" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                                <!-- <el-tooltip class="item" effect="dark" :content="scope.row.word" placement="top"> -->
                                <span>{{scope.row.word}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="推荐词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.suggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="所在上下文" width="240">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.wordLeft}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.wordRight}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="title" label="所在文章" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="position" label="文章位置" width="160" align="center"></el-table-column> -->
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="siteName" label="父页面信息" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" align="center" label="附件路径" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-link dz" @click="dzChange(scope.row.fileObsPath)"></i>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" sortable="custom"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <!-- <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column> -->
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row,scope.$index)" >整改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" style="marginLeft:0">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
            <!-- 已审核错误 -->
            <el-tab-pane label="已审核错误" name="3">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                    v-if="activeName == '3'"
                >
                    <el-form-item label="站点信息" prop="">
                         <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="新媒体标识码" prop="siteCodeMedia">
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <!-- <el-form-item label="网站标识码" prop="siteCodeMedia">
                        <el-input
                            v-model="queryParams.siteCodeMedia"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            @keyup.enter.native="handleQuery"
                            style="width:300px"
                        />
                    </el-form-item>
                    
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:300px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="wtlxTxt" clearable placeholder="请选择问题类型" style="width:300px">
                            <el-option
                                v-for="item in wtlxList[0]"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:300px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单" prop="">
                        <el-select v-model="orderId" filterable remote placeholder="请选择订单"  @change="ddChange" :remote-method="remoteMethod" clearable style="width:300px">
                            <el-option
                            v-for="item in orderInfoList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="batchId" filterable remote placeholder="请选择订单批次" @change="pcChange" :remote-method="remoteMethod2" clearable style="width:300px">
                            <el-option
                            v-for="item in orderBatchList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
                    <el-form-item label="账号信息" prop="accountNameLike">
                        <el-input
                            v-model="queryParams.accountNameLike"
                            placeholder="请输入账号信息"
                            clearable
                            style="width:300px"
                        />
                    </el-form-item>
                    <el-form-item label="账号类型" prop="mediaType">
                        <el-select v-model="queryParams.mediaType" clearable placeholder="请选择账号类型" style="width:300px">
                            <el-option
                                v-for="item in zhlxList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" prop="searchDateKey">
                        <el-select v-model="queryParams.searchDateKey" clearable placeholder="请选择" style="width:100px;margin:0 10px 0 0" @change="sjChange" >
                            <el-option
                            v-for="item in shsjList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val">
                            </el-option>
                        </el-select>
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:290px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item style="marginLeft:8px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '3'">
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
                            type="success"
                            plain
                            icon="el-icon-monitor"
                            size="mini"
                            :disabled="multiple"
                            @click="handUpdateAll(2)"
                        >批量显示</el-button>
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
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(1)"
                            
                        >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-top"
                            size="mini"
                            @click="handleFile(2)"
                            
                        >整改导入</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    row-key="idStr"
                    v-if="activeName == '3'"
                    height="500"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                    <el-table-column prop="word" label="错敏词" width="200" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.word}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="推荐词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.suggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="所在上下文" width="240">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.wordLeft}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.wordRight}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                            
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="title" label="所在文章" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top"> -->
                                <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="position" label="文章位置" width="160" align="center"></el-table-column> -->
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="siteName" label="父页面信息" width="200"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" align="center" label="附件路径" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i class="el-icon-link dz" @click="dzChange(scope.row.fileObsPath)"></i>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" sortable="custom"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <!-- <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column> -->
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
        </el-tabs>

        <!-- 添加或修改站点关系对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <div class="box">
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        {{form.siteCode}}
                    </el-form-item>
                    <el-form-item label="网站名称" prop="siteName" style="width:48%">
                        {{editObj.siteName}}
                    </el-form-item>
                    <el-form-item label="首次发现时间" prop="createTime" style="width:48%">
                        {{editObj.createTime}}
                    </el-form-item>
                    <el-form-item label="监测时间" prop="scanTime" style="width:48%">
                        {{editObj.scanTime}}
                    </el-form-item>
                    <el-form-item label="审核时间" prop="auditTime" style="width:48%">
                        {{editObj.auditTime}}
                    </el-form-item>
                    <el-form-item label="整改时间" prop="rectifyTime" style="width:48%">
                        {{editObj.rectifyTime}}
                    </el-form-item>
                    <el-form-item label="错敏词" prop="word" style="width:93%">
                        <el-input v-model="form.word" placeholder="请输入错敏词" />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggest" style="width:93%">
                        <el-input v-model="form.suggest" placeholder="请输入推荐词"/>
                    </el-form-item>
                    <el-form-item label="问题级别" prop="severity" style="width:48%">
                        <el-select v-model="form.severity" clearable placeholder="请选择问题级别" style="width:90%" >
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作" prop="showState" style="width:48%">
                        <el-select v-model="form.showState" clearable placeholder="请选择操作" style="width:90%" >
                            <el-option
                                v-for="item in czList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="修改说明" prop="explanation" style="width:93%">
                        <el-input v-model="form.explanation" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改站点关系对话框 -->
        <el-dialog title="整改状态" :visible.sync="open2" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="120px">
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-radio-group v-model="form2.reviewResult">
                            <el-radio :label="1">待整改</el-radio>
                            <el-radio :label="2">已整改</el-radio>
                            <el-radio :label="3">忽略</el-radio>
                        </el-radio-group>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>
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
    getOrderBatchSelectList,
    editReviewResult,
    wrongWordsEnumMap,
    editBatch,
    editReviewResultBatch,
    batchImport,
    inspImportdataTask,
    downloadExcelTpl
} from "@/api/media/wrongWords";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { inspOrderInfoQueryList } from "@/api/biz/inspOrderInfo";
import { inspOrderBatchQueryList } from "@/api/biz/inspOrderBatch";
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
                pgSize: 100,
                // siteCodeOrg: null, // 标识码-主管
                treeInfo: {'psCode': null},
                // searchKey: 'sc',
                searchDateKey: 'ct',
                // searchVal: '',
                severity: null, // 问题级别
                startDate: null, // 开始时间
                endDate: null, // 结束时间
                typeIn: [], // 问题类型
                // wordType: 1,
                orderTypes: [{ code: 1, name: 'ct' }], // 表格排序
                siteCodeMedia: null, // 新媒体
                wordLike: null, // 错敏词
                suggestLike: null, // 推荐词
                sentenceLike: null, // 上下文
                batchInfo: null,
                showStateIn: [1],
                reviewResult: null, // 整改状态
                typeIn: [], // 问题类型
                linkLocation: null,
                pid: null,
                mediaType: null, // 新媒体类型
                accountNameLike: null, // 账号信息
                checkUrlType: 'video',
                idStr: null
            },
            wtlxTxt: null,
            orderId: null,
            batchId: null,
            /**下拉菜单数据 */
            // 问题级别
            wtjbList: [ 
                { label: '严重', val: 1 },
                { label: '一般', val: 2 },
                { label: '轻微', val: 3 },
            ],
            // 时间类型
            DateArr: [],
            shsjList: [ 
                { label: '监测时间', val: 'ct' },
                { label: '审核时间', val: 'ate' },
                { label: '发布时间', val: 'pti' },
            ],
            // 操作类型
            czList: [ 
                { label: '显示', val: 2 },
                // { label: '显示并预警', val: 3 },
                { label: '误报', val:  4 },
            ],
            // 整改状态
            zgztList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '忽略', val: 3 },
            ],


            // 提交表单
            form: {},
            rules: {
                word: [{ required: true, message: '请输入错敏词', trigger: 'blur' }],
                suggest: [{ required: true, message: '请输入推荐词', trigger: 'blur' }],
                severity: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
                showState: [{ required: true, message: '请选择操作', trigger: 'change' }],
            },

            // 整改
            open2: false, 
            form2: {
                idStr: null,
                reviewResult: null
            },
            rules2: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            editObj: {},

            // 站点关系树选项
            inspSiteTreeOptions: [],

            orderInfoList: [], // 订单
            orderBatchList: [], // 批次

            wtlxList: [], // 问题类型

            zgType: null,

            upIndex: null,
            zgIndex: null,
            
            // 链接位置
            ljwzList: [
                { label: '首页', val: 1 },
                { label: '其他页', val: 2 }
            ],

            // 导出
            open4: false, 
            form4: {
                menuType: 200
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            zhlxList: [
                { label: '微信公众号', value: 1 },
                { label: '新浪微博', value: 2 },
                { label: '抖音短视频', value: 3 },
                { label: '今日头条', value: 4 },
                { label: '快手短视频', value: 5 },
                { label: '移动客户端', value: 111 },
                { label: '人民号', value: 112 },
                { label: '百家号', value: 113 },
                { label: '腾讯微视', value: 117 },
                { label: '企鹅号', value: 118 },
                { label: '南方号', value: 119 },
                { label: '一点号', value: 120 },
                { label: '网易', value: 121 },
                { label: '小程序', value: 122 },
                { label: '大鱼号', value: 123 },
                { label: '搜狐号', value: 124 },
                { label: '澎湃号', value: 125 },
                { label: '其他', value: 114 },
            ],

            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: null,

            upHeightType: false,
            showUpHeight: true,
            upTableHeight: '86vh',
            fdsx: true,

            
        };
    },
    created() {
        // this.getList();
        // this.getListInspOrderBatch(); // 批次
        this.getTreeselect();
        this.getWtlxList(); // 问题类型
    },
    methods: {
        upHeightChange(val){
            if(this.inspSiteInfoList.length > 0){
                this.upHeightType = val;                
            }
        },
        upHeightOldChange(){
            this.upHeightType = false;
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
                        siteType: 1,
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
                    console.log(this.inspSiteTreeOptions,'inspSiteTreeOptions')
                    console.log(Array.isArray(this.inspSiteTreeOptions[0].children))

                callback();
            }
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            listInspSiteInfo(this.queryParams).then(response => {
                // let arrDate = response.data;
                for(var i in response.rows){
                    response.rows[i].index = parseInt(i)+1;
                    if(!response.rows[i].suggest){
                        response.rows[i].suggest = '--';
                    }
                    // 发布时间
                    if(!response.rows[i].pubTime){
                        response.rows[i].pubTime = '--';
                    }
                    // 审核时间
                    if(!response.rows[i].auditTime){
                        response.rows[i].auditTime = '--';
                    }
                    // 整改时间
                    if(!response.rows[i].rectifyTime){
                        response.rows[i].rectifyTime = '--';
                    }
                    // 父页面信息
                    if(!response.rows[i].fromTitle){
                        response.rows[i].fromTitleTxt = response.rows[i].fromUrl;
                    }else{
                        response.rows[i].fromTitleTxt = response.rows[i].fromTitle;
                    }
                    if(!response.rows[i].fromUrl){
                        response.rows[i].fromTitleTxt = '--';
                    }
                    // 问题级别状态颜色
                    if(response.rows[i].severity == 1){ // 严重
                        response.rows[i].severityBgColor = '#ff6563';
                    }else if(response.rows[i].severity == 2){ // 一般
                        response.rows[i].severityBgColor = '#ea9940';
                    }else if(response.rows[i].severity == 3){ // 轻微
                        response.rows[i].severityBgColor = '#48b93f';
                    }
                    
                    // 整改状态
                    if(response.rows[i].reviewResult == 1){ 
                        response.rows[i].reviewResultTxt = '待整改';
                    }else if(response.rows[i].reviewResult == 2){ 
                        response.rows[i].reviewResultTxt = '已整改';
                    }else if(response.rows[i].reviewResult == 3){ 
                        response.rows[i].reviewResultTxt = '忽略';
                    }
                    response.rows[i].wordLeft = response.rows[i].sentence.split(response.rows[i].word)[0];
                    response.rows[i].wordRight = response.rows[i].sentence.split(response.rows[i].word)[1];
                    // response.rows[i].mediaType = 4;
                    if(response.rows[i].mediaType == 1){
                        response.rows[i].ico = require('../../../assets/images/wx.jpeg')
                    }else if(response.rows[i].mediaType == 2){
                        response.rows[i].ico = require('../../../assets/images/wb.jpeg')
                    }else if(response.rows[i].mediaType == 3){
                        response.rows[i].ico = require('../../../assets/images/dy.jpeg')
                    }else if(response.rows[i].mediaType == 4){
                        response.rows[i].ico = require('../../../assets/images/tt.jpeg')
                    }else if(response.rows[i].mediaType == 5){
                        response.rows[i].ico = require('../../../assets/images/ks.jpeg')
                    }else if(response.rows[i].mediaType == 111){
                        response.rows[i].ico = require('../../../assets/images/yd.png')
                    }else if(response.rows[i].mediaType == 112){
                        response.rows[i].ico = require('../../../assets/images/rm.png')
                    }else if(response.rows[i].mediaType == 113){
                        response.rows[i].ico = require('../../../assets/images/bj.png')
                    }else if(response.rows[i].mediaType == 117){
                        response.rows[i].ico = require('../../../assets/images/tx.png')
                    }else if(response.rows[i].mediaType == 118){
                        response.rows[i].ico = require('../../../assets/images/qe.png')
                    }else if(response.rows[i].mediaType == 119){
                        response.rows[i].ico = require('../../../assets/images/nf.png')
                    }else if(response.rows[i].mediaType == 120){
                        response.rows[i].ico = require('../../../assets/images/ydh.png')
                    }else if(response.rows[i].mediaType == 121){
                        response.rows[i].ico = require('../../../assets/images/wy.png')
                    }else if(response.rows[i].mediaType == 122){
                        response.rows[i].ico = require('../../../assets/images/xcx.png')
                    }else if(response.rows[i].mediaType == 123){
                        response.rows[i].ico = require('../../../assets/images/dy.png')
                    }else if(response.rows[i].mediaType == 124){
                        response.rows[i].ico = require('../../../assets/images/sh.png')
                    }else if(response.rows[i].mediaType == 125){
                        response.rows[i].ico = require('../../../assets/images/pp.png')
                    }else {
                        response.rows[i].ico = require('../../../assets/images/qt.png')
                    }
                    // 所在文章
                    if(response.rows[i].title == null || response.rows[i].title == ''){
                        if(response.rows[i].url == null){
                            response.rows[i].title = '--';
                        }else{
                            response.rows[i].title = response.rows[i].url;
                        }
                    }
                }
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
         /** 查询订单信息列表 */
        getListInspOrderBatch() {
            // this.loading = true;
            getOrderBatchSelectList({}).then(res => {
                this.pcList = this.handleTree(
                    res.data,
                    "id",
                    "pid",
                );
                for(var i in this.pcList){
                    this.pcList[i].label = this.pcList[i].name;
                    this.pcList[i].value = this.pcList[i].valId;
                    for(var j in this.pcList[i].children){
                        this.pcList[i].children[j].label = this.pcList[i].children[j].name+'（'+this.pcList[i].children[j].startDate+'）';
                        this.pcList[i].children[j].value = this.pcList[i].children[j].valId;
                    }
                }
            });
        },
        // 问题类型
        getWtlxList(){
            wrongWordsEnumMap().then((res)=>{
                for(var i in res.data){
                    // 问题类型
                    if(i == 'errorTypeMap'){
                        this.wtlxList = [];
                        this.wtlxList.push(res.data[i]);
                    }
                }
                console.log(this.wtlxList,'问题类型数据')
            })
        },
        // tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            // this.resetForm("queryForm");
            this.queryParams.pgNum = 1;
            this.queryParams.pgSize = 100;
            if(tab.name == '1'){
                this.queryParams.showStateIn = [1];
                this.queryParams.orderTypes = [{ code: 1, name: 'createTime' }]; // 表格排序
                // this.getList();
            }else if(tab.name == '2'){
                this.queryParams.showStateIn = [2,3];
                this.queryParams.orderTypes = [{ code: 1, name: 'auditTime' }]; // 表格排序
                // this.getList();
            }else if(tab.name == '3'){
                this.queryParams.showStateIn = [4];
                this.queryParams.orderTypes = [{ code: 1, name: 'auditTime' }]; // 表格排序
                // this.getList();
            }
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
            if(this.DateArr){
                this.queryParams.startDate = this.DateArr[0];
                this.queryParams.endDate = this.DateArr[1];
                if(this.queryParams.startDate){
                    this.queryParams.startDate = this.formatDate(this.queryParams.startDate) + ' 00:00:00';
                }
                if(this.queryParams.endDate){
                    this.queryParams.endDate = this.formatDate(this.queryParams.endDate) + ' 23:59:59';
                }
            }
            console.log(this.orderId,'this.orderId')
            console.log(this.batchId,'this.batchId')
            // 订单、批次
            if(!this.orderId && !this.batchId){
                this.queryParams.batchInfo = null;
            }else{
                this.queryParams.batchInfo = {orderId: null, batchId: null}
                if(this.orderId){
                    this.queryParams.batchInfo.orderId = this.orderId;
                }else{
                    this.queryParams.batchInfo.orderId = null;
                }
                if(this.batchId){
                    this.queryParams.batchInfo.batchId = this.batchId;
                }else{
                    this.queryParams.batchInfo.batchId = null;
                }
            }
            // if(this.wtlxTxt){
            //     this.queryParams.typeIn = [];
            //     this.queryParams.typeIn.push(this.wtlxTxt)
            // }else{
            //     this.queryParams.typeIn = [];
            // }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.queryParams.treeInfo.psCode = null;
            this.orderBatchList = [];
            this.orderInfoList = [];
            this.queryParams.batchInfo = null;
            this.orderId = null;
            this.batchId = null;
            this.wtlxTxt = null;
            this.queryParams.typeIn = [];
            if(this.activeName == '1'){
                this.queryParams.orderTypes = [{ code: 1, name: 'createTime' }]
            }else {
                this.queryParams.orderTypes = [{ code: 1, name: 'auditTime' }]
            }
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
        /** 修改按钮操作 */
        handleUpdate(row,index,delIndex) {
            console.log(delIndex,'删除下标')
            this.reset();
            const id = row.idStr || this.ids;
            getInspSiteInfo({id:id}).then(response => {
            //     // this.form = response.data;
                this.editObj = response.data;
                // 审核时间
                if(!this.editObj.auditTime){
                    this.editObj.auditTime = '--';
                }
                // 整改时间
                if(!this.editObj.rectifyTime){
                    this.editObj.rectifyTime = '--';
                }
                if(index && typeof index === 'number' == true){
                    this.form.id = response.data.idStr;
                    this.form.siteCode = response.data.siteCode;
                    this.form.word = response.data.word;
                    this.form.suggest = response.data.suggest;
                    this.form.severity = response.data.severity;
                    this.form.showState = index;                    
                    this.form.explanation = response.data.explanation;
                    console.log(this.form,'subForm')
                    updateInspSiteInfo(this.form).then(response => {
                        this.$modal.msgSuccess("操作成功");
                        this.inspSiteInfoList.splice(delIndex, 1);
                        if(this.inspSiteInfoList.length == 0){
                            setTimeout(()=>{
                                this.getList();
                            },1000)
                        }
                    });
                }else{
                    this.upIndex = delIndex;
                    this.form.id = response.data.idStr;
                    this.form.siteCode = response.data.siteCode;
                    this.form.word = response.data.word;
                    this.form.suggest = response.data.suggest;
                    this.form.severity = response.data.severity;
                    if(response.data.showState == 1){
                        this.form.showState = 2;                    
                    }else{
                        this.form.showState = response.data.showState;
                    }
                    this.form.explanation = response.data.explanation;
                    console.log(this.form,'this.form-header')
                    this.open = true;
                    this.title = "编辑";
                }
            });
        },
        // 批量修改
        handUpdateAll(index){
            let data = {
                ids: this.ids,
                showState: index
            }
            let tit = '';
            if(index == 2){
                tit = '显示';
            }else if(index == 4){
                tit = '误报';
            }
            this.$modal.confirm('是否确认'+ tit +'已选中的数据项？').then(() => {
                editBatch(data).then((res)=>{
                    this.$modal.msgSuccess("操作成功");  
                    this.inspSiteInfoList = this.inspSiteInfoList.filter(
                        (a) => !this.ids.some((b) => a.idStr === b)
                    )
                    console.log(this.inspSiteInfoList,'操作后的列表数据')
                    if(this.inspSiteInfoList.length == 0){
                        setTimeout(()=>{
                            this.getList();
                        },1000)
                    }  
                })
            }).catch(() => {});
            
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form)
                    if (this.form.id != null) {
                        updateInspSiteInfo(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            // this.getList();
                            this.inspSiteInfoList.splice(this.upIndex, 1);
                            if(this.inspSiteInfoList.length == 0){
                                setTimeout(()=>{
                                    this.getList();
                                },1000)
                            }
                        });
                    }
                }
            });
        },
        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
        },
        /** 整改按钮操作 */
        handleUpdate2(row,index) {
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            const id = row.idStr || this.ids;
            this.zgIndex = index;
            getInspSiteInfo({id:id}).then(response => {
                this.form2.idStr = response.data.idStr;
                this.form2.reviewResult = response.data.reviewResult;
                console.log(this.form2,'this.form-header')
                this.open2 = true;
                this.zgType = 1; // 1、单个 2、批量
            });
        },
        // 批量整改
        handleUpdateAll(){
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            this.zgType = 2; // 1、单个 2、批量
            this.open2 = true;
        },
        
        /** 提交按钮 */
        submitForm2() {
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    console.log(this.form2)
                    // if (this.form2.idStr != null) {
                        if(this.zgType == 1){
                            editReviewResult(this.form2).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                // this.getList();
                                this.inspSiteInfoList.splice(this.zgIndex, 1);
                                if(this.inspSiteInfoList.length == 0){
                                    setTimeout(()=>{
                                        this.getList();
                                    },1000)
                                }
                            });
                        }else{
                            let data = {
                                ids: this.ids,
                                reviewResult: this.form2.reviewResult
                            }
                            console.log(data,'data')
                            editReviewResultBatch(data).then(()=>{
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                // this.getList();
                                this.inspSiteInfoList = this.inspSiteInfoList.filter(
                                    (a) => !this.ids.some((b) => a.idStr === b)
                                )
                                console.log(this.inspSiteInfoList,'操作后的列表数据')
                                if(this.inspSiteInfoList.length == 0){
                                    setTimeout(()=>{
                                        this.getList();
                                    },1000)
                                }  
                            })
                        }
                    // }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row,delIndex) {
            console.log(row)
            if(row.id){
                const ids = row.idStr
                this.$modal
                    .confirm('是否确认删除该条数据？')
                    .then(function() {
                        return delInspSiteInfo({ids:[ids]});
                    })
                    .then(() => {
                        // this.getList();
                        this.$modal.msgSuccess("删除成功");
                        this.inspSiteInfoList.splice(delIndex, 1);
                        if(this.inspSiteInfoList.length == 0){
                            setTimeout(()=>{
                                this.getList();
                            },1000)
                        }
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
                        // this.getList();
                        this.$modal.msgSuccess("删除成功");
                        this.inspSiteInfoList = this.inspSiteInfoList.filter(
                            (a) => !this.ids.some((b) => a.idStr === b)
                        )
                        console.log(this.inspSiteInfoList,'操作后的列表数据')
                        if(this.inspSiteInfoList.length == 0){
                            setTimeout(()=>{
                                this.getList();
                            },1000)
                        } 
                    })
                    .catch(() => {});
            }
            
        },
        // 表单重置
        reset4() {
            this.form4 = {
                menuType: 200,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 200,
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
                    subData.menuType = 200;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '视频监测数据'
                        this.download(
                            "biz/mediaWrongWords/export",this.queryParams,
                            `${fileName}.xlsx`
                        ).then((res)=>{
                            this.open4 = false;
                        });
                    }
                    
                }
            });
        },
        // 时间
        sjChange(){
            // this.queryFrom.searchDateKey
            this.DateArr = [];
        },
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
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

        // 订单模糊搜
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderInfoDateList(query); // 查询订单下拉数据
                },1000)
            }
        },
        // 订单批次模糊搜
        remoteMethod2(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    this.getorderBatchIdDateList(query); // 查询订单下拉数据
                },1000)
            }
        },
         /** 查询订单列表 */
        // 搜索条件
        getorderInfoDateList(orderName) {
            this.loading = true;
            let date = {
                orderName: orderName,
                orderType: 20,
            }
            inspOrderInfoQueryList(date).then(response => {
                this.orderInfoList = response.data; // 订单-搜索
                for(var i in this.orderInfoList){
                    this.orderInfoList[i].label = this.orderInfoList[i].orderName;
                    this.orderInfoList[i].value = this.orderInfoList[i].id;
                }
                this.loading = false;
            });
        },
        /**查询批次列表 */
        // 搜索条件
        getorderBatchIdDateList(batchName,orderInfoId) {
            this.loading = true;
            let date = {
                batchName: batchName,
                orderInfoId: orderInfoId,
                orderType: 20,
            }
            inspOrderBatchQueryList(date).then(response => {
                this.orderBatchList = response.data;  // 订单-搜索
                for(var i in this.orderBatchList){
                    this.orderBatchList[i].label = this.orderBatchList[i].batchName;
                    this.orderBatchList[i].value = this.orderBatchList[i].id;
                }
                this.loading = false;
            });
        },
        // 订单事件
        ddChange(){
            if(this.orderId){
                this.batchId = null;
                // this.queryParams.batchInfo.orderId = null;
                this.getorderBatchIdDateList('',this.orderId)
            }else{
                this.batchId = null;
                // this.queryParams.batchInfo.batchId = null;
                this.orderBatchList = [];
                this.orderInfoList = [];
            }
        },
        // 批次事件
        pcChange(){
            // if(!this.batchId){
            //     this.queryParams.batchInfo.batchId = null;
            // }
        },

        /**搜索条件 */
        // 网站标识码
        querySearchAsync2(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.siteCodeMedia === '' || this.queryParams.siteCodeMedia == null) {
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
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.queryParams.siteCodeMedia = val.siteCode;
        },
        // 站点信息
         querySearchAsync(queryString, callBack) {
            console.log(queryString,'queryString')
            this.restaurants = [];
            if(this.queryParams.treeInfo.psCode === '' || this.queryParams.treeInfo.psCode == null) {
                return
            } else {
            // 请求查询接口，将列表展现出来
                // this.searchData();  
                let date = {
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
            this.queryParams.treeInfo.psCode = val.siteCode;
        },

         // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.open6 = true;
            this.fileType = type;
            if(type == 1){
                this.title6 = '审核导入';
            }else{
                this.title6 = '整改导入';
            }
            // batchImport().then((res)=>{})
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
                if(this.fileType == 1){ // 审核导入
                    this.subFileList.forEach(f => {
                        console.log(f,'f')
                        formData.append("file", f.raw);
                        formData.append("taskType", 100);
                    });
                }else if(this.fileType == 2){ // 整改导入
                    this.subFileList.forEach(f => {
                        console.log(f,'f')
                        formData.append("file", f.raw);
                        formData.append("taskType", 101);
                    });
                }
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
            if(this.fileType == 1){ // 审核
                let fileName = '新媒体错敏审核模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=100",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
                              
            }else if(this.fileType == 2){ // 整改
                let fileName = '新媒体错敏整改模板';
                this.download2(
                    "common/download/downloadExcelTpl?type=101",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
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
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
    .zhxx{
        display: flex;
        align-items: center;
    }
    .icoSp{
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        overflow: hidden;
        background: #ffffff;
        margin-right: 5px;
    }
    .ico{
        width: 100%;
        border-radius: 100%;
    }

    .bigWrapBox{
        width: 100%;
        height: 100%;
        background: #ffffff;
        position: fixed;
        z-index: 2000;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 15px 20px;
        .tabBox{
            flex: 1;
            overflow: auto;
        }
    }
    
</style>
<style scoped>
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 12vh !important;
    }
    /deep/ .pagination-container{
        margin-bottom: 20px!important;
    }
</style>