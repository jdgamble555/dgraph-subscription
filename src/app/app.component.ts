import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  todos: any[];
  error: any;

  title = 'dgraph-subscription';

  TODO_SUBSCRIPTION = gql`
  subscription {
    queryTodo {
      id
      value
      completed
    }
  }
`;

  todoQuery: any;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.todoQuery = this.apollo.subscribe({
      query: this.TODO_SUBSCRIPTION,
    })
      .subscribe((result) => {
        this.todos = result.data['queryTodo'];
        this.error = result.errors;
      });
  }
}
