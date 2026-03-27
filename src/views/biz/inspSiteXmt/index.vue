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
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="新媒体标识码" prop="siteCodeMedia">
                <el-input
                    v-model="queryParams.siteCodeMedia"
                    placeholder="请输入新媒体标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
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
                    v-hasPermi="['biz:inspSiteXmt:add']"
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
                    v-hasPermi="['biz:inspSiteXmt:edit']"
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
                    v-hasPermi="['biz:inspSiteXmt:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspSiteXmt:export']"
                >导出</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-top"
                    size="mini"
                    @click="handleFile"
                    v-hasPermi="['biz:inspSiteXmt:add']"
                >模板上传</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-bottom"
                    size="mini"
                    @click="handleDown"
                    v-hasPermi="['biz:inspSiteXmt:add']"
                >模板下载</el-button>
            </el-col> -->
            <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile" >站点关系导入</el-button>
            <el-button type="primary" plain  size="mini" @click="goInfo" >任务详情</el-button>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspSiteXmtList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="主键ID" align="center" prop="id" />
            <el-table-column label="网站标识码" align="center" prop="siteCode" />
            <el-table-column label="新媒体标识码" align="center" prop="siteCodeMedia" />
            <el-table-column label="创建人" prop="createBy"  ></el-table-column>
            <el-table-column label="创建时间" prop="createTime"  ></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspSiteXmt:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspSiteXmt:remove']"
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

        <!-- 添加或修改站点和新媒体账号关联对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <el-form-item label="网站标识码" prop="siteCode" style="width:92%">
                    <!-- <el-input v-model="form.siteCode" placeholder="请输入网站标识码" /> -->
                    <el-select v-model="form.siteCode" clearable filterable remote :remote-method="remoteMethod11" placeholder="请输入并选择网站标识码/名称" style="width:100%" @change="siteCodeChange" >
                        <el-option
                            v-for="item in siteCodeDate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新媒体标识码" prop="siteCodeMedia" style="width:92%">
                    <!-- <el-input v-model="form.siteCodeMedia" placeholder="请输入新媒体标识码" /> -->
                    <el-select v-model="form.siteCodeMedia" clearable filterable remote :remote-method="remoteMethod22" placeholder="请输入并选择网站标识码/名称" style="width:100%" @change="siteCodeMediaChange" :disabled='title=="修改站点和新媒体账号关联"' >
                        <el-option
                            v-for="item in siteCodeMediaDate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width:92%">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 模板上传 -->
        <el-dialog :title="title6" :visible.sync="open6" width="520px" append-to-body @close="cancel6">
            <el-form ref="form6" :model="form6"  label-width="60px">
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
    listInspSiteXmt,
    getInspSiteXmt,
    delInspSiteXmt,
    addInspSiteXmt,
    updateInspSiteXmt,
    inspSiteInfo,
    inspMediaInfo,
    batchImport,
    templateDownload
} from "@/api/biz/inspSiteXmt";
import { inspImportdataTask, } from "@/api/biz/wrongWords";

export default {
    name: "InspSiteXmt",
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
            // 站点和新媒体账号关联表格数据
            inspSiteXmtList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                siteCodeMedia: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                siteCode: [{ required: true, message: '请选择网站标识码', trigger: 'change' }],
                siteCodeMedia: [{ required: true, message: '请选择新媒体标识码', trigger: 'change' }],
            },
            siteCodeDate: [],
            siteCodeMediaDate: [],

            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '新媒体站点关系导入',

        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询站点和新媒体账号关联列表 */
        getList() {
            this.loading = true;
            listInspSiteXmt(this.queryParams).then(response => {
                this.inspSiteXmtList = response.rows;
                this.total = response.total;
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
            this.title = "添加站点和新媒体账号关联";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            let data = {
                id: id
            }
            getInspSiteXmt(data).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改站点和新媒体账号关联";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspSiteXmt(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspSiteXmt(this.form).then(response => {
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
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除主键ID为"' + row.id + '"的数据项？')
                    .then(function() {
                        return delInspSiteXmt({ids:[ids]});
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
                        return delInspSiteXmt({ids:ids});
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
                "biz/inspSiteXmt/export",
                {
                    ...this.queryParams
                },
                `inspSiteXmt_${new Date().getTime()}.xlsx`
            );
        },
        remoteMethod11(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    let date = {
                        likeSiteOrName: query,
                        pgNum: 1,
                        pgSize: 5,
                        siteType: 2
                    }
                    inspSiteInfo(date).then(response => {
                        this.siteCodeDate = response.data;  // 订单-搜索
                        for(var i in this.siteCodeDate){
                            this.siteCodeDate[i].label = this.siteCodeDate[i].siteCode;
                            this.siteCodeDate[i].value = this.siteCodeDate[i].siteCode;
                        }
                        this.loading = false;
                    });
                },1000)
            }
        },
        siteCodeChange(){
            
        },
        remoteMethod22(query) {
            console.log(query,'queryqueryquery')
            if(query){
                setTimeout(()=>{
                    let date = {
                        likeSiteOrName: query,
                        pgNum: 1,
                        pgSize: 5
                    }
                    inspMediaInfo(date).then(response => {
                        this.siteCodeMediaDate = response.data;  // 订单-搜索
                        for(var i in this.siteCodeMediaDate){
                            this.siteCodeMediaDate[i].label = this.siteCodeMediaDate[i].siteCodeMedia;
                            this.siteCodeMediaDate[i].value = this.siteCodeMediaDate[i].siteCodeMedia;
                        }
                        this.loading = false;
                    });
                },1000)
            }
        },
        siteCodeMediaChange(){
            
        },

         // 导入
        // 模板上传
        handleFile(){
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
                    formData.append("file", f.raw);
                    formData.append("taskType", 1205);
                });
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
            
        },
        // 模板下载
        handleDown(){
            let fileName = '新媒体站点关系-导入模板';  
            this.download2(
                "common/download/downloadExcelTpl?type=1205",'',
                `${fileName}.xlsx`
            ).then((res)=>{});
        },
        // 

        // 任务详情
        goInfo(){
            this.$router.push({ path: '/media/taskInfo' })
        },

        
    }
};
</script>
<style scoped>
    /deep/.el-upload-list{
        width: 86%!important;
    }
</style>
