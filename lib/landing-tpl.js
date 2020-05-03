const fs = require('fs');

const renderMd = () => `
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Github CDN</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="/sindresorhus/github-markdown-css/v4.0.0/github-markdown.css">
	<style>
		.markdown-body {
			margin: 32px;
		}
	</style>
</head>
<body>
	<div id="md" class="markdown-body">Loading...</div>
	<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> 
	<script>
	fetch('https://github-cdn.now.sh/privatenumber/github-cdn/master/README.md').then(r => r.text()).then(mdStr => {
		md.innerHTML = marked(mdStr);
	});
	</script> 
</body>
</html>
`;

const landingTpl = renderMd();

module.exports = landingTpl;
