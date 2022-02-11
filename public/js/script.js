function collapseSidebar(elem){
	const state = elem.data('collapsed');
	const caret = elem.children('i');

	elem.data('collapsed',!state);
	$('#sidenav-main').toggleClass('collapsed');
	$('.main-content').toggleClass('collapsed');

	caret.toggleClass('fa-chevron-circle-left');
	caret.toggleClass('fa-chevron-circle-right');

	setTimeout(function(){
		for(const __chart of __highcharts){
			if(__chart)
				__chart.reflow();
		}
	}, 500);
}

window.addEventListener('load', () => {
	if ($('.masonry').length > 0) {
		new Masonry('.masonry', {
			itemSelector: '.masonry-item',
			columnWidth: '.masonry-sizer',
			percentPosition: true,
		});
	}
});

$(document).ready(function() {
	//~ collapseSidebar($('.collapse-sidebar-toggle'));
});

$(document).ready(function() {
	$('.validate-passwords').click(function(event){
		const password = document.getElementById('password').value;
		const password_confirm = document.getElementById('confirm-password').value;
		const isRequired = $('#password').attr('required');

		if(password != password_confirm){
			event.preventDefault();
			alert('Your passwords do not match.');
			document.getElementById('password').style.borderColor = '#E34234';
			document.getElementById('confirm-password').style.borderColor = '#E34234';
			return false;
		}

		if(password.length < 8 && isRequired){
			event.preventDefault();
			alert('Passwords must be at least 8 characters.');
			document.getElementById('password').style.borderColor = '#E34234';
			document.getElementById('confirm-password').style.borderColor = '#E34234';
			return false;
		}
	});
});

$(document).ready(function() {
	$('.collapse-sidebar-toggle').click(function(){
		collapseSidebar($(this));
	});
});

$(document).ready(function() {
	$('.datatables').DataTable({
		"language": {
			"paginate": {
				"previous": "<<",
				"next": ">>",
			}
		},

		"oLanguage": {
			"sLengthMenu": "<small>Show</small> _MENU_",
		}
	});
});

$(document).ready(async function() {
	$('.timepicker').flatpickr({
		enableTime: true,
		noCalendar: true,
		dateFormat: "H:i",
		time_24hr: true,
		disableMobile: true,
	});
});

$(document).ready(async function() {
	$('.datetimepicker').flatpickr({
		dateFormat:'Y-m-d',
		enableTime: false,
		time_24hr: true,
		disableMobile: true,
	});
});

$(document).ready(async function() {
	$('.datetimepicker').flatpickr({
		dateFormat:'Y-m-d H:i:S',
		enableTime: true,
		time_24hr: true,
		disableMobile: true,
	});
});

$(document).ready(function() {
   $('.select2').select2({
		theme: 'bootstrap4',
	});
});

$(document).ready(function() {
   $('.hide-children-menu').click(function(){
		const id = $(this).data('menu-id');
		const caret = $(this).find('.caret');
		$('.from-parent-' + id).toggle('fast');
		caret.toggleClass('ni-bold-up');
		caret.toggleClass('ni-bold-down');
	});
});
