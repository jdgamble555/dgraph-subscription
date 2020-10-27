import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { split } from 'apollo-link';
import { ApolloClientOptions } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { WebSocketLink } from 'apollo-link-ws';

// put your endpoint here !!!!!!!!!!!!!!!!!!!

const endpoint = "";

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const http = httpLink.create({
    uri: `https://${endpoint}`
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: `wss://${endpoint}`,
    options: {
      reconnect: true
    }
  });

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    ws,
    http
  );

  return {
    link,
    cache: new InMemoryCache()
  };
}

@NgModule({
  imports: [HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule { }
