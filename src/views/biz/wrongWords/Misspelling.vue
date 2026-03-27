<template>
    <div class="app-container">
        <!-- 表格全屏 -->
        <div class="bigWrapBox" v-if="upHeightType">
            <!-- 待审核 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini"  :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger"  plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                </el-col>
                <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange"></right-toolbar> -->
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 已审核正确 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '2'">
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 已审核错误、词库修复 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '3' || activeName == '5'">
                <!-- <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                </el-col>
                <el-col :span="1.5">
                    <!-- <el-button type="primary" plain icon="el-icon-top" size="mini"  @click="handleFile(2)" >整改导入</el-button> -->
                </el-col>
                <upHeight @queryTable="getList" @upHeightOld="upHeightOldChange"></upHeight>
            </el-row>
            <!-- 存疑 -->
            <el-row :gutter="10" class="mb8" v-if="activeName == '99'">
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
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
                    <!-- <el-button type="primary" plain icon="el-icon-top" size="mini"  @click="handleFile(2)" >整改导入</el-button> -->
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
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
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
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateTxt" label="操作类型" width="100" align="center" v-if="activeName == '2'"></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
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
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    <!-- 待审核 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160" fixed="right" v-if="activeName == '1'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                        </template>
                    </el-table-column>
                    <!-- 已审核正确 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right" v-if="activeName == '2'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate2(scope.row,scope.$index)" >整改</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" >编辑</el-button>
                        </template>
                    </el-table-column>
                    <!-- 已审核错误、词库修复 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right" v-if="activeName == '3' || activeName == '5'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                    <!-- 存疑 -->
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right" v-if="activeName == '99'">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" style="marginLeft:0">误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination
                v-show="total > 0 && roughCountState == false"
                :total="total"
                :page-sizes="[100, 200, 500, 1000]"
                :page-size="100"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            />
            <pagination
                v-show="total > 0 && roughCountState == true"
                :page-sizes="[100, 200, 500, 1000]"
                :page-size="100"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
                :total="total > totalNum ? totalNum : total"
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
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:310px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
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
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.siteCode = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="" prop="searchDateKey">
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
                            style="width:282px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:310px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:310px">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="dataRangeType">
                        <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                            <el-option
                                v-for="item in dataRangeTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:730px" :disabled="queryParams.dataRangeType == 1">
                            <el-option
                            v-for="item in pcList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
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
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="资源类别" prop="checkUrlType">
                        <el-select v-model="queryParams.checkUrlType" placeholder="请选择资源类别" style="width:310px" clearable >
                            <el-option
                                v-for="item in checkUrlTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核角色" prop="auditType">
                        <el-select v-model="queryParams.auditType" placeholder="请选择审核角色" style="width:310px" clearable >
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="zkTypeChild">
                        <el-select v-model="queryParams.zkTypeChild" filterable placeholder="请选择标签分类" style="width:310px" clearable>
                            <el-option-group
                                v-for="group in zkTypeChildList"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件格式" prop="fileSuffix">
                        <el-input
                            v-model="queryParams.fileSuffix"
                            placeholder="请输入附件格式"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                            @clear="queryParams.fileSuffix=null"
                        />
                    </el-form-item>
                    <el-form-item label="依据" prop="accId">
                        <el-input v-model="queryParams.accId" placeholder="请输入依据ID" clearable style="width:310px" @keyup.enter.native="handleQuery"  @clear="queryParams.accId=null" />
                    </el-form-item>
                    <el-form-item label="AI标记" prop="showStateAi">
                        <el-select v-model="queryParams.showStateAiIn" clearable multiple collapse-tags placeholder="请选择AI标记" style="width:310px">
                            <el-option
                                v-for="item in showStateAiList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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

                        
                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '1'">
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
                    <!-- <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                    </el-col>
                    <!-- <el-col :span="1.5">
                        <el-button
                            type="primary"
                            plain
                            icon="el-icon-bottom"
                            size="mini"
                            @click="handleDown"
                            
                        >模板下载</el-button>
                    </el-col> -->
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum" v-if="roughCountState == false">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <p class="numnum" v-if="roughCountState == true">数据约<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(totalNum)}}</span>+条</p>
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
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                    
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
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
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>
                    
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
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
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" >误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" >编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                            <!-- <el-tooltip class="item" effect="dark" content="显示" placement="top">
                                <i class="el-icon-monitor" style="cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,2)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="误报" placement="top">
                                <i class="el-icon-mouse" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,4)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="更多" placement="top">
                                <el-dropdown trigger="click" style="marginLeft:10px;cursor: pointer;font-size:15px" @command="handleUpdate">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="scope.row"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0 && roughCountState == false"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
                <pagination
                    v-show="total > 0 && roughCountState == true"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                    :total="total > totalNum ? totalNum : total"
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
                            style="width:310px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
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
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.siteCode = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="" prop="searchDateKey">
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
                            style="width:282px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:310px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:310px">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="dataRangeType">
                        <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                            <el-option
                                v-for="item in dataRangeTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:730px" :disabled="queryParams.dataRangeType == 1">
                            <el-option
                            v-for="item in pcList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
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
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="资源类别" prop="checkUrlType">
                        <el-select v-model="queryParams.checkUrlType" placeholder="请选择资源类别" style="width:310px" clearable >
                            <el-option
                                v-for="item in checkUrlTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核角色" prop="auditType">
                        <el-select v-model="queryParams.auditType" placeholder="请选择审核角色" style="width:310px" clearable >
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="zkTypeChild">
                        <el-select v-model="queryParams.zkTypeChild" filterable placeholder="请选择标签分类" style="width:310px" clearable>
                            <el-option-group
                                v-for="group in zkTypeChildList"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作类型" prop="showState">
                        <el-select v-model="queryParams.showState" placeholder="请选择操作类型" style="width:310px" clearable >
                            <el-option
                                v-for="item in czList2"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件格式" prop="fileSuffix">
                        <el-input
                            v-model="queryParams.fileSuffix"
                            placeholder="请输入附件格式"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                            @clear="queryParams.fileSuffix=null"
                        />
                    </el-form-item>
                    <el-form-item label="依据" prop="accId">
                        <el-input v-model="queryParams.accId" placeholder="请输入依据ID" clearable style="width:310px" @keyup.enter.native="handleQuery"  @clear="queryParams.accId=null" />
                    </el-form-item>
                    <el-form-item label="AI标记" prop="showStateAi">
                        <el-select v-model="queryParams.showStateAiIn" clearable multiple collapse-tags placeholder="请选择AI标记" style="width:310px">
                            <el-option
                                v-for="item in showStateAiList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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

                        
                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '2'">
                    <!-- <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-mouse" size="mini" :disabled="multiple" @click="handUpdateAll(4)" >批量误报</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum" v-if="roughCountState == false">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <p class="numnum" v-if="roughCountState == true">数据约<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(totalNum)}}</span>+条</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    v-if="activeName == '2'"
                    height="500"
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
                            <span>{{scope.row.suggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="所在文章" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="position" label="文章位置" width="160" align="center"></el-table-column> -->
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateTxt" label="操作类型" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
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
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
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
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)" >编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                            <!-- <el-tooltip class="item" effect="dark" content="整改" placement="top">
                                <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="误报" placement="top">
                                <i class="el-icon-mouse" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,4)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="更多" placement="top">
                                <el-dropdown trigger="click" style="marginLeft:10px;cursor: pointer;font-size:15px" @command="handleUpdate">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="scope.row"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0 && roughCountState == false"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
                <pagination
                    v-show="total > 0 && roughCountState == true"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                    :total="total > totalNum ? totalNum : total"
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
                            style="width:310px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
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
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.siteCode = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="" prop="searchDateKey">
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
                            style="width:282px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:310px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:310px">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="dataRangeType">
                        <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                            <el-option
                                v-for="item in dataRangeTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:730px" :disabled="queryParams.dataRangeType == 1">
                            <el-option
                            v-for="item in pcList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
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
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="资源类别" prop="checkUrlType">
                        <el-select v-model="queryParams.checkUrlType" placeholder="请选择资源类别" style="width:310px" clearable >
                            <el-option
                                v-for="item in checkUrlTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核角色" prop="auditType">
                        <el-select v-model="queryParams.auditType" placeholder="请选择审核角色" style="width:310px" clearable >
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="zkTypeChild">
                        <el-select v-model="queryParams.zkTypeChild" filterable placeholder="请选择标签分类" style="width:310px" clearable>
                            <el-option-group
                                v-for="group in zkTypeChildList"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件格式" prop="fileSuffix">
                        <el-input
                            v-model="queryParams.fileSuffix"
                            placeholder="请输入附件格式"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                            @clear="queryParams.fileSuffix=null"
                        />
                    </el-form-item>
                    <el-form-item label="依据" prop="accId">
                        <el-input v-model="queryParams.accId" placeholder="请输入依据ID" clearable style="width:310px" @keyup.enter.native="handleQuery"  @clear="queryParams.accId=null" />
                    </el-form-item>
                    <el-form-item label="AI标记" prop="showStateAi">
                        <el-select v-model="queryParams.showStateAiIn" clearable multiple collapse-tags placeholder="请选择AI标记" style="width:310px">
                            <el-option
                                v-for="item in showStateAiList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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

                        
                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '3'">
                    <!-- <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum" v-if="roughCountState == false">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <p class="numnum" v-if="roughCountState == true">数据约<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(totalNum)}}</span>+条</p>
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
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
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
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
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
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
                    <el-table-column prop="siteName" label="父页面信息" width="200"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
                    <!-- <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column> -->
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                            <!-- <el-tooltip class="item" effect="dark" content="显示" placement="top">
                                <i class="el-icon-monitor" style="cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,2)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="更多" placement="top">
                                <el-dropdown trigger="click" style="marginLeft:10px;cursor: pointer;font-size:15px" @command="handleUpdate">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="scope.row"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0 && roughCountState == false"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
                <pagination
                    v-show="total > 0 && roughCountState == true"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                    :total="total > totalNum ? totalNum : total"
                />
            </el-tab-pane>
            <!-- 存疑 -->
            <el-tab-pane label="存疑" name="99">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                    v-if="activeName == '99'"
                >
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:310px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
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
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.siteCode = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="" prop="searchDateKey">
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
                            style="width:282px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:310px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:310px">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="dataRangeType">
                        <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                            <el-option
                                v-for="item in dataRangeTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:730px" :disabled="queryParams.dataRangeType == 1">
                            <el-option
                            v-for="item in pcList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
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
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="资源类别" prop="checkUrlType">
                        <el-select v-model="queryParams.checkUrlType" placeholder="请选择资源类别" style="width:310px" clearable >
                            <el-option
                                v-for="item in checkUrlTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核角色" prop="auditType">
                        <el-select v-model="queryParams.auditType" placeholder="请选择审核角色" style="width:310px" clearable >
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="zkTypeChild">
                        <el-select v-model="queryParams.zkTypeChild" filterable placeholder="请选择标签分类" style="width:310px" clearable>
                            <el-option-group
                                v-for="group in zkTypeChildList"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件格式" prop="fileSuffix">
                        <el-input
                            v-model="queryParams.fileSuffix"
                            placeholder="请输入附件格式"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                            @clear="queryParams.fileSuffix=null"
                        />
                    </el-form-item>
                    <el-form-item label="依据" prop="accId">
                        <el-input v-model="queryParams.accId" placeholder="请输入依据ID" clearable style="width:310px" @keyup.enter.native="handleQuery"  @clear="queryParams.accId=null" />
                    </el-form-item>
                    <el-form-item label="AI标记" prop="showStateAi">
                        <el-select v-model="queryParams.showStateAiIn" clearable multiple collapse-tags placeholder="请选择AI标记" style="width:310px">
                            <el-option
                                v-for="item in showStateAiList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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
                        
                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '99'">
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
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
                        <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum" v-if="roughCountState == false">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <p class="numnum" v-if="roughCountState == true">数据约<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(totalNum)}}</span>+条</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    row-key="idStr"
                    v-if="activeName == '99'"
                    height="500"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
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
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
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
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>
                    
                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
                    <el-table-column prop="siteName" label="父页面信息" width="200"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
                    <!-- <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column> -->
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-mouse" @click="handleUpdate(scope.row,4,scope.$index)" style="marginLeft:0">误报</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                            <!-- <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" >存疑</el-button> -->
                            <!-- <el-tooltip class="item" effect="dark" content="显示" placement="top">
                                <i class="el-icon-monitor" style="cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,2)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="更多" placement="top">
                                <el-dropdown trigger="click" style="marginLeft:10px;cursor: pointer;font-size:15px" @command="handleUpdate">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="scope.row"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0 && roughCountState == false"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
                <pagination
                    v-show="total > 0 && roughCountState == true"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                    :total="total > totalNum ? totalNum : total"
                />
            </el-tab-pane>
            <!-- 词库修复 -->
            <el-tab-pane label="词库修复" name="5">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                    v-if="activeName == '5'"
                >
                    <el-form-item label="主管单位" prop="">
                        <!-- <treeselect 
                            v-model="queryParams.treeInfo.psCode" 
                            :options="inspSiteTreeOptions" 
                            :normalizer="normalizer" 
                            @select="selectParentSite"
                            style="width:310px"
                            :load-options="loadOptions"
                            placeholder="请选择父级标识码" /> -->
                            <el-autocomplete
                            v-model="queryParams.treeInfo.psCode"
                            :fetch-suggestions="querySearchAsync2"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany2"
                            @clear="() => { queryParams.treeInfo.psCode = null; exportSiteName = null }"
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
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容"
                            clearable
                            style="width:310px"
                            @select="handleSelectCompany"
                            @clear="() => { queryParams.siteCode = null; exportSiteName_ = null }"
                        ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="错敏词" prop="wordLike">
                        <el-input
                            v-model="queryParams.wordLike"
                            placeholder="请输入错敏词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="suggestLike">
                        <el-input
                            v-model="queryParams.suggestLike"
                            placeholder="请输入推荐词"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="上下文" prop="sentenceLike">
                        <el-input
                            v-model="queryParams.sentenceLike"
                            placeholder="请输入上下文"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <!-- <el-form-item label="" prop="searchDateKey">
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
                            style="width:282px"
                            >
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="问题级别" prop="severity">
                        <el-select v-model="queryParams.severity" clearable placeholder="请选择问题级别" style="width:310px">
                            <el-option
                                v-for="item in wtjbList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题类型" prop="">
                        <el-select v-model="queryParams.typeIn" clearable multiple collapse-tags placeholder="请选择问题类型" style="width:310px">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult">
                        <el-select v-model="queryParams.reviewResult" clearable placeholder="请选择整改状态" style="width:310px">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据范围" prop="dataRangeType">
                        <el-select v-model="queryParams.dataRangeType" @change="dataRangeTypeChange" placeholder="请选择数据范围" style="width:310px">
                            <el-option
                                v-for="item in dataRangeTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单批次" prop="">
                        <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:730px" :disabled="queryParams.dataRangeType == 1">
                            <el-option
                            v-for="item in pcList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链接位置" prop="linkLocation">
                        <el-select v-model="queryParams.linkLocation" clearable placeholder="请选择链接位置" style="width:310px">
                            <el-option
                                v-for="item in ljwzList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="pid">
                        <el-input
                            v-model="queryParams.pid"
                            placeholder="请输入任务ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
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
                            style="width:300px"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="数据ID" prop="idStr">
                        <el-input
                            v-model="queryParams.idStr"
                            placeholder="请输入ID"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="资源类别" prop="checkUrlType">
                        <el-select v-model="queryParams.checkUrlType" placeholder="请选择资源类别" style="width:310px" clearable >
                            <el-option
                                v-for="item in checkUrlTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核角色" prop="auditType">
                        <el-select v-model="queryParams.auditType" placeholder="请选择审核角色" style="width:310px" clearable >
                            <el-option
                                v-for="item in auditTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签分类" prop="zkTypeChild">
                        <el-select v-model="queryParams.zkTypeChild" filterable placeholder="请选择标签分类" style="width:310px" clearable>
                            <el-option-group
                                v-for="group in zkTypeChildList"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="附件格式" prop="fileSuffix">
                        <el-input
                            v-model="queryParams.fileSuffix"
                            placeholder="请输入附件格式"
                            clearable
                            style="width:310px"
                            @keyup.enter.native="handleQuery"
                            @clear="queryParams.fileSuffix=null"
                        />
                    </el-form-item>
                    <el-form-item label="依据" prop="accId">
                        <el-input v-model="queryParams.accId" placeholder="请输入依据ID" clearable style="width:310px" @keyup.enter.native="handleQuery"  @clear="queryParams.accId=null" />
                    </el-form-item>
                    <el-form-item label="AI标记" prop="showStateAi">
                        <el-select v-model="queryParams.showStateAiIn" clearable multiple collapse-tags placeholder="请选择AI标记" style="width:310px">
                            <el-option
                                v-for="item in showStateAiList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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

                        
                    <el-form-item style="marginLeft:16px">
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8" v-if="activeName == '5'">
                    <!-- <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                    </el-col> -->
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-monitor" size="mini" :disabled="multiple" @click="handUpdateAll(2)" >批量显示</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-warning-outline" size="mini" :disabled="multiple" @click="handUpdateAll(99)" >批量存疑</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(1)" >审核导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <!-- <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >整改导入</el-button> -->
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" @upHeight="upHeightChange" :fdsx="fdsx"></right-toolbar>
                </el-row>

                <p class="numnum" v-if="roughCountState == false">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
                <p class="numnum" v-if="roughCountState == true">数据约<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(totalNum)}}</span>+条</p>
                <el-table
                    v-loading="loading"
                    :data="inspSiteInfoList"
                    @selection-change="handleSelectionChange"
                    @sort-change="sortChange"
                    row-key="idStr"
                    v-if="activeName == '5'"
                    height="500"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="index" label="序号" width="60" align="center" fixed></el-table-column>
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
                    <el-table-column prop="illegalRemarksText" label="问题备注" width="200" align="">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.illegalRemarksText" placement="top" v-if="scope.row.illegalRemarksText.length >= 25">
                                <div class="two-line-text" >{{scope.row.illegalRemarksText}}</div>
                            </el-tooltip>
                            <div v-else>{{scope.row.illegalRemarksText}}</div>
                        </template>
                    </el-table-column>                     
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.checkUrlType != 'pic'">
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                            <div v-if="scope.row.checkUrlType == 'pic'">
                                <!-- 划框 -->
                                <el-popover placement="bottom" width="400" v-model="scope.row.sxwType" >
                                    <span class="sxwClass">
                                        <span>{{scope.row.oldwordLeft}}</span>
                                        <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                        <span>{{scope.row.oldwordRight}}</span>
                                    </span>
                                </el-popover>
                                <!-- 列表 -->
                                <span v-if="scope.row.sentence" class="sxwClass" @mouseover="scope.row.sxwType=true" @mouseout="scope.row.sxwType=false">
                                    <span>{{scope.row.wordLeftPic}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                    <span>{{scope.row.wordRightPic}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
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
                    <el-table-column prop="filePath" label="压缩包子文件路径" width="200" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="typeText" label="问题类型" width="160"></el-table-column>
                    <el-table-column prop="zkTypeChildText" label="标签分类" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="severityText" label="问题级别" align="center">
                        <template slot-scope="scope">
                            <span class="wtjb"><span class="yd" :style="{background: scope.row.severityBgColor}"></span>{{ scope.row.severityText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="checkUrlTypeTxt" label="资源类别" align="center"></el-table-column>
                    <el-table-column prop="sentence" label="图片" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.fileObsPath">
                                <!-- <viewer>
                                    <img :src="scope.row.fileObsPath" alt="" class="slt">
                                </viewer> -->
                                <img :src="scope.row.fileObsPath" alt="" class="slt" @click="fdImg(scope.row)">
                            </div>
                            <div v-if="!scope.row.fileObsPath">--</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="100" align="center" ></el-table-column>
                    <el-table-column prop="reviewStateTxt" label="复核状态" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDesc" label="复核结果" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewDescTypeTxt" label="复核结果类型" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="linkLocationText" label="链接位置" width="100" align="center"></el-table-column>
                    <el-table-column prop="siteName" label="父页面信息" width="200"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" show-overflow-tooltip >
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="score" label="纠错结果得分" width="100"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核角色" width="120"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220"></el-table-column>
                    <el-table-column prop="accId" label="依据" width="220" align="">
                        <template slot-scope="scope">
                            <span class="dz" @click="accIdInfo(scope.row.accId)">{{ scope.row.accId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showStateAiText" label="AI标记" width="120"></el-table-column>
                    <!-- <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column> -->
                    <el-table-column prop="pubTime" label="发布时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="首次发现时间" width="180"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="rectifyTime" label="整改时间" width="180"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-monitor" @click="handleUpdate(scope.row,2,scope.$index)" >显示</el-button>
                            <el-button size="mini" type="text" icon="el-icon-bell" @click="handleUpdate(scope.row,3,scope.$index)" >预警</el-button>
                            <el-button size="mini" type="text" icon="el-icon-warning-outline" @click="handleUpdate(scope.row,99,scope.$index)" style="marginLeft:0">存疑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row,'',scope.$index)">编辑</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)" >删除</el-button> -->
                            <!-- <el-tooltip class="item" effect="dark" content="显示" placement="top">
                                <i class="el-icon-monitor" style="cursor: pointer;font-size:15px" @click="handleUpdate(scope.row,2)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="更多" placement="top">
                                <el-dropdown trigger="click" style="marginLeft:10px;cursor: pointer;font-size:15px" @command="handleUpdate">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="scope.row"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-tooltip> -->
                            
                        </template>
                    </el-table-column>
                </el-table>

                <pagination
                    v-show="total > 0 && roughCountState == false"
                    :total="total"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                />
                <pagination
                    v-show="total > 0 && roughCountState == true"
                    :page-sizes="[100, 200, 500, 1000]"
                    :page-size="100"
                    :page.sync="queryParams.pgNum"
                    :limit.sync="queryParams.pgSize"
                    @pagination="getList"
                    :total="total > totalNum ? totalNum : total"
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
                    <el-form-item label="操作" prop="showState" style="width:93%">
                        <!-- <el-select v-model="form.showState" clearable placeholder="请选择操作" style="width:90%" >
                            <el-option
                                v-for="item in czList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select> -->
                        <el-radio-group v-model="form.showState">
                            <el-radio :label="2">仅显示</el-radio>
                            <el-radio :label="3">显示并预警</el-radio>
                            <el-radio :label="4">误报</el-radio>
                            <el-radio :label="99">存疑</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="整改状态" prop="reviewResult" style="width:48%">
                        <el-select v-model="form.reviewResult" clearable placeholder="请选择整改状态" style="width:90%">
                            <el-option
                                v-for="item in zgztList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
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
                    
                    <el-form-item label="错敏词" prop="word" style="width:93%">
                        <el-input v-model="form.word" placeholder="请输入错敏词" />
                    </el-form-item>
                    <el-form-item label="推荐词" prop="" style="width:93%">
                        <el-input v-model="form.suggest" placeholder="请输入推荐词"/>
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
                        <el-radio :label="3">无需整改</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm2">确 定</el-button>
                <el-button @click="cancel2">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 导出 -->
        <el-dialog title="导出数据" :visible.sync="open3" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form3" :model="form3" :rules="rules3" label-width="120px">
                <el-form-item label="导出方式" prop="type">
                    <el-radio-group v-model="form3.type">
                        <el-radio :label="1">小批量（最多3000条）</el-radio>
                        <el-radio :label="2">大批量</el-radio>
                    </el-radio-group>
                </el-form-item>
                <span class="dcts">注：根据错敏词、推荐词模糊查询，大批量最多可导出9万条数据</span>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="cancel3">取 消</el-button>
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

        <!-- 批量显示、预警 -->
        <el-dialog title="操作类型" :visible.sync="open4" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form4" :model="form4" :rules="rules4" label-width="120px">
                <el-form-item label="操作类型" prop="showState">
                    <el-radio-group v-model="form4.showState">
                        <el-radio :label="2">批量显示</el-radio>
                        <el-radio :label="3">批量预警</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm4">确 定</el-button>
                <el-button @click="cancel4">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 复核 -->
        <Template :getOpen="OpenS" :getIdStr="InfoStr" @openS= "IdStrOpenS" v-if="OpenS" />
        <!-- 图片放大 -->
        <imgTemplate :getImgOpen="ImgOpenS" :getImgIdObj="ImgInfoObj" @ImgOpenS= "ImgIdStrOpenS" v-if="ImgOpenS" />
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
    downloadExcelTpl,
    getErrorType,
    getRepairWordDetail
} from "@/api/biz/wrongWords";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import { inspOrderInfoQueryList } from "@/api/biz/inspOrderInfo";
import { inspOrderBatchQueryList,listInspOrderBatch } from "@/api/biz/inspOrderBatch";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";

import { insertInspExcelTaskMaxBatch } from "@/api/biz/export";

import Template from './template'
import imgTemplate from '../../imgTemplate'





export default {
    name: "InspSiteInfo",
    components: {
        Treeselect,
        Template,
        imgTemplate
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
            roughCountState: false,
            totalNum: null,
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
                wordType: 1,
                orderTypes: [{ code: 1, name: 'ct' }], // 表格排序

                siteCode: null, // 网站标识码
                wordLike: null, // 错敏词
                suggestLike: null, // 推荐词
                sentenceLike: null, // 上下文
                // batchInfo: {
                //     orderId: null,
                //     batchId: null,
                // },
                batchInfo: null,
                showStateIn: [1],
                reviewResult: null, // 整改状态
                typeIn: [], // 问题类型
                linkLocation: null,
                pid: null,
                checkUrlType: null,
                idStr: null,
                batchId: null,
                dataRangeType: 0,
                zkTypeChild: null,
                showState: null,

                roughCountState: false,
                totalNum: null,
                fileSuffix: null, // 附件格式
                ignoreFlag: null,
                showStateAiIn: [], // AI标记
                reviewState: null, // 复核状态
                reviewDescType: null, // 复核结果类型

            },
            wtlxTxt: null,
            orderId: null,
            batchId: null,

            showStateAiIn: [],
            /**下拉菜单数据 */
            // 标签分类
            zkTypeChildList: [],
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
                { label: '待审核', val: 1 },
                { label: '仅显示', val: 2 },
                { label: '显示并预警', val: 3 },
                { label: '误报', val:  4 },
                { label: '存疑', val:  99 },
            ],
            czList2: [ 
                { label: '仅显示', val: 2 },
                { label: '显示并预警', val: 3 },
            ],
            // 整改状态
            zgztList: [
                { label: '待整改', val: 1 },
                { label: '已整改', val: 2 },
                { label: '无需整改', val: 3 },
            ],

            // 资源类别
            checkUrlTypeList: [
                { label: '文本', val: 'word' },
                { label: '图片', val: 'pic' },
                { label: '视频', val: 'video' },
                { label: '音频', val: 'audio' },
                { label: '附件', val: 'file' },

            ],
            // 审核角色
            auditTypeList: [
                { label: '未审核', val: 0 },
                { label: '人工审核', val: 1 },
                { label: '智能AI', val: 2 },

            ],
            // AI标记
            showStateAiList: [
                { label: '显示(AI)', val: 2 },
                { label: '显示并预警(AI)', val: 3 },
                { label: '误报(AI)', val: 4 },
                { label: '词库修复(AI)', val: 5 },
                { label: '存疑(AI)', val: 99 },
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

            
            // 提交表单
            form: {},
            rules: {
                word: [{ required: true, message: '请输入错敏词', trigger: 'blur' }],
                suggest: [{ required: true, message: '请输入推荐词', trigger: 'blur' }],
                severity: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
                showState: [{ required: true, message: '请选择操作', trigger: 'change' }],
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],

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
            open3: false, 
            form3: {
                menuType: 0
            },
            rules3: {
                reviewResult: [{ required: true, message: '请选择整改状态', trigger: 'change' }],
            },

            restaurants: [],
            timeout:  null,

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

            pcList: [],
            // 数据范围
            dataRangeTypeList: [
                { label: '全部数据', val: 0 },
                { label: '仅日常数据', val: 1 }

            ],

            // 批量显示、预警
            open4: false, 
            form4: {
                showState: 2
            },
            rules4: {
                reviewResult: [{ required: true, message: '请选择批量操作', trigger: 'change' }],
            },

            // 依据弹窗
            OpenS: false,
            InfoStr: null,

            // 图片放大
            ImgOpenS: false,
            ImgInfoObj: null,


            exportSiteName: null,  // 导出-主管单位名称
            exportSiteName_: null,  // 导出-网站名称（主办单位）

            
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('reviewTaskObj')
        next();

    },
    created() {
        this.getTreeselect();
        this.getWtlxList(1); // 问题类型
        this.getErrorTypeFn(); // 标签分类
        if(sessionStorage.getItem('reviewTaskObj')){
            let obj = JSON.parse(sessionStorage.getItem('reviewTaskObj'));
            this.queryParams.idStr = obj.idStr;
            if(obj.showState == 1 || !obj.showState){ // 待审核
                this.activeName = '1';
                this.queryParams.showStateIn = [1];
                this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]; // 表格排序
                this.queryParams.ignoreFlag = false;
            }else if(obj.showState == 2 || obj.showState == 3){ // 已审核正确
                this.activeName = '2';
                this.queryParams.showStateIn = [2,3];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = false;
            }else if(obj.showState == 4){ // 已审核错误
                this.activeName = '3';
                this.queryParams.showStateIn = [4];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
            }else if(obj.showState == 99){ // 存疑
                this.activeName = '99';
                this.queryParams.showStateIn = [99];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
            }else if(obj.showState == 5){ // 词库修复
                this.activeName = '5';
                this.queryParams.showStateIn = [5];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
            }
            this.getList();
        }
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
                // this.inspSiteTreeOptions = this.handleree(
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
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            listInspSiteInfo(this.queryParams).then(response => {
                // let arrDate = response.data;
                for(var i in response.rows){
                    response.rows[i].index = parseInt(i)+1;
                    // response.rows[i].illegalRemarksText = '黄河出版传媒集团有限公司党委书记、总经理、总编啊是'
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
                        response.rows[i].reviewResultTxt = '无需整改';
                    }
                    /**图片 */
                    if(response.rows[i].picSentence){
                        // 滑入框上下文
                        response.rows[i].oldwordLeft = response.rows[i].sentence.substring(0,response.rows[i].position);
                        response.rows[i].oldwordRight = response.rows[i].sentence.substring(response.rows[i].positionEnd,response.rows[i].sentence.length);
                        // 列表上下文
                        response.rows[i].wordLeftPic = response.rows[i].picSentence.split(response.rows[i].word)[0];
                        response.rows[i].wordRightPic = response.rows[i].picSentence.split(response.rows[i].word)[1];
                    }
                    /**文本 */
                    response.rows[i].wordLeft = response.rows[i].sentence.split(response.rows[i].word)[0];
                    response.rows[i].wordRight = response.rows[i].sentence.split(response.rows[i].word)[1];

                    // 所在文章
                    if(response.rows[i].title == null || response.rows[i].title == ''){
                        if(response.rows[i].url == null){
                            response.rows[i].title = '--';
                        }else{
                            response.rows[i].title = response.rows[i].url;
                        }
                    }
                    // 上下文划框显示状态
                    response.rows[i].sxwType = false;
                    // 资源类别
                    for(var j in this.checkUrlTypeList){
                        if(response.rows[i].checkUrlType == this.checkUrlTypeList[j].val){
                            response.rows[i].checkUrlTypeTxt = this.checkUrlTypeList[j].label;
                        }
                    }
                    // 审核角色
                    for(var j in this.auditTypeList){
                        if(response.rows[i].auditType == this.auditTypeList[j].val){
                            response.rows[i].auditTypeTxt = this.auditTypeList[j].label;
                        }
                    }
                    // 标签分类
                    if(response.rows[i].zkTypeChildText == '' || response.rows[i].zkTypeChildText == null){
                        response.rows[i].zkTypeChildText = '--'
                    }
                    // 操作
                    for(var j in this.czList){
                        if(response.rows[i].showState == this.czList[j].val){
                            response.rows[i].showStateTxt = this.czList[j].label;
                        }
                    }
                    // 问题备注
                    if(response.rows[i].illegalRemarksText == '' || response.rows[i].illegalRemarksText == null){
                        response.rows[i].illegalRemarksText = '--'
                    }
                    // 压缩包子路径
                    if(!response.rows[i].filePath){
                        response.rows[i].filePath = '--';
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

                    // 复核状态
                    if(response.rows[i].reviewState == 1){
                        response.rows[i].reviewStateTxt = '未复核';
                    }else if(response.rows[i].reviewState == 2){
                        response.rows[i].reviewStateTxt = '复核中';
                    }else if(response.rows[i].reviewState == 3){
                        response.rows[i].reviewStateTxt = '复核完成';
                    }else if(response.rows[i].reviewState == 4){
                        response.rows[i].reviewStateTxt = '复核异常';
                    }else if(response.rows[i].reviewState == 5){
                        response.rows[i].reviewStateTxt = '手动结束';
                    }
                    // 复核结果类型
                    if(response.rows[i].reviewDescType == 10){
                        response.rows[i].reviewDescTypeTxt = '不可访问';
                    }else if(response.rows[i].reviewDescType == 20){
                        response.rows[i].reviewDescTypeTxt = '匹配不到上下文';
                    }else if(response.rows[i].reviewDescType == 30){
                        response.rows[i].reviewDescTypeTxt = '复核已整改';
                    }else if(response.rows[i].reviewDescType == 40){
                        response.rows[i].reviewDescTypeTxt = '白名单';
                    }else if(response.rows[i].reviewDescType == 50){
                        response.rows[i].reviewDescTypeTxt = '疑似未整改';
                    }else if(response.rows[i].reviewDescType == 60){
                        response.rows[i].reviewDescTypeTxt = '未知';
                    }else{
                        response.rows[i].reviewDescTypeTxt = '--';
                    }

                }
                this.inspSiteInfoList = response.rows;
                this.total = response.total;

                this.roughCountState = response.roughCountState;
                this.queryParams.roughCountState = response.roughCountState;
                if(response.totalNum){
                    this.totalNum = response.totalNum;
                    this.queryParams.totalNum = response.totalNum;
                }
                this.loading = false;
            });
        },
        // 问题类型
        getWtlxList(val){
            wrongWordsEnumMap().then((res)=>{
                for(var i in res.data){
                    // 问题类型
                    if(i == 'errorTypeMap'){
                        this.wtlxList = [];
                        let arr = res.data[i];
                        for(var j in arr){
                            if(arr[j].wordType == val){
                                this.wtlxList.push(arr[j])
                            }
                        }
                    }
                }
                console.log(this.wtlxList,'问题类型数据')
            })
        },
        // 标签分类
        getErrorTypeFn(){
            getErrorType().then((res)=>{
                this.zkTypeChildList = res.data.options;
            })
        },
        // tab切换
        handleClick(tab, event) {
            console.log(tab, event);
            // this.resetForm("queryForm");
            this.queryParams.pgNum = 1;
            this.queryParams.pgSize = 100;
            this.queryParams.showState = null;
            this.queryParams.roughCountState = false;
            this.queryParams.totalNum = null;
            this.total = 0;
            this.roughCountState = false;
            this.totalNum = null;
            if(tab.name == '1'){ // 待审核
                this.queryParams.showStateIn = [1];
                this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]; // 表格排序
                this.queryParams.ignoreFlag = false;
                if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                } 
                // this.getList(); 
            }else if(tab.name == '2'){ // 已审核正确
                this.queryParams.showStateIn = [2,3];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = false;
                if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                } 
                // this.getList();
            }else if(tab.name == '3'){ // 已审核错误
                this.queryParams.showStateIn = [4];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
                if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                } 
                // this.getList();
            }else if(tab.name == '99'){ // 存疑
                this.queryParams.showStateIn = [99];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
                if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                } 
                // this.getList();
            }else if(tab.name == '5'){ // 已审核错误
                this.queryParams.showStateIn = [5];
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]; // 表格排序
                this.queryParams.ignoreFlag = true;
                if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                    this.getList();                
                }else{
                    this.inspSiteInfoList = [];
                    this.total = 0;
                } 
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
                reviewResult: null,
                auditTime: null,
                rectifyTime: null,
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
            this.queryParams.totalNum = null;
            this.queryParams.roughCountState = false;
            // // AI标记
            // if(this.queryParams.showStateAiIn.length == this.showStateAiList.length){
            //     this.queryParams.showStateAiIn = [];
            // }
            if(this.queryParams.treeInfo.psCode != null || this.queryParams.siteCode != null || this.queryParams.batchId != null || this.queryParams.idStr != null){
                if(this.activeName == '1' || this.activeName == '2'){
                    this.queryParams.ignoreFlag = false;
                }else if(this.activeName == '3' || this.activeName == '99' || this.activeName == '5'){
                    this.queryParams.ignoreFlag = true;
                }
                this.getList();                
            }else{
                this.$modal.msgWarning("主管单位/网站标识码/订单批次/数据ID请至少输入其中一项");
            }
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
                this.queryParams.orderTypes = [{ code: 1, name: 'ct' }]
            }else {
                this.queryParams.orderTypes = [{ code: 1, name: 'ate' }]
            }
            this.queryParams.batchId = null;
            this.resetForm("queryForm");
            this.total = 0;
            this.roughCountState = false;
            this.totalNum = null;
            this.queryParams.roughCountState = false;
            this.queryParams.totalNum = null;
            this.inspSiteInfoList = [];

            this.exportSiteName = null; // 导出-主管单位名称
            this.exportSiteName_ = null; // 导出-网站名称（主办单位）
            
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
            getInspSiteInfo({id:id, wordType: 1, ignoreFlag: this.queryParams.ignoreFlag}).then(response => {
                this.form.wordType = 1;
                this.form.ignoreFlag = this.queryParams.ignoreFlag;
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
                    this.form.reviewResult = response.data.reviewResult;
                    if(response.data.auditTime == '--'){
                        this.form.auditTime = null
                    }else{
                        this.form.auditTime = response.data.auditTime;
                    }
                    if(response.data.rectifyTime == '--'){
                        this.form.rectifyTime = null
                    }else{
                        this.form.rectifyTime = response.data.rectifyTime;
                    }
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
                    // if(response.data.showState == 1){
                    //     this.form.showState = 2;                    
                    // }else{
                        this.form.showState = response.data.showState;
                    // }
                    this.form.explanation = response.data.explanation;
                    this.form.reviewResult = response.data.reviewResult;
                    if(response.data.auditTime == '--'){
                        this.form.auditTime = null
                    }else{
                        this.form.auditTime = response.data.auditTime;
                    }
                    if(response.data.rectifyTime == '--'){
                        this.form.rectifyTime = null
                    }else{
                        this.form.rectifyTime = response.data.rectifyTime;
                    }
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
                showState: index,
                wordType: 1, 
                ignoreFlag: this.queryParams.ignoreFlag
            }
            let tit = '';
            if(index == 2){
                tit = '显示';
            }else if(index == 4){
                tit = '误报';
            }else if(index == 99){
                tit = '存疑';
            }
            if(index == 2){
                this.open4 = true;
            }else{
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
            }
            
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
                wordType: 1,
                ignoreFlag: this.queryParams.ignoreFlag
            }
            this.resetForm("form2");
            const id = row.idStr || this.ids;
            this.zgIndex = index;
            getInspSiteInfo({id:id,wordType: 1, ignoreFlag: this.queryParams.ignoreFlag}).then(response => {
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
                wordType: 1,
                ignoreFlag: this.queryParams.ignoreFlag
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
                                // this.inspSiteInfoList.splice(this.zgIndex, 1);
                                // if(this.inspSiteInfoList.length == 0){
                                //     setTimeout(()=>{
                                //         this.getList();
                                //     },1000)
                                // }
                            });
                        }else{
                            let data = {
                                ids: this.ids,
                                reviewResult: this.form2.reviewResult,
                                wordType: 1,
                                ignoreFlag: this.queryParams.ignoreFlag
                            }
                            console.log(data,'data')
                            editReviewResultBatch(data).then(()=>{
                                this.$modal.msgSuccess("修改成功");
                                this.open2 = false;
                                this.getList();
                                // this.inspSiteInfoList = this.inspSiteInfoList.filter(
                                //     (a) => !this.ids.some((b) => a.idStr === b)
                                // )
                                // console.log(this.inspSiteInfoList,'操作后的列表数据')
                                // if(this.inspSiteInfoList.length == 0){
                                //     setTimeout(()=>{
                                //         this.getList();
                                //     },1000)
                                // }  
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
                        return delInspSiteInfo({ids:[ids],wordType: 1, ignoreFlag: this.queryParams.ignoreFlag});
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
                        return delInspSiteInfo({ids:ids,wordType: 1, ignoreFlag: this.queryParams.ignoreFlag});
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
        reset3() {
            this.form3 = {
                menuType: 0,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel3() {
            this.open3 = false;
            this.form3 = {
                menuType: 0,
                type: 1,
            }
            this.resetForm("form3");
        },
        /** 导出按钮操作 */
        handleExport() {
            // let fileName = '错误内容数据'
            // this.download(
            //     "biz/wrongWords/export",this.queryParams,
            //     `${fileName}.xlsx`
            // ).then((res)=>{});
            this.open3 = true;
            this.reset3();
        },
        /** 提交按钮 */
        submitForm3() {
            this.$refs["form3"].validate(valid => {
                if (valid) {
                    console.log(this.form3)
                    let subData = this.queryParams;
                    subData.menuType = 0;
                    console.log(subData,'提交数据')
                    if(this.form3.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open3 = false;
                        })
                    }else{ // 小批量
                        console.log(this.exportSiteName,'this.exportSiteName_')
                        console.log(this.exportSiteName_,'this.exportSiteName_')
                        let fileName = '';
                        if(this.exportSiteName != null && this.exportSiteName_ != null){
                            fileName = this.exportSiteName_ + '-错误内容数据-'+this.formatDate(new Date());
                        }else{
                            if(this.exportSiteName != null){
                                fileName = this.exportSiteName + '-错误内容数据-'+this.formatDate(new Date());
                            }else if(this.exportSiteName_ != null){
                                fileName = this.exportSiteName_ + '-错误内容数据-'+this.formatDate(new Date());
                            }else{
                                fileName = '错误内容数据-'+this.formatDate(new Date());
                            }
                        }
                        console.log(fileName,'导出-文件名')
                        this.download(
                            "biz/wrongWordsBase/export",this.queryParams,
                            `${fileName}.xlsx`
                        ).then((res)=>{
                            this.open3 = false;
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
        // 订单批次模糊搜
        remoteMethod2(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    listInspOrderBatch({searchKeyLike: query}).then((res)=>{
                        if(res.rows.length > 0){
                            this.pcList = [];
                            for(var i in res.rows){
                                this.pcList.push({
                                    label: res.rows[i].orderName + '（' + res.rows[i].orderStartDate + '）' + '/ ' + res.rows[i].batchName + '（' + res.rows[i].startDate + '）',
                                    value: res.rows[i].id
                                })
                            }
                        }
                    })
                },1000)
            }
        },
        // 数据范围事件
        dataRangeTypeChange(){
            if(this.queryParams.dataRangeType == 1){
                this.queryParams.batchId = null;
            }
        },
         /** 查询订单列表 */
        // 搜索条件
        getorderInfoDateList(orderName) {
            this.loading = true;
            let date = {
                orderName: orderName,
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
                            siteName: response.data[i].unitName
                        })
                        if(response.data[i].siteCode == queryString){
                            this.exportSiteName_ = response.data[i].unitName
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
        handleSelectCompany(val){
            console.log(val,'valval')
            this.queryParams.siteCode = val.siteCode;
            this.exportSiteName_ = val.siteName; // 导出-网站名称（主办单位）
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
                            siteName: response.data[i].unitName
                        })
                        if(response.data[i].siteCode == queryString){
                            this.exportSiteName = response.data[i].unitName
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
        handleSelectCompany2(val){
            console.log(val,'valval')
            this.queryParams.treeInfo.psCode = val.siteCode;
            this.exportSiteName = val.siteName;  // 导出-主管单位名称（主办单位）
            
            
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
                        formData.append("taskType", 1);
                    });
                }else if(this.fileType == 2){ // 整改导入
                    this.subFileList.forEach(f => {
                        console.log(f,'f')
                        formData.append("file", f.raw);
                        formData.append("taskType", 2);
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
                let fileName = '网站错误内容审核模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
                              
            }else if(this.fileType == 2){ // 整改
                let fileName = '网站错误内容整改模板';
                this.download2(
                    "common/download/downloadExcelTpl?type=2",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }
            
        },

        // 批量显示、预警
        // 表单重置
        reset4() {
            this.form4 = {
                showState: 2,
            };
            this.resetForm("form4");
        },
        // 取消按钮
        cancel4() {
            this.open4 = false;
            this.form4 = {
                showState: 2,
            }
            this.resetForm("form4");
        },
        /** 提交按钮 */
        submitForm4() {
            this.$refs["form4"].validate(valid => {
                if (valid) {
                    let data = {
                        ids: this.ids,
                        showState: this.form4.showState,
                        wordType: 1, 
                        ignoreFlag: this.queryParams.ignoreFlag
                    }
                    editBatch(data).then((res)=>{
                        this.$modal.msgSuccess("操作成功");  
                        this.inspSiteInfoList = this.inspSiteInfoList.filter(
                            (a) => !this.ids.some((b) => a.idStr === b)
                        )
                        this.open4 = false;
                        console.log(this.inspSiteInfoList,'操作后的列表数据')
                        if(this.inspSiteInfoList.length == 0){
                            setTimeout(()=>{
                                this.open4 = false;
                                this.getList();
                            },1000)
                        }  
                    })
                    
                }
            });
        },

        // 依据弹窗
        accIdInfo(idStr){
            this.InfoStr = idStr;
            this.OpenS = true;
        },
        // 子->父
        IdStrOpenS(val){
            this.OpenS = val;
        },

        // 图片放大弹窗
        fdImg(row){
            this.ImgInfoObj = JSON.stringify(row);
            this.ImgOpenS = true;
        },
        // 子->父
        ImgIdStrOpenS(val){
            this.ImgOpenS = val;
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
    .slt{
        width: 100px;
        height: auto;
        max-height: 60px;
    }
    .slt:hover{
        cursor: pointer;
    }

    .two-line-text {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .dcts{
        position: relative;
        top: -22px;
        left: 21%;
        font-size: 13px;
        color: red;
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
    /deep/.el-popover{
        top: 70px!important;
    }
</style>