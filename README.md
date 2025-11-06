视频解析播放器

一个基于Web的现代化视频解析播放器，支持多平台视频解析和内嵌播放，无需跳转即可观看各类视频内容。

✨ 主要特性
🎬 多平台支持 - 爱奇艺、腾讯视频、优酷、芒果TV、哔哩哔哩等主流平台

🌍 美韩日剧模式 - 专为海外剧集观看优化

🔄 多解析接口 - 4个解析接口可选，提高解析成功率

🎯 内嵌播放 - 所有操作在同一页面完成，无跳转

📱 响应式设计 - 完美适配桌面和移动设备

🚀 一键部署 - 支持Netlify快速部署

🛡️ 安全代理 - 内置代理功能解决跨域问题

🚀 快速开始
在线体验
直接访问Netlify部署的演示站点：
https://your-VipVideos-app.netlify.app

本地运行
克隆项目

bash
git clone https://github.com/your-username/VipVideos.git
cd VipVideos
安装依赖

bash
npm install
启动本地服务器

bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server

# 或使用Live Server扩展
访问应用
打开浏览器访问 http://localhost:8000

📦 部署到Netlify
方法一：GitHub连接（推荐）
Fork 或克隆此仓库到你的GitHub账户

登录 Netlify

点击 "New site from Git"

选择 GitHub 并授权

选择你的 VipVideos 仓库

保持默认设置，点击 "Deploy site"

方法二：拖拽部署
将项目文件夹打包为ZIP

拖拽到 Netlify Drop 区域

等待自动部署完成

方法三：Netlify CLI
bash
# 安装CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化部署
netlify init

# 部署
netlify deploy --prod
🎮 使用指南
基本使用
平台导航

从左侧面板选择视频平台

或直接在URL输入框输入视频链接

视频解析

导航到视频页面后点击 "PARSE" 按钮

如解析失败，可尝试切换不同解析接口

美韩日剧模式

点击 "美韩日剧" 按钮展开海外剧集站点

选择喜欢的站点开始观看

功能说明
解析接口: 提供4个不同接口，提高解析成功率

导航控制: 支持前进、后退、首页按钮

播放控制: 内置视频播放器，支持全屏播放

历史记录: 自动保存最近访问的10个链接

🛠️ 技术架构
前端技术栈
HTML5 - 页面结构

CSS3 - 现代化UI设计，CSS变量主题系统

JavaScript (ES6+) - 交互逻辑和API调用

Netlify Functions - 服务器less代理功能

核心功能模块
text
📁 AudioVisual-Web/
├── 📄 index.html          # 主页面
├── 🎨 style.css           # 样式文件
├── ⚡ script.js           # 主要逻辑
├── ⚙️ netlify.toml        # 部署配置
├── 📦 package.json        # 依赖配置
└── 📁 netlify/
    └── 📁 functions/
        └── 🔄 proxy.js    # 代理服务函数
⚙️ 配置说明
解析API配置
在 script.js 中配置解析接口：

javascript
this.parseApis = {
    'api1': 'https://your-api-domain.com/parse1?url=',
    'api2': 'https://your-api-domain.com/parse2?url=',
    'api3': 'https://your-api-domain.com/parse3?url=',
    'api4': 'https://your-api-domain.com/parse4?url='
};
自定义平台
在 script.js 中添加新平台：

javascript
this.platforms = {
    'new-platform': 'https://new-platform.com/',
    // ... 其他平台
};
🔧 开发指南
添加新功能
添加新的视频平台

javascript
// 在script.js的platforms对象中添加
'newPlatform': 'https://new-platform-url.com/'
添加解析接口

javascript
// 在parseApis对象中添加新接口
'newApi': 'https://new-api-url.com/parse?url='
自定义样式
修改CSS变量来调整主题：

css
:root {
    --primary-bg: #你的主背景色;
    --highlight-color: #你的主题色;
}
🌐 浏览器支持
✅ Chrome 90+

✅ Firefox 88+

✅ Safari 14+

✅ Edge 90+

📝 更新日志
v1.0.0 (2024-01-01)
✨ 初始版本发布

🎯 多平台视频解析

🌍 美韩日剧模式

🚀 Netlify一键部署

🤝 贡献指南
我们欢迎各种形式的贡献！

Fork 本项目

创建特性分支 (git checkout -b feature/AmazingFeature)

提交更改 (git commit -m 'Add some AmazingFeature')

推送到分支 (git push origin feature/AmazingFeature)

开启 Pull Request

📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

⚠️ 免责声明
本项目为开源学习项目，仅供技术交流使用：

软件为开源项目，如您是花钱购买请向购买平台投诉

一切损失与开发者无关

项目内所有资源均来源于互联网，本项目只做整合

如侵犯您的权益请联系邮箱删除

请遵守当地法律法规，合理使用本软件。

🆘 常见问题
Q: 解析失败怎么办？
A: 尝试以下方法：

更换解析接口

检查视频链接是否正确

确认网络连接正常

Q: 网站无法加载？
A: 检查：

网络连接

浏览器兼容性

Netlify服务状态

Q: 如何添加自定义解析接口？
A: 在 script.js 中的 parseApis 对象添加新的API地址。

📞 技术支持
📧 邮箱: admin@zyds.net

🐛 问题反馈: GitHub Issues

💬 讨论区: GitHub Discussions

🌟 致谢
感谢以下开源项目和技术：

Netlify - 优秀的部署平台

Node.js - JavaScript运行时

所有贡献者和用户的支持

<div align="center">
如果这个项目对你有帮助，请给个⭐Star支持一下！

https://api.star-history.com/svg?repos=BeeZcoming/VipVideos&type=Date

</div>
