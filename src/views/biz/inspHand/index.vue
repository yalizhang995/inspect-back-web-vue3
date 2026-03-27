<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="84px"
        >
            <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="监测时间" prop="scanDate" class="a" style="width:292px">
                <el-date-picker
                    clearable
                    v-model="queryParams.scanDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择监测时间"
                    style="width:192px"
                ></el-date-picker>
            </el-form-item>
           <el-form-item label="指标类型" prop="normId">
                <!-- <el-input
                    v-model="queryParams.normId"
                    placeholder="请输入指标类型"
                    clearable
                    @keyup.enter.native="handleQuery"
                /> -->
                <el-select v-model="queryParams.normId" filterable clearable placeholder="请选择指标类型">
                    <el-option
                    v-for="item in normIdDate"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="一级指标" prop="firstNormId">
                <!-- <el-input
                    v-model="queryParams.firstNormId"
                    placeholder="请输入一级指标"
                    clearable
                    @keyup.enter.native="handleQuery"
                /> -->
                <el-select v-model="queryParams.firstNormId" filterable clearable placeholder="请选择一级指标">
                    <el-option
                    v-for="item in firstNormIdDate"
                    :key="item.value"
                    :label="item.normName"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级指标" prop="secondNormId">
                <!-- <el-input
                    v-model="queryParams.secondNormId"
                    placeholder="请输入二级指标"
                    clearable
                    @keyup.enter.native="handleQuery"
                /> -->
                <el-select v-model="queryParams.secondNormId" filterable clearable placeholder="请选择二级指标">
                    <el-option
                    v-for="item in secondNormIdDate"
                    :key="item.value"
                    :label="item.normName"
                    :value="item.value">
                    </el-option>
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
                    v-hasPermi="['biz:inspHand:add']"
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
                    v-hasPermi="['biz:inspHand:edit']"
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
                    v-hasPermi="['biz:inspHand:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspHand:export']"
                >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspHandList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="主键ID" align="center" prop="id" />
            <el-table-column label="网站标识码" align="center" prop="siteCode" />
            <el-table-column label="监测时间" align="center" prop="scanDate" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.scanDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="栏目名称" align="center" prop="channelName" />
            <el-table-column label="页面地址" align="center" prop="pageUrl" />
            <el-table-column label="问题描述" align="center" prop="problemDesc" />
            <el-table-column label="页面截图" align="center" prop="imgPath" />
            <el-table-column label="指标类型" align="center" prop="normId" />
            <el-table-column label="一级指标" align="center" prop="firstNormId" />
            <el-table-column label="二级指标" align="center" prop="secondNormId" />
            <el-table-column label="分值类型" align="center" prop="scoreType" />
            <el-table-column label="分值" align="center" prop="scoreVal" />
            <el-table-column label="指标特有类型" align="center"  prop="publicType" />
            <el-table-column label="评分细则" align="center" prop="remark" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspHand:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspHand:remove']"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改人工录入问题对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <div class="box">
                    <el-form-item label="网站标识码" prop="siteCode" style="width: 48%">
                        <el-input v-model="form.siteCode" placeholder="请输入网站标识码" style="width: 90%"/>
                    </el-form-item>
                    <el-form-item label="监测时间" prop="scanDate" style="width: 48%">
                        <el-date-picker
                            clearable
                            v-model="form.scanDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择监测时间"
                            style="width:90%"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="栏目名称" prop="channelName" style="width: 48%">
                        <el-input v-model="form.channelName" placeholder="请输入栏目名称" style="width: 90%"/>
                    </el-form-item>
                    <el-form-item label="页面地址" prop="pageUrl" style="width: 48%">
                        <el-input v-model="form.pageUrl" placeholder="请输入页面地址" style="width: 90%"/>
                    </el-form-item>
                    <el-form-item label="页面截图" prop="imgPath" style="width: 92.5%">
                        <!-- <el-input v-model="form.imgPath" type="textarea" placeholder="请输入内容"/> -->
                        <el-upload
                            :action="upurl"
                            ref="uploadMutiple"
                            :data="myData"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-change="imgchange"
                            :file-list="fileList"
                            multiple
                            :headers="headers"
                            :on-success="getupload"
                            :auto-upload="false"
                            :limit='5'
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div id="preview" @paste="handlePaste">
                            <span>
                                <i class="el-icon-s-opportunity" style="color:#FB894C"></i>点击此处 将图片按Ctrl+V 粘贴至此处<span style="color:red;fontSize:12px">（最多上传5张）</span>
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item label="指标类型" prop="normId" style="width:48%">
                        <el-select v-model="form.normId" filterable clearable placeholder="请选择指标类型" style="width:90%">
                            <el-option
                            v-for="item in normIdDate"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="一级指标" prop="firstNormId" style="width: 48%">
                        <!-- <el-input v-model="form.firstNormId" placeholder="请输入一级指标ID" /> -->
                        <el-select v-model="form.firstNormId" filterable clearable placeholder="请选择指标类型" style="width:90%">
                            <el-option
                            v-for="item in firstNormIdDate"
                            :key="item.value"
                            :label="item.normName"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级指标" prop="secondNormId" style="width: 48%">
                        <!-- <el-input v-model="form.secondNormId" placeholder="请输入二级指标ID" /> -->
                        <el-select v-model="form.secondNormId" filterable clearable placeholder="请选择指标类型" style="width:90%" @change="secondChange">
                            <el-option
                            v-for="item in secondNormIdDate"
                            :key="item.value"
                            :label="item.normName"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分值" prop="scoreVal" style="width: 48%">
                        <!-- <el-input v-model="form.scoreVal" placeholder="请输入分值" style="width: 90%"/> -->
                        <el-input-number v-model="form.scoreVal" controls-position="right" :min="1" :max="10" label="描述文字" style="width: 90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="评分细则" prop="remark" style="width: 92.5%">
                        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                    <el-form-item label="问题描述" prop="problemDesc" style="width: 92.5%">
                        <el-input v-model="form.problemDesc" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 图片放大 -->
        <el-dialog :visible.sync="innerVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspHand,
    getInspHand,
    delInspHand,
    addInspHand,
    updateInspHand,
    listInspNorm
} from "@/api/biz/inspHand";
import { uploadAvatars } from "@/api/system/user";


export default {
    name: "InspHand",
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
            // 人工录入问题表格数据
            inspHandList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                scanDate: null,
                channelName: null,
                pageUrl: null,
                problemDesc: null,
                imgPath: null,
                firstNormId: null,
                secondNormId: null,
                normId: null,
                scoreType: null,
                scoreVal: null,
                publicType: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},

            normIdDate: [],
            firstNormIdDate: [],
            secondNormIdDate: [],

            upurl: process.env.VUE_APP_BASE_API + "/common/uploads", // 上传的图片服务器地址
            headers: {
                // Authorization: "Bearer " + getToken(),
                "Content-Type": "multipart/form-data"
            },
            myData: {
                key: "Gn1xVdBiTClSSHKZifg0pTQSU5XGagWO"
            }, //上传时附带的额外参数
            fileList: [], //上传的文件列表
            dialogImageUrl: "",
            innerVisible: false,
            upload_list: [], //提交的图片数组
            limit: 5,
        };
    },
    created() {
        this.getList();
        this.listInspNormFn(1);
        this.listInspNormFn(2);
    },
    methods: {
        /** 查询人工录入问题列表 */
        getList() {
            this.loading = true;
            listInspHand(this.queryParams).then(response => {
                this.inspHandList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        listInspNormFn(num){
            let data = {
                level: num
            }
            listInspNorm(data).then((res)=>{
                if(num == 1){
                    this. firstNormIdDate = res.data;
                }else if(num == 2){
                    this.secondNormIdDate = res.data;
                }
            })
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
                scanDate: null,
                channelName: null,
                pageUrl: null,
                problemDesc: null,
                imgPath: null,
                firstNormId: null,
                secondNormId: null,
                normId: null,
                scoreType: null,
                scoreVal: null,
                publicType: null,
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
            this.queryParams.pageNum = 1;
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
            this.title = "添加人工录入问题";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspHand(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改人工录入问题";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspHand(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspHand(this.form).then(response => {
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
            const ids = row.id || this.ids;
            this.$modal
                .confirm(
                    '是否确认删除人工录入问题编号为"' + ids + '"的数据项？'
                )
                .then(function() {
                    return delInspHand(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            let fileName = '人工数据'
            this.download(
                "biz/inspHand/export",
                {
                    ...this.queryParams
                },
                `${fileName}.xlsx`
            );
        },

        /**新增、编辑弹框 */
        // 二级指标点击
        secondChange(){

        },


        handlePaste(event) {
            const items = (event.clipboardData || window.clipboardData).items;
            console.log(items, "items");
            let file = null;
            if (!items || items.length === 0) {
                this.$message.error("当前浏览器不支持本地");
                return;
            }
            // 搜索剪切板items
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    file = items[i].getAsFile();
                    break;
                }
            }
            console.log(file, "file");
            if (!file) {
                this.$message.error("粘贴内容非图片");
                return;
            }
            if (this.fileList.length >= this.limit) {
                this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`); // 图片数量超出
                return;
            }
            this.$refs.uploadMutiple.handleStart(file); // 将粘贴过来的图片加入预上传队列
            // this.$refs.uploadMutiple.submit(); // 提交图片上传队列
        },
        //上传
        imgchange(file, fileList) {
            this.fileList = fileList;
            console.log("成功", file, fileList, this.fileList);
        },
        //on-remove 文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            console.log(this.fileList, this.file);
            this.fileList = fileList;
            var index = this.upload_list.indexOf(file.url);
            console.log(index);
            this.upload_list.splice(index, 1);
        },
        //on-preview 点击文件列表中已上传的文件时的钩子(预览图片弹窗)
        handlePictureCardPreview(file) {
            console.log('111')
            this.dialogImageUrl = file.url;
            this.innerVisible = true;
            console.log(this.innerVisible,'this.innerVisible')
        },
        // 提交时打印
        getImgUrl() {
            const formData = new FormData();
            // fileList 在data中定义的数组，把所有文件放到formData中
            this.fileList.forEach(f => {
                formData.append("files", f.raw);
            });
            uploadAvatars(formData)
                .then(res => {
                    this.$modal.msgSuccess("文件上传成功");
                    // this.fileList = [];
                    // this.upload_list = res.urls
                })
                .catch(e => {
                    this.$modal.msgError("文件上传失败");
                });
            console.log(this.upload_list);
        },
        // 上传成功之后push到数组
        getupload(res, file, fileList) {
            console.log(res, "res");
            console.log(file, "file");
            console.log(fileList, "fileList");
            // this.upload_list.push(res.info.url);
            this.upload_list = fileList;
            // console.log(this.upload_list);
        }
    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
</style>
<style scoped>
    /* /deep/.el-form-item__content{
        width: 192px!important;
    }
    /deep/.a .el-input__inner{
        width: 192px!important;
    } */
    /deep/.el-upload--picture-card{
        width: 92px;
        height: 92px;
        line-height: 92px;
    }
    /deep/.el-upload-list--picture-card .el-upload-list__item{
        width: 92px;
        height: 92px;
    }
    /deep/.el-upload-list__item{
        margin-bottom: -14px!important;
    }
</style>
