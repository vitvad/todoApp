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
var ItemView = Backbone.View.extend({
	template: _.template($('#item-template').html()),

	el: $("#todoList"),
	events: {
		"click a.delete"		: "removeTask",
		"click li"				: "changeStatus"
	},
	initialize: function(){
		_.bindAll(this, "renderTask");
		Tasks.on('add', this.renderTask, this);
		Tasks.on('remove', function(elementWichWasRemoved,ModelCollection,SomeObjectWTF){
			app.render();
		}, this);
		Tasks.on('change', function(){
			console.log('change');
			app.render();
		}, this);
	},
	render: function(item){
		var data = item.toJSON();
		data.cid = item.cid;
		return this.template(data);
	},
	renderTask: function(item){
		console.log("showTaskList",item);
		this.$el.find('ul').append(this.render(item));
	},
	changeStatus: function(e){
		var item = Tasks.getByCid( $(e.target).closest('li').data('cid') );
		console.log('changeStatus', item);
		item.set('done', !item.get('done'));
	},
	removeTask: function(e){
		e.stopPropagation();
		var item = Tasks.getByCid( e.target.parentNode.getAttribute('data-cid') );
		Tasks.remove(item);
		console.log("removeTask", item, e.target.parentNode.getAttribute('data-cid'), Tasks);
	}
});

var InputView = Backbone.View.extend({
	_inputEl: $('#fieldTask'),

	el: $("#taskForm").parent(),
	events: {
		"submit #taskForm": "formSubmit"
	},
	formSubmit: function(){
		if (!this._inputEl.val()) return;
		this.addTask();
		this._inputEl.val('');
		return false;
	},
	addTask: function(){
		var TC = Tasks.add({title: this.getTaskName()});
		console.log("addTask", TC.models,TC.models[0].attributes);
	},
	getTaskName: function(){
		return this._inputEl.val();
	}
});

var Application = Backbone.View.extend({
	_view: null,
	_input: null,

	initialize: function(){
		//on application initialization - init Input view/control
		this._input = new InputView();
		this._view = new ItemView();
		this.render();
	},
	render: function(){
		console.log("render", this);
		this._view.$el.empty();
		this._view.$el.append("<ul></ul>");
		if(Tasks.length){
			var self = this;
			_.each(Tasks.models, this._view.renderTask)
		};
	}
});

console.log('load');
var app = new Application();
