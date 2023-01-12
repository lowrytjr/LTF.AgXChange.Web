import { ApiResponse } from "../common/apiResponse.model";

export class AccountRequestResponse extends ApiResponse {
    accountRequestToken: string | undefined;
    host: string | undefined;
    referer: string | undefined;
}