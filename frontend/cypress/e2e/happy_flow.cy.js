describe('Host Happy Path to create listing', () => {
  it('should nagivate to the home page successfully', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', "localhost:3000");
  });

  it('should nagivate to the register page successfully', () => {
    cy.get("#registerBtn").click();
    cy.url().should('include', "localhost:3000/register");
  });

  it('should be able to register user', () => {
    cy.get("#registerEmail").focus().type("abc@gmail.com");
    cy.get("#registerPassword").focus().type("1234");
    cy.get("#registerConfirmPassword").focus().type("1234");
    cy.get("#registerName").focus().type("ABC");
    cy.get("#registerUserBtn").click();
    cy.wait(1000);
    cy.url().should('not.contain', "/register");
  });

  it('should nagivate to my listing page', () => {
    cy.get("#myListingBtn").click();
    cy.url().should('include', "/listing/my");
    cy.wait(1000);
  });
  it('should nagivate to new listing page', () => {
    cy.get("#newListingBtn").click();
    cy.url().should('include', "/listing/new");
  });

  it('should create a new listing', () => {
    cy.get("#newListingTitle").focus().type("Test Listing");
    cy.get("#newListingStreet").focus().type("123 Street");
    cy.get("#newListingCity").focus().type("Sydney");
    cy.get("#newListingState").focus().type("NSW");
    cy.get("#newListingPostcode").focus().type("2010");
    cy.get("#newListingCountry").focus().type("Australia");
    cy.get("#newListingPrice").focus().type("200");
    cy.get("#newListingNumOfBedRooms").focus().type("2");
    cy.get("#newListingNumOfBathrooms").focus().type("1");
    cy.get("#newListingNumOfBeds").focus().type("2");
    cy.get("#newListingType").select("house");
    cy.get("#pet-check").click();
    cy.get("#garden-check").click();
    cy.get("#imageUploadBtn").click();
    cy.get("input[type=file][accept='image/*']").selectFile('./cypress/e2e/test_property.jpeg', {force: true});
    cy.get("#submitListingBtn").click();
    cy.wait(1000);
    cy.url().should('include', "/listing/my");
  });

  it('should able to log out', () => {
    cy.get("#logoutBtn").click();
    cy.url().should('not.contain', "/listing/my");
  });

  it('should able to log back in', () => {
    cy.get("#loginBtn").click();
    cy.url().should('include', "login");
    cy.get("#loginEmail").focus().type("abc@gmail.com");
    cy.get("#loginPassword").focus().type("1234");
    cy.get("#loginUserBtn").click();
    cy.url().should('include', "listing/my");
  });

  it('should able to make listing go live', () => {
    cy.get("#golive-0").click();

    // Always choose 2022 Dec full month to go live.
    cy.get(".rdrMonthPicker select").select("11");
    cy.get(".rdrYearPicker select").select("2022");

    cy.get(".rdrDayStartOfMonth").click();
    cy.get(".rdrDayEndOfMonth").click();

    cy.get("#publishBtn").click();
  });

  it('should able to log out', () => {
    cy.get("#logoutBtn").click();
    cy.url().should('not.contain', "/listing/my");
  });
});

describe('User Happy Path to make booking', () => {
  it('should nagivate to the home page successfully', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', "localhost:3000");
  });

  it('should nagivate to the register page successfully', () => {
    cy.get("#registerBtn").click();
    cy.url().should('include', "localhost:3000/register");
  });

  it('should be able to register user', () => {
    cy.get("#registerEmail").focus().type("xyz@gmail.com");
    cy.get("#registerPassword").focus().type("1234");
    cy.get("#registerConfirmPassword").focus().type("1234");
    cy.get("#registerName").focus().type("XYZ");
    cy.get("#registerUserBtn").click();
    cy.wait(1000);
    cy.url().should('not.contain', "/register");
  });

  it('should nagivate to single listing page', () => {
    // Always pick the first listing.
    cy.get("#listing-0").click();
    cy.url().should('include', "/listing/");
    cy.wait(1000);
  });

  it('should book with selected date', () => {
   // Always choose to book the whole 2022 Dec.
   cy.get(".rdrMonthPicker select").select("11");
   cy.get(".rdrYearPicker select").select("2022");

   cy.get(".rdrDayStartOfMonth").click();
   cy.get(".rdrDayEndOfMonth").click();

   cy.get("#bookBtn").click();
  });

  it('should nagviate to my booking page', () => {
    // Always choose to book the whole Dedc
    cy.get("#checkBookBtn").click();
    cy.url().should('include', "/booking");
   });

   it('should able to log out', () => {
    cy.get("#logoutBtn").click();
    cy.url().should('not.contain', "/listing/my");
  });

});

describe('Host Happy Path to unpublish listing', () => {
  it('should able to log back in', () => {
    cy.get("#loginBtn").click();
    cy.url().should('include', "login");
    cy.get("#loginEmail").focus().type("abc@gmail.com");
    cy.get("#loginPassword").focus().type("1234");
    cy.get("#loginUserBtn").click();
    cy.url().should('include', "listing/my");
  });

  it('should able to unpublish listing', () => {
    cy.get("#unpublish-0").click();
  });

  it('should able to edit listing', () => {
    cy.get("#edit-listing-0").click();
    cy.url().should('contain', "/listing/edit");

    // Update thumb nail.
    cy.get("#update-image-0").click();
    cy.get("input[type=file][accept='image/*']").selectFile('./cypress/e2e/update_property.jpeg', {force: true});

    // Update title
    cy.get("#newListingTitle").focus().type("Edited");

    // Update price
    cy.get("#newListingPrice").focus().type('{backspace}');
    cy.get("#newListingPrice").focus().type('{backspace}');
    cy.get("#newListingPrice").focus().type('{backspace}');
    cy.get("#newListingPrice").focus().type('{backspace}');
    cy.get("#newListingPrice").focus().type("320");

    // Add amenties
    cy.get("#kitchen-check").click();
    cy.get("#wifi-check").click();

    cy.get("#submitListingBtn").click();
    cy.wait(1000);
    cy.url().should('include', "/listing/my");
  });

  it('should able to log out', () => {
    cy.get("#logoutBtn").click();
    cy.url().should('not.contain', "/listing/my");
  });
});