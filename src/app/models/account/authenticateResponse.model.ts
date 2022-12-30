import { ApiResponse } from "../common/apiResponse.model";

export class AuthenticateResponse extends ApiResponse {
    host: string | undefined;
    referer: string | undefined;
    emailToken: string | undefined;
    jwt: string | undefined;
}