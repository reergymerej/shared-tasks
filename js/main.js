
var Task = Backbone.Model.extend({
	initialize: function(){
	}
});

var Tasks = Backbone.Collection.extend({
	url: '/Tasks',
	model: Task
});

var TaskSummary = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		var template = _.template( $('#task-summary').html(), {tasks: tasks.toJSON()} );
		this.$el.empty().html(template);
	},
	events: {
		'click button': 'killEvent'
	},
	killEvent: function(ev){
		var taskId = $(ev.currentTarget).attr('name')
		tasks.get(taskId).destroy({
			success: function(model, response){
				console.log(arguments);
			},
			error: function(){
				console.error(arguments);
			}
		});
	}
})

var tasks = new Tasks();
var task;
var summaryView;

$(function(){

	refreshTasks();
	// setInterval(refreshTasks, 1000);

	
	$('#newTask').click(addTask);

	summaryView = new TaskSummary({
		el: $('#summary')
	});
});

function addTask(){
	var taskName = $('#taskName');

	task = new Task({
		name: taskName.val()
	});
	tasks.add(task);

	task.save({}, {
		success: function(){
			console.log(arguments);
			//	update task summary
			summaryView.render();
			taskName.val('');
		},
		error: function(){
			console.log(arguments);
		}
	});
};

function refreshTasks(){
	tasks.fetch({
		success: function(){
			//	update task summary
			summaryView.render();
		}
	});
};