<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="80px"
        >
            <el-form-item label="问题类型" prop="problemType">
                <!-- <el-select v-model="queryParams.problemType" clearable placeholder="请选择问题类型">
                    <el-option
                        v-for="item in wtlxList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select> -->
                <el-cascader
                v-model="channelTypeArr"
                :options="options"
                :props="{ checkStrictly: true }"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="反馈状态" prop="feedbackState">
                <el-select v-model="queryParams.feedbackState" clearable placeholder="请选择反馈状态">
                    <el-option
                        v-for="item in fkztList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="阅读状态" prop="readState">
                <el-select v-model="queryParams.readState" clearable placeholder="请选择阅读状态">
                    <el-option
                        v-for="item in ydztList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="marginLeft:10px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
            <!-- <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspSiteInfo:export']"
                >导出</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspSiteInfoList"
            @selection-change="handleSelectionChange"
            @sort-change="sortChange"
        >
            <el-table-column prop="index" label="序号" width="100" align="center"></el-table-column>
            <el-table-column prop="problemDescription" label="问题描述" show-overflow-tooltip />
            <el-table-column prop="replyDescription" label="回复内容" show-overflow-tooltip />
            <el-table-column prop="problemTypeTxt" label="问题类型" width="180" ></el-table-column>
            <el-table-column prop="feedbackStateTxt" label="反馈状态"  width="120" align="center"></el-table-column>
            <el-table-column prop="readStateTxt" label="阅读状态"  width="120" align="center"></el-table-column>
            <el-table-column prop="updateBy" label="更新人" width="100"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="回复" placement="top">
                        <i class="el-icon-chat-dot-round" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="feedbackChange(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                    </el-tooltip>
                    <!-- el-icon-chat-dot-round -->
                    
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
        <!-- 添加或修改站点关系对话框 -->
        <el-dialog title="问题反馈" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules"  label-width="100px">
                <div class="box">
                    <el-form-item label="问题类型" prop="problemType" style="width:48%;marginTop:-10px">
                        <!-- <el-select v-model="form.problemType" clearable placeholder="请选择问题类型">
                            <el-option
                                v-for="item in wtlxList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select> -->
                        {{infoObj.problemTypeTxt}}
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime" style="width:95%;marginTop:-10px">
                        {{infoObj.createTime}}
                    </el-form-item>
                    <el-form-item label="问题描述" prop="problemDescription" style="width:95%;marginTop:-10px">
                        {{form.problemDescription}}
                    </el-form-item>
                    <!-- 网站 -->
                    <!-- 错误内容、敏感信息、隐私泄露 -->
                    <!-- <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="Object.keys(infoListObj).length != 0"> -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" 
                        v-if="form.problemType == 1 || form.problemType == 2 || form.problemType == 3 || 
                        form.problemType == 10 || form.problemType == 20 || form.problemType == 30 || 
                        form.problemType == 11 || form.problemType == 12 || form.problemType == 13 || form.problemType == 14 ||
                        form.problemType == 110 || form.problemType == 120 || form.problemType == 130 || form.problemType == 140
                        ">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li><span class="sp1">错敏词：</span><span class="sp2">{{infoListObj.word}}</span></li>
                            <li v-if="infoListObj.wordType != 3"><span class="sp1">推荐词：</span><span class="sp2">{{infoListObj.suggest}}</span></li>
                            <li><span class="sp1" style="min-width: 75px;">所在上下文：</span>
                                <span class="sp2">
                                    {{infoListObj.one}}
                                    <span style="color:red">{{infoListObj.word}}</span>
                                    {{infoListObj.two}}
                                </span>
                            </li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <!-- 错误内容、敏感信息、隐私泄露 -->
                            <li v-if="form.problemType == 1 || form.problemType == 2 || form.problemType == 3 || form.problemType == 10 || form.problemType == 20 || form.problemType == 30">
                                <span class="sp1" style="min-width: 60px;">所在文章：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.title}}</span>
                            </li>
                            <!-- 图片、视频、音频、附件监测 -->
                            <li v-if="form.problemType == 11 || form.problemType == 12 || form.problemType == 13 || form.problemType == 14 || 
                                form.problemType == 110 || form.problemType == 120 || form.problemType == 130 || form.problemType == 140">
                                <span class="sp1" style="min-width: 60px;">所在文章：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromTitle}}</span>
                            </li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 错链信息 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 7 || form.problemType == 70">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li>
                                <span class="sp1" style="min-width: 75px;">父页面信息：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromTitleTxt}}</span>
                            </li>
                            <li><span class="sp1">不可用链接标题：</span><span class="sp2">{{infoListObj.anchor}}</span></li>
                            <li>
                                <span class="sp1" style="min-width: 75px;">不可用链接：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.url}}</span>
                            </li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <li><span class="sp1">问题类型：</span><span class="sp2">{{infoListObj.httpStateText}}</span></li>
                            <li><span class="sp1">返回码：</span><span class="sp2">{{infoListObj.httpCode}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 外链信息 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 8">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li>
                                <span class="sp1" style="min-width: 75px;">父页面信息：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromTitleTxt}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">外链链接：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.url}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">外链域名：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.domain)">{{infoListObj.domain}}</span>
                            </li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <li><span class="sp1">信任状态：</span><span class="sp2" :style="{color:infoListObj.color}">{{infoListObj.trustFlagTxt}}</span></li>
                            <li><span class="sp1">资源类别：</span><span class="sp2">{{infoListObj.contentTypeTxt}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 首页更新 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 4">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li><span class="sp1">逾期不更新状态：</span><span class="sp2" :style="{color:infoListObj.overdueStateBgColor}">{{infoListObj.overdueStateTxt}}</span></li>
                            <li><span class="sp1">未更新天数：</span><span class="sp2">{{infoListObj.noUpdateDay}}</span></li>
                            <li>
                                <span class="sp1">更新标题：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.updateUrl)">{{infoListObj.updateTitle}}</span>
                            </li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <li><span class="sp1">最后更新时间：</span><span class="sp2">{{infoListObj.renewTime}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanDate}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 栏目更新 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 5">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li>
                                <span class="sp1">栏目名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.name}}</span>
                            </li>
                            <li><span class="sp1">栏目分类：</span><span class="sp2">{{infoListObj.channelTypeText}}</span></li>
                            <li><span class="sp1">逾期不更新状态：</span><span class="sp2" :style="{color:infoListObj.overdueStateBgColor}">{{infoListObj.overdueStateTxt}}</span></li>
                            <li><span class="sp1">未更新天数：</span><span class="sp2">{{infoListObj.noUpdateDay}}</span></li>
                            <li>
                                <span class="sp1">更新标题：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.updateUrl)">{{infoListObj.updateTitle}}</span>
                            </li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <li><span class="sp1">最后更新时间：</span><span class="sp2">{{infoListObj.renewTime}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanDate}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 规范检查 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 9">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li>
                                <span class="sp1" style="min-width:60px">问题地址：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.url}}</span>
                            </li>
                            <li><span class="sp1">父地址标题：</span><span class="sp2">{{infoListObj.fromTitle}}</span></li>
                            <li>
                                <span class="sp1">父地址：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromUrl}}</span>
                            </li>
                            <li><span class="sp1">规则分类：</span><span class="sp2">{{infoListObj.typeTxt}}</span></li>
                            <li><span class="sp1">规则类型：</span><span class="sp2">{{infoListObj.requireTypeTxt}}</span></li>
                            <li>
                                <span class="sp1">快照：</span>
                                <el-button icon="el-icon-camera-solid" type="text" :disabled="!infoListObj.snapshotPath" style="font-size:14px" @click="dzChange(infoListObj.snapshotPath)"></el-button>
                            </li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 首页连通 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 6">
                        <ul class="con">
                            <li>
                                <span class="sp1">网站名称：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.siteUrl)">{{infoListObj.siteName}}</span>
                            </li>
                            <li><span class="sp1">网站标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li><span class="sp1">连通总数：</span><span class="sp2">{{infoListObj.countNum}}</span></li>
                            <li><span class="sp1">成功连通：</span><span class="sp2">{{infoListObj.normalSum}}</span></li>
                            <li><span class="sp1">确定不连通：</span><span class="sp2">{{infoListObj.confirmSum}}</span></li>
                            <li><span class="sp1">疑似不连通：</span><span class="sp2">{{infoListObj.suspectedSum}}</span></li>
                            <li><span class="sp1">确定不连通占比：</span><span class="sp2">{{infoListObj.confirmProportionVal}}</span></li>
                            <li><span class="sp1">疑似不连通占比：</span><span class="sp2">{{infoListObj.suspectedProportionVal}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanDate}}</span></li>
                        </ul>
                    </el-form-item>

                    <!-- 新媒体 -->
                    <!-- 账号更新 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" 
                        v-if="form.problemType == 200">
                        <ul class="con">
                            <li>
                                <span class="sp1">账号信息：</span>
                                <span class="sp2 sppp2"><img :src="infoListObj.ico" alt="" class="zhxxIco">{{infoListObj.accountName}}</span>
                            </li>
                            <li><span class="sp1">新媒体标识码：</span><span class="sp2">{{infoListObj.siteCodeMedia}}</span></li>
                            <li><span class="sp1">填报单位名称：</span><span class="sp2">{{infoListObj.siteName}}</span></li>
                            <li><span class="sp1">填报单位标识码：</span><span class="sp2">{{infoListObj.siteCode}}</span></li>
                            <li><span class="sp1">监测状态：</span><span class="sp2">{{infoListObj.enabledTxt}}</span></li>
                            <li><span class="sp1">不更新状态：</span><span class="sp2" :style="{color:infoListObj.overdueStateBgColor}">{{infoListObj.overdueStateTxt}}</span></li>
                            <li><span class="sp1">未更新天数：</span><span class="sp2">{{infoListObj.noUpdateDay}}</span></li>
                            <li>
                                <span class="sp1" style="min-width: 75px;">未更新标题：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.updateUrl)">{{infoListObj.updateTitle}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">主页地址：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.homeUrl)">{{infoListObj.homeUrl}}</span>
                            </li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanDate}}</span></li>
                        </ul>
                        
                    </el-form-item>
                    <!-- 错误内容、敏感信息、隐私泄露、图片、视频、音频、附件监测 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" 
                        v-if="form.problemType == 210 || form.problemType == 220 || form.problemType == 230 ||
                        form.problemType == 211 || form.problemType == 221 || form.problemType == 231 || 
                        form.problemType == 240 || form.problemType == 250 || form.problemType == 260 || form.problemType == 270 || 
                        form.problemType == 241 || form.problemType == 251 || form.problemType == 261 || form.problemType == 271">
                        <ul class="con">
                            <li>
                                <span class="sp1">账号信息：</span>
                                <span class="sp2 sppp2"><img :src="infoListObj.ico" alt="" class="zhxxIco">{{infoListObj.accountName}}</span>
                            </li>
                            <li><span class="sp1">新媒体标识码：</span><span class="sp2">{{infoListObj.siteCodeMedia}}</span></li>
                            <li><span class="sp1">错敏词：</span><span class="sp2">{{infoListObj.word}}</span></li>
                            <li v-if="infoListObj.wordType != 3"><span class="sp1">推荐词：</span><span class="sp2">{{infoListObj.suggest}}</span></li>
                            <li><span class="sp1" style="min-width: 75px;">所在上下文：</span>
                                <span class="sp2">
                                    {{infoListObj.one}}
                                    <span style="color:red">{{infoListObj.word}}</span>
                                    {{infoListObj.two}}
                                </span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">所在文章：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromTitle}}</span>
                            </li>
                            <li v-if="infoListObj.checkUrlType != file">
                                <span class="sp1" style="min-width: 60px;">附件地址：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.url}}</span>
                            </li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>
                    <!-- 外链信息 -->
                    <el-form-item label="" prop="problemDescription" style="width:95%;marginTop:-20px" v-if="form.problemType == 280">
                        <ul class="con">
                           <li>
                                <span class="sp1">账号信息：</span>
                                <span class="sp2 sppp2"><img :src="infoListObj.ico" alt="" class="zhxxIco">{{infoListObj.accountName}}</span>
                            </li>
                            <li><span class="sp1">新媒体标识码：</span><span class="sp2">{{infoListObj.siteCodeMedia}}</span></li>
                            <li>
                                <span class="sp1" style="min-width: 75px;">父页面信息：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.fromUrl)">{{infoListObj.fromTitleTxt}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">外链链接：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.url)">{{infoListObj.url}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;">外链域名：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.domain)">{{infoListObj.domain}}</span>
                            </li>
                            <li><span class="sp1">信任状态：</span><span class="sp2" :style="{color:infoListObj.color}">{{infoListObj.trustFlagTxt}}</span></li>
                            <li><span class="sp1">资源类别：</span><span class="sp2">{{infoListObj.contentTypeTxt}}</span></li>
                            <li><span class="sp1">监测时间：</span><span class="sp2">{{infoListObj.scanTime}}</span></li>
                        </ul>
                    </el-form-item>


                    <el-form-item label="回复内容" prop="replyDescription" style="width:95%">
                        <!-- <el-input v-model="form.replyDescription" type="textarea" placeholder="请输入内容" /> -->
                        <el-input v-model="form.replyDescription" type="textarea" :autosize="{ minRows: 5, maxRows: 100 }" placeholder="请输入回复内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
    getList,
    inspFeedbackEdit,
    readAll,
    getInfo,
    wrongWordsInfo,
    errorsInfo,
    externalLinksInfo,
    pageUpdateInfo,
    lmPageUpdateInfo,
    requiresInfo,
    getSpecsMapEnum,
    linksSummaryInfo,
    delInspSiteInfo,
    mediaWrongWordsInfo,
    mediaExternalLinksInfo,
    mediaUpdateInfo
} from "@/api/biz/feedback";
import { listInspChannelType } from "@/api/biz/pageUpdate";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
import global_ from '@/utils/Global';
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";




export default {
    name: "InspSiteInfo",
    components: {
        Treeselect
    },
    data() {
        return {
            expireTimeOPtion: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
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
                pgSize: 10,
                // treeInfo: {'psCode': null},
                // siteCodeLike: null, // 网站标识码
                problemType: null, // 问题类型
                feedbackState: 1, // 反馈状态
                readState: null, // 阅读状态
                bizType: null, // 1.网站 20.新媒体 30.网站安全
            },

            /**下拉菜单数据 */
            // 站点关系树选项
            inspSiteTreeOptions: [],

            // 问题类型
            wtlxList: [
                { label: '错误内容', val: 1 },
                { label: '敏感信息', val: 2 },
                { label: '隐私泄露', val: 3 },
                { label: '首页更新', val: 4 },
                { label: '栏目更新', val: 5 },
                { label: '首页连通性', val: 6 },
                { label: '错链信息', val: 7 },
                { label: '外链信息', val: 8 },
                { label: '规范检查', val: 9 },
                { label: '其他', val: 10 },
            ],
            options: [
                // 网站 1-140
                {
                    value: 1,
                    label: '网站',
                    children: [
                        { label: '错误内容-日常', value: 1 },
                        { label: '错误内容-定期', value: 10 },

                        { label: '敏感信息-日常', value: 2 },
                        { label: '敏感信息-定期', value: 20 },

                        { label: '隐私泄露-日常', value: 3 },
                        { label: '隐私泄露-定期', value: 30 },

                        { label: '图片监测-日常', value: 11 },
                        { label: '图片监测-定期', value: 110 },

                        { label: '视频监测-日常', value: 12 },
                        { label: '视频监测-定期', value: 120 },

                        { label: '音频监测-日常', value: 13 },
                        { label: '音频监测-定期', value: 130 },
                        
                        { label: '附件监测-日常', value: 14 },
                        { label: '附件监测-定期', value: 140 },

                        { label: '首页更新', value: 4 },

                        { label: '栏目更新', value: 5 },

                        { label: '首页连通性', value: 6 },

                        { label: '错链信息-日常', value: 7 },
                        { label: '错链信息-定期', value: 70 },

                        { label: '外链信息-日常', value: 8 },
                        { label: '外链信息-定期', value: 80 },

                        { label: '规范检查', value: 9 },

                        
                    ]
                },
                // 新媒体200-300
                {
                    value: 20,
                    label: '新媒体',
                    children: [
                        { label: '账号更新', value: 200 },

                        { label: '错误内容-日常', value: 210 },
                        { label: '错误内容-定期', value: 211 },
                        
                        { label: '敏感信息-日常', value: 220 },
                        { label: '敏感信息-定期', value: 221 },
                        
                        { label: '隐私泄露-日常', value: 230 },
                        { label: '隐私泄露-定期', value: 231 },

                        { label: '图片监测-日常', value: 240 },
                        { label: '图片监测-定期', value: 241 },

                        { label: '视频监测-日常', value: 250 },
                        { label: '视频监测-定期', value: 251 },

                        { label: '音频监测-日常', value: 260 },
                        { label: '音频监测-定期', value: 261 },

                        { label: '附件监测-日常', value: 270 },
                        { label: '附件监测-定期', value: 271 },

                        { label: '外链信息', value: 280 },

                        // { label: '文章稿件', value: 290 },

                        // { label: '账号信息', value: 300 },
                    ]
                },
                // 其他

            ],
            channelTypeArr: null,
            // 反馈状态
            fkztList: [
                { label: '未回复', val: 1 },
                { label: '已回复', val: 2 },
            ],
            // 阅读状态
            ydztList: [
                { label: '未读', val: 1 },
                { label: '已读', val: 2 },
            ],

            form: {},
            rules: {
                replyDescription: [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
            },
            infoObj: {},
            infoListObj: {},

            requireTypeDate: [], // 规则分类
            typeDate: [], // 规则类型



            
        };
    },
    created() {
        this.getList();
        // this.getTreeselect();
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
            listInspSiteTree({siteType: 1}).then(response => {
                this.inspSiteTreeOptions = [];
                this.inspSiteTreeOptions = this.handleTree(
                    response.data,
                    "siteCode",
                    "parentSite",
                );
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
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            if(this.channelTypeArr){
                console.log(this.channelTypeArr)
                if(this.channelTypeArr.length == 1){
                    this.queryParams.bizType = this.channelTypeArr[0];
                    this.queryParams.problemType = null;                    
                }else{
                    this.queryParams.bizType = this.channelTypeArr[0];
                    this.queryParams.problemType = this.channelTypeArr.slice(-1)[0];
                }
                console.log(this.queryParams.bizType)
                console.log(this.queryParams.problemType)
            }
            getList(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 问题类型
                    // if(this.inspSiteInfoList[i].problemType == 1){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '错误内容';
                    // }else if(this.inspSiteInfoList[i].problemType == 2){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '敏感信息';
                    // }else if(this.inspSiteInfoList[i].problemType == 3){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '隐私泄露';
                    // }else if(this.inspSiteInfoList[i].problemType == 4){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '首页更新';
                    // }else if(this.inspSiteInfoList[i].problemType == 5){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '栏目更新';
                    // }else if(this.inspSiteInfoList[i].problemType == 6){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '首页连通性';
                    // }else if(this.inspSiteInfoList[i].problemType == 7){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '错链信息';
                    // }else if(this.inspSiteInfoList[i].problemType == 8){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '外链信息';
                    // }else if(this.inspSiteInfoList[i].problemType == 9){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '规范检查';
                    // }else if(this.inspSiteInfoList[i].problemType == 10){
                    //     this.inspSiteInfoList[i].problemTypeTxt = '其他';
                    // }
                    // for(var j in this.options){
                        if(this.inspSiteInfoList[i].bizType == 1){ //网站
                            for(var zz in this.options[0].children){
                                if(this.inspSiteInfoList[i].problemType == this.options[0].children[zz].value){
                                    this.inspSiteInfoList[i].problemTypeTxt = '网站：'+this.options[0].children[zz].label;
                                }
                            }
                        }else if(this.inspSiteInfoList[i].bizType == 20){ // 新媒体
                            for(var zz in this.options[1].children){
                                if(this.inspSiteInfoList[i].problemType == this.options[1].children[zz].value){
                                    this.inspSiteInfoList[i].problemTypeTxt = '新媒体：'+this.options[1].children[zz].label;
                                }
                            }
                        }
                    // }
                    // 反馈状态
                    if(this.inspSiteInfoList[i].feedbackState == 1){
                        this.inspSiteInfoList[i].feedbackStateTxt = '未回复';
                    }else if(this.inspSiteInfoList[i].feedbackState == 2){
                        this.inspSiteInfoList[i].feedbackStateTxt = '已回复';
                    }
                    // 阅读状态
                    if(this.inspSiteInfoList[i].readState == 1){
                        this.inspSiteInfoList[i].readStateTxt = '未读';
                    }else if(this.inspSiteInfoList[i].readState == 2){
                        this.inspSiteInfoList[i].readStateTxt = '已读';
                    }
                    
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {     
            this.channelTypeArr = null;
            this.queryParams.bizType = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                // .confirm('是否确认删除站点信息编号为"' + ids + '"的数据项？')
                .confirm('是否确认删除该条数据？')
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
            let fileName = '栏目稿件数据'
            this.download(
                "biz/HomeManuscript/export",this.queryParams,
                `${fileName}.xlsx`
            ).then((res)=>{});
        },

        // 地址超链接
        dzChange(url){
            if(url != null && url != '' && url != '--'){
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

        // 回复
        feedbackChange(row){
            console.log(row,'123')
            this.reset();
            let id = row.id;
            getInfo({id: id}).then((res)=>{
                this.open = true;
                this.form.id = res.data.id;
                this.form.problemType = res.data.problemType;
                this.form.problemDescription = res.data.problemDescription;
                this.form.replyDescription = res.data.replyDescription;
                this.form.feedbackState = 2;
                this.form.readState = res.data.readState;

                this.infoObj.createTime = res.data.createTime;

                if(row.bizType == 1){ //网站
                    for(var zz in this.options[0].children){
                        if(this.form.problemType == this.options[0].children[zz].value){
                            this.infoObj.problemTypeTxt = '网站 / '+this.options[0].children[zz].label;
                        }
                    }
                }else if(row.bizType == 20){ // 新媒体
                    for(var zz in this.options[1].children){
                        if(this.form.problemType == this.options[1].children[zz].value){
                            this.infoObj.problemTypeTxt = '新媒体 / '+this.options[1].children[zz].label;
                        }
                    }
                }
                console.log(this.form,'this.form')
                console.log(this.infoObj.problemTypeTxt,'标题')

                // 问题类型
                // 网站
                // 错误内容、敏感信息、隐私泄露、图片监测、视频监测、音频监测、附件监测
                if(
                    this.form.problemType == 1 || this.form.problemType == 10 || 
                    this.form.problemType == 2 || this.form.problemType == 20 || 
                    this.form.problemType == 3 || this.form.problemType == 30 ||
                    this.form.problemType == 11 || this.form.problemType == 110 ||
                    this.form.problemType == 12 || this.form.problemType == 120 ||
                    this.form.problemType == 13 || this.form.problemType == 130 ||
                    this.form.problemType == 14 || this.form.problemType == 140
                    ){
                    // this.infoObj.problemTypeTxt = '错误内容';
                    wrongWordsInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        if(!this.infoListObj.suggest){
                            this.infoListObj.suggest = '--';
                        }
                        this.infoListObj.one = this.infoListObj.sentence.split(this.infoListObj.word)[0];
                        this.infoListObj.two = this.infoListObj.sentence.split(this.infoListObj.word)[1];
                    })
                }else if(this.form.problemType == 4){
                    // this.infoObj.problemTypeTxt = '首页更新';
                    pageUpdateInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 问题级别状态颜色
                        if(this.infoListObj.overdueState == 1){ // 严重
                            this.infoListObj.overdueStateTxt = '严重逾期';
                            this.infoListObj.overdueStateBgColor = '#ff6563';
                        }else if(this.infoListObj.overdueState == 2){ // 一般
                            this.infoListObj.overdueStateTxt = '即将逾期';
                            this.infoListObj.overdueStateBgColor = '#ea9940';
                        }else if(this.infoListObj.overdueState == 3){ // 轻微
                            this.infoListObj.overdueStateTxt = '正常';
                            this.infoListObj.overdueStateBgColor = '#48b93f';
                        }
                        if(!this.infoListObj.updateTitle){
                            this.infoListObj.updateTitle = '--';
                        }
                    })
                }else if(this.form.problemType == 5){
                    // this.infoObj.problemTypeTxt = '栏目更新';
                    lmPageUpdateInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 问题级别状态颜色
                        if(this.infoListObj.overdueState == 1){ // 严重
                            this.infoListObj.overdueStateTxt = '严重逾期';
                            this.infoListObj.overdueStateBgColor = '#ff6563';
                        }else if(this.infoListObj.overdueState == 2){ // 一般
                            this.infoListObj.overdueStateTxt = '即将逾期';
                            this.infoListObj.overdueStateBgColor = '#ea9940';
                        }else if(this.infoListObj.overdueState == 3){ // 轻微
                            this.infoListObj.overdueStateTxt = '正常';
                            this.infoListObj.overdueStateBgColor = '#48b93f';
                        }
                        if(!this.infoListObj.updateTitle){
                            this.infoListObj.updateTitle = '--';
                        }
                        if(!this.infoListObj.renewTime){
                            this.infoListObj.renewTime = '--';
                        }
                    })
                }else if(this.form.problemType == 6){
                    // this.infoObj.problemTypeTxt = '首页连通性';
                    linksSummaryInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                    })
                }else if(this.form.problemType == 7 || this.form.problemType == 70){
                    // this.infoObj.problemTypeTxt = '错链信息';
                    errorsInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 父页面信息
                        if(!this.infoListObj.fromTitle){
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromUrl;
                        }else{
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromTitle;
                        }
                    })
                }else if(this.form.problemType == 8){
                    // this.infoObj.problemTypeTxt = '外链信息';
                    externalLinksInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 父页面信息
                        if(!this.infoListObj.fromTitle){
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromUrl;
                        }else{
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromTitle;
                        }
                        // 资源类别
                        if(this.infoListObj.contentType == 1){ // 严重
                            this.infoListObj.contentTypeTxt = '图片';
                        }else if(this.infoListObj.contentType == 2){ // 一般
                            this.infoListObj.contentTypeTxt = '页面';
                        }else if(this.infoListObj.contentType == 3){ // 轻微
                            this.infoListObj.contentTypeTxt = '附件';
                        }else if(this.infoListObj.contentType == 4){ // 轻微
                            this.infoListObj.contentTypeTxt = 'JS';
                        }else if(this.infoListObj.contentType == 5){ // 轻微
                            this.infoListObj.contentTypeTxt = 'CSS';
                        }else if(this.infoListObj.contentType == 6){ // 轻微
                            this.infoListObj.contentTypeTxt = '视频';
                        }else if(this.infoListObj.contentType == 7){ // 轻微
                            this.infoListObj.contentTypeTxt = '音频';
                        }else if(this.infoListObj.contentType == 8){ // 轻微
                            this.infoListObj.contentTypeTxt = '未知地址';
                        }
                        if(!this.infoListObj.domain){
                            this.infoListObj.domain = '--';
                        }

                        // 信任状态
                        if(this.infoListObj.trustFlag == 1){
                            this.infoListObj.trustFlagTxt = '信任';
                            this.infoListObj.color = '#48b93f';
                        }else if(this.infoListObj.trustFlag == 2){
                            this.infoListObj.trustFlagTxt = '可疑';
                            this.infoListObj.color = '#ff6563';
                        }else{
                            this.infoListObj.trustFlagTxt = '未处理';
                            this.infoListObj.color = '#999999';
                        }
                    })
                }else if(this.form.problemType == 9){
                    // this.infoObj.problemTypeTxt = '规范检查';
                    // 规则枚举数据
                    getSpecsMapEnum({}).then((re)=>{
                        console.log(re)
                        this.requireTypeDate = re.data.specsTypeMap; // 规则分类
                        this.typeDate = re.data.specsMap; // 规则类型
                        
                    })
                    // 规范检查
                    requiresInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        
                        if(!this.infoListObj.fromTitle){
                            this.infoListObj.fromTitle = '--';
                        }
                        for(var i in this.requireTypeDate){
                            if(this.infoListObj.type == this.requireTypeDate[i].code){
                                this.infoListObj.typeTxt = this.requireTypeDate[i].name;
                            }
                        }
                        for(var i in this.typeDate){
                            if(this.infoListObj.requireType == this.typeDate[i].code){
                                this.infoListObj.requireTypeTxt = this.typeDate[i].name;
                            }
                        } 
                    })
                }
                // 新媒体
                else if(
                    this.form.problemType == 210 ||  this.form.problemType == 220 || this.form.problemType == 230 ||
                    this.form.problemType == 211 || this.form.problemType == 221 || this.form.problemType == 231 ||
                    this.form.problemType == 240 || this.form.problemType == 250 || this.form.problemType == 260 || this.form.problemType == 270 || 
                    this.form.problemType == 241 || this.form.problemType == 251 || this.form.problemType == 261 || this.form.problemType == 271
                    ){
                    // mediaWrongWordsInfo
                    mediaWrongWordsInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        if(!this.infoListObj.suggest){
                            this.infoListObj.suggest = '--';
                        }
                        this.infoListObj.one = this.infoListObj.sentence.split(this.infoListObj.word)[0];
                        this.infoListObj.two = this.infoListObj.sentence.split(this.infoListObj.word)[1];
                        if(this.infoListObj.mediaType == 1){
                            this.infoListObj.ico = require('../../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../../assets/images/qt.png')
                        }
                        // 所在文章
                        if(this.infoListObj.fromTitle == null || this.infoListObj.fromTitle == ''){
                            if(this.infoListObj.fromUrl == null || this.infoListObj.fromUrl == ''){
                                this.infoListObj.fromTitle = '--';
                            }else{
                                this.infoListObj.fromTitle = this.infoListObj.fromUrl;
                            }
                        }
                    })
                }else if(this.form.problemType == 280){
                    //外链信息
                    mediaExternalLinksInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 父页面信息
                        if(!this.infoListObj.fromTitle){
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromUrl;
                        }else{
                            this.infoListObj.fromTitleTxt = this.infoListObj.fromTitle;
                        }
                        // 资源类别
                        if(this.infoListObj.contentType == 1){ // 严重
                            this.infoListObj.contentTypeTxt = '图片';
                        }else if(this.infoListObj.contentType == 2){ // 一般
                            this.infoListObj.contentTypeTxt = '页面';
                        }else if(this.infoListObj.contentType == 3){ // 轻微
                            this.infoListObj.contentTypeTxt = '附件';
                        }else if(this.infoListObj.contentType == 4){ // 轻微
                            this.infoListObj.contentTypeTxt = 'JS';
                        }else if(this.infoListObj.contentType == 5){ // 轻微
                            this.infoListObj.contentTypeTxt = 'CSS';
                        }else if(this.infoListObj.contentType == 6){ // 轻微
                            this.infoListObj.contentTypeTxt = '视频';
                        }else if(this.infoListObj.contentType == 7){ // 轻微
                            this.infoListObj.contentTypeTxt = '音频';
                        }else if(this.infoListObj.contentType == 8){ // 轻微
                            this.infoListObj.contentTypeTxt = '未知地址';
                        }
                        if(!this.infoListObj.domain){
                            this.infoListObj.domain = '--';
                        }

                        // 信任状态
                        if(this.infoListObj.trustFlag == 1){
                            this.infoListObj.trustFlagTxt = '信任';
                            this.infoListObj.color = '#48b93f';
                        }else if(this.infoListObj.trustFlag == 2){
                            this.infoListObj.trustFlagTxt = '可疑';
                            this.infoListObj.color = '#ff6563';
                        }else{
                            this.infoListObj.trustFlagTxt = '未处理';
                            this.infoListObj.color = '#999999';
                        }
                        if(this.infoListObj.mediaType == 1){
                            this.infoListObj.ico = require('../../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../../assets/images/qt.png')
                        }
                    })
                }else if(this.form.problemType == 200){
                    // 账号更新
                    mediaUpdateInfo({id: res.data.dataId}).then((resres)=>{
                        console.log(resres,'resresdata')
                        this.infoListObj = resres.data;
                        // 监测状态
                        if(this.infoListObj.enabled == true){
                            this.infoListObj.enabledTxt = '监测中';
                        }else if(this.infoListObj.enabled == false){
                            this.infoListObj.enabledTxt = '未监测';
                        }else{
                            this.infoListObj.enabledTxt = '--';
                        }
                        // 不更新状态
                        if(this.infoListObj.overdueState == 1){ // 严重
                            this.infoListObj.overdueStateTxt = '严重逾期';
                            this.infoListObj.overdueStateBgColor = '#ff6563';
                        }else if(this.infoListObj.overdueState == 2){ // 一般
                            this.infoListObj.overdueStateTxt = '即将逾期';
                            this.infoListObj.overdueStateBgColor = '#ea9940';
                        }else if(this.infoListObj.overdueState == 3){ // 轻微
                            this.infoListObj.overdueStateTxt = '正常';
                            this.infoListObj.overdueStateBgColor = '#48b93f';
                        }
                        if(this.infoListObj.mediaType == 1){
                            this.infoListObj.ico = require('../../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../../assets/images/qt.png')
                        }
                        if(!this.infoListObj.siteCode){
                            this.infoListObj.siteCode = '--';
                        }
                        if(!this.infoListObj.siteName){
                            this.infoListObj.siteName = '--';
                        }
                        if(!this.infoListObj.homeUrl){
                            this.infoListObj.homeUrl = '--';
                        }
                        if(!this.infoListObj.scanDate){
                            this.infoListObj.scanDate = '--';
                        }
                    })
                    
                }







            })
            /**错误内容、敏感信息、隐私泄露 */
            // wrongWordsInfo({id: '66827ee49b7fc84f230e7046'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            //     this.infoListObj.one = this.infoListObj.sentence.split(this.infoListObj.word)[0];
            //     this.infoListObj.two = this.infoListObj.sentence.split(this.infoListObj.word)[1];
            // })
            /**错链信息 */
            // errorsInfo({id: '66827efd9b7fc84f230e72cc'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            // })
            /**外链信息 */
            // externalLinksInfo({id: '66827f2f9b7fc84f230e735f'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            // })
            /**首页更新 */
            // pageUpdateInfo({id: '6682c4ace64b9346f8e457e7'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            //     // 问题级别状态颜色
            //     if(this.infoListObj.overdueState == 1){ // 严重
            //         this.infoListObj.overdueStateTxt = '严重逾期';
            //         this.infoListObj.overdueStateBgColor = '#ff6563';
            //     }else if(this.infoListObj.overdueState == 2){ // 一般
            //         this.infoListObj.overdueStateTxt = '即将逾期';
            //         this.infoListObj.overdueStateBgColor = '#ea9940';
            //     }else if(this.infoListObj.overdueState == 3){ // 轻微
            //         this.infoListObj.overdueStateTxt = '正常';
            //         this.infoListObj.overdueStateBgColor = '#48b93f';
            //     }
            //     if(!this.infoListObj.updateTitle){
            //         this.infoListObj.updateTitle = '--';
            //     }
            // })
            /**栏目更新 */
            // lmPageUpdateInfo({id: '6682c4ace64b9346f8e457f6'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            //     // 问题级别状态颜色
            //     if(this.infoListObj.overdueState == 1){ // 严重
            //         this.infoListObj.overdueStateTxt = '严重逾期';
            //         this.infoListObj.overdueStateBgColor = '#ff6563';
            //     }else if(this.infoListObj.overdueState == 2){ // 一般
            //         this.infoListObj.overdueStateTxt = '即将逾期';
            //         this.infoListObj.overdueStateBgColor = '#ea9940';
            //     }else if(this.infoListObj.overdueState == 3){ // 轻微
            //         this.infoListObj.overdueStateTxt = '正常';
            //         this.infoListObj.overdueStateBgColor = '#48b93f';
            //     }
            //     if(!this.infoListObj.updateTitle){
            //         this.infoListObj.updateTitle = '--';
            //     }
            //     if(!this.infoListObj.renewTime){
            //         this.infoListObj.renewTime = '--';
            //     }
            // })
            /**规范检查 */
            // 规则枚举数据
            // getSpecsMapEnum({}).then((re)=>{
            //     console.log(re)
            //     this.requireTypeDate = re.data.specsTypeMap; // 规则分类
            //     this.typeDate = re.data.specsMap; // 规则类型
                
            // })
            // // 规范检查
            // requiresInfo({id: '66827ee49b7fc84f230e7026'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
                
            //     if(!this.infoListObj.fromTitle){
            //         this.infoListObj.fromTitle = '--';
            //     }
            //     for(var i in this.requireTypeDate){
            //         if(this.infoListObj.type == this.requireTypeDate[i].code){
            //             this.infoListObj.typeTxt = this.requireTypeDate[i].name;
            //         }
            //     }
            //     for(var i in this.typeDate){
            //         if(this.infoListObj.requireType == this.typeDate[i].code){
            //             this.infoListObj.requireTypeTxt = this.typeDate[i].name;
            //         }
            //     } 
            // })
            /**首页连通 */
            // linksSummaryInfo({id: '66827ee49b7fc84f230e7026'}).then((resres)=>{
            //     console.log(resres,'resresdata')
            //     this.infoListObj = resres.data;
            // })

            

            
        },
        cancel(){
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                problemType: null,
                problemDescription: null,
                replyDescription: null,
                feedbackState: null,
                readState: null,
                
            };
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'this.formthis.form')
                    inspFeedbackEdit(this.form).then(response => {
                        this.$modal.msgSuccess("修改成功");
                        this.open = false;
                        this.getList();
                    });
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
    .divdiv{
        flex: 1;
        display: flex;
        justify-content: space-between;
        .dvdv{
            display: flex;
            align-items: center;
        }
    }

    .drawerCon{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .concon{
            flex: 1;
            overflow: auto;
            .conTop{
                padding: 0 15px 10px 15px;
                border-bottom: 1px solid #f0f0f0;
                .ul{
                    margin: 0;
                    padding: 0;
                    li{
                        font-size: 14px;
                        list-style: none;
                        margin-bottom: 10px;
                        margin-left: 15px;
                    }
                }
            }
        }
    }
    .demo-drawer__footer{
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
    }
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .con{
        background: #f4f5f8;
        border-radius: 10px;
        padding: 5px 10px;
        font-size: 12px;
        li{
            list-style: none;
            height: 24px;
            line-height: 24px;
            display: flex;
            align-items: center;
            .sp2{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .sppp2{
                display: flex;
                align-items: center;
                .zhxxIco{
                    width: 15px;
                    margin-right: 5px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .el-tabs__content{
        padding-bottom: 5px!important;
    }
    .el-drawer__header{
        margin-bottom: 0!important;
        color: #000000;
        font-size: 14px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 10px;
    }
</style>