<script setup>
import markdownit from "markdown-it";
import { onMounted, ref } from "vue";

const $ = defineProps({ data: Object });
const md = markdownit({ html: true });

const parsed = ref("");

const copyRef = () => {
    navigator.clipboard.writeText(`https://tsk.xecades.xyz/#${$.data.objectId}`);
    location.hash = `#${$.data.objectId}`;
};

onMounted(() => {
    parsed.value = md.render($.data.comment);
});
</script>

<template>
    <el-card shadow="hover" :id="data.objectId">
        <template #header>
            <el-text size="large" type="info" class="info">
                <el-text size="large" type="primary" style="cursor: pointer;" @click="copyRef">
                    {{ data.score }} 分
                </el-text>
                · {{ data.name || "匿名" }} · {{ data.grade }} · {{ data.course }}
            </el-text>
        </template>
        <div v-html="parsed" class="content md"></div>
    </el-card>
</template>

<style scoped>
.info {
    padding: 0 .5rem;
}

.content {
    color: #6f7175;
    font-size: .95rem;
    line-height: 1.7rem;
}

@media screen and (min-width: 768px) {
    .content {
        padding: 0 1rem;
    }
}
</style>
