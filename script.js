class VipVideos {
    constructor() {
        this.currentPlatform = null;
        this.currentApi = 'api1';
        this.isDramaMode = false;
        this.videoHistory = [];
        
        this.platforms = {
            'mgtv': 'https://www.mgtv.com/',
            'iqiyi': 'https://www.iqiyi.com/',
            'tencent': 'https://v.qq.com/',
            'youku': 'https://www.youku.com/',
            'bilibili': 'https://www.bilibili.com/'
        };
        
        this.dramaSites = {
            'netflix': 'https://www.netflix.com/',
            '7movie': 'https://www.7.movie/',
            'kanpian': 'https://example.com/',
            'gazf': 'https://example.com/'
        };

        // 解析API配置（需要替换为真实API）
        this.parseApis = {
            'api1': 'https://api.example.com/parse1?url=',
            'api2': 'https://api.example.com/parse2?url=',
            'api3': 'https://api.example.com/parse3?url=',
            'api4': 'https://api.example.com/parse4?url='
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
        this.updateStats();
    }

    bindEvents() {
        // 平台选择
        document.getElementById('platform-select').addEventListener('change', (e) => {
            this.currentPlatform = e.target.value;
            if (this.currentPlatform) {
                this.openPlatform(this.currentPlatform);
            }
        });

        // 解析接口选择
        document.getElementById('api-select').addEventListener('change', (e) => {
            this.currentApi = e.target.value;
            this.updateStatus('current-api', this.getApiName(this.currentApi));
        });

        // 解析按钮
        document.getElementById('parse-btn').addEventListener('click', () => {
            this.parseCurrentVideo();
        });

        // 美韩日剧模式
        document.getElementById('drama-mode-btn').addEventListener('click', () => {
            this.toggleDramaMode();
        });

        // 剧集站点按钮
        document.querySelectorAll('.site-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const site = btn.dataset.site;
                this.openDramaSite(site);
            });
        });

        // 导航按钮
        document.getElementById('back-btn').addEventListener('click', () => {
            this.goBack();
        });

        document.getElementById('forward-btn').addEventListener('click', () => {
            this.goForward();
        });

        document.getElementById('home-btn').addEventListener('click', () => {
            this.goHome();
        });

        // URL输入
        document.getElementById('go-btn').addEventListener('click', () => {
            this.navigateToUrl();
        });

        document.getElementById('url-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigateToUrl();
            }
        });

        // 窗口控制按钮
        document.getElementById('minimize-btn').addEventListener('click', () => {
            this.minimizeWindow();
        });

        document.getElementById('maximize-btn').addEventListener('click', () => {
            this.toggleMaximize();
        });

        document.getElementById('close-btn').addEventListener('click', () => {
            this.closeWindow();
        });

        // 检查更新
        document.getElementById('check-update-btn').addEventListener('click', () => {
            this.checkForUpdates();
        });

        // 监听iframe加载事件
        const iframe = document.getElementById('webview-frame');
        iframe.addEventListener('load', () => {
            this.onPageLoad();
        });

        iframe.addEventListener('loadstart', () => {
            this.showLoading();
        });
    }

    openPlatform(platform) {
        if (!platform) return;
        
        const url = this.platforms[platform];
        this.navigateToUrl(url);
        this.updateStatus('current-site', this.getPlatformName(platform));
    }

    openDramaSite(site) {
        const url = this.dramaSites[site];
        this.navigateToUrl(url);
        this.updateStatus('current-site', this.getSiteName(site));
    }

    navigateToUrl(url = null) {
        const inputUrl = url || document.getElementById('url-input').value.trim();
        
        if (!inputUrl) return;

        let finalUrl = inputUrl;
        if (!inputUrl.startsWith('http')) {
            finalUrl = 'https://' + inputUrl;
        }

        this.showWebView();
        const iframe = document.getElementById('webview-frame');
        
        // 临时方案：直接使用原始URL（会有跨域限制）
        // 等代理函数修复后再改用代理
        iframe.src = finalUrl;
        
        document.getElementById('url-input').value = finalUrl;
        
        this.addToHistory(finalUrl);
        
        // 测试代理函数（不影响主要功能）
        this.testProxyFunction(finalUrl);
    }

    // 测试代理函数
    async testProxyFunction(url) {
        try {
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            if (response.ok) {
                console.log('✅ 代理函数正常工作');
                this.showMessage('代理功能正常', 'success');
            } else {
                console.log('❌ 代理函数返回错误:', response.status);
            }
        } catch (error) {
            console.log('❌ 代理函数测试失败:', error.message);
            // 不显示错误消息，避免干扰用户体验
        }
    }

    async parseCurrentVideo() {
        const iframe = document.getElementById('webview-frame');
        const currentUrl = iframe.src || document.getElementById('url-input').value;
        
        if (!currentUrl) {
            this.showMessage('请输入或导航到视频页面', 'warning');
            return;
        }

        this.showLoading();
        
        try {
            // 调用解析API
            const parsedData = await this.callParseAPI(currentUrl, this.currentApi);
            
            if (parsedData && parsedData.videoUrl) {
                this.showVideoPlayer(parsedData.videoUrl);
                this.showMessage('解析成功！', 'success');
            } else {
                this.showMessage('解析失败，请尝试更换接口', 'error');
            }
        } catch (error) {
            console.error('解析错误:', error);
            this.showMessage('解析出错: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async callParseAPI(videoUrl, apiType) {
        const apiUrl = this.parseApis[apiType];
        
        if (!apiUrl) {
            throw new Error('无效的解析接口');
        }

        const fullUrl = apiUrl + encodeURIComponent(videoUrl);
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }

    showVideoPlayer(videoUrl) {
        this.hideWebView();
        this.hideInitialScreen();
        
        const videoPlayer = document.getElementById('video-player');
        const videoElement = document.getElementById('video-element');
        
        videoElement.src = videoUrl;
        videoPlayer.style.display = 'block';
        
        this.setupVideoControls();
    }

    setupVideoControls() {
        const video = document.getElementById('video-element');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const timeDisplay = document.getElementById('time-display');

        video.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = `00:00 / ${this.formatTime(video.duration)}`;
        });

        video.addEventListener('timeupdate', () => {
            timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
        });

        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.textContent = '❚❚';
            } else {
                video.pause();
                playPauseBtn.textContent = '▶';
            }
        });

        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            }
        });
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00 / 00:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    toggleDramaMode() {
        this.isDramaMode = !this.isDramaMode;
        const dramaSites = document.getElementById('drama-sites');
        const dramaBtn = document.getElementById('drama-mode-btn');
        
        if (this.isDramaMode) {
            dramaSites.classList.add('active');
            dramaBtn.style.background = 'var(--highlight-color)';
        } else {
            dramaSites.classList.remove('active');
            dramaBtn.style.background = 'var(--accent-color)';
        }
    }

    showWebView() {
        this.hideInitialScreen();
        this.hideVideoPlayer();
        
        document.getElementById('webview-frame').style.display = 'block';
    }

    hideWebView() {
        document.getElementById('webview-frame').style.display = 'none';
    }

    showInitialScreen() {
        document.getElementById('initial-screen').style.display = 'flex';
    }

    hideInitialScreen() {
        document.getElementById('initial-screen').style.display = 'none';
    }

    hideVideoPlayer() {
        document.getElementById('video-player').style.display = 'none';
        const video = document.getElementById('video-element');
        video.pause();
        video.src = '';
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    onPageLoad() {
        this.hideLoading();
        
        // 检测页面是否为视频页面，自动准备解析
        const iframe = document.getElementById('webview-frame');
        const currentUrl = iframe.src;
        
        if (this.isVideoPage(currentUrl)) {
            this.showMessage('检测到视频页面，点击PARSE按钮进行解析', 'info');
        }
    }

    isVideoPage(url) {
        const videoPatterns = [
            /\.mp4$/i,
            /\.m3u8$/i,
            /\.flv$/i,
            /video/i,
            /play/i,
            /watch/i,
            /\/v_/i,
            /\.(iqiyi|qq|youku|bilibili|mgtv)\.com\/.*\.html/i
        ];
        
        return videoPatterns.some(pattern => pattern.test(url));
    }

    addToHistory(url) {
        this.videoHistory = this.videoHistory.filter(item => item !== url);
        this.videoHistory.unshift(url);
        
        if (this.videoHistory.length > 10) {
            this.videoHistory = this.videoHistory.slice(0, 10);
        }
        
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('videoHistory', JSON.stringify(this.videoHistory));
    }

    loadHistory() {
        const history = localStorage.getItem('videoHistory');
        if (history) {
            this.videoHistory = JSON.parse(history);
        }
    }

    updateStats() {
        document.getElementById('total-parsed').textContent = this.videoHistory.length;
        document.getElementById('active-apis').textContent = Object.keys(this.parseApis).length;
        document.getElementById('drama-sites-count').textContent = Object.keys(this.dramaSites).length;
    }

    updateStatus(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMsg = document.querySelector('.message-toast');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // 创建新消息
        const toast = document.createElement('div');
        toast.className = `message-toast message-${type}`;
        toast.innerHTML = `
            <span class="message-text">${message}</span>
            <button class="message-close">×</button>
        `;
        
        document.body.appendChild(toast);
        
        // 自动消失
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 4000);
        
        // 点击关闭
        toast.querySelector('.message-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    getPlatformName(platform) {
        const names = {
            'mgtv': '芒果TV',
            'iqiyi': '爱奇艺',
            'tencent': '腾讯视频',
            'youku': '优酷',
            'bilibili': '哔哩哔哩'
        };
        return names[platform] || platform;
    }

    getSiteName(site) {
        const names = {
            'netflix': '奈飞工厂',
            '7movie': '七点电影',
            'kanpian': '看片狂人',
            'gazf': 'GAZF'
        };
        return names[site] || site;
    }

    getApiName(api) {
        const names = {
            'api1': '799解析',
            'api2': '维新接口',
            'api3': '稳定线路',
            'api4': '高速通道'
        };
        return names[api] || api;
    }

    // 导航控制
    goBack() {
        const iframe = document.getElementById('webview-frame');
        try {
            iframe.contentWindow.history.back();
        } catch (e) {
            console.log('无法后退:', e);
        }
    }

    goForward() {
        const iframe = document.getElementById('webview-frame');
        try {
            iframe.contentWindow.history.forward();
        } catch (e) {
            console.log('无法前进:', e);
        }
    }

    goHome() {
        this.showInitialScreen();
        this.hideWebView();
        this.hideVideoPlayer();
        document.getElementById('url-input').value = '';
        this.updateStatus('current-site', '未选择平台');
    }

    // 窗口控制 (在浏览器中模拟)
    minimizeWindow() {
        this.showMessage('最小化窗口 - 在浏览器中请使用浏览器控件');
    }

    toggleMaximize() {
        this.showMessage('切换最大化 - 在浏览器中请使用浏览器控件');
    }

    closeWindow() {
        this.showMessage('关闭窗口 - 在浏览器中请直接关闭标签页');
    }

    checkForUpdates() {
        this.showMessage('检查更新功能 - 需要后端API支持', 'info');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new AudioVisualWeb();
});

// 添加测试函数到全局作用域（临时）
window.testProxy = async function() {
    try {
        const response = await fetch('/api/proxy?url=https://www.baidu.com');
        if (response.ok) {
            alert('✅ 代理函数正常工作！');
        } else {
            alert('❌ 代理函数错误: ' + response.status);
        }
    } catch (error) {
        alert('❌ 代理函数失败: ' + error.message);
    }
};