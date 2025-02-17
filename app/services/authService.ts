export async function login(username: string, password: string) {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(username + ":" + password),
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!res.ok) {
      return { success: false };
    }
  
    const data = await res.json();
    localStorage.setItem("token", data.token);
    return { success: true };
  }
  