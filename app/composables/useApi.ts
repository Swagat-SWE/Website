export const useApi = () => {

  const createGuest = async (displayName: string) => {
    const res = await fetch("http://localhost:3001/api/guest", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ displayName })
    });

    return await res.json();
  };

  const guestMe = async () => {
    const res = await fetch("http://localhost:3001/api/guest/me", {
      credentials: "include"
    });

    if (res.status === 401) {
      return { ok: false, guest: null };
    }

    return await res.json();
  };

  return {
    createGuest,
    guestMe
  };
};
