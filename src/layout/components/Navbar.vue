<template>
    <div class="navbar">
        <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
        <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

        <div class="right-menu">
            <template v-if="device!=='mobile'">
                <!-- <search id="header-search" class="right-menu-item" />

        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip>

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
                </el-tooltip>-->
            </template>
            <!-- 反馈 -->
            <el-popover placement="bottom" width="400" trigger="click" v-model="visible2">
                <div class="xxBox">
                    <!-- <el-empty :image-size="60" v-if="tableData.length == 0"></el-empty> -->
                    <el-empty :image-size="88" v-if="tableData.length == 0"></el-empty>
                    <div class="xxBoxCen" v-if="tableData.length>0">
                        <span style="font-size:12px;" class="num">共<span style="color:red">{{formatToScientificNotation(total)}}</span>条数据</span>
                        <ul>
                            <li v-for="(item,index) in tableData" :key="index">
                                <span class="p1"><img src="../../assets/images/xiaoxi.png" alt=""></span>
                                <span class="p2">
                                    <span>{{item.problemTypeTxt}}：</span>
                                    <el-tooltip class="item" effect="dark" :content="item.problemDescription" placement="top" v-if="item.problemDescription.length>10">
                                        <span>{{item.problemDescription}}</span>
                                    </el-tooltip>
                                    <span v-if="item.problemDescription.length<=10">{{item.problemDescription}}</span>
                                </span>
                                <span class="p3">
                                    <!-- <el-button type="text" size="mini" :disabled="item.readState == 2" @click="dType(item)">{{item.readStateTxt}}</el-button> -->
                                    <el-button type="text" size="mini"  @click="hf(item)">回复</el-button>
                                    <!-- <span style="font-size:12px" class="spp">已读</span> -->
                                    <!-- <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-more"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>已读</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown> -->
                                    <!-- <i class="el-icon-more"></i> -->
                                </span>
                            </li>
                        </ul>
                        
                    </div>
                    <div class="xxBoxBot">
                        <span>
                            <!-- <el-button type="text" size="mini" @click="readAll" v-if="total>0">全部已读</el-button> -->
                        </span>
                        <span><el-button type="text" size="mini" @click="seeAll">查看全部</el-button></span>
                    </div>
                </div>

                <!-- 问题反馈消息 -->
                <!-- <el-badge :value="100" :max="10" class="item"> -->
                <el-button slot="reference" type="text" style="color:#000000;fontSize:20px;marginRight:15px" @click="messageChange" v-if="total==0">
                    <!-- <i class="el-icon-bell xs"></i> -->
                    <el-tooltip class="item" effect="dark" content="问题反馈" placement="bottom">
                        <i class="el-icon-bell xs"></i>
                    </el-tooltip>
                </el-button>
                <!-- </el-badge> -->
                <el-button slot="reference" type="text" style="color:#000000;fontSize:20px;marginRight:15px" @click="messageChange" v-if="total>0">
                    <el-badge :value="total" :max="99" class="item">
                        <el-tooltip class="item" effect="dark" content="问题反馈" placement="bottom">
                            <i class="el-icon-bell xs"></i>
                        </el-tooltip>
                    </el-badge>
                </el-button>
            </el-popover>

            <!-- 导出任务 -->
            <el-popover placement="bottom" width="400" trigger="click" v-model="visible3">
                <div class="xxBox">
                    <!-- <el-empty :image-size="60" v-if="tableData.length == 0"></el-empty> -->
                    <el-empty :image-size="88" v-if="tableData2.length == 0"></el-empty>
                    <div class="xxBoxCen" v-if="tableData2.length>0">
                        <span style="font-size:12px;" class="num">共<span style="color:red">{{total2}}</span>条数据</span>
                        <ul>
                            <li v-for="(item,index) in tableData2" :key="index">
                                <span class="p1"><img src="../../assets/images/xiaoxi.png" alt=""></span>
                                <span class="p22">
                                    <span>{{item.menuTypeTxt}}</span>
                                    <span class="span22">{{item.createTime}}</span>
                                </span>
                                <span class="p3">
                                    <el-button type="text" size="mini"  @click="down(item)">下载</el-button>
                                </span>
                            </li>
                        </ul>
                        
                    </div>
                    <div class="xxBoxBot">
                        <span></span>
                        <span><el-button type="text" size="mini" @click="seeAll2">查看全部</el-button></span>
                    </div>
                </div>

                <!-- <el-badge :value="100" :max="10" class="item"> -->
                <el-button slot="reference" type="text" style="color:#000000;fontSize:20px;marginRight:15px" @click="taskChange" v-if="total2==0">
                    <el-tooltip class="item" effect="dark" content="导出任务" placement="bottom">
                        <i class="el-icon-mobile xs"></i>
                    </el-tooltip>
                </el-button>
                <!-- </el-badge> -->
                <el-button slot="reference" type="text" style="color:#000000;fontSize:20px;marginRight:15px" @click="taskChange" v-if="total2>0">
                    <el-badge :value="total2" :max="99" class="item">
                        <el-tooltip class="item" effect="dark" content="导出任务" placement="bottom">
                            <i class="el-icon-mobile xs"></i>
                        </el-tooltip>
                    </el-badge>
                </el-button>
            </el-popover>



            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar" />
                    <!-- <i class="el-icon-caret-bottom" /> -->
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item @click.native="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 添加或修改站点关系对话框 -->
        <el-dialog title="问题反馈" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules"  label-width="100px">
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
                                <span class="sp1" style="min-width: 60px;"未更新标题：</span>
                                <span class="sp2 dz" @click="dzChange(infoListObj.updateUrl)">{{infoListObj.updateTitle}}</span>
                            </li>
                            <li>
                                <span class="sp1" style="min-width: 60px;"主页地址：</span>
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";

import { getList,inspFeedbackEdit,readAll,getInfo } from "@/api/biz/MessageManagement";
import { 
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

import {
    list,
    removeTask,
    editTask
} from "@/api/biz/export";


export default {
    components: {
        Breadcrumb,
        TopNav,
        Hamburger,
        Screenfull,
        SizeSelect,
        Search,
        RuoYiGit,
        RuoYiDoc
    },
    computed: {
        ...mapGetters(["sidebar", "avatar", "device"]),
        setting: {
            get() {
                return this.$store.state.settings.showSettings;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "showSettings",
                    value: val
                });
            }
        },
        topNav: {
            get() {
                return this.$store.state.settings.topNav;
            }
        }
    },
    data() {
        return {

            visible2: false, // 切换弹窗

            total: 0, // 总条数
            tableData: [],
            queryFrom: {
                id: null,
                dataId: null,
                pgNum: 1,
                pgSize: 5,
                problemType: null, // 问题类型
                feedbackState: 1, // 反馈状态
                readState: null, // 阅读状态
            },

            open: false,

            form: {},
            rules: {
                replyDescription: [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
            },
            infoObj: {},

            infoListObj: {},

            requireTypeDate: [], // 规则分类
            typeDate: [], // 规则类型

            // 导出任务
            visible3: false,
            total2: 0, // 总条数
            tableData2: [],
            queryFrom2: {
                pgNum: 1,
                pgSize: 5,
                downloadState: 0,
                batchType: 2
            },
            menuTypeList: [
                // 网站
                { label: '网站-错误内容-日常', val: 0 },
                { label: '网站-错误内容-定期', val: 1 },

                { label: '网站-敏感信息-日常', val: 10 },
                { label: '网站-敏感信息-定期', val: 11 },

                { label: '网站-隐私泄露-日常', val: 20 },
                { label: '网站-隐私泄露-定期', val: 21 },

                { label: '网站-图片监测-日常', val: 30 },
                { label: '网站-图片监测-定期', val: 31 },

                { label: '网站-视频监测-日常', val: 40 },
                { label: '网站-视频监测-定期', val: 41 },

                { label: '网站-音频监测-日常', val: 50 },
                { label: '网站-音频监测-定期', val: 51 },

                { label: '网站-附件监测-日常', val: 60 },
                { label: '网站-附件监测-定期', val: 61 },

                { label: '网站-首页更新-日常', val: 70 },

                { label: '网站-栏目更新-日常', val: 80 },

                { label: '网站-首页稿件-详情', val: 90 },
                { label: '网站-首页稿件', val: 102 },

                { label: '网站-栏目稿件-详情', val: 100 },
                { label: '网站-栏目稿件', val: 101 },

                { label: '网站-首页连通', val: 110 },
                { label: '网站-首页连通-汇总', val: 111 },

                { label: '网站-栏目连通', val: 113 },
                { label: '网站-栏目连通-汇总', val: 112 },

                { label: '网站-错链信息-日常', val: 120 },
                { label: '网站-错链信息-定期', val: 121 },

                { label: '网站-外链信息-日常', val: 130 },
                { label: '网站-外链信息-定期', val: 131 },

                { label: '网站-规范检查', val: 140 },

                // 新媒体
                { label: '新媒体-账号更新', val: 150 },

                { label: '新媒体-断更统计', val: 182 },

                { label: '新媒体-错误内容-日常', val: 160 },
                { label: '新媒体-错误内容-定期', val: 161 },

                { label: '新媒体-敏感信息-日常', val: 170 },
                { label: '新媒体-敏感信息-定期', val: 171 },

                { label: '新媒体-隐私泄露-日常', val: 180 },
                { label: '新媒体-隐私泄露-定期', val: 181 },

                { label: '新媒体-断更统计', val: 182 },

                { label: '新媒体-外链信息', val: 230 },

                { label: '新媒体-图片监测-日常', val: 190 },
                { label: '新媒体-图片监测-定期', val: 191 },

                { label: '新媒体-视频监测-日常', val: 200 },
                { label: '新媒体-视频监测-定期', val: 201 },

                { label: '新媒体-音频监测-日常', val: 210 },
                { label: '新媒体-音频监测-定期', val: 211 },

                { label: '新媒体-附件监测-日常', val: 220 },
                { label: '新媒体-附件监测-定期', val: 221 },

                { label: '新媒体-运营榜单', val: 600 },
                { label: '新媒体-运营榜单-微信', val: 610 },
                { label: '新媒体-运营榜单-微博', val: 620 },
                { label: '新媒体-运营榜单-抖音', val: 630 },
                { label: '新媒体-运营榜单-头条', val: 640 },
                { label: '新媒体-运营榜单-快手', val: 650 },

                { label: '全局检索', val: 700 },


                // 网站安全
                // 后台
                { label: '网站安全-HTTP监测', val: 290 },
                { label: '网站安全-DNS监测', val: 300 },
                { label: '网站安全-错链信息', val: 310 },
                { label: '网站安全-暗链外链', val: 320 },
                { label: '网站安全-挖矿', val: 330 },
                { label: '网站安全-网页木马', val: 340 },
                { label: '网站安全-弱密码', val: 350 },
                { label: '网站安全-网页篡改', val: 360 },
                { label: '网站安全-网站漏洞', val: 370 },
                { label: '网站安全-PING监测', val: 380 },
                { label: '网站安全-端口变动', val: 390 },
                { label: '网站安全-子域名变动', val: 400 },
                { label: '网站安全-SSL证书信息', val: 410 },
                // 前台
                { label: '网站安全-HTTP监测', val: 420 },
                { label: '网站安全-DNS监测', val: 430 },
                { label: '网站安全-错链信息', val: 440 },
                { label: '网站安全-暗链外链', val: 450 },
                { label: '网站安全-挖矿', val: 460 },
                { label: '网站安全-网页木马', val: 470 },
                { label: '网站安全-弱密码', val: 480 },
                { label: '网站安全-网页篡改', val: 490 },
                { label: '网站安全-网站漏洞', val: 500 },
                { label: '网站安全-PING监测', val: 510 },
                { label: '网站安全-端口变动', val: 520 },
                { label: '网站安全-子域名变动', val: 530 },
                { label: '网站安全-SSL证书信息', val: 540 },
            ],

            wtlxList: [
                // 网站 1-140
                { label: '错误内容-日常', val: 1 },
                { label: '错误内容-定期', val: 10 },

                { label: '敏感信息-日常', val: 2 },
                { label: '敏感信息-定期', val: 20 },

                { label: '隐私泄露-日常', val: 3 },
                { label: '隐私泄露-定期', val: 30 },

                { label: '首页更新', val: 4 },

                { label: '栏目更新', val: 5 },

                { label: '首页连通性', val: 6 },

                { label: '错链信息-日常', val: 7 },
                { label: '错链信息-定期', val: 70 },

                { label: '外链信息-日常', val: 8 },
                { label: '外链信息-定期', val: 80 },

                { label: '规范检查', val: 9 },

                { label: '图片监测-日常', val: 11 },
                { label: '图片监测-定期', val: 110 },

                { label: '视频监测-日常', val: 12 },
                { label: '视频监测-定期', val: 120 },

                { label: '音频监测-日常', val: 13 },
                { label: '音频监测-定期', val: 130 },
                
                { label: '附件监测-日常', val: 14 },
                { label: '附件监测-定期', val: 140 },

                // 新媒体 200-300
                { label: '账号更新', val: 200 },

                { label: '错误内容-日常', val: 210 },
                { label: '错误内容-定期', val: 211 },
                
                { label: '敏感信息-日常', val: 220 },
                { label: '敏感信息-定期', val: 221 },
                
                { label: '隐私泄露-日常', val: 230 },
                { label: '隐私泄露-定期', val: 231 },

                { label: '图片监测-日常', val: 240 },
                { label: '图片监测-定期', val: 241 },

                { label: '视频监测-日常', val: 250 },
                { label: '视频监测-定期', val: 251 },

                { label: '音频监测-日常', val: 260 },
                { label: '音频监测-定期', val: 261 },

                { label: '附件监测-日常', val: 270 },
                { label: '附件监测-定期', val: 271 },

                { label: '外链信息', val: 280 },

                // { label: '文章稿件', val: 290 },

                // { label: '账号信息', val: 300 },

                // 网站安全

                { label: '其他', val: 10000 },
            ],


        };
    },
    created() {
        this.getListFn();
        this.getListFn2();
        setInterval(()=>{
            this.getListFn();
            this.getListFn2();
        },60000)
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        async logout() {
            this.$confirm("确定注销并退出系统吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store.dispatch("LogOut").then(() => {
                        location.href = "/index.html";
                    });
                })
                .catch(() => {});
        },

        /**消息 */
        // 反馈点击
        messageChange(){
            // this.getListFn();
        },
        // 反馈列表
        getListFn(){
            getList(this.queryFrom).then((res)=>{
                this.tableData = res.rows;
                this.total = res.total;
                for(var i in this.tableData){
                    // 问题类型
                    // if(this.tableData[i].problemType == 1){
                    //     this.tableData[i].problemTypeTxt = '错误内容';
                    // }else if(this.tableData[i].problemType == 2){
                    //     this.tableData[i].problemTypeTxt = '敏感信息';
                    // }else if(this.tableData[i].problemType == 3){
                    //     this.tableData[i].problemTypeTxt = '隐私泄露';
                    // }else if(this.tableData[i].problemType == 4){
                    //     this.tableData[i].problemTypeTxt = '首页更新';
                    // }else if(this.tableData[i].problemType == 5){
                    //     this.tableData[i].problemTypeTxt = '栏目更新';
                    // }else if(this.tableData[i].problemType == 6){
                    //     this.tableData[i].problemTypeTxt = '首页连通性';
                    // }else if(this.tableData[i].problemType == 7){
                    //     this.tableData[i].problemTypeTxt = '错链信息';
                    // }else if(this.tableData[i].problemType == 8){
                    //     this.tableData[i].problemTypeTxt = '外链信息';
                    // }else if(this.tableData[i].problemType == 9){
                    //     this.tableData[i].problemTypeTxt = '规范检查';
                    // }else if(this.tableData[i].problemType == 10){
                    //     this.tableData[i].problemTypeTxt = '其他';
                    // }
                    for(var j in this.wtlxList){
                        if(this.tableData[i].bizType == 1){ // 网站
                            if(this.tableData[i].problemType == this.wtlxList[j].val){
                                this.tableData[i].problemTypeTxt = '网站-'+this.wtlxList[j].label;
                            }
                        }else if(this.tableData[i].bizType == 20){ // 新媒体
                            if(this.tableData[i].problemType == this.wtlxList[j].val){
                                this.tableData[i].problemTypeTxt = '新媒体-'+this.wtlxList[j].label;
                            }
                        }
                        
                    }

                    // 阅读状态
                    if(this.tableData[i].readState == 1){
                        this.tableData[i].readStateTxt = '未读';
                    }else if(this.tableData[i].readState == 2){
                        this.tableData[i].readStateTxt = '已读';
                    }
                    
                }
                console.log(this.tableData,'this.tableData')
                // enabledTxt
            })
        },
        // 查看全部
        seeAll(){
            this.visible2 = false;
            this.$router.push({ path: "/feedback" });
            // this.visible2 = false;
            // management/MessageManagement/ProblemFeedback
        },
        // 回复
        hf(row){
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

                for(var i in this.wtlxList){
                    if(this.form.problemType == this.wtlxList[i].val && row.bizType == 1){ // 网站
                        this.infoObj.problemTypeTxt = '网站 / '+this.wtlxList[i].label;
                    }else if(this.form.problemType == this.wtlxList[i].val && row.bizType == 20){ // 新媒体
                        this.infoObj.problemTypeTxt = '新媒体 / '+this.wtlxList[i].label;
                    }
                }

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
                            this.infoListObj.ico = require('../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../assets/images/qt.png')
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
                            this.infoListObj.ico = require('../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../assets/images/qt.png')
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
                            this.infoListObj.ico = require('../../assets/images/wx.jpeg')
                        }else if(this.infoListObj.mediaType == 2){
                            this.infoListObj.ico = require('../../assets/images/wb.jpeg')
                        }else if(this.infoListObj.mediaType == 3){
                            this.infoListObj.ico = require('../../assets/images/dy.jpeg')
                        }else if(this.infoListObj.mediaType == 4){
                            this.infoListObj.ico = require('../../assets/images/tt.jpeg')
                        }else if(this.infoListObj.mediaType == 5){
                            this.infoListObj.ico = require('../../assets/images/ks.jpeg')
                        }else if(this.infoListObj.mediaType == 111){
                            this.infoListObj.ico = require('../../assets/images/yd.png')
                        }else if(this.infoListObj.mediaType == 112){
                            this.infoListObj.ico = require('../../assets/images/rm.png')
                        }else if(this.infoListObj.mediaType == 113){
                            this.infoListObj.ico = require('../../assets/images/bj.png')
                        }else if(this.infoListObj.mediaType == 117){
                            this.infoListObj.ico = require('../../assets/images/tx.png')
                        }else if(this.infoListObj.mediaType == 118){
                            this.infoListObj.ico = require('../../assets/images/qe.png')
                        }else if(this.infoListObj.mediaType == 119){
                            this.infoListObj.ico = require('../../assets/images/nf.png')
                        }else if(this.infoListObj.mediaType == 120){
                            this.infoListObj.ico = require('../../assets/images/ydh.png')
                        }else if(this.infoListObj.mediaType == 121){
                            this.infoListObj.ico = require('../../assets/images/wy.png')
                        }else if(this.infoListObj.mediaType == 122){
                            this.infoListObj.ico = require('../../assets/images/xcx.png')
                        }else if(this.infoListObj.mediaType == 123){
                            this.infoListObj.ico = require('../../assets/images/dy.png')
                        }else if(this.infoListObj.mediaType == 124){
                            this.infoListObj.ico = require('../../assets/images/sh.png')
                        }else if(this.infoListObj.mediaType == 125){
                            this.infoListObj.ico = require('../../assets/images/pp.png')
                        }else {
                            this.infoListObj.ico = require('../../assets/images/qt.png')
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
                        this.getListFn();
                    });
                }
            });
        },
        // 地址超链接
        dzChange(url){
            if(url != null && url != ''){
                window.open(url)
            }
        },


        /**导出任务 */
        taskChange(){
            
        },
        // 下载
        down(row){
            if(row.filePath){
                let subDate = {
                    id: row.id,
                    downloadState: 1,
                }
                editTask(subDate).then((res)=>{
                    setTimeout(()=>{
                        this.getListFn2();
                    },1000)
                })
                window.open(row.filePath);
            }
            
        },
        // 查看全部
        seeAll2(){
            this.visible3 = false;
            this.$router.push({ path: "/exportTask" });
            // this.visible2 = false;
            // management/MessageManagement/ProblemFeedback
        },
        // 反馈列表
        getListFn2(){
            list(this.queryFrom2).then((res)=>{
                this.tableData2 = res.rows;
                this.total2 = res.total;
                for(var i in this.tableData2){
                    this.tableData2[i].index = parseInt(i)+1;
                    // 来源
                    for(var j in this.menuTypeList){
                        if(this.tableData2[i].menuType == this.menuTypeList[j].val){
                            this.tableData2[i].menuTypeTxt = this.menuTypeList[j].label;
                        }
                    }
                }
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        // line-height: 50px;
        display: flex;
        align-items: center;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 100%;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
.xxBox{
    display: flex;
    flex-direction: column;
    height: 250px;
    // height: 220px;
    .xxBoxCen{
        flex: 1;
        overflow: auto;
        .num{
            display: block;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 8px;
        }
        ul{
            padding-left: 10px;
            // border-top: 1px solid #f0f0f0;
            li{
                list-style: none;
                display: flex;
                align-items: center;
                height: 30px;
                .p1{
                    margin-top: 5px;
                    img{
                        width:15px;
                        height: 15px;
                    }
                }
                .p2,.p22{
                    flex: 1;
                    margin-left: 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .p22{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .span22{
                        font-size: 12px;
                    }
                }
                .p3{
                    width: 40px;
                    margin-left: 20px;
                }
            }
        }
    }
    .xxBoxBot{
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        background: transparent; /* 如果需要的话 */
    }
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
</style>
<style lang="scss">
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
    font-weight: bolder !important;
}
.el-breadcrumb__inner,
.el-breadcrumb__inner a:hover {
    cursor: pointer;
    // color: #1890ff;
}
</style>
