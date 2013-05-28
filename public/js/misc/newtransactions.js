define(['jquery','underscore', 'backbone'], function($, _, Backbone){

	var AppView = Backbone.View.extend({
			el: $('#tab2'),
			initialize: function(){
				this.render();
			},
			render: function(){
				this.listenTo(this.model, 'change', this.render);
			//	alert(this.model.get('name'));
					
			},
			events:{
				"click a#addTransaction": "addTransaction",
				"click #submit": "submitInformation"
			},
			addTransaction: function(e){
				this.model.save(null, {
				    success: function (model, response) {
				        console.log("success");
				    },
				    error: function (model, response) {
				        console.log("error");
				    }
				});
				var elem = e.target;
				e.preventDefault();
				$('table.edit tfoot').hide();
				var tr = $('<tr> </tr>');
				var count = this.$el.find('table.edit tr').length - 2 ;
				$(tr).append($('<td> </td>').append('<input name="date_' +count+'" type=text class="date small datepicker">'));
				tr.append(
					$('<td> </td>').
						append('<input name="desc_' +count+'" type=text style="width:225px;" class="desc">')
					);
				tr.append(
					$('<td> </td>').
						append('<input name="amount_' +count+'" type=text class="amount small">')
					);
				tr.append(
					$('<td> </td>').
						append('<input name="source_' +count+'" type=text class="source">')
					);
				$('table.edit tbody').append(tr);

				$(function() {
				    $(".datepicker").each(function(index){ 
				    //	alert(index);
					    $(this).datepicker({
					      changeMonth: true,
					      changeYear: true
					    });
				   });
				  });


			},
			submitInformation: function(e){
				e.preventDefault();
				var elem = e.target;
				$('.date').each(function(index){
					localStorage.setItem($(this).attr('name'), $(this).val() )
				});
				$('.desc').each(function(index){
					localStorage.setItem($(this).attr('desc'), $(this).val() )
				});
				$('.amount').each(function(index){
					localStorage.setItem($(this).attr('amount'), $(this).val() )
				});
				$('.source').each(function(index){
					localStorage.setItem($(this).attr('source'), $(this).val() )
				});
				
				alert('Transaction is successfully added')	;
			}


	});
	return AppView;

});
