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
            <el-form-item label="策略ID" prop="strategyId">
                <el-input
                    v-model="queryParams.strategyId"
                    placeholder="请输入策略ID"
                    clearable
                    style="width:260px"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="产品类型" prop="productType">
                <el-select v-model="queryParams.productType" clearable placeholder="请选择产品类型" style="width:260px">
                    <el-option
                        v-for="item in productTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息类型" prop="messageType">
                <el-select v-model="queryParams.messageType" clearable placeholder="请选择消息类型" style="width:260px">
                    <el-option
                        v-for="item in messageTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务类型" prop="businessType">
                <el-select v-model="queryParams.businessType" clearable placeholder="请选择业务类型" style="width:260px">
                    <el-option
                        v-for="item in businessTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送状态" prop="sendStatus">
                <el-select v-model="queryParams.sendStatus" clearable placeholder="请选择发送状态" style="width:260px">
                    <el-option
                        v-for="item in sendStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送时间" prop="">
                <el-date-picker
                    v-model="DateArr2"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="sjrqChange2"
                    style="width:260px"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="创建时间" prop="">
                <el-date-picker
                    v-model="DateArr"
                    format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="sjrqChange"
                    style="width:260px"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
                :columns="columns"
            ></right-toolbar>
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
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </el-row>

        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspSiteDirectorList"
            @selection-change="handleSelectionChange"
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="产品类型"  prop="productTypeTxt" width="120" v-if="columns[0].visible"/>
            <el-table-column label="消息类型"  prop="messageTypeTxt" align="center" width="120" v-if="columns[1].visible"/>
            <el-table-column label="业务类型"  prop="businessTypeTxt" align="center" width="130" v-if="columns[2].visible"/>
            <el-table-column label="触发条件"  prop="businessTypeTxt" align="center" width="80" v-if="columns[3].visible">
                <template slot-scope="scope">
                    <i class="el-icon-document" style="cursor: pointer;" @click="goWarn(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column label="接收短信名称"  prop="receiveName" width="120" v-if="columns[4].visible"/>
            <el-table-column label="接收短信手机号"  prop="receivePhoneAddress" width="120" v-if="columns[5].visible"/>
            <el-table-column label="策略名称"  prop="strategyName" width="200" show-overflow-tooltip v-if="columns[6].visible"/>
            <!-- <el-table-column label="信息" align="center"  prop="receiveSiteName"> -->
                <el-table-column label="接收消息" align="center" v-if="columns[7].visible">
                    <el-table-column prop="receiveSiteName" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="receivePhone" label="手机号" width="120"></el-table-column>
                </el-table-column>
                <el-table-column label="产生问题" align="center" v-if="columns[8].visible">
                    <el-table-column prop="produceSiteName" label="网站名称" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.produceSite[0].siteName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="producePhone" label="网站标识码" width="160">
                        <template slot-scope="scope">
                            <span>{{scope.row.produceSite[0].siteCode}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="策略生效" align="center" v-if="columns[9].visible">
                    <el-table-column prop="effectiveSiteName" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="effectivePhone" label="手机号" width="120"></el-table-column> -->
                    <el-table-column prop="effectiveSiteCode" label="网站标识码" width="120"></el-table-column>
                </el-table-column>
            <!-- </el-table-column> -->
            <el-table-column label="发送内容"  prop="content" width="410" v-if="columns[10].visible">
                <template slot-scope="scope">
                    <div v-if="scope.row.businessTypeShow">
                        <span>{{ scope.row.content.split('查看详情：')[0] }}</span><br/>
                        查看详情：
                        <span class="dz" @click="infoPc(scope.row, scope.row.businessTypeShow)">{{ scope.row.content.split('查看详情：')[1] }}</span>
                        <el-tooltip class="item" effect="dark" content="复制" placement="top">
                            <i class="el-icon-connection" style="marginLeft:10px;cursor: pointer;" @click="copyBtn(scope.row.content)"></i>
                        </el-tooltip>
                    </div>
                    <div v-if="!scope.row.businessTypeShow">
                        <div v-if="!scope.row.businessTypeS">
                            <span>{{ scope.row.content.split('详见：')[0] }}</span><br/>
                            详见：
                            <span class="dz" @click="infoPc(scope.row, scope.row.businessTypeShow)">{{ scope.row.content.split('详见：')[1] }}</span>
                            <el-tooltip class="item" effect="dark" content="复制" placement="top">
                                <i class="el-icon-connection" style="marginLeft:10px;cursor: pointer;" @click="copyBtn(scope.row.content)"></i>
                            </el-tooltip>
                        </div>
                        <div v-if="scope.row.businessTypeS">
                            <span>{{ scope.row.content }}</span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="结果信息"  prop="resultMessage" width="160" v-if="columns[11].visible"/>
            <el-table-column label="发送类型"  prop="sendTypeTxt" width="100" v-if="columns[12].visible"/>
            
            <el-table-column label="发送时间"  prop="sendTime" width="160" v-if="columns[13].visible">
                <template slot-scope="scope">
                    <span v-if="scope.row.sendTime">{{ parseTime(scope.row.sendTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="发送状态" align="center"  prop="sendStatusTxt" width="100" v-if="columns[14].visible">
                <template slot-scope="scope">
                    <span :style="{color: scope.row.sendStatusColor}" :class="(scope.row.sendStatus == 4 || scope.row.sendStatus == 2) ? 'activeClass' : ''" @click="goInfo(scope.row)">{{ scope.row.sendStatusTxt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="重试次数" align="center"  prop="tryAgainCount" width="100" v-if="columns[15].visible" />
            <el-table-column label="创建时间"  prop="createTime" width="160" v-if="columns[16].visible"/>
            <el-table-column label="云片ID"  prop="resultMessageId" width="120" v-if="columns[17].visible"/>
            <el-table-column label="云片code"  prop="yunPianCode" width="80" v-if="columns[18].visible"/>
            <el-table-column label="策略ID"  prop="strategyId" width="80" v-if="columns[19].visible"/>
            <el-table-column label="去重ID"  prop="duplicateId" width="210" v-if="columns[20].visible"/>
        </el-table>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pgNum"
            :limit.sync="queryParams.pgSize"
            @pagination="getList"
        />
    </div>
</template>

<script>
import {
    getLogList,
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                strategyId: null, // 查询id
                pgNum: 1,
                pgSize: 10,
                strategyName: null, // 策略名称  模糊检索
                messageType: null, // 消息类型：1产品预警 2系统报告
                productType: null, // 产品名称：1网站监测 2新媒体监测
                businessType: null,  // 业务类型
                receivePhoneAddress: null, // 接收地址   接收短信的手机号  模糊筛选
                produceSiteName: null, // 产生问题客户筛选  可输入代码或名称
                receiveSiteName: null, // 接收消息客户筛选  可输入代码或名称
                effectiveSiteName: null, // 策略生效客户筛选  可输入代码或名称 
                startDate: null, // 创建时间开始时间 
                endDate: null, // 创建时间结束时间 
                sendStartDate: null, // 发送时间开始时间
                sendEndDate: null, // 发送时间结束时间
                sendStatus: null, // 发送状态：1待发送 2重试中 3成功 4失败
            },
            DateArr: [],
            DateArr2: [],
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
                { value: 5, label: '网站-错误内容' },
                { value: 6, label: '网站-敏感信息' },
                { value: 7, label: '网站-隐私泄露' },
                { value: 8, label: '网站-异常外链' },
                { value: 10, label: '网站-日报' },
                { value: 9, label: '新媒体未更新' },
                { value: 102, label: '新媒体-错误内容' },
                { value: 103, label: '新媒体-敏感信息' },
                { value: 104, label: '新媒体-隐私泄露' },
                { value: 105, label: '新媒体-异常外链' },
                { value: 101, label: '新媒体-日报' },
                
            ],
            // 发送类型
            sendTypeList: [
                { value: 1, label: '短信' },
                { value: 2, label: '微信公众号' },
                { value: 3, label: '邮箱' },
            ],
            // 发送状态
            sendStatusList: [
                { value: 1, label: '待发送', color: '#909399' },
                { value: 2, label: '重试中', color: '#E6A23C' },
                { value: 3, label: '成功', color: '#67C23A' },
                { value: 4, label: '失败', color: '#F56C6C' },
                { value: 5, label: '不发送', color: '#909399' },
                { value: 6, label: '去重', color: '#909399' },
            ],

            // 列信息
            columns: [
                { key: 0, label: `产品类型`, visible: true },
                { key: 1, label: `消息类型`, visible: true },
                { key: 2, label: `业务类型`, visible: true },
                { key: 3, label: `触发条件`, visible: true },
                { key: 4, label: `接收短信名称`, visible: true },
                { key: 5, label: `接收短信手机号`, visible: true },
                { key: 6, label: `策略名称`, visible: true },
                { key: 7, label: `接收消息`, visible: true },
                { key: 8, label: `产生问题`, visible: true },
                { key: 9, label: `策略生效`, visible: true },
                { key: 10, label: `发送内容`, visible: true },
                { key: 11, label: `结果信息`, visible: true },
                { key: 12, label: `发送类型`, visible: true },
                { key: 13, label: `发送时间`, visible: true },
                { key: 14, label: `发送状态`, visible: true },
                { key: 15, label: `重试次数`, visible: true },
                { key: 16, label: `创建时间`, visible: true },
                { key: 17, label: `云片ID`, visible: true },
                { key: 18, label: `云片code`, visible: true },
                { key: 19, label: `策略ID`, visible: true },
                { key: 20, label: `去重ID`, visible: true },


            ],
        };
    },
    created() {
        if(sessionStorage.getItem('warnLogId')){
            this.queryParams.strategyId = parseInt(sessionStorage.getItem('warnLogId'));
            this.getList();
        }else{
            this.getList();
        }
    },
    beforeDestroy() {
        // 清理缓存的代码
        sessionStorage.removeItem('warnLogId');
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
        getList() {
            this.loading = true;
            getLogList(this.queryParams).then(response => {
                this.inspSiteDirectorList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspSiteDirectorList){
                    // 产品类型
                    for(var a in this.productTypeList){
                        if(this.inspSiteDirectorList[i].productType == this.productTypeList[a].value){
                            this.inspSiteDirectorList[i].productTypeTxt = this.productTypeList[a].label;
                        }else if(!this.inspSiteDirectorList[i].productType){
                            this.inspSiteDirectorList[i].productTypeTxt = '--';
                        }
                    }
                    // 消息类型
                    for(var b in this.messageTypeList){
                        if(this.inspSiteDirectorList[i].messageType == this.messageTypeList[b].value){
                            this.inspSiteDirectorList[i].messageTypeTxt = this.messageTypeList[b].label;
                        }else if(!this.inspSiteDirectorList[i].messageType){
                            this.inspSiteDirectorList[i].messageTypeTxt = '--';
                        }
                    }
                    // 业务类型
                    for(var c in this.businessTypeList){
                        if(this.inspSiteDirectorList[i].businessType == this.businessTypeList[c].value){
                            this.inspSiteDirectorList[i].businessTypeTxt = this.businessTypeList[c].label;
                        }else if(!this.inspSiteDirectorList[i].businessType){
                            this.inspSiteDirectorList[i].businessTypeTxt = '--';
                        }
                    }
                    // 发送类型
                    for(var d in this.sendTypeList){
                        if(this.inspSiteDirectorList[i].sendType == this.sendTypeList[d].value){
                            this.inspSiteDirectorList[i].sendTypeTxt = this.sendTypeList[d].label;
                        }else if(!this.inspSiteDirectorList[i].sendType){
                            this.inspSiteDirectorList[i].sendTypeTxt = '--';
                        }
                    }
                    // 发送状态
                    for(var e in this.sendStatusList){
                        if(this.inspSiteDirectorList[i].sendStatus == this.sendStatusList[e].value){
                            this.inspSiteDirectorList[i].sendStatusTxt = this.sendStatusList[e].label;
                            this.inspSiteDirectorList[i].sendStatusColor = this.sendStatusList[e].color;
                        }else if(!this.inspSiteDirectorList[i].sendStatus){
                            this.inspSiteDirectorList[i].sendStatusTxt = '--';
                            this.inspSiteDirectorList[i].sendStatusColor = '';
                        }
                    }
                    if(!this.inspSiteDirectorList[i].resultMessageId){
                        this.inspSiteDirectorList[i].resultMessageId = '--';
                    }
                    if(!this.inspSiteDirectorList[i].yunPianCode){
                        this.inspSiteDirectorList[i].yunPianCode = '--';
                    }
                    if(!this.inspSiteDirectorList[i].duplicateId){
                        this.inspSiteDirectorList[i].duplicateId = '--';
                    }
                    // businessType
                    if(this.inspSiteDirectorList[i].businessType == 10 || this.inspSiteDirectorList[i].businessType == 101){ // 日报
                        this.inspSiteDirectorList[i].businessTypeShow = true;
                    }else{ // 预警
                        this.inspSiteDirectorList[i].businessTypeShow = false;
                        if(this.inspSiteDirectorList[i].businessType == 1 || this.inspSiteDirectorList[i].businessType == 2 || this.inspSiteDirectorList[i].businessType == 3){
                            this.inspSiteDirectorList[i].businessTypeS = true;
                        }else{
                            this.inspSiteDirectorList[i].businessTypeS = false;
                        }
                    }
                    
                    // contentLeft = content.split('详见：')[1]
                    
                }
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pgNum = 1;
            // 创建时间
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
            // 发送时间
            if(this.DateArr2){
                this.queryParams.sendStartDate = this.DateArr2[0];
                this.queryParams.sendEndDate = this.DateArr2[1];
                if(this.queryParams.sendStartDate){
                    this.queryParams.sendStartDate = this.formatDate(this.queryParams.sendStartDate) + ' 00:00:00';
                }
                if(this.queryParams.sendEndDate){
                    this.queryParams.sendEndDate = this.formatDate(this.queryParams.sendEndDate) + ' 23:59:59';
                }
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.DateArr = [];
            this.queryParams.startDate = null; // 开始时间
            this.queryParams.endDate = null; // 结束时间
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
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
        sjrqChange2(val){
            console.log(val)
            if(val == null){
                this.DateArr2 = [];
                this.queryParams.sendStartDate = null;
                this.queryParams.sendEndDate = null;
            }
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
                // this.$router.go(-1);    
                this.$router.push({path:'/warn/index'})
            })
        },
        // 异常日志
        goInfo(row){
            if(row.sendStatus == 4 || row.sendStatus == 2){
                sessionStorage.setItem('warnFailSendLogId', row.idStr);
                // window.location.href = '/basic/inspSiteDirector';
                this.$router.push({name:'warnFailSendLog'})
            }
        },

        // pc
        infoPc(row, businessTypeShow){
            // if(row.businessType == 4){ // 首页未更新
            //     sessionStorage.setItem('homePageUpdateId', row.content.split('详见：')[1].split('/').pop());
            //     this.$router.push({name:'homePageUpdate'})
            // }else if(row.businessType == 5 || row.businessType == 6 || row.businessType == 7){ // 错误、敏感、隐私
            //     sessionStorage.setItem('wrongWordsId', row.content.split('详见：')[1].split('/').pop());
            //     this.$router.push({name:'wrongWords'})
            // }
            // console.log(row.content.split('详见：')[1],'大叔大婶多')
            if (businessTypeShow) {
                window.open(row.content.split('查看详情：')[1])
            } else {
                window.open(row.content.split('详见：')[1])
            }
            
            
        },

        // 查看策略
        goWarn(row){
            if(row.businessType == 10 || row.businessType == 101){
                sessionStorage.setItem('dailyId', row.strategyId);
                this.$router.push({path:'/warn/index'})
            }else{
                sessionStorage.setItem('warnId', row.strategyId);
                this.$router.push({path:'/warn/index'})
            }
            
        },
        // 复制发送内容
        copyBtn(row){
            // navigator.clipboard.writeText(row);
            // this.$modal.msgSuccess("已复制");
            const textArea = document.createElement('textarea');
            textArea.value = row;
            textArea.style.position = 'fixed'; // 防止页面滚动时出现
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.$modal.msgSuccess("已复制");
                } else {
                    this.$modal.msgWarning("无法复制");
                }
            } catch (err) {
                console.error('无法复制文本: ', err);
            }
            document.body.removeChild(textArea);
        }
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
