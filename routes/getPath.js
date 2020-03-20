import { extname } from 'path';
import { pick } from 'lodash';
import { getPath } from '../utils/github';

export default async (req, res) => {
	const {
		owner, repo, ref, path = '',
	} = req.params;

	const { err, source, data: pathData } = await getPath({
		owner, repo, ref, path,
	});

	if (err) {
		return res
			.status(err.statusCode || 500)
			.json({
				message: err.message,
				request: {
					owner, repo, ref, path,
				},
			});
	}

	res.header('GIT-CDN-SOURCE', source);

	if (Array.isArray(pathData)) {
		return res.json(pathData.map((file) => pick(file, ['name', 'path', 'type'])));
	}

	const extension = extname(pathData.name).slice(1);
	const content = Buffer.from(pathData.content, 'base64').toString();

	return res
		.type(extension)
		.end(content);
};
