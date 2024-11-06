import { Context } from "hono";

type CustomResponse = { status; success; data; message };

function jsonResponse(c: Context, body: CustomResponse) {
	return c.json(body);
}

export function errorJson(c: Context, msg: string) {
	return jsonResponse(c, {
		status: 400,
		success: false,
		data: {},
		message: msg
	});
}

export function defaultJson(c: Context, body, msg) {
	return jsonResponse(c, {
		status: 200,
		success: true,
		data: body,
		message: msg
	});
}
