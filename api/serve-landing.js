const config = require('../lib/utils/config');
const log = require('../lib/utils/log');

const assets = {
	js: [
		'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js',
		'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
	],
	css: [
		'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css',
	],
};

const landingTpl = `
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="description" content="Github CDN is an unofficial content delivery network for repo assets on Github">
	<meta name="keywords" content="Github, CDN">
	<meta name="author" content="Hiroki Osame">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="preload" href="${config.landingPageMdSrc}" as="fetch">
	${assets.css.map((s) => `<link rel="preload" href="${s}" as="style">`).join('')}
	${assets.js.map((s) => `<link rel="preload" href="${s}" as="script">`).join('')}
	<style>
	body { margin: 0; }
	.markdown-body {
		min-width: 300px;
		max-width: 750px;
		width: 70vw;
		margin: 32px auto;
	}
	input:not(:focus):invalid {
		outline: red auto 1px;
	}
	.success {
		opacity: 0;
		transition: .2s ease-in opacity;
	}
	.visible {
		opacity: 1;
	}
	</style>
	${assets.css.map((s) => `<link rel="stylesheet" href="${s}">`).join('')}
</head>
<body>
	<div id="md" class="markdown-body">Loading...</div>
	${assets.js.map((s) => `<script src="${s}" defer></script>`).join('')}
	<script type="text/javascript">
	fetch('${config.landingPageMdSrc}')
		.then(r => r.text())
		.then(mdStr => {
			md.innerHTML = marked(mdStr);

			const firstHeading = document.querySelector('h1');
			document.title = firstHeading.innerText;

			const $ = (tag, attrs) => Object.assign(document.createElement(tag), attrs);

			const $success = $('span', {
				classList: 'success',
				innerHTML: ' ✅',
			});

			const $input = $('input', {
				style: 'width: 90%;',
				placeholder: 'eg. 8c75f49d8ae8f4482a7ae6ed23452f4837f61653',
				value: Cookies.get('token') || '',
				pattern: '[a-f0-9]{40}',
				maxLength: 40,
			});

			$input.addEventListener('keyup', (e) => (e.key === 'Enter') && $input.blur());
			$input.addEventListener('change', () => {
				if (!$input.validity.valid) {
					return;
				}
				const value = $input.value.trim();
				if (!value) {
					$input.value = '';
					Cookies.remove('token');
				} else {
					Cookies.set('token', value, { sameSite: 'none', secure: true });
				}
				$success.classList.add('visible');
				setTimeout(() => $success.classList.remove('visible'), 1000);
			});

			const $label = $('label', {
				innerHTML: '<strong>Set Github PAT as cookie</strong>',
			});
			$label.append($input);

			const fragment = document.createDocumentFragment();
			fragment.append($label, $success);

			const commentNode = Array.from(md.childNodes).find((n) => n.nodeType === 8);
			commentNode.parentNode.replaceChild(fragment, commentNode);
		});
	</script>
</body>
</html>
`;

module.exports = (req, res) => {
	log('[req:serve-landing]', req.url);
	res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
	res.send(landingTpl);
};
