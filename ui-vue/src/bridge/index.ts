import type { WebViewMessage } from '../types/messages';

export type { WebViewMessage } from '../types/messages';

type WebViewHost = NonNullable<Window['chrome']>['webview'];
const getWebView = (): WebViewHost | undefined => window.chrome?.webview;

export function postToHost<TPayload extends Record<string, unknown>>(
  type: string,
  payload = {} as TPayload,
): void {
  const webview = getWebView();
  if (webview) {
    webview.postMessage({ type, payload } satisfies WebViewMessage<TPayload>);
    return;
  }
  console.info('[ui-vue preview]', type, payload);
}

export function subscribeToHost(listener: (message: WebViewMessage) => void): () => void {
  const webview = getWebView();
  if (!webview) return () => undefined;
  const handleMessage = (event: MessageEvent<WebViewMessage>) => {
    const message = event.data;
    if (message && typeof message.type === 'string') listener(message);
  };
  webview.addEventListener('message', handleMessage);
  return () => webview.removeEventListener?.('message', handleMessage);
}
