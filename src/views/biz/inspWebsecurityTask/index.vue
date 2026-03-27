<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="90px"
        >
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="任务名称" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入任务名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="任务状态" prop="taskState" >
                <el-select v-model="queryParams.taskState" clearable placeholder="请选择任务状态" >
                    <el-option
                        v-for="item in taskStateDate"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="marginLeft:20px">
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
                    v-hasPermi="['biz:inspWebsecurityTask:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['biz:inspWebsecurityTask:edit']"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspWebsecurityTask:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspWebsecurityTask:export']"
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspWebsecurityTaskList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" align="center" prop="index" width="80" />
            <el-table-column label="网站标识码" prop="siteCode" width="180" />
            <el-table-column label="任务ID"  prop="taskId" width="100" show-overflow-tooltip />
            <el-table-column label="任务名称" prop="name" width="320" show-overflow-tooltip />
            <!-- <el-table-column label="监测目标内容" align="center" prop="targetContent" width="220" show-overflow-tooltip /> -->
            <el-table-column prop="targetContent" label="监测目标内容" width="420" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="dz" @click="dzChange(scope.row.targetContent)">{{ scope.row.targetContent}}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务状态" align="center" prop="taskStateTxt" width="120"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="400">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="ksjcChange(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:edit']"
                        :disabled="scope.row.taskState != 0 && scope.row.taskState != 8 && scope.row.taskState != 9"
                    >开始监测</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="ztjcChange(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:edit']"
                        :disabled="scope.row.taskState != 2"
                    >暂停监测</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="tzjcChange(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:edit']"
                        :disabled="scope.row.taskState != 2 && scope.row.taskState != 5"
                    >停止监测</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="jxjcChange(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:edit']"
                        :disabled="scope.row.taskState != 5"
                    >继续监测</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:edit']"
                        :disabled="scope.row.taskState != 0"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspWebsecurityTask:remove']"
                        :disabled="scope.row.taskState != 0"
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

        <!-- 添加或修改网站安全任务对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <div class="div">
                    <el-form-item label="网站标识码" prop="siteCode" style="width:48%">
                        <!-- <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width:90%"/> -->
                        <el-select v-model="form.siteCode" filterable clearable placeholder="请输入并选择标识码" style="width:90%" @change="parentSiteChange"  remote :remote-method="remoteMethod" :disabled="title=='修改网站安全任务'" >
                            <el-option
                                v-for="item in siteCodeDate"
                                :key="item.siteCode"
                                :label="item.siteCode"
                                :value="item.siteCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="订单ID" prop="orderInfoId" style="width:48%">
                        <el-input v-model="form.orderInfoId" placeholder="请输入订单ID" style="width:90%"/>
                    </el-form-item>
                    <el-form-item label="任务ID" prop="taskId" style="width:48%">
                        <el-input v-model="form.taskId" placeholder="请输入任务ID" style="width:90%"/>
                    </el-form-item> -->
                    <el-form-item label="任务名称" prop="name" style="width:48%">
                        <el-input v-model="form.name" placeholder="请输入任务名称" style="width:90%"/>
                    </el-form-item>
                    <el-form-item label="监测目标内容" style="width:92.7%">
                        <el-input v-model="form.targetContent" placeholder="请输入监测目标内容" />
                    </el-form-item>
                    <el-form-item label="IP反查域名" prop="domainReverse" style="width:48%">
                        <el-select v-model="form.domainReverse" clearable placeholder="请选择IP反查域名" style="width:90%">
                            <el-option
                                v-for="item in domainReverseDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子域名发现" prop="subdomainDetect" style="width:48%">
                        <el-select v-model="form.subdomainDetect" clearable placeholder="请选择子域名发现" style="width:90%" >
                            <el-option
                                v-for="item in subdomainDetectDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="应用识别" prop="appDetect" style="width:48%">
                        <el-select v-model="form.appDetect" clearable placeholder="请选择应用识别" style="width:90%">
                            <el-option
                                v-for="item in appDetectDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="WAF识别" prop="wafDetect" style="width:48%">
                        <el-select v-model="form.wafDetect" clearable placeholder="请选择WAF识别" style="width:90%">
                            <el-option
                                v-for="item in wafDetectDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="浏览器爬虫" prop="spider2Enable" style="width:48%">
                        <el-select v-model="form.spider2Enable" clearable placeholder="请选择浏览器爬虫" style="width:90%">
                            <el-option
                                v-for="item in spider2EnableDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="并发任务数" prop="webscanThreads" style="width:48%">
                        <el-input-number v-model="form.webscanThreads" controls-position="right" :min="0" :max="24" style="width:90%" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="最大URL数量" prop="spiderMaxUrls" style="width:48%">
                        <el-input-number v-model="form.spiderMaxUrls" controls-position="right" :min="0" :max="9999" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="规则并发数量" prop="webscanPocThreads" style="width:48%">
                        <el-input-number v-model="form.webscanPocThreads" controls-position="right" :min="0" :max="1023" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="爬虫并发请求数" prop="spiderThreads" style="width:48%">
                        <el-input-number v-model="form.spiderThreads" controls-position="right" :min="0" :max="1023" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="爬虫请求间隔" prop="spiderDelay" style="width:48%">
                        <el-input-number v-model="form.spiderDelay" controls-position="right" :min="0" :max="120" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="监测验证" prop="verify" style="width:48%">
                        <el-select v-model="form.verify" clearable placeholder="请选择监测验证" style="width:90%">
                            <el-option
                                v-for="item in verifyDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网页木马沙箱" prop="webTrojanSandbox" style="width:48%">
                        <el-select v-model="form.webTrojanSandbox" clearable placeholder="请选择网页木马沙箱" style="width:90%" >
                            <el-option
                                v-for="item in webTrojanSandboxDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请求方法" prop="qualityRequestMethod" style="width:48%">
                        <el-select v-model="form.qualityRequestMethod" clearable placeholder="请选择请求方法" style="width:90%" >
                            <el-option
                                v-for="item in qualityRequestMethodDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="返回码" prop="qualityExpectCode" style="width:48%">
                        <el-select v-model="form.qualityExpectCode" clearable placeholder="请选择返回码" style="width:90%" >
                            <el-option
                                v-for="item in qualityExpectCodeDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="间隔时间" prop="qualityInterval" style="width:48%">
                        <el-input-number v-model="form.qualityInterval" controls-position="right" :min="1" :max="60" style="width:90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="解析记录" prop="qualityExpectDns" style="width:48%">
                        <el-input
                            v-model="form.qualityExpectDns"
                            placeholder="请输入DNS监测参数-解析记录"
                            style="width:90%"
                        />
                    </el-form-item>
                    <el-form-item label="间隔时间" prop="contentInterval" style="width:48%">
                        <el-input-number v-model="form.contentInterval" controls-position="right" :min="1" :max="24" style="width:90%"></el-input-number>
                    </el-form-item>
                    <!-- <el-form-item label="任务状态" prop="taskState" style="width:48%">
                        <el-select v-model="form.taskState" clearable placeholder="请选择任务状态" style="width:90%">
                            <el-option
                                v-for="item in taskStateDate"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="备注" prop="remark" style="width:92.7%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
    listInspWebsecurityTask,
    getInspWebsecurityTask,
    delInspWebsecurityTask,
    addInspWebsecurityTask,
    updateInspWebsecurityTask,
    operation
} from "@/api/biz/inspWebsecurityTask";

import {
    queryList
} from "@/api/biz/inspSiteInfo";

export default {
    name: "InspWebsecurityTask",
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
            // 网站安全任务表格数据
            inspWebsecurityTaskList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                name: null,
                taskState: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                siteCode: [{ required: true, message: '请输入网站标识码', trigger: 'blur' }],
            },

            siteCodeDate: [],

            /**下拉数据 */
            // 任务状态
            taskStateDate: [
                { label: '未监测', val: 0 },
                { label: '监测中', val: 2 },
                { label: '暂停监测', val: 5 },
            ],
            // 是否开启IP反查域名
            domainReverseDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 是否开启子域名发现
            subdomainDetectDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 是否开启应用识别
            appDetectDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 是否开启WAF识别
            wafDetectDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 是否开启浏览器爬虫
            spider2EnableDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 监测验证
            verifyDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 网页木马沙箱
            webTrojanSandboxDate: [
                { label: '关闭', val: 0 },
                { label: '开启', val: 1 },
            ],
            // 请求方式
            qualityRequestMethodDate: [
                { label: 'GET', val: 'GET' },
                { label: 'POST', val: 'POST' },
            ],
            // 返回码
            qualityExpectCodeDate: [
                { label: '0', val: 0 },
                { label: '200', val: 200 },
                { label: '401', val: 401 },
                { label: '403', val: 403 },
                { label: '500', val: 500 },
            ],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询网站安全任务列表 */
        getList() {
            this.loading = true;
            listInspWebsecurityTask(this.queryParams).then(response => {
                this.inspWebsecurityTaskList = response.rows;
                this.total = response.total;
                for(var i in this.inspWebsecurityTaskList){
                    this.inspWebsecurityTaskList[i].index = parseInt(i)+1;
                    // 任务状态
                    if(this.inspWebsecurityTaskList[i].taskState == 0){
                        this.inspWebsecurityTaskList[i].taskStateTxt = '未监测';
                    }else if(this.inspWebsecurityTaskList[i].taskState == 2){
                        this.inspWebsecurityTaskList[i].taskStateTxt = '监测中';
                    }else if(this.inspWebsecurityTaskList[i].taskState == 5){
                        this.inspWebsecurityTaskList[i].taskStateTxt = '暂停监测';
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
                orderInfoId: null,
                taskId: null,
                name: null,
                startDate: null,
                endDate: null,
                targetType: null,
                targetContent: null,
                groupId: null,
                policyType: null,
                enableWebPolicy: null,
                webPolicyId: null,
                taskType: null,
                isRealtimeMonitor: null,
                scan: null,
                domainReverse: null,
                subdomainDetect: null,
                appDetect: null,
                wafDetect: null,
                spider2Enable: null,
                webscanThreads: null,
                spiderMaxUrls: null,
                webscanPocThreads: null,
                spiderThreads: null,
                spiderDelay: null,
                verify: null,
                webTrojanSandbox: null,
                qualityRequestMethod: null,
                qualityExpectCode: null,
                qualityInterval: null,
                qualityExpectDns: null,
                contentInterval: null,
                taskState: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
            };
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
            this.title = "添加网站安全任务";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspWebsecurityTask({id: id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改网站安全任务";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspWebsecurityTask(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspWebsecurityTask(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            // const ids = row.id || this.ids;
            // this.$modal
            //     .confirm(
            //         '是否确认删除网站安全任务编号为"' + ids + '"的数据项？'
            //     )
            //     .then(function() {
            //         return delInspWebsecurityTask(ids);
            //     })
            //     .then(() => {
            //         this.getList();
            //         this.$modal.msgSuccess("删除成功");
            //     })
            //     .catch(() => {});
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除任务名称为"' + row.name + '"的数据项？')
                    .then(function() {
                        return delInspWebsecurityTask({ids:[ids]});
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
                        return delInspWebsecurityTask({ids:ids});
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
                "biz/inspWebsecurityTask/export",
                {
                    ...this.queryParams
                },
                `inspWebsecurityTask_${new Date().getTime()}.xlsx`
            );
        },

        // 地址超链接
        dzChange(url){
            if(url){
                window.open(url)
            }
        },

        // 填报单位表示码模糊搜
        remoteMethod(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    let data = {
                        likeSiteOrName: query,
                        siteType: 2, // 1、组织单位 2、填报单位
                        codeType: 1, // 1、网站 2、新媒体
                        pgNum: 1,
                        pgSize: 5
                    }
                    queryList(data).then((res)=>{
                        this.siteCodeDate = res.data;
                    })
                },1000)
            }
        },
        // 填报单位类型下拉
        parentSiteChange(val){
            if(val){
                for(var i in this.siteCodeDate){
                    if(val == this.siteCodeDate[i].siteCode){
                        this.form.targetContent = this.siteCodeDate[i].siteUrl;
                        console.log(this.siteCodeDate[i].siteUrl,'123')
                    }
                }
            }else{
                this.form.targetContent = null;
            }
        },

        // 开始监测
        ksjcChange(row){
            let subDate = {
                id: row.id,
                taskId: row.taskId,
                taskState: row.taskState,
                operation: 1
            }
            this.$modal
            .confirm('是否确认开启监测任务名称为"' + row.name + '"的数据项？')
            .then(function() {
                return operation(subDate);
            })
            .then(() => {
                this.getList();
                this.$modal.msgSuccess("已开启监测！");
            })
            .catch(() => {});
        },
        // 开始监测
        ztjcChange(row){
            let subDate = {
                id: row.id,
                taskId: row.taskId,
                taskState: row.taskState,
                operation: 3
            }
            this.$modal
            .confirm('是否确认暂停监测任务名称为"' + row.name + '"的数据项？')
            .then(function() {
                return operation(subDate);
            })
            .then(() => {
                this.getList();
                this.$modal.msgSuccess("已暂停监测！");
            })
            .catch(() => {});
        },
        // 停止监测
        tzjcChange(row){
            let subDate = {
                id: row.id,
                taskId: row.taskId,
                taskState: row.taskState,
                operation: 4
            }
            this.$modal
            .confirm('是否确认停止监测任务名称为"' + row.name + '"的数据项？')
            .then(function() {
                return operation(subDate);
            })
            .then(() => {
                this.getList();
                this.$modal.msgSuccess("已停止监测！");
            })
            .catch(() => {});
        },
        // 继续监测
        jxjcChange(row){
            let subDate = {
                id: row.id,
                taskId: row.taskId,
                taskState: row.taskState,
                operation: 5
            }
            this.$modal
            .confirm('是否确认继续监测任务名称为"' + row.name + '"的数据项？')
            .then(function() {
                return operation(subDate);
            })
            .then(() => {
                this.getList();
                this.$modal.msgSuccess("已继续监测！");
            })
            .catch(() => {});
        },
    }
};
</script>
<style lang="scss" scoped>
    .div{
        display: flex;
        flex-wrap: wrap;
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
