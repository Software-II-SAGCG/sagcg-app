describe('Funcionalidades del Dashboard', () => {
    beforeEach(() => {
      // Visitar la página de inicio de sesión antes de cada prueba
      cy.visit('http://localhost:3000');
      
      // Completar el inicio de sesión con credenciales válidas
      cy.get('input[placeholder="Usuario"]').type('admin');
      cy.get('input[placeholder="Contraseña"]').type('admin');
      cy.get('button').contains('Iniciar Sesión').click();
  
      // Verificar que se redirige al dashboard
      cy.url().should('include', '/dashboard');
    });
  
    it('Debe redirigir al perfil cuando se hace clic en "Perfil"', () => {
      // Hacer clic en el botón "Perfil" del sidebar
      cy.get('a').contains('Perfil').click();
  
      // Verificar que se redirige a la página de perfil
      cy.url().should('include', '/dashboard/profile');
  
      // Verificar que los detalles del usuario son visibles
      cy.contains('Detalles del Usuario').should('be.visible');
      cy.contains('Username:').should('be.visible');
      cy.contains('Nombre:').should('be.visible');
      cy.contains('Apellido:').should('be.visible');
      cy.contains('Email:').should('be.visible');
      cy.contains('Rol:').should('be.visible');
    });
  
    it('Debe cerrar sesión al hacer clic en "Cerrar sesión"', () => {
      // Abrir el menú desplegable de la cuenta
      cy.get('.w-5.h-5').click(); // Selector para el icono de "MoreVertical" en el sidebar
  
      // Hacer clic en el botón "Cerrar sesión"
      cy.contains('Cerrar sesión').click();
  
      // Verificar que se redirige a la página de inicio de sesión
      cy.url().should('eq', 'http://localhost:3000/');
  
      // Verificar que el usuario ya no está autenticado (puedes ajustar esto según el estado de autenticación)
      cy.contains('Iniciar Sesión').should('be.visible');
    });
  });
  
  