import { getRemoteInfo } from '../utils/github';

export default async (req, res) => {
	const { owner, repo } = req.params;
	const { source, data: remoteInfo } = await getRemoteInfo({ owner, repo });

	res
		.header('GIT-CDN-SOURCE', source)
		.send(remoteInfo);
};
