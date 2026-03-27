<template>
    <div class="app-container" id="OnClick" style="height:100%">
        <!-- 添加或修改任务信息对话框 -->
        <el-dialog
            title="依据详情"
            :visible.sync="open"
            width="80%"
            class="dialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="cancel"
        >
            <div class="box">
                <el-table
                    v-loading="loading"
                    :data="tableList"
                    row-key="idStr"
                    height="500"
                >
                    <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                    <el-table-column prop="idStr" label="数据ID" width="220" align=""></el-table-column>
                    <el-table-column prop="triggerWord" label="错敏词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.triggerWord}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="suggest" label="推荐词" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.suggest}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sentence" label="所在上下文" width="300">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.sentence">
                                    <span>{{scope.row.wordLeft}}</span>
                                    <span style="color:red;borderBottom:1px solid red">{{scope.row.triggerWord}}</span>
                                    <span>{{scope.row.wordRight}}</span>
                                </span>
                                <span v-if="!scope.row.sentence">--</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="typesTxt" label="来源" width="120"></el-table-column>
                    <el-table-column prop="showStateTxt" label="审核状态" width="100"></el-table-column>
                    <el-table-column prop="importdataTaskId" label="回导任务ID" width="100"></el-table-column>
                    <el-table-column prop="ignoreID" label="人工审核数据ID" width="220"></el-table-column>
                    <el-table-column prop="ignoreSourceTypeTxt" label="来源页面" width="140"></el-table-column>
                    <el-table-column prop="auditTypeTxt" label="审核类型" width="100"></el-table-column>
                    <el-table-column prop="createBy" label="审核人" width="100"></el-table-column>
                    <el-table-column prop="auditTime" label="审核时间" width="180"></el-table-column>
                    <el-table-column prop="modifyTime" label="修改时间" width="180"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    editCustomRules
} from "@/api/biz/column";
import {
    getRepairWordDetail
} from "@/api/biz/wrongWords";
import { siteInfoExist } from "@/api/biz/inspChannel";
import global_ from "@/utils/Global";

export default {
    name: "Column",
    props: {
        getOpen: Boolean,
        getIdStr: String,
    },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            idStr: null,
            tableList: [],
            loading: false,

        };
    },
    created() {
        console.log(this.getIdStr,'123123')
        this.open = this.getOpen;
        this.idStr = this.getIdStr;
        this.getList();
    },
    methods: {
        getList(){
            this.tableList = [];
            getRepairWordDetail({idStr: this.idStr}).then((res)=>{
                console.log(res.data,'数据')
                this.tableList = res.data.repairWordDetailList;
                if(res.data.repairWord){
                    this.tableList.unshift(res.data.repairWord);
                }
                console.log(this.tableList,'列表数据')
                for(var i in this.tableList){
                    // 序号
                    this.tableList[i].index = parseInt(i)+1;
                    // 来源
                    if(this.tableList[i].types <= 4){
                        this.tableList[i].typesTxt = "词库维护";
                    }else if(this.tableList[i].types == 100){
                        this.tableList[i].typesTxt = "人工审核来源";
                    }else if(this.tableList[i].types == 101){
                        this.tableList[i].typesTxt = "人工回导来源";
                    }
                    // 审核状态
                    if(this.tableList[i].showState == 1){
                        this.tableList[i].showStateTxt = "待审核";
                    }else if(this.tableList[i].showState == 2){
                        this.tableList[i].showStateTxt = "仅显示";
                    }else if(this.tableList[i].showState == 3){
                        this.tableList[i].showStateTxt = "显示并预警";
                    }else if(this.tableList[i].showState == 4){
                        this.tableList[i].showStateTxt = "误报";
                    }else if(this.tableList[i].showState == 99){
                        this.tableList[i].showStateTxt = "存疑";
                    }else if(this.tableList[i].showState == 5){
                        this.tableList[i].showStateTxt = "词库修复";
                    }
                    // 来源页面
                    if(this.tableList[i].ignoreSourceType == 0){
                        this.tableList[i].ignoreSourceTypeTxt = "全部";
                    }else if(this.tableList[i].ignoreSourceType == 1){
                        this.tableList[i].ignoreSourceTypeTxt = "网站错误内容";
                    }else if(this.tableList[i].ignoreSourceType == 2){
                        this.tableList[i].ignoreSourceTypeTxt = "网站敏感信息";
                    }else if(this.tableList[i].ignoreSourceType == 3){
                        this.tableList[i].ignoreSourceTypeTxt = "网站隐私泄露";
                    }else if(this.tableList[i].ignoreSourceType == 10){
                        this.tableList[i].ignoreSourceTypeTxt = "新媒体错误内容";
                    }else if(this.tableList[i].ignoreSourceType == 20){
                        this.tableList[i].ignoreSourceTypeTxt = "新媒体敏感信息";
                    }else if(this.tableList[i].ignoreSourceType == 30){
                        this.tableList[i].ignoreSourceTypeTxt = "新媒体隐私泄露";
                    }
                    // 审核类型
                    if(this.tableList[i].auditType == 0){
                        this.tableList[i].auditTypeTxt = "未审核";
                    }else if(this.tableList[i].auditType == 1){
                        this.tableList[i].auditTypeTxt = "人工审核";
                    }else if(this.tableList[i].auditType == 2){
                        this.tableList[i].auditTypeTxt = "AI审核";
                    }
                    if(this.tableList[i].sentence){
                        this.tableList[i].wordLeft = this.tableList[i].sentence.split(this.tableList[i].triggerWord)[0];
                        this.tableList[i].wordRight = this.tableList[i].sentence.split(this.tableList[i].triggerWord)[1];
                    }
                    
                }
            })
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.$emit("openS", false);
        },
    }
};
</script>
<style scoped>
    /deep/.el-dialog__wrapper{
        height: 100vh!important;
    }
</style>