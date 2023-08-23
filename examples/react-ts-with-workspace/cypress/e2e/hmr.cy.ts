describe('Vite HMR is optimized for javascript workspaces re-exporting modules', () => {
  it('passes', () => {
    cy.intercept('@fs/**/colors-js/**', {log: false}).as('hmr');
    cy.visit('http://localhost:5173');
    cy.contains('Gold (metallic)');
    cy.get('@hmr.all').then(requests => {
      const paths = requests.map(r => r.request.url.match(/\/colors-js\/(.*)/)[1]);

      expect(paths).to.contain('src/components/yellow/GoldMetallic.jsx');
      expect(paths).not.to.contain('src/components/yellow/Amber.jsx');
    });
  });
});

describe('Vite HMR is optimized for typescript workspaces re-exporting modules', () => {
  it('passes', () => {
    cy.intercept('@fs/**/colors-ts/**', {log: false}).as('hmr');
    cy.visit('http://localhost:5173');
    cy.contains('Cobalt blue');
    cy.get('@hmr.all').then(requests => {
      const paths = requests.map(r => r.request.url.match(/\/colors-ts\/(.*)/)[1]);

      expect(paths).to.contain('src/components/blue/CobaltBlue.tsx');
      expect(paths).not.to.contain('src/components/blue/Azure.tsx');
    });
  });
});
