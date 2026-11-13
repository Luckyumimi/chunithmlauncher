using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var dataDirectory = builder.Configuration["ActivityBackend:DataDirectory"] ?? "/data";
var uploadDirectory = builder.Configuration["ActivityBackend:UploadDirectory"] ?? Path.Combine(dataDirectory, "uploads");
Directory.CreateDirectory(dataDirectory);
Directory.CreateDirectory(uploadDirectory);
var databasePath = Path.Combine(dataDirectory, "activity.db");
var connectionString = new SqliteConnectionStringBuilder { DataSource = databasePath }.ToString();
var sessionSecret = builder.Configuration["ActivityBackend:SessionSecret"] ?? "change-this-session-secret";
var cookieName = "activity_admin";
var allowedOrigins = builder.Configuration.GetSection("ActivityBackend:AllowedOrigins").Get<string[]>() ?? ["https://launcher.chunithm.local"];

await Database.InitializeAsync(connectionString, builder.Configuration);

var app = builder.Build();
app.UseStaticFiles();
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api") && context.Request.Method != HttpMethods.Get)
    {
        context.Response.Headers["Cache-Control"] = "no-store";
    }
    await next();
});
app.UseCors(policy => policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod());

app.MapGet("/", () => Results.Redirect("/admin"));
app.MapGet("/api/v1/activity-feed", async (string? language, CancellationToken cancellationToken) =>
{
    var items = await Database.GetPublicItemsAsync(connectionString, uploadDirectory, cancellationToken);
    return Results.Ok(new { version = 1, generatedAt = DateTimeOffset.UtcNow, items });
});
app.MapGet("/uploads/{fileName}", (string fileName) =>
{
    var safeName = Path.GetFileName(fileName);
    var path = Path.Combine(uploadDirectory, safeName);
    return File.Exists(path) ? Results.File(path, ContentTypes.ForPath(path)) : Results.NotFound();
});

app.MapPost("/api/v1/admin/login", async (LoginRequest request, HttpContext context, CancellationToken cancellationToken) =>
{
    var user = await Database.GetAdminAsync(connectionString, request.Username, cancellationToken);
    if (user is null || !PasswordHasher.Verify(request.Password, user.Value.PasswordHash))
        return Results.Unauthorized();
    var forwardedHttps = context.Request.Headers.TryGetValue("X-Forwarded-Proto", out var proto) && proto.ToString().Equals("https", StringComparison.OrdinalIgnoreCase);
    context.Response.Cookies.Append(cookieName, SessionToken.Create(request.Username, sessionSecret), new CookieOptions { HttpOnly = true, SameSite = SameSiteMode.Lax, Secure = context.Request.IsHttps || forwardedHttps, MaxAge = TimeSpan.FromHours(12) });
    return Results.Ok(new { authenticated = true });
});
app.MapPost("/api/v1/admin/logout", (HttpContext context) =>
{
    context.Response.Cookies.Delete(cookieName);
    return Results.NoContent();
});
app.MapGet("/api/v1/admin/session", (HttpContext context) => Results.Ok(new { authenticated = IsAuthenticated(context, sessionSecret, cookieName) }));

var admin = app.MapGroup("/api/v1/admin/events");
admin.AddEndpointFilter(async (invocationContext, next) =>
{
    var httpContext = invocationContext.HttpContext;
    return IsAuthenticated(httpContext, sessionSecret, cookieName) ? await next(invocationContext) : Results.Unauthorized();
});
admin.MapGet("", async (CancellationToken cancellationToken) => Results.Ok(await Database.GetAllItemsAsync(connectionString, uploadDirectory, cancellationToken)));
admin.MapPost("", async (HttpRequest request, CancellationToken cancellationToken) =>
{
    var form = await request.ReadFormAsync(cancellationToken);
    var input = EventInput.FromForm(form);
    var validation = input.Validate();
    if (validation is not null) return Results.BadRequest(new { error = validation });
    var id = Guid.NewGuid().ToString("N");
    string imageUrl;
    try { imageUrl = await SaveImageAsync(form.Files.GetFile("image"), id, uploadDirectory, cancellationToken); }
    catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    var item = input.ToItem(id, imageUrl);
    await Database.InsertAsync(connectionString, item, cancellationToken);
    return Results.Created($"/api/v1/admin/events/{id}", item);
});
admin.MapPut("/{id}", async (string id, HttpRequest request, CancellationToken cancellationToken) =>
{
    var current = await Database.GetByIdAsync(connectionString, uploadDirectory, id, cancellationToken);
    if (current is null) return Results.NotFound();
    var form = await request.ReadFormAsync(cancellationToken);
    var input = EventInput.FromForm(form, current);
    var validation = input.Validate();
    if (validation is not null) return Results.BadRequest(new { error = validation });
    var imageUrl = current.ImageUrl;
    if (form.Files.GetFile("image") is { } file)
    {
        try { imageUrl = await SaveImageAsync(file, id, uploadDirectory, cancellationToken); }
        catch (InvalidOperationException ex) { return Results.BadRequest(new { error = ex.Message }); }
    }
    var item = input.ToItem(id, imageUrl);
    await Database.UpdateAsync(connectionString, item, cancellationToken);
    RemoveStoredImage(current.ImageUrl, uploadDirectory, imageUrl);
    return Results.Ok(item);
});
admin.MapDelete("/{id}", async (string id, CancellationToken cancellationToken) =>
{
    var item = await Database.GetByIdAsync(connectionString, uploadDirectory, id, cancellationToken);
    if (item is null) return Results.NotFound();
    await Database.DeleteAsync(connectionString, id, cancellationToken);
    RemoveStoredImage(item.ImageUrl, uploadDirectory, null);
    return Results.NoContent();
});

app.MapFallbackToFile("admin/index.html");
await app.RunAsync();

static bool IsAuthenticated(HttpContext context, string secret, string cookieName)
    => context.Request.Cookies.TryGetValue(cookieName, out var token) && SessionToken.Verify(token, secret);

static async Task<string> SaveImageAsync(IFormFile? file, string id, string uploadDirectory, CancellationToken cancellationToken)
{
    if (file is null || file.Length == 0) throw new InvalidOperationException("必须上传活动图片");
    if (file.Length > 10 * 1024 * 1024) throw new InvalidOperationException("图片不能超过 10 MB");
    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
    if (extension is not ".png" and not ".jpg" and not ".jpeg" and not ".webp") throw new InvalidOperationException("只支持 PNG、JPG、JPEG 或 WebP 图片");
    var fileName = $"{id}{extension}";
    var path = Path.Combine(uploadDirectory, fileName);
    await using var output = File.Create(path);
    await file.CopyToAsync(output, cancellationToken);
    return $"/uploads/{fileName}";
}

static void RemoveStoredImage(string? imageUrl, string uploadDirectory, string? keepImageUrl)
{
    if (string.IsNullOrWhiteSpace(imageUrl) || imageUrl == keepImageUrl) return;
    try
    {
        var fileName = Path.GetFileName(imageUrl);
        var path = Path.Combine(uploadDirectory, fileName);
        if (File.Exists(path)) File.Delete(path);
    }
    catch { }
}

static class ContentTypes
{
    public static string ForPath(string path) => Path.GetExtension(path).ToLowerInvariant() switch
    {
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".webp" => "image/webp",
        _ => "application/octet-stream",
    };
}

record LoginRequest(string Username, string Password);

record ActivityItem(string Id, string Title, string Description, string? OriginalUrl, string ImageUrl, DateTimeOffset PublishedAt, DateTimeOffset? ExpiresAt, int SortOrder, bool Enabled);

record EventInput(string Title, string Description, string? OriginalUrl, DateTimeOffset PublishedAt, DateTimeOffset? ExpiresAt, int SortOrder, bool Enabled)
{
    public static EventInput FromForm(IFormCollection form, ActivityItem? current = null)
    {
        static string Get(IFormCollection f, string key, string fallback = "") => f.TryGetValue(key, out var value) ? value.ToString() : fallback;
        static DateTimeOffset ParseDate(string value, DateTimeOffset fallback) => DateTimeOffset.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var result) ? result : fallback;
        return new(
            Get(form, "title", current?.Title ?? ""),
            Get(form, "description", current?.Description ?? ""),
            Get(form, "originalUrl", current?.OriginalUrl ?? ""),
            ParseDate(Get(form, "publishedAt"), current?.PublishedAt ?? DateTimeOffset.UtcNow),
            string.IsNullOrWhiteSpace(Get(form, "expiresAt")) ? current?.ExpiresAt : ParseDate(Get(form, "expiresAt"), current?.ExpiresAt ?? DateTimeOffset.UtcNow),
            int.TryParse(Get(form, "sortOrder"), out var sortOrder) ? sortOrder : current?.SortOrder ?? 0,
            !form.TryGetValue("enabled", out var enabled) ? current?.Enabled ?? true : enabled.ToString() is "true" or "on" or "1");
    }

    public string? Validate()
    {
        if (string.IsNullOrWhiteSpace(Title) || Title.Length > 120) return "标题不能为空且不能超过 120 个字符";
        if (Description.Length > 4000) return "描述不能超过 4000 个字符";
        if (!string.IsNullOrWhiteSpace(OriginalUrl))
        {
            if (!Uri.TryCreate(OriginalUrl, UriKind.Absolute, out var uri) || uri.Scheme is not ("http" or "https")) return "原文链接必须是 http 或 https 地址";
        }
        return null;
    }

    public ActivityItem ToItem(string id, string imageUrl) => new(id, Title.Trim(), Description.Trim(), string.IsNullOrWhiteSpace(OriginalUrl) ? null : OriginalUrl.Trim(), imageUrl, PublishedAt, ExpiresAt, SortOrder, Enabled);
}

static class Database
{
    public static async Task InitializeAsync(string connectionString, IConfiguration configuration)
    {
        await using var connection = new SqliteConnection(connectionString);
        await connection.OpenAsync();
        var command = connection.CreateCommand();
        command.CommandText = """
            CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, password_hash TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, original_url TEXT NULL, image_url TEXT NOT NULL, published_at TEXT NOT NULL, expires_at TEXT NULL, sort_order INTEGER NOT NULL, enabled INTEGER NOT NULL);
            """;
        await command.ExecuteNonQueryAsync();
        var username = configuration["ActivityBackend:AdminUsername"] ?? "admin";
        var password = configuration["ActivityBackend:AdminPassword"] ?? "change-me-now";
        var insert = connection.CreateCommand();
        insert.CommandText = "INSERT OR IGNORE INTO admins (username, password_hash) VALUES ($username, $hash)";
        insert.Parameters.AddWithValue("$username", username);
        insert.Parameters.AddWithValue("$hash", PasswordHasher.Hash(password));
        await insert.ExecuteNonQueryAsync();
    }

    public static async Task<(string Username, string PasswordHash)?> GetAdminAsync(string cs, string username, CancellationToken ct)
    {
        await using var c = new SqliteConnection(cs); await c.OpenAsync(ct); var cmd = c.CreateCommand(); cmd.CommandText = "SELECT username,password_hash FROM admins WHERE username=$username"; cmd.Parameters.AddWithValue("$username", username); await using var r = await cmd.ExecuteReaderAsync(ct); return await r.ReadAsync(ct) ? (r.GetString(0), r.GetString(1)) : null;
    }

    public static Task<List<ActivityItem>> GetPublicItemsAsync(string cs, string uploadDirectory, CancellationToken ct) => GetItemsAsync(cs, uploadDirectory, true, ct);
    public static Task<List<ActivityItem>> GetAllItemsAsync(string cs, string uploadDirectory, CancellationToken ct) => GetItemsAsync(cs, uploadDirectory, false, ct);
    private static async Task<List<ActivityItem>> GetItemsAsync(string cs, string uploadDirectory, bool onlyPublic, CancellationToken ct)
    {
        var list = new List<ActivityItem>(); await using var c = new SqliteConnection(cs); await c.OpenAsync(ct); var cmd = c.CreateCommand(); cmd.CommandText = "SELECT id,title,description,original_url,image_url,published_at,expires_at,sort_order,enabled FROM events"; await using var r = await cmd.ExecuteReaderAsync(ct); while (await r.ReadAsync(ct)) list.Add(ReadItem(r, uploadDirectory)); if (onlyPublic) { var now = DateTimeOffset.UtcNow; list = list.Where(item => item.Enabled && item.PublishedAt <= now && (item.ExpiresAt is null || item.ExpiresAt > now)).ToList(); } return list.OrderBy(item => item.SortOrder).ThenByDescending(item => item.PublishedAt).ToList();
    }
    public static async Task<ActivityItem?> GetByIdAsync(string cs, string uploadDirectory, string id, CancellationToken ct) { var items = await GetItemsAsync(cs, uploadDirectory, false, ct); return items.FirstOrDefault(x => x.Id == id); }
    public static async Task InsertAsync(string cs, ActivityItem item, CancellationToken ct) => await ExecuteAsync(cs, item, "INSERT INTO events (id,title,description,original_url,image_url,published_at,expires_at,sort_order,enabled) VALUES ($id,$title,$description,$url,$image,$published,$expires,$sort,$enabled)", ct);
    public static async Task UpdateAsync(string cs, ActivityItem item, CancellationToken ct) => await ExecuteAsync(cs, item, "UPDATE events SET title=$title,description=$description,original_url=$url,image_url=$image,published_at=$published,expires_at=$expires,sort_order=$sort,enabled=$enabled WHERE id=$id", ct);
    private static async Task ExecuteAsync(string cs, ActivityItem item, string sql, CancellationToken ct) { await using var c = new SqliteConnection(cs); await c.OpenAsync(ct); var cmd = c.CreateCommand(); cmd.CommandText = sql; AddParameters(cmd, item); await cmd.ExecuteNonQueryAsync(ct); }
    public static async Task DeleteAsync(string cs, string id, CancellationToken ct) { await using var c = new SqliteConnection(cs); await c.OpenAsync(ct); var cmd = c.CreateCommand(); cmd.CommandText = "DELETE FROM events WHERE id=$id"; cmd.Parameters.AddWithValue("$id", id); await cmd.ExecuteNonQueryAsync(ct); }
    private static void AddParameters(SqliteCommand cmd, ActivityItem i) { cmd.Parameters.AddWithValue("$id", i.Id); cmd.Parameters.AddWithValue("$title", i.Title); cmd.Parameters.AddWithValue("$description", i.Description); cmd.Parameters.AddWithValue("$url", (object?)i.OriginalUrl ?? DBNull.Value); cmd.Parameters.AddWithValue("$image", i.ImageUrl); cmd.Parameters.AddWithValue("$published", i.PublishedAt.ToString("O")); cmd.Parameters.AddWithValue("$expires", (object?)i.ExpiresAt?.ToString("O") ?? DBNull.Value); cmd.Parameters.AddWithValue("$sort", i.SortOrder); cmd.Parameters.AddWithValue("$enabled", i.Enabled ? 1 : 0); }
    private static ActivityItem ReadItem(SqliteDataReader r, string uploadDirectory) => new(r.GetString(0), r.GetString(1), r.GetString(2), r.IsDBNull(3) ? null : r.GetString(3), r.GetString(4), DateTimeOffset.Parse(r.GetString(5), CultureInfo.InvariantCulture), r.IsDBNull(6) ? null : DateTimeOffset.Parse(r.GetString(6), CultureInfo.InvariantCulture), r.GetInt32(7), r.GetInt32(8) == 1);
}

static class PasswordHasher
{
    public static string Hash(string password) { var salt = RandomNumberGenerator.GetBytes(16); var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 120_000, HashAlgorithmName.SHA256, 32); return $"pbkdf2$120000${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}"; }
    public static bool Verify(string password, string encoded) { var p = encoded.Split('$'); if (p.Length != 4 || !int.TryParse(p[1], out var iterations)) return false; var hash = Rfc2898DeriveBytes.Pbkdf2(password, Convert.FromBase64String(p[2]), iterations, HashAlgorithmName.SHA256, 32); return CryptographicOperations.FixedTimeEquals(hash, Convert.FromBase64String(p[3])); }
}

static class SessionToken
{
    public static string Create(string username, string secret) { var payload = $"{username}|{DateTimeOffset.UtcNow.AddHours(12).ToUnixTimeSeconds()}"; var signature = Sign(payload, secret); return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{payload}|{signature}")); }
    public static bool Verify(string token, string secret) { try { var raw = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(token)).Split('|'); return raw.Length == 3 && long.TryParse(raw[1], out var expiry) && expiry > DateTimeOffset.UtcNow.ToUnixTimeSeconds() && CryptographicOperations.FixedTimeEquals(Convert.FromHexString(raw[2]), Convert.FromHexString(Sign($"{raw[0]}|{raw[1]}", secret))); } catch { return false; } }
    private static string Sign(string value, string secret) => Convert.ToHexString(HMACSHA256.HashData(System.Text.Encoding.UTF8.GetBytes(secret), System.Text.Encoding.UTF8.GetBytes(value)));
}
