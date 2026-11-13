FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ActivityBackend.csproj .
RUN dotnet restore ActivityBackend.csproj
COPY . .
RUN dotnet publish ActivityBackend.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
ENV ActivityBackend__DataDirectory=/data
ENV ActivityBackend__UploadDirectory=/data/uploads
EXPOSE 8080
VOLUME ["/data"]
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ActivityBackend.dll"]
