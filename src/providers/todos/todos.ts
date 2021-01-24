import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import PouchDB from 'pouchdb';
/*
  Generated class for the TodosProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TodosProvider {

	data: any;
	db: any;
	remote: any;

  constructor(public http:  HttpClient ) {
    // console.log('Hello TodosProvider Provider');
		this.db = new PouchDB('ionic-offline-todo');
		this.remote = 'db:5984/ionic-offline-todo';

		let options = {
			live: true,
			retry: true,
			continuous: true
		};

		this.db.sync(this.remote, options);
  }

	getTodos() {
	  if (this.data) {
	    return Promise.resolve(this.data);
	  }

	  return new Promise(resolve => {
	    this.db.allDocs({
	      include_docs: true

	    }).then((result) => {
	      this.data = [];

	      result.rows.map((row) => {
	        this.data.push(row.doc);
	      });

	      resolve(this.data);

	      this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
	        this.handleChange(change);
	      });

	    }).catch((error) => {
	      console.log(error);
	    });

	  });

	}

	createTodo(todo){
	  this.db.post(todo);
	}

	updateTodo(todo){
	  this.db.put(todo).catch((err) => {
	    console.log(err);
	  });
	}

	deleteTodo(todo){
	  this.db.remove(todo).catch((err) => {
	    console.log(err);
	  });
	}

	handleChange(change){

	  let changedDoc = null;
	  let changedIndex = null;

	  this.data.forEach((doc, index) => {
	    if(doc._id === change.id){
	      changedDoc = doc;
	      changedIndex = index;
	    }
	  });

	  //A document was deleted
	  if(change.deleted){
	    this.data.splice(changedIndex, 1);
	  }
	  else {

	    //A document was updated
	    if(changedDoc){
	      this.data[changedIndex] = change.doc;
	    }

	    //A document was added
	    else {
	      this.data.push(change.doc);
	    }

	  }

	}

}
