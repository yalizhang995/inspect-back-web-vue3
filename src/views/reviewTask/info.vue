<template>
    <div class="app-container errorsPage" >
        <!-- 正常展示 -->
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 错误内容 -->
                <el-tab-pane label="错误内容" name="30">
                    <el-form
                        :model="queryParams"
                        ref="queryForm"
                        size="small"
                        :inline="true"
                        v-show="showSearch"
                        label-width="100px"
                    >
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
                        <el-form-item label="网站名称" prop="scName">
                            <el-input
                                v-model="queryParams.scName"
                                placeholder="请输入网站名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        <el-form-item label="复核状态" prop="reviewState">
                            <el-select v-model="queryParams.reviewState" clearable placeholder="请选择复核状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="复核结果类型" prop="reviewDescType">
                            <el-select v-model="queryParams.reviewDescType" clearable placeholder="请选择复核结果类型" style="width:310px">
                                <el-option
                                    v-for="item in reviewDescTypeList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="整改状态" prop="reviewResult">
                            <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewResultList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发现时间" prop="">
                            <el-date-picker
                                v-model="DateArr"
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
                        <el-form-item label="审核时间" prop="">
                            <el-date-picker
                                v-model="DateArr2"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="sjrqChange2"
                                style="width:310px"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数据ID" prop="dataId">
                            <el-input
                                v-model="queryParams.dataId"
                                placeholder="请输入数据ID"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        
                        
                        <el-form-item style="marginLeft:8px">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button plain type="primary" size="mini" @click="goBack">返回上级</el-button>
                        </el-col>
                    </el-row>

                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    
                    <el-table
                        v-loading="loading"
                        :data="inspSiteInfoList"
                        @sort-change="sortChange"
                        @selection-change="handleSelectionChange"
                        fit
                        v-if="activeName == '30'"
                    >
                        <!-- <el-table-column type="selection" width="50" align="center" /> -->
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="siteName" label="网站名称" min-width="220" show-overflow-tooltip/>
                        <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewResultTxt" label="本次整改状态" min-width="100" align="center"></el-table-column>

                        <el-table-column prop="word" label="错敏词" min-width="160"></el-table-column>
                        <el-table-column prop="suggest" label="建议词" min-width="160"></el-table-column>
                        <el-table-column prop="sentence" label="所在上下文" min-width="300">
                            <template slot-scope="scope">
                                <span class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="所在文章" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reviewDesc" label="快照" min-width="100" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="父页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataId" label="数据ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskId" label="主任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskDetailsId" label="子任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="firstFindTime" label="首次发现时间" min-width="160"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" min-width="160"></el-table-column>    
                        <el-table-column prop="reviewTime" label="复核时间" min-width="160"></el-table-column>            
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-connection" @click="handleGo(scope.row,30)">跳转</el-button>
                                <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEnd(scope.row,30)">整改</el-button>
                                
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
                </el-tab-pane>
                <!-- 敏感信息 -->
                <el-tab-pane label="敏感信息" name="40">
                    <el-form
                        :model="queryParams"
                        ref="queryForm"
                        size="small"
                        :inline="true"
                        v-show="showSearch"
                        label-width="100px"
                    >
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
                        <el-form-item label="网站名称" prop="scName">
                            <el-input
                                v-model="queryParams.scName"
                                placeholder="请输入网站名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        <el-form-item label="复核状态" prop="reviewState">
                            <el-select v-model="queryParams.reviewState" clearable placeholder="请选择复核状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="复核结果类型" prop="reviewDescType">
                            <el-select v-model="queryParams.reviewDescType" clearable placeholder="请选择复核结果类型" style="width:310px">
                                <el-option
                                    v-for="item in reviewDescTypeList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="整改状态" prop="reviewResult">
                            <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewResultList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发现时间" prop="">
                            <el-date-picker
                                v-model="DateArr"
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
                        <el-form-item label="审核时间" prop="">
                            <el-date-picker
                                v-model="DateArr2"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="sjrqChange2"
                                style="width:310px"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数据ID" prop="dataId">
                            <el-input
                                v-model="queryParams.dataId"
                                placeholder="请输入数据ID"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        
                        <el-form-item style="marginLeft:8px">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button plain type="primary" size="mini" @click="goBack">返回上级</el-button>
                        </el-col>
                    </el-row>

                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    
                    <el-table
                        v-loading="loading"
                        :data="inspSiteInfoList"
                        @sort-change="sortChange"
                        @selection-change="handleSelectionChange"
                        fit
                        v-if="activeName == '40'"
                    >
                        <!-- <el-table-column type="selection" width="50" align="center" /> -->
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="siteName" label="网站名称" min-width="220" show-overflow-tooltip/>
                        <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>

                        <el-table-column prop="reviewResultTxt" label="本次整改状态" min-width="100" align="center"></el-table-column>

                        <el-table-column prop="word" label="错敏词" min-width="160"></el-table-column>
                        <el-table-column prop="suggest" label="建议词" min-width="160"></el-table-column>
                        <el-table-column prop="sentence" label="所在上下文" min-width="300">
                            <template slot-scope="scope">
                                <span class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="所在文章" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reviewDesc" label="快照" min-width="100" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="父页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataId" label="数据ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskId" label="主任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskDetailsId" label="子任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="firstFindTime" label="首次发现时间" min-width="160"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" min-width="160"></el-table-column>    
                        <el-table-column prop="reviewTime" label="复核时间" min-width="160"></el-table-column>            
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-connection" @click="handleGo(scope.row,40)">跳转</el-button>
                                <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEnd(scope.row,40)">整改</el-button>
                                
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
                </el-tab-pane>
                <!-- 隐私泄露 -->
                <el-tab-pane label="隐私泄露" name="50">
                    <el-form
                        :model="queryParams"
                        ref="queryForm"
                        size="small"
                        :inline="true"
                        v-show="showSearch"
                        label-width="100px"
                    >
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
                        <el-form-item label="网站名称" prop="scName">
                            <el-input
                                v-model="queryParams.scName"
                                placeholder="请输入网站名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        <el-form-item label="复核状态" prop="reviewState">
                            <el-select v-model="queryParams.reviewState" clearable placeholder="请选择复核状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="复核结果类型" prop="reviewDescType">
                            <el-select v-model="queryParams.reviewDescType" clearable placeholder="请选择复核结果类型" style="width:310px">
                                <el-option
                                    v-for="item in reviewDescTypeList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="整改状态" prop="reviewResult">
                            <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewResultList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发现时间" prop="">
                            <el-date-picker
                                v-model="DateArr"
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
                        <el-form-item label="审核时间" prop="">
                            <el-date-picker
                                v-model="DateArr2"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="sjrqChange2"
                                style="width:310px"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数据ID" prop="dataId">
                            <el-input
                                v-model="queryParams.dataId"
                                placeholder="请输入数据ID"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        
                        
                        <el-form-item style="marginLeft:8px">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button plain type="primary" size="mini" @click="goBack">返回上级</el-button>
                        </el-col>
                    </el-row>

                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    
                    <el-table
                        v-loading="loading"
                        :data="inspSiteInfoList"
                        @sort-change="sortChange"
                        @selection-change="handleSelectionChange"
                        fit
                        v-if="activeName == '50'"
                    >
                        <!-- <el-table-column type="selection" width="50" align="center" /> -->
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="siteName" label="网站名称" min-width="220" show-overflow-tooltip/>
                        <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>

                        <el-table-column prop="reviewResultTxt" label="本次整改状态" min-width="100" align="center"></el-table-column>

                        <el-table-column prop="word" label="错敏词" min-width="160"></el-table-column>
                        <el-table-column prop="suggest" label="建议词" min-width="160"></el-table-column>
                        <el-table-column prop="sentence" label="所在上下文" min-width="300">
                            <template slot-scope="scope">
                                <span class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="所在文章" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reviewDesc" label="快照" min-width="100" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="父页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataId" label="数据ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskId" label="主任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskDetailsId" label="子任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="firstFindTime" label="首次发现时间" min-width="160"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" min-width="160"></el-table-column>    
                        <el-table-column prop="reviewTime" label="复核时间" min-width="160"></el-table-column>            
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-connection" @click="handleGo(scope.row,50)">跳转</el-button>
                                <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEnd(scope.row,50)">整改</el-button>
                                
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
                </el-tab-pane>
                <!-- 错链信息 -->
                <!-- <el-tab-pane label="错链信息" name="20">
                    <el-form
                        :model="queryParams"
                        ref="queryForm"
                        size="small"
                        :inline="true"
                        v-show="showSearch"
                        label-width="100px"
                    >
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
                        <el-form-item label="网站名称" prop="scName">
                            <el-input
                                v-model="queryParams.scName"
                                placeholder="请输入网站名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        <el-form-item label="复核状态" prop="reviewState">
                            <el-select v-model="queryParams.reviewState" clearable placeholder="请选择复核状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="复核结果类型" prop="reviewDescType">
                            <el-select v-model="queryParams.reviewDescType" clearable placeholder="请选择复核结果类型" style="width:310px">
                                <el-option
                                    v-for="item in reviewDescTypeList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="整改状态" prop="reviewResult">
                            <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewResultList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发现时间" prop="">
                            <el-date-picker
                                v-model="DateArr"
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
                        <el-form-item label="审核时间" prop="">
                            <el-date-picker
                                v-model="DateArr2"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="sjrqChange2"
                                style="width:310px"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数据ID" prop="dataId">
                            <el-input
                                v-model="queryParams.dataId"
                                placeholder="请输入数据ID"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        
                        
                        <el-form-item style="marginLeft:8px">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button plain type="primary" size="mini" @click="goBack">返回上级</el-button>
                        </el-col>
                    </el-row>

                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    
                    <el-table
                        v-loading="loading"
                        :data="inspSiteInfoList"
                        @sort-change="sortChange"
                        @selection-change="handleSelectionChange"
                        fit
                        v-if="activeName == '20'"
                    >
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="siteName" label="网站名称" min-width="220" show-overflow-tooltip/>
                        <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>

                        <el-table-column prop="reviewResultTxt" label="本次整改状态" min-width="100" align="center"></el-table-column>

                        <el-table-column prop="url" label="错链链接" min-width="200" >
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="errorTypesText" label="错链类型" min-width="120" ></el-table-column>
                        <el-table-column prop="fromTitle" label="错链所在页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitle}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="reviewDesc" label="快照" min-width="100" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="父页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dataId" label="数据ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskId" label="主任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskDetailsId" label="子任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="firstFindTime" label="首次发现时间" min-width="160"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" min-width="160"></el-table-column>    
                        <el-table-column prop="reviewTime" label="复核时间" min-width="160"></el-table-column>            
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-connection" @click="handleGo(scope.row,20)">跳转</el-button>
                                <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEnd(scope.row,20)">整改</el-button>
                                
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
                </el-tab-pane> -->
                <!-- 外链信息 -->
                <el-tab-pane label="外链信息" name="70">
                    <el-form
                        :model="queryParams"
                        ref="queryForm"
                        size="small"
                        :inline="true"
                        v-show="showSearch"
                        label-width="100px"
                    >
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
                        <el-form-item label="网站名称" prop="scName">
                            <el-input
                                v-model="queryParams.scName"
                                placeholder="请输入网站名称"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        <el-form-item label="复核状态" prop="reviewState">
                            <el-select v-model="queryParams.reviewState" clearable placeholder="请选择复核状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="复核结果类型" prop="reviewDescType">
                            <el-select v-model="queryParams.reviewDescType" clearable placeholder="请选择复核结果类型" style="width:310px">
                                <el-option
                                    v-for="item in reviewDescTypeList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="整改状态" prop="reviewResult">
                            <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                                <el-option
                                    v-for="item in reviewResultList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发现时间" prop="">
                            <el-date-picker
                                v-model="DateArr"
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
                        <el-form-item label="审核时间" prop="">
                            <el-date-picker
                                v-model="DateArr2"
                                format="yyyy-MM-dd"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="sjrqChange2"
                                style="width:310px"
                                >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="数据ID" prop="dataId">
                            <el-input
                                v-model="queryParams.dataId"
                                placeholder="请输入数据ID"
                                clearable
                                @keyup.enter.native="handleQuery"
                                style="width:310px"
                            />
                        </el-form-item>
                        
                        
                        <el-form-item style="marginLeft:8px">
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button plain type="primary" size="mini" @click="goBack">返回上级</el-button>
                        </el-col>
                    </el-row>

                    <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                    
                    <el-table
                        v-loading="loading"
                        :data="inspSiteInfoList"
                        @sort-change="sortChange"
                        @selection-change="handleSelectionChange"
                        fit
                        v-if="activeName == '70'"
                    >
                        <!-- <el-table-column type="selection" width="50" align="center" /> -->
                        <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="siteName" label="网站名称" min-width="220" show-overflow-tooltip/>
                        <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>

                        <el-table-column prop="reviewResultTxt" label="本次整改状态" min-width="100" align="center"></el-table-column>

                        <el-table-column prop="url" label="外链链接" min-width="200" >
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="errorTypesText" label="外链类型" min-width="120" ></el-table-column>
                        <el-table-column prop="fromTitle" label="外链所在页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="auditTypeTxt" label="来源" min-width="120" ></el-table-column>
                        
                        <el-table-column prop="reviewDesc" label="快照" min-width="100" align="center">
                            <template slot-scope="scope">
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="title" label="父页面信息" min-width="300" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="dzz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="dataId" label="数据ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskId" label="主任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="reviewTaskDetailsId" label="子任务ID" min-width="220" ></el-table-column>
                        <el-table-column prop="firstFindTime" label="首次发现时间" min-width="160"></el-table-column>
                        <el-table-column prop="auditTime" label="审核时间" min-width="160"></el-table-column>    
                        <el-table-column prop="reviewTime" label="复核时间" min-width="160"></el-table-column>            
                        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="140" fixed="right">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-connection" @click="handleGo(scope.row,70)">跳转</el-button>
                                <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleEnd(scope.row,70)">整改</el-button>
                                
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
                </el-tab-pane>
                <!-- <el-tab-pane label="规范检查" name="60"></el-tab-pane> -->
            </el-tabs>
            
        
        </div>
        <!-- 整改 -->
        <el-dialog :title="title" :visible.sync="open2" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
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
    </div>
</template>

<script>
import {
    getReviewTaskList,
    reviewTaskEnd,
    getDetailList,
    wlEditReviewResult,
    cwEditReviewResult,
    mgEditReviewResult,
    ysEditReviewResult,
    clEditReviewResult
} from "@/api/reviewTask/index";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { listInspOrderBatch } from "@/api/biz/inspOrderBatch";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";


export default {
    name: "InspSiteInfo",
    components: {
        Treeselect,
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


            type: null,
            activeName: '30',

            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                reviewTaskId: null, // 主任务id
                reviewTaskDetailsId: null, // 子任务id
                siteCode: null, // 网站标识码
                bizType: 30,
                reviewResult: null, // 整改状态
                firstFindTimeStart: null, // 发现时间
                firstFindTimeEnd: null, // 发现时间
                auditTimeStart: null, // 审核时间
                auditTimeEnd: null, // 审核时间
                dataId: null, // 数据ID
                reviewTaskId: null, 
                reviewTaskDetailsId: null,
                reviewState: null, // 复核状态
                reviewDescType: null, // 复核结果类型
            },

            DateArr: [],
            DateArr2: [],

            /**下拉菜单数据 */
            // 任务状态
            statusList: [ 
                { label: '待开始', val: 0 },
                { label: '运行中', val: 1 },
                { label: '自动结束', val: 2 },
                { label: '异常', val: 3 },
                { label: '手动结束', val: 4 },
            ],
            // 复核状态
            reviewStateList: [
                { label: '未复核', val: 1 },
                { label: '复核中', val: 2 },
                { label: '复核完成', val: 3 },
                { label: '复核异常', val: 4 },
                { label: '手动结束', val: 5 },
            ],
            // 复核结果类型
            reviewDescTypeList: [
                { label: '不可访问', val: 10 },
                { label: '匹配不到上下文', val: 20 },
                { label: '复核已整改', val: 30 },
                { label: '白名单', val: 40 },
                { label: '疑似未整改', val: 50 },
                { label: '未知', val: 60 },
            ],
            // 整改状态
            reviewResultList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '忽略', val: 3 },
            ],
            // 是否启用
            enabledList: [ 
                { label: '启用', val: 0 },
                { label: '未启用', val: 1 },
            ],
            editObj: {},


            restaurants: [],
            timeout:  null,

            // 整改
            title: null,
            open2: false, 
            form2: {
                idStr: null,
                reviewResult: null
            },
            rules2: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },
            zgType: null,

            routerFrom: null,
            
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routerFrom = from.path;
        });

    },
    created() {
        console.log(this.routerFrom,'this.routerFrom')
        // 主子任务
        if(sessionStorage.getItem('goInfoType')){
            this.type = sessionStorage.getItem('goInfoType');
        }
        // tab
        if(sessionStorage.getItem('numType')){
            this.activeName = sessionStorage.getItem('numType');
            this.queryParams.bizType = parseInt(this.activeName);
        }
        // tab
        if(sessionStorage.getItem('reviewStateVal')){
            if(sessionStorage.getItem('reviewStateVal') !== 'null'){
                this.queryParams.reviewState = parseInt(sessionStorage.getItem('reviewStateVal'));
            }
        }
        // if(sessionStorage.getItem('reviewTaskId')){
        //     this.queryParams.reviewTaskId = sessionStorage.getItem('reviewTaskId');
        //     this.getList();
        // }else if(sessionStorage.getItem('reviewTaskChildrenId')){
        //     this.queryParams.reviewTaskDetailsId = sessionStorage.getItem('reviewTaskChildrenId');
        //     this.getList();
        // }
    },
    mounted(){
        console.log(this.routerFrom,'this.routerFrom')
        if(this.routerFrom == '/review/index'){ // 主任务
            this.queryParams.reviewTaskId = JSON.parse(sessionStorage.getItem('taskObj')).idStr;
            // this.queryParams.siteCode = JSON.parse(sessionStorage.getItem('taskObj')).siteCode;         
            this.getList();
        }else if(this.routerFrom == '/review/indexChildren'){ // 子任务
            this.queryParams.reviewTaskDetailsId = JSON.parse(sessionStorage.getItem('taskChildrenObj')).idStr;
            // this.queryParams.siteCode = JSON.parse(sessionStorage.getItem('taskChildrenObj')).siteCode;         
            this.getList();
        }else{
            if(sessionStorage.getItem('taskObj')){ // 主任务
                this.queryParams.reviewTaskId = JSON.parse(sessionStorage.getItem('taskObj')).idStr;
                // this.queryParams.siteCode = JSON.parse(sessionStorage.getItem('taskObj')).siteCode;         
                this.getList();
            }else if(sessionStorage.getItem('taskChildrenObj')){ // 子任务
                this.queryParams.reviewTaskDetailsId = JSON.parse(sessionStorage.getItem('taskChildrenObj')).idStr;
                // this.queryParams.siteCode = JSON.parse(sessionStorage.getItem('taskChildrenObj')).siteCode;         
                this.getList();
            }else{
                this.getList();
            }
            
        }
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        this.typeVal = false;
        // 确保调用next()以便路由继续跳转
        // sessionStorage.removeItem('reviewTaskId')
        // sessionStorage.removeItem('goInfoType')
        // sessionStorage.removeItem('reviewTaskChildrenId')
        next();

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
        // tab切换
        handleClick(){
            this.queryParams.bizType = parseInt(this.activeName);
            this.getList();
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            this.inspSiteInfoList = [];
            getDetailList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    
                    // 复核状态
                    if(this.inspSiteInfoList[i].reviewState == 1){
                        this.inspSiteInfoList[i].reviewStateTxt = '未复核';
                    }else if(this.inspSiteInfoList[i].reviewState == 2){
                        this.inspSiteInfoList[i].reviewStateTxt = '复核中';
                    }else if(this.inspSiteInfoList[i].reviewState == 3){
                        this.inspSiteInfoList[i].reviewStateTxt = '复核完成';
                    }else if(this.inspSiteInfoList[i].reviewState == 4){
                        this.inspSiteInfoList[i].reviewStateTxt = '复核异常';
                    }else if(this.inspSiteInfoList[i].reviewState == 5){
                        this.inspSiteInfoList[i].reviewStateTxt = '手动结束';
                    }
                    // 复核结果类型
                    if(this.inspSiteInfoList[i].reviewDescType == 10){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '不可访问';
                    }else if(this.inspSiteInfoList[i].reviewDescType == 20){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '匹配不到上下文';
                    }else if(this.inspSiteInfoList[i].reviewDescType == 30){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '复核已整改';
                    }else if(this.inspSiteInfoList[i].reviewDescType == 40){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '白名单';
                    }else if(this.inspSiteInfoList[i].reviewDescType == 50){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '疑似未整改';
                    }else if(this.inspSiteInfoList[i].reviewDescType == 60){
                        this.inspSiteInfoList[i].reviewDescTypeTxt = '未知';
                    }
                    // 复核时间
                    if(!this.inspSiteInfoList[i].reviewTime){
                        this.inspSiteInfoList[i].reviewTime = '--';
                    }
                    // 上下文
                    if(this.inspSiteInfoList[i].sentence){
                        this.inspSiteInfoList[i].wordLeftPic = this.inspSiteInfoList[i].sentence.split(this.inspSiteInfoList[i].word)[0];
                        this.inspSiteInfoList[i].wordRightPic = this.inspSiteInfoList[i].sentence.split(this.inspSiteInfoList[i].word)[1];
                    }
                    // 本次整改状态
                    if(this.inspSiteInfoList[i].reviewResult == 1){
                        this.inspSiteInfoList[i].reviewResultTxt = '待整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 2){
                        this.inspSiteInfoList[i].reviewResultTxt = '已整改';
                    }else if(this.inspSiteInfoList[i].reviewResult == 3){
                        this.inspSiteInfoList[i].reviewResultTxt = '忽略';
                    }
                    // 来源
                    if(this.inspSiteInfoList[i].auditType == 0){
                        this.inspSiteInfoList[i].auditTypeTxt = '未审核';
                    }else if(this.inspSiteInfoList[i].auditType == 1){
                        this.inspSiteInfoList[i].auditTypeTxt = '人工审核';
                    }else if(this.inspSiteInfoList[i].auditType == 2){
                        this.inspSiteInfoList[i].auditTypeTxt = '机器自动审核';
                    }
                    
                    // 父页面信息
                    if(!response.rows[i].fromTitle){
                        if(response.rows[i].fromUrl){
                            response.rows[i].fromTitleTxt = response.rows[i].fromUrl;
                        }else{
                            response.rows[i].fromTitleTxt = '--';
                        }
                        response.rows[i].fromTitleTxt = response.rows[i].fromUrl;
                    }else{
                        response.rows[i].fromTitleTxt = response.rows[i].fromTitle;
                    }
                    
                }
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /**策略 */
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.DateArr){
                this.queryParams.firstFindTimeStart = this.DateArr[0];
                this.queryParams.firstFindTimeEnd = this.DateArr[1];
                if(this.queryParams.firstFindTimeStart){
                    this.queryParams.firstFindTimeStart = this.formatDate(this.queryParams.firstFindTimeStart) + ' 00:00:00';
                }
                if(this.queryParams.firstFindTimeEnd){
                    this.queryParams.firstFindTimeEnd = this.formatDate(this.queryParams.firstFindTimeEnd) + ' 23:59:59';
                }
            }
            if(this.DateArr2){
                this.queryParams.auditTimeStart = this.DateArr[0];
                this.queryParams.auditTimeEnd = this.DateArr[1];
                if(this.queryParams.auditTimeStart){
                    this.queryParams.auditTimeStart = this.formatDate(this.queryParams.auditTimeStart) + ' 00:00:00';
                }
                if(this.queryParams.auditTimeEnd){
                    this.queryParams.auditTimeEnd = this.formatDate(this.queryParams.auditTimeEnd) + ' 23:59:59';
                }
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.firstFindTimeStart = null; // 创建时间
            this.queryParams.firstFindTimeEnd = null; // 结束时间
            this.DateArr2 = [];
            this.queryParams.auditTimeStart = null; // 创建时间
            this.queryParams.auditTimeEnd = null; // 结束时间
            this.resetForm("queryForm");
            this.handleQuery();
        },

        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.firstFindTimeStart = null;
                this.queryParams.firstFindTimeEnd = null;
            }
        },
        sjrqChange2(val){
            console.log(val)
            if(val == null){
                this.DateArr2 = [];
                this.queryParams.auditTimeStart = null;
                this.queryParams.auditTimeEnd = null;
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


        // 返回上级
        goBack(){
            // this.$router.go(-1);
            let veiwArr = this.$store.state.tagsView.visitedViews;
            let path = this.$route.path;
            let view;
            for(let i = 0,len=veiwArr.length;i<len;i++){
                if(veiwArr[i].path == path){
                    view = veiwArr[i];
                }	
            }
            this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
                const latestView = visitedViews.slice(-1)[0];
                // this.$router.replace({ path: '/clu/configure'});
                if(this.type == 1){ // 父任务
                    this.$router.push({path:'/review/index'}) 
                }else if(this.type == 2){ // 子任务
                    this.$router.push({path:'/review/indexChildren'}) 
                }
                sessionStorage.removeItem('goInfoType')
                sessionStorage.removeItem('taskObj') // 主任务
                sessionStorage.removeItem('taskChildrenObj') // 子任务
                sessionStorage.removeItem('reviewStateVal') // 任务状态
                sessionStorage.removeItem('numType') // 详情tab
            })
        },
        // 跳转
        handleGo(row,type){
            let obj = {
                idStr: row.dataId,
                showState: row.showState
            }
            if(type == 30){ // 错误内容
                sessionStorage.setItem('reviewTaskObj',JSON.stringify(obj));
                this.$router.push({path:'/machine/Misspelling'});
            }else if(type == 40){ // 敏感信息
                sessionStorage.setItem('reviewTaskObj',JSON.stringify(obj));
                this.$router.push({path:'/machine/Missensitivity'});
            }else if(type == 50){ // 隐私泄露
                sessionStorage.setItem('reviewTaskObj',JSON.stringify(obj));
                this.$router.push({path:'/machine/PrivacyBreach'});
            }else if(type == 20){ // 错链
                sessionStorage.setItem('reviewTaskIdStr', row.dataId);
                this.$router.push({path:'/machine/errorsPage'});
            }else if(type == 70){ // 外链
                sessionStorage.setItem('reviewTaskIdStr', row.dataId);
                this.$router.push({path:'/machine/externalLinks'});
            }
            
        },
        // 整改
        handleEnd(row,type){
            this.form2.idStr = row.dataId;
            this.form2.reviewResult = row.reviewResult;
            this.zgType = type;
            if(type == 30){ // 错误内容
                this.title = '错误内容整改';
                if(row.showState == 1 || row.showState == 2){
                    this.form2.ignoreFlag = false;
                }else{
                    this.form2.ignoreFlag = true;
                }
            }else if(type == 40){ // 敏感信息
                this.title = '敏感信息整改';
            }else if(type == 50){ // 隐私泄露
                this.title = '隐私泄露整改';
            }
            // else if(type == 20){ // 错链
            //     this.title = '错链信息整改';
            // }
            else if(type == 70){ // 外链
                this.title = '外链信息整改';
            }
            this.open2 = true;
            
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
        /** 提交按钮 */
        submitForm2() {
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    if(this.zgType == 30){ // 错误内容
                        this.form2.wordType = 1;
                        cwEditReviewResult(this.form2).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open2 = false;
                            this.getList();
                        });
                    }else if(this.zgType == 40){ // 敏感信息
                        this.form2.wordType = 2;
                        mgEditReviewResult(this.form2).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open2 = false;
                            this.getList();
                        });
                    }else if(this.zgType == 50){ // 隐私泄露
                        this.form2.wordType = 3;
                        ysEditReviewResult(this.form2).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open2 = false;
                            this.getList();
                        });
                    }
                    // else if(this.zgType == 20){ // 错链信息
                    //     clEditReviewResult(this.form2).then(response => {
                    //         this.$modal.msgSuccess("修改成功");
                    //         this.open2 = false;
                    //         this.getList();
                    //     });
                    // }
                    else if(this.zgType == 70){ // 外链信息
                        wlEditReviewResult(this.form2).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open2 = false;
                            this.getList();
                        });
                    }
                    
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
        color: #9ACD32;
        border: 1px solid #9ACD32;
        padding: 1px 8px;
        border-radius: 10px;
        background: rgba(188, 238, 104, 0.2)
    }
    .dzz{
        color: #1890ff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .dzz:hover {
        cursor: pointer;
        // color: #1890ff;
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

    .spClass{
        display: block;
        margin-bottom: 5px;
    }
    .dxDiv{
        position: absolute;
        top: 25px;
        left: 24px;
        font-size: 13px;
        
    }
    .dxDivBox,.dxDivBox2,.dxDivBox3,.dxDivBox4,.dxDivBox5,.dxDivBox6{
        display: flex;
        align-items: center;
        position: absolute;
        top: 60px;
        left: 25px;
        font-size: 13px;
    }
    .dxDivBox2{
        top: 120px;
    }
    .dxDivBox3{
        top: 182px;
    }
    .dxDivBox4{
        top: 245px;
    }
    .dxDivBox5{
        top: 305px;
    }
    .dxDivBox6{
        top: 365px;
    }
    .khxx{
        color: #1890ff;
        background: rgba(24,144,255,.2);
        padding: 2px;
        border-radius: 3px;
        font-size: 12px;
        padding-left: 6px;
        cursor: pointer;
        span{
            display: block;
            display: -webkit-box; /* 设置为WebKit内核的弹性盒子模型 */
            -webkit-box-orient: vertical; /* 垂直排列 */
            -webkit-line-clamp: 1; /* 限制显示两行 */
            overflow: hidden; /* 隐藏超出范围的内容 */
            text-overflow: ellipsis; /* 使用省略号 */
        }
    }
</style>
<style scoped>
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    /deep/ .el-dialog:not(.is-fullscreen) {
        margin-top: 10vh !important;
        max-height: 75vh!important;
    }
    /deep/ .el-dialog__body{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    /deep/.el-form-item__content{
        /* z-index: 20; */
    }
</style>