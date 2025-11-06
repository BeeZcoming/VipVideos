// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  // 处理CORS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  // 只允许GET请求
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { url } = event.queryStringParameters;
  
  if (!url) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing URL parameter' })
    };
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    
    console.log('Proxying URL:', decodedUrl);
    
    // 使用原生的fetch（Node.js 18+ 内置）
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain'
        },
        body: `HTTP Error: ${response.status} ${response.statusText}`
      };
    }
    
    const contentType = response.headers.get('content-type') || 'text/html';
    let body = await response.text();
    
    // 如果是HTML，进行一些修改以适应内嵌
    if (contentType.includes('text/html')) {
      body = body
        .replace(/<head>/i, '<head><base href="' + decodedUrl + '"><meta name="referrer" content="no-referrer">')
        .replace(/window\.top\.location/gi, 'window.location')
        .replace(/parent\.location/gi, 'window.location')
        .replace(/top\.location/gi, 'window.location');
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: body
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Proxy failed',
        message: error.message 
      })
    };
  }
};
