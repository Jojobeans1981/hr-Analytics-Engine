export interface UserCreateDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}