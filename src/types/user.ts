export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  credits: number;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}
