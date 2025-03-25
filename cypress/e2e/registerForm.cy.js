describe('Página de Registro', () => {
    it('Debe cargar la página y mostrar el formulario', () => {
      // Visitar la página donde se encuentra el formulario de registro
      cy.visit('http://localhost:3000/auth/register'); // Ajusta la URL si es diferente
  
      // Verificar que el título y los elementos principales están presentes
      cy.contains('Registrarse').should('be.visible');
      cy.contains('¿Ya tienes un usuario?').should('be.visible');
  
      // Verificar que todos los campos de entrada están presentes
      cy.get('input[placeholder="Usuario"]').should('exist');
      cy.get('input[placeholder="Nombre"]').should('exist');
      cy.get('input[placeholder="Apellido"]').should('exist');
      cy.get('input[placeholder="Email"]').should('exist');
      cy.get('input[placeholder="Contraseña"]').should('exist');
  
      // Verificar que el botón "Registrarse" está presente
      cy.get('button').contains('Registrarse').should('be.visible');
    });
  
    it('Debe permitir al usuario ingresar datos en los campos', () => {
      cy.visit('http://localhost:3000/auth/register');
  
      // Completar los campos
      cy.get('input[placeholder="Usuario"]').type('mi_usuario');
      cy.get('input[placeholder="Nombre"]').type('Juan');
      cy.get('input[placeholder="Apellido"]').type('Pérez');
      cy.get('input[placeholder="Email"]').type('juan.perez@example.com');
      cy.get('input[placeholder="Contraseña"]').type('mi_password123');
  
      // Verificar que los valores fueron ingresados correctamente
      cy.get('input[placeholder="Usuario"]').should('have.value', 'mi_usuario');
      cy.get('input[placeholder="Nombre"]').should('have.value', 'Juan');
      cy.get('input[placeholder="Apellido"]').should('have.value', 'Pérez');
      cy.get('input[placeholder="Email"]').should('have.value', 'juan.perez@example.com');
      cy.get('input[placeholder="Contraseña"]').should('have.value', 'mi_password123');
    });
  
    it('Debe mostrar un mensaje de error si el servidor devuelve un error', () => {
      cy.visit('http://localhost:3000/auth/register');
  
      // Interceptar la solicitud POST al registro y devolver una respuesta de error
      cy.intercept('POST', '/api/register', {
        statusCode: 400,
        body: { error: 'Error al registrar el usuario' },
      });
  
      // Completar el formulario y enviar
      cy.get('input[placeholder="Usuario"]').type('mi_usuario');
      cy.get('input[placeholder="Nombre"]').type('Juan');
      cy.get('input[placeholder="Apellido"]').type('Pérez');
      cy.get('input[placeholder="Email"]').type('juan.perez@example.com');
      cy.get('input[placeholder="Contraseña"]').type('mi_password123');
      cy.get('button').contains('Registrarse').click();
  
      // Verificar que se muestre el mensaje de error
      cy.contains('Error al registrar el usuario').should('be.visible');
    });
  
    it('Debe redirigir al login después de un registro exitoso', () => {
      cy.visit('http://localhost:3000/auth/register');
  
      // Interceptar la solicitud POST y devolver una respuesta exitosa
      cy.intercept('POST', '/api/register', {
        statusCode: 200,
        body: { data: 'Registro exitoso' },
      });
  
      // Completar el formulario y enviar
      cy.get('input[placeholder="Usuario"]').type('mi_usuario');
      cy.get('input[placeholder="Nombre"]').type('Juan');
      cy.get('input[placeholder="Apellido"]').type('Pérez');
      cy.get('input[placeholder="Email"]').type('juan.perez@example.com');
      cy.get('input[placeholder="Contraseña"]').type('mi_password123');
      cy.get('button').contains('Registrarse').click();
  
    });
  });
  