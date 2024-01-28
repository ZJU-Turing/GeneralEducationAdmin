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

function timeString() {
    let now = new Date();

    let Y = now.getFullYear();
    let M = ("0" + (now.getMonth() + 1)).slice(-2);
    let D = ("0" + now.getDate()).slice(-2);
    let h = ("0" + now.getHours()).slice(-2);
    let m = ("0" + now.getMinutes()).slice(-2);
    let s = ("0" + now.getSeconds()).slice(-2);

    return `${Y}${M}${D}_${h}${m}${s}`;
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

const util = {
    getTypes,
    getCategories,
    getCourses,
    filter,
    parseCourses,
    timeString,
    download,
};

export default util;
