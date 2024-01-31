import fs from "fs/promises";
import { parse } from "csv-parse/sync";

const CSV_FILE = "./tools/data.csv";
const JSON_COURSES_FILE = "./tools/output/courses.json";
const JSON_REMARKS_FILE = "./tools/output/remarks.json";

let courses = [];
let remarks = [];
let records = [];

async function readCSV() {
    const data = await fs.readFile(CSV_FILE);
    const records = parse(data, { columns: true });
    return records;
}

function addCourse(rec) {
    let course = courses.find((c) => c.name === rec["课程名称"]);
    if (course) return;
    courses.push({
        name: rec["课程名称"],
        type: rec["课程大类"],
        category: rec["具体分类"],
        isArt: rec["美育认定"] === "True",
        isLabor: rec["劳育认定"] === "True",
    });
}

function addRemark(rec) {
    remarks.push({
        name: rec["姓名"],
        course: rec["课程名称"],
        comment: rec["评价"],
        score: parseFloat(rec["评分"]),
        grade: parseInt(rec["年级"]),
    });
}

(async () => {
    records = await readCSV();
    for (let rec of records) {
        addCourse(rec);
        addRemark(rec);
    }
    await fs.writeFile(JSON_COURSES_FILE, JSON.stringify(courses, null, 4));
    await fs.writeFile(JSON_REMARKS_FILE, JSON.stringify(remarks, null, 4));
})();

/*
Example: {
    '年级': '2019',
    '课程大类': '通识核心课',
    '具体分类': '中华传统',
    '课程名称': '六经通论',
    '劳育认定': 'False',
    '美育认定': 'False',
    '姓名': 'hkp',
    '评分': '8',
    '评价': '对古代经史子集感兴趣的可以选，老师很有水平，能收获很多知识，不过给分一般'
}

Course: {
    name: string,
    type: string,
    category: string,
    isArt: boolean,
    isLabor: boolean,
}

Remark: {
    name: string,
    course: string,
    comment: string,
    score: number,
    grade: number,
}
*/
