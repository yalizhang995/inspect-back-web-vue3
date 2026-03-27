<template>
    <div class="app-container">
         <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 待审核 -->
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
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:302px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="网站标识码" prop="siteCode">
                        <!-- <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="漏洞级别" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择漏洞级别" style="width:300px">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="监测状态" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择监测状态">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    
                    <!-- <el-form-item label="任务ID" prop="taskId">
                        <el-input
                            v-model="queryParams.taskId"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
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
                    


                    <el-form-item style="marginLeft:16px">
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
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-edit"
                            size="mini"
                            :disabled="multiple"
                            @click="handleUpdateAll"
                        >批量整改</el-button>
                    </el-col> -->
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
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
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="160" fixed show-overflow-tooltip></el-table-column>
                    
                    <el-table-column prop="title" label="问题地址" width="320" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_levelName" label="漏洞级别" width="100" align="center">
                        <template slot-scope="scope">
                            <span :style="{color: scope.row.vulLevelColor}">{{ scope.row.vul_levelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_name" label="漏洞名称" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="vul_family" label="漏洞分类" width="160"></el-table-column>
                    <el-table-column prop="qod_typeName" label="准确性评分类型" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="qod" label="准确性评分" width="140" align="center"></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="140" align="center" ></el-table-column>
                    <el-table-column prop="createTime" label="监测时间" width="160"></el-table-column>
                    <el-table-column prop="scanDateTime" label="扫描时间" width="160"></el-table-column>
                    <el-table-column prop="auditTime" label="审核时间" width="160"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="160"></el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row,scope.$index)" >整改</el-button> -->
                            <el-button size="mini" type="text" icon="el-icon-view" @click="setInfo(scope.row,scope.$index)" style="marginLeft:0">详情</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- vulLeveTxt
                httpStatusTxt -->

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
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:302px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="网站标识码" prop="siteCode">
                        <!-- <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="漏洞级别" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择漏洞级别" style="width:300px">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="监测状态" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择监测状态">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    
                    <!-- <el-form-item label="任务ID" prop="taskId">
                        <el-input
                            v-model="queryParams.taskId"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
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
                    


                    <el-form-item style="marginLeft:16px">
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    height="500"
                    v-if="activeName == '2'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="160" fixed show-overflow-tooltip></el-table-column>
                    
                    <el-table-column prop="title" label="网站地址" width="320" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_levelName" label="漏洞级别" width="100" align="center">
                        <template slot-scope="scope">
                            <span :style="{color: scope.row.vulLevelColor}">{{ scope.row.vul_levelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_name" label="漏洞名称" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="vul_family" label="漏洞分类" width="160"></el-table-column>
                    <el-table-column prop="qod_typeName" label="准确性评分类型" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="qod" label="准确性评分" width="140" align="center"></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="140" align="center" ></el-table-column>
                    <el-table-column prop="createTime" label="监测时间" width="160"></el-table-column>
                    <el-table-column prop="scanDateTime" label="扫描时间" width="160"></el-table-column>
                    <el-table-column prop="auditTime" label="审核时间" width="160"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="160"></el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row,scope.$index)" >整改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-view" @click="setInfo(scope.row,scope.$index)" style="marginLeft:0">详情</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- vulLeveTxt
                httpStatusTxt -->

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
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:302px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany"
                        ></el-autocomplete>
                    </el-form-item> 
                    <el-form-item label="网站标识码" prop="siteCode">
                        <!-- <el-input
                            v-model="queryParams.siteCode"
                            placeholder="请输入网站标识码"
                            clearable
                            @keyup.enter.native="handleQuery"
                        /> -->
                        <el-autocomplete
                            v-model="queryParams.siteCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:300px"
                            @select="handleSelectCompany2"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="漏洞级别" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择漏洞级别" style="width:300px">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="监测状态" prop="vulLevel">
                        <el-select v-model="queryParams.vulLevel" clearable placeholder="请选择监测状态">
                            <el-option
                                v-for="item in ldList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    
                    <!-- <el-form-item label="任务ID" prop="taskId">
                        <el-input
                            v-model="queryParams.taskId"
                            placeholder="请输入任务ID"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item> -->
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
                    


                    <el-form-item style="marginLeft:16px">
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    height="500"
                    v-if="activeName == '3'"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="160" fixed show-overflow-tooltip></el-table-column>
                    
                    <el-table-column prop="title" label="网站地址" width="320" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_levelName" label="漏洞级别" width="100" align="center">
                        <template slot-scope="scope">
                            <span :style="{color: scope.row.vulLevelColor}">{{ scope.row.vul_levelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="vul_name" label="漏洞名称" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="vul_family" label="漏洞分类" width="160"></el-table-column>
                    <el-table-column prop="qod_typeName" label="准确性评分类型" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="qod" label="准确性评分" width="140" align="center"></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="160" align="center" ></el-table-column>
                    <el-table-column prop="createTime" label="监测时间" width="160"></el-table-column>
                    <el-table-column prop="scanDateTime" label="扫描时间" width="160"></el-table-column>
                    <el-table-column prop="auditTime" label="审核时间" width="160"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="160"></el-table-column>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row,scope.$index)" >整改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-view" @click="setInfo(scope.row,scope.$index)" style="marginLeft:0">详情</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- vulLeveTxt
                httpStatusTxt -->

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
        <!-- 右侧抽屉 -->
        <!-- 端口 -->
        <el-drawer :title="ctTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
            <div class="jbBox" :style="{borderBottom: '2px solid'+infoObj.color}">
                <span class="sp1" :style="{backgroundColor:infoObj.color,border: '1px solid'+infoObj.color}">{{infoObj.vul_levelName}}</span>
                <span class="sp">{{infoObj.vul_family}}</span>
                <span class="sp">{{infoObj.qod_typeName}}/{{infoObj.qod}}%</span>
            </div>
            <div class="jbxxBox" :style="{borderBottom: '2px solid'+infoObj.color}">基本信息</div>
            <div class="jbxxBoxx">
                <span>ID</span>
                <span>{{infoObj.vul_id}}</span>
            </div>
            <div class="jbxxBox" :style="{borderBottom: '2px solid'+infoObj.color}">描述</div>
            <div class="msBoxx">
                <!-- <span>CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF，是一种对网站的恶意利用。</span> -->
                <!-- <span>插件通过动态扫描检测参数，具备发现潜在0day漏洞的能力，能够进行高效的模糊测试。</span> -->
                <span>{{infoObj.vul_desc}}</span>
            </div>
            <div class="jbxxBox" :style="{borderBottom: '2px solid'+infoObj.color}">解决方案</div>
            <div class="msBoxx2" :style="{borderBottom: '2px solid'+infoObj.color}">
                <!-- <span>1、Cookie Hashing</span>
                <span>所有表单都包含同一个伪随机值。</span>
                <span>2、验证码</span>
                <span>每次的用户提交都需要用户在表单中填写一个图片上的随机字符串</span>
                <span>3、One-Time Tokens</span>
                <span>不同的表单包含一个不同的伪随机值。</span> -->
                <span>{{infoObj.vul_solu}}</span>
            </div>
            <div class="msBoxx3">
                <span>URL</span>
                <el-select v-model="infoObj.url" placeholder="请选择" size="small" style="width:60%;marginRight:10px">
                    <el-option
                        v-for="item in infoObj.urlArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="text" size="small" @click="dzChange(infoObj.url)">访问</el-button>
            </div>
            <div class="jbxxBox" :style="{borderBottom: '2px solid'+infoObj.color}">监测结果</div>
            <div class="msBoxx">
                <!-- <span>URL: https://test.unionpro.top:7443/html/static/test.html Param: Payload:</span>
                <span>插件通过动态扫描检测参数，具备发现潜在0day漏洞的能力，能够进行高效的模糊测试。</span> -->
                <!-- <div>{{infoObj.vul_output}}</div> -->
                <!-- <span>这是第一行\n这是第二行</span> -->
                <span v-html='infoObj.vul_output'></span>
            </div>

        </el-drawer>

    </div>
</template>

<script>
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { inspOrderInfoQueryList } from "@/api/biz/inspOrderInfo";
import { inspOrderBatchQueryList } from "@/api/biz/inspOrderBatch";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";

import { 
    SystemMonitoringList,
    SystemMonitoringGetInfo,
    SystemMonitoringRemove,
    SystemMonitoringEditReviewResult,
    SystemMonitoringEditReviewResultBatch,
    SystemMonitoringEdit,
    SystemMonitoringEditBatch
} from "@/api/webSecurityInfo/SystemMonitoring";




export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
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

            activeName: '1',
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 100,
                treeInfo: {'psCode': null},
                // searchKey: 'sc',
                searchDateKey: 'ate',
                // searchVal: '',
                vulLevel: null, // 漏洞级别
                httpStatus: null, // 监测状态
                startDate: null, // 开始时间
                endDate: null, // 结束时间
                // orderTypes: [{ code: 1, name: 'ct' }], // 表格排序
                siteCode: null, // 网站标识码
                taskId: null,
                logType: 9, // 类型 9.网页木马
                reviewResult: null, // 整改状态
                showStateIn: [1],
            },
            wtlxTxt: null,
            orderId: null,
            batchId: null,
            /**下拉菜单数据 */
            // 漏洞级别
            ldList: [ 
                { label: '信息', val: 0, color: '#30BF78' },
                { label: '低危', val: 1, color: '#30BF78' },
                { label: '中危', val: 2, color: '#FAAD14' },
                { label: '高危', val: 3, color: '#F4664A' },
            ],
            // 监测状态
            jcList: [
                { label: '正常', val: 0 },
                { label: '异常', val: 1 },
            ],
            // 时间类型
            DateArr: [],
            shsjList: [ 
                { label: '监测时间', val: 'ct' },
                { label: '审核时间', val: 'ate' },
            ],
            // 整改状态
            zgztList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '忽略', val: 3 },
            ],


            editObj: {},

            // 站点关系树选项
            inspSiteTreeOptions: [],

            orderInfoList: [], // 订单
            orderBatchList: [], // 批次

            wtlxList: [], // 问题类型

            zgType: null,

            upIndex: null,
            zgIndex: null,
            // 导出
            open4: false, 
            form4: {
                menuType: 370
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },


            /**整改 */
            open2: false, 
            form2: {
                idStr: null,
                reviewResult: null
            },
            rules2: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            /**抽屉 */
            ctTitle: 'HTML表单缺失CSRF防护',
            // 端口
            drawer: false,
            direction: 'rtl', // 打开的方式-右侧
            options: [
                { label: 'https://test.unionpro.top:7443/html/static/test.html', value: 'https://test.unionpro.top:7443/html/static/test.html' },
                { label: 'http://test.unionpro.top:7443/html/static/test.html', value: 'http://test.unionpro.top:7443/html/static/test.html' },
            ],
            value: null,
            infoObj: { urlArr: null }
            
        };
    },
    created() {
        this.getList();
        // this.getListInspOrderBatch(); // 批次
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
            SystemMonitoringList(this.queryParams).then(response => {
                // let arrDate = response.data;
                for(var i in response.rows){
                    response.rows[i].index = parseInt(i)+1;
                    // 网站地址
                    if(!response.rows[i].url){
                        response.rows[i].url = '--';
                    }
                    // 标题
                    if(!response.rows[i].hideTitle){
                        response.rows[i].hideTitle = '--';
                    }
                    // 审核时间
                    if(!response.rows[i].auditTime){
                        response.rows[i].auditTime = '--';
                    }
                    // 整改时间
                    if(!response.rows[i].rectifyTime){
                        response.rows[i].rectifyTime = '--';
                    }
                    // 漏洞级别
                    for(var j in this.ldList){
                        if(response.rows[i].vul_level != null || response.rows[i].vul_level != ''){
                            if(response.rows[i].vul_level == this.ldList[j].val){
                                response.rows[i].vulLevelTxt = this.ldList[j].label;
                                response.rows[i].vulLevelColor = this.ldList[j].color;
                            }
                        }else{
                            response.rows[i].vulLevelTxt = '--';
                            response.rows[i].vulLevelColor = '';
                        }
                        
                    }
                    // 整改状态
                    if(response.rows[i].reviewResult == 1){ 
                        response.rows[i].reviewResultTxt = '待整改';
                    }else if(response.rows[i].reviewResult == 2){ 
                        response.rows[i].reviewResultTxt = '已整改';
                    }else if(response.rows[i].reviewResult == 3){ 
                        response.rows[i].reviewResultTxt = '忽略';
                    }

                }
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            // this.resetForm("queryForm");
            this.queryParams.pgNum = 1;
            this.queryParams.pgSize = 100;
            if(tab.name == '1'){
                this.queryParams.showStateIn = [1];
                // this.queryParams.reviewResult = 1;
                this.getList();
            }else if(tab.name == '2'){
                this.queryParams.showStateIn = [2,3];
                // this.queryParams.reviewResult = 2;
                this.getList();
            }else if(tab.name == '3'){
                this.queryParams.showStateIn = [4];
                // this.queryParams.reviewResult = 3;                
                this.getList();
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
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.queryParams.treeInfo.psCode = null;
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
        /** 删除按钮操作 */
        handleDelete(row,delIndex) {
            console.log(row)
            if(row.id){
                const ids = row.idStr
                this.$modal
                    .confirm('是否确认删除该条数据？')
                    .then(function() {
                        return SystemMonitoringRemove({ids:[ids]});
                    })
                    .then(() => {
                        // this.getList();
                        this.$modal.msgSuccess("删除成功");
                        // this.getList();
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
                        return SystemMonitoringRemove({ids:ids});
                    })
                    .then(() => {
                        // this.getList();
                        this.$modal.msgSuccess("删除成功");
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
                    .catch(() => {});
            }
            
        },
        // 表单重置
        reset4() {
            this.form4 = {
                menuType: 370,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                menuType: 370,
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
                    subData.menuType = 340;
                    console.log(subData,'提交数据')
                    if(this.form4.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open4 = false;
                        })
                    }else{ // 小批量
                        let fileName = '网页木马数据'
                        this.download(
                            "biz/webSecurityInfo/export",this.queryParams,
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
            if(url != null && url != ''){
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

        // 详情
        handleClose(done) {
            // this.$confirm('确认关闭？')
            // .then(_ => {
            //     done();
            // })
            // .catch(_ => {});
            done();
        },

        // 显示误报
        /** 修改按钮操作 */
        handleUpdate(row,index,delIndex) {
            console.log(delIndex,'删除下标')
            this.reset();
            const id = row.idStr || this.ids;
            SystemMonitoringGetInfo({id:id}).then(response => {
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
                    this.form.showState = index;                    
                    console.log(this.form,'subForm')
                    SystemMonitoringEdit(this.form).then(response => {
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
                SystemMonitoringEditBatch(data).then((res)=>{
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

        /**整改 */
        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
        },
        handleUpdate2(row,delIndex) {
            this.form2 = {
                idStr: null,
                reviewResult: null,
            }
            this.resetForm("form2");
            const id = row.idStr || this.ids;
            this.upIndex = delIndex;
            SystemMonitoringGetInfo({id:id}).then(response => {
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
                            SystemMonitoringEditReviewResult(this.form2).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                this.inspSiteInfoList.splice(this.upIndex, 1);
                                if(this.inspSiteInfoList.length == 0){
                                    setTimeout(()=>{
                                        this.getList();
                                    },1000)
                                }
                                // this.getList();
                            });
                        }else{
                            let data = {
                                ids: this.ids,
                                reviewResult: this.form2.reviewResult
                            }
                            console.log(data,'data')
                            SystemMonitoringEditReviewResultBatch(data).then(()=>{
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

        /**详情 */
        setInfo(row,delIndex){
            const id = row.idStr;
            this.upIndex = delIndex;
            SystemMonitoringGetInfo({id:id}).then(response => {
                this.drawer = true;
                this.infoObj = response.data;
                // let aa = '这是第一行\n这是第二行'
                this.ctTitle = this.infoObj.vul_name;
                // this.infoObj.vul_output = this.infoObj.vul_output.replace(/\\n\\n|\\r\\r|\n|\r|\\r\\n|\\r/g, '<br>');
                this.infoObj.vul_output = this.infoObj.vul_output.replace(/\\n/g, '<br>');
                this.infoObj.urlArr = [{ label: this.infoObj.url, value: this.infoObj.url }]
                // 危险等级
                // this.infoObj.vul_level = 1;
                for(var i in this.ldList){
                    if(this.infoObj.vul_level == this.ldList[i].val){
                        this.infoObj.color = this.ldList[i].color;
                    }
                }
                console.log(this.infoObj)
            });
        },
        // 关闭
        handleClose(){
            this.drawer = false;
            this.infoObj = { urlArr: null };
        },

         /**搜索条件 */
        // 网站标识码
        querySearchAsync2(queryString, callBack) {
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
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.queryParams.siteCode = val.siteCode;
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


    /* 抽屉*/
    .jbBox{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding-bottom: 6px;
        border-bottom: 2px solid rgb(250, 173, 20);
        span{
            display: block;
            font-size: 12px;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .sp1{
            width: 42px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            background: rgb(250, 173, 20);
            border: 1px solid rgb(250, 173, 20);
            color: rgb(255, 255, 255);
        }
        .sp{
            background: rgb(230, 247, 255);
            border: 1px solid rgb(230, 247, 255);
            color: rgb(95, 95, 95);
            padding: 0 10px;
        }
    }
    .jbxxBox{
        margin-top: 20px;
        font-size: 14px;
        font-weight: bold;
        padding-bottom: 5px;
        border-bottom: 2px solid rgb(250, 173, 20);
    }
    .jbxxBoxx{
        border: 1px solid rgb(204, 204, 204);
        margin: 16px 0;
        display: flex;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        span{
            display: block;
            text-align: center;
        }
        span:nth-child(1){
            width: 25%;
            border-right: 1px solid rgb(204, 204, 204);
        }
        span:nth-child(2){
            flex: 1;
        }
    }
    .msBoxx,.msBoxx2,.msBoxx3{
        margin: 16px 0;
        span{
            font-size: 12px;
            display: block;
            line-height: 30px;
        }
    }
    .msBoxx2{
        padding-bottom: 16px;
        border-bottom: 2px solid rgb(250, 173, 20);
    }
    .msBoxx3{
        display: flex;
        align-items: center;
        span{
            display: inline-block!important;
            margin-right: 10px;
        }
    }
    
</style>
<style scoped>
    /deep/.el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 12vh !important;
    }
    /deep/ .pagination-container{
        margin-bottom: 20px!important;
    }
    /* 抽屉 */
    /deep/.el-drawer{
        width: 44%!important;
        display: flex;
        overflow: hidden;
    }
    /deep/.el-drawer__header{
        margin-bottom: 0!important;
        color: #000000;
        font-weight: bold;
    }
    /deep/.el-drawer__body{
        margin: 10px 20px;
        flex: 1;
        overflow: auto;
    }
</style>