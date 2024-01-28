import Papa from "papaparse";

function _getKeys(key, cs) {
    let ret = new Set();
    for (let c of cs) ret.add(c[key]);
    return Array.from(ret);
}

function filter(key, value, cs) {
    return cs.filter((c) => c[key] == value);
}

const getTypes = (cs) => _getKeys("type", cs);
const getCategories = (cs) => _getKeys("category", cs);
const getCourses = (cs) => _getKeys("name", cs);

function parseCourses(cs) {
    let ret = [];
    let types = getTypes(cs);

    const createC = { value: "create", label: "[添加新课程]" };
    const otherC = {
        value: "其他课程",
        label: "其他课程",
        children: [createC],
    };

    for (let type of types) {
        let t = { value: type, label: type, children: [] };
        let typeFil = filter("type", type, cs);
        let categories = getCategories(typeFil);

        for (let category of categories) {
            let c = { value: category, label: category, children: [] };
            let cateFil = filter("category", category, typeFil);
            let courses = getCourses(cateFil);

            for (let course of courses)
                c.children.push({ value: course, label: course });

            c.children.push(createC);
            t.children.push(c);
        }
        ret.push(t);
    }

    let len = ret.length;
    ret[len - 1].children.push(otherC);
    return ret;
}

function download(data, fileName) {
    let csv = Papa.unparse(data);
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}

function purify(v, config) {
    let ret = {};
    for (let i = 0; i < config.length; i++) {
        let col = config[i];
        switch (col.type) {
            case Number:
                ret[col.value] = +v[col.value];
                break;
            case Boolean:
                ret[col.value] = v[col.value] == "true";
                break;
            default:
                ret[col.value] = v[col.value];
                break;
        }
    }
    return ret;
}

function generateNestedData(courses, remarks) {
    let ret = [];
    for (let i = 0; i < remarks.length; i++) {
        let remark = remarks[i];
        let course = courses.find((c) => c.name == remark.course);
        ret.push({
            年级: remark.grade,
            课程大类: course.type,
            具体分类: course.category,
            课程名称: course.name,
            劳育认定: course.isLabor ? "True" : "False",
            美育认定: course.isArt ? "True" : "False",
            姓名: remark.name,
            评分: remark.score,
            评价: remark.comment,
        });
    }
    return ret;
}

const util = {
    getTypes,
    getCategories,
    getCourses,
    filter,
    parseCourses,
    download,
    purify,
    generateNestedData,
};

export default util;
