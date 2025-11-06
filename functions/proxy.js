// netlify/functions/proxy.js
exports.handler = async (event) => {
  console.log('收到代理请求:', event.queryStringParameters);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // 处理预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { url } = event.queryStringParameters;
  
  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: '缺少URL参数' })
    };
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    console.log('获取URL:', decodedUrl);
    
    const response = await fetch(decodedUrl);
    const html = await response.text();
    
    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'text/html' },
      body: html
    };
  } catch (error) {
    console.error('代理错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
