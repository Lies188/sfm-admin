# SFM Admin

SFM 短信转发管理系统的 Web 管理后台。

## 功能

- 设备管理：查看设备在线状态、最后活跃时间
- 短信管理：查询短信记录、发送短信指令
- 响应式布局：支持 PC 和移动端

## 技术栈

- React 18 + TypeScript
- Ant Design 5
- Vite
- React Router 6
- Axios
- Day.js

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 配置

开发环境 API 代理配置在 `vite.config.ts`：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

## 部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置反向代理，将 `/api/*` 转发到后端服务

### Caddy 配置示例

```caddyfile
sfm.example.com {
    handle /api/* {
        reverse_proxy 127.0.0.1:3000
    }
    handle {
        root * /path/to/sfm-admin/dist
        encode gzip
        try_files {path} /index.html
        file_server
    }
}
```

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 目录结构

```
src/
├── components/     # 公共组件
│   └── MainLayout.tsx
├── pages/          # 页面组件
│   ├── Login.tsx
│   ├── Devices.tsx
│   └── Sms.tsx
├── services/       # API 服务
│   ├── api.ts
│   ├── auth.ts
│   ├── device.ts
│   └── sms.ts
├── App.tsx         # 路由配置
└── main.tsx        # 入口文件
```

## License

MIT

## 更新日志

### 2025-01-28
- 新增 App 版本管理页面

### 2025-01-27
- 新增数据概览页面
- 优化移动端响应式布局

### 2025-01-26
- 初始版本发布
- 设备管理、短信管理功能
