export class UserProfile {
    accountId: string | undefined;
    emailAddress: string | undefined;
    screenName: string | undefined;
    emailVerified: boolean

    constructor(accountId: string | undefined, emailAddress: string | undefined, screenName: string | undefined, emailVerified: boolean) {
        this.accountId = accountId;
        this.emailAddress = emailAddress;
        this.screenName = screenName;
        this.emailVerified = emailVerified;
    }
}