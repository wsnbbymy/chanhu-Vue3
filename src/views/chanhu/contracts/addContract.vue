<template>
    <el-menu class="el-menu-vertical" @open="handleOpen" @close="handleClose" unique-opened>
        <el-sub-menu index="1">
            <template #title>
                Navigator One
            </template>
            <el-menu-item index="1-1">item 1</el-menu-item>
            <el-menu-item index="1-2">item 2</el-menu-item>
            <el-menu-item index="1-3">item 3</el-menu-item>
            <el-menu-item index="1-4">item 4</el-menu-item>
            <el-sub-menu index="1-5">
                <template #title>
                    Navigator 1-5
                </template>
                <el-menu-item index="1-5-1">item 1</el-menu-item>
                <el-menu-item index="1-5-2">item 2</el-menu-item>
                <el-menu-item index="1-5-3">item 3</el-menu-item>
                <el-menu-item index="1-5-4">item 4</el-menu-item>
            </el-sub-menu>
        </el-sub-menu>
        <el-sub-menu index="2">
            <template #title>
                Navigator Two
            </template>
            <el-menu-item index="2-1">item 1</el-menu-item>
            <el-menu-item index="2-2">item 2</el-menu-item>
            <el-menu-item index="2-3">item 3</el-menu-item>
            <el-menu-item index="2-4">item 4</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>
                Navigator Two
            </template>
            <el-menu-item index="3-1">item 1</el-menu-item>
            <el-menu-item index="3-2">item 2</el-menu-item>
            <el-menu-item index="3-3">item 3</el-menu-item>
            <el-menu-item index="3-4">item 4</el-menu-item>
        </el-sub-menu>

    </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>