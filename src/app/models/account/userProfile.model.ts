export class UserProfile {
    emailAddress: string;
    screenName: string;

    constructor(emailAddress: string | undefined, screenName: string | undefined) {
        this.emailAddress = emailAddress ?? "invalid";
        this.screenName = screenName ?? "invalid";
    }
}