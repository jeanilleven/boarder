$(function() {
	showMessage("You have successfully updated your password.");
});

	function showMessage(s) {
		var m = $("#message");
		m.html(s);

		m.addClass("is-visible");
		setTimeout(function() {
		m.removeClass("is-visible");
		m.addClass("is-hidden");
			setTimeout(function() {
				m.addClass("is-removed");
			}, 2000);
		}, 3000);
	}