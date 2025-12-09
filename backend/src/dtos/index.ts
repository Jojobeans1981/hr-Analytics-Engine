export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeamDto {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  memberIds: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
