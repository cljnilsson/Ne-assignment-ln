const baseUrl = "http://localhost:4000";

interface ApiResponse {
	success: boolean;
	data: object;
	message: string;
}

async function request(path: string, requestMethod: "POST" | "GET" | "PATCH", body: object) : Promise<ApiResponse | null> {
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

export function patchRequest(path: string, body: object) {
    return request(path, "PATCH", body);
}

export function postRequest(path: string, body: object) {
    return request(path, "POST", body);
}

export function getRequest(path: string) {
    return request(path, "GET", {});
}