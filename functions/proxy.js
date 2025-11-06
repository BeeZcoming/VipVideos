// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  const { url } = event.queryStringParameters;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing URL parameter' })
    };
  }

  try {
    const targetUrl = decodeURIComponent(url);
    console.log('Proxying to:', targetUrl);
    
    const response = await fetch(targetUrl);
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
