// src/types/licence.ts
export type LicenceStatus = "active" | "expired" | "revoked" | string;

export interface Licence {
  id: string;
  license_key: string;
  plan: string;
  seats: number;
  months: number;
  cabinet_id?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  status: LicenceStatus;
  notes?: string | null;
}

export interface LicencesListResponse {
  data: Licence[];
}

export interface CreateLicenceBody {
  plan: string;
  seats: number;
  months: number;
  cabinet_id?: string;
  notes?: string | null;
}
