<template>
    <div class="app-container">
        <!-- 表格全屏 -->
        <div class="bigWrapBox" v-if="upHeightType">
            <!-- 待审核 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >信任导入</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 可疑外链 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '2'">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-bell" size="mini" :disabled="multiple" @click="warnChange(2)">批量预警</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)">信任导入</el-button>
                </el-col> -->
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 信任外链 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '3'">
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)">信任导入</el-button>
                </el-col> -->
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
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" ></el-table-column>
                    <el-table-column prop="url" label="外链链接" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <!-- <el-tooltip  class="item" effect="dark" content="点此复制外链链接+新媒体标识码" placement="top-start"> -->
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="domain" label="外链域名" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="errorTypesText" label="外链类型" width="120" align=""></el-table-column>
                    <el-table-column prop="showStateTxt" label="审核状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="trustFlagTxt" label="信任状态" width="100" align="center" v-if="activeName != '1'">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.color}"></span>{{ scope.row.trustFlagTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditTypeTxt" label="来源" width="100" align="center"></el-table-column>
                    <el-table-column prop="descriptionTxt" label="依据" width="280" align="" v-if="activeName != '1'"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220" align="" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <el-table-column prop="fromTitleTxt" label="父页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>      
                    <el-table-column prop="auditTime" label="审核时间" width="180" v-if="activeName != '1'" sortable="custom"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                    
                    <!-- 待审核 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right" v-if="activeName == '1'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2)" >编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,2,scope.$index)" >删除</el-button> -->
                        </template>
                    </el-table-column>
                    <!-- 可疑外链 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280" fixed="right" v-if="activeName == '2'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-bell"  @click="warnChange(1,scope.row)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2,scope.$index)" >编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,2,scope.$index)" >删除</el-button> -->
                        </template>
                    </el-table-column>
                    <!-- 信任外链 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right" v-if="activeName == '3'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2,scope.$index)" >编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,2,scope.$index)" >删除</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

                <!-- <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                /> -->
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[10,50,100, 200, 500]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </div>
        </div>
        <!-- 正常展示 -->
        <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!upHeightType">
            <!-- 待审核 -->
            <el-tab-pane label="待审核" name="1">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                >
                    <el-form-item label="站点信息" prop="">
                        <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入组织填报单位名称或标识码"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
                        ></el-autocomplete>
                    </el-form-item>                
                    <el-form-item label="新媒体标识码" prop="siteCodeMediaLike">
                        <!-- <el-input
                            v-model="queryParams.siteCodeMediaLike"
                            placeholder="请输入新媒体标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.siteCodeMedia = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="资源类别" prop="contentType">
                        <el-select v-model="queryParams.contentType" clearable placeholder="请选择资源类别" style="width:300px">
                            <el-option
                                v-for="item in zylbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
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
                    <el-form-item label="是否信任" prop="trustFlag">
                        <el-select v-model="queryParams.trustFlag" clearable placeholder="请选择是否信任" style="width:300px">
                            <el-option
                                v-for="item in sfxrList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="发现时间" prop="searchDateKey">
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="" prop="searchDateKey">
                        <el-select v-model="queryParams.searchDateKey" clearable placeholder="请选择" style="width:100px;margin:0 10px 0 0" @change="sjChange" >
                            <el-option
                            v-for="item in shsjListO"
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
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="外链域名" prop="domain">
                        <el-input v-model="queryParams.domain" placeholder="请输入外链域名" clearable style="width:300px;" @clear="queryParams.domain=null"/>
                    </el-form-item>
                    <el-form-item label="外链链接" prop="urlHash">
                        <el-input v-model="queryParams.urlHash" placeholder="请输入外链链接加新媒体标识码" clearable style="width:710px;" />
                    </el-form-item>
                    <el-form-item label="来源" prop="source">
                        <el-select v-model="queryParams.source" clearable placeholder="请选择来源" style="width:300px">
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="外链类型" prop="errorTypesIn">
                        <el-select v-model="queryParams.errorTypesIn" clearable placeholder="请选择外链类型" style="width:300px" multiple collapse-tags>
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item style="marginLeft:18px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" style="display:flex;">
                    <div class="divdiv">
                        <p>
                            <!-- <el-col :span="1.5">
                                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll"  >批量整改</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >信任导入</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button>
                            </el-col> -->
                            <el-col :span="1.5">
                                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                            </el-col>
                        </p>
                    </div>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    v-if="activeName == '1'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" ></el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="url" label="外链链接" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <!-- <el-tooltip  class="item" effect="dark" content="点此复制外链链接+新媒体标识码" placement="top-start"> -->
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="domain" label="外链域名" width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <span class="dz">{{ scope.row.domain}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="errorTypesText" label="外链类型" width="120" align=""></el-table-column>
                    <el-table-column prop="showStateTxt" label="审核状态" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="trustFlagTxt" label="信任状态" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.color}"></span>{{ scope.row.trustFlagTxt}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="auditTypeTxt" label="来源" width="100" align="center"></el-table-column>
                    <el-table-column prop="descriptionTxt" label="依据" width="280" align=""></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220" align="" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <el-table-column prop="fromTitleTxt" label="父页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right">
                        <template slot-scope="scope">
                            <!-- <el-tooltip class="item" effect="dark" content="信任链接" placement="top">
                                <i class="el-icon-paperclip" style="cursor: pointer;font-size:15px" @click="handleUpdate3(scope.row,1)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="信任域名" placement="top">
                                <i class="el-icon-link" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate3(scope.row,2)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="整改" placement="top">
                                <i class="el-icon-edit" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip> -->
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2)" >编辑</el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[10,50,100, 200, 500]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
            <!-- 可疑外链 -->
            <el-tab-pane label="可疑外链" name="2">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                >
                    <el-form-item label="站点信息" prop="">
                        <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入组织填报单位名称或标识码"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
                        ></el-autocomplete>
                    </el-form-item>                
                    <el-form-item label="新媒体标识码" prop="siteCodeMediaLike">
                        <!-- <el-input
                            v-model="queryParams.siteCodeMediaLike"
                            placeholder="请输入新媒体标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.siteCodeMedia = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="资源类别" prop="contentType">
                        <el-select v-model="queryParams.contentType" clearable placeholder="请选择资源类别" style="width:300px">
                            <el-option
                                v-for="item in zylbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
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
                    <!-- <el-form-item label="是否信任" prop="trustFlag">
                        <el-select v-model="queryParams.trustFlag" clearable placeholder="请选择是否信任" style="width:300px">
                            <el-option
                                v-for="item in sfxrList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="发现时间" prop="searchDateKey">
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
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
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="外链域名" prop="domain">
                        <el-input v-model="queryParams.domain" placeholder="请输入外链域名" clearable style="width:300px;" @clear="queryParams.domain=null"/>
                    </el-form-item>
                    <el-form-item label="外链链接" prop="urlHash">
                        <el-input v-model="queryParams.urlHash" placeholder="请输入外链链接加新媒体标识码" clearable style="width:710px;" />
                    </el-form-item>
                    <el-form-item label="审核状态" prop="showState">
                        <el-select v-model="queryParams.showState" clearable placeholder="请选择审核状态" style="width:300px">
                            <el-option
                                v-for="item in showStateList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源" prop="source">
                        <el-select v-model="queryParams.source" clearable placeholder="请选择来源" style="width:300px">
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="依据" prop="exemptionId">
                        <el-input v-model="queryParams.exemptionId" placeholder="请输入依据ID" clearable style="width:300px" @keyup.enter.native="handleQuery"  @clear="queryParams.exemptionId=null" />
                    </el-form-item>
                    <el-form-item label="外链类型" prop="errorTypesIn">
                        <el-select v-model="queryParams.errorTypesIn" clearable placeholder="请选择外链类型" style="width:300px" multiple collapse-tags>
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item style="marginLeft:18px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" style="display:flex;">
                    <div class="divdiv">
                        <p>
                            <el-col :span="1.5">
                                <el-button type="danger" plain icon="el-icon-bell" size="mini" :disabled="multiple" @click="warnChange(2)">批量预警</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                            </el-col>
                        </p>
                    </div>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    v-if="activeName == '2'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" ></el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="url" label="外链链接" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <!-- <el-tooltip  class="item" effect="dark" content="点此复制外链链接+新媒体标识码" placement="top-start"> -->
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="domain" label="外链域名" width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <span class="dz">{{ scope.row.domain}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="errorTypesText" label="外链类型" width="120" align=""></el-table-column>
                    <el-table-column prop="showStateTxt" label="审核状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="trustFlagTxt" label="信任状态" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.color}"></span>{{ scope.row.trustFlagTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditTypeTxt" label="来源" width="100" align="center"></el-table-column>
                    <el-table-column prop="descriptionTxt" label="依据" width="280" align=""></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220" align="" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <el-table-column prop="fromTitleTxt" label="父页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>     
                    <el-table-column prop="auditTime" label="审核时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-bell"  @click="warnChange(1,scope.row)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2,scope.$index)" >编辑</el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[10,50,100, 200, 500]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
            <!-- 信任外链 -->
            <el-tab-pane label="信任外链" name="3">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                >
                    <el-form-item label="站点信息" prop="">
                        <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入组织填报单位名称或标识码"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
                        ></el-autocomplete>
                    </el-form-item>                
                    <el-form-item label="新媒体标识码" prop="siteCodeMediaLike">
                        <!-- <el-input
                            v-model="queryParams.siteCodeMediaLike"
                            placeholder="请输入新媒体标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCodeMedia"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.siteCodeMedia = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="资源类别" prop="contentType">
                        <el-select v-model="queryParams.contentType" clearable placeholder="请选择资源类别" style="width:300px">
                            <el-option
                                v-for="item in zylbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
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
                    <!-- <el-form-item label="是否信任" prop="trustFlag">
                        <el-select v-model="queryParams.trustFlag" clearable placeholder="请选择是否信任" style="width:300px">
                            <el-option
                                v-for="item in sfxrList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="发现时间" prop="searchDateKey">
                        <el-date-picker
                            v-model="DateArr"
                            format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="sjrqChange"
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
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
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:300px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="外链域名" prop="domain">
                        <el-input v-model="queryParams.domain" placeholder="请输入外链域名" clearable style="width:300px;" @clear="queryParams.domain=null"/>
                    </el-form-item>
                    <el-form-item label="外链链接" prop="urlHash">
                        <el-input v-model="queryParams.urlHash" placeholder="请输入外链链接加新媒体标识码" clearable style="width:710px;" />
                    </el-form-item>
                    <!-- <el-form-item label="审核状态" prop="showState">
                        <el-select v-model="queryParams.showState" clearable placeholder="请选择审核状态" style="width:300px">
                            <el-option
                                v-for="item in showStateList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="来源" prop="source">
                        <el-select v-model="queryParams.source" clearable placeholder="请选择来源" style="width:300px">
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="依据" prop="exemptionId">
                        <el-input v-model="queryParams.exemptionId" placeholder="请输入依据ID" clearable style="width:300px" @keyup.enter.native="handleQuery"  @clear="queryParams.exemptionId=null" />
                    </el-form-item>
                    <el-form-item label="外链类型" prop="errorTypesIn">
                        <el-select v-model="queryParams.errorTypesIn" clearable placeholder="请选择外链类型" style="width:300px" multiple collapse-tags>
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item style="marginLeft:18px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" style="display:flex;">
                    <div class="divdiv">
                        <p>
                            <el-col :span="1.5">
                                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                            </el-col>
                            <el-col :span="1.5">
                                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(3)">审核导入</el-button>
                            </el-col>
                        </p>
                    </div>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    v-if="activeName == '3'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <!-- <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="sentence" label="账号信息" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="zhxx">
                                <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                <span>{{scope.row.accountName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCodeMedia" label="新媒体标识码" width="160" ></el-table-column>
                    <!-- <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="url" label="外链链接" width="300" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <!-- <el-tooltip  class="item" effect="dark" content="点此复制外链链接+新媒体标识码" placement="top-start"> -->
                            <el-tooltip  class="item" effect="dark" content="点此复制外链链接" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="domain" label="外链域名" width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <span class="dz">{{ scope.row.domain}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="errorTypesText" label="外链类型" width="120" align=""></el-table-column>
                    <el-table-column prop="showStateTxt" label="审核状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="trustFlagTxt" label="信任状态" width="100" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.color}"></span>{{ scope.row.trustFlagTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditTypeTxt" label="来源" width="100" align="center"></el-table-column>
                    <el-table-column prop="descriptionTxt" label="依据" width="280" align=""></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220" align="" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                    <!-- <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column> -->
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    <el-table-column prop="fromTitleTxt" label="父页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>        
                    <el-table-column prop="auditTime" label="审核时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-paperclip" @click="handleUpdate3(scope.row,1)" >信任链接</el-button>
                            <el-button size="mini" type="text" icon="el-icon-link" @click="handleUpdate3(scope.row,2)" >信任域名</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,2)" >编辑</el-button>
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total>0"
                    :total="total"
                    :page-sizes="[10,50,100, 200, 500]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
            </el-tab-pane>
        </el-tabs>


        <!-- 添加或修改站点关系对话框 -->
        <el-dialog title="整改状态" :visible.sync="open2" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form2" :model="form2" :rules="rules2" label-width="120px">
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-radio-group v-model="form2.reviewResult">
                            <el-radio :label="1">待整改</el-radio>
                            <el-radio :label="2">已整改</el-radio>
                            <el-radio :label="3">无需整改</el-radio>
                        </el-radio-group>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 信任链接、域名 -->
        <el-dialog :title="title3" :visible.sync="open3" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form3" :model="form3" :rules="rules3" label-width="120px">
                <el-form-item label="是否信任" prop="trustFlag">
                    <el-radio-group v-model="form3.trustFlag">
                        <el-radio :label="1">信任</el-radio>
                        <el-radio :label="2">不信任</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="cancel3">取 消</el-button>
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
        

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="open10" width="900px" append-to-body @close="cancel10">
            <el-form ref="form10" :model="form10" :rules="rules10" label-width="110px">
                <div class="div" style="display: flex;flex-wrap: wrap;">
                    <el-form-item label="网站标识码" prop="" style="width:50%">
                        {{form10.siteCode}}
                    </el-form-item>
                    <el-form-item label="网站名称" prop="" style="width:50%">
                        {{form10.siteName}}
                    </el-form-item>
                    <el-form-item label="首次发现时间" prop="" style="width:50%">
                        {{form10.createTime}}
                    </el-form-item>
                    <el-form-item label="监测时间" prop="" style="width:50%">
                        {{form10.scanTime}}
                    </el-form-item>
                    <el-form-item label="外链链接" prop="" style="width:50%">
                        {{form10.url}}
                    </el-form-item>
                    <el-form-item label="外链域名" prop="" style="width:50%">
                        {{form10.domain}}
                    </el-form-item>
                    <el-form-item label="整改状态" prop="" style="width:50%">
                        <el-radio-group v-model="form10.reviewResult">
                            <el-radio :label="1">待整改</el-radio>
                            <el-radio :label="2">已整改</el-radio>
                            <el-radio :label="3">无需整改</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="信任状态" prop="trustFlag" style="width:50%">
                        <el-radio-group v-model="form10.trustFlag" @change="trustFlagChange">
                            <el-radio :label="1">信任</el-radio>
                            <el-radio :label="2">可疑</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="外链类型" prop="" style="width:50%">
                        <el-select v-model="form10.errorTypes" clearable placeholder="请选择外链类型" style="width:80%" >
                            <el-option
                                v-for="item in errorTypesList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作类型" prop="" style="width:50%">
                        <el-radio-group v-model="form10.showState">
                            <!-- <el-radio :label="1">待审核</el-radio> -->
                            <el-radio :label="2">仅显示</el-radio>
                            <el-radio :label="3" v-if="form10.trustFlag == 2">显示并预警</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 批量 -->
                    <div style="width:100%">
                        <div class="hx"></div>
                        <div style="width:100%;display:flex;align-items:center;paddingLeft:3%;marginTop:5px;cursor: pointer;">
                            <!-- >> -->
                            <i class="el-icon-d-arrow-right" style="color: #1890FD;fontWeight:500" @click="batchEditVoChange"></i>
                            <el-button type="text" style="fontWeight:500" @click="batchEditVoChange">批量操作</el-button>
                            <el-tooltip class="item" effect="dark" content="批量操作应用在该站点历史待整改数据" placement="right">
                                <!-- <el-button>上边</el-button> -->
                                <i class="el-icon-question" style="position: relative;top: -2px;"></i>
                            </el-tooltip>
                        </div>
                        <div class="div" style="display: flex;flex-wrap: wrap;" v-if="batchEditVoType">
                            <el-form-item label="应用对象" prop="batchEditVo.urlType" style="width:50%">
                                <el-radio-group v-model="form10.batchEditVo.urlType">
                                    <el-radio :label="2">链接</el-radio>
                                    <el-radio :label="1">域名</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="应用范围" prop="" style="width:50%">
                                <el-radio-group v-model="form10.batchEditVo.scope">
                                    <el-radio :label="1">当前填报单位</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="外链类型" prop="" style="width:50%">
                                <el-select v-model="form10.batchEditVo.errorTypes" clearable placeholder="请选择外链类型" style="width:80%" :disabled="true" >
                                    <el-option
                                        v-for="item in errorTypesList"
                                        :key="item.val"
                                        :label="item.label"
                                        :value="item.val"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="信任状态" prop="" style="width:50%">
                                <el-radio-group v-model="form10.batchEditVo.trustFlag" :disabled="true">
                                    <el-radio :label="1">信任</el-radio>
                                    <el-radio :label="2">可疑</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="任务名称" prop="batchEditVo.elTaskName" style="width:50%">
                                <el-input v-model="form10.batchEditVo.elTaskName" placeholder="请输入任务名称" style="width:80%" clearable />
                            </el-form-item>
                            <el-form-item label="操作类型" prop="" style="width:50%">
                                <el-radio-group v-model="form10.batchEditVo.showState" :disabled="true">
                                    <!-- <el-radio :label="1">待审核</el-radio>
                                    <el-radio :label="3">显示并预警</el-radio>
                                    <el-radio :label="2">仅显示</el-radio> -->
                                    <el-radio :label="2">仅显示</el-radio>
                                    <el-radio :label="3" v-if="form10.batchEditVo.trustFlag == 2">显示并预警</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="应用数据范围" prop="batchEditVo.applicationScope" style="width:90%">
                                <el-radio-group v-model="form10.batchEditVo.applicationScope">
                                    <el-radio :label="1">待审核待整改</el-radio>
                                    <el-radio :label="2">已审核待整改</el-radio>
                                    <el-radio :label="3">全部待整改</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <!-- <el-form-item label="应用数据范围" prop="" style="width:50%">
                                <el-select v-model="form10.batchEditVo.applicationScope" placeholder="请选择应用数据范围" style="width:80%">
                                    <el-option
                                        v-for="item in applicationScopeList"
                                        :key="item.val"
                                        :label="item.label"
                                        :value="item.val"
                                    ></el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label="" prop="" style="width:50%;marginTop:-10px" v-if="form10.showState == 3">
                                <el-checkbox v-model="form10.againWarn">对已审核数据再次预警</el-checkbox>
                            </el-form-item>
                            <!-- againWarn -->
                        </div>
                        
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm10">{{subBtnText}}</el-button>
                <el-button @click="cancel10">取 消</el-button>
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
    deleteByDomain,
    editReviewResultBatch,
    editExternalLinksTrust,
    editWarnBatch
} from "@/api/media/externalLinks";
import {
    inspImportdataTask,
    downloadExcelTpl
} from "@/api/biz/wrongWords";
import { listInspSiteTree,SearchMediaInfo } from "@/api/biz/inspSiteTree";
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
                siteCodeMediaLike: null, // 新媒体标识码
                linkLocation: null, // 链接位置
                contentType: null, // 资源类别
                searchDateKey: 'ct',
                startDate: null, // 开始时间
                endDate: null, // 结束时间
                orderTypes: [], // 表格排序
                reviewResult: null, // 整改状态
                trustFlag: null,
                mediaType: null, // 新媒体类型
                accountNameLike: null, // 账号信息
                idStr: null,
                domain: null,
                urlHash: null,
                source: null,
                exemptionId: null,
                showState: 1,
                errorTypesIn: [],

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
                { label: '视频', val: 6 },
                { label: '音频', val: 7 },
                { label: '未知地址', val: 8 },
            ],
            // 整改状态
            zgztList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '无需整改', val: 3 },
            ],
            // 时间类型
            DateArr: [],
            shsjListO: [ 
                { label: '发现时间', val: 'ct' },
                { label: '监测时间', val: 'sct' },
            ],
            shsjList: [ 
                { label: '发现时间', val: 'ct' },
                { label: '监测时间', val: 'sct' },
                { label: '审核时间', val: 'ate' },
            ],
            // 操作类型
            czList: [ 
                { label: '显示', val: 2 },
                // { label: '显示并预警', val: 3 },
                { label: '误报', val:  4 },
            ],
            // 是否信任
            sfxrList: [
                { label: '信任', val: 1 },
                { label: '可疑', val: 2 },
                // { label: '未处理', val: 0 },
            ],
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

            domain: null, // 域名删除

            zgType: null,

            // 信任
            open3: false, 
            form3: {
                idStr: null,
                trustFlag: null
            },
            rules3: {
                trustFlag: [{ required: true, message: '请选择信任状态', trigger: 'change' }],
            },
            xrType: null,
            title3: null,

            // 导出
            open4: false, 
            form4: {
                menuType: 230
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

            // 编辑
            open10: false,
            form10: {
                batchEditVo: {
                    urlType: null, //    应用对象 1域名  2链接
                    scope: 1, //    应用范围   1当前填报单位
                    elTaskName: null, //     任务名称
                    trustFlag: null, //    信任状态  1信任，2可疑
                    errorTypes: null, //   外链类型
                    showState: null, //   显示状态 显示状态 1待审核，2显示 3显示并预警
                    applicationScope: null, // 应用数据范围 1待审核待整改 2已审核待整改 3全部待整改
                },
            },
            rules10: {
                'batchEditVo.urlType': [{ required: true, message: '请选择应用对象', trigger: 'change' }],
                'batchEditVo.elTaskName': [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
                'batchEditVo.applicationScope': [{ required: true, message: '请选择应用数据范围', trigger: 'change' }],
            },
            batchEditVoType: false, // 是否批量操作
            subBtnText: '确认单条操作',
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
            // 来源
            auditTypeList: [
                { label: '未审核', val: 0 },
                { label: '人工审核', val: 1 },
                { label: 'AI审核', val: 2 },
            ],
            // 审核状态
            showStateList: [
                // { label: '待审核', val: 1 },
                // { label: '异常外链', val: 2 },
                // { label: '正常外链', val: 4 },
                { label: '显示', val: 2 },
                { label: '显示并预警', val: 3 },
                // { label: '误报', val: 4 },
            ],

            exportSiteName: null,  // 导出-站点信息
            exportSiteName_: null,  // 导出-网站名称（主办单位）
            
        };
    },
    watch:{
        'form10.showState'(val){
            if(this.batchEditVoType == true){
                this.form10.batchEditVo.showState = val;
            }
        },
        'form10.trustFlag'(val){
            if(this.batchEditVoType == true){
                this.form10.batchEditVo.trustFlag = val;
            }
        },
        'form10.errorTypes'(val){
            if(this.batchEditVoType == true){
                this.form10.batchEditVo.errorTypes = val;
            }
        }
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('ExternalLinksMediaObj')
        next();

    },
    created() {
        // this.getList();
        if(sessionStorage.getItem('ExternalLinksMediaObj')){
            let obj = JSON.parse(sessionStorage.getItem('ExternalLinksMediaObj'));
            console.log(obj,'obj')
            this.activeName = '3'; // 已审核
            this.queryParams.showState = null;
            this.queryParams.showStateIn = [2];
            this.queryParams.orderTypes = [{ code: 1, name: 'sct' }]; // 表格排序
            if(obj.siteCode.length == 6){
                this.queryParams.treeInfo.psCode = obj.siteCode;
            }else{
                this.queryParams.siteCode = obj.siteCode;                
            }
            this.queryParams.exemptionId = obj.idStr;
            // this.$set(this.queryParams,'siteCode',obj.siteCode);
            // this.$set(this.queryParams,'exemptionId',sessionStorage.getItem('ExternalLinksMediaObj'));
            this.getList();
        }else{
            // this.queryParams.showState = 1;
            // this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]; // 表格排序
            // this.getList();
        }
        this.getTreeselect();
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
                    // 父页面信息
                    if(!this.inspSiteInfoList[i].fromTitle){
                        this.inspSiteInfoList[i].fromTitleTxt = this.inspSiteInfoList[i].fromUrl;
                    }else{
                        this.inspSiteInfoList[i].fromTitleTxt = this.inspSiteInfoList[i].fromTitle;
                    }
                    // 链接类型
                    if(this.inspSiteInfoList[i].errorTypes == 1){
                        this.inspSiteInfoList[i].errorTypesTxt = '站外';
                    }else if(this.inspSiteInfoList[i].errorTypes == 2){
                        this.inspSiteInfoList[i].errorTypesTxt = '站内';
                    }
                    // 问题类型
                    if(this.inspSiteInfoList[i].httpState == 1){
                        this.inspSiteInfoList[i].httpStateTxt = '确认';
                    }else if(this.inspSiteInfoList[i].httpState == 2){
                        this.inspSiteInfoList[i].httpStateTxt = '疑似';
                    }
                    // 资源类别
                    if(this.inspSiteInfoList[i].contentType == 1){ // 严重
                        this.inspSiteInfoList[i].contentTypeTxt = '图片';
                    }else if(this.inspSiteInfoList[i].contentType == 2){ // 一般
                        this.inspSiteInfoList[i].contentTypeTxt = '页面';
                    }else if(this.inspSiteInfoList[i].contentType == 3){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = '附件';
                    }else if(this.inspSiteInfoList[i].contentType == 4){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = 'JS';
                    }else if(this.inspSiteInfoList[i].contentType == 5){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = 'CSS';
                    }else if(this.inspSiteInfoList[i].contentType == 6){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = '视频';
                    }else if(this.inspSiteInfoList[i].contentType == 7){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = '音频';
                    }else if(this.inspSiteInfoList[i].contentType == 8){ // 轻微
                        this.inspSiteInfoList[i].contentTypeTxt = '未知地址';
                    }
                    // 整改状态
                    if(this.inspSiteInfoList[i].reviewResult == 1){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '待整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 2){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '已整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 3){ 
                        this.inspSiteInfoList[i].reviewResultTxt = '无需整改';
                    }

                    if(!this.inspSiteInfoList[i].domain){
                        this.inspSiteInfoList[i].domain = '--';
                    }
                    // 整改时间
                    if(!this.inspSiteInfoList[i].rectifyTime){
                        this.inspSiteInfoList[i].rectifyTime = '--';
                    }
                    // 审核时间
                    if(!this.inspSiteInfoList[i].auditTime){
                        this.inspSiteInfoList[i].auditTime = '--';
                    }

                    // 信任状态
                    if(this.inspSiteInfoList[i].trustFlag == 1){
                        this.inspSiteInfoList[i].trustFlagTxt = '信任';
                        this.inspSiteInfoList[i].color = '#48b93f';
                    }else if(this.inspSiteInfoList[i].trustFlag == 2){
                        this.inspSiteInfoList[i].trustFlagTxt = '可疑';
                        this.inspSiteInfoList[i].color = '#ff6563';
                    }else{
                        this.inspSiteInfoList[i].trustFlagTxt = '未处理';
                        this.inspSiteInfoList[i].color = '#999999';
                    }

                    if(response.rows[i].mediaType == 1){
                        response.rows[i].ico = new URL('../../../assets/images/wx.jpeg', import.meta.url).href
                    }else if(response.rows[i].mediaType == 2){
                        response.rows[i].ico = new URL('../../../assets/images/wb.jpeg', import.meta.url).href
                    }else if(response.rows[i].mediaType == 3){
                        response.rows[i].ico = new URL('../../../assets/images/dy.jpeg', import.meta.url).href
                    }else if(response.rows[i].mediaType == 4){
                        response.rows[i].ico = new URL('../../../assets/images/tt.jpeg', import.meta.url).href
                    }else if(response.rows[i].mediaType == 5){
                        response.rows[i].ico = new URL('../../../assets/images/ks.jpeg', import.meta.url).href
                    }else if(response.rows[i].mediaType == 111){
                        response.rows[i].ico = new URL('../../../assets/images/yd.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 112){
                        response.rows[i].ico = new URL('../../../assets/images/rm.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 113){
                        response.rows[i].ico = new URL('../../../assets/images/bj.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 117){
                        response.rows[i].ico = new URL('../../../assets/images/tx.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 118){
                        response.rows[i].ico = new URL('../../../assets/images/qe.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 119){
                        response.rows[i].ico = new URL('../../../assets/images/nf.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 120){
                        response.rows[i].ico = new URL('../../../assets/images/ydh.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 121){
                        response.rows[i].ico = new URL('../../../assets/images/wy.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 122){
                        response.rows[i].ico = new URL('../../../assets/images/xcx.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 123){
                        response.rows[i].ico = new URL('../../../assets/images/dy.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 124){
                        response.rows[i].ico = new URL('../../../assets/images/sh.png', import.meta.url).href
                    }else if(response.rows[i].mediaType == 125){
                        response.rows[i].ico = new URL('../../../assets/images/pp.png', import.meta.url).href
                    }else {
                        response.rows[i].ico = new URL('../../../assets/images/qt.png', import.meta.url).href
                    }

                    if(response.rows[i].showState == 1){
                        response.rows[i].showStateTxt = '待审核'
                    }else if(response.rows[i].showState == 2){
                        response.rows[i].showStateTxt = '显示'
                    }else if(response.rows[i].showState == 3){
                        response.rows[i].showStateTxt = '显示并预警'
                    }else if(response.rows[i].showState == 4){
                        response.rows[i].showStateTxt = '误报'
                    }else{
                        response.rows[i].showStateTxt = '--'
                    }

                    // 来源
                    if(response.rows[i].auditType == 0){
                        response.rows[i].auditTypeTxt = '未审核';
                    }else if(response.rows[i].auditType == 1){
                        response.rows[i].auditTypeTxt = '人工审核';
                    }else if(response.rows[i].auditType == 2){
                        response.rows[i].auditTypeTxt = 'AI审核';
                    }else{
                        response.rows[i].auditTypeTxt = '--';
                    }
                    // 依据
                    if(response.rows[i].according){
                        response.rows[i].descriptionTxt = response.rows[i].according.description;
                    }else{
                        response.rows[i].descriptionTxt = '--';
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
            if(this.activeName == '1'){ // 待审核
                if(this.queryParams.domain != null || this.queryParams.treeInfo.psCode != null || this.queryParams.siteCodeMedia != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.$modal.msgWarning("站点信息/新媒体标识码/数据ID/外链域名/请至少输入其中一项");
                }
            }else if(this.activeName == '2' || this.activeName == '3'){ // 可疑外链、信任外链
                if(this.queryParams.domain != null || this.queryParams.exemptionId != null || this.queryParams.treeInfo.psCode != null || this.queryParams.siteCodeMedia != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.$modal.msgWarning("站点信息/新媒体标识码/数据ID/外链域名/依据请至少输入其中一项");
                }
            }
            // this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            if(this.activeName == '1'){
                this.queryParams.searchDateKey = 'ct';
                this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]; // 表格排序
                this.queryParams.showState = 1;
                this.queryParams.showStateIn = [];
            }else if(this.activeName == '2'){
                this.queryParams.searchDateKey = 'ate';
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.showState = null;
                this.queryParams.trustFlag = 2;
                this.queryParams.showStateIn = [2,3];
            }else if(this.activeName == '3'){
                this.queryParams.searchDateKey = 'ate';
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.showState = null;
                this.queryParams.trustFlag = 1;
                this.queryParams.showStateIn = [2];
            }

            this.$set(this.queryParams,'siteCode',null);
            this.$set(this.queryParams,'exemptionId',null);

            this.total = 0;
            this.inspSiteInfoList = [];
            sessionStorage.removeItem('ExternalLinksMediaObj')

            this.exportSiteName = null;  // 导出-站点信息
            this.exportSiteName_ = null;  // 导出-网站名称（主办单位）

            console.log(this.queryParams,'this.queryParams')

            // this.handleQuery();
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
        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
        },
        /** 修改按钮操作 */
        handleUpdate2(row,index) {
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            const id = row.idStr || this.ids;
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
                                this.getList();
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
                                this.getList();
                            })
                        }
                    // }
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
                menuType: 230,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 230,
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
                    subData.menuType = 230;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '';
                        if(this.exportSiteName != null && this.exportSiteName_ != null){
                            fileName = this.exportSiteName_ + '-外链信息数据-'+this.formatDate(new Date());
                        }else{
                            if(this.exportSiteName != null){
                                fileName = this.exportSiteName + '-外链信息数据-'+this.formatDate(new Date());
                            }else if(this.exportSiteName_ != null){
                                fileName = this.exportSiteName_ + '-外链信息数据-'+this.formatDate(new Date());
                            }else{
                                fileName = '外链信息数据-'+this.formatDate(new Date());
                            }
                        }
                        console.log(fileName,'fileName')
                        this.download(
                            "biz/mediaExternalLinks/export",this.queryParams,
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
            this.linkChange(url)
        },
        // 复制栏目地址加网站标识码
        copyChange(val){
            console.log(val,'val')
            if(val.url){
                // this.queryParams.urlHash = val.url+val.siteCodeMedia;
                this.queryParams.urlHash = val.url;
                navigator.clipboard.writeText(this.queryParams.urlHash);
            }
        },
        // 表格排序
        sortChange({ column, prop, order }) {
            console.log(column, prop, order);
            let newName = null;
            if(prop == 'createTime'){
                newName = 'ct'
            }else if(prop == 'scanTime'){
                newName = 'sct'
            }else if(prop == 'auditTime'){
                newName = 'ate'
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
            // console.log(column, prop, order);
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
        },

        // 域名删除
        domainDelete(){
            if(this.domain){
                let data = {
                    domain: this.domain
                }
                deleteByDomain(data).then(()=>{

                })
            }
            
        },
        // 信任链接、域名
        // 取消按钮
        cancel3() {
            this.open3 = false;
            this.form3 = {
                idStr: null,
                trustFlag: null,
            }
            this.resetForm("form2");
        },
        /** 修改按钮操作 */
        handleUpdate3(row,index) {
            this.form3 = {
                idStr: null,
                trustFlag: 1,
                domain: null,
                siteCodeMedia: null,
                url: null
            }
            this.xrType = index;
            // if(index == 1){
            //     this.title3 = '信任链接';
            // }else if(index ==2){
            //     this.title3 = '信任域名';
            // }
            // this.resetForm("form3");
            const id = row.idStr || this.ids;
            getInspSiteInfo({id:id}).then(response => {
                this.form3.idStr = response.data.idStr;
                this.form3.domain = response.data.domain;
                // this.form3.trustFlag = response.data.trustFlag;
                this.form3.siteCodeMedia = response.data.siteCodeMedia;
                this.form3.url = response.data.url;
                console.log(this.form3,'this.form-header')
                if(index == 1){ // 链接
                    let data = {
                        idStr: this.form3.idStr,
                        url: this.form3.url,
                        trustFlag: this.form3.trustFlag,
                        siteCodeMedia: this.form3.siteCodeMedia
                    }
                    console.log(data,'数据-信任链接')
                    editExternalLinksTrust(data).then((res)=>{
                        this.$modal.msgSuccess("信任链接成功");
                        this.open3 = false;
                    })
                }else if(index == 2){ // 域名
                    let data = {
                        idStr: this.form3.idStr,
                        domain: this.form3.domain,
                        trustFlag: this.form3.trustFlag,
                        siteCodeMedia: this.form3.siteCodeMedia
                    }
                    console.log(data,'数据-信任域名')
                    editExternalLinksTrust(data).then((res)=>{
                        this.$modal.msgSuccess("信任域名成功");
                        this.open3 = false;
                    })
                }
                // this.open3 = true;
            });
        },
        /** 提交按钮 */
        submitForm3() {
            this.$refs["form3"].validate(valid => {
                if (valid) {
                    console.log(this.form3)
                    if(this.xrType == 1){ // 链接
                        let data = {
                            idStr: this.form3.idStr,
                            trustFlag: this.form3.trustFlag,
                        }
                        console.log(data,'数据-信任链接')
                        editExternalLinksTrust(data).then((res)=>{
                            this.$modal.msgSuccess("信任成功");
                            this.open3 = false;
                        })
                    }else if(this.xrType == 2){ // 域名
                        let data = {
                            domain: this.form3.domain,
                            trustFlag: this.form3.trustFlag,
                        }
                        console.log(data,'数据-信任域名')
                        editExternalLinksTrust(data).then((res)=>{
                            this.$modal.msgSuccess("信任成功");
                            this.open3 = false;
                        })
                    }
                }
            });
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
                    keyWord: queryString,
                    pgNum: 1,
                    pgSize: 50,
                }
                SearchMediaInfo(date).then(response => {
                    // this.restaurants = response.rows;
                    for(var i in response.rows){
                        this.restaurants.push({
                            value: response.rows[i].siteName + '-' + response.rows[i].siteCodeMedia,
                            siteCode: response.rows[i].siteCodeMedia,
                            siteName: response.rows[i].siteName
                        })
                        if(response.rows[i].siteCodeMedia == queryString){
                            this.exportSiteName_ = response.rows[i].siteName;
                        }else{
                            this.exportSiteName_ = null;
                        }
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
            this.exportSiteName_ = val.siteName;
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
                            siteName: response.data[i].unitName
                        })
                        if(response.data[i].siteCode == queryString){
                            this.exportSiteName = response.data[i].unitName;
                            return
                        }else{
                            this.exportSiteName = null;
                        }
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
            this.exportSiteName = val.siteName;
        },


         // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.open6 = true;
            this.fileType = type;
            if(type == 1){
                this.title6 = '信任导入';
            }else if(type == 2){
                this.title6 = '整改导入';
            }else if(type == 3){
                this.title6 = '审核导入';
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
                        formData.append("taskType", 150);
                    });
                }else if(this.fileType == 2){ // 整改导入
                    this.subFileList.forEach(f => {
                        console.log(f,'f')
                        formData.append("file", f.raw);
                        formData.append("taskType",156);
                    });
                }else if(this.fileType == 3){ // 审核导入
                    this.subFileList.forEach(f => {
                        console.log(f,'f')
                        formData.append("file", f.raw);
                        formData.append("taskType",150);
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
            if(this.fileType == 1){ // 信任
                let fileName = '新媒体外链信任模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=150",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
                              
            }else if(this.fileType == 2){ // 整改
                let fileName = '新媒体外链整改模板';
                this.download2(
                    "common/download/downloadExcelTpl?type=156",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }else if(this.fileType == 3){ // 审核
                let fileName = '新媒体外链审核模板';
                this.download2(
                    "common/download/downloadExcelTpl?type=150",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }
            
        },


          // tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            // this.resetForm("queryForm");
            this.queryParams.pgNum = 1;
            this.queryParams.pgSize = 100;
            this.queryParams.showState = null;
            this.queryParams.showStateIn = [];
            this.queryParams.trustFlag = null;
            this.multiple = true;
            this.ids = [];

            if(tab.name == '1'){ // 待审核
                this.queryParams.exemptionId = null; // 客户免检进入

                this.queryParams.showState = 1;
                this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]; // 表格排序
                this.queryParams.searchDateKey = 'ct';
                if(this.queryParams.domain != null || this.queryParams.treeInfo.psCode != null || this.queryParams.siteCodeMedia != null || this.queryParams.idStr != null){ // 外链域名
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                }
                // this.getList();                                
            }else if(tab.name == '2'){ // 可疑外链
                if(sessionStorage.getItem('ExternalLinksMediaObj')){ // 客户免检进入
                    let obj = JSON.parse(sessionStorage.getItem('ExternalLinksMediaObj'));
                    this.queryParams.exemptionId = obj.idStr;
                }
                this.queryParams.trustFlag = 2;
                this.queryParams.showStateIn = [2,3];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.searchDateKey = 'ate';
                if(this.queryParams.domain != null || this.queryParams.treeInfo.psCode != null || this.queryParams.siteCodeMedia != null || this.queryParams.idStr != null){ // 外链域名
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                }
                // this.getList();
            }else if(tab.name == '3'){ // 信任外链 
                if(sessionStorage.getItem('ExternalLinksMediaObj')){ // 客户免检进入
                    let obj = JSON.parse(sessionStorage.getItem('ExternalLinksMediaObj'));
                    this.queryParams.exemptionId = obj.idStr;
                }
                this.queryParams.trustFlag = 1;
                this.queryParams.showStateIn = [2];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.searchDateKey = 'ate';
                if(this.queryParams.domain != null || this.queryParams.treeInfo.psCode != null || this.queryParams.siteCodeMedia != null || this.queryParams.idStr != null){ // 外链域名
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                }
                // this.getList();
            }
        },

        // 编辑
        handleUpdate(row){
            const id = row.idStr;
            getInspSiteInfo({id:id}).then(response => {
                this.open10 = true;
                // this.form10.id = response.data.idStr;
                this.form10 = response.data;
                this.form10.id = response.data.idStr;
                this.form10.showState = 2;
                this.$set(this.form10, 'batchEditVo', {
                    ...this.form10.batchEditVo,
                    urlType: null,  //    应用对象 1域名  2链接
                    scope: 1,  //    应用范围   1当前填报单位
                    elTaskName: this.form10.siteName,  //     任务名称
                    trustFlag: this.form10.trustFlag, //    信任状态  1信任，2可疑
                    errorTypes: this.form10.errorTypes, //   外链类型
                    showState: this.form10.showState, //   显示状态 显示状态 1待审核，2显示 3显示并预警
                    applicationScope: this.form10.applicationScope, // 应用数据范围 1待审核待整改 2已审核待整改 3全部待整改
                });
                // this.form2.reviewResult = response.data.reviewResult;
                // console.log(this.form2,'this.form-header')
                // this.open2 = true;
                // this.zgType = 1; // 1、单个 2、批量
            });
        },
        // 是否批量操作
        batchEditVoChange(){
            console.log(this.form10,'this.form10.showState')
            this.batchEditVoType = !this.batchEditVoType;
            if(this.batchEditVoType == true){
                this.subBtnText = '确认批量操作';
            }else{
                this.subBtnText = '确认单条操作';
            }
            let applicationScope = null;
            if(!this.form10.batchEditVo.applicationScope || this.form10.batchEditVo.applicationScope == undefined){
                applicationScope = 1;
            }else{
                applicationScope = this.form10.batchEditVo.applicationScope;
            }
            console.log(applicationScope,'applicationScope')
            this.$set(this.form10, 'batchEditVo', {
                ...this.form10.batchEditVo,
                urlType: null,  //    应用对象 1域名  2链接
                scope: 1,  //    应用范围   1当前填报单位
                elTaskName: this.form10.siteName,  //     任务名称
                trustFlag: this.form10.trustFlag, //    信任状态  1信任，2可疑
                errorTypes: this.form10.errorTypes, //   外链类型
                showState: this.form10.showState, //   显示状态 显示状态 1待审核，2显示 3显示并预警
                applicationScope: applicationScope, // 应用数据范围 1待审核待整改 2已审核待整改 3全部待整改
            });
        },
        // 取消
        cancel10(){
            this.form10.batchEditVo = {
                urlType: null, //    应用对象 1域名  2链接
                scope: 1, //    应用范围   1当前填报单位
                elTaskName: null, //     任务名称
                trustFlag: null, //    信任状态  1信任，2可疑
                errorTypes: null, //   外链类型
                showState: null, //   显示状态 显示状态 1待审核，2显示 3显示并预警
                applicationScope: null, // 应用数据范围 1待审核待整改 2已审核待整改 3全部待整改
            }
            this.batchEditVoType = false;
            this.open10 = false;
        },
        // 确认操作
        submitForm10(){
            // batchEditVoType
            this.$refs["form10"].validate(valid => {
                if (valid) {
                    if(this.batchEditVoType == false){
                        this.form10.batchEditVo = null;
                    }
                    console.log(this.form10,'表单提交数据')
                    updateInspSiteInfo(this.form10).then((res)=>{
                        this.$modal.msgSuccess("编辑成功");
                        this.open10 = false;
                        this.batchEditVoType = false;
                    })
                }
            });
        },
        // 信任状态事件
        trustFlagChange(){
            console.log(this.form10.trustFlag,'123123')
            // if(this.form10.trustFlag == 1){
                this.form10.showState = 2;
            // }
        },
        // 批量预警
        warnChange(type,row){
            let data = {};
            if(type == 1){ // 单条
                data = {
                    ids: [row.idStr],
                }
                editWarnBatch(data).then((res)=>{
                    this.$modal.msgSuccess("预警成功");
                    // this.getList(); 
                })
            }else if(type == 2){ // 批量
                data = {
                    ids: this.ids,
                }
                this.$modal.confirm('是否确认预警已选中的数据项？').then(() => {
                    editWarnBatch(data).then((res)=>{
                        this.$modal.msgSuccess("操作成功");  
                        // this.inspSiteInfoList = this.inspSiteInfoList.filter(
                        //     (a) => !this.ids.some((b) => a.idStr === b)
                        // )
                        // console.log(this.inspSiteInfoList,'操作后的列表数据')
                        // if(this.inspSiteInfoList.length == 0){
                        //     setTimeout(()=>{
                                this.getList();
                        //     },1000)
                        // }  
                    })
                }).catch(() => {});
            }
            console.log(data,'预警')
            
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

    .bigWrapBox{
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 2000;
        position: fixed;
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
        margin-top: 15vh !important;
    }
</style>