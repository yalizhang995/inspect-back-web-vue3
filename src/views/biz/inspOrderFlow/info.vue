<template>
  <div class="app-container">

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5"> 订单产品签收确认 </el-col>
    </el-row>

    <el-row :gutter="20" v-show="showSearch" class="info-row">
      <el-col :span="4">
        <div class="info-label">销售机会编号</div>
        <div class="info-value">{{ detailInfo.customItem252C || "--" }}</div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">订单编号</div>
        <div class="info-value">{{ detailInfo.po || "--" }}</div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">项目名称</div>
        <div class="info-value">
          {{ detailInfo.opportunityIdLabel || "--" }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">销售</div>
        <div class="info-value">{{ detailInfo.ownerIdLabel || "--" }}</div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">接收时间</div>
        <div class="info-value">
          {{
            parseTime(detailInfo.createTime, "{y}-{m}-{d} {h}:{i}:{s}") || "--"
          }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-show="showSearch" class="info-row">
      <el-col :span="4">
        <div class="info-label">网站监测订单ID</div>
        <div class="info-value">{{ detailInfo.inspWebOrderId || "--" }}</div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">新媒体订单ID</div>
        <div class="info-value">{{ detailInfo.inspXmtOrderId || "--" }}</div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">网站安全监测订单ID</div>
        <div class="info-value">
          {{ detailInfo.inspWebSecurityOrderId || "--" }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">签收状态</div>
        <div class="info-value">
          {{ detailInfo.receivedStatus === 1 ? "已签收" : "未签收" }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="info-label">签收时间</div>
        <div class="info-value">{{ detailInfo.receivedTime || "--" }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" style="float: right">
        <el-button
          type="primary"
          plain
          icon=""
          size="mini"
          @click="goBack"
          v-hasPermi="['biz:inspSiteDirector:add']"
          >返回上级</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="tableDate"
    >

      <el-table-column
        type="index"
        label="序号"
        min-width="50"
        align="center"
      />
      <el-table-column
        label="产品名称"
        prop="productId-label"
        min-width="120"
      />
      <el-table-column
        label="服务站点数量"
        prop="quantity"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="服务期次"
        prop="customItem180C"
        min-width="120"
        show-overflow-tooltip
      />

      <el-table-column
        label="服务开始时间"
        align="center"
        prop="customItem177C"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.customItem177C, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务结束时间"
        align="center"
        prop="customItem178C"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.customItem178C, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="网站标识"
        align="center"
        prop="customItem179C"
        width="80"
      />


      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        min-width="120"
      />
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button
          v-if="scope.row.receivedStatus == 0"
            type="text"
            size="mini"
            @click="handleEdit(scope.row)"
            v-hasPermi="['biz:inspOrderBatch:edit']"
          >
            确认签收
          </el-button>
          <el-button
            v-else
            disabled
            size="mini"
            type="text"
            v-hasPermi="['biz:inspOrderInfo:edit']"
          >
            已签收
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改订单信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- 上面：查询表单（可修改） -->
        <div class="form-section">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="订单类型" prop="productType">
                <el-select
                  clearable
                  v-model="form.productType"
                  placeholder="请选择订单类型"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in productTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="网站标识码" prop="siteCode">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="失去焦点会重新校验网站标识码是否存在"
                  placement="top-start"
                  style="width: 100%"
                >
                  <el-input
                    v-model="form.siteCode"
                    placeholder="请输入标识码"
                    style="width: 90%"
                    clearable
                    :disabled="siteCodeS"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="订单名称" prop="orderName">
                <el-input
                  :disabled="!siteCodeType"
                  v-model="form.orderName"
                  placeholder="请输入订单名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报告次数" prop="reportCount">
                <el-input-number
                  :disabled="!siteCodeType"
                  v-model="form.reportCount"
                  controls-position="right"
                  :min="1"
                  :max="1000"
                  style="width: 80%"
                ></el-input-number>
                <span>（次）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                  clearable
                  v-model="form.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择开始时间"
                  style="width: 100%"
                  @change="pickerOptionsStart"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  clearable
                  v-model="form.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请选择结束时间"
                  style="width: 100%"
                  @change="pickerOptionsEnd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="是否正式订单" prop="orderType">
                <el-select
                  v-model="form.orderType"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in formalStateDate"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售人员" prop="owner">
                <el-input
                  v-model="form.owner"
                  placeholder="请输入销售人员"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item
                label="服务类型"
                prop="serviceType"
                style="width: 100%"
              >
                <el-checkbox-group
                  v-model="form.serviceType"
                  @change="handleProductTypeChange"
                  style="display: flex; flex-wrap: wrap; gap: 15px"
                >
                  <el-checkbox
                    v-for="(item, index) in serviceTypeList"
                    :label="item.value"
                    :key="item.value"
                    :disabled="
                      item.value == 2 || item.value == 4 || item.value == 5
                    "
                    style="margin-right: 0"
                    >{{ item.label }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item
                label="站点范围"
                prop="rangeType"
                style="width: 100%"
                v-if="form.siteCode"
              >
                <el-radio-group
                  v-model="form.rangeType"
                  @change="rangeTypeChange"
                >
                  <el-radio
                    v-for="item in rangeTypeDate"
                    :key="item.value"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item
                label="站点范围选择"
                prop="siteCodes"
                style="width: 100%; margin-top: -10px"
                v-if="form.siteCode && getListzdS"
              >
                <div
                  style="width: 90%; text-align: center"
                  v-if="inspSiteTreeList.length == 0"
                >
                  暂无数据
                </div>
                <el-tree
                  ref="tree"
                  node-key="siteCode"
                  :props="inspSiteTreeList"
                  :load="loadNode"
                  lazy
                  show-checkbox
                  v-if="inspSiteTreeList.length > 0"
                >
                </el-tree>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 中间：销售易订单信息（不可修改） -->
        <div class="info-section">
          <h3
            style="
              margin-bottom: 15px;
              font-size: 14px;
              font-weight: 500;
              color: #303133;
            "
          >
            销售易订单信息
          </h3>
          <el-row :gutter="20" class="info-grid">
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">项目名称</div>
                <div class="info-value">
                  {{ detailInfo.opportunityIdLabel || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">销售机会编号</div>
                <div class="info-value">
                  {{ detailInfo.customItem252C || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">客户名称</div>
                <div class="info-value">
                  {{ detailInfo.accountIdLabel || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">订单编号</div>
                <div class="info-value">
                  {{ detailInfo.po || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">合并服务开始时间</div>
                <div class="info-value">
                  {{
                    parseTime(detailInfo.customItem177C, "{y}-{m}-{d}") || "--"
                  }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">合并服务结束时间</div>
                <div class="info-value">
                  {{
                    parseTime(detailInfo.customItem178C, "{y}-{m}-{d}") || "--"
                  }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">网站标识</div>
                <div class="info-value">
                  {{ detailInfo.customItem179C || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">订单分类</div>
                <div class="info-value">
                  {{
                    detailInfo.customItem181C == 1
                      ? "正式"
                      : detailInfo.customItem181C == 2
                      ? "试用"
                      : "特殊订单"
                  }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">销售人员</div>
                <div class="info-value">
                  {{ detailInfo.ownerIdLabel || "--" }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-label">合并服务期次</div>
                <div class="info-value">
                  {{ detailInfo.customItem180CTotal || "--" }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 下面：产品信息（表格） -->
        <div class="product-section">
          <h3
            style="
              margin-bottom: 15px;
              font-size: 14px;
              font-weight: 500;
              color: #303133;
            "
          >
            产品信息
          </h3>
          <el-table :data="productList" style="width: 100%" border>
            <el-table-column
              prop="productIdLabel"
              label="产品名称"
              width="200"
            />
            <el-table-column prop="quantity" label="服务站点数量" width="150" />
            <el-table-column
              prop="customItem180C"
              label="服务期次"
              width="100"
            />
            <el-table-column label="服务开始时间" width="120">
              <template slot-scope="scope">
                <span>{{
                  parseTime(scope.row.customItem177C, "{y}-{m}-{d}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务结束时间" width="120">
              <template slot-scope="scope">
                <span>{{
                  parseTime(scope.row.customItem178C, "{y}-{m}-{d}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customItem179C"
              label="网站标识"
              width="100"
            />
            <el-table-column
              prop="customItem188C"
              label="产品编号"
              width="100"
            />
          </el-table>
        </div>

        <!-- 备注 -->
        <div class="remark-section">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入内容"
              clearable
            />
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
import { siteInfoExist } from "@/api/biz/inspChannel";
import {
  getInspOrderFlowInfo,
  receivedOrderFlow,
} from "@/api/biz/inspOrderFlow";
import { listInspSiteTree } from "@/api/biz/inspSiteTree";

export default {
  name: "InspHand",
  data() {
    return {
      rangeTypeDate: [
        // 站点范围
        { label: "全部子级", value: 1 },
        { label: "本级填报单位", value: 2 },
        { label: "自定义选择", value: 3 },
      ],
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      tableDate: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        id: "",
        productType: "",
        siteCode: "",
        orderName: null,
        reportCount: null,
        startTime: "",
        endTime: "",
        orderType: "",
        owner: "",
        serviceType: [],
        comment: "",
        rangeType: 1,
        siteCodes: [],
        // orderDetailsGroupId: orderData.orderDetailsGroupId,
      },
      // 表单校验
      rules: {
        productType: [
          { required: true, message: "请选择订单类型", trigger: "change" },
        ],
        siteCode: [
          { required: true, message: "请输入网站标识码", trigger: "blur" },
          { validator: this.validateSiteCode, trigger: "blur" },
        ],
        orderName: [
          { required: true, message: "请输入订单名称", trigger: "blur" },
        ],
        reportCount: [
          { required: true, message: "请输入报告次数", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        orderType: [
          { required: true, message: "请选择是否正式订单", trigger: "change" },
        ],
        owner: [
          { required: true, message: "请输入销售人员", trigger: "blur" },
        ],
        serviceType: [
          { required: true, message: "请选择服务类型", trigger: "change" },
        ],
      },
      // 网站标识码是否禁用
      siteCodeS: false,
      // 站点范围选择相关
      getListzdS: false,
      inspSiteTreeList: [],
      // 服务类型数据
      serviceTypeList: [
        // 下载附件类型
        { label: "图片", value: 1 },
        { label: "页面(必选)", value: 2 },
        { label: "附件", value: 3 },
        { label: "JS", value: 4 },
        { label: "CSS", value: 5 },
        { label: "视频", value: 6 },
        { label: "音频", value: 7 },
        // {label: '未知地址', value: 8},
      ],
      productTypeList: [
        // 订单类型
        {
          label: "网站检测",
          value: 1,
        },
        {
          label: "网站安全监测",
          value: 2,
        },
        {
          label: "新媒体监测",
          value: 3,
        },
        {
          label: "其他",
          value: 4,
        },
      ],
      // 是否正式订单数据
      formalStateDate: [
        { label: "正式", value: 1 },
        { label: "试用", value: 2 },
        { label: "特殊订单", value: 3 },
      ],
      // 详情信息
      detailInfo: {
        id: null,
        pgNum: 1,
        pgSize: 10,
        siteName: null,
        siteCode: null,
        orderInfoId: null,
        orderBatchId: null,
        reportName: null,
        reportPath: null,
        reportState: null,
        startDate: null,
        endDate: null,
        cutOffDate: null,
        taskType: null,
        archiveState: null,
      },
      // 产品信息列表
      productList: [],

      siteCodeType: false, // 网站标识码是否存在
    };
  },
  created() {
    if (sessionStorage.getItem("orderFlowInfo")) {
      this.detailInfo.id = parseInt(sessionStorage.getItem("orderFlowInfo"));
      this.getList();
    }
  },

  methods: {
    // 网站标识码校验
    validateSiteCode(rule, value, callback) {
      console.log(this.form.orderType);
      let codeTypeIn = null;
      if (this.form.orderType == 1) {
        codeTypeIn = [0, 1];
      } else if (this.form.orderType == 20) {
        codeTypeIn = null;
      }
      let date = {
        siteCode: value,
        siteType: null,
        codeTypeIn: codeTypeIn,
      };
      siteInfoExist(date).then((res) => {
        this.siteCodeType = res.data.exist;
        console.log(this.siteCodeType, "this.siteCodeType");
        if (this.siteCodeType == false) {
          callback(new Error("网站标识不存在，请重新输入"));
        } else {
          if (this.form.orderType == 1) {
            // 网站监测
            this.form.orderName = res.data.info.siteName + "网站监测订单";
          } else if (this.form.orderType == 20) {
            // 新媒体
            this.form.orderName = res.data.info.siteName + "新媒体订单";
          } else if (this.form.orderType == 30) {
            // 网站安全监测
            this.form.orderName = res.data.info.siteName + "网站安全监测订单";
          }
          callback();
        }
      });
    },
    loadNode(node, resolve) {
      console.log(node, "node");
      console.log(resolve, "resolve");
      if (node.level === 0) {
        return resolve(this.inspSiteTreeList);
      }

      setTimeout(() => {
        let data = [];
        console.log(node.data.siteCode, "node.data.sitCode");
        let date = { parentSite: node.data.siteCode };
        listInspSiteTree(date).then((response) => {
          let data = [];
          data = response.data;
          for (var i in data) {
            data[i].label = data[i].unitName + "-" + data[i].siteCode;
          }
          resolve(data);
        });
      }, 1000);
    },
    handleEdit(row) {
      const param = {
        id: row.orderId,
        productType: row.productType,
      };
      getInspOrderFlowInfo(param).then((response) => {
        console.log(response, "---");
        this.productList = response.data?.crmOrderDetails || [];
      });
      // 从 detailInfo 获取可编辑字段的值
      const orderData = {
        ...this.detailInfo,
        ...row,
      };
      // 处理时间戳转换
      const formatTimestamp = (timestamp) => {
        if (!timestamp) {
          return "";
        }

        let date;
        if (typeof timestamp === "number") {
          date = new Date(timestamp);
        } else if (typeof timestamp === "string") {
          // 尝试将字符串转换为Date对象
          date = new Date(timestamp);
        } else {
          return "";
        }

        // 检查是否是有效的Date对象
        if (isNaN(date.getTime())) {
          return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      this.detailInfo = Object.assign({}, this.detailInfo, orderData);
      // 只保留可编辑的字段
      this.form = {
        id: orderData.orderId,
        productType: orderData.productType,
        siteCode: orderData.siteCode,
        orderName: orderData.orderName,
        reportCount: orderData.customItem180C,
        startTime: formatTimestamp(orderData.customItem177C),
        endTime: formatTimestamp(orderData.customItem178C),
        orderType: orderData.customItem181C,
        owner: orderData.ownerIdLabel,
        serviceType: orderData.serviceType
          ? [2, 4, 5].concat([orderData.serviceType])
          : [2, 4, 5],
        comment: orderData.remark,
        orderDetailsGroupId: orderData.id,
        rangeType: orderData.rangeType || 1,
        siteCodes: orderData.siteCodes || [],
      };
      
      // 弹窗打开时获取并回显订单名称
      if (this.form.siteCode) {
        let codeTypeIn = null;
        if (this.form.orderType == 1) {
          codeTypeIn = [0, 1];
        } else if (this.form.orderType == 20) {
          codeTypeIn = null;
        }
        let date = {
          siteCode: this.form.siteCode,
          siteType: null,
          codeTypeIn: codeTypeIn,
        };
        siteInfoExist(date).then((res) => {
          if (res.data.exist) {
            this.siteCodeType = true;
            if (this.form.orderType == 1) {
              // 网站监测
              this.form.orderName = res.data.info.siteName + "网站监测订单";
            } else if (this.form.orderType == 20) {
              // 新媒体
              this.form.orderName = res.data.info.siteName + "新媒体订单";
            } else if (this.form.orderType == 30) {
              // 网站安全监测
              this.form.orderName = res.data.info.siteName + "网站安全监测订单";
            }
          }
        });
      }
      
      this.open = true;
    },
    /** 查询人工录入问题列表 */
    getList() {
      this.loading = true;
      const param = {
        id: this.form.id || this.detailInfo.id,
        // productType: this.detailInfo.productType,
      };
      getInspOrderFlowInfo(param).then((response) => {
        this.detailInfo = response.data || {};
        this.tableDate = response.data?.crmOrderDetailsGroup || [];
        this.loading = false;
      });
    },

    // 站点范围变化
    rangeTypeChange(val) {
      console.log(val);
      if (val == 3) {
        this.getListzdS = true;
        this.getListzd(this.form.siteCode); // 站点范围
      } else {
        this.getListzdS = false;
        this.inspSiteTreeList = [];
      }
    },
    // 站点范围选择
    getListzd(parentSite) {
      // this.loading = true;
      let codeTypeIn = null;
      if (this.form.orderType == 1) {
        codeTypeIn = [0, 1];
      } else if (this.form.orderType == 20) {
        codeTypeIn = null;
      }
      let date = {
        parentSite: parentSite,
        codeTypeIn: codeTypeIn,
      };
      listInspSiteTree(date).then((response) => {
        this.inspSiteTreeList = response.data;
        // this.loading = false;
        for (var i in this.inspSiteTreeList) {
          this.inspSiteTreeList[i].label =
            this.inspSiteTreeList[i].unitName +
            "-" +
            this.inspSiteTreeList[i].siteCode;
        }
      });
    },




    // 返回上级
    goBack() {
      // this.$router.go(-1);
      let veiwArr = this.$store.state.tagsView.visitedViews;
      let path = this.$route.path;
      let view;
      for (let i = 0, len = veiwArr.length; i < len; i++) {
        if (veiwArr[i].path == path) {
          view = veiwArr[i];
        }
      }
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          const latestView = visitedViews.slice(-1)[0];
          // this.$router.replace({ path: '/clu/configure'});
          sessionStorage.removeItem("orderBatchInfo");
          this.$router.go(-1);
        });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.siteCodeType == false) {
        this.orderName = null;
        this.startDate = null;
        this.endDate = null;
        this.reportCount = 1;
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            receivedOrderFlow(this.form).then((response) => {
              this.$modal.msgSuccess("签收成功");
              this.open = false;
              this.getList();
            });
          }
        });
      }
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
        orderType: null,
        siteCode: null,
        orderName: null,
        customItem180C: null,
        customItem181C: null,
        startDate: null,
        endDate: null,
        formalState: null,
        ownerName: null,
        orderServeArry: [],

        serviceType: [2, 4, 5],
        remark: null,
      };
      this.siteCodeType = false;
      // 清除表单校验
      if (this.$refs.form) {
        this.$refs.form.resetFields();
        this.$refs.form.clearValidate();
      }
    },
    /** 服务类型变化 */
    handleProductTypeChange(value) {
      console.log("服务类型变化", value);
    },
    /** 开始时间选择 */
    pickerOptionsStart(val) {
      if (val && this.form.endDate) {
        if (val > this.form.endDate) {
          this.$message.warning("开始时间不能大于结束时间");
          this.form.startDate = null;
        }
      }
    },
    /** 结束时间选择 */
    pickerOptionsEnd(val) {
      if (val && this.form.startDate) {
        if (val < this.form.startDate) {
          this.$message.warning("结束时间不能小于开始时间");
          this.form.endDate = null;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.box {
  display: flex;
  flex-wrap: wrap;
}
.back {
  display: flex;
  // justify-content: right;
  // float: right;
  margin-bottom: 20px;
}
.sp {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info-row {
  margin: 15px 0;
}
.info-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}
.info-value {
  font-size: 14px;
  color: #303133;
  padding: 8px 12px;
  // background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 32px;
  line-height: 1.5;
}
.info-buttons {
  display: flex;
  gap: 10px;
  margin-top: 2px;
}
.form-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}
.info-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.info-grid .info-item {
  margin-bottom: 10px;
}
.info-grid .info-label {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  font-weight: 500;
}
.info-grid .info-value {
  font-size: 14px;
  color: #303133;
  padding: 6px 10px;
  background-color: #ffffff;
  border-radius: 4px;
  min-height: 28px;
  line-height: 1.5;
}
.product-section {
  margin-bottom: 20px;
}
.remark-section {
  margin-top: 10px;
}
.numnum {
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
/deep/.el-upload--picture-card {
  width: 92px;
  height: 92px;
  line-height: 92px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 92px;
  height: 92px;
}
/deep/.el-upload-list__item {
  margin-bottom: -14px !important;
}
/deep/.el-dialog__body {
  padding: 20px !important;
}
/deep/.el-dialog:not(.is-fullscreen) {
  margin-top: 3vh !important;
}
/deep/.el-dialog__body {
  max-height: 850px !important;
  overflow: auto;
}
</style>
