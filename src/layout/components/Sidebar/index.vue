<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true"
                :active-text-color="settings.theme"
                :collapse-transition="false"
                mode="vertical"
                class="leftNav"
            >
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
<style lang="scss">
.has-logo{
    display: flex;
    flex-direction: column;
}
.leftNav{
    flex: 1;
    overflow: auto;
    padding: 0 10px!important;
}
.sidebar-logo-container {
    background: #ffffff !important;
}
.sidebar-title {
    // color: #1890ff !important;
    font-size: 18px!important;
}
</style>
<style lang="scss">
.has-logo .el-menu-item{
    height: 44px!important;
    line-height: 44px!important;
    margin: 3px 0;
}
.has-logo .el-menu-item.is-active {
    border-radius: 10px;
    background:#e3f2fe!important;
}
.sidebar-container .el-submenu .el-menu-item {
    width: 175px!important;
}
.el-submenu__title{
    height: 50px!important;
    line-height: 50px!important;
    // padding-left: 30px!important;
}

</style>