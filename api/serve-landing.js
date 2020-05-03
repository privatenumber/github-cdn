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
	.success {
		opacity: 0;
		transition: .2s ease-in opacity;
	}
	.visible {
		opacity: 1;
	}
	</style>
</head>
<body>
	<div id="md" class="markdown-body">Loading...</div>
	<script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
	<script type="text/javascript">
	fetch('https://github-cdn.now.sh/privatenumber/github-cdn/master/readme.md?token')
		.then(r => r.text())
		.then(mdStr => {
			md.innerHTML = marked(mdStr);

			const commentNode = Array.from(md.childNodes).find((n) => n.nodeType === 8);

			const fragment = document.createDocumentFragment();

			const $success = document.createElement('span');
			$success.classList = 'success';
			$success.innerHTML = ' ✅';

			const $input = document.createElement('input');
			$input.style = 'width: 90%;'
			$input.placeholder = 'Github token cookie';
			$input.value = Cookies.get('token') || '';
			$input.addEventListener('keyup', (e) => {
				if (e.key === 'Enter') {
					$input.blur();
				}
			});
			$input.addEventListener('change', () => {
				Cookies.set('token', $input.value);
				$success.classList.add('visible');
				setTimeout(() => $success.classList.remove('visible'), 1000);
			});

			fragment.append($input, $success);

			commentNode.parentNode.replaceChild(fragment, commentNode);
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
