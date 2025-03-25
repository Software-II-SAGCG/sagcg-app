describe('Página de Inicio de Sesión', () => {
    it('Cargar la página y verificar los elementos principales', () => {
      // Visita la URL de tu aplicación
      cy.visit('http://localhost:3000');
  
      // Verifica que el título de la página sea visible
      cy.contains('SAGCG').should('be.visible');
      cy.contains('Iniciar Sesión').should('be.visible');
  
      // Verifica que los campos de entrada están presentes
      cy.get('input[placeholder="Usuario"]').should('exist');
      cy.get('input[placeholder="Contraseña"]').should('exist');
  
      // Verifica que el botón de "Iniciar Sesión" está presente
      cy.get('button').contains('Iniciar Sesión').should('be.visible');
    });
  });
  