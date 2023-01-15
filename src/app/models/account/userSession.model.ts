import { UserProfile } from "./userProfile.model";

export class UserSession {
    userProfile: UserProfile;
    isLoggedIn: boolean;

    constructor(userProfile: UserProfile, isLoggedIn: boolean) {
        this.userProfile = userProfile;
        this.isLoggedIn = isLoggedIn;
    }
}