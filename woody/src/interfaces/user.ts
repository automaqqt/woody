import { Course } from './training';

export interface User {
  id: number
  name: string
}

export interface Score {
  id: number
  player_id: number
  player_name: string
  score: number
  time_passed_in_ms: number
  started_at: number
  mode: string
}

export interface UserState {
  users: User[];
  loggedInUser: User;
  setLoggedInState: (user: User) => void;
}
