<template>
    <div class="app-container">
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteDirectorList"
            fit
        >   
            <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column label="问题类型"  prop="type" min-width="140"/>
            <el-table-column label="问题描述"  prop="description" min-width="300" />
            <el-table-column label="发现时间"  prop="createTime" min-width="160" />
            <el-table-column label="平台"  prop="siteType" min-width="100" />
            <el-table-column label="网站名称"  prop="reportingUnitName" min-width="220">
                <template slot-scope="scope">
                    <span v-if="scope.row.customerType == 1">{{scope.row.siteName}}</span>
                    <span v-else>{{scope.row.reportingUnitName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="网站标识码"  prop="siteCode" min-width="160" />
        </el-table>
    </div>
</template>

<script>
import {
    getWarnPageDetail,
} from "@/api/warn/index";
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
            /**枚举数据 */
            // 产品类型
            productTypeList: [
                { value: 1, label: '网站监测' },
                { value: 2, label: '新媒体监测' },
            ],
            // 消息类型
            messageTypeList: [
                { value: 1, label: '产品预警' },
                { value: 2, label: '系统报告' },
            ],
            // 业务类型
            businessTypeList: [
                { value: 1, label: '首页确定不连通' },
                { value: 2, label: '首页恢复连通' },
                { value: 3, label: '首页疑似不连通' },
                { value: 4, label: '首页未更新' },
                { value: 5, label: '错误内容' },
                { value: 6, label: '错敏信息' },
                { value: 7, label: '隐私泄露' },
                { value: 8, label: '异常外链' },
                { value: 9, label: '新媒体未更新' },
                { value: 10, label: '日报' },
                
            ],
            // 发送类型
            sendTypeList: [
                { value: 1, label: '短信' },
                { value: 2, label: '微信公众号' },
                { value: 3, label: '邮箱' },
            ],
        };
    },
    created() {
        let id = sessionStorage.getItem('homePageUpdateId');
        this.getList(id);
    },
    beforeDestroy() {
        // 清理缓存的代码
        sessionStorage.removeItem('homePageUpdateId');
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
        /** 查询站点联系人列表 */
        getList(id) {
            this.loading = true;
            getWarnPageDetail({searchId: id}).then(response => {
                this.inspSiteDirectorList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteDirectorList){
                    this.inspSiteDirectorList[i].index = parseInt(i)+1;
                    
                    
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
    .activeClass{
        cursor: pointer;
    }
    .dz{
        color: #1890ff;
        cursor: pointer;
    }
</style>
