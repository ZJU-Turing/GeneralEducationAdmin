<script setup>
import lc from "@/assets/js/leancloud";
import { ElMessage } from "element-plus";
import { computed, reactive, ref } from "vue";

const $ = defineProps({ path: Array });
const emit = defineEmits(["refresh", "courseCreated"]);

const uploading = ref(false);
const nowYear = new Date().getFullYear();
const formRef = ref();
const form = reactive({
    newc: "",
    type: [],
    score: undefined,
    grade: undefined,
    name: "",
    comment: "",
});

const course = computed(() => $.path[2]);
const isCreate = computed(() => course.value == "create");

const scoreValidator = (_, v, callback) => {
    if (!v) return callback();
    if (!/^-?\d+\.?\d*$/.test(v)) return callback("评分必须为数字");
    if (v < 0 || v > 10) return callback("评分必须在 0 到 10 之间");
    if (!/^\d*\.?\d{0,2}$/.test(v)) return callback("评分最多保留两位小数");
    return callback();
};

const gradeValidator = (_, v, callback) => {
    if (!v) return callback();
    if (!/^\d+$/.test(v)) return callback("年级必须为正整数");
    if (v < 2019 || v > nowYear) return callback(`年级必须在 2019 到 ${nowYear} 之间`);
    return callback();
};

const rules = {
    newc: [{ required: true, message: "请输入课程名" }],
    score: [
        { required: true, message: "请输入评分" },
        { validator: scoreValidator, trigger: "change" },
    ],
    grade: [
        { required: true, message: "请输入年级" },
        { validator: gradeValidator, trigger: "change" }
    ],
    name: [],
    comment: [
        { required: true, message: "请输入评价" }
    ],
};

const uploadCourse = async () => {
    await lc.createCourse({
        name: form.newc,
        type: $.path[0],
        category: $.path[1],
        isArt: form.type.includes("美育认定"),
        isLabor: form.type.includes("劳育认定"),
    });
};

const uploadRemark = async () => {
    await lc.createRemark({
        score: +form.score,
        grade: +form.grade,
        name: form.name,
        comment: form.comment,
        course: isCreate.value ? form.newc : course.value,
    });
};

const submit = async (fRef) => {
    await fRef.validate(async (valid) => {
        if (!valid) return;
        try {
            uploading.value = true;

            if (isCreate.value) await uploadCourse();
            await uploadRemark();

            ElMessage.success("提交成功");
            uploading.value = false;

            if (isCreate.value)
                emit("courseCreated", form.newc);
            emit("refresh");

            fRef.resetFields();
        } catch (e) {
            ElMessage.error("提交失败 " + e);
        }
    });
};
</script>

<template>
    <el-card shadow="hover">
        <template #header>
            <el-text v-if="!isCreate" size="large">为 <b>{{ course }}</b> 撰写评价</el-text>
            <el-text v-else size="large">为 <b>{{ path[0] }} > {{ path[1] }}</b> 添加新课程并撰写评价</el-text>
        </template>
        <el-form :disabled="uploading" :model="form" :rules="rules" ref="formRef" status-icon label-position="right"
            label-width="90px">
            <el-form-item label="课程名称" prop="newc" v-if="isCreate">
                <el-input v-model="form.newc" placeholder="课程名" type="text" />
            </el-form-item>

            <el-form-item label="认定类别" prop="type" v-if="isCreate">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox label="劳育认定" name="type" border />
                    <el-checkbox label="美育认定" name="type" border />
                </el-checkbox-group>
            </el-form-item>

            <el-divider v-if="isCreate" border-style="dashed" />

            <el-form-item label="课程评分" prop="score">
                <el-input v-model="form.score" placeholder="0 ~ 10" type="text" />
            </el-form-item>

            <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade" placeholder="2023" type="text" />
            </el-form-item>

            <el-form-item label="你的昵称" prop="name">
                <el-input v-model="form.name" placeholder="留空以匿名" type="text" />
            </el-form-item>

            <el-form-item label="课程评价" prop="comment">
                <el-input type="textarea" v-model="form.comment" placeholder="支持基础 Markdown 语法" auto-complete="off"
                    :autosize="{ minRows: 5 }" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit(formRef)">{{ uploading ? "上传中" : "提交" }}</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>