const API_URL = 'http://localhost:1337';

// get request to get all logs from back end
export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

// get request to get all logs from back end
export async function createLogEntry(entry) {
  const response = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  return response.json();
}
