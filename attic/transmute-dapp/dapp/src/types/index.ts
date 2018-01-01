export interface CharacterState {
  id: string;
  name: string;
  gender: string;
  rating: number;
}

export interface UserState {
  id: number;
  name: string;
  color: string;
  isLoggedIn: boolean;
}

export interface CommentState {
  id: number;
  value: string;
  userId: number;
  characterId: string;
}

export interface RatingState {
  value: number;
  userId: number;
  characterId: string;
}

export interface RatingsState {
  [key: string]: RatingState;
}

export interface StoreState {
  characters: CharacterState[];
  characterDetails: CharacterState;
  users: UserState[];
  comments: CommentState[];
  ratings: RatingsState;
}
