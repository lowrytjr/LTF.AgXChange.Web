import { ApiResponse } from "../common/apiResponse.model";

export class AccountRetrieveResponse extends ApiResponse {
    accountId: string | undefined;
    emailAddress: string | undefined;
    screenName: string | undefined;
    emailVerified: boolean = false;
}