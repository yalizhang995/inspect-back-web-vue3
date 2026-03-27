<template>
    <div class="app-container errorsPage" >
        <!-- 表格全屏 -->
        <div class="bigWrapBox" v-if="upHeightType">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" >批量删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="handleUpdateAll" >批量整改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" >导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile" >整改导入</el-button>
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
                    <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                    <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="siteCode" label="网站标识码" width="120"  sortable="custom"></el-table-column>
                    <el-table-column prop="title" label="快照" width="80" align="center">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="httpStateText" label="问题类型" width="100" align="center"></el-table-column>
                    <el-table-column prop="anchor" label="不可用链接标题" width="180" show-overflow-tooltip/>
                    <el-table-column prop="url" label="不可用链接" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="" prop="channelName" width="60">
                        <template slot-scope="scope">
                            <el-tooltip  class="item" effect="dark" content="点此复制不可用连接+网站标识码" placement="top-start">
                                <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                            </el-tooltip> 
                        </template>
                    </el-table-column>
                    <el-table-column prop="fromTitleTxts" label="父页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrls)">{{ scope.row.fromTitleTxts}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fromTitleTxt" label="错链所在页面信息" width="280" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="filePath" label="压缩包子路径" width="200" align="" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="errorTypesTxt" label="链接类型" width="100" align="center"></el-table-column>
                    <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                    <el-table-column prop="httpCode" label="返回码" width="100" align="center"/>
                    <!-- <el-table-column prop="dayNum" label="不可用天数" width="120" align="center" sortable="custom"></el-table-column> -->
                    <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column>
                    <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                    
                    <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                    <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                    
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="整改" placement="top">
                                <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                            </el-tooltip>
                            
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
        <div v-if="!upHeightType">
            <el-form
                :model="queryParams"
                ref="queryForm"
                size="small"
                :inline="true"
                v-show="showSearch"
                label-width="90px"
            >
                <el-form-item label="主管单位" prop="">
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
                <el-form-item label="链接类型" prop="errorTypes">
                    <el-select v-model="queryParams.errorTypes" clearable placeholder="请选择链接类型" style="width:310px">
                        <el-option
                            v-for="item in ljlxList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
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
                <el-form-item label="资源类别" prop="contentType">
                    <el-select v-model="queryParams.contentType" clearable placeholder="请选择资源类别" style="width:310px">
                        <el-option
                            v-for="item in zylbList"
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
                <el-form-item label="问题类型" prop="httpState">
                    <el-select v-model="queryParams.httpState" clearable placeholder="请选择问题类型" style="width:310px">
                        <el-option
                            v-for="item in wtlxList"
                            :key="item.val"
                            :label="item.label"
                            :value="item.val"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="返回码" prop="httpCode">
                    <el-input
                        v-model="queryParams.httpCode"
                        placeholder="请输入返回码"
                        clearable
                        @keyup.enter.native="handleQuery"
                        style="width:310px"
                    />
                </el-form-item>
                <el-form-item label="不可用链接" prop="urlHash">
                    <el-input
                        v-model="queryParams.urlHash"
                        placeholder="请输入不可用链接加网站标识码"
                        clearable
                        style="width:310px;"
                    />
                </el-form-item>
                <!-- <el-form-item label="订单批次" prop="severity">
                    <el-cascader
                        v-model="batchInfo"
                        :options="pcList"
                        @change="pcChange"
                        style="width:310px;margin:0 10px 0 0" :popper-append-to-body="false"  popper-class="my-select"
                        >
                        <template slot-scope="{ node, data }">
                            <el-tooltip  class="item" effect="dark" :content="data.label" placement="top-start">
                            <span>{{ data.label }}</span>
                            </el-tooltip>            
                        </template>
                    </el-cascader>
                </el-form-item> -->
                <el-form-item label="数据ID" prop="idStr" >
                    <el-input
                        v-model="queryParams.idStr"
                        placeholder="请输入ID"
                        clearable
                        style="width:310px"
                        @keyup.enter.native="handleQuery"
                    />
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
                    <el-select v-model="queryParams.batchId" filterable remote placeholder="请输入订单名称或网站标识码" :remote-method="remoteMethod2" clearable style="width:720px" :disabled="queryParams.dataRangeType == 1">
                        <el-option
                        v-for="item in pcList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item style="marginLeft:8px">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
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
                        @click="handleFile"
                        
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
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="index" label="序号" width="100" align="center" fixed></el-table-column>
                <el-table-column prop="siteName" label="网站名称" width="180" fixed show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.siteUrl)">{{ scope.row.siteName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="siteCode" label="网站标识码" width="120"  sortable="custom"></el-table-column>
                <el-table-column prop="title" label="快照" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="httpStateText" label="问题类型" width="100" align="center"></el-table-column>
                <el-table-column prop="anchor" label="不可用链接标题" width="180" show-overflow-tooltip/>
                <el-table-column prop="url" label="不可用链接" width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.url)">{{ scope.row.url}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="" prop="channelName" width="60">
                    <template slot-scope="scope">
                        <el-tooltip  class="item" effect="dark" content="点此复制不可用连接+网站标识码" placement="top-start">
                            <i class="el-icon-connection dz"  @click="copyChange(scope.row)"></i>
                        </el-tooltip> 
                    </template>
                </el-table-column>
                <el-table-column prop="fromTitleTxts" label="父页面信息" width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.fromUrls)">{{ scope.row.fromTitleTxts}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fromTitleTxt" label="错链所在页面信息" width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="dz" @click="dzChange(scope.row.fromUrl)">{{ scope.row.fromTitleTxt}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="filePath" label="压缩包子路径" width="200" align="" show-overflow-tooltip></el-table-column>

                <el-table-column prop="errorTypesTxt" label="链接类型" width="100" align="center"></el-table-column>
                <el-table-column prop="contentTypeTxt" label="资源类别" width="100" align="center"></el-table-column>
                <el-table-column prop="httpCode" label="返回码" width="100" align="center"/>
                <!-- <el-table-column prop="dayNum" label="不可用天数" width="120" align="center" sortable="custom"></el-table-column> -->
                <el-table-column prop="linkLocationText" label="链接位置" width="120" align="center"></el-table-column>
                <el-table-column prop="reviewResultTxt" label="整改状态" width="180" align="center" ></el-table-column>
                
                <el-table-column prop="createTime" label="发现时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="scanTime" label="监测时间" width="180"></el-table-column>            
                <el-table-column prop="rectifyTime" label="整改时间" width="180" sortable="custom"></el-table-column>
                
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="80" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="整改" placement="top">
                            <i class="el-icon-edit" style="cursor: pointer;font-size:15px" @click="handleUpdate2(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" style="marginLeft:10px;cursor: pointer;font-size:15px" @click="handleDelete(scope.row)"></i>
                        </el-tooltip>
                        
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="cancel3">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 模板上传 -->
        <el-dialog title="整改导入" :visible.sync="open6" width="520px" append-to-body>
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
    editReviewResultBatch,
} from "@/api/biz/errorsPage";
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
                pgSize: 10,
                // siteCodeOrg: null, // 标识码-主管
                treeInfo: {'psCode': null},
                siteCode: null, // 网站标识码
                errorTypes: null, // 链接类型
                linkLocation: null, // 链接位置
                contentType: null, // 资源类别
                searchDateKey: 'ct',
                startDate: null, // 开始时间
                endDate: null, // 结束时间
                orderTypes: [], // 表格排序
                reviewResult: null, // 整改状态，
                httpState: null, // 问题类型
                httpCode: null,
                urlHash: null,
                idStr: null,
                batchId: null,
                dataRangeType: 0,

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
            shsjList: [ 
                { label: '监测时间', val: 'ct' },
                { label: '审核时间', val: 'ate' },
            ],
            // 订单批次
            batchInfo: null,
            pcList: [],
            // 操作类型
            czList: [ 
                { label: '显示', val: 2 },
                // { label: '显示并预警', val: 3 },
                { label: '误报', val:  4 },
            ],
            wtlxList: [
                { label: '确认死链', val: 1 },
                { label: '疑似死链', val: 2 },
                { label: '正常链接', val: 0 },
                { label: '超时或封锁', val: 999 },
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

            zgType: null,

            // 导出
            open3: false, 
            form3: {
                menuType: 120
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

            exportSiteName: null,  // 导出-主管单位名称
            exportSiteName_: null,  // 导出-网站名称（主办单位）
            
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转
        sessionStorage.removeItem('reviewTaskIdStr')
        next();

    },
    created() {
        // 复核
        if(sessionStorage.getItem('reviewTaskIdStr')){
            this.queryParams.idStr = sessionStorage.getItem('reviewTaskIdStr');
            this.getList();
            this.getTreeselect();

        }else{
            this.getList();
            this.getTreeselect();
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
                    // 错链所在页面信息（标题，地址）
                    if(!this.inspSiteInfoList[i].fromTitle && !this.inspSiteInfoList[i].fromUrl){
                        this.inspSiteInfoList[i].fromTitleTxt = '--';
                    }else if(!this.inspSiteInfoList[i].fromTitle){
                        this.inspSiteInfoList[i].fromTitleTxt = this.inspSiteInfoList[i].fromUrl;
                    }else{
                        this.inspSiteInfoList[i].fromTitleTxt = this.inspSiteInfoList[i].fromTitle;
                    }
                    // 父页面信息
                    if(!this.inspSiteInfoList[i].fromTitles && !this.inspSiteInfoList[i].fromUrls){
                        this.inspSiteInfoList[i].fromTitleTxts = '--';
                    }else if(!this.inspSiteInfoList[i].fromTitles){
                        this.inspSiteInfoList[i].fromTitleTxts = this.inspSiteInfoList[i].fromUrls;
                    }else{
                        this.inspSiteInfoList[i].fromTitleTxts = this.inspSiteInfoList[i].fromTitles;
                    }
                    // 压缩包子路径
                    if(!this.inspSiteInfoList[i].filePath){
                        this.inspSiteInfoList[i].filePath = '--';
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

                    if(!this.inspSiteInfoList[i].anchor){
                        this.inspSiteInfoList[i].anchor = '--';
                    }
                    if(!this.inspSiteInfoList[i].rectifyTime){
                        this.inspSiteInfoList[i].rectifyTime = '--';
                    }


                    
                    
                }
            });
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
            if(!this.queryParams.httpCode){
                this.queryParams.httpCode = null;
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.batchInfo = null;
            this.queryParams.batchInfo = null;
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.queryParams.treeInfo.psCode = null;
            this.resetForm("queryForm");
            this.queryParams.batchId = null;
            
            this.exportSiteName = null; // 导出-主管单位名称
            this.exportSiteName_ = null; // 导出-网站名称（主办单位）

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
        reset3() {
            this.form3 = {
                menuType: 120,
                type: 1,
            };
            this.resetForm("form3");
        },
        // 取消按钮
        cancel3() {
            this.open3 = false;
            this.form3 = {
                menuType: 120,
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
            this.open3 = true;
            this.reset3();
        },
        /** 提交按钮 */
        submitForm3() {
            this.$refs["form3"].validate(valid => {
                if (valid) {
                    console.log(this.form3)
                    let subData = this.queryParams;
                    subData.menuType = 120;
                    console.log(subData,'提交数据')
                    if(this.form3.type == 2){ // 大批量
                        insertInspExcelTaskMaxBatch(subData).then((res)=>{
                            this.$modal.msgSuccess("导出任务创建成功");
                            this.open3 = false;
                        })
                    }else{ // 小批量
                        let fileName = '';
                        if(this.exportSiteName != null && this.exportSiteName_ != null){
                            fileName = this.exportSiteName_ + '-错链信息数据-'+this.formatDate(new Date());
                        }else{
                            if(this.exportSiteName != null){
                                fileName = this.exportSiteName + '-错链信息数据-'+this.formatDate(new Date());
                            }else if(this.exportSiteName_ != null){
                                fileName = this.exportSiteName_ + '-错链信息数据-'+this.formatDate(new Date());
                            }else{
                                fileName = '错链信息数据-'+this.formatDate(new Date());
                            }
                        }
                        console.log(fileName,'fileName')
                        this.download(
                            "biz/errors/export",this.queryParams,
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

        // 复制栏目地址加网站标识码
        copyChange(val){
            console.log(val,'val')
            if(val.url){
                this.queryParams.urlHash = val.url+val.siteCode;
                navigator.clipboard.writeText(this.queryParams.urlHash);
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
                this.subFileList.forEach(f => {
                    console.log(f,'f')
                    formData.append("file", f.raw);
                    formData.append("taskType", 20);
                });
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
            let fileName = '网站错链整改模板';
                this.download2(
                    "common/download/downloadExcelTpl?type=20",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            
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
        margin-top: 30vh !important;
    }
</style>