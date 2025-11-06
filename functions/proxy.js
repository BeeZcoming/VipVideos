// netlify/functions/proxy.js
exports.handler = async (event) => {
  console.log('Proxy function called', event.queryStringParameters);
  
  // 处理 CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing URL parameter' })
    };
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    console.log('Fetching URL:', decodedUrl);
    
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: html
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Proxy failed',
        message: error.message 
      })
    };
  }
};
