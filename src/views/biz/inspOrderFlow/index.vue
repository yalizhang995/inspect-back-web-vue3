<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="96px"
    >
      <el-form-item label="销售机会编号" prop="customItem252C">
        <el-input
          v-model="queryParams.customItem252C"
          placeholder="请输入销售机会编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="po">
        <el-input
          v-model="queryParams.po"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="opportunityIdLabel">
        <el-input
          v-model="queryParams.opportunityIdLabel"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售" prop="ownerIdLabel">
        <el-input
          v-model="queryParams.ownerIdLabel"
          placeholder="请输入销售"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="签收状态" prop="receivedStatus">
        <el-select
          v-model="queryParams.receivedStatus"
          placeholder="请选择签收状态"
        >
          <el-option label="已签收" value="1" />
          <el-option label="未签收" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="接收时间" prop="createTime">
        <el-date-picker
          style="width: 210px"
          v-model="queryParams.createTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item label="签收时间" prop="receivedTime">
        <el-date-picker
          style="width: 210px"
          v-model="queryParams.receivedTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item style="marginleft: 20px">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <p class="numnum">
      共<span style="color: #1890ff; margin: 0 3px">{{ total }}</span
      >条数据
    </p>
    <el-table height="60vh" v-loading="loading" :data="inspOrderFlowList">
      <el-table-column
        label="销售机会编号"
        prop="customItem252C"
        min-width="120"
      />
      <el-table-column
        show-overflow-tooltip
        label="订单编号"
        prop="po"
        align="center"
        show-overflow-tooltip
        min-width="160"
      />
      <el-table-column
        show-overflow-tooltip
        label="项目名称"
        align=""
        prop="opportunityIdLabel"
        min-width="260"
      />
      <el-table-column
        label="销售"
        prop="ownerIdLabel"
        show-overflow-tooltip
        min-width="160"
      />
      <el-table-column
        label="接收时间"
        align=""
        prop="createTime"
        min-width="160"
      />
      <el-table-column
        label="网站监测订单"
        prop="inspWebOrderId"
        align="center"
        min-width="100"
      />
      <el-table-column
        label="新媒体订单"
        prop="inspXmtOrderId"
        align="center"
        min-width="100"
      />
      <el-table-column
        label="网站安全监测订单"
        prop="inspWebSecurityOrderId"
        align="center"
        min-width="160"
      />
      <el-table-column
        label="签收状态"
        prop="receivedStatus"
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <span
            :style="
              scope.row.receivedStatus === 1
                ? 'color: #67C23A;'
                : 'color: #E6A23C;'
            "
            >{{ scope.row.receivedStatus === 1 ? "已签收" : "未签收" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="签收时间"
        align=""
        prop="receivedTime"
        min-width="200"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="160"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleSee(scope.row)"
            v-hasPermi="['biz:inspOrderInfo:edit']"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.receivedStatus == 0"
            size="mini"
            type="text"
            @click="handleSee(scope.row)"
            v-hasPermi="['biz:inspOrderInfo:edit']"
            >签收</el-button
          >
          <el-button
            v-else
            disabled
            size="mini"
            type="text"
            v-hasPermi="['biz:inspOrderInfo:edit']"
            >已签收</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pgNum"
      :limit.sync="queryParams.pgSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listInspOrderFlow } from "@/api/biz/inspOrderFlow";
export default {
  name: "InspOrderInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单信息表格数据
      inspOrderFlowList: [],
      // 查询参数
      queryParams: {
        pgNum: 1,
        pgSize: 10,
        customItem252C: null,
        po: null,
        opportunityIdLabel: null,
        ownerIdLabel: null,
        receivedStatus: null,
        receivedTime: null,
        createTime: null,
      },
    };
  },

  created() {
    this.getList();
  },
  methods: {
    /** 查询订单流转列表 */
    getList() {
      this.loading = true;
      const params = {
        customItem252C: this.queryParams.customItem252C,
        opportunityIdLabel: this.queryParams.opportunityIdLabel,
        ownerIdLabel: this.queryParams.ownerIdLabel,
        po: this.queryParams.po,
        receivedStatus: this.queryParams.receivedStatus,
        startCreateTime: this.queryParams.createTime
          ? this.queryParams.createTime[0]
          : null,
        endCreateTime: this.queryParams.createTime
          ? this.queryParams.createTime[1]
          : null,
        startReceivedTime: this.queryParams.receivedTime
          ? this.queryParams.receivedTime[0]
          : null,
        endReceivedTime: this.queryParams.receivedTime
          ? this.queryParams.receivedTime[1]
          : null,
      };
      listInspOrderFlow(params).then((response) => {
        this.inspOrderFlowList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    // 查看
    handleSee(row) {
      sessionStorage.setItem("orderFlowInfo", row.id);
      this.$router.push({ name: "orderFlowInfo" });
    },
  },
};
</script>
<style lang="scss">
.box {
  display: flex;
  flex-wrap: wrap;
}
.numnum {
  display: block;
  font-size: 13px;
  margin: 15px 0 5px 0;
}

// 自定义站点
.divLeft {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .treeDiv {
    flex: 1;
    overflow: auto;
    -ms-overflow-style: none; /* IE 和 Edge */
    scrollbar-width: none; /* Firefox */
  }
}
.tit {
  color: red;
  font-size: 11px;
  margin-left: -5px;
}
.divBox,
.pcBox {
  width: 100%;
  height: 61vh;
  display: flex;
  // justify-content: space-between;
}
.divLeft {
  width: 300px;
  padding-right: 10px;
  border-right: 1px solid #c0c4cc;
}
.divCen {
  border-right: 1px solid #c0c4cc;
  width: 350px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pcCen {
  width: 470px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #c0c4cc;
  padding: 0 10px;
}
.pcRight {
  width: 450px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pcTable {
  flex: 1;
  overflow: auto;
  margin-bottom: 8px;
}
.divRight {
  width: 350px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.divRightT {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.divRightTC {
  flex: 1;
  overflow: auto;
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
  .jgLi {
    line-height: 32px;
    border-bottom: 1px solid #c0c4cc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .jgLiL {
      width: 90%;
      white-space: nowrap; /* 禁止换行 */
      overflow: hidden; /* 隐藏溢出内容 */
      text-overflow: ellipsis; /* 显示省略号 */
      display: flex;
      align-items: center;
      img {
        width: 20px;
        margin-right: 5px;
        border-radius: 100%;
      }
    }
  }
}
.dxBox {
  display: flex;
  justify-content: space-between;
  .spsp1 {
    flex: 1;
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 显示省略号 */
    margin-right: 10px;
  }
}
.divCenC {
  flex: 1;
  overflow: auto;
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
  margin: 10px 0;
  overflow-x: hidden;
}
.divCenCT {
  display: flex;
  justify-content: right;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  // margin-right: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .label {
    flex: 1;
    margin-right: 10px;
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 显示省略号 */
  }
}
.qxBox {
  display: flex;
  align-items: center;
  .qxBoxK {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #ffffff;
    z-index: 1;
    position: relative;
    top: 0;
    left: -5px;
    font-size: 12px;
  }
}
.dxxzClass {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>
<style scoped>
/deep/.el-dialog {
  max-height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
/deep/.el-dialog__body {
  flex: 1;
  overflow: auto;
}
/* 自定义站点 */
/deep/.zdyBox .el-dialog__body {
  overflow: hidden !important;
}
/deep/.divCenC .el-checkbox {
  margin-left: 0 !important;
  margin-top: 5px !important;
}
/deep/.divCenC .el-checkbox__label {
  width: 95% !important;
}
/deep/.el-tree-node {
  overflow: hidden !important;
}

/deep/.divCenC .el-empty {
  margin-top: 35% !important;
}
/deep/.divRightTC .el-empty {
  margin-top: 45.9% !important;
}

/deep/.pagination-container {
  padding: 0 !important;
}
/deep/.el-pagination {
  display: flex;
  justify-content: right;
}
</style>
