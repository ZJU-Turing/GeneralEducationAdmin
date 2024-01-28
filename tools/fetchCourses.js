// IMPORTANT: NOT FUNCTIONING PROPERLY, DO NOT USE IN PRODUCTION
import assert from "assert";
import fs from "fs/promises";
import fetch from "node-fetch";
import querystring from "querystring";

// IMPORTANT: 以下两个 cookie 从浏览器中获取，使用前务必更新
const JSESSIONID = "ACE68A51B8B9FDB025AE9ED1AFA02041";
const route = "1a53339a9972202950f42a60e12340ac";

const API = "http://zdbk.zju.edu.cn/jwglxt/xsxk/zzxkghb_cxZzxkGhbKcList.html";
const JSON_COURSES_FILE = "./tools/output/coursesAll.BUG.json";

function parseCourse(raw) {
    return {
        name: raw.kcmc.trim(),
        type: raw.kcbs === "-" ? "通识必修课程" : raw.kcbs,
        category: raw.kcgs.trim(),
        isArt: raw.rdlb === "美育类",
        isLabor: raw.rdlb === "劳育类",
        // code: raw.kcdm,
    };
}

async function getCourses(type, year, semester) {
    let payload = {
        dl: type,
        xnxq: `(${year}-${year + 1}-${semester})-`,
        kspage: "1",
        jspage: "10000",
    };
    let req = await fetch(API, {
        method: "POST",
        body: querystring.stringify(payload),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Cookie": `JSESSIONID=${JSESSIONID}; route=${route}`,
        },
    });
    let res = JSON.parse(await req.text()).map(parseCourse);
    return res;
}

async function getSemester(year, semester) {
    let elective = await getCourses("xk_n", year, semester);   // 通识选修课（主要）
    let compulsory = await getCourses("xk_b", year, semester)  // 通识必修课（四史等）
    return elective.concat(compulsory);
}

async function getYear(year) {
    let fw = await getSemester(year, 1);  // fall & winter
    let ss = await getSemester(year, 2);  // spring & summer
    return fw.concat(ss);
}

async function mergeYear(src, dist) {
    for (let course of src) {
        let duplicate = false;
        for (let i = 0; i < dist.length; i++) {
            if (course.name == dist[i].name || course.code == dist[i].code) {
                duplicate = true;
                assert(course.name == dist[i].name, `Name mismatch: ${course.name}`);
                assert(course.code == dist[i].code, `Code mismatch: ${course.name}`);
                // WHAT???? The assertion failed...
                // That means I have to abandon this method...
                // Maybe fix another time?
            }
        }
        if (!duplicate) dist.push(course);
    }
}

(async () => {
    // This piece of code is not working properly.
    // let courses = await getYear(2020);
    // for (let y = 2020; y <= 2023; y++) {
    //     let year = await getYear(y);
    //     mergeYear(year, courses);
    // }
    let courses = await getYear(2023);
    // Currently only able to fetch courses in 2023-2024
    // DO NOT use this script to fetch courses in production!!
    await fs.writeFile(JSON_COURSES_FILE, JSON.stringify(courses, null, 4));
})();

/*
Response Example: {
    completeAnswer: true,
    jgpxzd: '1',
    kcbs: '普通通识课程',
    kcdm: '9417N001',
    kcgs: '博雅技艺',
    kclb: '通识',
    kcmc: '农事劳动实践',
    kcxx: '0~1.5~1.0-1.0',
    kcxz: '其它',
    kcxzzt: '0',
    kkxy: '农业试验站',
    listnav: 'false',
    localeKey: 'zh_CN',
    pageable: true,
    queryModel: {
        currentPage: 1,
        currentResult: 0,
        entityOrField: false,
        limit: 15,
        offset: 0,
        pageNo: 0,
        pageSize: 15,
        showCount: 10,
        sorts: [],
        totalCount: 0,
        totalPage: 0,
        totalResult: 0
    },
    rangeable: true,
    rdlb: '劳育类',
    rn: '43',
    totalResult: '0',
    tsbj: '1',
    userModel: {
        monitor: false,
        roleCount: 0,
        roleKeys: '',
        roleValues: '',
        status: 0,
        usable: false
    },
    xkkh: 'T(2023-2024-2)-9417N001',
    xkzy: 0
},
*/