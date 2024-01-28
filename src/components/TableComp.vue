<script setup>
import { onMounted, reactive, ref } from "vue";
import { ArrowLeft, Delete, Refresh, Download, Plus } from "@element-plus/icons-vue";

import lc from "@/assets/js/leancloud";
import router from "@/router";
import util from "@/assets/js/util";

const $ = defineProps({ config: Object, height: String });

const pageSizes = [20, 50, 100, 200];

let rawData = [];

const tableLoading = ref(false);
const dialogLoading = ref(false);
const allData = reactive([]);
const data = reactive([]);
const currentPage = ref(1);
const pageSize = ref(50);
const searchField = ref("all");
const search = ref("");
const selection = reactive([]);
const dialogId = ref("");
const dialogForm = reactive({});
const dialogVisibility = ref(false);

const fetchData = async () => {
    rawData = (await lc.getAllData($.config.className)).reverse();
};

const syncData = () => {
    while (data.pop());
    let start = (currentPage.value - 1) * pageSize.value;
    let end = start + pageSize.value;
    for (let i = start; i < end && allData.at(i); i++)
        data.push(allData.at(i));
};

const handleSearch = () => {
    let field = searchField.value;
    let keyword = search.value;

    while (allData.pop());
    for (let i = 0; i < rawData.length; i++) {
        let item = rawData[i];
        if (field == "all") {
            for (let j = 0; j < $.config.columns.length; j++) {
                let col = $.config.columns[j];
                if (item[col.value]?.toString().includes(keyword)) {
                    allData.push(item);
                    break;
                }
            }
        }
        else if (item[field].toString().includes(keyword)) {
            allData.push(item);
        }
    }
    syncData();
};

const refresh = async () => {
    tableLoading.value = true;
    await fetchData();
    handleSearch();
    tableLoading.value = false;
};

const handleSelectionChange = (v) => {
    while (selection.pop());
    for (let i = 0; i < v.length; i++)
        selection.push(v[i]);
};

const deleteSelection = async () => {
    tableLoading.value = true;
    try {
        for (let i = 0; i < selection.length; i++) {
            await lc.removeItem($.config.className, selection[i].objectId);
            rawData.splice(rawData.indexOf(selection[i]), 1);
        }
        await fetchData();
        handleSearch();
        ElMessage.success("删除成功");
    } catch (e) {
        ElMessage.error("删除失败 " + e);
    }
    tableLoading.value = false;
};

const purify = (v) => {
    let ret = {};
    for (let i = 0; i < $.config.columns.length; i++) {
        let col = $.config.columns[i];
        switch (col.type) {
            case Number: ret[col.value] = +v[col.value]; break;
            case Boolean: ret[col.value] = v[col.value] == "true"; break;
            default: ret[col.value] = v[col.value]; break;
        }
    }
    return ret;
}

const exportAll = async () => {
    try {
        let raw = rawData.map(purify);
        let fileName = `${$.config.className}_${util.timeString()}.csv`;
        util.download(raw, fileName);
        ElMessage.success("导出成功");
    } catch (e) {
        ElMessage.error("导出失败 " + e);
    }
};

const fillForm = (data) => {
    for (let i = 0; i < $.config.columns.length; i++) {
        let col = $.config.columns[i];
        dialogForm[col.value] = data[col.value].toString();
    }
    dialogId.value = data.objectId;
    dialogVisibility.value = true;
};

const submitForm = async () => {
    dialogLoading.value = true;
    if (dialogId.value) {
        await lc.updateItem($.config.className, dialogId.value, purify(dialogForm));
    } else {
        await lc.createItem($.config.className, purify(dialogForm));
    }
    dialogVisibility.value = false;
    dialogLoading.value = false;

    tableLoading.value = true;
    await fetchData();
    handleSearch();
    tableLoading.value = false;
};

const create = () => {
    dialogId.value = "";
    for (let i = 0; i < $.config.columns.length; i++) {
        let col = $.config.columns[i];
        dialogForm[col.value] = "";
    }
    dialogVisibility.value = true;
};

onMounted(async () => {
    tableLoading.value = true;
    await fetchData();
    handleSearch();
    tableLoading.value = false;
});
</script>

<template>
    <div>
        <el-dialog v-model="dialogVisibility" :title="dialogId ? `编辑条目 :: ${dialogId}` : '新建条目'" draggable align-center
            width="800px">
            <el-form v-loading="dialogLoading" :model="dialogForm" label-width="90px">
                <el-form-item v-for="c in config.columns" :label="c.value" :key="c.value">
                    <el-input type="textarea" :autosize="{ maxRows: 10 }" v-model="dialogForm[c.value]" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibility = false">取消</el-button>
                    <el-button :disabled="dialogLoading" type="primary" @click="submitForm">上传</el-button>
                </span>
            </template>
        </el-dialog>
        <div>
            <el-button plain @click="router.push('/')" :icon="ArrowLeft"></el-button>
            <el-popconfirm title="是否确认删除?" @confirm="deleteSelection">
                <template #reference>
                    <el-button plain :disabled="!selection.length" type="danger" :icon="Delete">
                        删除 <template v-if="selection.length">{{ selection.length }} 项</template>
                    </el-button>
                </template>
            </el-popconfirm>
            <el-button plain @click="refresh" type="primary" :icon="Refresh">刷新</el-button>
            <el-button plain @click="create" type="primary" :icon="Plus">添加</el-button>
            <el-button plain @click="exportAll" type="primary" :icon="Download">全部导出</el-button>
            <el-input class="search" @input="handleSearch" v-model="search" placeholder="搜索字段" align="right" clearable>
                <template #append>
                    <el-select @change="handleSearch" v-model="searchField" placeholder="搜索区域" style="width: 110px">
                        <el-option label="全部" value="all" />
                        <el-option v-for="c in config.columns" :label="c.value" :value="c.value" />
                    </el-select>
                </template>
            </el-input>
        </div>
        <el-table class="table" v-loading="tableLoading" :data="data" table-layout="auto" :height="height"
            @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column v-for="c in config.columns" :width="c.width" :min-width="c.minWidth" :prop="c.value"
                :label="c.value" />
            <el-table-column fixed="right" align="right">
                <template #default="scope">
                    <el-button @click="fillForm(scope.row)" size="small">Edit</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizes" background
            layout="total, sizes, prev, pager, next" :total="allData.length" @current-change="syncData"
            @size-change="syncData" />
    </div>
</template>

<style scoped>
.table {
    margin-top: .5rem;
    margin-bottom: 1rem;
}

.search {
    width: 300px;
    float: right;
}
</style>
