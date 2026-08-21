// MuNET 门户页面导航与返回按钮注入。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Text.Json;
using Microsoft.Web.WebView2.Core;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private void OpenMuNetPage(UrlPayload payload)
    {
        var url = payload.Url;

        if (string.IsNullOrWhiteSpace(url)
            || !Uri.TryCreate(url, UriKind.Absolute, out var uri)
            || uri.Scheme is not ("http" or "https"))
        {
            SetStatus("MuNET 链接无效", "#ff5a6a");
            return;
        }

        if (WebView.CoreWebView2 is null)
        {
            SetStatus("MuNET 页面尚未准备好", "#ff5a6a");
            return;
        }

        _isMuNetPage = true;
        WebView.CoreWebView2.Navigate(uri.AbsoluteUri);
    }

    private async void OnNavigationCompleted(object? sender, CoreWebView2NavigationCompletedEventArgs e)
    {
        if (_isMuNetPage)
        {
            await InjectMuNetBackButtonAsync();
        }
        else
        {
            SendInit();
            _ = CheckAnnouncementAsync();
        }
    }

    private async Task InjectMuNetBackButtonAsync()
    {
        if (WebView.CoreWebView2 is null)
        {
            return;
        }

        const string script = """
            (() => {
                if (document.getElementById('chunithm-launcher-back')) return;
                const button = document.createElement('button');
                button.id = 'chunithm-launcher-back';
                button.type = 'button';
                button.textContent = '\u2190 返回启动器';
                button.style.cssText = 'position:fixed;top:16px;left:16px;z-index:2147483647;padding:9px 14px;border:1px solid rgba(255,255,255,.35);border-radius:10px;background:rgba(0,0,0,.82);color:#fff;font:600 13px Microsoft YaHei,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.35);';
                button.addEventListener('click', () => window.chrome.webview.postMessage({ type: 'return-to-launcher', payload: {} }));
                document.documentElement.appendChild(button);
            })();
            """;

        try
        {
            await WebView.CoreWebView2.ExecuteScriptAsync(script);
        }
        catch
        {
            SetStatus("MuNET 返回按钮注入失败", "#ff5a6a");
        }
    }

    private void ReturnToLauncher()
    {
        _isMuNetPage = false;
        WebView.CoreWebView2?.Navigate(new Uri(ResolveUiIndexPath()).AbsoluteUri);
    }
}
