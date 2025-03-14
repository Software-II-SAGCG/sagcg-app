export const getCompras = async () => {
    const response = await fetch('/api/compra/get');
  
    if (!response.ok) {
      throw new Error('Error al obtener las compras');
    }
  
    return response.json();
  };