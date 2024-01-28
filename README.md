# 浙江大学图灵班通识课程评价系统

网址 [tsk.xecades.xyz](https://tsk.xecades.xyz/)（tsk = 通识课）

Powered by Leancloud, Vuejs and ElementPlus.

## 管理员使用说明

为了安全和性能考虑，不采用动态获取评价的方法. 故每次课程评价更改后，需管理员 **手动** 导出数据并上传替换 [TuringCourses](https://github.com/ZJU-Turing/TuringCourses) 的原始内容. 具体步骤如下.

1. 点击页脚 “Admin” 进入后台管理页面，使用密码 `ZJUTuring` 登录.
2. 点击 “导出数据” 按钮以生成 `data.csv` 文件.
3. 用该文件 **手动** 替换 [TuringCourses](https://github.com/ZJU-Turing/TuringCourses) 中的 [docs/general/data.csv](https://github.com/ZJU-Turing/TuringCourses/blob/master/docs/general/data.csv) 文件.

后台管理页面亦可增删、更改课程评价和课程列表.

如数据库出现异常，联系 [@Xecades](https://github.com/Xecades).

## 后续开发计划

1. 课程评价更改自动触发钉钉群消息提醒.
2. 使用 GitHub Actions 自动导出并替换 `data.csv`.
