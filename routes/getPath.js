import { extname } from 'path';
import { pick } from 'lodash';
import { getPath } from '../utils/github';

export default async (req, res) => {
	const {
		owner, repo, ref, path = '',
	} = req.params;

	const { err, source, data } = await getPath({
		owner, repo, ref, path,
	});

	if (err) {
		return res
			.status(err.statusCode || 500)
			.send({
				message: err.message,
				request: {
					owner, repo, ref, path,
				},
			});
	}

	res.header('GIT-CDN-SOURCE', source);

	if (Array.isArray(data)) {
		return res.send(data.map((file) => pick(file, ['name', 'path', 'type'])));
	}

	const extension = extname(path).slice(1);

	return res
		.type(extension)
		.end(data);
};
