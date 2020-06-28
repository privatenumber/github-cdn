export = getGist;
declare function getGist({ token, gistId, path, }: {
    token?: string;
    gistId: any;
    path?: string;
}): Promise<{
    source: any;
    data: any;
}>;
