<script setup>
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";

import lc from "@/assets/js/leancloud";
import router from "@/router";

const $ = defineProps({
    field: String,
    placeholder: String,
    goBack: Boolean,
});

const password = ref("");
const logined = ref(false);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    let local = localStorage.getItem($.field);
    if (local && await lc.checkPassword(local, $.field))
        logined.value = true;
    loading.value = false;
});

async function login() {
    loading.value = true;
    let result = await lc.checkPassword(password.value, $.field);
    if (result) {
        localStorage.setItem($.field, password.value);
        logined.value = true;
    } else {
        ElMessage.error("密码错误");
    }
    loading.value = false;
}
</script>

<template>
    <div class="wrapper" v-if="!logined" v-loading.fullscreen.lock="loading">
        <div class="title">通识课程评价系统</div>
        <div class="subtitle">浙江大学图灵班</div>

        <el-input v-model="password" @keyup.enter="login" :placeholder="placeholder" type="password" show-password>
            <template #prepend v-if="goBack">
                <el-button @click="router.push('/')" :icon="ArrowLeftBold" />
            </template>
            <template #append>
                <el-button @click="login">登录</el-button>
            </template>
        </el-input>
    </div>
    <div v-else>
        <slot />
    </div>
</template>

<style scoped>
.title {
    color: #606266;
    font-size: 2.2rem;
    text-align: center;
    margin-bottom: .5rem;
}

.subtitle {
    color: #909399;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 3rem;
}

.wrapper {
    margin-top: 50%;
    padding: 0 1rem;
    transform: translateY(-50%);
}

@media screen and (min-width: 768px) {
    .wrapper {
        padding: 0 6rem;
    }
}
</style>
