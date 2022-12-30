import { ApiResponse } from "../common/apiResponse.model";

export class EmailResponse extends ApiResponse {
    host: string | undefined;
    referer: string | undefined;
    emailToken: string | undefined;
    emailMessage: string | undefined;
}