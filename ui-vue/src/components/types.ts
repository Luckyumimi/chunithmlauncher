export type EventSlide = {
  image: string;
  date: string;
  title: string;
  body: string;
  alt?: string;
};

export type NewsTab = 'activities' | 'announcements' | 'updates';

export type ViewAction =
  | 'launch-game'
  | 'test-switch'
  | 'open-checkin'
  | 'open-scores'
  | 'view-activity'
  | 'view-recommendation'
  | 'view-profile'
  | 'open-aime-project';
