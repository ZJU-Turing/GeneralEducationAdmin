import AV from "leancloud-storage";

async function getAllData(type, limit = 1000) {
    let query = new AV.Query(type);
    query.limit(limit);
    let results = await query.find();
    return results.map((c) => c.toJSON());
}

async function checkExistence(type, key, value) {
    let query = new AV.Query(type);
    query.equalTo(key, value);
    query.limit(1);
    let results = await query.find();
    return results.length > 0;
}

async function removeItem(type, id) {
    let item = AV.Object.createWithoutData(type, id);
    await item.destroy();
}

async function updateItem(type, id, data) {
    let item = AV.Object.createWithoutData(type, id);
    for (let key in data) item.set(key, data[key]);
    await item.save();
}

async function createItem(type, data) {
    let Item = new AV.Object.extend(type);
    let item = new Item();
    for (let key in data) item.set(key, data[key]);
    await item.save();
}

async function searchData(type, key, value, limit = 1000) {
    let query = new AV.Query(type);
    query.equalTo(key, value);
    query.limit(limit);
    let results = await query.find();
    return results.map((c) => c.toJSON());
}

function init() {
    let env = import.meta.env ?? process.env;
    AV.init({
        appId: env.VITE_APP_ID,
        appKey: env.VITE_APP_KEY,
        serverURL: env.VITE_SERVER_URL,
    });
}

function createCourseRaw(data) {
    let Course = AV.Object.extend("Course");
    let course = new Course();
    course.set("name", data.name);
    course.set("type", data.type);
    course.set("category", data.category);
    course.set("isArt", data.isArt);
    course.set("isLabor", data.isLabor);
    course.set("code", data.code);
    return course;
}

async function createCourse(data) {
    let course = createCourseRaw(data);
    await course.save();
}

async function clearAllCourses() {
    let results;
    let query = new AV.Query("Course");
    query.limit(1000);
    results = await query.find();
    await AV.Object.destroyAll(results);
}

function createRemarkRaw(data) {
    let Remark = AV.Object.extend("Remark");
    let remark = new Remark();
    remark.set("name", data.name);
    remark.set("course", data.course);
    remark.set("comment", data.comment);
    remark.set("score", data.score);
    remark.set("grade", data.grade);
    return remark;
}

async function createRemark(data) {
    let remark = createRemarkRaw(data);
    await remark.save();
}

async function clearAllRemarks() {
    let results;
    let query = new AV.Query("Remark");
    query.limit(1000);
    results = await query.find();
    await AV.Object.destroyAll(results);
}

const getAllCourses = () => getAllData("Course");
const getAllRemarks = () => getAllData("Remark");
const searchCourses = (key, value) => searchData("Course", key, value);
const searchRemarks = (key, value) => searchData("Remark", key, value);
const removeCourse = (id) => removeItem("Course", id);
const removeRemark = (id) => removeItem("Remark", id);
const checkPassword = (p, type) => checkExistence(type, "value", p);

const lc = {
    AV,
    init,
    createCourseRaw,
    createCourse,
    removeCourse,
    clearAllCourses,
    getAllCourses,
    searchCourses,
    createRemarkRaw,
    createRemark,
    removeRemark,
    clearAllRemarks,
    getAllRemarks,
    searchRemarks,
    getAllData,
    removeItem,
    updateItem,
    createItem,
    checkPassword,
};

export default lc;
