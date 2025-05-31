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
  
  Cypress.Commands.add('addIngredient', (i) => {
    cy.get('[class*="mt-8"]').eq(i).click();
  });
  
  Cypress.Commands.add('clickIngredient', (i) => {
    cy.get('.mt-2.mb-2').eq(i).click();
  });

  it('ингредиенты загружаются?', () => {
    cy.get('img').should('have.length.at.least', 1);
  });

  it('добавляется булка по клику?', () => {
	cy.addIngredient(0);
    cy.get('[class*="mr-4"]').should('contain', 'Булка 1');
  });

  it('добавляется начинка по клику?', () => {
	cy.addIngredient(3);
    cy.get('[class*="mr-2"]').should('contain', 'Начинка 2');
  });

  it('открывает модальное окно с данными ингредиента?', () => {
	cy.clickIngredient(0);
    cy.get('[id*="modals"]').should('contain', 'Ингредиент');
    cy.get('[id*="modals"]').should('contain', 'Булка 1');
    cy.get('[id*="modals"]').should('contain', 'Калории, ккал').parent().should('contain', '420');
    cy.get('[id*="modals"]').should('contain', 'Белки, г').parent().should('contain', '80');
    cy.get('[id*="modals"]').should('contain', 'Жиры, г').parent().should('contain', '24');
    cy.get('[id*="modals"]').should('contain', 'Углеводы, г').parent().should('contain', '53');
  });

  it('закрывает модальное окно с данными ингредиента?', () => {
    cy.clickIngredient(0);
    cy.get('[xmlns*="http://www.w3.org/2000/svg"]').eq(0).click({force: true});
    cy.get('[id*="modals"]').should('not.contain', 'Ингредиент');
  });
  
  it('закрывает модальное окно с данными ингредиента? (оверлей)', () => {
    cy.clickIngredient(0);
    cy.get('[class*="RuQycGaRTQNbnIEC5d3Y"]').eq(0).click({force: true});
    cy.get('[id*="modals"]').should('not.contain', 'Ингредиент');
  });

  it('создаёт заказ и показывает его данные?', () => {
	cy.addIngredient(0);  // булофка
	cy.addIngredient(3);  // не булка
	cy.get('[type*="button"]').contains('Оформить заказ').click();
	cy.get('[class*="text"]').should('contain', '12345');
	cy.get('[class*="text"]').should('contain', 'идентификатор заказа');
	cy.get('[class*="RuQycGaRTQNbnIEC5d3Y"]').eq(0).click({force: true});
	cy.get('[data-testid*="bunElemTop"]').should('contain', 'Выберите булки');
	cy.get('[data-testid*="fillingElem"]').should('contain', 'Выберите начинку');
	cy.get('[data-testid*="bunElemBottom"]').should('contain', 'Выберите булки');
  });
}); 