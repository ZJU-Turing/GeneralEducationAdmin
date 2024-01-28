<script setup>
import { onMounted, ref, watch } from "vue";

import lc from "@/assets/js/leancloud";
import util from "@/assets/js/util";
import RemarkComp from "@/components/RemarkComp.vue";
import WriteComp from "@/components/WriteComp.vue";

const courses = ref([]);
const path = ref([]);
const remarks = ref([]);
const loading = ref(false);

const nowYear = new Date().getFullYear();

const fetchCourses = async () => {
    loading.value = true;
    let rc = await lc.getAllCourses();
    courses.value = util.parseCourses(rc);
    loading.value = false;
};

const updateRemarks = async () => {
    loading.value = true;
    let rr = await lc.searchRemarks("course", path.value[2]);
    rr.sort((a, b) => b.grade - a.grade);
    remarks.value = rr;
    loading.value = false;
};

const cced = (name) => {
    const fn = (x) => (c) => c.value == path.value[x];
    const arr = courses.value.find(fn(0)).children.find(fn(1)).children;
    const last = arr.pop();

    arr.push({ value: name, label: name });
    arr.push(last);

    path.value[2] = name;
};

watch(path, async () => {
    if (path.value[2] == "create") {
        remarks.value = [];
    } else {
        await updateRemarks();
    }
});

onMounted(async () => {
    await fetchCourses();
    let lv1 = courses.value[0].value;
    let lv2 = courses.value[0].children[0].value;
    let lv3 = courses.value[0].children[0].children[0].value;
    path.value = [lv1, lv2, lv3];
});
</script>

<template>
    <div class="main">
        <div class="title">通识课程经验管理</div>
        <div class="subtitle">浙江大学图灵班</div>

        <el-cascader-panel class="panel" v-model="path" :options="courses" />
        <WriteComp class="write" v-if="path" @refresh="updateRemarks" @course-created="cced" :path="path" />
        <div v-loading="loading">
            <RemarkComp class="remark" v-for="r in remarks" :key="r.objectId" :data="r" />
        </div>

        <div class="copyright">Developed by <a href="https://xecades.xyz/">Xecades</a> &copy; {{ nowYear }} · <RouterLink
                to="/admin">Admin</RouterLink>
        </div>
    </div>
</template>

<style scoped>
.main {
    margin: 0 auto;
    max-width: 1200px;
    padding: 0 10px;
}

.title {
    color: #606266;
    font-size: 2.2rem;
    text-align: center;
    margin-top: 4rem;
    margin-bottom: .5rem;
}

.subtitle {
    color: #909399;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 3rem;
}

.panel {
    overflow-x: scroll;
    margin-bottom: 2rem;
}

.write,
.remark {
    margin-bottom: 1rem;
}

.copyright {
    font-size: 1rem;
    text-align: center;
    color: #A8ABB2;
    margin-top: 3rem;
    margin-bottom: 2.5rem;
}

.copyright a {
    text-decoration: none;
    color: #739bc4;
}
</style>
