export type WebViewMessage<TPayload = Record<string, unknown>> = {
  type: string;
  payload: TPayload;
};

export type InitPayload = {
  version?: string;
  themeColor?: string;
  backgroundImagePath?: string;
};

export type StatusPayload = {
  text?: string;
  color?: string;
};
