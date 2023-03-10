import { ApiResponse } from "../common/apiResponse.model";

export class AuthenticateResponse extends ApiResponse {
    accountId: string | undefined;
    emailAddress: string | undefined;
    emailVerified: boolean = false;
    screenName: string | undefined;
}