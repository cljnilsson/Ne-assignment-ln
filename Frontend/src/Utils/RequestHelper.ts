const baseUrl = "http://localhost:4000";

interface ApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
}

async function request<T>(path: string, requestMethod: "POST" | "GET" | "PATCH", body: object) : Promise<ApiResponse<T> | null> {
    const url = `${baseUrl}${path}`;
    const bodyJson = JSON.stringify(body);
    const PUBLIC_AUTH_PASSPHRASE = "honoiscool"; // Should be in .env file, at least it prevents some of the potential lazy spam

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PUBLIC_AUTH_PASSPHRASE}`
    };

    const requestOptions: RequestInit = {
        method: requestMethod,
        credentials: "include",
        headers,
        body: bodyJson,
    };
    
    if(requestMethod === "GET") {
        delete requestOptions.body;
    }

    try {
        const resp = await fetch(url, requestOptions);
        
        if (!resp.ok) {
            console.error("Error: ", resp.status);
            return null;
        }

        const data = await resp.json();

        console.log("Success: ", data);
        return data;
    } catch (error) {
        console.error("Error: ", error);
    }

    return null;
}

export function patchRequest<T>(path: string, body: object) {
    return request<T>(path, "PATCH", body);
}

export function postRequest<T>(path: string, body: object) {
    return request<T>(path, "POST", body);
}

export function getRequest<T>(path: string) {
    return request<T>(path, "GET", {});
}