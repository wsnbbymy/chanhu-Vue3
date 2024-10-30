<template>
    <el-row>
        <el-col :span="4">
            <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect" unique-opened>
                <template v-for="item in menuItems" :key="item.id">
                    <!-- 一级菜单 -->
                    <el-sub-menu :index="item.menuIndex">
                        <template #title>
                            <el-icon>
                                <Close />
                            </el-icon>
                            {{ item.label }}
                        </template>
                        <!-- 二级菜单 -->
                        <template v-for="child in item.children" :key="child.id">
                            <el-menu-item :index="child.menuIndex">
                                <el-icon>
                                    <Close />
                                </el-icon>
                                {{ child.label }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
            </el-menu>
        </el-col>
        <el-col :span="20">
            <el-collapse @change="handleChange">
                <el-collapse-item v-for="item in data">
                    <template #title>
                        <b>{{ item }}</b>
                    </template>
                    <el-card>
                        <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
                        <template #footer>
                            <el-button type="primary">保存</el-button>
                            <el-button>取消</el-button>
                        </template>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </el-col>
    </el-row>


</template>

<script setup>
import { ref } from 'vue';
import { getContractsMenu } from '@/api/chanhu/contracts_nemu';

import { Close } from '@element-plus/icons-vue'

const menuItems = ref([]);

// 当前激活的菜单项
const activeIndex = ref('1');

const data = ref("")
// 菜单项点击事件处理
const handleSelect = (index) => {
    console.log('Selected item:', index);
    data.value = getChildrenLabels(menuItems.value, index);
};
/**
 * 根据菜单索引获取子菜单标签
 * @param menuItems 
 * @param menuIndex 
 */
function getChildrenLabels(menuItems, menuIndex) {
    for (const item of menuItems) {
        if (item.menuIndex === menuIndex) {
            return item.children.map(child => child.label);
        }
        if (item.children.length > 0) {
            const childLabels = getChildrenLabels(item.children, menuIndex);
            if (childLabels) {
                return childLabels;
            }
        }
    }
    return null;
}

const handleChange = (val) => {
    console.log(val)
}

function getMenu() {
    getContractsMenu().then(response => {
        menuItems.value = response;
    });
}

getMenu();
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
.el-collapse {
    margin: 20px;
}
</style>