<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="70px"
        >               
            <el-form-item label="触发词" prop="triggerWord">
                <el-input
                    v-model="queryParams.triggerWord"
                    placeholder="请输入触发词"
                    clearable
                    @clear='queryParams.triggerWord=null'
                    style="width: 280px"
                />
            </el-form-item>
            <el-form-item label="建议词" prop="suggest">
                <el-input
                    v-model="queryParams.suggest"
                    placeholder="请输入建议词"
                    clearable
                    @clear='queryParams.suggest=null'
                    style="width: 280px"
                />
            </el-form-item>
            <el-form-item label="数据ID" prop="idStr">
                <el-input
                    v-model="queryParams.idStr"
                    placeholder="请输入数据ID"
                    clearable
                    @clear='queryParams.idStr=null'
                    style="width: 280px"
                />
            </el-form-item>
            <el-form-item label="操作人" prop="createBy">
                <el-input
                    v-model="queryParams.createBy"
                    placeholder="请输入操作人"
                    clearable
                    style="width: 280px"
                />
            </el-form-item>
            
            <el-form-item style="marginLeft:8px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-top" size="mini" @click="handleFile" >导入</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteInfoList"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
            fit
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <!-- <el-table-column prop="index" label="序号" width="80" align="center" ></el-table-column> -->
            <el-table-column prop="idStr" label="数据ID" min-width="220" align="" ></el-table-column>
            <el-table-column prop="triggerWord" label="触发词" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="suggest" label="建议词" min-width="200" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="prefix" label="前缀" width="160" ></el-table-column>
            <el-table-column prop="suffix" label="后缀" width="160" ></el-table-column> -->
            <el-table-column prop="typesTxt" label="词库维护" min-width="140" ></el-table-column>
            <el-table-column prop="showStateTxt" label="显示状态" min-width="120" ></el-table-column>
            <!-- <el-table-column prop="enabledTxt" label="处理状态" width="160" ></el-table-column>
            <el-table-column prop="ip" label="IP" width="180" ></el-table-column> -->
            <el-table-column prop="createBy" label="创建人" align="" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" align="" min-width="180" />
            <el-table-column prop="modifyTime" label="修改时间" align="" min-width="180" />
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pgNum"
            :limit.sync="queryParams.pgSize"
            @pagination="getList"
        />

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

    </div>
</template>

<script>
import {
    getRepairWord
} from "@/api/biz/repairWord";
import { inspImportdataTask } from "@/api/biz/wrongWords";
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
            // 站点信息表格数据
            inspSiteInfoList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                triggerWord: null, // 触发词
                suggest: null, // 建议词
                prefix: null, // 前缀
                suffix: null, // 后缀
                types: null, // 词库维护
                showState: null, // 显示状态
                enabled: null, // 处理状态
                ip: null, // IP
                createTime: null, // 创建时间
                modifyTime: null, // 修改时间
                createBy: null, // 操作人

            },
            DateArr: [],
            // 词库维护
            typesList: [
                { label: '匹配前后缀修复', value: 1 },
                { label: '忽略前后缀修复', value: 2 },
            ],
            // 处理状态
            enabledList: [
                { label: '初始化', value: 0 },
                { label: '待处理', value: 1 },
                { label: '处理完成', value: 2 },
                { label: '已分发节点IP待处理', value: 9 },
                { label: '已分发节点IP处理中', value: 10 },
            ],
            showStateList: [
                { label: '待审核', value: 1 },
                { label: '显示', value: 2 },
                { label: '显示并预警', value: 3 },
                { label: '误报', value: 4 },
                { label: '存疑', value: 99 },
                { label: '词库修复', value: 5 },
            ],

            // 模板上传
            upurl: process.env.VUE_APP_BASE_API + "/biz/inspImportdataTask/batchImport", // 上传的图片服务器地址
            form6: {},
            open6: false,
            subFileList: [],
            fileList: [],

            fileType: null,
            title6: '词库回导',


            
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
        // 日期
        sjrqChange(val){
            console.log(val)
            if(val == null){
                this.DateArr = [];
                this.queryParams.startDate = null;
                this.queryParams.endDate = null;
            }
        },
        // 父级标识码
        selectParentSite(node){
            console.log(node,'nodenodenode')
        },
        /** 查询站点信息列表 */
        getList() {
            this.loading = true;
            getRepairWord(this.queryParams).then(response => {
                this.inspSiteInfoList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteInfoList){
                    this.inspSiteInfoList[i].index = parseInt(i)+1;
                    // 词库维护
                    if(this.inspSiteInfoList[i].types == 1){
                        this.inspSiteInfoList[i].typesTxt = "匹配前后缀修复";
                    }else if(this.inspSiteInfoList[i].types == 2){
                        this.inspSiteInfoList[i].typesTxt = "忽略前后缀修复";
                    }
                    // 处理状态
                    if(this.inspSiteInfoList[i].enabled == 0){
                        this.inspSiteInfoList[i].enabledTxt = "初始化";
                    }else if(this.inspSiteInfoList[i].enabled == 1){
                        this.inspSiteInfoList[i].enabledTxt = "待处理";
                    }else if(this.inspSiteInfoList[i].enabled == 2){
                        this.inspSiteInfoList[i].enabledTxt = "处理完成";
                    }else if(this.inspSiteInfoList[i].enabled == 9){
                        this.inspSiteInfoList[i].enabledTxt = "已分发节点IP待处理";
                    }else if(this.inspSiteInfoList[i].enabled == 10){
                        this.inspSiteInfoList[i].enabledTxt = "已分发节点IP处理中";
                    }
                    // 显示状态
                    if(this.inspSiteInfoList[i].showState == 1){
                        this.inspSiteInfoList[i].showStateTxt = "待审核";
                    }else if(this.inspSiteInfoList[i].showState == 2){
                        this.inspSiteInfoList[i].showStateTxt = "显示";
                    }else if(this.inspSiteInfoList[i].showState == 3){
                        this.inspSiteInfoList[i].showStateTxt = "显示并预警";
                    }else if(this.inspSiteInfoList[i].showState == 4){
                        this.inspSiteInfoList[i].showStateTxt = "误报";
                    }else if(this.inspSiteInfoList[i].showState == 99){
                        this.inspSiteInfoList[i].showStateTxt = "存疑";
                    }else if(this.inspSiteInfoList[i].showState == 5){
                        this.inspSiteInfoList[i].showStateTxt = "词库修复";
                    }
                    
                }
            });
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.idStr);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
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
            this.getList(); 
            // if(this.queryParams.urlHash != null){
            //     if(this.queryParams.siteCode != null && this.queryParams.siteCode != ''){
            //         this.getList();                    
            //     }else{
            //         this.$modal.msgWarning("网站标识码、URL同时输入才可查询");
            //     }
            // }else{
            //     if(this.queryParams.siteCode != null && this.queryParams.siteCode != ''){
            //         this.getList();                    
            //     }else{
            //         this.$modal.msgWarning("请至少输入网站标识码查询");
            //     }
            // }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.resetForm("queryForm");
            this.handleQuery();
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


         // 模板上传
        handleFile(type){
            console.log(this.upurl,'upurl')
            this.fileList = [];
            this.open6 = true;
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
                this.subFileList.forEach(f => {
                    console.log(f,'f')
                    formData.append("file", f.raw);
                    formData.append("taskType", 201);
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
            let fileName = '词库回导模板';  
            this.download2(
                "common/download/downloadExcelTpl?type=201",'',
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
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
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