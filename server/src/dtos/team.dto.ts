export interface TeamCreateDto {
  name: string;
  description?: string;
  memberIds: string[];
  managerId: string;
}

export interface TeamResponseDto {
  id: string;
  name: string;
  description?: string;
  members: Array<{
    id: string;
    email: string;
    name: string;
  }>;
  manager: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamUpdateDto extends Partial<TeamCreateDto> {}