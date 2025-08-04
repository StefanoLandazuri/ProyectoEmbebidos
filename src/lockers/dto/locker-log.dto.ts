export class LockerLogDto {
  id: number;
  action: string;
  rfid_uid?: string;
  created_at: Date;
  locker: {
    id: number;
    locker_number: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}