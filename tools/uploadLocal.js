import fs from "fs/promises";
import lc from "../src/assets/js/leancloud.js";

const JSON_REMARKS_FILE = "./tools/output/remarks.json";
const JSON_COURSES_FILE = "./tools/output/courses.json";

async function readJSON(src) {
    const data = await fs.readFile(src);
    return JSON.parse(data);
}

function findObjByName(cs, name) {
    let c = cs.find((c) => c.get("name") == name);
    if (!c) throw new Error(`Course ${name} not found.`);
    return c;
}

async function uploadRemarks(rs, cs) {
    console.info("Clearing remarks.");
    await lc.clearAllRemarks();

    console.info("Uploading remarks.");
    let toUpdate = [];
    for (let r of rs) {
        findObjByName(cs, r.course); // to ensure ok
        let remark = lc.createRemarkRaw(r);
        toUpdate.push(remark);
    }
    await lc.AV.Object.saveAll(toUpdate);
}

async function uploadCourses(cs) {
    console.info("Clearing courses.");
    await lc.clearAllCourses();

    console.info("Uploading courses.");
    let toUpdate = cs.map((c) => lc.createCourseRaw(c));
    await lc.AV.Object.saveAll(toUpdate);

    return toUpdate;
}

(async () => {
    console.info("Initializing LeanCloud.");
    lc.init();

    console.info("Reading courses from JSON file.");
    let courses = await readJSON(JSON_COURSES_FILE);

    console.info("Reading remarks from JSON file.");
    let remarks = await readJSON(JSON_REMARKS_FILE);

    let csObj = await uploadCourses(courses);
    await uploadRemarks(remarks, csObj);

    console.info("Done.");
})();

// TODO: upload local
