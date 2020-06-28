export = getRemoteInfo;
declare function getRemoteInfo({ token, owner, repo, }: {
    token?: string;
    owner: any;
    repo: any;
}): Promise<{
    source: any;
    data: any;
}>;
