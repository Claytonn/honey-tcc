export const setCookiesToMap = (cookies: string[]) => {
    const map = new Map<string, string>();
    cookies.forEach((cookie) => {
        const [key, value] = cookie.split("=");
        map.set(key, value.split(';')[0]);
    }
    );
    return map;
}