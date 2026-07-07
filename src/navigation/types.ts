import type { PlayerInfo } from '../components/board/types';

export type RootStackParamList = {
  Splash: undefined;
  AuthStack: undefined;
  MainStack: undefined;
};

export type MainStackParamList = {
  BottomTabs: undefined;
  Team: { matchId: string };
  Lobby: undefined;
  Profile: undefined;
  Game: { matchId: string; players: PlayerInfo[] };
  MatchResult: undefined;
  AddVideo: undefined;
};

export type BottomTabParamList = {
  Tutorial: undefined;
  Rules: undefined;
  Home: undefined;
  Notifications: undefined;
  Settings: undefined;
};
