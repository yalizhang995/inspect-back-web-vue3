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
            <el-form-item label="用户名称" prop="userName">
                <el-input
                    v-model="queryParams.userName"
                    placeholder="请输入用户名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
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
                    v-hasPermi="['biz:inspUserSite:add']"
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
                    v-hasPermi="['biz:inspUserSite:edit']"
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
                    v-hasPermi="['biz:inspUserSite:remove']"
                >删除</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['biz:inspUserSite:export']"
                >导出</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-loading="loading"
            :data="inspUserSiteList"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="用户名称" align="center" prop="userName" />
            <el-table-column label="网站标识码" align="center" prop="siteCode" />
            <el-table-column label="网站名称" align="center" prop="siteName" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspUserSite:edit']"
                    >修改</el-button> -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspUserSite:remove']"
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

        <!-- 添加或修改用户站点关联对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="用户" prop="userId" style="width:90%">
                    <!-- <el-input v-model="form.userId" placeholder="请输入用户ID" /> -->
                    <el-select v-model="form.userId" filterable clearable placeholder="请输入并选择用户" style="width:100%" remote :remote-method="remoteMethod" >
                        <el-option
                            v-for="item in userIdDate"
                            :key="item.userName"
                            :label="item.userName"
                            :value="item.userId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="网站标识码" prop="siteCode" style="width:90%">
                    <!-- <el-input v-model="form.siteCode" placeholder="请输入网站标识码" /> -->
                    <el-select v-model="form.siteCode" filterable clearable placeholder="请输入并选择网站标识码" style="width:100%" remote :remote-method="remoteMethod2" >
                        <el-option
                            v-for="item in siteCodeDate"
                            :key="item.siteCode"
                            :label="item.label"
                            :value="item.siteCode"
                        ></el-option>
                    </el-select>
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
    listInspUserSite,
    getInspUserSite,
    delInspUserSite,
    addInspUserSite,
    updateInspUserSite,
    queryList,
    siteQueryList
} from "@/api/biz/inspUserSite";

export default {
    name: "InspUserSite",
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
            // 用户站点关联表格数据
            inspUserSiteList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                userName: null,
                siteCode: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                userId: [{ required: true, message: "用户不能为空", trigger: "blur" }],
                siteCode: [{ required: true, message: "网站标识码不能为空", trigger: "blur" }]
            },

            userIdDate: [],
            siteCodeDate: [],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询用户站点关联列表 */
        getList() {
            this.loading = true;
            listInspUserSite(this.queryParams).then(response => {
                this.inspUserSiteList = response.rows;
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
                userId: null,
                siteCode: null
            };
            this.userIdDate = [];
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
            this.title = "添加用户站点关联";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspUserSite({id: id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改用户站点关联";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form,'表单提交数据')
                    if (this.form.id != null) {
                        updateInspUserSite(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspUserSite(this.form).then(response => {
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
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除人工录入问题编号为"' + ids + '"的数据项？')
                    .then(function() {
                        return delInspUserSite({ids:[ids]});
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
                        return delInspUserSite({ids:ids});
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
                "biz/inspUserSite/export",
                {
                    ...this.queryParams
                },
                `inspUserSite_${new Date().getTime()}.xlsx`
            );
        },

        // 用户模糊搜
        remoteMethod(query){
            if(query){
                setTimeout(()=>{
                    queryList({userNameOrNickNameLike: query,pgNum: 1, pgSize: 5}).then((res)=>{
                        this.userIdDate = res.data;
                    })
                },1000)
            } 
        },
        // 网站标识码
        remoteMethod2(query){
            if(query){
                setTimeout(()=>{
                    siteQueryList({likeSiteOrName: query,pgNum:1,pgSize:5}).then((res)=>{
                        this.siteCodeDate = res.data;
                        for(var i in this.siteCodeDate){
                            this.siteCodeDate[i].label = this.siteCodeDate[i].siteCode+'（'+this.siteCodeDate[i].siteName+'）'
                        }
                    })
                },1000)
            } 
        },
        // siteQueryList
        // queryList
    }
};
</script>
