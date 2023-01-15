import { ApiResponse } from "../common/apiResponse.model";

export class AuthenticateResponse extends ApiResponse {
    emailAddress: string | undefined;
    emailVerified: boolean = false;
    screenName: string | undefined;
    isLoggedIn: boolean = false;
}