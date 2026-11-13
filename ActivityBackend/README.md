# Activity Backend

这是 CHUNITHM Launcher 首页活动图和最新资讯的独立管理后台。它提供管理员网页、图片上传、SQLite 数据存储和只读活动接口。

## Docker 启动

首次部署前请修改 `docker-compose.yml` 中的管理员密码和会话密钥，然后运行：

```bash
docker compose up -d --build
```

管理页面：`http://localhost:8080/admin`

公开接口：`http://localhost:8080/api/v1/activity-feed?language=zh-CN`

数据和图片位于挂载目录 `./data`。请备份该目录。生产环境应在反向代理后使用 HTTPS，并把 `ActivityBackend__AllowedOrigins__0` 设置为启动器的实际来源。

默认管理员账号为 `admin`；密码取自 `ActivityBackend__AdminPassword`，首次部署必须修改。
