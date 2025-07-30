import { Book } from './book';

export type RootStackParamList = {
  Main: undefined;
  BookDetails: { key: string, first_publish_year:number };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  BookListScreen: { title: string; books: Book[] };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResults: undefined;
};

export type FavoritesStackParamList = {
  FavoritesScreen: undefined;
  Search: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
  PrivacyPolicy: undefined;
};