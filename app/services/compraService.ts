export const getCompras = async (id:number) => {
    const response = await fetch(`/api/compra/get-by-harvest/${id}`); 
  
    if (!response.ok) {
      throw new Error('Error al obtener las compras');
    }
  
    return response.json();
  };