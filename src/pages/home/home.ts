import {Component} from "@angular/core";
import {NavController, AlertController} from 'ionic-angular';
import {TodosProvider} from './../../providers/todos/todos';

@Component({
	templateUrl: 'home.html'
})
export class HomePage {

	todos: any;

	constructor(private nav: NavController, private todoService: TodosProvider, private alertController: AlertController) {}

	ionViewWillEnter(){
		this.todoService.getTodos()
			.then((data) => {
				this.todos = data;
			});
	}

	// ionViewDidEnter(){
	// 	this.todoService.getTodos()
	// 		.then((data) => {
	// 			this.todos = data;
	// 		});
	// }

	createTodo(){

		let prompt = this.alertController.create({
			title: 'Add',
			message: 'What do you need to do?',
			inputs: [
				{
					name: 'title',
					placeholder: 'put your todo here...'
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.todoService.createTodo({title: data.title});
					}
				}
			]
		});

		//this.nav.present(prompt);
		prompt.present();

	}

	updateTodo(todo){
		let prompt = this.alertController.create({
			title: 'Edit',
			message: 'Change your mind?',
			inputs: [
				{
					name: 'title',
					value: todo.title
				}
			],
			buttons: [
				{
					text: 'Cancel'
				},
				{
					text: 'Save',
					handler: data => {
						this.todoService.updateTodo({
							_id: todo._id,
							_rev: todo._rev,
							title: data.title
						});
					}
				}
			]
		});

		//this.nav.present(prompt);
		prompt.present();
	}

	deleteTodo(todo){
		this.todoService.deleteTodo(todo);
	}

}
