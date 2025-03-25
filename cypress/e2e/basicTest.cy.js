describe('Prueba Básica', () => {
    it('Cargar la página y verificar elementos', () => {
      // Visita la página principal
      cy.visit('https://example.cypress.io'); // Puedes cambiar la URL por una de tu elección
  
      // Verifica que el título del sitio está visible
      cy.contains('Cypress.io').should('be.visible');
  
      // Verifica que un enlace específico existe
      cy.get('a').contains('Commands').should('exist');
    });
  });
  