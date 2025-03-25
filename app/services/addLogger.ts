import { error } from "console";

export async function AddLogger(evento:string, modulo:string) {
  try {
    const response = await fetch("http://localhost:3000/api/logger/add",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({evento, modulo})
    });
    if (!response.ok){
      console.error("Error al agregar el logger");
    }
  } catch (error) {
    console.error("Error al agregar logger", error);
  }
}