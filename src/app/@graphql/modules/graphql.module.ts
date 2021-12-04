import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { NgModule } from '@angular/core';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(apollo: Apollo, httpLink: HttpLink){
    // Para capturar los errores de consula y/o de red
    const errorLink = onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors) {
          console.log('Graphql Errors', graphQLErrors);
        }
        if (networkError) {
          console.log('Network Errors', networkError);
        }
    });
    const uri = 'http://localhost:2002/graphql';
    const link = ApolloLink.from(
      [
        errorLink,
        httpLink.create({uri})
      ]
    );
    apollo.create({
      link,
      cache: new InMemoryCache()
    });
  }
 }
