function Task(){

	this.currentlyAddedTask = null;
}

Task.prototype.addTask = function( text ){

	this.currentlyAddedTask = text;
}

Task.prototype.removeTask = function(){

}


window.onload = function(){
	/* Model */
	Task = Backbone.Model.extend({
		defaults: function(){
			return{
				pid: Tasks.nextOrder(),
				title: "Undefined Task",
				date: new Date(),
				done: false
			}
		}
	});

	/* Collection */
	TaskCollection = Backbone.Collection.extend({
		model: Task,
		nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('pid') + 1;
		}
	});

	var Tasks = new TaskCollection;

	/* View */
	var Application = Backbone.View.extend({
		_taskListEl		: $("#todoList"),
		_inputEl		: $('#fieldTask'),

		el: $("#todo"),
		events: {
			"submit #taskForm"		: "formSubmit",
			"click a.delete"		: "removeTask"
		},
		initialize: function(){
			_.bindAll(this, "renderTask");
			this.render();
			Tasks.on('add', this.renderTask, this);
			Tasks.on('remove', this.render, this);
			//Tasks.bind('all', this.showTaskList, this);
		},
		render: function(){
			console.log("render", this);
			this._taskListEl.empty();
			this._taskListEl.append("<ul></ul>");
			if(Tasks.length){
				var self = this;
				_.each(Tasks.models, this.renderTask)
			};
		},
		renderTask: function(item){
			console.log("showTaskList",item);
			this._taskListEl.find('ul').append('<li data-cid="'+item.cid+'" class="'+(item.attributes.done? "done": "")+'"><span>'+ item.attributes.date.getDate() +'/'+(item.attributes.date.getMonth()+1)+ "/"+item.attributes.date.getFullYear()+'</span>'+item.attributes.title+'<a class="delete">[X]</a></li>');
		},
		formSubmit: function(){
			if (!this._inputEl.val()) return;
			this.addTask();
			this._inputEl.val('');
			return false;
		},
		addTask: function(){
			var TL = Tasks.add({title: this.getTaskName()});
			console.log("addTask", TL.models,TL.models[0].attributes);
		},
		getTaskName: function(){
			return this._inputEl.val();
		},
		removeTask: function(e){
			var item = Tasks.getByCid( e.target.parentNode.getAttribute('data-cid') );
			Tasks.remove(item);
			console.log("removeTask", item, e.target.parentNode.getAttribute('data-cid'), Tasks);
		}
	})

	var app = new Application;
}