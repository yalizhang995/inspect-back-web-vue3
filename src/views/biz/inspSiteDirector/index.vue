<template>
    <div class="app-container">
        <div class="div">
            <div class="divBox" :style="{width: widthClass, paddingRight: paddingClass}">
                <div class="divLeft" v-if="jtShowS" :style="{height: treeHeight}" >
                    <div class="treeSearch">
                        <el-input placeholder="组织单位标识码/网站名称" v-model="filterText" size="mini" class="input-with-select" style="marginBottom: 10px">
                            <el-button slot="append" icon="el-icon-search" @click="siteCodeSearch"></el-button>
                        </el-input>
                    </div>
                    <div class="treeDiv">
                        <el-tree
                            ref="tree" 
                            node-key="id"
                            :props="inspSiteTreeList"
                            :load="loadNode"
                            lazy
                            :expand-on-click-node="false"
                            @node-click="handleNodeClick"
                            v-if="inspSiteTreeList.length"
                            :highlight-current="highlightBd"
                        >
                            <el-tooltip :disabled="showTitle" effect="dark" :content="tooltipTitle" placement="right" slot-scope="{ node, data }">
                                <span class="span-ellipsis" @mouseover="onShowNameTipsMouseenter" >{{ node.label }}</span>
                            </el-tooltip>
                        </el-tree>
                    </div>
                </div>
                <div class="jt"><span class="spspspsp"><i :class='jtIco' @click="jtChange" ></i></span></div>
            </div>
            <div class="divRight" :style="{width: widthClassR}">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    v-show="showSearch"
                    label-width="100px"
                >
                <el-form-item label="网站标识码" prop="siteCode">
                    <el-input v-model="queryParams.siteCode" placeholder="请输入网站标识码" clearable @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="用户类型" prop="userType">
                        <el-select v-model="queryParams.userType" clearable placeholder="请选择用户类型">
                            <el-option
                                v-for="item in userTypeDate"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否为管理员" prop="manageState">
                        <el-select v-model="queryParams.manageState" clearable placeholder="请选择是否为管理员">
                            <el-option
                                v-for="item in manageStateList"
                                :key="item.val"
                                :label="item.label"
                                :value="item.val"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="人员名称" prop="userName">
                        <el-input
                            v-model="queryParams.userName"
                            placeholder="请输入人员名称"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="手机号" prop="cellPhone">
                        <el-input
                            v-model="queryParams.cellPhone"
                            placeholder="请输入手机号"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="emailInfo">
                        <el-input
                            v-model="queryParams.emailInfo"
                            placeholder="请输入邮箱地址"
                            clearable
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                    <el-form-item label="办公电话座机" prop="officePhone">
                        <el-input
                            v-model="queryParams.officePhone"
                            placeholder="请输入办公电话座机"
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
                            v-hasPermi="['biz:inspSiteDirector:add']"
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
                            v-hasPermi="['biz:inspSiteDirector:remove']"
                        >删除</el-button>
                    </el-col>
                    <el-col :span="1.5" style="float:right">
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
                height="58vh"
                    v-loading="loading"
                    :data="inspSiteDirectorList"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column width="100" label="网站标识码" align="center" prop="siteCode" />
                    <el-table-column label="用户类型" align="center" prop="userTypeTxt" />
                    <el-table-column width="120" label="是否为管理员" align="center" prop="manageStateTxt" />
                    <el-table-column label="人员名称" align="center" prop="userName" />
                    <el-table-column label="手机号" align="center" prop="cellPhone" />
                    <el-table-column label="邮箱地址" align="center" prop="emailInfo" />
                    <el-table-column label="办公电话座机" align="center" prop="officePhone" />
                    <el-table-column width="80" label="顺序" align="center" prop="orderNum" />
                    <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
                    <el-table-column label="操作" align="center" min-width="120" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleUpdate(scope.row)"
                                v-hasPermi="['biz:inspSiteDirector:edit']"
                            >修改</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row)"
                                v-hasPermi="['biz:inspSiteDirector:remove']"
                            >删除</el-button>
                            <el-button
                                size="mini"
                                type="text"
                                icon="el-icon-setting"
                                @click="handleResetPwd(scope.row)"
                                v-hasPermi="['biz:inspSiteDirector:remove']"
                            >重置密码</el-button>
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

                <!-- 添加或修改站点联系人对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                        <!-- <el-form-item label="网站标识码" prop="siteCode" style="width:90%">
                            <el-input v-model="form.siteCode" placeholder="请输入网站标识码" />
                        </el-form-item> -->
                        <el-form-item label="用户类型" prop="userType" style="width:90%">
                            <el-select v-model="form.userType" clearable placeholder="请选择用户类型" style="width:100%">
                                <el-option
                                    v-for="item in userTypeDate"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否管理员" prop="manageState" style="width:90%">
                            <el-select v-model="form.manageState" clearable placeholder="请选择是否为管理员" style="width:100%">
                                <el-option
                                    v-for="item in manageStateList"
                                    :key="item.val"
                                    :label="item.label"
                                    :value="item.val"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人员名称" prop="userName" style="width:90%">
                            <el-input v-model="form.userName" placeholder="请输入人员名称" clearable />
                        </el-form-item>
                       
                        <el-form-item label="手机号" prop="cellPhone" style="width:90%">
                            <el-input v-model="form.cellPhone" placeholder="请输入手机号" clearable />
                        </el-form-item>
                        <!-- <el-form-item label="密码" prop="pwd" style="width:90%">
                            <el-input v-model="form.pwd" placeholder="请输入密码" clearable @clear='form.pwd = null' />
                        </el-form-item> -->
                        <el-form-item label="邮箱地址" prop="" style="width:90%">
                            <el-input v-model="form.emailInfo" placeholder="请输入邮箱地址" clearable />
                        </el-form-item>
                        <el-form-item label="办公电话座机" prop="" style="width:90%">
                            <el-input v-model="form.officePhone" placeholder="请输入办公电话座机" clearable />
                        </el-form-item>
                        <el-form-item label="顺序" prop="orderNum" style="width:90%">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="1" :max="10" style="width:100%"></el-input-number>
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
                <!-- 添加或修改自定义管理词对话框 -->
                <el-dialog title="重置密码" :visible.sync="open2" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
                    <el-form ref="form2" :model="form2" :rules="rules2" label-width="120px">
                            <el-form-item label="密码" prop="pwd" style="width:90%" >
                                <el-input v-model="form2.pwd" placeholder="请输入密码" clearable @clear='form2.pwd = null' />
                            </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="cancel2">取 消</el-button>
                        <el-button type="primary" @click="submitForm2">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {
    listInspSiteDirector,
    getInspSiteDirector,
    delInspSiteDirector,
    addInspSiteDirector,
    updateInspSiteDirector,
    resetPwd
} from "@/api/biz/inspSiteDirector";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";
//引入公共正则
import global_ from '@/utils/Global';
export default {
    name: "InspSiteDirector",
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
            // 站点联系人表格数据
            inspSiteDirectorList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                userType: null,
                userName: null,
                officePhone: null,
                cellPhone: null,
                emailInfo: null,
                orderNum: null,
                manageState: null,
                siteCodeOrState: 1,
                ancestorsFind: null
            },
            manageStateList: [
                { label: '是', val: true },
                { label: '否', val: false },
            ],
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                // siteCode: [{ required: true, message: '请输入网站标识码', trigger: 'blur' }],
                userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
                manageState: [{ required: true, message: '请选择是为否管理员', trigger: 'change' }],
                userName: [{ required: true, message: '请输入人员名称', trigger: 'blur' }],
                officePhone: [{ required: true, pattern: global_.isMob, message: global_.isMob_msg, trigger: 'blur' },],
                cellPhone: [{ required: true, pattern: global_.isPhone, message: global_.isPhone_msg, trigger: 'blur' },],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                // officePhone: [{ required: true, message: '请输入办公电话座机', trigger: 'blur' }],
                // cellPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                emailInfo: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                orderNum: [{ required: true, message: '请输入顺序', trigger: 'blur' }],
            },
            userTypeDate: [
                { label: '负责人', value: 1 },
                { label: '联系人', value: 2 },
            ],
            // 重置密码
            // 是否显示弹出层
            open2: false,
            // 表单参数
            form2: {},
            // 表单校验
            rules2: {
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                
            },
            // 左侧组织树
            jtShowS: true,
            jtIco: 'el-icon-d-arrow-left',
            treeHeight: document.documentElement.clientHeight - 220 + 'px',
            widthClass: '15%',
            paddingClass: '10px',
            widthClassR: '84%',
            filterText: '',
            inspSiteTreeList: [],
            highlightBd: true,
            showTitle: true,
            tooltipTitle: ''
        };
    },
    created() {
        if(sessionStorage.getItem('siteCode')){
            this.queryParams.siteCode = sessionStorage.getItem('siteCode');
            this.getList();
        }else{
            this.getList();
        }
        this.getInspSiteTree();
    },
    beforeDestroy() {
        // 清理缓存的代码
        sessionStorage.removeItem('siteCode');
    },
    watch: {
  $route: {
    handler() {
      if(sessionStorage.getItem('siteCode')){
        this.queryParams.siteCode = sessionStorage.getItem('siteCode');
        this.getList();
      }
    },
    immediate: true
  }
},
    methods: {
        /** 加载组织树 */
        getInspSiteTree() {
            let date = { parentSite: 0 };
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = response.data;
                for (var i in this.inspSiteTreeList) {
                    this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName + '-' + this.inspSiteTreeList[i].siteCode;
                }
            });
        },
        /** 节点点击事件 */
        handleNodeClick(data) {
            if (data.siteCode) {
            this.queryParams.pgNum = 1;
            this.queryParams.ancestorsFind = data.ancestors+data.siteCode+','; 
                // sessionStorage.setItem('siteCode', data.siteCode);
                this.getList();
            }
        },
        /** 搜索组织树 */
        siteCodeSearch() {
            let date = {};
            if (this.filterText == '' || this.filterText == null) {
                date = { parentSite: 0 };
            } else {
                date = { likeSiteOrName: this.filterText, siteType: 1 };
            }
            listInspSiteTree(date).then(response => {
                this.inspSiteTreeList = [];
                setTimeout(() => {
                    this.inspSiteTreeList = response.data;
                    for (var i in this.inspSiteTreeList) {
                        this.inspSiteTreeList[i].label = this.inspSiteTreeList[i].unitName + '-' + this.inspSiteTreeList[i].siteCode;
                    }
                }, 500);
            });
        },
        /** 显示名称提示 */
        onShowNameTipsMouseenter(event) {
            var target = event.target;
            let textLength = target.clientWidth;
            let containerLength = target.scrollWidth;
            if (textLength < containerLength) {
                this.tooltipTitle = event.target.innerText;
                this.showTitle = false;
            } else {
                this.showTitle = true;
            }
        },
        /** 切换组织树显示 */
        jtChange() {
            this.jtShowS = !this.jtShowS;
            if (this.jtShowS) {
                this.jtIco = 'el-icon-d-arrow-left';
                this.widthClass = '15%';
                this.paddingClass = '10px';
                this.widthClassR = '84%';
            } else {
                this.jtIco = 'el-icon-d-arrow-right';
                this.widthClass = '1%';
                this.paddingClass = '0';
                this.widthClassR = '100%';
            }
        },
        /** 加载节点 */
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.inspSiteTreeList);
            }
            setTimeout(() => {
                let date = { parentSite: node.data.siteCode, siteType: 1 };
                listInspSiteTree(date).then(response => {
                    let data = response.data;
                    for (var i in data) {
                        data[i].label = data[i].unitName + '-' + data[i].siteCode;
                    }
                    resolve(data);
                });
            }, 1000);
        },
        /** 查询站点联系人列表 */
        getList() {
            this.loading = true;
            listInspSiteDirector(this.queryParams).then(response => {
                this.inspSiteDirectorList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteDirectorList){
                    if(this.inspSiteDirectorList[i].userType == 1){
                        this.inspSiteDirectorList[i].userTypeTxt = '负责人'
                    }else if(this.inspSiteDirectorList[i].userType == 2){
                        this.inspSiteDirectorList[i].userTypeTxt = '联系人'                        
                    }
                    if(!this.inspSiteDirectorList[i].officePhone){
                        this.inspSiteDirectorList[i].officePhone = '--';
                    }
                    if(!this.inspSiteDirectorList[i].emailInfo){
                        this.inspSiteDirectorList[i].emailInfo = '--';
                    }
                    // 是否管理员
                    if(this.inspSiteDirectorList[i].manageState != null){
                        if(this.inspSiteDirectorList[i].manageState == true){
                            this.inspSiteDirectorList[i].manageStateTxt = '是'
                        }else if(this.inspSiteDirectorList[i].manageState == false){
                            this.inspSiteDirectorList[i].manageStateTxt = '否'                        
                        }
                    }else{
                        this.inspSiteDirectorList[i].manageStateTxt = '--';
                    }
                    
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
                siteCode: null,
                userType: null,
                userName: null,
                officePhone: null,
                cellPhone: null,
                emailInfo: null,
                orderNum: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                manageState: null,
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
            this.$set(this.queryParams, 'siteCode', null);
            this.$set(this.queryParams, 'ancestorsFind', null); // 左侧树条件
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
            this.title = "添加站点联系人";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspSiteDirector({id:id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改站点联系人";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateInspSiteDirector(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        this.form.siteCode = sessionStorage.getItem('siteCode');
                        console.log(this.form,'123')
                        addInspSiteDirector(this.form).then(response => {
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
                .confirm('是否确认删除站点联系人编号为"' + ids + '"的数据项？')
                .then(function() {
                    return delInspSiteDirector({ids:[ids]});
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "biz/inspSiteDirector/export",
                {
                    ...this.queryParams
                },
                `inspSiteDirector_${new Date().getTime()}.xlsx`
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
                this.$router.replace({ path: '/basic/inspSiteInfo'});
                // this.$router.go(-1);    
            })
        },

        // 重置密码
        handleResetPwd(item){
            this.open2 = true;
            this.form2.id = item.id;
        },
        /**事件相关 */
        // 取消按钮
        cancel2() {
            this.open2 = false;
            this.reset2();
        },
        // 表单重置
        reset2() {
            this.form2 = {
                id: null,
                pwd: null,
            };
            this.resetForm("form2");
        },
        submitForm2() {
            this.$refs["form2"].validate(valid => {
                if (valid) {
                    console.log(this.form2,'this.form2')
                    resetPwd(this.form2).then(response => {
                        this.$modal.msgSuccess("重置成功");
                        this.reset2();
                        this.open2 = false;
                    });
                }
            });
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
        .div{
        display: flex;
        .divBox{
            position: relative;
        }
        .divLeft{
            width: 100%;
            // height: 100%;
            overflow: hidden;
            border-right: 1px solid #f0f0f0;
            // margin-right: 20px;
            padding-right: 10px;
            position: relative;
            display: flex;
            flex-direction: column;
            .treeDiv{
                flex: 1;
                overflow: auto;
            }
            .jt{
                position: absolute;
                right: 0;
                top: 50%;
                z-index: 10000;
            }
            .jt:hover{
                cursor: pointer;
            }
        }
        .divRight{
            // flex: 1;
            width: 84%;
        }
        .jt{
            display: inline-block;;
            position: absolute;
            top: 50%;
            right: 5px;
            .spspspsp{
                background: #ffffff;
                padding: 10px 0;
            }
        }
        .jt:hover{
            cursor: pointer;
        }
    }
    .treeSearch {
        padding: 10px;
    }
    .treeDiv {
        padding: 0 10px 10px 10px;
    }
    // 树 文本省略号
    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 20px;
        font-size: 14px;
    }
</style>
