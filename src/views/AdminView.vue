<script setup>
import LoginComp from "@/components/LoginComp.vue";
import TableComp from "@/components/TableComp.vue";
import { ref } from "vue";

const courseConfig = {
    columns: [
        { value: "name", type: String },
        { value: "type", type: String },
        { value: "category", type: String },
        { value: "isArt", type: Boolean },
        { value: "isLabor", type: Boolean },
    ],
    className: "Course",
}

const remarkConfig = {
    columns: [
        { value: "course", width: 160, type: String },
        { value: "score", width: 100, type: Number },
        { value: "comment", minWidth: 500, type: String },
        { value: "name", width: 100, type: String },
        { value: "grade", width: 100, type: Number },
    ],
    className: "Remark",
};

const tbHeight = ref("calc(100vh - 2 * 1.5rem - 39px - 2 * 15px - 2 * 32px - 1.5rem)");
const activePanel = ref("remark");
</script>

<template>
    <LoginComp>
        <el-tabs v-model="activePanel" class="panel" type="border-card">
            <el-tab-pane label="评价" name="remark">
                <TableComp :config="remarkConfig" :height="tbHeight" />
            </el-tab-pane>
            <el-tab-pane label="课程" name="course">
                <TableComp :config="courseConfig" :height="tbHeight" />
            </el-tab-pane>
        </el-tabs>
    </LoginComp>
</template>

<style scoped>
.panel {
    position: absolute;
    left: 1.7rem;
    top: 1.5rem;
    width: calc(100vw - 2 * 1.7rem);
    height: calc(100vh - 2 * 1.5rem);
    min-width: 900px;
}
</style>
