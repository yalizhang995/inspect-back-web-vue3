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
            <el-form-item label="栏目名称" prop="channelTypeName" style="marginLeft:-20px">
                <el-input
                    v-model="queryParams.channelTypeName"
                    placeholder="请输入栏目名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="逾期天数" prop="warnDay">
                <el-input
                    v-model="queryParams.warnDay"
                    placeholder="请输入逾期天数"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item style="marginLeft:22px">
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
                    v-hasPermi="['biz:inspChannelType:add']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="info"
                    plain
                    icon="el-icon-sort"
                    size="mini"
                    @click="toggleExpandAll"
                >展开/折叠</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="inspChannelTypeList"
            row-key="id"
            :default-expand-all="isExpandAll"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <el-table-column label="栏目名称" align="" prop="channelTypeName" />
            <el-table-column label="逾期规则" align="center" prop="warnRule" />
            <el-table-column label="逾期天数" align="center" prop="warnDay" />
            <el-table-column label="显示顺序" align="center" prop="orderNum" />
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspChannelType:edit']"
                    >修改</el-button>
                    <!-- <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAdd(scope.row)"
                        v-hasPermi="['biz:inspChannelType:add']"
                    >新增</el-button> -->
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspChannelType:remove']"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改栏目分类对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <el-form-item label="父级栏目" prop="pid" style="width:90%" v-if="form.pid !== 0">
                    <treeselect
                        v-model="form.pid"
                        :options="inspChannelTypeOptions"
                        :normalizer="normalizer"
                        placeholder="请选择父级栏目"
                    />
                </el-form-item>
                <el-form-item label="栏目名称" prop="channelTypeName" style="width:90%">
                    <el-input v-model="form.channelTypeName" placeholder="请输入栏目名称" clearable />
                </el-form-item>
                <el-form-item label="逾期规则" prop="warnRule" style="width:90%">
                    <el-input v-model="form.warnRule" placeholder="请输入逾期规则" clearable />
                </el-form-item>
                <el-form-item label="逾期天数" prop="warnDay" style="width:90%">
                    <!-- <el-input v-model="form.warnDay" placeholder="请输入逾期天数" /> -->
                    <el-input-number v-model="form.warnDay" controls-position="right" :min="0" :max="1000" style="width:88%"></el-input-number>
                    <span>（天）</span>
                </el-form-item>
                <el-form-item label="显示顺序" prop="orderNum" style="width:90%">
                    <!-- <el-input v-model="form.orderNum" placeholder="请输入显示顺序" /> -->
                    <el-input-number v-model="form.orderNum" controls-position="right" :min="1" :max="1000" style="width:100%"></el-input-number>
                </el-form-item>
                <el-form-item label="备注" prop="remark" style="width:90%">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" clearable />
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
    listInspChannelType,
    getInspChannelType,
    delInspChannelType,
    addInspChannelType,
    updateInspChannelType
} from "@/api/biz/inspChannelType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "InspChannelType",
    components: {
        Treeselect
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 栏目分类表格数据
            inspChannelTypeList: [],
            // 栏目分类树选项
            inspChannelTypeOptions: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部展开
            isExpandAll: false,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                pid: null,
                channelTypeName: null,
                warnRule: null,
                warnDay: null,
                orderNum: null
            },
            // 表单参数
            form: {
                pid: null
            },
            // 表单校验
            rules: {
                pid: [{ required: true, message: '请选择父级栏目分类ID', trigger: 'change' }],
                channelTypeName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
                warnRule: [{ required: true, message: '请输入逾期规则', trigger: 'blur' }],
                warnDay: [{ required: true, message: '请输入逾期天数', trigger: 'blur' }],
                orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询栏目分类列表 */
        getList() {
            this.loading = true;
            listInspChannelType(this.queryParams).then(response => {
                this.inspChannelTypeList = this.handleTree(
                    response.data,
                    "id",
                    "pid"
                );
                this.loading = false;
            });
        },
        /** 转换栏目分类数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.channelTypeName,
                children: node.children
            };
        },
        /** 查询栏目分类下拉树结构 */
        getTreeselect() {
            listInspChannelType().then(response => {
                this.inspChannelTypeOptions = [];
                const data = {
                    id: 0,
                    channelTypeName: "顶级节点",
                    children: []
                };
                data.children = this.handleTree(response.data, "id", "pid");
                this.inspChannelTypeOptions.push(data);
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
                pid: null,
                channelTypeName: null,
                warnRule: null,
                warnDay: 14,
                orderNum: null,
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
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.inspChannelTypeOptions = this.inspChannelTypeList;
            this.reset();
            // this.getTreeselect();
            if (row != null && row.id) {
                this.form.pid = row.id;
            } else {
                this.form.pid = null;
            }
            this.open = true;
            this.title = "添加栏目分类";
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.inspChannelTypeOptions = this.inspChannelTypeList;
            this.reset();
            // this.getTreeselect();
            if (row != null) {
                this.form.pid = row.pid;
            }
            getInspChannelType({id:row.id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改栏目分类";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspChannelType(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspChannelType(this.form).then(response => {
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
            this.$modal
                .confirm('是否确认删除栏目名称为"' + row.channelTypeName + '"的数据项？')
                .then(function() {
                    return delInspChannelType({ids:[row.id]});
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        }
    }
};
</script>
