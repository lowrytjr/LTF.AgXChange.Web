export class AccountRequestRequest {
    emailAddress: string | undefined;
    screenName: string | undefined;

    constructor(emailAddress: string, screenName: string) {
        this.emailAddress = emailAddress;
        this.screenName = screenName;
    }
}