<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon=""
                    size="mini"
                    @click="goBack"
                >返回上级</el-button>
            </el-col>
        </el-row>
        <!-- 错别字 -->
        <div class="divBox">
            <div style="fontSize: 20px;fontWeight: blod">错别字</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="wrongWordsList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="word" label="错敏词" min-width="200"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="suggest" label="推荐词" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.suggest}}</span>
                    </template>
                </el-table-column>              
                <el-table-column prop="sentence" label="所在上下文" min-width="400">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.sentence.split(scope.row[i].word)[0]}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.sentence.split(scope.row[i].word)[1]}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeText" label="问题类型" min-width="160"></el-table-column>
                <el-table-column prop="title" label="快照" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination
                v-show="wrongWordsTotal>0"
                :total="wrongWordsTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>

        <!-- 敏感词 -->
        <div class="divBox">
            <div style="fontSize: 20px;fontWeight: blod">敏感词</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="sensitiveWordsList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="word" label="错敏词" min-width="200"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="suggest" label="推荐词" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.suggest}}</span>
                    </template>
                </el-table-column>              
                <el-table-column prop="sentence" label="所在上下文" min-width="400">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.sentence.split(scope.row[i].word)[0]}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.sentence.split(scope.row[i].word)[1]}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeText" label="问题类型" min-width="160"></el-table-column>
                <el-table-column prop="title" label="快照" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination
                v-show="sensitiveWordsTotal>0"
                :total="sensitiveWordsTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>

        <!-- 隐私 -->
        <div class="divBox">
            <div style="fontSize: 20px;fontWeight: blod">隐私</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="privacyLeaksList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="word" label="错敏词" min-width="200"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="suggest" label="推荐词" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.suggest}}</span>
                    </template>
                </el-table-column>              
                <el-table-column prop="sentence" label="所在上下文" min-width="400">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.sentence.split(scope.row[i].word)[0]}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.sentence.split(scope.row[i].word)[1]}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeText" label="问题类型" min-width="160"></el-table-column>
                <el-table-column prop="title" label="快照" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination
                v-show="privacyLeaksTotal>0"
                :total="privacyLeaksTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>

        <!-- 错别字误报 -->
        <div class="divBox">
            <div style="fontSize: 20px;fontWeight: blod">错别字误报</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="wrongWordsIgnoresList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="word" label="错敏词" min-width="200"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="suggest" label="推荐词" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.suggest}}</span>
                    </template>
                </el-table-column>              
                <el-table-column prop="sentence" label="所在上下文" min-width="400">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="scope.row.sentence">
                                <span>{{scope.row.sentence.split(scope.row[i].word)[0]}}</span>
                                <span style="color:red;borderBottom:1px solid red">{{scope.row.word}}</span>
                                <span>{{scope.row.sentence.split(scope.row[i].word)[1]}}</span>
                            </span>
                            <span v-if="!scope.row.sentence">--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="typeText" label="问题类型" min-width="160"></el-table-column>
                <el-table-column prop="title" label="快照" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <pagination
                v-show="wrongWordsIgnoresTotal>0"
                :total="wrongWordsIgnoresTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>

        <!-- 外链 -->
        <div class="divBox">
            <div style="fontSize: 20px;fontWeight: blod">外链</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="externalLinksList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="60" align="center"></el-table-column>
                <el-table-column prop="url" label="网页地址" min-width="300"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="domain" label="当前文章的根域名" min-width="300"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="errorTypesText" label="错误类型" min-width="120"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="trustFlagText" label="是否信任" min-width="100" align="center"  show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="依据" align="center" v-if="according"> -->
                <el-table-column label="依据" align="center">
                    <el-table-column label="依据ID" align="center" prop="according.accId" min-width="160" />
                    <el-table-column label="依据名称" align="center" prop="according.accName" min-width="140" show-overflow-tooltip/>
                    <el-table-column label="描述" align="center" prop="according.description" min-width="200" show-overflow-tooltip/>
                    <el-table-column label="依据类型" align="center" prop="according.accTypeTxt" min-width="120" />
                    <el-table-column label="错误类型" align="center" prop="according.errorTypesTxt" min-width="120" />
                    <el-table-column label="是否信任" align="center" prop="according.trustFlagtxt" min-width="100" />
                </el-table-column>
                <el-table-column prop="title" label="快照" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-camera-solid" type="text" :disabled="!scope.row.snapshotPath" style="font-size:20px" @click="dzChange(scope.row.snapshotPath)"></el-button>
                    </template>
                </el-table-column>

                
            </el-table>

            <!-- <pagination
                v-show="externalLinksTotal>0"
                :total="externalLinksTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>

        <!-- 代理采集记录 -->
        <div class="divBox" v-if="false">
            <div style="fontSize: 20px;fontWeight: blod">代理采集记录</div>
            <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
            <el-table
                v-loading="loading"
                :data="proxiesList"
                max-height="500"
                fit
            >
                <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                <el-table-column prop="spiderCount" label="采集次数"   show-overflow-tooltip></el-table-column>
                <el-table-column prop="spiderEnableTxt" label="是否代理采集"   show-overflow-tooltip></el-table-column>
                <el-table-column prop="ip" label="采集节点IP"   show-overflow-tooltip></el-table-column>
                <el-table-column prop="statusCode" label="返回码"   show-overflow-tooltip></el-table-column>

                
            </el-table>

            <!-- <pagination
                v-show="proxiesTotal>0"
                :total="proxiesTotal"
                :page.sync="queryParams.pgNum"
                :limit.sync="queryParams.pgSize"
                @pagination="getList"
            /> -->
        </div>


    </div>
</template>

<script>
import {
    getDetails,
} from "@/api/biz/pagesIndex";
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
            wrongWordsList: [],
            sensitiveWordsList: [],
            privacyLeaksList: [],
            wrongWordsIgnoresList: [],
            externalLinksList: [],
            proxiesList: [],

            wrongWordsTotal: 0,
            sensitiveWordsTotal: 0,
            privacyLeaksTotal: 0,
            wrongWordsIgnoresTotal: 0,
            externalLinksTotal: 0,
            proxiesTotal: 0,
            queryParams: {
                idStr: null
            },

            // 外链-错误类型
            errorTypesList: [
                { label: '广告', val: 1 },
                { label: '赌博', val: 200 },
                { label: '色情', val: 300 },
                { label: '仿冒网站', val: 400 },
                { label: '商业', val: 500 },
                { label: '知名媒体', val: 600 },
                { label: '知名平台', val: 700 },
                { label: '域名注销', val: 800 },
                { label: '游戏', val: 900 },
                { label: '影视资源', val: 1000 },
                { label: '报送已关停', val: 1100 },
                { label: '无法确定', val: 1200 },
                { label: '数据异常', val: 1300 },
                { label: '错链', val: 1400 },
                { label: '正常', val: 1500 },
            ],

            
        };
    },
    beforeRouteLeave(to, from, next) {
        // 在这里处理页面离开逻辑
        console.log('离开页面了！');
        // 确保调用next()以便路由继续跳转

        // 非进入详情 离开页面删除
        if(this.isGoInfo == false){
             sessionStorage.removeItem('pageSIndexId')
        }
        next();

    },
    created() {
        if(sessionStorage.getItem('pageSIndexId')){
            this.queryParams.idStr = sessionStorage.getItem('pageSIndexId');
        }
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
        /** 查询列表 */
        getList() {
            this.loading = true;
            getDetails(this.queryParams).then(response => {
                this.wrongWordsList = response.data.wrongWords;
                this.sensitiveWordsList = response.data.sensitiveWords;
                this.privacyLeaksList = response.data.privacyLeaks;
                this.wrongWordsIgnoresList = response.data.wrongWordsIgnores;
                this.externalLinksList = response.data.externalLinks;
                this.proxiesList = response.data.proxies;

                this.wrongWordsTotal = this.wrongWordsList.length;
                this.sensitiveWordsTotal = this.sensitiveWordsList.length;
                this.privacyLeaksTotal = this.privacyLeaksList.length;
                this.wrongWordsIgnoresTotal = this.wrongWordsIgnoresList.length;
                this.externalLinksTotal = this.externalLinksList.length;
                this.proxiesTotal = this.proxiesList.length;

                // // 外链
                // for(var i in this.externalLinksList){
                //     if(this.externalLinksList[i].trustFlag == 1){
                //         this.externalLinksList[i].trustFlagTxt = '信任';
                //     }else if(this.externalLinksList[i].trustFlag == 2){
                //         this.externalLinksList[i].trustFlagTxt = '可疑';
                //     }
                // }
                // 错别字
                if(this.wrongWordsList.length > 0){
                    for(var i in this.wrongWordsList){
                        this.wrongWordsList[i].index = parseInt(i)+1;
                    }
                }
                // 敏感词
                if(this.sensitiveWordsList.length > 0){
                    for(var i in this.sensitiveWordsList){
                        this.sensitiveWordsList[i].index = parseInt(i)+1;
                    }
                }
                // 隐私
                if(this.privacyLeaksList.length > 0){
                    for(var i in this.privacyLeaksList){
                        this.privacyLeaksList[i].index = parseInt(i)+1;
                    }
                }
                // 错别字误报
                if(this.wrongWordsIgnoresList.length > 0){
                    for(var i in this.wrongWordsIgnoresList){
                        this.wrongWordsIgnoresList[i].index = parseInt(i)+1;
                    }
                }
                // 外链
                if(this.externalLinksList.length > 0){
                    for(var i in this.externalLinksList){
                        this.externalLinksList[i].index = parseInt(i)+1;
                        if(this.externalLinksList[i].according){
                            // 依据类型
                            if(this.externalLinksList[i].according.accType == 1){
                                this.externalLinksList[i].according.accTypeTxt = '外链详情';
                            }else if(this.externalLinksList[i].according.accType == 2){
                                this.externalLinksList[i].according.accTypeTxt = '黑白名单规则任务命中';
                            }else if(this.externalLinksList[i].according.accType == 3){
                                this.externalLinksList[i].according.accTypeTxt = '免检命中';
                            }else if(this.externalLinksList[i].according.accType == 4){
                                this.externalLinksList[i].according.accTypeTxt = '原采黑白名单命中';
                            }else if(this.externalLinksList[i].according.accType == 5){
                                this.externalLinksList[i].according.accTypeTxt = '原采免检命中';
                            }
                            // 是否信任
                            if(this.externalLinksList[i].according.trustFlag == 1){
                                this.externalLinksList[i].according.trustFlagTxt = '信任';
                            }else if(this.externalLinksList[i].according.trustFlag == 2){
                                this.externalLinksList[i].according.trustFlagTxt = '可疑';
                            }
                            // 错误类型
                            for(var j in this.errorTypesList){
                                if(this.externalLinksList[i].according.errorTypes == this.errorTypesList[j].val){
                                    this.externalLinksList[i].according.errorTypesTxt = this.errorTypesList[j].label;
                                }
                            }
                        }
                    }
                }
                // 代理采集记录
                if(this.proxiesList.length > 0){
                    for(var i in this.proxiesList){
                        this.proxiesList[i].index = parseInt(i)+1;
                        if(this.proxiesList[i].spiderEnable == true){
                            this.proxiesList[i].spiderEnableTxt = '是';
                        }else if(this.proxiesList[i].spiderEnable == false){
                            this.proxiesList[i].spiderEnableTxt = '否';
                        }
                    }
                }

                this.loading = false;
            });
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                siteCode: null,
                word: null,
                suggest: null,
                severity: null,
                showState: null,
                explanation: null,
            };
            this.editObj = {};
            this.resetForm("form");
        },
        // 地址超链接
        dzChange(url){
            if(url != null){
                window.open(url)
            }
        },

        // 返回上级
        goBack(){
            // this.$router.go(-1);
            this.isGoInfo = false;
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
                this.$router.go(-1);    
            })
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
    .divBox{
        margin-bottom: 20px;
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
        margin: 5px 0 5px 0;
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
<style scoped>
    /deep/ .el-table__body tr, .el-table__body td {
        height: 30px !important;
        }
</style>