<template>
    <div class="app-container">
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="80px"
        >
            <el-form-item label="指标名称" prop="normName">
                <el-input
                    v-model="queryParams.normName"
                    placeholder="请输入指标名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="指标级别" prop="level">
                <el-input
                    v-model="queryParams.level"
                    placeholder="请输入指标级别"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="分值" prop="scoreVal">
                <el-input
                    v-model="queryParams.scoreVal"
                    placeholder="请输入分值"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="显示顺序" prop="orderNum">
                <el-input
                    v-model="queryParams.orderNum"
                    placeholder="请输入显示顺序"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
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
                    v-hasPermi="['biz:inspNorm:add']"
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
            :data="inspNormList"
            row-key="id"
            :default-expand-all="isExpandAll"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
            <!-- <el-table-column label="父级指标" prop="pid" /> -->
            <el-table-column label="指标名称" prop="normName" width="350" />
            <el-table-column label="指标级别" align="center" prop="level" />
            <el-table-column label="分值类型" align="center" prop="scoreTypeTxt" />
            <el-table-column label="扣/加分值" align="center" prop="scoreVal" />
            <el-table-column label="总分值" align="center" prop="scoreTotal" />
            <el-table-column
                label="指标特有类型"
                align="center"
                prop="publicTypeTxt"
            />
            <el-table-column label="显示顺序" align="center" prop="orderNum" />
            <el-table-column label="平台类型" align="center" prop="appTypeTxt" />
            <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['biz:inspNorm:edit']"
                    >修改</el-button>
                    <el-button
                        v-if='scope.row.level != 3'
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAdd(scope.row)"
                        v-hasPermi="['biz:inspNorm:add']"
                    >新增</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['biz:inspNorm:remove']"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改指标对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <div class="box">
                    <el-form-item label="父级指标" prop="pid" style="width:48%" v-if="!parentIdS">
                        <treeselect
                            v-model="form.pid"
                            :options="inspNormOptions"
                            :normalizer="normalizer"
                            placeholder="请选择父级指标"
                            style="width: 90%"
                        />
                    </el-form-item>
                    <el-form-item label="平台类型" prop="appType" style="width:48%">
                        <el-select v-model="form.appType" clearable placeholder="请选择平台类型" style="width: 90%">
                            <el-option
                                v-for="item in appTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指标名称" prop="normName" style="width:48%">
                        <el-input v-model="form.normName" placeholder="请输入指标名称" style="width: 90%" />
                    </el-form-item>
                    <el-form-item label="指标级别" prop="level" style="width:48%">
                        <el-input v-model="form.level" placeholder="请输入指标级别" style="width: 90%" />
                    </el-form-item>
                    <el-form-item label="分值类型" prop="scoreType" style="width:48%">
                        <el-select v-model="form.scoreType" clearable placeholder="请选择分值类型" style="width: 90%">
                            <el-option
                                v-for="item in scoreTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="扣/加分值" prop="scoreVal" style="width:48%">
                        <!-- <el-input v-model="form.scoreVal" placeholder="请输入扣/加分值" style="width: 90%" /> -->
                        <el-input-number v-model="form.scoreVal" controls-position="right" :min="0" :max="100" style="width: 90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="总分值" prop="scoreTotal" style="width:48%">
                        <!-- <el-input v-model="form.scoreTotal" placeholder="请输入总分值" style="width: 90%" /> -->
                        <el-input-number v-model="form.scoreTotal" controls-position="right" :min="0" :max="100" style="width: 90%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="指标特有类型" prop="publicType" style="width:48%">
                        <el-select v-model="form.publicType" clearable placeholder="请选择指标特有类型" style="width: 90%">
                            <el-option
                                v-for="item in publicTypeList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否需要人工" prop="handFlag" style="width:48%" v-if="!parentIdS">
                        <el-select v-model="form.handFlag" clearable placeholder="请选择是否需要人工" style="width: 90%">
                            <el-option
                                v-for="item in handFlagList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示顺序" prop="orderNum" style="width:48%">
                        <!-- <el-input v-model="form.orderNum" placeholder="请输入显示顺序" style="width: 90%" /> -->
                        <el-input-number v-model="form.orderNum" controls-position="right" :min="1" :max="100000" style="width: 90%"></el-input-number>                        
                    </el-form-item>
                    <el-form-item label="评分细则" prop="scoreDetail" style="width:92%">
                        <el-input v-model="form.scoreDetail" type="textarea" :autosize="{ minRows: 8, maxRows: 100 }"   placeholder="请输入评分细则" />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" style="width:92%">
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
    listInspNorm,
    getInspNorm,
    delInspNorm,
    addInspNorm,
    updateInspNorm
} from "@/api/biz/inspNorm";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "InspNorm",
    components: {
        Treeselect
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 指标表格数据
            inspNormList: [],
            // 指标树选项
            inspNormOptions: [],
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
                appType: null,
                normName: null,
                level: null,
                scoreType: null,
                scoreVal: null,
                publicType: null,
                orderNum: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {

            },

            /**下拉菜单 */
            appTypeList: [ // 平台类型
                { label: '政府网站', val: 1 },
                // { label: '新媒体', val: 2 },
            ],
            scoreTypeList: [ // 分值类型
                { label: '扣分', val: 1 },
                { label: '加分', val: 2 },
                { label: '其他', val: 3 },
            ],
            publicTypeList: [ // 指标特有类型
                { label: '公共', val: 1 },
                { label: '非国务院部门门户', val: 2 },
                { label: '国务院部门门户', val: 3 },
            ],
            publicTypeList: [ // 指标特有类型
                { label: '公共', val: 1 },
                { label: '非国务院部门门户', val: 2 },
                { label: '国务院部门门户', val: 3 },
            ],
            handFlagList: [ // 是否需要人工
                { label: '是', val: 1 },
                { label: '否', val: 0 },
            ],

            parentIdS: false,





        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询指标列表 */
        getList() {
            this.loading = true;
            listInspNorm(this.queryParams).then(response => {
                if(response.data.length > 0){
                    this.inspNormList = this.handleTree(response.data, "id", "pid");
                    for(var i in this.inspNormList){
                        // 平台类型
                        if(this.inspNormList[i].appType == 1){
                            this.inspNormList[i].appTypeTxt = '政府网站';
                        }else if(this.inspNormList[i].appType == 2){
                            this.inspNormList[i].appTypeTxt = '新媒体';
                        }
                        // 分值类型
                        if(this.inspNormList[i].scoreType == 1){
                            this.inspNormList[i].scoreTypeTxt = '扣分';
                        }else if(this.inspNormList[i].scoreType == 2){
                            this.inspNormList[i].scoreTypeTxt = '加分';
                        }else if(this.inspNormList[i].scoreType == 3){
                            this.inspNormList[i].scoreTypeTxt = '其他';
                        }
                        // 指标特有类型
                        if(this.inspNormList[i].publicType == 1){
                            this.inspNormList[i].publicTypeTxt = '公共';
                        }else if(this.inspNormList[i].publicType == 2){
                            this.inspNormList[i].publicTypeTxt = '非国务院部门门户';
                        }else if(this.inspNormList[i].publicType == 3){
                            this.inspNormList[i].publicTypeTxt = '国务院部门门户';
                        }
                        if(this.inspNormList[i].children){
                            for(var j in this.inspNormList[i].children){
                               // 平台类型
                                if(this.inspNormList[i].children[j].appType == 1){
                                    this.inspNormList[i].children[j].appTypeTxt = '政府网站';
                                }else if(this.inspNormList[i].children[j].appType == 2){
                                    this.inspNormList[i].children[j].appTypeTxt = '新媒体';
                                }
                                // 分值类型
                                if(this.inspNormList[i].children[j].scoreType == 1){
                                    this.inspNormList[i].children[j].scoreTypeTxt = '扣分';
                                }else if(this.inspNormList[i].children[j].scoreType == 2){
                                    this.inspNormList[i].children[j].scoreTypeTxt = '加分';
                                }else if(this.inspNormList[i].children[j].scoreType == 3){
                                    this.inspNormList[i].children[j].scoreTypeTxt = '其他';
                                }
                                // 指标特有类型
                                if(this.inspNormList[i].children[j].publicType == 1){
                                    this.inspNormList[i].children[j].publicTypeTxt = '公共';
                                }else if(this.inspNormList[i].children[j].publicType == 2){
                                    this.inspNormList[i].children[j].publicTypeTxt = '非国务院部门门户';
                                }else if(this.inspNormList[i].children[j].publicType == 3){
                                    this.inspNormList[i].children[j].publicTypeTxt = '国务院部门门户';
                                } 
                                if(this.inspNormList[i].children[j].children){
                                    for(var z in this.inspNormList[i].children[j].children){
                                    // 平台类型
                                        if(this.inspNormList[i].children[j].children[z].appType == 1){
                                            this.inspNormList[i].children[j].children[z].appTypeTxt = '政府网站';
                                        }else if(this.inspNormList[i].children[j].children[z].appType == 2){
                                            this.inspNormList[i].children[j].children[z].appTypeTxt = '新媒体';
                                        }
                                        // 分值类型
                                        if(this.inspNormList[i].children[j].children[z].scoreType == 1){
                                            this.inspNormList[i].children[j].children[z].scoreTypeTxt = '扣分';
                                        }else if(this.inspNormList[i].children[j].children[z].scoreType == 2){
                                            this.inspNormList[i].children[j].children[z].scoreTypeTxt = '加分';
                                        }else if(this.inspNormList[i].children[j].children[z].scoreType == 3){
                                            this.inspNormList[i].children[j].children[z].scoreTypeTxt = '其他';
                                        }
                                        // 指标特有类型
                                        if(this.inspNormList[i].children[j].children[z].publicType == 1){
                                            this.inspNormList[i].children[j].children[z].publicTypeTxt = '公共';
                                        }else if(this.inspNormList[i].children[j].children[z].publicType == 2){
                                            this.inspNormList[i].children[j].children[z].publicTypeTxt = '非国务院部门门户';
                                        }else if(this.inspNormList[i].children[j].children[z].publicType == 3){
                                            this.inspNormList[i].children[j].children[z].publicTypeTxt = '国务院部门门户';
                                        } 
                                    }
                                }
                            }
                        }
                    }
                    console.log(this.inspNormList,'this.inspNormList')
                }
                this.loading = false;
            });
        },
        /** 转换指标数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.normName,
                children: node.children
            };
        },
        /** 查询指标下拉树结构 */
        getTreeselect() {
            listInspNorm(this.queryParams).then(response => {
                if(response.data.length > 0){
                    this.inspNormOptions = [];
                    // const data = { id: 0, normName: null, children: [] };
                    // data.children = this.handleTree(response.data, "id", "pid");
                    this.inspNormOptions = this.handleTree(response.data, "id", "pid");
                    // this.inspNormOptions.push(data);
                }
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
                appType: 1,
                normName: null,
                level: null,
                scoreType: null,
                scoreVal: null,
                scoreTotal: null,
                publicType: 1,
                handFlag: 1,
                orderNum: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
            };
            this.resetForm("form");
            this.parentIdS = false;
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
            this.reset();
            this.getTreeselect();
            if (row != null && row.id) {
                this.form.pid = row.id;
                this.form.level = row.level+1;
                if(row.scoreDetail){
                    console.log('ok')
                    // this.form.scoreDetail = row.scoreDetail;
                    this.$set(this.form, "scoreDetail", row.scoreDetail);
                }
                // this.form.scoreType = row.scoreType;
                this.$set(this.form, "scoreType", row.scoreType);
            } else {
                this.form.pid = null;
            }
            this.open = true;
            this.title = "添加指标";
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
            this.reset();
            this.getTreeselect();
            if (row != null) {
                this.form.pid = row.pid;
            }
            getInspNorm({id: row.id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改指标";
                // 根据parentId判断是否为第一级，第一级父级标识码不可修改
                if(this.form.level == 1){
                    this.parentIdS = true;
                }else{
                    this.parentIdS = false;
                }
                // 是否人工
                if(this.form.handFlag == true){
                    this.form.handFlag = 1;
                }else{
                    this.form.handFlag = 2;
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspNorm(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addInspNorm(this.form).then(response => {
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
                .confirm('是否确认删除指标编号为"' + row.id + '"的数据项？')
                .then(function() {
                    return delInspNorm({ids: [ids]});
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
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
</style>
