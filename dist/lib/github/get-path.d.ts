export = getPath;
declare function getPath({ token, owner, repo, ref, path, }: {
    token?: string;
    owner: any;
    repo: any;
    ref: any;
    path?: string;
}): Promise<{
    source: any;
    data: any;
}>;
