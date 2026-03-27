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
            <el-form-item label="登录地址" prop="ipaddr">
                <el-input v-model="queryParams.ipaddr" placeholder="请输入登录地址" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="登录状态" clearable style="width: 240px" >
                    <el-option
                        v-for="dict in dict.type.sys_common_status"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="登录时间">
                <el-date-picker
                    v-model="dateRange"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="登录手机号" prop="loginPhone">
                <el-input v-model="queryParams.loginPhone" placeholder="请输入登录手机号" clearable style="width: 240px;" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="登录系统" prop="appName">
                <el-select v-model="queryParams.appName" placeholder="登录系统" clearable style="width: 240px" >
                    <el-option
                        v-for="dict in appNameList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="登录类型" prop="loginType">
                <el-select v-model="queryParams.loginType" placeholder="登录类型" clearable style="width: 240px" >
                    <el-option
                        v-for="dict in loginTypeList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="登录触发事件" prop="loginEvent">
                <el-select v-model="queryParams.loginEvent" placeholder="登录触发事件" clearable style="width: 240px" >
                    <el-option
                        v-for="dict in loginEventList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item style="marginLeft:18px">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['monitor:logininfor:remove']" >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean" v-hasPermi="['monitor:logininfor:remove']" >清空</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-unlock" size="mini" :disabled="single" @click="handleUnlock" v-hasPermi="['monitor:logininfor:unlock']" >解锁</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['monitor:logininfor:export']" >导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            ref="tables"
            v-loading="loading"
            :data="list"
            @selection-change="handleSelectionChange"
            :default-sort="defaultSort"
            @sort-change="handleSortChange"
            fit
        >
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="访问编号" align="center" prop="infoId" /> -->

            <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true"  sortable="custom" :sort-orders="['descending', 'ascending']" />
            <el-table-column label="登录手机号" min-width="120" prop="loginPhone" :show-overflow-tooltip="true" />
            <el-table-column label="手机号姓名" min-width="140" prop="loginPhoneUser" :show-overflow-tooltip="true" />
            <el-table-column label="登录系统" align="" min-width="120" prop="appNameTxt" :show-overflow-tooltip="true" />
            <el-table-column label="登录类型" align="" min-width="180" prop="loginTypeTxt" :show-overflow-tooltip="true" />
            <el-table-column label="登录触发事件" align="" min-width="120" prop="loginEventTxt" :show-overflow-tooltip="true" />
            <el-table-column label="登录地址" align="" prop="ipaddr"  min-width="130" :show-overflow-tooltip="true"  />
            <el-table-column label="登录地点" align="" prop="loginLocation" :show-overflow-tooltip="true" />
            <el-table-column label="浏览器" align="" prop="browser" min-width="100" :show-overflow-tooltip="true" />
            <el-table-column label="操作系统" align="" prop="os" min-width="100" />
            <el-table-column label="登录状态" align="center" prop="status">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="操作信息" align="" prop="msg" :show-overflow-tooltip="true" />
            <el-table-column label="登录日期" align="center" prop="loginTime" sortable="custom" :sort-orders="['descending', 'ascending']"  width="180"  >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.loginTime) }}</span>
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
    </div>
</template>

<script>
import {
    list,
    delLogininfor,
    cleanLogininfor,
    unlockLogininfor
} from "@/api/monitor/logininfor";

export default {
    name: "Logininfor",
    dicts: ["sys_common_status"],
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
            // 选择用户名
            selectName: "",
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            // 日期范围
            dateRange: [],
            // 默认排序
            defaultSort: { prop: "loginTime", order: "descending" },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                ipaddr: undefined,
                userName: undefined,
                status: undefined,
                loginPhone: undefined,
                appName: undefined,
                loginType: undefined,
                loginEvent: undefined
            },
            appNameList: [
                { label: '普查云监管', value: 'inspect-view' },
                { label: '业务后台', value: 'inspect-back' },
            ],
            loginEventList: [
                { label: '登录', value: 1 },
                { label: '切换单位登录', value: 2 },
            ],
            loginTypeList: [
                { label: '前台站点标识码登录', value: 1 },
                { label: '前台手机号登录', value: 2 },
                { label: '前台手机号绑定多个站点登录', value: 3 },
                { label: '后台跳转前台', value: 10 },
            ],
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询登录日志列表 */
        getList() {
            this.loading = true;
            list(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.list = response.rows;
                    this.total = response.total;
                    this.loading = false;
                    for (var i in this.list) {
                        // 登录手机号
                        if (!this.list[i].loginPhone) {
                            this.list[i].loginPhone = '--';
                        }
                        // 手机号姓名
                        if (!this.list[i].loginPhoneUser) {
                            this.list[i].loginPhoneUser = '--';
                        }
                        // 登录系统
                        if (this.list[i].appName == 'inspect-view') {
                            this.list[i].appNameTxt = "普查云监管";
                        } else if (this.list[i].appName == 'inspect-back') {
                            this.list[i].appNameTxt = "业务后台";
                        } else {
                            this.list[i].appNameTxt = "--";
                        }
                        // 登录类型
                        if (this.list[i].loginType == 1) {
                            this.list[i].loginTypeTxt = "前台站点标识码登录";
                        } else if (this.list[i].loginType == 2) {
                            this.list[i].loginTypeTxt = "前台手机号登录";
                        } else if (this.list[i].loginType == 3) {
                            this.list[i].loginTypeTxt = "前台手机号绑定多个站点登录";
                        } else if (this.list[i].loginType == 10) {
                            this.list[i].loginTypeTxt = "后台跳转前台";
                        } else {
                            this.list[i].loginTypeTxt = "--";
                        }
                        // 登录触发事件
                        if (this.list[i].loginEvent == 1) {
                            this.list[i].loginEventTxt = "登录";
                        } else if (this.list[i].loginEvent == 2) {
                            this.list[i].loginEventTxt = "切换单位登录";
                        } else {
                            this.list[i].loginEventTxt = "--";
                        }
                        
                        
                    }
                }
            );
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.queryParams.pageNum = 1;
            this.$refs.tables.sort(
                this.defaultSort.prop,
                this.defaultSort.order
            );
        },
        /** 多选框选中数据 */
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.infoId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
            this.selectName = selection.map(item => item.userName);
        },
        /** 排序触发事件 */
        handleSortChange(column, prop, order) {
            this.queryParams.orderByColumn = column.prop;
            this.queryParams.isAsc = column.order;
            this.getList();
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const infoIds = row.infoId || this.ids;
            this.$modal
                .confirm('是否确认删除访问编号为"' + infoIds + '"的数据项？')
                .then(function() {
                    return delLogininfor(infoIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 清空按钮操作 */
        handleClean() {
            this.$modal
                .confirm("是否确认清空所有登录日志数据项？")
                .then(function() {
                    return cleanLogininfor();
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("清空成功");
                })
                .catch(() => {});
        },
        /** 解锁按钮操作 */
        handleUnlock() {
            const username = this.selectName;
            this.$modal
                .confirm('是否确认解锁用户"' + username + '"数据项?')
                .then(function() {
                    return unlockLogininfor(username);
                })
                .then(() => {
                    this.$modal.msgSuccess("用户" + username + "解锁成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "monitor/logininfor/export",
                {
                    ...this.queryParams
                },
                `logininfor_${new Date().getTime()}.xlsx`
            );
        }
    }
};
</script>

