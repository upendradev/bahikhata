define(['jquery','underscore', 'backbone','bootstrap','jqueryUI'], function($, _, Backbone){

	$(document).ready(function(){

			var TransactionModel = Backbone.Model.extend({
				urlRoot: '/savemodel',
				defaults:{
					name: 'upendra'
				}

			});

	var txnModel = new TransactionModel;


	var user = Backbone.Model.extend({
				defaults:{
					username: '',
					password: ''
				},
				errors:{

				},
				validate: function(attributes, options){
					this.errors = {};
					if(_.isEmpty(attributes.username))
						this.errors.username = 'Please enter the user name';
					if(_.isEmpty(attributes.password))
						this.errors.password = "Please enter valid password";
					if(!(_.isEmpty(this.errors)))
						return this.errors;


				},
				initialize: function(){
					this.on("invalid", function(model, error) {
					});
				}

			});

	userModel = new user({validate:true});

	

	var view = Backbone.View.extend({
		el: '#main',
		initialize: function(){
			this.username = this.$el.find('input[name=username]');
			this.username = this.$el.find('input[name=password]');
			this.render();
		},
		render: function(){



		},
		events:{

			"click input[name=login]": "login"
		},
		login: function(e){
			e.preventDefault();
			
			this.model.set({'username': this.$el.find('input[name=username]').val(), 'password': this.$el.find('input[name=password]').val()},{validate: true});
			
		//	this.model.validate();
			if(_.isEmpty(this.model.validationError))
				this.$el.find('form').submit();
			else{
				this.$el.find('.error:first').html(this.model.validationError.username);
				this.$el.find('.error:last').html(this.model.validationError.password);
			}

		}

	});

	userView = new view({model: userModel});


	
/*
	var TransCollection = Backbone.Collection.extend({
				url: '/savemodel',
				model: txnModel,

				initialize: function(){
				    this.fetch();
				  }

			});
	var TransactionCollection = new TransCollection;  */
		var path = $('form').data('js');
		var localStorage = null;
		if(window['localStorage'] !== null ) localStorage = window['localStorage'] ;
		if(path != null)
		require(['misc/'+path], function(View){
			var view = new View({model: txnModel});
		});

	 var AppRouter = Backbone.Router.extend({
        routes: {
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        }
    });
    // Initiate the router
    var app_router = new AppRouter;

    app_router.on('route:defaultRoute', function(actions) {
     //   alert(actions);
        $('#'+ actions).show();
    })

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();

	$(function() {
	    $(".datepicker").each(function(index){ 
		    $(this).datepicker({
		      changeMonth: true,
		      changeYear: true
		    });
	   });
	  });


});
});