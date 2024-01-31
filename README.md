# 浙江大学图灵班通识课程评价系统

网址 [tsk.xecades.xyz](https://tsk.xecades.xyz/)（tsk = 通识课）

Powered by Leancloud, Vuejs and ElementPlus.

## 课程评价使用说明

登录密码见图灵 QQ 群通知，一次登录后会在本地保存登录状态，下次访问时无需再次登录.

## 管理员管理说明

为了安全和性能考虑，不采用动态获取评价的方法. 故每次课程评价更改后，需管理员 **手动** 导出数据并上传替换 [TuringCourses](https://github.com/ZJU-Turing/TuringCourses) 的原始内容. 具体步骤如下.

1. 点击页脚 “Admin” 进入后台管理页面，登录密码见管理员群.
2. 点击 “导出数据” 按钮以生成 `data.csv` 文件.
3. 用该文件 **手动** 替换 [TuringCourses](https://github.com/ZJU-Turing/TuringCourses) 中的 [docs/general/data.csv](https://github.com/ZJU-Turing/TuringCourses/blob/master/docs/general/data.csv) 文件.

后台管理页面亦可增删、更改课程评价和课程列表.

> [!WARNING]
> 任何更改后请 **务必** 按照上述步骤替换 `data.csv` 文件！

如数据库出现异常，联系 [@Xecades](https://github.com/Xecades).

## 后续开发计划

1. 使用 GitHub Actions 自动导出并替换 `data.csv`.
