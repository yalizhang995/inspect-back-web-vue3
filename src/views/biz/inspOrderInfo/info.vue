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
                    v-hasPermi="['biz:inspOrderSite:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['biz:inspChannel:remove']"
                >批量删除</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['biz:inspOrderSite:edit']"
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
                    v-hasPermi="['biz:inspOrderSite:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspOrderSite:export']"
                >导出</el-button>
            </el-col> -->
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            <el-col :span="1.5" style="float:right;display: inline-block;" >
                <el-button
                    type="primary"
                    plain
                    icon=""
                    size="mini"
                    @click="goBack"
                    v-hasPermi="['biz:inspSiteDirector:add']"
                >返回上级</el-button>
            </el-col>
        </el-row>
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspOrderSiteList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" align="center" prop="index" width="100" />
            <el-table-column label="订单名称" align="center" prop="orderName" />
            <el-table-column label="网站名称" align="center" prop="siteName" />
            <el-table-column label="网站标识码" align="center" prop="siteCode" />
            <el-table-column label="任务状态" align="center" prop="initStateTxt" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                <template slot-scope="scope">
                    <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspOrderSite:edit']"
                    >修改</el-button> -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspOrderSite:remove']"
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

        <!-- 添加或修改订单站点关联对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <!-- <el-form-item label="订单ID" prop="orderInfoId">
                    <el-input v-model="form.orderInfoId" placeholder="请输入订单ID" />
                </el-form-item>
                <el-form-item label="网站标识码" prop="siteCode">
                    <el-input v-model="form.siteCode" placeholder="请输入网站标识码" />
                </el-form-item> -->
                <el-form-item label="网站标识码" prop="siteCodes" style="width:96%">
                    <el-input v-model="form.siteCodes" type="textarea" :autosize="{ minRows: 5, maxRows: 100 }" placeholder="请输入网站标识码，多个换行" />
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
import {
    listInspOrderSite,
    getInspOrderSite,
    delInspOrderSite,
    addInspOrderSite,
    updateInspOrderSite,
    addBatch
} from "@/api/biz/inspOrderSite";

export default {
    name: "InspOrderSite",
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
            // 订单站点关联表格数据
            inspOrderSiteList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                orderInfoId: null,
                siteCode: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                siteCodes: [{ required: true, message: '请输入网站标识码', trigger: 'blur' }],
            }
        };
    },
    created() {
        if(sessionStorage.getItem('orderInfo')){
            this.queryParams.orderInfoId = sessionStorage.getItem('orderInfo')
            this.getList();
        }
        // this.getList();
    },
    methods: {
        /** 查询订单站点关联列表 */
        getList() {
            this.loading = true;
            listInspOrderSite(this.queryParams).then(response => {
                this.inspOrderSiteList = response.rows;
                for(var i in this.inspOrderSiteList){
                    this.inspOrderSiteList[i].index = parseInt(i)+1;
                    if(this.inspOrderSiteList[i].initState == 1){
                        this.inspOrderSiteList[i].initStateTxt = '未下发';
                    }else if(this.inspOrderSiteList[i].initState == 2){
                        this.inspOrderSiteList[i].initStateTxt = '已下发';                        
                    }
                }
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
                orderInfoId: this.queryParams.orderInfoId,
                siteCodes: [],
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
            this.title = "添加网站标识码";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspOrderSite(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改网站标识码";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单提交数据')
                    if(this.form.siteCodes != ''){
                        this.form.siteCodes = this.form.siteCodes.split('\n');
                        addBatch(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                    console.log(this.form,'表单提交数据2')
                    // if (this.form.id != null) {
                    //     updateInspOrderSite(this.form).then(response => {
                    //         this.$modal.msgSuccess("修改成功");
                    //         this.open = false;
                    //         this.getList();
                    //     });
                    // } else {
                        // addBatch(this.form).then(response => {
                        //     this.$modal.msgSuccess("新增成功");
                        //     this.open = false;
                        //     this.getList();
                        // });
                    // }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除订单名称为"' + row.orderName + '"的数据项？')
                    .then(function() {
                        return delInspOrderSite({ids:[ids]});
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
                        return delInspOrderSite({ids:ids});
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
                "biz/inspOrderSite/export",
                {
                    ...this.queryParams
                },
                `inspOrderSite_${new Date().getTime()}.xlsx`
            );
        },
        // 返回上级
        goBack(){
            // this.$router.go(-1);
            let veiwArr = this.$store.state.tagsView.visitedViews;
            let path = this.$route.path;
            let view;
            for(let i = 0,len=veiwArr.length;i<len;i++){
                if(veiwArr[i].path == path){
                    view = veiwArr[i];
                }	
            }
            this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
                const latestView = visitedViews.slice(-1)[0];
                // this.$router.replace({ path: '/clu/configure'});
                sessionStorage.removeItem('orderInfo')
                this.$router.go(-1);    
            })
        },
    }
};
</script>
<style lang="scss">
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>
    /deep/.el-dialog{
        margin-top: 15vh!important;
    }
</style>
