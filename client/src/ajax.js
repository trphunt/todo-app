/* global $ */
$(document).ready(function() {
	 // Get All List Items

	 $.get('http://localhost:3000/todos', function(todos) {
	 	todos.forEach(function(todo){
	 		$('#todo-list').append(
	 			`
	 			<li class="list-group-item">
	 				<form action="/todos/${todo._id}" method="POST" class="edit-item-form">
	 					<div class="form-group">
	 						<label for="${todo._id}">Item Text</label>
	 						<input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
	 					</div>
	 					<button class="btn btn-primary">Update Item</button>
	 				</form>
	 				<span class="lead">
	 					${todo.text}
	 				</span>
	 				<div class="pull-right">
	 					<button class="btn btn-sm btn-warning edit-button">Edit</button>
	 					<form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
	 						<button type="submit" class="btn btn-sm btn-danger">Delete</button>
	 					</form>
	 				</div>
	 				<div class="clearfix"></div>
	 			</li>
	 			`
	 			);
	 	});
	 });
	
	// Create To Do Item
	 
	$('#new-todo-form').submit(function(e) {
	  e.preventDefault();
	  
	  var toDoItem = $(this).serialize();
	  
	  $.post('http://localhost:3000/todos', toDoItem, function(data) {
	    $('#todo-list').append(
	     `
	      <li class="list-group-item">
	        <form action="/todos/${data._id}" method="POST" class="edit-item-form">
		        <div class="form-group">
			        <label for="${data._id}">Item Text</label>
			        <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
		        </div>
		        <button class="btn btn-primary">Update Item</button>
	        </form>
			<span class="lead">
			    ${data.text}
			</span>
			<div class="pull-right">
				<button class="btn btn-sm btn-warning edit-button">Edit</button>
				<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
					<button type="submit" class="btn btn-sm btn-danger">Delete</button>
				</form>
			</div>
			<div class="clearfix"></div>
		  </li>
	     `
	      );
	    $('#new-todo-form').find('.form-control').val('');  
	  });
	});
	
	$('#todo-list').on('click', '.edit-button', function() {
	    $(this).parent().siblings('.edit-item-form').toggle();
	});
	
	$('#todo-list').on('submit', '.edit-item-form', function(e) {
	    e.preventDefault();
	    var toDoItem = $(this).serialize();
	    var actionUrl = 'http://localhost:3000' + $(this).attr('action');
	    var $originalItem = $(this).parent('.list-group-item');
	    $.ajax({
	        url: actionUrl,
	        data: toDoItem,
	        type: 'PUT',
	        originalItem: $originalItem,
	        success: function(data) {
	            this.originalItem.html(
	                `
	                <form action="/todos/${data._id}" method="POST" class="edit-item-form">
						<div class="form-group">
			                <label for="${data._id}">Item Text</label>
			                <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
						</div>
						<button class="btn btn-primary">Update Item</button>
					</form>
					<span class="lead">
						${data.text}
					</span>
					<div class="pull-right">
						<button class="btn btn-sm btn-warning edit-button">Edit</button>
						<form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
						</form>
					</div>
					<div class="clearfix"></div>
	                `
	            );
	        }
	    });
	});
	
	$('#todo-list').on('submit', '.delete-item-form', function(e) {
	    e.preventDefault();
	    var confirmResponse = confirm('Are you sure?');
	    if(confirmResponse) {
	        var actionUrl = 'http://localhost:3000' + $(this).attr('action');
	        var $itemToDelete = $(this).closest('.list-group-item');
	        $.ajax({
	            url: actionUrl,
	            type: 'DELETE',
	            itemToDelete: $itemToDelete,
	            success: function(data) {
	                this.itemToDelete.remove();
	            }
	        });
	    } else {
	        $(this).find('button').blur();
	    }
	});
	
	// Search functionality
	
	$('#search').on('input', function(e) {
		e.preventDefault();
	  $.get(`/todos?keyword=${encodeURIComponent(e.target.value)}`, function(data) {
			$('#todo-list').html('');
			data.forEach(function(todo){
				$('#todo-list').append(
					`
					<li class="list-group-item">
						<form action="/todos/${todo._id}" method="POST" class="edit-item-form">
							<div class="form-group">
								<label for="${todo._id}">Item Text</label>
								<input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
							</div>
							<button class="btn btn-primary">Update Item</button>
						</form>
						<span class="lead">
							${todo.text}
						</span>
						<div class="pull-right">
							<button class="btn btn-sm btn-warning edit-button">Edit</button>
							<form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
								<button type="submit" class="btn btn-sm btn-danger">Delete</button>
							</form>
						</div>
						<div class="clearfix"></div>
					</li>
					`
					);
			});
		});
	});
});
