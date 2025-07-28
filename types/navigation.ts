import { Book } from './book';

export type RootStackParamList = {
  Main: undefined;
  BookDetails: { book: Book };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: { query: string };
};

export type FavoritesStackParamList = {
  FavoritesScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
};