export interface IUser {
    id?: number;
    user_uuid?: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    status: boolean;
    preferred_language?: number;
    profile_pic?: number;
    created_at?: Date;
    updated_at?: Date;
}
