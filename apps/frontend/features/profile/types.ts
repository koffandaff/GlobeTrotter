export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  status: string;
  preferredLanguage?: string;
  savedDestinations?: Array<{
    id: string;
    name: string;
    country: string;
    countryCode?: string;
  }>;
}

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  preferredLanguage?: string;
}
