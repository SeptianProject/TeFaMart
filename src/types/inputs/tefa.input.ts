export interface CreateTefaInput {
  name: string;
  major: string;
  description?: string;
  campusId: string;
}

export interface UpdateTefaInput {
  name?: string;
  major?: string;
  description?: string;
  campusId?: string;
}
