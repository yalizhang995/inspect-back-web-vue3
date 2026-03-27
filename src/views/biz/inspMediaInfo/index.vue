<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
        >
            <el-form-item label="标识码" prop="siteCodeMedia">
                <el-input
                    v-model="queryParams.siteCodeMedia"
                    placeholder="请输入新媒体标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="账号状态" prop="appUserState">
                <el-select v-model="queryParams.appUserState" clearable placeholder="请选择新媒体账号状态" style="width:200px">
                    <el-option
                        v-for="item in appUserStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号类型" prop="appType">
                <!-- <el-select v-model="queryParams.appType" clearable placeholder="请选择新媒体账号类型" @change="appTypeChange"> -->
                <el-select v-model="queryParams.appType" clearable placeholder="请选择新媒体账号类型" style="width:200px">
                    <el-option
                        v-for="item in appTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="唯一标识" prop="uniqueCode">
                <el-input
                    v-model="queryParams.uniqueCode"
                    placeholder="请输入账号唯一标识"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="微信号ID" prop="uid">
                <el-input
                    v-model="queryParams.uid"
                    placeholder="请输入微信号ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <!-- <el-form-item label="主页地址" prop="homeUrl">
                <el-input
                    v-model="queryParams.homeUrl"
                    placeholder="请输入主页地址"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item> -->
            <el-form-item label="账号名称" prop="accountName">
                <el-input
                    v-model="queryParams.accountName"
                    placeholder="请输入账号名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="是否收费" prop="vipFlag">
                <el-select v-model="queryParams.vipFlag" clearable placeholder="请选择是否收费" style="width:200px">
                    <el-option
                        v-for="item in vipFlagList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否开启监测" prop="enabled">
                <el-select v-model="queryParams.enabled" clearable placeholder="请选择是否开启监测" style="width:200px">
                    <el-option
                        v-for="item in enabledList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="监测状态" prop="scanState">
                <el-select v-model="queryParams.scanState" clearable placeholder="请选择监测状态" style="width:200px">
                    <el-option
                        v-for="item in scanStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="省" prop="province">
                <el-input
                    v-model="queryParams.province"
                    placeholder="请输入省"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="市" prop="city">
                <el-input
                    v-model="queryParams.city"
                    placeholder="请输入市"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="县" prop="county">
                <el-input
                    v-model="queryParams.county"
                    placeholder="请输入县"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:200px"
                />
            </el-form-item>
            <el-form-item label="主页地址" prop="homeUrl">
                <el-input
                    v-model="queryParams.homeUrl"
                    placeholder="请输入主页地址"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:510px"
                />
            </el-form-item>
            <el-form-item style="marginLeft:17px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['biz:inspMediaInfo:add']"
                >新增</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['biz:inspMediaInfo:edit']"
                >修改</el-button>
            </el-col> -->
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspMediaInfo:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspMediaInfo:export']"
                >导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-top" size="mini" @click="handleFile(2)" >站点信息新增导入</el-button>
                <el-button type="info" plain icon="el-icon-top" size="mini" @click="handleFile(3)" >站点信息修改导入</el-button>
                <el-button type="primary" plain  size="mini" @click="goInfo" >任务详情</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspMediaInfoList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="新媒体标识码" align="" prop="siteCodeMedia" width="160" fixed="left" />
            <el-table-column label="账号类型" align="center" prop="appTypeTxt" width="120" />
            <el-table-column label="微信号ID" align="" prop="uid" width="180" show-overflow-tooltip />
            <el-table-column label="唯一标识" align="" prop="uniqueCode" width="180" show-overflow-tooltip />
            <el-table-column label="主页地址" align="" prop="homeUrl" width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.homeUrl)">{{scope.row.homeUrl}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号名称" align="" prop="accountName" width="220" show-overflow-tooltip />
            <el-table-column label="账号状态" align="center" prop="appUserStateTxt" width="140" />
            <el-table-column label="地区" align="" prop="area" width="200" show-overflow-tooltip />
            <el-table-column label="是否收费" align="center" prop="vipFlagTxt" width="100" />
            <el-table-column label="是否开启监测" align="center" prop="enabledTxt" width="120" />
            <el-table-column label="监测状态" align="center" prop="scanStateTxt" width="100" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
                <template slot-scope="scope">
                    <!-- el-icon-thumb -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-thumb"
                        @click="MediaTask(scope.row)"
                        v-hasPermi="['biz:inspMediaInfo:column']"
                        :disabled="((scope.row.appType == 1 || scope.row.appType == 2 || scope.row.appType == 3 || scope.row.appType == 4 || scope.row.appType == 5) && scope.row.enabled == true && (scope.row.appUserState == 1 || scope.row.appUserState == 4 || scope.row.appUserState == 5)) ? false : true"
                    >下发任务</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspMediaInfo:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspMediaInfo:remove']"
                    >删除</el-button>
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

        <!-- 添加或修改新媒体站点信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="880px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <div class="box">
                    <el-form-item label="自定义新媒体站点" prop="customFlag" style="width:49%">
                        <el-radio-group v-model="form.customFlag" :disabled="title=='修改新媒体站点信息'" @change="customFlagChange">
                            <el-radio :label="true">自定义</el-radio>
                            <el-radio :label="false">报送</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="填报单位标识码" prop="siteCode" style="width:49%" v-if="title == '添加新媒体站点信息'">
                        <!-- <el-input v-model="form.parentSite" placeholder="请输入组织单位填报单位标识码" style="width:90%" clearable  /> -->
                        <el-select v-model="form.siteCode" filterable  placeholder="请输入并选择填报单位标识码" style="width:90%" @change="parentSiteChange"  remote :remote-method="remoteMethod" >
                            <el-option
                                v-for="item in siteCodeDate"
                                :key="item.siteCode"
                                :label="item.siteCode"
                                :value="item.siteCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号类型" prop="appType" style="width:49%">
                        <el-select v-model="form.appType"  placeholder="请选择新媒体账号类型" style="width:90%" @change="addAppTypeChange" :disabled="!this.form.siteCode || title=='修改新媒体站点信息'" >
                            <el-option
                                v-for="item in appTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号类型名称" prop="appTypeName" style="width:49%" v-if="form.appType == 114 || form.appType == 122">
                        <el-input v-model="form.appTypeName" placeholder="请输入账号类型名称" style="width:90%" @change="handleInput" />
                    </el-form-item>
                    <el-form-item label="新媒体标识码" prop="siteCodeMedia" style="width:49%">
                        <!-- <el-input v-model="form.siteCodeMedia" placeholder="请输入新媒体标识码" style="width:90%" :disabled="title=='修改新媒体站点信息'" /> -->
                        <el-input v-model.trim="form.siteCodeMedia" :disabled="!CustomSiteCodeS"  placeholder="请输入新媒体标识码" style="width:90%"  v-if="title=='添加新媒体站点信息'" />
                        <el-input v-model.trim="form.siteCodeMedia" disabled  placeholder="请输入新媒体标识码" style="width:90%"  v-else/>
                    </el-form-item>
                    <el-form-item label="微信号ID" prop="uid" style="width:49%" v-if="form.appType == 1">
                        <el-input v-model="form.uid" placeholder="请输入微信号ID" style="width:90%" />
                    </el-form-item>
                    <el-form-item label="唯一标识" prop="uniqueCode" style="width:49%">
                        <!-- <el-input v-model="form.uniqueCode" placeholder="请输入账号唯一标识" style="width:90%" :disabled="wybsType" /> -->
                        <el-input v-model="form.uniqueCode" placeholder="请输入账号唯一标识" style="width:90%" />
                        <!-- <el-tooltip class="item" effect="dark" content="点击查询账号补充信息" placement="top">
                            <i class="el-icon-search searchIcon" @click="queryMediaUserInfo"></i>
                        </el-tooltip> -->
                    </el-form-item>
                    <el-form-item label="账号状态" prop="appUserState" style="width:49%">
                        <!-- <el-input v-model="form.appUserState" placeholder="请输入新媒体账号状态" style="width:90%" /> -->
                        <el-select v-model="form.appUserState" clearable placeholder="请选择新媒体账号状态" style="width:90%"  >
                            <el-option
                                v-for="item in appUserStateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主页地址" prop="homeUrl" style="width:94.8%">
                        <el-input v-model="form.homeUrl" placeholder="请输入主页地址"  />
                    </el-form-item>
                    <el-form-item label="账号名称" prop="accountName" style="width:49%">
                        <el-input v-model="form.accountName" placeholder="请输入账号名称" style="width:90%"  />
                    </el-form-item>
                    <el-form-item label="账号主体" prop="accountSubject" style="width:49%">
                        <el-input v-model="form.accountSubject" placeholder="请输入账号主体" style="width:90%"  />
                    </el-form-item>
                    <el-form-item label="账号简介" prop="accountProfile" style="width:94.8%">
                        <el-input v-model="form.accountProfile" type="textarea" placeholder="请输入账号简介"  />
                    </el-form-item>
                    
                    <!-- <el-form-item label="是否收费" prop="vipFlag" style="width:49%">
                        <el-select v-model="form.vipFlag" clearable placeholder="请选择是否收费" style="width:90%" >
                            <el-option
                                v-for="item in vipFlagList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="是否开启监测" prop="enabled" style="width:49%">
                        <el-select v-model="form.enabled" clearable placeholder="请选择是否开启监测" style="width:90%" @change="enabledChange" >
                            <el-option
                                v-for="item in enabledList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="监测状态" prop="scanState" style="width:49%" v-if="form.enabled == true">
                        <el-select v-model="form.scanState" clearable placeholder="请选择监测状态" style="width:90%" >
                            <el-option
                                v-for="item in scanStateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                     <el-form-item label="省" prop="province" style="width:49%">
                        <el-input v-model="form.province" placeholder="请输入省" style="width:90%"  />
                    </el-form-item>
                     <el-form-item label="市" prop="city" style="width:49%">
                        <el-input v-model="form.city" placeholder="请输入市" style="width:90%"  />
                    </el-form-item>
                     <el-form-item label="县" prop="county" style="width:49%">
                        <el-input v-model="form.county" placeholder="请输入县" style="width:90%"  />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" style="width:94.8%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 模板上传 -->
        <el-dialog :title="title6" :visible.sync="open6" width="680px" append-to-body @close="cancel6">
            <el-form ref="form6" :model="form6" :rules="rules6" label-width="140px">
                <el-form-item label="自定义新媒体站点" prop="customFlag" style="width:95%" v-if="uploadType == 2">
                    <el-radio-group v-model="form6.customFlag">
                        <el-radio :label="true">自定义</el-radio>
                        <el-radio :label="false">报送</el-radio>
                    </el-radio-group>
                </el-form-item>
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
                    <el-button type="primary" plain icon="el-icon-bottom" size="mini" @click="handleDown" >模板下载</el-button>
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
    listInspMediaInfo,
    getInspMediaInfo,
    delInspMediaInfo,
    addInspMediaInfo,
    updateInspMediaInfo,
    queryMediaUserInfo,
    addMediaTask,
    selectMaxNum,
    queryList
} from "@/api/biz/inspMediaInfo";
import { inspImportdataTask, } from "@/api/biz/wrongWords";


export default {
    name: "InspMediaInfo",
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
            // 新媒体站点信息表格数据
            inspMediaInfoList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
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
                county: null // 县
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                customFlag: [{ required: true, message: '请选择自定义新媒体站点', trigger: 'change' }],
                siteCode: [{ required: true, message: '请输入主办单位网站标识码', trigger: 'blur' }],
                siteCodeMedia: [
                    { required: true, message: '请输入新媒体标识码', trigger: 'blur' },
                    { min: 16, max: 16, message: '长度在16个字符', trigger: 'blur' }
                ],
                uniqueCode: [{ required: true, message: '请输入账号唯一标识', trigger: 'blur' }],
                uid: [{ required: true, message: '请输入微信号ID', trigger: 'blur' }],
                homeUrl: [{ required: false, message: '请输入主页地址', trigger: 'blur' }],
                accountName: [{ required: true, message: '请输入账号名称', trigger: 'blur' }],
                // accountSubject: [{ required: true, message: '请输入账号主体', trigger: 'blur' }],
                // accountProfile: [{ required: true, message: '请输入账号简介', trigger: 'blur' }],
                appUserState: [{ required: true, message: '请选择新媒体账号状态', trigger: 'change' }],
                appType: [{ required: true, message: '请选择新媒体账号类型', trigger: 'change' }],
                vipFlag: [{ required: true, message: '请选择是否收费', trigger: 'change' }],
                enabled: [{ required: true, message: '请选择是否开启监测', trigger: 'change' }],
                scanState: [{ required: true, message: '请选择监测状态', trigger: 'change' }],
                appTypeName: [{ required: false, message: '请输入账号类型名称', trigger: 'blur' }],

            },

            /**下拉框数据 */
            // 是否收费
            vipFlagList: [
                { label: '收费', value: true },
                { label: '免费', value: false }
            ],
            // 是否开启监测
            enabledList: [
                { label: '开启', value: true },
                { label: '关闭', value: false }
            ],
            // 监测状态
            scanStateList: [
                { label: '未监测', value: 1 },
                { label: '待监测', value: 2 },
                { label: '监测中', value: 3 },
                { label: '监测异常', value: 4 },
            ],
            // 新媒体账号状态
            appUserStateList: [
                { label: '正常', value: 1 },
                { label: '迁移', value: 2 },
                { label: '删除', value: 3 },
                { label: '注销', value: 0 },
                { label: '已发关停公告', value: 4 },
                { label: '冻结期', value: 5 },
            ],
            // 是否删除
            delFlagList: [
                { label: '删除', value: 1 },
                { label: '不删除', value: 0 }
            ],
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
                { label: '知乎', value: 126 },
                { label: '微信视频号', value: 127 },
                { label: '其他', value: 114 },
            ],
            wybsType: false,

            siteCodeDate: [],

            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            rules6: {
                customFlag: [{ required: true, message: '请选择是否为自定义新媒体站点', trigger: 'change' }],
            },
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '站点联系人导入',
            uploadType: null,


            CustomSiteCodeS: false,


        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询新媒体站点信息列表 */
        getList() {
            this.loading = true;
            listInspMediaInfo(this.queryParams).then(response => {
                this.inspMediaInfoList = response.rows;
                this.total = response.total;
                for(var i in this.inspMediaInfoList){
                    // 账号类型
                    // if(this.inspMediaInfoList[i].appType == 1){
                    //     this.inspMediaInfoList[i].appTypeTxt = '微信';
                    // }else if(this.inspMediaInfoList[i].appType == 2){
                    //     this.inspMediaInfoList[i].appTypeTxt = '微博';
                    //     this.inspMediaInfoList[i].uid = '--';
                    // }else if(this.inspMediaInfoList[i].appType == 3){
                    //     this.inspMediaInfoList[i].appTypeTxt = '抖音';
                    //     this.inspMediaInfoList[i].uid = '--';
                    // }else if(this.inspMediaInfoList[i].appType == 4){
                    //     this.inspMediaInfoList[i].appTypeTxt = '头条';
                    //     this.inspMediaInfoList[i].uid = '--';
                    // }else if(this.inspMediaInfoList[i].appType == 5){
                    //     this.inspMediaInfoList[i].appTypeTxt = '快手';
                    //     this.inspMediaInfoList[i].uid = '--';
                    // }
                    if(this.inspMediaInfoList[i].appType != 1){
                        this.inspMediaInfoList[i].uid = '--';
                    }
                    for(var j in this.appTypeList){
                        if(this.inspMediaInfoList[i].appType == this.appTypeList[j].value){
                            this.inspMediaInfoList[i].appTypeTxt = this.appTypeList[j].label;
                        }
                    }
                    // 账号状态
                    if(this.inspMediaInfoList[i].appUserState == 1){
                        this.inspMediaInfoList[i].appUserStateTxt = '正常';
                    }else if(this.inspMediaInfoList[i].appUserState == 2){
                        this.inspMediaInfoList[i].appUserStateTxt = '迁移';
                    }else if(this.inspMediaInfoList[i].appUserState == 3){
                        this.inspMediaInfoList[i].appUserStateTxt = '删除';
                    }else if(this.inspMediaInfoList[i].appUserState == 0){
                        this.inspMediaInfoList[i].appUserStateTxt = '注销';
                    }else if(this.inspMediaInfoList[i].appUserState == 4){
                        this.inspMediaInfoList[i].appUserStateTxt = '已发关停公告';
                    }else if(this.inspMediaInfoList[i].appUserState == 5){
                        this.inspMediaInfoList[i].appUserStateTxt = '冻结期';
                    }
                    // 是否开启监测
                    if(this.inspMediaInfoList[i].enabled == true){
                        this.inspMediaInfoList[i].enabledTxt = '开启';
                    }else if(this.inspMediaInfoList[i].enabled == false){
                        this.inspMediaInfoList[i].enabledTxt = '关闭';
                    }
                    // 监测状态
                    if(this.inspMediaInfoList[i].scanState == 1){
                        this.inspMediaInfoList[i].scanStateTxt = '未监测';
                    }else if(this.inspMediaInfoList[i].scanState == 2){
                        this.inspMediaInfoList[i].scanStateTxt = '待监测';
                    }else if(this.inspMediaInfoList[i].scanState == 3){
                        this.inspMediaInfoList[i].scanStateTxt = '监测中';
                    }else if(this.inspMediaInfoList[i].scanState == 4){
                        this.inspMediaInfoList[i].scanStateTxt = '监测异常';
                    }else{
                        this.inspMediaInfoList[i].scanStateTxt = '--';
                    }
                    // 是否收费
                    if(this.inspMediaInfoList[i].vipFlag == true){
                        this.inspMediaInfoList[i].vipFlagTxt = '收费';
                    }else if(this.inspMediaInfoList[i].vipFlag == false){
                        this.inspMediaInfoList[i].vipFlagTxt = '免费';
                    }
                    // 检查每个变量是否有值，并且拼接有值的变量
                    this.inspMediaInfoList[i].area = '';
                    if (this.inspMediaInfoList[i].province) this.inspMediaInfoList[i].area += this.inspMediaInfoList[i].province + '/';
                    if (this.inspMediaInfoList[i].city) this.inspMediaInfoList[i].area += this.inspMediaInfoList[i].city + '/';
                    if (this.inspMediaInfoList[i].county) this.inspMediaInfoList[i].area += this.inspMediaInfoList[i].county + '/';
                    this.inspMediaInfoList[i].area = this.inspMediaInfoList[i].area.slice(0, -1);

                    // 根据结果输出
                    if (!this.inspMediaInfoList[i].area) {
                        this.inspMediaInfoList[i].area = '--';
                    }
                   

                }
                this.loading = false;
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
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                scanState: 1,
                delFlag: 0,
                appTypeName: null,
                province: null, // 省
                city: null, // 市
                county: null, // 县
            };
            this.siteCodeDate = [];
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加新媒体站点信息";
            this.wybsType = false;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            let data = {
                id: id
            }
            getInspMediaInfo(data).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改新媒体站点信息";
                this.wybsType = true;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单数据')
                    // if(this.form.appType == 122){ // 小程序
                    //     this.form.appTypeName = '小程序+'+this.form.appTypeName;  
                    // }else if(this.form.appType == 114){ // 其他
                    //     this.form.appTypeName = '其他+'+this.form.appTypeName;  
                    // }
                    console.log(this.form,'表单数据2')

                    // 账号类型不是微信公众号，清空微信号ID
                    if(this.form.appType != 1){ 
                        this.form.uid = null;
                    }
                    if (this.form.id != null) {
                        updateInspMediaInfo(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspMediaInfo(this.form).then(response => {
                            if(response.data == true){ // 成功
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            }else{ // 失败
                                this.$modal.msgError(response.msg);
                            }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除标识码为"' + row.siteCodeMedia + '"的数据项？')
                    .then(function() {
                        return delInspMediaInfo({ids:[ids]});
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
                        return delInspMediaInfo({ids:ids});
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
                "biz/inspMediaInfo/export",
                {
                    ...this.queryParams
                },
                `inspMediaInfo_${new Date().getTime()}.xlsx`
            );
        },

        // 是否开启监测下拉事件
        enabledChange(){
            console.log(this.form.enabled)
            if(this.form.enabled == false){
                this.form.scanState = null;
            }
        },
        // 新媒体账号类型
        appTypeChange(){
            if(this.form.appType == 1){
                this.form.uid = null;
            }
        },
        // 查询补充信息
        queryMediaUserInfo(){
            if(this.form.uniqueCode && this.form.appType){
                let data = {
                    uniqueCode: this.form.uniqueCode,
                    appType: this.form.appType,
                }
                queryMediaUserInfo(data).then((res)=>{
                    if(res.code == 200){
                        if(Object.keys(res.data).length != 0){
                            this.form.homeUrl = res.data.homeUrl;
                            this.form.accountName = res.data.accountName;
                            this.form.accountProfile = res.data.accountProfile;
                        }
                    }
                })
            }else{
                this.$modal.msgWarning("请先选择账号类型和填写唯一标识");                
            }
        },
        // 下发任务
        MediaTask(row){
             let data = {
                 id: row.id
             }
             addMediaTask(data).then((res)=>{
                this.$modal.msgSuccess("下发任务成功");
             })
        },


        // 是否自定义
        customFlagChange(){
            this.form.siteCode = null; // 标识码
            this.form.appType = null; // 类型 
            this.form.appTypeName = null; // 名称
            this.form.siteCodeMedia = null; // 新媒体标识码
            this.siteCodeDate = [];
            if(this.title == '修改新媒体站点信息'){
                this.CustomSiteCodeS = true;
            }else{
                this.form.parentSite = null;
                this.form.siteCode = null;
                if(this.form.customFlag == true){
                    this.CustomSiteCodeS = true;
                }else{
                    this.CustomSiteCodeS = false;                 
                }
            }
        },
        // 填报单位表示码模糊搜
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    let data = {
                        likeSiteOrName: query,
                        siteType: 2,
                        codeType: 2,
                        pgNum: 1,
                        pgSize: 5,
                        customFlag: this.form.customFlag
                    }
                    queryList(data).then((res)=>{
                        this.siteCodeDate = res.data;
                    })
                },1000)
            }
        },
        // 填报单位类型下拉
        parentSiteChange(val){
            // if(val){
            //     let date = {
            //         appType: 1,
            //         siteCode: val,
            //     }
            //     selectMaxNum(date).then((res)=>{
            //         // this.form.siteCode = res.data.siteCode;
            //         this.form.siteCodeMedia = res.data.siteCodeMedia;
            //         this.form.num = res.data.num;
            //     })
            // }else{
            //     this.form.num = null;
            //     this.form.siteCode = null;
            // }
        },
        handleInput(event) {
            console.log(event,'123')
            // 输入框内容变化时调用的方法
            console.log('Input changed:', this.inputValue);
            // 在这里可以添加其他逻辑
            if(this.form.appTypeName){
                if(this.form.appType == 114){ // 其他
                    if(event.includes('其他+')){
                        this.form.appTypeName = event;
                    }else{
                        this.form.appTypeName = '其他+'+event;
                    }
                }else if(this.form.appType == 122){ // 小程序
                    if(event.includes('小程序+')){
                        this.form.appTypeName = event;                        
                    }else{
                        this.form.appTypeName = '小程序+'+event;                        
                    }
                }else{
                    this.form.appTypeName = null;
                }


                if(this.form.customFlag == true){
                    this.CustomSiteCodeS = false;
                    // setTimeout(()=>{
                        if(this.form.siteCode){
                            let date = {
                                appType: this.form.appType,
                                siteCodeLikeWhere: this.form.siteCode,
                                appTypeName: this.form.appTypeName
                            }
                            selectMaxNum(date).then((res)=>{
                                // this.form.siteCode = res.data.siteCode;
                                this.form.siteCodeMedia = res.data.siteCodeMedia;
                                this.form.num = res.data.num;
                            })
                        }
                    // },1000)
                }else{
                    this.CustomSiteCodeS = true;
                }
                
            }
        },
        // 账号类型下拉事件
        addAppTypeChange(){
            console.log(this.form.appTypeName)
            this.form.siteCodeMedia = null;
            this.form.appTypeName = null;

            // 账号类型不是微信公众号，清空微信号ID
            if(this.form.appType != 1){
                this.form.uid = null;
            }
            // 类型为报送
            if(this.form.customFlag == true){
                this.CustomSiteCodeS = false;
                for(var i in this.appTypeList){
                    if(this.form.appType == this.appTypeList[i].value){
                        this.form.appTypeName = this.appTypeList[i].label;
                    }
                }
                if(this.form.appType == 114 || this.form.appType == 122){
                    this.rules.appTypeName[0].required = true;
                    this.form.appTypeName = null;
                }else{
                    // this.form.appTypeName = null;
                    this.rules.appTypeName[0].required = false;
                    if(this.form.siteCode){
                        let date = {
                            appType: this.form.appType,
                            siteCodeLikeWhere: this.form.siteCode,
                            appTypeName: this.form.appTypeName
                        }
                        selectMaxNum(date).then((res)=>{
                            // this.form.siteCode = res.data.siteCode;
                            this.form.siteCodeMedia = res.data.siteCodeMedia;
                            this.form.num = res.data.num;
                        })
                    }
                }
            }else if(!this.form.customFlag){
                this.CustomSiteCodeS = true;
            }else{
                this.CustomSiteCodeS = false;
            }
            
            // setTimeout(()=>{
                // if(this.form.siteCode){
                //     let date = {
                //         appType: this.form.appType,
                //         siteCode: this.form.siteCode,
                //         appTypeName: this.form.appTypeName
                //     }
                //     selectMaxNum(date).then((res)=>{
                //         // this.form.siteCode = res.data.siteCode;
                //         this.form.siteCodeMedia = res.data.siteCodeMedia;
                //         this.form.num = res.data.num;
                //     })
                // }
            // },1000)
        },

        // 地址超链接
        dzChange(url){
            if(url != null || url != ''){
                window.open(url)
            }
        },

         // 导入
        // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.uploadType = type;
            if(type == 2){ // 新增导入
                this.title6 = '新媒体站点信息新增导入'
            }else if(type == 3){ // 修改导入
                this.title6 = '新媒体站点信息修改导入'
            }
            this.open6 = true;
        },
        // 取消
        cancel6(){
            this.fileList = [];
            this.subFileList = [];
            this.open6 = false;
            this.form6 = {};
            this.resetForm("form6");
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
            this.$refs["form6"].validate(valid => {
                if (valid) {
                    if(this.subFileList.length > 0){
                        const formData = new FormData();
                        if(this.uploadType == 2){ // 新增导入
                            this.subFileList.forEach(f => {
                                formData.append("file", f.raw);
                                formData.append("taskType", 1203);
                                formData.append("customFlag", this.form6.customFlag);
                            });
                            console.log(formData,'formData')
                        }else if(this.uploadType == 3){ // 修改导入
                            this.subFileList.forEach(f => {
                                formData.append("file", f.raw);
                                formData.append("taskType", 1204);
                            });
                            console.log(formData,'formData')
                        }
                        inspImportdataTask(formData).then((res)=>{
                            if(res.code == 200){
                                this.open6 = false;
                                this.subFileList = [];
                                this.$modal.msgSuccess("模板上传成功");
                                this.getList();
                            }
                        })
                        
                    }else{
                        this.$modal.msgWarning("请先上传文件");
                    }
                    
                }
            });
            
        },
        // 模板下载
        handleDown(){
            if(this.uploadType == 2 ){ // 新增导入
                let fileName = '新媒体站点信息-新增导入模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1203",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }else if(this.uploadType == 3){ // 修改导入
                let fileName = '新媒体站点信息-修改导入模板';  
                this.download2(
                    "common/download/downloadExcelTpl?type=1204",'',
                    `${fileName}.xlsx`
                ).then((res)=>{});
            }
            
            
        },
        // 任务详情
        goInfo(){
            this.$router.push({ path: '/media/infoTaskInfo' })
        },



    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .searchIcon{
        cursor: pointer;
        position: relative;
        right: 25px;
    }
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
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
