export default function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${hostname}${port ? `:${port}` : ""}/api`;
  }

  console.log("Unable to determine API base URL");
  return null;
}
