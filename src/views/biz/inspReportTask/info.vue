<template>
    <div class="app-container">
        <!-- <span class="back">
            <el-button
            type="primary"
            plain
            icon=""
            size="mini"
            @click="goBack"
            >返回上级</el-button>
        </span> -->
        <el-form
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="100px"
        >
            <!-- <el-form-item label="网站标识码" prop="siteCode">
                <el-input
                    v-model="queryParams.siteCode"
                    placeholder="请输入网站标识码"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item> -->
            <el-form-item label="监测时间" prop="scanDate" class="a" style="width:292px">
                <el-date-picker
                    clearable
                    v-model="queryParams.scanDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择监测时间"
                    style="width:192px"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="栏目名称" prop="channelName">
                <el-input
                    v-model="queryParams.channelName"
                    placeholder="请输入栏目名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="一级指标" prop="firstNormId">
                <el-select v-model="queryParams.firstNormId" filterable clearable placeholder="请选择一级指标" @change="firstNormIdChange">
                    <el-option
                    v-for="item in firstNormIdDate"
                    :key="item.id"
                    :label="item.normName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级指标" prop="secondNormId">
                <el-select v-model="queryParams.secondNormId" filterable clearable placeholder="请选择二级指标" @change="secondNormIdChange">
                    <el-option
                    v-for="item in secondNormIdDate"
                    :key="item.id"
                    :label="item.normName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指标类型" prop="normId">
                <el-select v-model="queryParams.normId" filterable clearable placeholder="请选择指标类型" style="width:360px">
                    <el-option
                    v-for="item in normIdDate"
                    :key="item.id"
                    :label="item.normName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指标特有类型" prop="inspNorm.publicType">
                <el-select v-model="queryParams.inspNorm.publicType"  clearable placeholder="请选择指标特有类型">
                    <el-option
                    v-for="item in publicTypeDate"
                    :key="item.val"
                    :label="item.label"
                    :value="item.val">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分值类型" prop="inspNorm.scoreType">
                <el-select v-model="queryParams.inspNorm.scoreType"  clearable placeholder="请选择分值类型">
                    <el-option
                    v-for="item in scoreTypeDate"
                    :key="item.val"
                    :label="item.label"
                    :value="item.val">
                    </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item style="marginLeft:30px">
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
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col> -->
            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            <el-col :span="1.5" style="float:right">
                <el-button
                    type="primary"
                    plain
                    icon=""
                    size="mini"
                    @click="goBack"
                >返回上级</el-button>
            </el-col>
        </el-row>
        
        <p class="numnum">共<span style="color: #1890ff;margin:0 3px">{{formatToScientificNotation(total)}}</span>条数据</p>
        <el-table
            v-loading="loading"
            :data="inspHandList"
            @selection-change="handleSelectionChange"
        >
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="主键ID" align="center" prop="id" width="80"  />
            <el-table-column label="网站标识码"  prop="siteCode" width="120"  />
            <el-table-column label="监测时间"  prop="scanDate" width="120">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.scanDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="栏目名称"  prop="channelName" width="220" show-overflow-tooltip />
            <el-table-column label="页面地址"  prop="pageUrl" width="220" show-overflow-tooltip />
            <el-table-column label="问题描述"  prop="problemDesc" width="300" show-overflow-tooltip />
            <el-table-column label="页面截图"  prop="imgPath" width="100" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="seeImg(scope.row)"
                        
                    >查看截图</el-button>
                </template>
            </el-table-column>
            <el-table-column label="一级指标"  prop="firstNormIdTxt" width="140" />
            <el-table-column label="二级指标"  prop="secondNormIdTxt" width="200" show-overflow-tooltip />
            <el-table-column label="指标类型"  prop="inspNorm.normName" width="260" show-overflow-tooltip />
            <el-table-column label="分值类型" align="center"  prop="inspNorm.scoreTypeTxt" width="100" />
            <el-table-column label="分值" align="center"   prop="inspNorm.scoreVal" width="100" />
            <el-table-column label="指标特有类型" align="center"    prop="inspNorm.publicTypeTxt" width="140" />
            <!-- <el-table-column label="评分细则"  prop="inspNorm.scoreDetail" width="300">
                <template slot-scope="scope">
                    <el-tooltip placement="left-start">
                        <div slot="content" style="width:400px">{{scope.row.inspNorm.scoreDetailTxt}}</div>
                        <span class="sp">{{scope.row.inspNorm.scoreDetail}}</span>
                    </el-tooltip>
                </template>
            </el-table-column> -->
            <el-table-column label="评分细则" align="center"  prop="inspNorm.scoreDetail" width="300" show-overflow-tooltip />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
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

        <!-- 添加或修改人工录入问题对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                <div class="box">
                    <!-- <el-form-item label="订单" prop="" style="width: 48%">
                        {{infoObj.orderName}}
                    </el-form-item>
                    <el-form-item label="订单批次" prop="" style="width: 48%">
                        {{infoObj.batchName}}
                    </el-form-item>
                    <el-form-item label="网站标识码" prop="" style="width: 48%">
                        {{infoObj.siteCode}}
                    </el-form-item>
                    <el-form-item label="" prop="reportTaskId" style="width: 48%">
                        {{form.reportTaskId}}
                    </el-form-item> -->
                    <el-form-item label="一级指标" prop="firstNormId" style="width: 48%">
                        <!-- <el-input v-model="form.firstNormId" placeholder="请输入一级指标ID" /> -->
                        <el-select v-model="form.firstNormId" filterable clearable placeholder="请选择指标类型" style="width:90%" @change="firstNormIdChange2">
                            <el-option
                            v-for="item in firstNormIdDate2"
                            :key="item.id"
                            :label="item.normName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="二级指标" prop="secondNormId" style="width: 48%">
                        <!-- <el-input v-model="form.secondNormId" placeholder="请输入二级指标ID" /> -->
                        <el-select v-model="form.secondNormId" filterable clearable placeholder="请选择指标类型" style="width:90%" @change="secondNormIdChange2">
                            <el-option
                            v-for="item in secondNormIdDate2"
                            :key="item.id"
                            :label="item.normName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指标类型" prop="normId" style="width:92.5%">
                        <el-select v-model="form.normId" filterable clearable placeholder="请选择指标类型" style="width:100%" @change="normIdChange">
                            <el-option
                            v-for="item in normIdDate2"
                            :key="item.id"
                            :label="item.normName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="扣/加分值" prop="" style="width: 14%" v-if="form.normId">
                        {{form.scoreVal}}
                    </el-form-item>
                    <el-form-item label="总分值" prop="" style="width: 10%" v-if="form.normId">
                        {{form.scoreTotal}}
                    </el-form-item> -->

                    <!-- <el-form-item label="分值" prop="scoreVal" style="width: 48%">
                        <el-input-number v-model="form.scoreVal" controls-position="right" :min="0" :max="100"  style="width: 90%"></el-input-number>
                    </el-form-item> -->
                    <el-form-item label="评分细则" prop="scoreDetail" style="width: 92.5%">
                        <el-input v-model="form.scoreDetail" type="textarea" :autosize="{ minRows: 8, maxRows: 100 }" disabled placeholder="请输入内容" />
                        <!-- {{form.scoreDetail}} -->
                    </el-form-item>
                    <!-- <el-form-item label="扣/加分值" prop="" style="width: 48%">
                        {{form.scoreVal}}
                    </el-form-item>
                    <el-form-item label="总分值" prop="" style="width: 48%">
                        {{form.scoreTotal}}
                    </el-form-item> -->
                    </el-form-item>
                    <el-form-item label="栏目名称" prop="channelName" style="width: 92.5%">
                        <el-input v-model="form.channelName" placeholder="请输入栏目名称"/>
                    </el-form-item>
                    <el-form-item label="页面地址" prop="pageUrl" style="width: 92.5%">
                        <el-input v-model="form.pageUrl" placeholder="请输入页面地址"/>
                    </el-form-item>
                    <el-form-item label="监测时间" prop="scanDate" style="width: 48%">
                        <el-date-picker
                            clearable
                            v-model="form.scanDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择监测时间"
                            style="width:90%"
                            :picker-options="expireTimeOPtion"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="问题描述" prop="problemDesc" style="width: 92.5%">
                        <el-input v-model="form.problemDesc" type="textarea" placeholder="请输入内容" />
                    </el-form-item>
                    <el-form-item label="页面截图" prop="imgPath" style="width: 92.5%">
                        <!-- <el-input v-model="form.imgPath" type="textarea" placeholder="请输入内容"/> -->
                        <el-upload
                            :action="upurl"
                            ref="uploadMutiple"
                            :data="myData"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-change="imgchange"
                            :file-list="fileList"
                            multiple
                            :headers="headers"
                            :on-success="getupload"
                            :auto-upload="false"
                            :limit='5'
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div id="preview" @paste="handlePaste">
                            <span @click="cvClick">
                                <i class="el-icon-s-opportunity" style="color:#FB894C"></i>{{cvTxt}}<span style="color:red;fontSize:12px">（最多上传5张）</span>
                            </span>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 图片放大 -->
        <el-dialog :visible.sync="innerVisible" append-to-body width="800px">
            <img :src="dialogImageUrl" alt  style="max-width:100%"/>
        </el-dialog>
        <!-- 列表图片查看 -->
        <el-dialog :visible.sync="imgShow" append-to-body class="seeImg" width="800px">
            <div>
                <div v-for="(item,index) in imgShowList" :key="index" style="borderBottom: 1px solid #f0f0f0">
                    <p>第{{index+1}}张</p>
                    <img :src="item" alt style="marginBottom:20px;max-width:100%"  />
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listInspHand,
    getInspHand,
    delInspHand,
    addInspHand,
    updateInspHand,
    listInspNorm
} from "@/api/biz/inspHand";
import { uploadAvatars } from "@/api/system/user";
import { getInspReportTask } from "@/api/biz/inspReportTask";


export default {
    name: "InspHand",
    data() {
        return {
            imgShow: false,
            imgShowList: [],
            expireTimeOPtion: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的 
                }
            },
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
            // 人工录入问题表格数据
            inspHandList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pgNum: 1,
                pgSize: 10,
                siteCode: null,
                scanDate: null,
                channelName: null,
                pageUrl: null,
                problemDesc: null,
                imgPath: null,
                firstNormId: null,
                secondNormId: null,
                normId: null,
                scoreVal: null,
                inspNorm: {
                    scoreType: null,
                    publicType: null,
                }
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                firstNormId: [{ required: true, message: '请选择一级指标', trigger: 'change' }],
                secondNormId: [{ required: true, message: '请选择二级指标', trigger: 'change' }],
                normId: [{ required: true, message: '请选择指标类型', trigger: 'change' }],
                scoreDetail: [{ required: true, message: '请选择指标类型（选择指标类型会带出评分细则）', trigger: 'change' }],

                channelName: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
                pageUrl: [{ required: true, message: '请输入页面地址', trigger: 'blur' }],
                scanDate: [{ required: true, message: '请选择监测时间', trigger: 'change' }],
                problemDesc: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
                imgPath: [{ required: true, message: '请上传页面截图', trigger: 'change' }],
            },
            
            // 搜索条件下拉数据
            firstNormIdDate: [],
            secondNormIdDate: [],
            normIdDate: [],
            // 新增编辑下拉数据
            firstNormIdDate2: [],
            secondNormIdDate2: [],
            normIdDate2: [],

            upurl: process.env.VUE_APP_BASE_API + "/common/uploads", // 上传的图片服务器地址
            headers: {
                // Authorization: "Bearer " + getToken(),
                "Content-Type": "multipart/form-data"
            },
            myData: {
                key: "Gn1xVdBiTClSSHKZifg0pTQSU5XGagWO"
            }, //上传时附带的额外参数
            fileList: [], //上传的文件列表
            dialogImageUrl: "",
            innerVisible: false,
            upload_list: [], //提交的图片数组
            limit: 5,

            infoObj: {},

            subFileList: [], // 上传数组

            oldFileList: [], // 删除imgPath需要

            /**下拉数据 */
            // 分值类型
            scoreTypeDate: [
                { label: '扣分', val: 1 },
                { label: '加分', val: 2 },
                { label: '其他', val: 3 },
            ],
            // 指标特有类型
            publicTypeDate: [
                { label: '公共', val: 1 },
                { label: '非国务院部门门户', val: 2 },
                { label: '国务院部门门户', val: 3 },
            ],

            cvTxt: '点击此处 将图片按Ctrl+V 粘贴至此处',


        };
    },
    created() {
        if(sessionStorage.getItem('inspHandId')){
            // this.queryParams.siteCode = sessionStorage.getItem('inspHandSiteCode');
            let data = {
                id: sessionStorage.getItem('inspHandId')
            }
            getInspReportTask(data).then((res)=>{
                this.infoObj = res.data;
                this.queryParams.siteCode = this.infoObj.siteCode;
                if(this.infoObj.bmFlag == 1 && this.infoObj.portalSite == 1){
                    this.infoObj.publicTypeIn = [1,3]
                }else{
                    this.infoObj.publicTypeIn = [1,2]
                }
                console.log(this.infoObj,' this.infoObj')
                this.getList();
                this.listInspNormFn(1);
                this.listInspNormFn(2);
                this.listInspNormFn(3);
            })
        }
        
    },
    methods: {
        /** 查询人工录入问题列表 */
        getList() {
            this.loading = true;
            listInspHand(this.queryParams).then(response => {
                this.inspHandList = response.rows;
                this.total = response.total;
                this.loading = false;
                for(var i in this.inspHandList){
                    // 分值类型
                    if(this.inspHandList[i].inspNorm.scoreType == 1){
                        this.inspHandList[i].inspNorm.scoreTypeTxt = '扣分'
                    }else if(this.inspHandList[i].inspNorm.scoreType == 2){
                        this.inspHandList[i].inspNorm.scoreTypeTxt = '加分'
                    }else if(this.inspHandList[i].inspNorm.scoreType == 3){
                        this.inspHandList[i].inspNorm.scoreTypeTxt = '其他'
                    }
                    // 指标特有类型
                    if(this.inspHandList[i].inspNorm.publicType == 1){
                        this.inspHandList[i].inspNorm.publicTypeTxt = '公共'
                    }else if(this.inspHandList[i].inspNorm.publicType == 2){
                        this.inspHandList[i].inspNorm.publicTypeTxt = '非国务院部门门户'
                    }else if(this.inspHandList[i].inspNorm.publicType == 3){
                        this.inspHandList[i].inspNorm.publicTypeTxt = '国务院部门门户'
                    }
                    // 一级指标
                    for(var j in this.firstNormIdDate){
                        if(this.inspHandList[i].firstNormId == this.firstNormIdDate[j].id){
                            this.inspHandList[i].firstNormIdTxt = this.firstNormIdDate[j].normName;
                        }
                    }
                    // 二级指标
                    for(var z in this.secondNormIdDate){
                        if(this.inspHandList[i].secondNormId == this.secondNormIdDate[z].id){
                            this.inspHandList[i].secondNormIdTxt = this.secondNormIdDate[z].normName;
                        }
                    }
                    // this.inspHandList[i].inspNorm.scoreDetailTxt = this.inspHandList[i].inspNorm.scoreDetail.replace(/。/g,'。\n');
                    this.inspHandList[i].inspNorm.scoreDetailTxt = this.inspHandList[i].inspNorm.scoreDetail;
                }
                // console.log(this.inspHandList[0].inspNorm.scoreDetailTxt)
            });
        },
        listInspNormFn(num,pid){
            let data = {
                level: num,
                pid: pid,
                handFlag: 1,
                publicTypeIn: this.infoObj.publicTypeIn
            };
            // if(num == 3){
            //     data = {
            //         level: num,
            //         pid: pid,
            //         handFlag: 1
            //     }
            // }else{
            //     data = {
            //         level: num,
            //         pid: pid,
            //     }
            // }
            listInspNorm(data).then((res)=>{
                // if(num == 1){
                //     this. firstNormIdDate = res.data;
                // }else if(num == 2){
                //     this.secondNormIdDate = res.data;
                // }else if(num == 3){
                //     this.normIdDate = res.data;
                // }
                if(num == 1){
                    this. firstNormIdDate = res.data;
                    for(var i in this.firstNormIdDate){
                        if(this.firstNormIdDate[i].normName != '单项否决'){
                            if(this.firstNormIdDate[i].scoreType == 1){
                                this.firstNormIdDate[i].normName = this.firstNormIdDate[i].normName + '（扣分）';
                            }else if(this.firstNormIdDate[i].scoreType == 2){
                                this.firstNormIdDate[i].normName = this.firstNormIdDate[i].normName + '（加分）';
                            }else if(this.firstNormIdDate[i].scoreType == 3){
                                this.firstNormIdDate[i].normName = this.firstNormIdDate[i].normName + '（其他）';
                            }
                        }
                    }
                }else if(num == 2){
                    this.secondNormIdDate = res.data;
                    for(var i in this.secondNormIdDate){
                        if(this.secondNormIdDate[i].scoreType == 1){
                            this.secondNormIdDate[i].normName = this.secondNormIdDate[i].normName + '（扣分）';
                        }else if(this.secondNormIdDate[i].scoreType == 2){
                            this.secondNormIdDate[i].normName = this.secondNormIdDate[i].normName + '（加分）';
                        }else if(this.secondNormIdDate[i].scoreType == 3){
                            this.secondNormIdDate[i].normName = this.secondNormIdDate[i].normName + '（其他）';
                        }
                    }
                }else if(num == 3){
                    this.normIdDate = res.data;
                    for(var i in this.normIdDate){
                        if(this.normIdDate[i].scoreType == 1){ // 扣分
                            this.normIdDate[i].normName = this.normIdDate[i].normName + '（扣分）';
                        }else if(this.normIdDate[i].scoreType == 2){ // 加分
                            this.normIdDate[i].normName = this.normIdDate[i].normName + '（加分）';
                        }
                        // this.normIdDate2[i].normName = this.normIdDate2[i].normName + '（分值：'+this.normIdDate2[i].scoreVal+'；总分值：'+this.normIdDate2[i].scoreTotal+'）';
                    }
                }
            })
        },
        listInspNormFn2(num,pid){
            let data = {
                level: num,
                pid: pid,
                handFlag: 1,
                publicTypeIn: this.infoObj.publicTypeIn
            };
            // if(num == 3){
            //     data = {
            //         level: num,
            //         pid: pid,
            //         handFlag: 1
            //     }
            // }else{
            //     data = {
            //         level: num,
            //         pid: pid,
            //     }
            // }
            listInspNorm(data).then((res)=>{
                if(num == 1){
                    this. firstNormIdDate2 = res.data;
                    for(var i in this.firstNormIdDate2){
                        if(this.firstNormIdDate2[i].normName != '单项否决'){
                            if(this.firstNormIdDate2[i].scoreType == 1){
                                this.firstNormIdDate2[i].normName = this.firstNormIdDate2[i].normName + '（扣分）';
                            }else if(this.firstNormIdDate2[i].scoreType == 2){
                                this.firstNormIdDate2[i].normName = this.firstNormIdDate2[i].normName + '（加分）';
                            }else if(this.firstNormIdDate2[i].scoreType == 3){
                                this.firstNormIdDate2[i].normName = this.firstNormIdDate2[i].normName + '（其他）';
                            }
                        }
                    }
                }else if(num == 2){
                    this.secondNormIdDate2 = res.data;
                    for(var i in this.secondNormIdDate2){
                        if(this.secondNormIdDate2[i].scoreType == 1){
                            this.secondNormIdDate2[i].normName = this.secondNormIdDate2[i].normName + '（扣分；总分值：'+this.secondNormIdDate2[i].scoreTotal+'）';
                        }else if(this.secondNormIdDate2[i].scoreType == 2){
                            this.secondNormIdDate2[i].normName = this.secondNormIdDate2[i].normName + '（加分；总分值：'+this.secondNormIdDate2[i].scoreTotal+'）';
                        }else if(this.secondNormIdDate2[i].scoreType == 3){
                            this.secondNormIdDate2[i].normName = this.secondNormIdDate2[i].normName + '（其他）';
                        }
                    }
                }else if(num == 3){
                    this.normIdDate2 = res.data;
                    for(var i in this.normIdDate2){
                        if(this.normIdDate2[i].scoreType == 1){ // 扣分
                            this.normIdDate2[i].normName = this.normIdDate2[i].normName + '（扣分：'+this.normIdDate2[i].scoreVal+'；总分值：'+this.normIdDate2[i].scoreTotal+'）';
                        }else if(this.normIdDate2[i].scoreType == 2){ // 加分
                            this.normIdDate2[i].normName = this.normIdDate2[i].normName + '（加分：'+this.normIdDate2[i].scoreVal+'；总分值：'+this.normIdDate2[i].scoreTotal+'）';
                        }
                        // this.normIdDate2[i].normName = this.normIdDate2[i].normName + '（分值：'+this.normIdDate2[i].scoreVal+'；总分值：'+this.normIdDate2[i].scoreTotal+'）';
                    }
                }
            })
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
                scanDate: null,
                channelName: null,
                pageUrl: null,
                problemDesc: null,
                imgPath: null,
                firstNormId: null,
                secondNormId: null,
                normId: null,
                scoreType: null,
                scoreVal: null,
                publicType: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                scoreDetail: null
            };
            this.resetForm("form");
            this.form.orderInfoId = this.infoObj.orderInfoId;
            this.form.orderBatchId = this.infoObj.orderBatchId;
            this.form.siteCode = this.infoObj.siteCode;
            this.form.reportTaskId = this.infoObj.id;
            this.normIdDate2 = [];
            this.firstNormIdDate2 = [];
            this.secondNormIdDate2 = [];

            this.fileList = [];
            this.oldFileList = [];
            this.cvTxt = '点击此处 将图片按Ctrl+V 粘贴至此处';

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
            this.title = "添加人工录入问题";
            this.listInspNormFn2(1)
            // normIdDate2: [],
        // firstNormIdDate2: [],
        // secondNormIdDate2: [],
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getInspHand({id: id}).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改人工录入问题";
                this.listInspNormFn2(1);
                this.listInspNormFn2(2,this.form.firstNormId);
                this.listInspNormFn2(3,this.form.secondNormId);
                this.form.scoreDetail = response.data.inspNorm.scoreDetail;
                this.form.scoreVal = response.data.inspNorm.scoreVal;
                this.form.scoreTotal = response.data.inspNorm.scoreTotal;
                // this.upload_list = response.data.urls;
                this.fileList = [];
                for(var i in response.data.urls){
                    this.fileList.push({name:'image.png',url:response.data.urls[i]})
                }
                this.oldFileList = [];
                for(var i in response.data.urls){
                    this.oldFileList.push({name:'image.png',url:response.data.urls[i]})
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                        if (this.form.id != null) {
                            // updateInspHand(this.form).then(response => {
                            //     this.$modal.msgSuccess("修改成功");
                            //     this.open = false;
                            //     this.getList();
                            // });
                            const formData = new FormData();
                            // fileList 在data中定义的数组，把所有文件放到formData中
                            console.log(this.subFileList.length,'subFileListsubFileList')
                            if(this.subFileList.length > 0){
                                this.subFileList.forEach(f => {
                                    formData.append("files", f.raw);
                                });
                                uploadAvatars(formData) .then(res => {
                                    // this.$modal.msgSuccess("文件上传成功");
                                    console.log(res.urls.join(','),'resresres')
                                    this.subFileList = [];
                                    // this.upload_list = res.urls
                                    // this.form.imgPath = res.urls.join(',');
                                    if(this.form.imgPath){
                                        this.form.imgPath = this.form.imgPath+','+res.imgPath;
                                    }else{
                                        this.form.imgPath = res.imgPath;
                                    }
                                    // this.form.imgPath = this.form.imgPath+','+res.imgPath;
                                    console.log(this.form.imgPath,'this.form.imgPath')
                                    console.log(this.form,'提交数据')
                                    updateInspHand(this.form).then(response => {
                                        this.$modal.msgSuccess("修改成功");
                                        this.open = false;
                                        this.getList();
                                    });
                                })
                                .catch(e => {
                                    this.$modal.msgError("文件上传失败");
                                });
                            }else{
                                console.log(this.form,'提交数据未更改图片')
                                updateInspHand(this.form).then(response => {
                                    this.$modal.msgSuccess("修改成功");
                                    this.open = false;
                                    this.getList();
                                });
                            }
                        } else {
                            const formData = new FormData();
                            // fileList 在data中定义的数组，把所有文件放到formData中
                            this.subFileList.forEach(f => {
                                formData.append("files", f.raw);
                            });
                            uploadAvatars(formData) .then(res => {
                                // this.$modal.msgSuccess("文件上传成功");
                                console.log(res.urls.join(','),'resresres')
                                this.subFileList = [];
                                // this.upload_list = res.urls
                                // this.form.imgPath = res.urls.join(',');
                                this.form.imgPath = res.imgPath;
                                console.log(this.form.imgPath,'this.form.imgPath')
                                addInspHand(this.form).then(response => {
                                    this.$modal.msgSuccess("新增成功");
                                    this.open = false;
                                    this.getList();
                                });
                            })
                            .catch(e => {
                                this.$modal.msgError("文件上传失败");
                            });
                        }
                    console.log(this.upload_list);
                    
                }
            });
        },
        // /** 删除按钮操作 */
        // handleDelete(row) {
        //     const ids = row.id || this.ids;
        //     this.$modal
        //         .confirm(
        //             '是否确认删除人工录入问题编号为"' + ids + '"的数据项？'
        //         )
        //         .then(function() {
        //             return delInspHand({ids: [ids]});
        //         })
        //         .then(() => {
        //             this.getList();
        //             this.$modal.msgSuccess("删除成功");
        //         })
        //         .catch(() => {});
        // },
        /** 删除按钮操作 */
        handleDelete(row) {
            console.log(row)
            if(row.id){
                const ids = row.id
                this.$modal
                    .confirm('是否确认删除人工录入问题编号为"' + ids + '"的数据项？')
                    .then(function() {
                        return delInspHand({ids:[ids]});
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
                        return delInspHand({ids:ids});
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
            let fileName = '人工数据'
            this.download(
                "biz/inspHand/export",
                {
                    ...this.queryParams
                },
                `${fileName}.xlsx`
            );
        },
        /**条件查询 */
        // 一级指标点击
        firstNormIdChange(){
            if(this.queryParams.firstNormId){
                this.queryParams.secondNormId = null;
                this.queryParams.normId = null;
                this.listInspNormFn(2,this.queryParams.firstNormId);
            }else{
                this.queryParams.secondNormId = null;
                this.queryParams.normId = null;
                this.listInspNormFn(2);
                this.listInspNormFn(3);
            }
        },
        // 二级指标点击
        secondNormIdChange(){
            if(this.queryParams.secondNormId){
                this.queryParams.normId = null;
                this.listInspNormFn(3,this.queryParams.secondNormId);
            }else{
                this.queryParams.normId = null;
                this.listInspNormFn(3);
            }
        },

        /**新增、编辑弹框 */
        // 一级指标点击
        firstNormIdChange2(){
            if(this.form.firstNormId){
                this.form.secondNormId = null;
                this.form.normId = null;
                this.form.scoreDetail = null;
                // this.firstNormIdDate2 = [];
                this.secondNormIdDate2 = [];
                this.normIdDate2 = [];
                this.listInspNormFn2(2,this.form.firstNormId);
            }else{
                this.form.secondNormId = null;
                this.form.normId = null;
                this.form.scoreDetail = null;
                // this.firstNormIdDate2 = [];
                this.secondNormIdDate2 = [];
                this.normIdDate2 = [];
            }
        },
        // 二级指标点击
        secondNormIdChange2(){
            if(this.form.secondNormId){
                this.form.normId = null;
                this.form.scoreDetail = null;
                // this.secondNormIdDate2 = [];
                this.normIdDate2 = [];
                this.listInspNormFn2(3,this.form.secondNormId);
            }else{
                this.form.normId = null;
                this.form.scoreDetail = null;
                // this.secondNormIdDate2 = [];
                this.normIdDate2 = [];
            }
        },
        preText (pretext) {
            return pretext.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;')
        },
        // 指标类型点击
        normIdChange(){
            if(this.form.normId){
                this.form.scoreDetail = null;
                for(var i in this.normIdDate2){
                    if(this.form.normId == this.normIdDate2[i].id){
                        this.form.scoreDetail = this.normIdDate2[i].scoreDetail;
                        this.form.scoreVal = this.normIdDate2[i].scoreVal;
                        this.form.scoreTotal = this.normIdDate2[i].scoreTotal;
                        
                        // this.scoreDetail = this.preText(this.normIdDate2[i].scoreDetail);
                        // if(this.normIdDate2[i].bmFlag == 1 && this.normIdDate2[i].portalSite == 1){
                        //     this.form.publicTypeIn = [1,3]
                        // }else{
                        //     this.form.publicTypeIn = [1,2]
                        // }
                    }
                }
                // bmFlag==1 && portalSite==1 
                
            }else{
                this.form.scoreDetail = null;
            }
            console.log(this.form.scoreDetail,'this.form.scoreDetail')
        },
        // form.scoreDetail

        cvClick(){
            console.log('ok')
            this.cvTxt = 'Ctrl+V 粘贴至此处';
        },
        handlePaste(event) {
            const items = (event.clipboardData || window.clipboardData).items;
            console.log(items, "items");
            let file = null;
            if (!items || items.length === 0) {
                this.$message.error("当前浏览器不支持本地");
                return;
            }
            // 搜索剪切板items
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    file = items[i].getAsFile();
                    break;
                }
            }
            console.log(file, "file");
            if (!file) {
                this.$message.error("粘贴内容非图片");
                return;
            }
            if (this.fileList.length >= this.limit) {
                this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`); // 图片数量超出
                return;
            }
            this.$refs.uploadMutiple.handleStart(file); // 将粘贴过来的图片加入预上传队列
            // this.$refs.uploadMutiple.submit(); // 提交图片上传队列
        },
        //上传
        imgchange(file, fileList) {
            // this.subFileList.push(file);
            this.subFileList = fileList;
            console.log("成功",this.subFileList);
            if(this.subFileList.length > 0){
                let { imgPath, ...data } = this.rules;
                this.rules = data;
                this.$refs['form'].clearValidate('imgPath')
            }
        },
        //on-remove 文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            this.fileList = fileList;
            if(this.form.imgPath){
                let arr = this.form.imgPath.split(',')
                for(var i in this.oldFileList){
                    if(this.oldFileList[i].url == file.url){
                        arr.splice(i, 1);
                    }
                }
                this.form.imgPath = arr.join(',')
            }
            console.log(this.fileList,'file')
            if(this.fileList.length == 0){
                this.rules = { ...this.rules, imgPath: [{ required: true, message: '请上传页面截图', trigger: 'change' }], }                
            }
            

        },
        //on-preview 点击文件列表中已上传的文件时的钩子(预览图片弹窗)
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.innerVisible = true;
            console.log(this.innerVisible,'this.innerVisible')
        },
        // 提交时打印
        getImgUrl() {
            const formData = new FormData();
            // fileList 在data中定义的数组，把所有文件放到formData中
            this.fileList.forEach(f => {
                formData.append("files", f.raw);
            });
            uploadAvatars(formData)
                .then(res => {
                    this.$modal.msgSuccess("文件上传成功");
                    // this.fileList = [];
                    // this.upload_list = res.urls
                })
                .catch(e => {
                    this.$modal.msgError("文件上传失败");
                });
            console.log(this.upload_list);
        },
        // 上传成功之后push到数组
        getupload(res, file, fileList) {
            alert('ok')
            console.log(res, "res");
            console.log(file, "file");
            console.log(fileList, "fileList");
            this.upload_list.push(res.info.url);
            // this.upload_list = fileList;
            // console.log(this.upload_list);
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
                sessionStorage.removeItem('inspHandId')
                this.$router.go(-1);    
            })
        },

        // 查看图片
        seeImg(val){
            console.log(val.urls)
            this.imgShow = true;
            this.imgShowList = [];
            this.imgShowList = val.urls;
        }
    }
};
</script>
<style lang="scss">
    .box{
        display: flex;
        flex-wrap: wrap;
    }
    .back{
        display: flex;
        // justify-content: right;
        // float: right;
        margin-bottom: 20px;
    }
    .sp{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .numnum{
        display: block;
        font-size: 13px;
        margin: 15px 0 5px 0;
    }
</style>
<style scoped>
    /* /deep/.el-form-item__content{
        width: 192px!important;
    }
    /deep/.a .el-input__inner{
        width: 192px!important;
    } */
    /deep/.el-upload--picture-card{
        width: 92px;
        height: 92px;
        line-height: 92px;
    }
    /deep/.el-upload-list--picture-card .el-upload-list__item{
        width: 92px;
        height: 92px;
    }
    /deep/.el-upload-list__item{
        margin-bottom: -14px!important;
    }
    /deep/.el-dialog__body{
        padding: 20px!important
    }
    /deep/.el-dialog:not(.is-fullscreen) {
        margin-top: 3vh !important;
    }
    /deep/.el-dialog__body{
        max-height: 850px!important;
        overflow: auto;
    }
</style>
