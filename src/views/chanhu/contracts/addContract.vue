<template>
    <el-row>
        <el-col :span="4">
            <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect" unique-opened>
                <template v-for="item in menuItems" :key="item.id">
                    <!-- 一级菜单 -->
                    <el-sub-menu v-if="item.children.length" :index="item.menuIndex">
                        <template #title>
                            <el-icon>
                                <Close />
                            </el-icon>
                            {{ item.label }}
                        </template>
                        <!-- 二级菜单 -->
                        <template v-for="child in item.children" :key="child.id">
                            <el-sub-menu v-if="child.children.length" :index="child.menuIndex">
                                <template #title><el-icon>
                                        <Close />
                                    </el-icon>{{ child.label }}</template>
                                <!-- 三级菜单 -->
                                <template v-for="grandChild in child.children" :key="grandChild.id">
                                    <el-menu-item :index="grandChild.menuIndex">
                                        <el-icon>
                                            <Close />
                                        </el-icon>
                                        {{ grandChild.label }}
                                    </el-menu-item>
                                </template>
                            </el-sub-menu>
                            <el-menu-item v-else :index="child.menuIndex">
                                <el-icon>
                                    <Close />
                                </el-icon>
                                {{ child.label }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                    <el-menu-item v-else :index="item.menuIndex">
                        <el-icon>
                            <Close />
                        </el-icon>
                        {{ item.label }}
                    </el-menu-item>
                </template>
            </el-menu>
        </el-col>
        <el-col :span="20">
            {{ data }}
        </el-col>
    </el-row>


</template>

<script setup>
import { ref } from 'vue';
import { getContractsMenu } from '@/api/chanhu/contracts_nemu';

import { Close } from '@element-plus/icons-vue'

// 多级菜单数据
// const menuItems = ref([
//     { index: '1', label: '首页' },
//     {
//         index: '2',
//         label: '产品',
//         children: [
//             { index: '2-1', label: '产品1' },
//             { index: '2-2', label: '产品2' },
//             { index: '2-3', label: '产品3' }
//         ]
//     },
//     {
//         index: '3',
//         label: '服务',
//         children: [
//             { index: '3-1', label: '服务1' },
//             { index: '3-2', label: '服务2' }
//         ]
//     },
//     { index: '4', label: '关于我们' }
// ]);
const menuItems = ref([]);

// 当前激活的菜单项
const activeIndex = ref('1');

const data = ref("")
// 菜单项点击事件处理
const handleSelect = (index) => {
    console.log('Selected item:', index);
    // 这里可以添加跳转逻辑或其他操作
    data.value = index;
};

function getMenu() {
    getContractsMenu().then(response => {
        console.log(response);
        menuItems.value = response;
    });
}

getMenu();
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>