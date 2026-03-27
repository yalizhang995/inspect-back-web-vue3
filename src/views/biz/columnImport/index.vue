<template>
    <div class="app-container">
        <!-- 采集记录 -->
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="70px"
        >
            <el-form-item label="文件名" prop="fileName">
                <el-input
                    v-model="queryParams.fileName"
                    placeholder="请输入文件名"
                    clearable
                    @keyup.enter.native="handleQuery"
                    style="width:300px"
                    @clear="queryParams.fileName=null"
                />
            </el-form-item>
            <el-form-item label="创建人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入创建人"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear="queryParams.createBy=null"
                />
            </el-form-item>
            <el-form-item label="ID" prop="id">
                <el-input
                    v-model="queryParams.id"
                    placeholder="请输入ID"
                    clearable
                    @keyup.enter.native="handleQuery"
                    @clear="queryParams.id=null"
                />
            </el-form-item>

            <el-form-item style="marginLeft:17px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>

            <el-row :gutter="10" class="mb8">
                <el-button type="success" plain icon="el-icon-top" size="mini" @click="handleFile" >导入</el-button>
            </el-row>
        </el-form>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="tableList"
            fit
        >
            <!-- <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column> -->
            <el-table-column prop="id" label="ID" align="" min-width="60"></el-table-column>
            <el-table-column prop="fileName" label="文件名" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="filePath" label="文件路径" min-width="400" show-overflow-tooltip></el-table-column>
            <el-table-column prop="taskStateTxt" label="任务状态" align="center" min-width="100" ></el-table-column>
            <el-table-column prop="dataCount" label="数据量" align="center" min-width="100" ></el-table-column>
            <el-table-column prop="runDuration" label="执行时长(ms)" align="center" min-width="110" ></el-table-column>
            <el-table-column prop="createBy" label="创建人" align="center" min-width="140" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" min-width="160" ></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-download" @click="handleUpdate(scope.row)" :disabled="!scope.row.filePath">文件下载</el-button>
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

        <!-- 模板上传 -->
        <el-dialog title="采集导入" :visible.sync="open6" width="520px" append-to-body @close="cancel6">
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
    list,
    excelImport
} from "@/api/biz/columnImport";
export default {
    name: "Index",
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
            // 站点和新媒体账号关联表格数据
            tableList: [],
            queryParams:{
                pgNum: 1,
                pgSize: 10,
                fileName: null,
                createBy: null,
                id: null,
            },
            DateArr: [],


            // 导入
            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '站点关系导入',

        };
    },
    created() {
        this.getList();
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
        /** 查询站点和新媒体账号关联列表 */
        getList() {
            list(this.queryParams).then(response => {
                this.tableList = response.rows;
                this.total = response.total;
                for(var i in this.tableList){
                    this.tableList[i].index = parseInt(i)+1;
                    // 任务状态
                    if(this.tableList[i].taskState == 0){
                        this.tableList[i].taskStateTxt = '未导入';
                    }else if(this.tableList[i].taskState == 1){
                        this.tableList[i].taskStateTxt = '导入中';
                    }else if(this.tableList[i].taskState == 2){
                        this.tableList[i].taskStateTxt = '导入完成';
                    }else if(this.tableList[i].taskState == 3){
                        this.tableList[i].taskStateTxt = '异常';
                    }
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            if(this.queryParams.id){
                this.queryParams.id = parseInt(this.queryParams.id)
            }
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
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
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
                });
                excelImport(formData).then((res)=>{
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
            let fileName = '采集导入模板'; 
            this.download2(
                "common/download/downloadExcelTpl?type=300",'',
                `${fileName}.xlsx`
            ).then((res)=>{});
        },
        // 

        // 文件下载
        handleUpdate(row){
            if(row.filePath){
                window.open(row.filePath);
            }
        },

        // 任务详情
        goInfo(){
            this.$router.push({ path: '/basic/taskInfo' })
        },
        

    }
};
</script>
<style scoped lang="scss">
    .dz{
        color: #1890ff;
    }
    .dz:hover {
        cursor: pointer;
        // color: #1890ff;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>

</style>
