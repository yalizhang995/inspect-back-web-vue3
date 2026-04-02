<template>
    <div class="app-container errorsPage" >
        <!-- 添加或修改站点关系对话框 -->
        <el-dialog :title="titleTxt" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" class="addCl" @close="cancel" >
            <el-form ref="form" :model="form" :rules="rules" label-width="0" v-loading="diaLoading">
                
                <div style="display: flex;justify-content: space-between;">
                    <!-- 签名类型 -->
                    <div style="width: 49%">
                        <span class="spClass"><span class="x">*</span>签名类型</span>
                        <el-form-item label="" prop="signatureType">
                            <el-select v-model="form.signatureType" placeholder="请选择" style="width: 100%" size="small">
                                <el-option v-for="item in signatureTypeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 产品类型 -->
                    <div style="width: 49%">
                        <span class="spClass"><span class="x">*</span>产品类型</span>
                        <el-form-item label="" prop="productType">
                            <el-select v-model="form.productType" clearable placeholder="请选择" style="width: 100%" size="small" :disabled="openType == 2" @change="productTypeChange">
                                <el-option v-for="item in productTypeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    
                   
                </div>
                <div style="display: flex;justify-content: space-between;marginTop: -5px;">
                     <!-- 客户类型 -->
                    <div style="width: 49%" v-if="form.productType">
                        <span class="spClass"><span class="x">*</span>客户类型</span>
                        <el-form-item label="" prop="siteType">
                            <el-select v-model="form.siteType" clearable placeholder="请选择" style="width: 100%" size="small" @change="siteTypeChange" :disabled="openType == 2" @clear="occurrenceUnitType = true">
                                <el-option v-for="item in siteTypeList" :key="item.val" :label="item.label" :value="item.val"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <!-- 选择客户 -->
                    <div style="width: 49%" v-if="form.productType && form.siteType">
                        <span class="spClass"><span class="x">*</span>选择客户</span>
                        <el-form-item label="" prop="siteCode">
                            <!-- <el-select v-model="form.siteCode" clearable placeholder="请选择" style="width: 100%" size="small">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select> -->
                            <!-- <el-select v-model="form.siteCode" filterable clearable placeholder="请输入并选择站点" style="width:95.8%"  remote :remote-method="remoteMethod" >
                                <el-option
                                    v-for="item in treeInfoDate"
                                    :key="item.siteCode"
                                    :label="item.label"
                                    :value="item.siteCode"
                                ></el-option>
                            </el-select> -->
                            <el-autocomplete
                                v-model="form.siteCode"
                                :fetch-suggestions="querySearchAsync"
                                placeholder="请输入网站名称/标识码"
                                clearable
                                style="width:100%"
                                @select="handleSelectCompany"
                                @clear="form.siteCode = null"
                                size="small"
                                :disabled="openType == 2"
                            ></el-autocomplete>
                        </el-form-item>
                    </div>
                    
                </div>
                <!-- 客户消息接收人 -->
                <div style="marginTop: -5px;" v-if="this.form.siteCode">
                    <span class="spClass">客户消息接收人</span>
                    <span class="spClass2">负责人</span>
                    <el-form-item label="" prop="">
                        <el-table
                            ref="fzrTable"
                            v-loading="loading"
                            :data="fzrList"
                            @selection-change="handleSelectionChange"
                            size="mini"
                            max-height="160"
                            row-key="id"
                        >
                            <el-table-column type="selection" width="50" align="center" />
                            <el-table-column prop="userName" label="姓名"  fixed show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cellPhone" label="电话"  fixed show-overflow-tooltip></el-table-column>
                            <el-table-column prop="emailInfo" label="邮箱"  fixed show-overflow-tooltip></el-table-column>
                        </el-table>
                    </el-form-item>
                    <span class="spClass2">联系人</span>
                    <el-form-item label="" prop="">
                        <el-table
                            ref="lxrTable"
                            v-loading="loading"
                            :data="lxrList"
                            @selection-change="handleSelectionChange2"
                            size="mini"
                            max-height="160"
                            row-key="id"

                        >
                            <el-table-column type="selection" width="50" align="center" />
                            <el-table-column prop="userName" label="姓名"  fixed show-overflow-tooltip></el-table-column>
                            <el-table-column prop="cellPhone" label="电话"  fixed show-overflow-tooltip></el-table-column>
                            <el-table-column prop="emailInfo" label="邮箱"  fixed show-overflow-tooltip></el-table-column>
                        </el-table>
                    </el-form-item>
                </div>
                <!-- 发生单位 -->
                <div style="marginTop: -5px;">
                    <span class="spClass"><span class="x">*</span>发生单位</span>
                    <el-form-item label="" prop="occurrenceUnit">
                        <div>
                            <el-button :type="btnIndex == index ? 'primary' : ''" size="mini" v-for="(item,index) in btnList" :key="index" @click="fsdwChange(item,index)" :disabled="occurrenceUnitType">{{item.label}}</el-button>
                            <!-- <el-button size="mini">自定义单位</el-button>
                            <el-button size="mini">全部单位</el-button> -->
                        </div>
                        <div v-if="btnIndex == 1">
                            <el-button icon="el-icon-s-operation" size="mini" @click="zdyChange">选择</el-button>
                            <el-button size="mini" :disabled="yxxNum == 0" @click="zdyChange">已选{{yxxNum}}项</el-button>
                        </div>
                    </el-form-item>
                </div>
                <!-- 单位消息接收人 -->
                <div style="marginTop: -5px" class="dwxxjsBox">
                    <!-- <span class="spClass"><span class="x">*</span>单位消息接收人</span> -->
                    <span class="spClass">单位消息接收人</span>
                    <el-form-item label="" prop="" style="marginTop: -8px">
                        <el-checkbox-group v-model="form.messageRecipientArr">
                            <el-checkbox v-for="item in messageRecipientList" :key="item.value" :label="item.value" :disabled="item.disabledS">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <!-- 网站排除站点 -->
                <div style="marginTop: -15px;marginBottom: 30px" v-if="form.productType == 1">
                    <span class="spClass">网站排除站点</span>
                    <el-form-item label="" prop="excludeSiteCodesText">
                        <el-input type="textarea" :rows="3" placeholder="请输入填报单位标识码，多个以英文逗号分割" v-model="form.excludeSiteCodesText" style="marginBottom:5px"></el-input>
                    </el-form-item>
                </div>
                <!-- 排除新媒体账号 -->
                <div style="marginTop: -10px;" v-if="form.productType == 2">
                    <span class="spClass">排除新媒体账号</span>
                    <el-form-item label="" prop="strategyName">
                        <el-button size="mini" @click="pcChange" :disabled="siteCode == null || siteCode == ''">选择账号</el-button>
                        <span style="margin:0 10px">已选{{mediaSiteNames.length}}项</span>
                        <span style="color:#e6a23c">排除的账号所触发配置的预警项，将不发送预警消息</span>
                    </el-form-item>
                </div>
                <!-- 策略名称 -->
                <div style="marginTop: -10px;">
                    <span class="spClass"><span class="x">*</span>策略名称</span>
                    <el-form-item label="" prop="strategyName">
                        <el-input placeholder="请输入内容" v-model="form.strategyName" clearable style="width: 100%" size="small" ></el-input>
                    </el-form-item>
                </div>
                <!-- 触发条件 -->
                <!-- 网站 -->
                <div style=";position: relative;marginTop: -5px" class="cftjClass" v-if="yjxList.length > 0 && form.productType == 1">
                    <span class="spClass"><span class="x">*</span>触发条件</span>
                    <el-form-item label="" prop="confirmedDetailsArr" style="marginTop: -8px" class="yjxBox">
                        <el-checkbox-group v-model="form.confirmedDetailsArr">
                            <el-checkbox v-for="(item,index) in confirmedDetailsList" :key="item.value" :label="item.value" style="width: 90%;marginTop:20px" :disabled="item.type" @change="confirmedDetailsChange($event,item.value,index)">
                                {{ item.label }}
                                <span class="tit" v-if="item.titShow">（已整改、无需整改的数据不发送预警）</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- 确定不连通 -->
                    <div class="dxDivBox">
                        <div>
                            连续出现
                            <el-input-number v-model="form.confirmSum" :min="1" :max="10" label="描述文字" style="width:110px" size="mini" :disabled="openType == 1 && confirmedDetailsList[0].type"></el-input-number>
                            次时，发送预警信息；
                        </div>
                        <div style="margin:0 10px 0 15px">
                            全天最多发送
                            <el-input-number v-model="form.confirmDaySum" :min="1" :max="5" label="描述文字" style="width:110px" size="mini" :disabled="openType == 1 && confirmedDetailsList[0].type"></el-input-number>
                            次预警信息；
                        </div>
                        <el-checkbox-group v-model="form.confirmSendDay">
                            <!-- <el-checkbox label="全天接收" :disabled="openType == 1 && confirmedDetailsList[0].type"></el-checkbox> -->
                            <el-checkbox v-for="item in confirmSendDay" :key="item.value" :label="item.value" :disabled="openType == 1 && confirmedDetailsList[0].type">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- 恢复连通 -->
                    <div class="dxDivBox2">
                        <div>
                            连续出现
                            <el-input-number v-model="form.recoverSum" :min="1" :max="10" label="描述文字" style="width:110px" size="mini" ></el-input-number>
                            次时，发送预警信息；
                        </div>
                        <div style="margin:0 10px 0 15px">
                            全天最多发送
                            <el-input-number v-model="form.recoverDaySum" :min="1" :max="5" label="描述文字" style="width:110px" size="mini" :disabled="true"></el-input-number>
                            次预警信息；
                        </div>
                        <el-checkbox-group v-model="form.recoverSendDay">
                            <!-- <el-checkbox label="全天接收" :disabled="openType == 1 && confirmedDetailsList[1].type"></el-checkbox> -->
                            <el-checkbox v-for="item in recoverSendDay" :key="item.value" :label="item.value" :disabled="true">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- 疑似不连通 -->
                    <div class="dxDivBox3">
                        <div>
                            连续出现
                            <el-input-number v-model="form.suspectedSum" :min="1" :max="10" label="描述文字" style="width:110px" size="mini" :disabled="openType == 1 && confirmedDetailsList[2].type"></el-input-number>
                            次时，发送预警信息；
                        </div>
                        <div style="margin:0 10px 0 15px">
                            全天最多发送
                            <el-input-number v-model="form.suspectedDaySum" :min="1" :max="5" label="描述文字" style="width:110px" size="mini" :disabled="openType == 1 && confirmedDetailsList[2].type"></el-input-number>
                            次预警信息；
                        </div>
                        <el-checkbox-group v-model="form.suspectedSendDay">
                            <!-- <el-checkbox label="全天接收" :disabled="openType == 1 && confirmedDetailsList[2].type"></el-checkbox> -->
                            <el-checkbox v-for="item in suspectedSendDay" :key="item.value" :label="item.value" :disabled="openType == 1 && confirmedDetailsList[2].type">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!-- 首页未更新天数 -->
                    <div class="dxDivBox4">
                        <div>
                            <el-input-number v-model="form.webUpdateDay" :min="2" :max="14" label="描述文字" style="width:110px" size="mini" :disabled="openType == 1 && confirmedDetailsList[3].type"></el-input-number>
                            天未更新
                        </div>
                    </div>
                    <!-- <div class="dxDivBox5">领导人姓名/职务/排序、涉及港/澳/台/领土主权、政治敏感信息、法律法规、民族宗教等内容的错别字、敏感词问题。</div> -->
                    <div class="dxDivBox5">领导人姓名/职务/排序等内容的错别字问题。</div>
                    <div class="dxDivBox6">涉及港/澳/台/领土主权、政治敏感信息、法律法规、民族宗教等内容的敏感词问题。</div>
                    <div class="dxDivBox7">公民个人隐私泄露，不直接被公开报道姓名的群体问题。</div>
                    <div class="dxDivBox8">商业广告外链、钓鱼网址、恶意网址等问题。</div>
                </div>
                <!-- 新媒体 -->
                <div style=";position: relative;marginTop: -5px" class="cftjClass" v-if="yjxList.length > 0 && form.productType == 2">
                    <span class="spClass"><span class="x">*</span>触发条件</span>
                    <el-form-item label="" prop="confirmedDetailsArr" style="marginTop: -8px" class="yjxBox2">
                        <el-checkbox-group v-model="form.confirmedDetailsArr">
                            <el-checkbox v-for="(item,index) in confirmedDetailsList" :key="item.value" :label="item.value" style="width: 90%;marginTop:20px" :disabled="item.type" @change="confirmedDetailsChange($event,item.value,index)">
                                {{ item.label }}
                                <span class="tit" v-if="item.titShow">（已整改、无需整改的数据不发送预警）</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <div class="dxDivBox10">
                        <div>
                            新媒体账号超过
                            <el-input-number v-model="form.mediaUpdateDay" :min="2" :max="14" label="描述文字" style="width:110px" size="mini"></el-input-number>
                            天未更新
                        </div>
                    </div>
                    <div class="dxDivBox11">领导人姓名/职务/排序等内容的错别字问题。</div>
                    <div class="dxDivBox12">涉及港/澳/台/领土主权、政治敏感信息、法律法规、民族宗教等内容的敏感词问题。</div>
                    <div class="dxDivBox13">公民个人隐私泄露，不直接被公开报道姓名的群体问题。</div>
                    <div class="dxDivBox14">商业广告外链、钓鱼网址、恶意网址等问题。</div>
                    
                </div>
                <!-- 接收日期 -->
                <div :class="yjxList.length > 0 ? 'marginClass' : ''">
                    <span class="spClass"><span class="x">*</span>接收日期</span>
                    <el-form-item label="" prop="receiptDate">
                        <el-select v-model="form.receiptDate" clearable placeholder="请选择" style="width: 100%" size="small">
                            <el-option v-for="item in receiptDateList" :key="item.val" :label="item.label" :value="item.val"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <!-- 有效时间段 -->
                <div >
                    <span class="spClass"><span class="x">*</span>有效时间段<span class="tit">（仅发送有效时间段内产生的预警信息）</span></span>
                    <div class="sjdBox">
                        <el-form-item label="" prop="effectiveStartTime" style="width: 48%">
                            <!-- <el-date-picker v-model="form.effectiveStartTime" type="date" placeholder="选择日期" size="small"></el-date-picker> -->
                            <el-time-picker v-model="form.effectiveStartTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="开始时间点" size="small" style="width: 100%"></el-time-picker>
                        </el-form-item>
                        <span class="zhi">至</span>
                        <el-form-item label="" prop="effectiveEndTime" style="width: 48%">
                            <!-- <el-date-picker v-model="form.effectiveEndTime" type="date" placeholder="选择日期" size="small"></el-date-picker> -->
                            <el-time-picker v-model="form.effectiveEndTime" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="结束时间点" size="small" style="width: 100%"></el-time-picker>
                        </el-form-item>
                    </div>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>

            <!-- 自定义单位 -->
            <el-dialog width="1000px" title="自定义单位" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel2" class="zdyBox">
                <div class="divBox">
                    <div class="divLeft" >
                        <div class="treeSearch">
                            <!-- <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                                <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                            </el-input> -->
                            <el-input placeholder="组织单位名称/标识码" v-model="filterText" size="mini" style="marginBottom: 10px" clearable></el-input>
                        </div>
                        <div class="treeDiv" v-loading="treeLoading">
                            <el-tree
                                ref="tree" 
                                node-key="siteCode"
                                :data="inspSiteTreeList"
                                :props="inspSiteTreeList"
                                show-checkbox
                                @check-change="handleCheckChange"
                                :default-expanded-keys="treeSiteCode"
                                :default-checked-keys="form.organizationSiteCodeList"
                                v-if="inspSiteTreeList.length"
                                :highlight-current="highlightBd"
                                :check-strictly="true"
                                :filter-node-method="filterNode"
                            >
                                <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                    <div class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >
                                        <div class="label">{{ node.label }}</div>
                                        <!-- <el-checkbox @click.native.stop="treeChange(node, data)">全选</el-checkbox> -->
                                        <el-checkbox 
                                            v-model="data.checked"
                                            @change="(val) => handleCheckboxChange(val, node, data)"
                                            @click.native.stop
                                            v-if="data.children.length > 0"
                                        >全选</el-checkbox>
                                    </div>
                                </el-tooltip>
                            </el-tree>
                        </div>
                        <!-- <span class="jt"><i :class='jtIco' @click="jtChange" ></i></span> -->
                    </div>
                    <!-- 筛选 -->
                    <div class="divCen">
                        <div>
                            <el-input placeholder="填报单位名称/标识码" v-model="tbSiteCode" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch">
                                <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                            </el-input>
                        </div>
                        <div class="divCenCT"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox></div>
                        <div class="divCenC">
                            <el-checkbox-group v-model="form.siteCodes" @change="handleCheckedCitiesChange" size="mini" v-if="cities.length > 0">
                                <el-checkbox v-for="(item,index) in cities" :label="item.siteCode" :key="index" border style="width:100%">
                                    <div class="dxBox">
                                        <span class="spsp1">{{item.siteName}}</span>
                                        <span>{{item.siteCode}}</span>
                                    </div>
                                </el-checkbox>
                            </el-checkbox-group>
                            <el-empty :image-size="100" v-if="cities.length == 0"></el-empty>
                        </div>
                    </div>
                    <!-- 结果 -->
                    <div class="divRight">
                        <div class="divRightT">
                            <div>已选<span style="color:red;margin:0 2px;">{{siteNames.length}}</span>项</div>
                            <el-button type="text" size="mini" @click="clearSiteNames">全部清空</el-button>
                        </div>
                        <div class="divRightTC">
                            <div class="jgLi" v-for="(item,index) in this.siteNames" v-if="siteNames.length > 0">
                                <span class="jgLiL">{{item.siteName}}</span>
                                <span @click="delSiteNames(item,index)"><i class="el-icon-close" style="color:#409EFF;cursor: pointer;"></i></span>
                            </div>
                            <el-empty :image-size="100" v-if="siteNames.length == 0"></el-empty>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm2">确 定</el-button>
                    <el-button @click="cancel2">取 消</el-button>
                </div>
            </el-dialog>

            <!-- 排除账号 -->
            <el-dialog width="1000px" title="选择账号" :visible.sync="pcInnerVisible" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" @close="cancel2" class="zdyBox">
                <div class="pcBox">
                    <!-- 筛选 -->
                    <div class="pcCen">
                        <div>
                            <el-input placeholder="账号名称/新媒体标识码" v-model="pcQueryParams.keyWord" size="mini" class="input-with-select" style="marginBottom: 10px" clearable @clear="clearSearch2">
                                <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch2"></el-button>
                            </el-input>
                        </div>
                        <el-table
                            v-loading="pcLoading"
                            :data="inspMediaInfoList"
                            @select="handleSelectionChange3"
                            @select-all="handleSelectAll"
                            fit
                            class="pcTable"
                            ref="pcTable"
                        >
                            <el-table-column type="selection" width="55" align="center" />
                            <el-table-column label="账号名称" align="" prop="accountName" width="220" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <div class="zhxx">
                                        <span class="icoSp"><img :src="scope.row.ico" alt="" class="ico"></span>
                                        <span>{{scope.row.accountName}}</span>
                                    </div>
                                </template>
                            </el-table-column>         
                            <el-table-column label="新媒体标识码" align="" prop="siteCodeMedia" width="160"/>
                        </el-table>
                        <!-- <pagination
                            v-show="pcTotal>0"
                            :total="pcTotal"
                            :page.sync="pcQueryParams.pgNum"
                            :limit.sync="pcQueryParams.pgSize"
                            @pagination="getMediaListFn"
                        /> -->
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            :page-size="pcQueryParams.pgSize"
                            :total="pcTotal"
                            v-show="pcTotal>0"
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
                                <span class="jgLiL"><img :src="item.ico" alt="">{{item.accountName}}（{{item.siteCodeMedia}}）</span>
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
        </el-dialog>
    </div>
</template>

<script>
import {
    getWarnStrategyInfoList,
    warnStrategyInfoAdd,
    getInspSiteTreeList,
    getInspSiteDirector,
    getConfigurable,
    warnStrategyInfoEdif,
    getWarnStrategyInfo,
    getOrganizationUnit,
    getUnit,
    getMediaList
} from "@/api/warn/index";
import {
    inspImportdataTask,
    downloadExcelTpl
} from "@/api/biz/wrongWords";
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
        Treeselect
    },
    props: {
        type: Boolean,
        obj: Object,
        openType: Number
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
        return {
            fzrList: [],
            lxrList: [],
            loading: false,
            treeLoading: false,
            diaLoading: false,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 非单个禁用
            single2: true,
            // 非多个禁用
            multiple2: true,
            // 弹出层标题
            open: false, 
            titleTxt: '产品预警监控策略',

            activeName: '1',
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                productType: null, // 产品类型
                customerInformation: null, // 客户名称
                enabled: null, // 是否启用
                createTimeStartDate: null, // 创建时间-开始时间
                createTimeEndDate: null, // 创建时间-结束时间
                updateTimeStartDate: null, // 修改时间-开始时间
                updateEndTimeEndDate: null, // 修改时间-结束时间
                messageType: null, // 消息类型
                siteType: null, // 客户类型
            },

            DateArr: [],

            occurrenceUnitType: true,

            /**下拉菜单数据 */
            // 产品类型
            productTypeList: [ 
                { label: '网站监测', val: 1 },
                { label: '新媒体监测', val: 2 },
            ],
            // 消息类型
            messageTypeList: [
                { label: '产品预警', val: 1 },
                { label: '系统报告', val: 2 },
            ],
            // 客户类型
            siteTypeList: [
                { label: '组织单位', val: 1 },
                { label: '填报单位', val: 2 },
            ],
            // 签名类型
            signatureTypeList:[
                { label: '【北京中海宏宇】', val: 1 },
                { label: '【人民中科北京】', val: 2 },
                { label: '【内蒙古汉帅】', val: 3 },
            ],
            // 单位消息接收人
            btnIndex: 2,
            btnList: [
                { label: '本级填报单位', type: '', val: 1 },
                { label: '自定义单位', type: '', val: 2 },
                { label: '全部单位', type: '', val: 3 },
            ],
            // 接收日期
            receiptDateList: [
                { label: '每天', type: '', val: 1 },
                { label: '周一至周五', type: '', val: 2 },
                // { label: '法定工作日', type: '', val: 3 },
            ],
            // 单位消息接收人
            messageRecipientList: [
                { value: 1, label: '负责人', disabledS: false },
                { value: 2, label: '联系人', disabledS: false },
            ],
            // 触发条件
            // confirmedDetailsList: [
            //     { value: 1, label: '首页确定不连通', type: true, titShow: false },
            //     { value: 2, label: '首页恢复连通', type: true, titShow: false },
            //     { value: 3, label: '首页疑似不连通', type: true, titShow: false },
            //     { value: 4, label: '首页未更新', type: true, titShow: false },
            //     { value: 5, label: '错误内容', type: true, titShow: true },
            //     { value: 6, label: '敏感信息', type: true, titShow: true },
            //     { value: 7, label: '隐私泄露', type: true, titShow: true },
            // ],
            confirmedDetailsList: [],
            webList: [
                { value: 1, label: '首页确定不连通', type: true, titShow: false },
                { value: 2, label: '首页恢复连通', type: true, titShow: false },
                { value: 3, label: '首页疑似不连通', type: true, titShow: false },
                { value: 4, label: '首页未更新', type: true, titShow: false },
                { value: 5, label: '错误内容', type: true, titShow: true },
                { value: 6, label: '敏感信息', type: true, titShow: true },
                { value: 7, label: '隐私泄露', type: true, titShow: true },
                { value: 8, label: '异常外链', type: true, titShow: false },
                // { value: 10, label: '日报', type: true, titShow: true },
            ],
            mediaList: [
                { value: 9, label: '新媒体未更新', type: true, titShow: true },
                { value: 102, label: '错误内容', type: true, titShow: true },
                { value: 103, label: '敏感信息', type: true, titShow: true },
                { value: 104, label: '隐私泄露', type: true, titShow: true },
                { value: 105, label: '异常外链', type: true, titShow: false },
            ],

            yjxList: [],

            confirmSendDay: [
                { value: 1, label: '全天接收' },
            ],
            suspectedSendDay: [
                { value: 1, label: '全天接收' },
            ],
            recoverSendDay: [
                { value: 1, label: '全天接收' },
            ],


            // 提交表单
            form: {},
            rules: {
                productType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
                siteType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
                siteCode: [{ required: true, message: '请选择客户', trigger: 'change' }],
                showState: [{ required: true, message: '请选择操作', trigger: 'change' }],
                occurrenceUnit: [{ required: true, message: '请选择发生单位', trigger: 'change' }],
                messageRecipient: [{ required: true, message: '请选择单位消息接收人', trigger: 'change' }],
                strategyName: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
                confirmedDetailsArr: [{ required: true, message: '请选择触发条件', trigger: 'change' }],
                receiptDate: [{ required: true, message: '请选择接收日期', trigger: 'change' }],
                effectiveStartTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
                effectiveEndTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
                excludeSiteCodesText: [{ required: false, pattern: global_.siteCodes, message: global_.siteCodes_msg, trigger: 'blur' },]
            },

            // 预警策略
            
            form: {
                messageType: 1, // 消息类型
                productType: null, // 产品类型
                siteType: null, // 客户类型
                siteCode: null, // 站点标识码
                chargeIdArr: [], // 负责人id 多个英文逗号分割
                contactIdArr: [], // 联系人id 多个英文逗号分割
                messageRecipient: [], // 消息接收人
                occurrenceUnit: 3, // 发生单位
                siteCodes: [], // 监测的站点 数组
                excludeSiteCodes: [], // 排除新媒体站点 数组
                sendChannel: 1, // 发送渠道
                strategyName: null, // 策略名称
                confirmedDetailsArr: [], // 已选预警项
                confirmSum: 2, // 确认不连通连续出现次数
                confirmDaySum: 1, // 确认不连通每天最多发送次数
                confirmSendDay: [], // 确认不连通是否全天接收
                recoverSum: 2, // 恢复连通连续出现次数
                recoverDaySum: 1, // 恢复连通每天最多发送次数
                recoverSendDay: [], // 恢复连通是否全天接收
                suspectedSum: 2, // 疑似不连通连续出现次数
                suspectedDaySum: 1, // 疑似不连通每天最多发送次数
                suspectedSendDay: [], // 疑似不连通是否全天接收
                webUpdateDay: 10, // 首页超时天数
                mediaUpdateDay: 10, // 新媒体更新超时天数
                receiptDate: null, // 接收日期
                effectiveStartTime: '08:00:00', // 有效开始时间
                effectiveEndTime: '17:00:00', // 有效结束时间
                dailySendTime: null, // 日报发送时间
                organizationSiteCodeList: null,
                excludeSiteCodesText: null, // 网站排除站点（填报单位）
            },
            siteCode: null,

            editObj: {},
            timeout:  null,

            /**自定义站点 */
            innerVisible: false, // 嵌套对话框

            inspSiteTreeList: [], // 站点范围选择
            selectedKey: null,
            filterText: null,
            showTitle: true,
            tooltipTitle: "",
            highlightBd: true,

            // 全选
            treeCheckAll: false,

            yxxNum: 0,

            
            // 筛选
            checkAll: false,
            checkedCities: [], // 已选择项
            cities: [], // 数据源
            isIndeterminate: false,

            siteCodes: [], // 左侧组织单位集合
            siteCodesAll: [],

            // 右侧选中结果
            siteNames: [],

            defaultCheckedKeys: [], // 需要回显的选中节点key数组

            switchS: false,

            tbSiteCode: null,

            treeSiteCode: [],

            /**排除站点 */
            pcLoading: false,
            pcInnerVisible: false,
            inspMediaInfoList: [],
            // 查询参数
            pcQueryParams: {
                pgNum: 1,
                pgSize: 20,
                siteType: null,
                siteCode: null,
                siteCodeMedia: null,
                appType: null,
                uniqueCode: null,
                uid: null,
                homeUrl: null,
                functionType: null,
                accountName: null,
                accountSubject: null,
                accountProfile: null,
                appUserState: null,
                vipFlag: null,
                enabled: null,
                num: null,
                dataJson: null,
                scanState: null,
                province: null, // 省
                city: null, // 市 
                county: null, // 县
                keyWord: null,
            },
            // 账号类型
            appTypeList: [
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

            mediaSiteNames:[],
            // 非单个禁用
            single3: true,
            // 非多个禁用
            multiple3: true,
            pcTotal: 0,
            excludeSiteCodes: [],

            currentPageData: [],
            
            oldList: [],

            delArr: []


            
        };
    },
    watch: {
        siteCode(newVal, oldVal) {
            if(oldVal && newVal !== oldVal){
                // 自定义
                this.cities = []; // 中间筛选
                this.siteNames = []; // 右侧结果
                this.form.siteCodes = []; // 提交数据集合
                this.siteNames = [];
                this.checkAll = false;
                this.isIndeterminate = false;
                this.yxxNum = 0;
                this.siteCodesAll = [];
                // 排除
                this.mediaSiteNames = [];
                this.form.excludeSiteCodes = []; // 提交数组集合
                this.mediaSiteNames = [];
            }
        },
        'form.excludeSiteCodesText'(val){
            console.log(val,'val')
            if(val){
                this.rules.excludeSiteCodesText[0].required = true;
            }else{
                this.rules.excludeSiteCodesText[0].required = false;
            }
            console.log(this.rules.excludeSiteCodesText[0].required,'this.rules.excludeSiteCodesText[0].required')
        },
    },
    created() {
        this.open = this.type;
        this.reset();
        if(this.openType == 1){ // 新增

        }else if(this.openType == 2){ // 编辑
            this.editObj = this.obj;
            this.form.signatureType = this.editObj.signatureType;
            this.form.productType = this.editObj.productType; // 产品类型
            this.form.siteType = this.editObj.siteType; // 客户类型
            this.form.siteCode = this.editObj.siteCode; // 站点标识码
            // this.treeSiteCode.push(this.editObj.organizationSiteCodeList[0]);
            this.treeSiteCode.push(this.form.siteCode)
            this.siteCode = this.editObj.siteCode;
            this.form.chargeIdArr = this.editObj.chargeIdArr; // 负责人id 多个英文逗号分割
            this.form.contactIdArr = this.editObj.contactIdArr; // 联系人id 多个英文逗号分割
            this.form.messageRecipientArr = this.editObj.messageRecipientArr; // 消息接收人
            this.form.occurrenceUnit = this.editObj.occurrenceUnit; // 发生单位
            this.btnIndex = this.editObj.occurrenceUnit-1;
            this.form.siteCodes = [...new Set(this.editObj.siteCodes)]; // 监测的站点 数组
            if(!this.form.siteCodes){
                this.yxxNum = 0;
            }else{
                this.yxxNum = this.form.siteCodes.length;
            }
            this.excludeSiteCodes = this.editObj.excludeSiteCodes;
            this.form.excludeSiteCodes = this.editObj.excludeSiteCodes; // 排除新媒体站点 数组
            if(this.form.excludeSiteCodes.length > 0){
                this.pcQueryParams.siteCode = this.siteCode;
                this.pcQueryParams.siteType = this.form.siteType;
                // this.getMediaListFn(1);
                this.mediaSiteNames = this.editObj.siteMediaSites;   
                for(var j in this.mediaSiteNames){
                    if(this.mediaSiteNames[j].appType == 1){
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/wx.jpeg', import.meta.url).href
                    }else if(this.mediaSiteNames[j].appType == 2){
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/wb.jpeg', import.meta.url).href
                    }else if(this.mediaSiteNames[j].appType == 3){
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/dy.jpeg', import.meta.url).href
                    }else if(this.mediaSiteNames[j].appType == 4){
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/tt.jpeg', import.meta.url).href
                    }else if(this.mediaSiteNames[j].appType == 5){
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/ks.jpeg', import.meta.url).href
                    }else {
                        this.mediaSiteNames[j].ico = new URL('../../../assets/images/qt.png', import.meta.url).href
                    }
                }    
            }
            this.form.sendChannel = this.editObj.sendChannel; // 发送渠道
            this.form.excludeSiteCodesText = this.editObj.excludeSiteCodesText; // 网站排除站点（填报单位）
            this.form.strategyName = this.editObj.strategyName; // 策略名称
            // this.form.confirmedDetails = this.editObj.confirmedDetails.split(',').map(Number); // 已选预警项
            this.form.confirmedDetailsArr = this.editObj.confirmedDetailsArr; // 已选预警项
            this.form.confirmSum = this.editObj.confirmSum; // 确认不连通连续出现次数
            this.form.confirmDaySum = this.editObj.confirmDaySum; // 确认不连通每天最多发送次数
            if(this.editObj.confirmSendDay == 1){ // 确认不连通是否全天接收
                this.form.confirmSendDay.push(1);
            }else{
                this.form.confirmSendDay = []
            }
            this.form.recoverSum = this.editObj.recoverSum; // 恢复连通连续出现次数
            this.form.recoverDaySum = this.editObj.recoverDaySum; // 恢复连通每天最多发送次数
            if(this.editObj.recoverSendDay == 1){ // 恢复连通是否全天接收
                this.form.recoverSendDay.push(1);
            }else{
                this.form.recoverSendDay = []
            }
            this.form.suspectedSum = this.editObj.suspectedSum; // 疑似不连通连续出现次数
            this.form.suspectedDaySum = this.editObj.suspectedDaySum; // 疑似不连通每天最多发送次数
            if(this.editObj.suspectedSendDay == 1){ // 疑似不连通是否全天接收
                this.form.suspectedSendDay.push(1);
            }else{
                this.form.suspectedSendDay = []
            }
            this.form.webUpdateDay = this.editObj.webUpdateDay; // 首页超时天数
            // this.form.mediaUpdateDay = this.editObj.mediaUpdateDay; // 新媒体更新超时天数
            this.form.receiptDate = this.editObj.receiptDate; // 接收日期
            // this.form.effectiveStartTime = this.parseTimeString(this.editObj.effectiveStartTime); // 有效开始时间
            // this.form.effectiveEndTime = this.parseTimeString(this.editObj.effectiveEndTime); // 有效结束时间
            this.form.effectiveStartTime = this.editObj.effectiveStartTime; // 有效开始时间
            this.form.effectiveEndTime = this.editObj.effectiveEndTime; // 有效结束时间
            // this.form.dailySendTime = this.editObj.dailySendTime; // 日报发送时间
            // this.form = this.editObj;

            if(this.form.siteType == 2){ // 填报单位
                this.messageRecipientList = this.messageRecipientList.map(item => Object.assign({}, item, { disabledS: true })); // 单位消息接收人禁止选择
            }else if(this.form.siteType == 1){  // 组织单位
                this.messageRecipientList = this.messageRecipientList.map(item => Object.assign({}, item, { disabledS: false })); // 单位消息接收人可以选择
            }
            // 客户消息接收人
            let subDate = {
                siteCode: this.editObj.siteCode
            }
            // 发生单位是否可点击
            if(this.form.siteType == 1){
                this.occurrenceUnitType = false;
            }else if(this.form.siteType == 2){
                this.occurrenceUnitType = true;
            }
        
            
            // 自定义站点
            if(this.editObj.siteInfos){
                this.siteNames = this.editObj.siteInfos;
                if(this.editObj.organizationSiteCodeList){
                    this.siteCodesAll = this.editObj.organizationSiteCodeList;
                }else{
                    this.siteCodesAll = [];
                }
                this.form.organizationSiteCodeList = this.editObj.organizationSiteCodeList;
                // this.$set(this.form, "renewTime", response.data.renewTime);
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.productType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                })
            }
            
            getInspSiteDirector(subDate).then((res)=>{
                this.loading = true;
                this.fzrList = [];
                this.lxrList = [];
                for(var i in res.data){
                    if(res.data[i].userType == 1){
                        this.fzrList.push(res.data[i])
                    }else if(res.data[i].userType == 2){
                        this.lxrList.push(res.data[i])                       
                    }
                }
                this.loading = false;
                console.log(this.fzrList,'负责人')
                console.log(this.lxrList,'联系人')
                setTimeout(()=>{
                    // if(this.fzrList.length > 0){
                        this.setSelectedRows(this.editObj.chargeList,this.fzrList,1);
                    // }
                    // if(this.lxrList.length > 0){
                        this.setSelectedRows(this.editObj.contactList,this.lxrList,2);
                    // }
                    console.log(this.editObj,'editObjeditObj')
                },100)
            })
            if(this.form.productType == 1){ // 网站
                this.confirmedDetailsList = this.webList;
            }else if(this.form.productType == 2){ // 新媒体
                this.confirmedDetailsList = this.mediaList;
            }
            // 查询可配置预警项
            getConfigurable({ siteCode: this.editObj.siteCode, productType: this.editObj.productType, id: this.editObj.id }).then((response)=>{
                this.yjxList = [];
                this.yjxList = response.data;
                for(var i in this.yjxList){
                    for(var j in this.confirmedDetailsList){
                        if(parseInt(this.yjxList[i]) == this.confirmedDetailsList[j].value){
                            this.confirmedDetailsList[j].type = false;
                        }
                    }
                }
                if(this.form.productType == 1){ // 网站
                    if(this.form.confirmedDetailsArr.includes(1)){
                        if(this.confirmedDetailsList[0].type){
                            this.confirmedDetailsList[1].type = true;
                        }else{
                            this.confirmedDetailsList[1].type = false;
                        }
                    }else{
                        this.confirmedDetailsList[1].type = true;
                    }
                }
                
            })
            
        }
        
    },
    methods: {
        // 回显勾选
        setSelectedRows(selectedIds,table,type) {
            this.$nextTick(() => {
                if(selectedIds){
                    selectedIds.forEach((id) => {
                        const row = table.find((item) => item.id === id.id);
                        if (row) {
                            if(type == 1){ // 负责人
                                this.$refs.fzrTable.toggleRowSelection(row, true);
                            }else if(type == 2){ // 联系人
                                this.$refs.lxrTable.toggleRowSelection(row, true);
                            }
                        }
                    });
                }
                
            });
        },
        setSelectedRows2(selectedIds,table) {
            this.$nextTick(() => {
                if(selectedIds){
                    selectedIds.forEach((siteCodeMedia) => {
                        console.log(siteCodeMedia,'siteCodeMedia')
                        const row = table.find((item) => item.siteCodeMedia === siteCodeMedia);
                        console.log(row,'row')
                        if (row) {
                            this.$refs.pcTable.toggleRowSelection(row, true);
                        }
                    });
                }
                
            });
        },
        createTimeObject(hours, minutes, seconds) {
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            return date;
        },
        parseTimeString(timeStr) {
            const [hours, minutes, seconds] = timeStr.split(":").map(Number);
            return this.createTimeObject(hours, minutes, seconds);
        },
        formatDate: function(timestamp) {
            var date = new Date(timestamp);
            const formatTime = (num) => num.toString().padStart(2, '0'); // 保留2位数
            // 提取时分秒
            const hours = date.getHours();    // 时 
            const minutes = date.getMinutes(); // 分 
            const seconds = date.getSeconds(); // 秒 
            return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        },
        /**策略 */
        // 添加预警策略
        // 发生单位tab
        fsdwChange(item,index){
            this.btnIndex = index;
            this.form.occurrenceUnit = item.val;
            if(this.openType == 1){
                if(index != 1){
                    this.form.siteCodes = [];
                    this.yxxNum = 0;
                }
            }
        },
        zdyChange(){
            this.innerVisible = true;
            console.log(this.form.siteCodes,'this.form.siteCodes')
            if(this.openType == 2){
                this.getListzd(this.siteCode);
            }else{
                if(!this.form.siteCodes || this.form.siteCodes.length == 0){
                    this.getListzd(this.siteCode);
                }
            }
        },

        // 表单重置
        reset() {
            this.form = {
                messageType: 1, // 消息类型
                productType: null, // 产品类型
                siteType: null, // 客户类型
                siteCode: null, // 站点标识码
                chargeIdArr: [], // 负责人id 多个英文逗号分割
                contactIdArr: [], // 联系人id 多个英文逗号分割
                messageRecipientArr: [], // 消息接收人
                occurrenceUnit: 3, // 发生单位
                siteCodes: [], // 监测的站点 数组
                excludeSiteCodes: [], // 排除新媒体站点 数组
                sendChannel: 1, // 发送渠道
                strategyName: null, // 策略名称
                confirmedDetailsArr: [], // 已选预警项
                confirmSum: 2, // 确认不连通连续出现次数
                confirmDaySum: 1, // 确认不连通每天最多发送次数
                confirmSendDay: [], // 确认不连通是否全天接收
                recoverSum: 2, // 恢复连通连续出现次数
                recoverDaySum: 1, // 恢复连通每天最多发送次数
                recoverSendDay: [], // 恢复连通是否全天接收
                suspectedSum: 2, // 疑似不连通连续出现次数
                suspectedDaySum: 1, // 疑似不连通每天最多发送次数
                suspectedSendDay: [], // 疑似不连通是否全天接收
                webUpdateDay: 10, // 首页超时天数
                mediaUpdateDay: 10, // 新媒体更新超时天数
                receiptDate: null, // 接收日期
                effectiveStartTime: '08:00:00', // 有效开始时间
                effectiveEndTime: '17:00:00', // 有效结束时间
                dailySendTime: null, // 日报发送时间
                signatureType: 1,
                excludeSiteCodesText: null, // 网站排除站点（填报单位）

            };
        },
        // 取消按钮
        cancel() {
            this.reset()
            this.$emit("openS", false);
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // const allNonEmpty = [this.form.messageRecipientArr, this.form.chargeIdArr, this.form.contactIdArr].every(arr => arr && arr.length > 0);
                    const atLeastOneNonEmpty = [this.form.messageRecipientArr, this.form.chargeIdArr, this.form.contactIdArr].some(arr => arr?.length > 0);
                    // alert(atLeastOneNonEmpty)
                    if(!atLeastOneNonEmpty){
                        this.$modal.msgWarning("客户消息接收人、单位消息接收人必选一项");                         
                    }else{
                        // 确定不连通
                        if(this.form.confirmSendDay.length == 0){
                            this.form.confirmSendDay = 0;
                            this.form.recoverSendDay = 0;
                        }else{
                            this.form.confirmSendDay = 1;
                            this.form.recoverSendDay = 1;
                        }
                        // 疑似不连通
                        if(this.form.suspectedSendDay.length == 0){
                            this.form.suspectedSendDay = 0;
                        }else{
                            this.form.suspectedSendDay = 1;
                        }
                        this.form.recoverDaySum = this.form.confirmDaySum;
                        this.form.siteCode = this.siteCode;
                        this.form.effectiveStartTime = this.form.effectiveStartTime;
                        this.form.effectiveEndTime = this.form.effectiveEndTime;
                        this.form.organizationSiteCodeList = this.siteCodesAll;
                        if(this.openType == 1){ // 新增
                            warnStrategyInfoAdd(this.form).then(response => {
                                this.diaLoading = true;
                                this.$modal.msgSuccess("添加成功");
                                this.open = false;
                                this.diaLoading = false;
                            });
                        }else if(this.openType == 2){ // 编辑
                            // 判断自定义站点选项是否相同
                            let isSubset = false;
                            if(this.editObj.siteCodes && this.editObj.siteCodes.length > 0){
                                if(this.form.siteCodes.length == this.editObj.siteCodes.length){
                                    isSubset = this.form.siteCodes.every(item => this.editObj.siteCodes.includes(item));
                                }else{
                                    isSubset = false;
                                }
                                
                            }
                            // 网站排除站点是否相等
                            let haveSameNumbers = false;
                            console.log(this.form.excludeSiteCodesText,'11')
                            console.log(this.editObj.excludeSiteCodesText,'22')
                            // 如果顺序不重要，只关心是否包含相同的数字集合
                            if(this.form.excludeSiteCodesText && this.editObj.excludeSiteCodesText){
                                const set1 = new Set(this.form.excludeSiteCodesText.split(','));
                                const set2 = new Set(this.editObj.excludeSiteCodesText.split(','));
                                haveSameNumbers = set1.size === set2.size &&  [...set1].every(num => set2.has(num)); 
                            }else if(!this.editObj.excludeSiteCodesText && this.form.excludeSiteCodesText){
                                haveSameNumbers = true;
                            }
                            console.log(this.form.occurrenceUnit,'this.form.occurrenceUnit')
                            console.log(this.editObj.occurrenceUnit,'this.editObj.occurrenceUnit')
                            console.log(isSubset,'自定义站点')
                            console.log(haveSameNumbers,'网站排除站点'); // false
                            // 发生单位是否有变化
                            if(this.form.occurrenceUnit !== this.editObj.occurrenceUnit || isSubset == true || haveSameNumbers == false){ // 有变化
                                this.form.updateSiteCode = 0;
                            }else{ // 无变化
                                this.form.updateSiteCode = 1;
                            }
                            console.log(this.form.updateSiteCode,'this.form.updateSiteCode')
                            
                            this.form.id = this.editObj.id;
                            console.log(this.form,'表单提交数据-编辑')
                            warnStrategyInfoEdif(this.form).then(response => {
                                this.diaLoading = true;
                                this.$modal.msgSuccess("编辑成功");
                                this.open = false;
                                this.diaLoading = false;
                            });
                        }
                    }
                    
                }
            });
        },
        // 客户类型点击
        siteTypeChange(){
            this.form.siteCode = null;
            if(this.form.siteType && this.form.siteType == 2){ 
                this.form.occurrenceUnit = 1;
                this.btnIndex = 0;
                this.occurrenceUnitType = true;
            }else if(this.form.siteCode){ 
                this.occurrenceUnitType = false;
            }
            if(this.form.siteType == 2){ // 填报单位
                this.messageRecipientList = this.messageRecipientList.map(item => Object.assign({}, item, { disabledS: true })); // 单位消息接收人禁止选择
                this.form.messageRecipientArr = [];
            }else if(this.form.siteType == 1){  // 组织单位
                this.messageRecipientList = this.messageRecipientList.map(item => Object.assign({}, item, { disabledS: false })); // 单位消息接收人可以选择
            }
        },
        querySearchAsync(queryString, callBack) {
            if(queryString){
                let data = {
                    pgNum: 1,
                    pgSize: 5,
                    likeSiteOrName: queryString,
                    siteType: this.form.siteType
                }
                getInspSiteTreeList(data).then((res)=>{
                    this.treeInfoDate = [];
                    for(var i in res.data){
                        this.treeInfoDate.push({
                            value: res.data[i].unitName + '-' + res.data[i].siteCode,
                            siteCode: res.data[i].siteCode,
                        })
                    }
                    console.log(this.treeInfoDate,'treeInfoDatetreeInfoDatetreeInfoDate')
                })
                clearTimeout(this.timeout3);
                this.timeout3 = setTimeout(() => {
                    callBack(this.treeInfoDate);
                }, 3000 * Math.random());
            }
        },
        // 父级标识码
        handleSelectCompany(val){
            console.log(val,'valval')
            // this.form.siteCode = val.siteCode;
            this.siteCode = val.siteCode;
            if(this.form.siteType == 1){
                this.occurrenceUnitType = false;
            }else if(this.form.siteType == 2){
                this.occurrenceUnitType = true;
            }
            // 查询联系人，负责人
            let subDate = {
                siteCode: val.siteCode
            }
            getInspSiteDirector(subDate).then((res)=>{
                this.loading = true;
                this.fzrList = [];
                this.lxrList = [];
                for(var i in res.data){
                    if(res.data[i].userType == 1){
                        this.fzrList.push(res.data[i])
                    }else if(res.data[i].userType == 2){
                        this.lxrList.push(res.data[i])                       
                    }
                }
                this.loading = false;
                console.log(this.fzrList,'负责人')
                console.log(this.lxrList,'联系人')
            })
            // 查询可配置预警项
            getConfigurable({ siteCode: val.siteCode, productType: this.form.productType, id: null }).then((response)=>{
                if(this.form.productType == 1){ // 网站
                    this.confirmedDetailsList = this.webList;
                }else if(this.form.productType == 2){ // 新媒体
                    this.confirmedDetailsList = this.mediaList;
                }
                this.yjxList = [];
                this.yjxList = response.data;
                for(var i in this.yjxList){
                    for(var j in this.confirmedDetailsList){
                        if(parseInt(this.yjxList[i]) == this.confirmedDetailsList[j].value){
                            this.confirmedDetailsList[j].type = false;
                        }
                    }
                }
                if(this.form.productType == 1){ // 网站
                    if(this.form.confirmedDetailsArr.includes(1)){
                        this.confirmedDetailsList[1].type = false;
                    }else{
                        this.confirmedDetailsList[1].type = true;
                    }
                }
            })

        },
        // 多选框选中数据-负责人
        handleSelectionChange(selection) {
            this.form.chargeIdArr = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 多选框选中数据-联系人
        handleSelectionChange2(selection) {
            this.form.contactIdArr = selection.map(item => item.id);
            this.single2 = selection.length !== 1;
            this.multiple2 = !selection.length;
        },



        /**自定义站点 */
        // 站点范围选择
        getListzd(parentSite) {
            this.treeLoading = true;
            // this.loading = true;
            let date = {siteCode: parentSite}
            getOrganizationUnit(date).then(response => {
                this.inspSiteTreeList = [];
                setTimeout(()=>{
                    this.inspSiteTreeList = response.data;
                    for(var i in this.inspSiteTreeList){
                        this.inspSiteTreeList[i].treeCheck = false;
                    }
                    this.treeLoading = false;
                },100)
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleNodeClick(data, node) {
            this.queryFrom.pgNum = 1;
            // this.queryFrom.ancestorsFind = data.siteCode;
            this.queryFrom.ancestorsFind = data.ancestors+data.siteCode+',';
            this.getList();
        },
        // 自定义单位-树点击复选框
        handleCheckChange(data, checked, indeterminate) {
            if(checked == true){
                this.siteCodesAll.push(data.siteCode)
            }else{
                this.siteCodesAll = this.siteCodesAll.filter(item => item !== data.siteCode);
                // this.form.siteCodes = [];
            }
            this.siteCodesAll = [...new Set(this.siteCodesAll)];
            if(this.siteCodesAll.length == 0){
                this.siteNames = [];
                this.form.siteCodes = [];
            }
            if(this.switchS == false){
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.productType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    // this.form.siteCodes = [];
                    // this.siteNames = [];
                })
            }
        },
        // 全选
        treeChange(node, data){
            // 自定义逻辑
            data.treeCheck = !data.treeCheck;
        },
        handleCheckboxChange(checked, node, data) {
            this.$refs.tree.setChecked(data.siteCode, checked);
            this.switchS = true;    
            let arr = [];   
            if(checked == true){

                arr = this.collectVals(data.children);
                for(var i in arr){
                    this.siteCodesAll.push(arr[i])
                }
                this.siteCodesAll.unshift(data.siteCode)
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                this.updateChildrenChecked(data, checked);
                this.syncTreeCheckedState(1);
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteCodes = [];
                }
                getUnit({siteCodes: this.siteCodesAll,codeType: this.form.productType}).then((res)=>{
                    this.cities = [];
                    this.cities = res.data;
                    this.checkAll = false;
                    this.switchS = false;
                })
                
            }else{
                arr = this.collectVals(data.children);
                if(arr.length == 0){
                    arr.push(data.siteCode)
                }
                this.siteCodesAll = this.siteCodesAll.filter(item => !arr.includes(item));
                this.siteCodesAll = [...new Set(this.siteCodesAll)];
                // this.switchS = false;
                // this.siteCodesAll = [];
                if(data.siteCode == this.form.siteCode){
                    this.$nextTick(() => {
                        this.updateChildrenChecked(data, checked);
                        this.syncTreeCheckedState(2);
                        this.siteCodesAll = [];
                    });
                }
                if(this.siteCodesAll.length == 0){
                    this.siteNames = [];
                    this.form.siteCodes = [];
                }
                this.$nextTick(() => {
                    this.updateChildrenChecked(data, checked);
                    this.syncTreeCheckedState(2);
                    getUnit({siteCodes: this.siteCodesAll,codeType: this.form.productType}).then((res)=>{
                        this.cities = [];
                        this.cities = res.data;
                        this.checkAll = false;
                        this.switchS = false;
                    })
                });

            }
        },
        // 递归更新子节点的checked状态
        updateChildrenChecked(node, checked) {
            if (node.children && node.children.length) {
                node.children.forEach(child => {
                    // child.checked = checked;
                    this.$set(child, 'checked', checked);
                    this.updateChildrenChecked(child);
                });
                this.$forceUpdate();  // 强制当前组件重新渲染

            }
        },
        // 同步到树组件的选中状态
        syncTreeCheckedState(type) {
            const checkedNodes = this.getCheckedNodes(this.inspSiteTreeList);
            const checkedKeys = checkedNodes.map(node => node.siteCode);
            this.$refs.tree.setCheckedKeys(checkedKeys);
        },
        // 获取所有checked为true的节点
        getCheckedNodes(nodes) {
            let result = [];
            nodes.forEach(node => {
                if (node.checked) {
                    result.push(node);
                }
                if (node.children && node.children.length) {
                    result = result.concat(this.getCheckedNodes(node.children));
                }
            });
            return result;
        },
        collectVals(arr, result = []) {
            arr.forEach(item => {
                result.push(item.siteCode);
                if (item.children && item.children.length > 0) {
                    this.collectVals(item.children, result);
                }
            });
            return result;
        },
        
        // 划过获取字数 用于是否显示黑框提示
        onShowNameTipsMouseenter(e) {
            // console.log(e,'e')
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
        // 左侧树搜索
        siteCodeSearch(){
            console.log('ok')
            // tbSiteCode
            getUnit({siteCodes: this.siteCodesAll,name: this.tbSiteCode,codeType: this.form.productType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
            
        },
        // 清空树搜索条件
        clearSearch(){
            getUnit({siteCodes: this.siteCodesAll,name: null,codeType: this.form.productType}).then((res)=>{
                this.cities = [];
                this.cities = res.data;
                this.checkAll = false;
                this.switchS = false;
            })
        },
        // 确定
        submitForm2(){
            this.innerVisible = false;
            this.yxxNum = this.form.siteCodes.length;
        },
        // 取消
        cancel2(){
            this.innerVisible = false;
            this.yxxNum = this.form.siteCodes.length;
            
            if(this.yxxNum == 0){
                this.form.siteCodes = [];
            }
        },

        // 触发条件事件
        confirmedDetailsChange(event,value,index){
            if(this.form.productType == 1){ // 网站
                if(this.form.confirmedDetailsArr.includes(1)){ // 选择确定不连通，恢复连通才可以点击
                    this.confirmedDetailsList[1].type = false;
                }else{
                    this.confirmedDetailsList[1].type = true;
                    const index = this.form.confirmedDetailsArr.indexOf(2); // 找到4的索引
                    if (index !== -1) {
                        this.form.confirmedDetailsArr.splice(index, 1); // 从索引位置删除1个元素
                    }
                    this.form.recoverSendDay = [];
                }
            }
            if(event == true){
                let id = null;
                if(this.openType == 1){ // 新增
                    id = null;
                }else{
                    id = this.editObj.id
                }
                let subDate = {
                    siteCode: this.form.siteCode,
                    productType: this.form.productType,
                    id: id,
                    warningItem: value
                }
                getWarnStrategyInfo(subDate).then((res)=>{
                    // res.data = false;
                    if(res.data == false){
                        this.$modal.msgError(res.msg);
                        this.form.confirmedDetailsArr = this.form.confirmedDetailsArr.filter(item => item !== value);
                    }
                })
            }
            
        },


        /**自定义站点 */
        // 筛选
        handleCheckAllChange(val) {
            // this.form.siteCodes = val ? this.cities : [];
            this.form.siteCodes = this.checkAll ? this.cities.map(item => item.siteCode) : [];
            this.isIndeterminate = false;

            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteCodes){
                    if(this.form.siteCodes[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        // 单个点击
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            this.siteNames = [];
            for(var i in this.cities){
                for(var j in this.form.siteCodes){
                    if(this.form.siteCodes[j] == this.cities[i].siteCode){
                        this.siteNames.push({ siteCode: this.cities[i].siteCode, siteName: this.cities[i].siteName })
                    }
                }
            }
        },
        /**右侧 */
        // 单个删除
        delSiteNames(item,index){
            this.siteNames.splice(index,1);
            let arr = [];
            for(var i in this.cities){
                if(item.siteCode == this.form.siteCodes[i]){
                    this.form.siteCodes.splice(i,1)
                }
            }
            this.isIndeterminate = this.form.siteCodes.length > 0 && this.form.siteCodes.length < this.cities.length;
        },
        // 全部删除
        clearSiteNames(){
            this.form.siteCodes = [];
            this.siteNames = [];
            this.isIndeterminate = this.form.siteCodes.length > 0 && this.form.siteCodes.length < this.cities.length;
            this.checkAll = false;
        },

        /**新媒体 */
        // 产品类型点击
        productTypeChange(){
            // this.productType
            if(this.form.productType == 1){ // 网站
                this.confirmedDetailsList = this.webList;
                this.excludeSiteCodes = [];
                this.form.excludeSiteCodes = [];
                this.mediaSiteNames = [];
            }else if(this.form.productType == 2){ // 新媒体
                this.confirmedDetailsList = this.mediaList;
            }
            this.siteCode = null;
            this.form.siteCode = null; // 清空选择客户选中值
        },
        getMediaListFn(type){
            this.pcLoading = true;
            getMediaList(this.pcQueryParams).then(response => {
                
                this.inspMediaInfoList = response.rows;
                this.pcTotal = response.total;
                for(var i in this.inspMediaInfoList){
                    if(this.inspMediaInfoList[i].appType != 1){
                        this.inspMediaInfoList[i].uid = '--';
                    }
                    for(var j in this.appTypeList){
                        if(this.inspMediaInfoList[i].appType == this.appTypeList[j].value){
                            this.inspMediaInfoList[i].appTypeTxt = this.appTypeList[j].label;
                        }
                    }
                    if(response.rows[i].appType == 1){
                        response.rows[i].ico = new URL('../../../assets/images/wx.jpeg', import.meta.url).href
                    }else if(response.rows[i].appType == 2){
                        response.rows[i].ico = new URL('../../../assets/images/wb.jpeg', import.meta.url).href
                    }else if(response.rows[i].appType == 3){
                        response.rows[i].ico = new URL('../../../assets/images/dy.jpeg', import.meta.url).href
                    }else if(response.rows[i].appType == 4){
                        response.rows[i].ico = new URL('../../../assets/images/tt.jpeg', import.meta.url).href
                    }else if(response.rows[i].appType == 5){
                        response.rows[i].ico = new URL('../../../assets/images/ks.jpeg', import.meta.url).href
                    }else {
                        response.rows[i].ico = new URL('../../../assets/images/qt.png', import.meta.url).href
                    }
                }
                if(type == 1){
                    this.oldList = [];
                    this.oldList = response.rows;
                }else{
                    const newItems = this.inspMediaInfoList.filter(item2 => 
                        !this.oldList.some(item1 => item1.siteCodeMedia === item2.siteCodeMedia)
                    );
                    this.oldList = this.oldList.concat(newItems);
                }
                setTimeout(()=>{
                    this.setSelectedRows2(this.excludeSiteCodes,this.inspMediaInfoList);
                },100)         
                this.pcLoading = false;
            });
        },
        /**排除站点 */
        pcChange(){
            this.pcInnerVisible = true;
            this.pcQueryParams.siteCode = this.siteCode;
            this.pcQueryParams.siteType = this.form.siteType;
            this.getMediaListFn(1);
            this.delArr = [];
            
        },
         // 多选框选中数据-联系人
        handleSelectionChange3(selection,row) {
            console.log(row,'row')
            if(selection.includes(row) == true){
                this.mediaSiteNames.push(row)
            }else{
                this.mediaSiteNames = this.mediaSiteNames.filter(item => item.siteCodeMedia !== row.siteCodeMedia);
            }
            console.log(this.mediaSiteNames,'this.mediaSiteNames')
        },
        // 监听全选事件
        handleSelectAll(selection,row) {
            console.log(row,'rpw')
            const isAllSelected = selection.length > 0 && selection.length === this.inspMediaInfoList.length;
            console.log("全选状态：", isAllSelected ? "已全选" : "已取消全选");
            console.log("当前选中的所有行：", selection);
            if(isAllSelected){
                // this.mediaSiteNames = [...this.mediaSiteNames,...this.inspMediaInfoList];
                const newItems = this.inspMediaInfoList.filter(item2 => 
                    !this.mediaSiteNames.some(item1 => item1.siteCodeMedia === item2.siteCodeMedia)
                );
                this.mediaSiteNames = this.mediaSiteNames.concat(newItems);
            }else{
                // 提取 inspMediaInfoList 中的所有 siteCodeMedia 值
                const valsToRemove = this.inspMediaInfoList.map(item => item.siteCodeMedia);
                // 过滤掉 arr 中 siteCodeMedia 存在于 valsToRemove 的对象
                this.mediaSiteNames = this.mediaSiteNames.filter(item => !valsToRemove.includes(item.siteCodeMedia));
                // this.mediaSiteNames = [];
            }
        },
        // 单个删除
        delMediaSiteNames(item,index){
            this.mediaSiteNames.splice(index,1);
            const table = this.$refs.pcTable;
            const row = this.inspMediaInfoList.find(i => i.siteCodeMedia === item.siteCodeMedia); // 找到对应行
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
            table.clearSelection(); // false 表示取消选中
        },
        // 分页
        handleCurrentChange(val) {
            this.pcQueryParams.pgNum = val;
            this.getMediaListFn();
        },

        cancel3(){
            this.mediaSiteNames = [...this.mediaSiteNames,...this.delArr];
            this.pcInnerVisible = false;
        },
        submitForm3(){
            this.excludeSiteCodes = this.mediaSiteNames.map(item => item.siteCodeMedia);
            this.form.excludeSiteCodes = this.excludeSiteCodes;
            this.pcInnerVisible = false;
        },

        // 搜索
        siteCodeSearch2(){
            this.getMediaListFn(1);
        },
        // 清空
        clearSearch2(){
            this.pcQueryParams.keyWord = null;
            this.getMediaListFn(1);
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
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }

    .spClass,.spClass2{
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        // margin-top: 10px;
    }
    .spClass2{
        font-weight: normal;
    }
    .dxDiv{
        position: absolute;
        top: 25px;
        left: 24px;
        font-size: 13px;
        
    }
    .dxDivBox,.dxDivBox2,.dxDivBox3,.dxDivBox4,.dxDivBox5,.dxDivBox6,.dxDivBox7,.dxDivBox8,.dxDivBox10,.dxDivBox11,.dxDivBox12,.dxDivBox13,.dxDivBox14{
        display: flex;
        align-items: center;
        position: absolute;
        top: 52px;
        left: 25px;
        font-size: 13px;
    }
    .dxDivBox2{
        top: 112px;
    }
    .dxDivBox3{
        top: 174px;
    }
    
    .dxDivBox4{
        top: 237px;
    }
    .dxDivBox5{
        top: 300px;
    }
    .dxDivBox6{
        top: 350px;
    }
    .dxDivBox7{
        top: 400px;
    }
    .dxDivBox8{
        top: 450px;
    }
    // 新媒体
    .dxDivBox11{
        top: 114px;
    }
    .dxDivBox12{
        top: 164px;
    }
    .dxDivBox13{
        top: 217px;
    }
    .dxDivBox14{
        top: 267px;
    }
    .khxx{
        color: #1890ff;
        background: rgba(24,144,255,.2);
        padding: 2px;
        border-radius: 3px;
        font-size: 12px;
        padding-left: 6px;
        span{
            display: block;
        }
    }
    .x{
        color: red;
        margin-right: 5px;
        position: relative;
        top: 2px;
    }
    .sjdBox{
        display: flex;
        justify-content: space-between;
        .zhi{
            position: relative;
            top: 8px;
        }
    }
    .marginClass{
        margin-top: 35px;
    }

    // 自定义站点
    .divLeft{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .treeDiv{
            flex: 1;
            overflow: auto;
             -ms-overflow-style: none;  /* IE 和 Edge */
            scrollbar-width: none;     /* Firefox */
        }
    }
    .tit{
        color: red;
        font-size: 11px;
        margin-left: -5px;
    }
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
    .dxBox{
        display: flex;
        justify-content: space-between;
        .spsp1{
            flex: 1;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
            margin-right: 10px;
        }
    }
    .divCenC{
        flex: 1;
        overflow: auto;
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;     /* Firefox */
        margin: 10px 0;
        overflow-x: hidden;
    }
    .divCenCT{
        display: flex;
        justify-content: right;
    }
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        // margin-right: 20px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label{
            flex: 1;
            margin-right: 10px;
            white-space: nowrap;      /* 禁止换行 */
            overflow: hidden;         /* 隐藏溢出内容 */
            text-overflow: ellipsis;  /* 显示省略号 */
        }
    }
    .qxBox{
        display: flex;
        align-items: center;
        .qxBoxK{
            font-size: 14px;
            color: #606266;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        span{
            display: inline-block;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            background-color: #FFFFFF;
            z-index: 1;
            position: relative;
            top: 0;
            left: -5px;
            font-size: 12px;
        }
    }
    .dxxzClass{
        color: #ffffff;
        background-color: #1890ff;
        border-color: #1890ff;
    }

    /* 排除站点*/
    .zhxx{
        display: flex;
        align-items: center;
    }
    .icoSp{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        overflow: hidden;
        background: #ffffff;
        margin-right: 5px;
    }
    .ico{
        width: 100%;
        border-radius: 100%;
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
        /* padding-top: 10px;
        padding-bottom: 10px; */
        padding: 10px 45px;
    }
    /deep/.el-form-item__content{
        /* z-index: 20; */
    }
    /deep/.el-form-item__error{
        top: 90%!important;
    }
    /deep/.cftjClass .el-form-item__error{
        top: 103%!important;
    }
    /deep/.dwxxjsBox .el-form-item__error{
        top: 72%!important;
    }
    /deep/.el-checkbox:first-child{
        margin-top: 0!important;
    }
    /* 网站 */
    /deep/.yjxBox .el-checkbox:nth-child(6){
        margin-top: 10px!important;
    }
    /deep/.yjxBox .el-checkbox:nth-child(7){
        margin-top: 10px!important;
    }
    /deep/.yjxBox .el-checkbox:last-child{
        margin-top: 10px!important;
    }
    /* 新媒体 */
    /* /deep/.yjxBox2 .el-checkbox:nth-child(2){
        margin-top: 10px!important;
    } */
    /deep/.yjxBox2 .el-checkbox:nth-child(3){
        margin-top: 10px!important;
    }
    /deep/.yjxBox2 .el-checkbox:nth-child(4){
        margin-top: 10px!important;
    }
    /deep/.yjxBox2 .el-checkbox:nth-child(5){
        margin-top: 10px!important;
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
</style>