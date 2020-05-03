const log = require('../lib/utils/log');

const landingTpl = `
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Github CDN</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
	<style>
	body { margin: 0; }
	.markdown-body {
		min-width: 300px;
		max-width: 750px;
		width: 70vw;
		margin: 32px auto;
	}
	</style>
</head>
<body>
	<div id="md" class="markdown-body">Loading...</div>
	<script type="text/javascript">
	fetch('https://github-cdn.now.sh/privatenumber/github-cdn/master/README.md')
		.then(r => r.text())
		.then(mdStr => {
			md.innerHTML = marked(mdStr);
		});
	</script>
	<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</body>
</html>
`;

module.exports = (req, res) => {
	log('[req:serve-landing]', req.url);
	res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
	res.send(landingTpl);
};
