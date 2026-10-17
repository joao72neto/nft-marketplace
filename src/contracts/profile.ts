export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio?: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name: string;
  bio?: string;
  avatarUrl?: string | null; // Data URL em Base64 conforme Decisão 1
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
