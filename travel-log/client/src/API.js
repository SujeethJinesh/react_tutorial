const API_URL = 'http://localhost:1337';

// get request to get all logs from back end
export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}
