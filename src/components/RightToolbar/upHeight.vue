<template>
    <div class="top-right-btn" :style="style">
            <el-tooltip class="item" effect="dark" content="缩放" placement="top">
                <!-- <el-button size="mini" circle icon="el-icon-s-grid" @click="amplify()" /> -->
                <el-button size="mini" circle  @click="amplify()"><svg-icon icon-class="sxsx" /></el-button>
                <!-- <svg-icon class-name="size-icon" icon-class="size" /> -->
                <!-- <size-select id="size-select" class="right-menu-item hover-effect" /> -->
            </el-tooltip>
        </el-row>
        <el-dialog :title="title" :visible.sync="open" append-to-body>
            <el-transfer
                :titles="['显示', '隐藏']"
                v-model="value"
                :data="columns"
                @change="dataChange"
            ></el-transfer>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "RightToolbar",
    data() {
        return {
            // 显隐数据
            value: [],
            // 弹出层标题
            title: "显示/隐藏",
            // 是否显示弹出层
            open: false
        };
    },
    props: {
        /* 是否显示检索条件 */
        showSearch: {
            type: Boolean,
            default: true
        },
        /* 显隐列信息 */
        columns: {
            type: Array
        },
        /* 是否显示检索图标 */
        search: {
            type: Boolean,
            default: true
        },
        /* 显隐列类型（transfer穿梭框、checkbox复选框） */
        showColumnsType: {
            type: String,
            default: "checkbox"
        },
        /* 右外边距 */
        gutter: {
            type: Number,
            default: 10
        },

        /* 是否显示检索条件 */
        showUpHeight: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        style() {
            const ret = {};
            if (this.gutter) {
                ret.marginRight = `${this.gutter / 2}px`;
            }
            return ret;
        }
    },
    created() {
        if (this.showColumnsType == "transfer") {
            // 显隐列初始默认隐藏列
            for (let item in this.columns) {
                if (this.columns[item].visible === false) {
                    this.value.push(parseInt(item));
                }
            }
        }
    },
    methods: {
        // 搜索
        toggleSearch() {
            this.$emit("update:showSearch", !this.showSearch);
        },
        // 刷新
        refresh() {
            this.$emit("queryTable");
        },
        // 右侧列表元素变化
        dataChange(data) {
            for (let item in this.columns) {
                const key = this.columns[item].key;
                this.columns[item].visible = !data.includes(key);
            }
        },
        // 打开显隐列dialog
        showColumn() {
            this.open = true;
        },
        // 勾选
        checkboxChange(event, label) {
            this.columns.filter(item => item.label == label)[0].visible = event;
        },
        // 放大
        amplify(){
            this.$emit("upHeightOld");
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
    border-radius: 50%;
    padding: 12px;
    display: block;
    margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
    margin-bottom: 10px;
}
</style>
