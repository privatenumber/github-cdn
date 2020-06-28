export = resolveRef;
declare function resolveRef(args: any): Promise<{
    type: string;
    ref: any;
} | {
    type: string;
    ref?: undefined;
}>;
