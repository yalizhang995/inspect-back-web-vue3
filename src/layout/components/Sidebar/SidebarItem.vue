<template>
    <div v-if="!item.hidden">
        <template
            v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
        >
            <app-link
                v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path, onlyOneChild.query)"
            >
                <el-menu-item
                    :index="resolvePath(onlyOneChild.path)"
                    :class="{'submenu-title-noDropdown':!isNest}"
                    @click="handleMenuClick(item)"
                >
                    <item
                        :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                        :title="onlyOneChild.meta.title"
                    />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template slot="title">
                <item
                    v-if="item.meta"
                    :icon="item.meta && item.meta.icon"
                    :title="item.meta.title"
                />
            </template>
            <sidebar-item
                v-for="(child, index) in item.children"
                :key="child.path + index"
                :is-nest="true"
                :item="child"
                :base-path="resolvePath(child.path)"
                class="nest-menu"
            />
        </el-submenu>
    </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
    name: "SidebarItem",
    components: { Item, AppLink },
    mixins: [FixiOSBug],
    props: {
        // route object
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ""
        }
    },
    data() {
        this.onlyOneChild = null;
        return {};
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            if (!children) {
                children = [];
            }
            const showingChildren = children.filter(item => {
                if (item.hidden) {
                    return false;
                } else {
                    // Temp set(will be used if only has one showing child)
                    this.onlyOneChild = item;
                    return true;
                }
            });

            // When there is only one child router, the child router is displayed by default
            if (showingChildren.length === 1) {
                return true;
            }

            // Show parent if there are no child router to display
            if (showingChildren.length === 0) {
                this.onlyOneChild = {
                    ...parent,
                    path: "",
                    noShowingChildren: true
                };
                return true;
            }

            return false;
        },
        resolvePath(routePath, routeQuery) {
            if (isExternal(routePath)) {
                return routePath;
            }
            if (isExternal(this.basePath)) {
                return this.basePath;
            }
            if (routeQuery) {
                let query = JSON.parse(routeQuery);
                return {
                    path: path.resolve(this.basePath, routePath),
                    query: query
                };
            }
            return path.resolve(this.basePath, routePath);
        },
        handleMenuClick(item) {
            // 获取当前已打开的所有标签页
            const visitedViews = this.$store.state.tagsView.visitedViews;
            // 判断当前菜单对应的标签页是否已存在
            // 根据路由名称、标题
            const existingTab = visitedViews.find(view => {
                // 优先使用路由名称匹配（更准确）
                if (item.name && view.name === item.name) {
                    return true;
                }
                // 标题
                if(item.meta){
                    if (item.meta.title && view.meta.title === item.meta.title) {
                        return true;
                    }
                }
                
                return false;
            });
            
            const isTabOpen = !!existingTab; // 转换为布尔值
            
            console.log(`菜单 "${item.meta?.title || item.name}" 标签页状态:`, isTabOpen ? '✅ 已开启' : '❌ 未开启');
            if(isTabOpen == false){ // 未开启
                // 如果点击的是当前页面
                if (this.$route.name === item.name) {
                    // 强制刷新当前页：清除缓存后重定向
                    this.$store
                        .dispatch("tagsView/delCachedView", this.$route)
                        .then(() => {
                            const { fullPath } = this.$route;
                            console.log(fullPath,'fullPath')
                            this.$router.replace({
                                path: "/redirect" + fullPath
                            });
                        });
                } else {
                    // 如果不是当前页面，只清除目标页面的缓存，确保下次进入时刷新
                    this.$store.dispatch("tagsView/delCachedView", item);
                    // this.$router.push(item.path);
                }
            }
            
        }
    }
};
</script>
