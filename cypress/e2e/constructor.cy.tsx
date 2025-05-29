describe('Конструктор бургера!', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    window.localStorage.setItem('accessToken', 'Bearer token123');
    window.localStorage.setItem('refreshToken', 'refresh-token123');
	
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.clear();
  });

  it('ингредиенты загружаются?', () => {
    cy.get('img').should('have.length.at.least', 1);
  });

  it('добавляется булка по клику?', () => {
    cy.get('[class*="mt-8"]').eq(0).click();
    cy.get('[class*="mr-4"]').should('contain', 'Булка 1');
  });

  it('добавляется начинка по клику?', () => {
    cy.get('[class*="mt-8"]').eq(3).click();
    cy.get('[class*="mr-2"]').should('contain', 'Начинка 2');
  });

  it('открывает модальное окно с данными ингредиента?', () => {
    cy.get('.mt-2.mb-2').eq(0).click();
    cy.get('[id*="modals"]').should('contain', 'Ингредиент');
  });

  it('закрывает модальное окно с данными ингредиента?', () => {
    cy.get('.mt-2.mb-2').eq(0).click();
    cy.get('[xmlns*="http://www.w3.org/2000/svg"]').eq(0).click({force: true});
    cy.get('[id*="modals"]').should('not.contain', 'Ингредиент');
  });
  
  it('закрывает модальное окно с данными ингредиента? (оверлей)', () => {
    cy.get('.mt-2.mb-2').eq(0).click();
    cy.get('[class*="RuQycGaRTQNbnIEC5d3Y"]').eq(0).click({force: true});
    cy.get('[id*="modals"]').should('not.contain', 'Ингредиент');
  });

  it('создаёт заказ и показывает его данные?', () => {
	cy.get('[class*="mt-8"]').eq(0).click();  // булофка
	cy.get('[class*="mt-8"]').eq(3).click();  // не булка
	cy.get('[type*="button"]').contains('Оформить заказ').click();
	cy.get('[class*="text"]').should('contain', '12345');
	cy.get('[class*="text"]').should('contain', 'идентификатор заказа');
	cy.get('[class*="RuQycGaRTQNbnIEC5d3Y"]').eq(0).click({force: true});
  });
}); 