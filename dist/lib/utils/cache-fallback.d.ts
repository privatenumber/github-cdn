export = cacheFallback;
declare function cacheFallback({ cacheDuration, key, request, }: {
    cacheDuration: any;
    key: any;
    request: any;
}): Promise<{
    source: any;
    data: any;
}>;
