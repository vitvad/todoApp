describe("ToDo", function(){

	var TEST_TEXT1 = "Kill bill test";

	var taskList;

	beforeEach(function() {
		taskList = new Task();
	});

// test1
	it("should be able to add a task", function() {
		taskList.addTask(TEST_TEXT1);
		expect(taskList.currentlyAddedTask).toEqual(TEST_TEXT1);

		//demonstrates use of custom matcher
		// expect(player).toBePlaying(song);
	});

	/*it("should be able to remove a task", function() {
		Task.addTask(TEST_TEXT1);
		expect(Task.currentlyAddedTask).toEqual(TEST_TEXT1);

		//demonstrates use of custom matcher
		// expect(player).toBePlaying(song);
	});*/
})