export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
  branch_id?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  token: string;
  password: string;
}

export interface InviteRequest {
  email: string;
  name: string;
  role_id: string;
  branch_id: string;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponseDTO {
  user: AuthUserDTO;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface AuthUserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  branch_ids: string[];
  default_branch_id: string | null;
  permissions: string[];
  metadata: Record<string, unknown>;
}

export interface SessionDTO {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  last_activity: string;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}
