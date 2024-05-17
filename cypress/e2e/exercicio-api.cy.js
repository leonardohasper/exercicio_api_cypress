/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import {faker} from '@faker-js/faker';






describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
      cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
    })
    
  });

  it('Deve listar usuários cadastrados', () => {
      cy.request({
        method: 'GET',
        url: '/usuarios',
        body: {
          "quantidade": 1,
          "usuarios": [
            {
              "nome": 'Fulano da Silva',
              "email": "beltrano@qa.com.br",
              "password": "teste",
              "administrador": "true",
              "_id": "0uxuPY0cbmQhpEz1"
            }
          ]
        }
        }).should(response =>{
          expect(response.status).to.equal(200)//status 200 lista usuários

      })
    
  });//OK

  it('Deve cadastrar um usuário com sucesso', () => {
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNTg5NzU4NzQ2LCJleHAiOjE1ODk3Njg3NDZ9.B6TASHV8k9xBerz4NSeFBlAZGSDhZlqESt767M0567I"
    let nomeFaker = faker.person.fullName()
    let emailFaker = faker.internet.email()
    let senha = 'teste'
    cy.cadastrarUsuario(token, nomeFaker, emailFaker, senha).should((response) => {
          expect(response.status).equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
     
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'login',
      body: {
          "email": "fulanoqa.com",//sem '@'
          "password": "teste" 
      }, failOnStatusCode: false
  }).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.email).to.equal('email deve ser um email válido')
      cy.log(response.body.authorization)
  })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNTg5NzU4NzQ2LCJleHAiOjE1ODk3Njg3NDZ9.B6TASHV8k9xBerz4NSeFBlAZGSDhZlqESt767M0567I"
    let nomeFaker = faker.person.fullName()
    let emailFaker = faker.internet.email()
      cy.request({
        method: 'PUT',
        url: 'usuarios' + '/0uxuPY0cbmQhpEz1',
        headers: {authorization: token},
        body: {
          "nome": nomeFaker,
          "email": emailFaker,
          "password": "teste",
          "administrador": "true"
        }
        }).should(response => {
          expect(response.status).to.equal(200)
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })

  });
  

  it('Deve deletar um usuário previamente cadastrado', () => {
    let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNTg5NzU4NzQ2LCJleHAiOjE1ODk3Njg3NDZ9.B6TASHV8k9xBerz4NSeFBlAZGSDhZlqESt767M0567I"
    let nomeFaker = faker.person.fullName()
    let emailFaker = faker.internet.email()
    let senhaFaker = faker.internet.password()
    cy.cadastrarUsuario(token, nomeFaker, emailFaker, senhaFaker).then(response =>{
      let id = response.body._id
        cy.request({
          method:'DELETE',
          url: 'usuarios' + '/' + id,
          headers: {authorization: token}
        })
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body.message).to.equal('Registro excluído com sucesso')
    })
        
      
  });


})
