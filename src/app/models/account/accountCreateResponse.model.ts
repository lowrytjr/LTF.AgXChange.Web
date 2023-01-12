import { ApiResponse } from "../common/apiResponse.model";

export class AccountCreateResponse extends ApiResponse {
    emailAddress: string | undefined;
}