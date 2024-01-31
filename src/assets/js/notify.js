const env = import.meta.env ?? process.env;
const url = env.VITE_NOTIFY_URL;

const send = (payload) => 
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

const createdRemark = (d) => send({ action: "createdRemark", ...d });
const createdCourse = (d) => send({ action: "createdCourse", ...d });

const notify = {
    createdRemark,
    createdCourse,
};
export default notify;
