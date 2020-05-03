const fs = require('fs');

const renderMd = (mdStr) => `
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
	<div id="md" class="markdown-body"></div>
	<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> 
	<script>
	md.innerHTML = marked('${mdStr.replace(/\n/g, '\\n')}');
	</script> 
</body>
</html>
`;

const landingTpl = () => {
	const readmeStr = fs.readFileSync('/Users/osame/Documents/Gits/privatenumber/github-cdn/README.md').toString();
	return renderMd(readmeStr);
};

module.exports = landingTpl;
