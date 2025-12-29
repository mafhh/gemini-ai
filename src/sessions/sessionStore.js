// In-memory session store (POC)
// Keyed by tenantId + customerId

const sessions = {};

export function getSession(tenantId, customerId) {
  if (!sessions[tenantId]) {
    sessions[tenantId] = {};
  }

  if (!sessions[tenantId][customerId]) {
    sessions[tenantId][customerId] = [];
  }

  return sessions[tenantId][customerId];
}

export function addMessage(tenantId, customerId, role, content) {
  const session = getSession(tenantId, customerId);

  session.push({
    role,
    content,
    timestamp: Date.now()
  });

  // Optional safety limit (last 10 messages)
  if (session.length > 10) {
    session.shift();
  }
}
